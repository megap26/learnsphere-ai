import React, { useState } from 'react';
import { TopicMastery, Citation } from '../../types';

interface StudyPlannerViewProps {
  masteryMap: Record<string, TopicMastery>;
  onOpenCitation: (citation: Citation) => void;
  onLaunchTopicQuiz: (topic: string) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  masteryMap,
  onOpenCitation,
  onLaunchTopicQuiz
}) => {
  const [examDaysLeft, setExamDaysLeft] = useState<number>(14);
  const [dailyHours, setDailyHours] = useState<number>(1.5);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const masteries = Object.values(masteryMap);
  const weakTopics = masteries.filter(m => m.pMastery < 0.65).sort((a, b) => a.pMastery - b.pMastery);

  // Flashcards synthesized from course pack
  const flashcards = [
    {
      topic: 'Optimization',
      front: 'Why does an excessively large learning rate η cause divergence?',
      back: 'Large parameter updates overshoot the local minima valley, stepping into steep uphill gradients that cause exponential loss explosion.',
      citation: {
        id: 'fc-cit-1',
        materialId: 'mat-pdf-deeplearning',
        materialTitle: 'Foundations of Deep Neural Networks',
        materialType: 'pdf' as const,
        locationString: 'Page 14, ¶2',
        excerpt: 'If η is excessively large, updates overshoot the minimum and may diverge.',
        confidenceScore: 0.98
      }
    },
    {
      topic: 'Backpropagation',
      front: 'State the multivariate chain rule for hidden layer weight gradient ∂L/∂Wij.',
      back: '∂L/∂Wij = (∂L/∂aj) * (∂aj/∂zj) * (∂zj/∂Wij), propagating the error signal δj backwards through layer weights.',
      citation: {
        id: 'fc-cit-2',
        materialId: 'mat-pdf-deeplearning',
        materialTitle: 'Foundations of Deep Neural Networks',
        materialType: 'pdf' as const,
        locationString: 'Page 28, ¶3',
        excerpt: 'By applying the multivariate chain rule: ∂L/∂Wij = (∂L/∂aj) * (∂aj/∂zj) * (∂zj/∂Wij)...',
        confidenceScore: 0.99
      }
    },
    {
      topic: 'Attention Mechanisms',
      front: 'Why is 1/sqrt(d_k) scaling applied in Scaled Dot-Product Attention?',
      back: 'To prevent large dot product magnitudes from pushing the softmax into regions with vanishingly small gradients.',
      citation: {
        id: 'fc-cit-3',
        materialId: 'mat-slides-transformers',
        materialTitle: 'Lecture 07: Attention Mechanisms',
        materialType: 'slides' as const,
        locationString: 'Slide 5',
        excerpt: 'The scaling factor 1/sqrt(d_k) prevents the dot products from growing excessively large in high dimensions...',
        confidenceScore: 0.97
      }
    },
    {
      topic: 'Activation Functions',
      front: 'What is the maximum derivative of the sigmoid function σ(z)?',
      back: '0.25 at z = 0. In deep networks, multiplying numbers <= 0.25 across layers causes vanishing gradients.',
      citation: {
        id: 'fc-cit-4',
        materialId: 'mat-pdf-deeplearning',
        materialTitle: 'Foundations of Deep Neural Networks',
        materialType: 'pdf' as const,
        locationString: 'Page 42, ¶1',
        excerpt: 'maximum sigmoid derivative is 0.25 at z=0...',
        confidenceScore: 0.99
      }
    }
  ];

  const currentCard = flashcards[activeCardIndex];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Schedule Configuration Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Personalized Spaced Repetition Planner
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Exam Target & Calibrated Study Timeline
          </h3>
          <p className="text-xs text-slate-500">
            Dynamically shifts revision hours toward topics with lowest Bayesian Knowledge Tracing scores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-2">Days Until Midterm / Final Exam</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="60"
                value={examDaysLeft}
                onChange={e => setExamDaysLeft(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-bold font-mono text-blue-600 bg-white px-3 py-1 rounded border border-slate-200">
                {examDaysLeft} Days
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-2">Available Daily Study Time</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.5"
                max="6"
                step="0.5"
                value={dailyHours}
                onChange={e => setDailyHours(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-bold font-mono text-indigo-600 bg-white px-3 py-1 rounded border border-slate-200">
                {dailyHours} Hours / Day
              </span>
            </div>
          </div>
        </div>

        {/* Generated Schedule Timeline */}
        <div className="pt-2 space-y-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Generated Revision Roadmap (Total: {Math.round(examDaysLeft * dailyHours)} Study Hours)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {weakTopics.slice(0, 3).map((w, idx) => (
              <div key={w.topic} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                  <span>Phase {idx + 1}: {w.topic}</span>
                  <span className="font-mono">{Math.round(examDaysLeft * dailyHours * 0.4 / (idx + 1))}h allocated</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Focus on {w.recommendedAction}
                </p>
                <button
                  onClick={() => onLaunchTopicQuiz(w.topic)}
                  className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                >
                  Start Practice Session →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Active-Recall Flashcards */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Active Recall Deck
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Source-Cited Concept Flashcards ({activeCardIndex + 1} / {flashcards.length})
            </h3>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsFlipped(false);
                setActiveCardIndex(prev => (prev > 0 ? prev - 1 : flashcards.length - 1));
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold"
            >
              Previous
            </button>
            <button
              onClick={() => {
                setIsFlipped(false);
                setActiveCardIndex(prev => (prev < flashcards.length - 1 ? prev + 1 : 0));
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold"
            >
              Next
            </button>
          </div>
        </div>

        {/* Interactive Flip Card */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`min-h-[220px] rounded-2xl p-8 cursor-pointer border-2 transition-all duration-300 flex flex-col justify-between select-none ${
            isFlipped
              ? 'bg-slate-900 text-white border-blue-500 shadow-xl'
              : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-blue-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
              isFlipped ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
            }`}>
              {currentCard.topic}
            </span>
            <span className={`text-[11px] font-semibold ${isFlipped ? 'text-slate-400' : 'text-slate-400'}`}>
              {isFlipped ? 'Answer (Click to Flip Back)' : 'Question (Click to Reveal Answer)'}
            </span>
          </div>

          <div className="my-6 text-center text-base md:text-lg font-bold leading-relaxed px-4">
            {isFlipped ? currentCard.back : currentCard.front}
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-current/10">
            {isFlipped ? (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onOpenCitation(currentCard.citation);
                }}
                className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Inspect Citation [{currentCard.citation.materialTitle}, {currentCard.citation.locationString}]</span>
              </button>
            ) : (
              <span className="text-slate-400 text-[11px]">Click card to test recall</span>
            )}
            <span className="font-mono text-slate-400 text-[11px]">Card {activeCardIndex + 1} of {flashcards.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
