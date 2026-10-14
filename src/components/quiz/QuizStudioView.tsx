import React, { useState, useEffect } from 'react';
import { Question, TopicMastery, Citation, QuestionDifficulty, QuizSession } from '../../types';
import { selectAdaptiveQuestions } from '../../services/bktEngine';

interface QuizStudioViewProps {
  questions: Question[];
  masteryMap: Record<string, TopicMastery>;
  onRecordResponse: (question: Question, isCorrect: boolean, timeSpent: number) => void;
  onOpenCitation: (citation: Citation) => void;
  targetTopic?: string;
}

export const QuizStudioView: React.FC<QuizStudioViewProps> = ({
  questions,
  masteryMap,
  onRecordResponse,
  onOpenCitation,
  targetTopic
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(targetTopic || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'Adaptive'>('Adaptive');
  const [isTimed, setIsTimed] = useState<boolean>(false);
  const [sessionActive, setSessionActive] = useState<boolean>(false);

  // Active quiz state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set());

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (sessionActive && isTimed && !hasSubmitted && !isFinished) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            handleAnswerSubmit('TIMEOUT');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, isTimed, hasSubmitted, isFinished]);

  const handleStartQuiz = () => {
    let pool = [...questions];
    if (selectedTopic !== 'all') {
      pool = pool.filter(q => q.topic.toLowerCase().includes(selectedTopic.toLowerCase()));
    }

    // Select questions adaptively
    const chosen = selectAdaptiveQuestions(pool.length > 0 ? pool : questions, masteryMap, attemptedIds, 3);
    setActiveQuestions(chosen);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setSessionScore(0);
    setTimerSeconds(45);
    setIsFinished(false);
    setSessionActive(true);
  };

  const handleAnswerSubmit = (overrideAnswer?: string) => {
    if (hasSubmitted) return;
    const answer = overrideAnswer !== undefined ? overrideAnswer : selectedAnswer;
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    const isCorrect = String(answer).trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();

    if (isCorrect) {
      setSessionScore(prev => prev + 1);
    }

    setHasSubmitted(true);
    setAttemptedIds(prev => new Set(prev).add(currentQ.id));

    // Record response in BKT engine
    onRecordResponse(currentQ, isCorrect, isTimed ? 45 - timerSeconds : 15);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setHasSubmitted(false);
      setTimerSeconds(45);
    } else {
      setIsFinished(true);
    }
  };

  const currentQ = activeQuestions[currentIndex];
  const topicsList = ['all', 'Optimization', 'Backpropagation', 'Activation Functions', 'Attention Mechanisms', 'Transformers'];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {!sessionActive || isFinished ? (
        /* Quiz Configuration or Post-Assessment Summary */
        <div className="space-y-6">
          {isFinished && (
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Assessment Complete</span>
                  <h3 className="text-2xl font-black mt-1">
                    Score: {sessionScore} / {activeQuestions.length} ({Math.round((sessionScore / activeQuestions.length) * 100)}%)
                  </h3>
                </div>
                <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-3xl font-bold">
                  {sessionScore === activeQuestions.length ? '🎯 100%' : '📈 Keep Going'}
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/10">
                <strong className="text-emerald-300 font-semibold">BKT Parameter Updates Applied: </strong>
                Your response accuracy directly recalculated the latent mastery probabilities P(L) for tested topics. Check the BKT Learning Progress tab to inspect the Bayesian transition shifts.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleStartQuiz}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Start Follow-up Adaptive Quiz
                </button>
                <button
                  onClick={() => setSessionActive(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
                >
                  Change Topic / Difficulty
                </button>
              </div>
            </div>
          )}

          {/* Quiz Launch Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Calibrated Assessment Studio
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Configure Practice Session
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Questions are synthesized directly from retrieved course passages and verified deterministically against source citations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Topic</label>
                <select
                  value={selectedTopic}
                  onChange={e => setSelectedTopic(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {topicsList.map(t => (
                    <option key={t} value={t}>
                      {t === 'all' ? 'All Topics (Adaptive Mix)' : t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Difficulty Calibration</label>
                <select
                  value={selectedDifficulty}
                  onChange={e => setSelectedDifficulty(e.target.value as any)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Adaptive">BKT Adaptive (Auto-Calibrated)</option>
                  <option value="Easy">Easy (Foundational Recall)</option>
                  <option value="Medium">Medium (Synthesis & Calculus)</option>
                  <option value="Hard">Hard (Edge Cases & Architecture)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Timed Examination Mode</label>
                <button
                  type="button"
                  onClick={() => setIsTimed(!isTimed)}
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border font-semibold flex items-center justify-between transition ${
                    isTimed
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{isTimed ? '⏱ Timed (45s / Question)' : 'Untimed Practice'}</span>
                  <span className={`w-3 h-3 rounded-full ${isTimed ? 'bg-blue-600' : 'bg-slate-300'}`} />
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleStartQuiz}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2"
              >
                <span>Launch Calibrated Assessment</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Active Question Display */
        currentQ && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md space-y-6">
            {/* Question Header & Progress Bar */}
            <div className="space-y-3 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                    Question {currentIndex + 1} of {activeQuestions.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {currentQ.topic} • {currentQ.subtopic}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                    currentQ.difficulty === 'Easy'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : currentQ.difficulty === 'Medium'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}>
                    {currentQ.difficulty}
                  </span>

                  {isTimed && (
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                      timerSeconds <= 10 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-700'
                    }`}>
                      ⏱ {timerSeconds}s
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base font-bold text-slate-900 leading-snug">
              {currentQ.questionText}
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQ.options?.map((opt, optIdx) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = String(opt).trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();

                let optionClass = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';
                if (hasSubmitted) {
                  if (isCorrect) {
                    optionClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionClass = 'bg-rose-50 border-rose-400 text-rose-900 font-medium';
                  } else {
                    optionClass = 'bg-slate-50/50 text-slate-400 border-slate-100';
                  }
                } else if (isSelected) {
                  optionClass = 'bg-blue-50 border-blue-500 text-blue-900 font-semibold ring-2 ring-blue-500/20';
                }

                return (
                  <button
                    key={optIdx}
                    disabled={hasSubmitted}
                    onClick={() => setSelectedAnswer(opt)}
                    className={`w-full p-4 rounded-xl border text-left text-xs transition flex items-center justify-between ${optionClass}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-white border border-current/20 flex items-center justify-center font-mono font-bold shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {hasSubmitted && isCorrect && (
                      <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                        ✓ Correct Key
                      </span>
                    )}
                    {hasSubmitted && isSelected && !isCorrect && (
                      <span className="text-rose-600 font-bold text-xs flex items-center gap-1">
                        ✕ Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Immediate Verified Feedback Banner */}
            {hasSubmitted && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Deterministic Verification & Citation
                  </span>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                    {currentQ.verificationMethod}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentQ.explanation}
                </p>

                {currentQ.citation && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onOpenCitation(currentQ.citation)}
                      className="text-blue-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Inspect Supporting Source [{currentQ.citation.materialTitle}, {currentQ.citation.locationString}]</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                    <span className="text-slate-400 text-[11px] font-mono">
                      Citation Match: {Math.round(currentQ.citation.confidenceScore * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                LearnSphere Adaptive Calibration Engine
              </span>

              {!hasSubmitted ? (
                <button
                  disabled={!selectedAnswer}
                  onClick={() => handleAnswerSubmit()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <span>{currentIndex + 1 < activeQuestions.length ? 'Next Question' : 'Complete Assessment'}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};
