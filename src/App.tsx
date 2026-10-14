import React, { useState, useEffect } from 'react';
import {
  StudyMaterial,
  ConceptNode,
  Question,
  TopicMastery,
  Citation
} from './types';
import {
  loadStoredMaterials,
  saveStoredMaterials,
  loadStoredConcepts,
  loadStoredQuestions,
  loadStoredMastery,
  saveStoredMastery,
  resetToDemoCourse,
  saveQuizSession
} from './services/storageService';
import { updateTopicMastery } from './services/bktEngine';

import { Sidebar, NavView } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { MaterialsView } from './components/materials/MaterialsView';
import { ConceptGraphView } from './components/knowledgeGraph/ConceptGraphView';
import { TutorView } from './components/tutor/TutorView';
import { QuizStudioView } from './components/quiz/QuizStudioView';
import { LearnerProgressView } from './components/progress/LearnerProgressView';
import { EvaluationLabView } from './components/evaluation/EvaluationLabView';
import { StudyPlannerView } from './components/planner/StudyPlannerView';
import { CitationModal } from './components/materials/CitationModal';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => loadStoredMaterials());
  const [concepts, setConcepts] = useState<ConceptNode[]>(() => loadStoredConcepts());
  const [questions, setQuestions] = useState<Question[]>(() => loadStoredQuestions());
  const [masteryMap, setMasteryMap] = useState<Record<string, TopicMastery>>(() => loadStoredMastery());

  // Interactive modal & navigation flow states
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [preloadedTutorQuery, setPreloadedTutorQuery] = useState<string>('');
  const [targetQuizTopic, setTargetQuizTopic] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState<number>(0);
  const [quizSessionsCount, setQuizSessionsCount] = useState<number>(1);

  // Sync mastery updates to local storage
  useEffect(() => {
    saveStoredMastery(masteryMap);
  }, [masteryMap]);

  // Sync materials updates
  useEffect(() => {
    saveStoredMaterials(materials);
  }, [materials]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddMaterial = (newMat: StudyMaterial) => {
    setMaterials(prev => [newMat, ...prev]);
    showToast(`Ingested ${newMat.title} with ${newMat.chunks.length} chunks.`);
  };

  const handleRecordResponse = (question: Question, isCorrect: boolean, timeSpent: number) => {
    setTotalQuestionsAnswered(prev => prev + 1);

    const existingMastery = masteryMap[question.topic] || {
      topic: question.topic,
      pMastery: 0.30,
      totalAttempts: 0,
      correctAttempts: 0,
      accuracy: 0,
      lastPracticed: Date.now(),
      status: 'Needs Attention' as const,
      recommendedAction: 'Start practice.',
      bktParams: { pL0: 0.3, pT: 0.15, pG: 0.2, pS: 0.1 }
    };

    const updated = updateTopicMastery(existingMastery, isCorrect);
    setMasteryMap(prev => ({ ...prev, [question.topic]: updated }));

    const delta = (updated.pMastery - existingMastery.pMastery).toFixed(2);
    const sign = Number(delta) >= 0 ? `+${delta}` : delta;
    showToast(`BKT Update for ${question.topic}: P(L) ${updated.pMastery} (${sign})`);
  };

  const handleUpdateTopicDirectly = (topic: string, isCorrect: boolean) => {
    const existing = masteryMap[topic] || {
      topic,
      pMastery: 0.30,
      totalAttempts: 0,
      correctAttempts: 0,
      accuracy: 0,
      lastPracticed: Date.now(),
      status: 'Needs Attention' as const,
      recommendedAction: 'Practicing.',
      bktParams: { pL0: 0.3, pT: 0.15, pG: 0.2, pS: 0.1 }
    };

    const updated = updateTopicMastery(existing, isCorrect);
    setMasteryMap(prev => ({ ...prev, [topic]: updated }));
    showToast(`BKT ${isCorrect ? 'Correct Step' : 'Slip'}: ${topic} P(L) now ${updated.pMastery}`);
  };

  const handleTriggerDemoAction = (action: 'ask_supported' | 'ask_unsupported' | 'adaptive_quiz') => {
    if (action === 'ask_supported') {
      setPreloadedTutorQuery('Why divide by sqrt(d_k) in Scaled Dot-Product Attention?');
      setCurrentView('tutor');
    } else if (action === 'ask_unsupported') {
      setPreloadedTutorQuery('How does quantum entanglement accelerate BERT pretraining in superconducting qubits?');
      setCurrentView('tutor');
    } else if (action === 'adaptive_quiz') {
      setTargetQuizTopic('all');
      setCurrentView('quiz');
    }
  };

  const handleLaunchTopicQuiz = (topic: string) => {
    setTargetQuizTopic(topic);
    setCurrentView('quiz');
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all course materials, quiz logs, and BKT mastery to pristine demo state?')) {
      resetToDemoCourse();
      setMaterials(loadStoredMaterials());
      setConcepts(loadStoredConcepts());
      setQuestions(loadStoredQuestions());
      setMasteryMap(loadStoredMastery());
      setTotalQuestionsAnswered(0);
      setQuizSessionsCount(1);
      setCurrentView('dashboard');
      showToast('Demo course pack reloaded successfully.');
    }
  };

  const allChunks = materials.flatMap(m => m.chunks);
  const masteriesList = Object.values(masteryMap);
  const avgMastery = masteriesList.length > 0
    ? masteriesList.reduce((acc, m) => acc + m.pMastery, 0) / masteriesList.length
    : 0.3;
  const weakTopicsCount = masteriesList.filter(m => m.pMastery < 0.50).length;

  return (
    <div className="flex h-screen bg-slate-100 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      {/* Dark Navy Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        onResetDemo={handleResetDemo}
        materialsCount={materials.length}
        weakTopicsCount={weakTopicsCount}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentView={currentView}
          totalChunks={allChunks.length}
          averageMastery={avgMastery}
          onQuickAction={action => setCurrentView(action)}
        />

        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              materials={materials}
              masteryMap={masteryMap}
              quizCount={quizSessionsCount}
              totalQuestionsAttempted={totalQuestionsAnswered}
              onNavigate={setCurrentView}
              onTriggerDemoAction={handleTriggerDemoAction}
            />
          )}

          {currentView === 'materials' && (
            <MaterialsView
              materials={materials}
              onAddMaterial={handleAddMaterial}
              onOpenCitation={setActiveCitation}
            />
          )}

          {currentView === 'knowledgeGraph' && (
            <ConceptGraphView
              concepts={concepts}
              masteryMap={masteryMap}
              materials={materials}
              onOpenCitation={setActiveCitation}
              onLaunchTopicQuiz={handleLaunchTopicQuiz}
            />
          )}

          {currentView === 'tutor' && (
            <TutorView
              chunks={allChunks}
              onOpenCitation={setActiveCitation}
              preloadedQuery={preloadedTutorQuery}
              onClearPreloadedQuery={() => setPreloadedTutorQuery('')}
            />
          )}

          {currentView === 'quiz' && (
            <QuizStudioView
              questions={questions}
              masteryMap={masteryMap}
              onRecordResponse={handleRecordResponse}
              onOpenCitation={setActiveCitation}
              targetTopic={targetQuizTopic}
            />
          )}

          {currentView === 'progress' && (
            <LearnerProgressView
              masteryMap={masteryMap}
              onUpdateTopicDirectly={handleUpdateTopicDirectly}
              onLaunchTopicQuiz={handleLaunchTopicQuiz}
            />
          )}

          {currentView === 'evaluation' && (
            <EvaluationLabView chunks={allChunks} />
          )}

          {currentView === 'planner' && (
            <StudyPlannerView
              masteryMap={masteryMap}
              onOpenCitation={setActiveCitation}
              onLaunchTopicQuiz={handleLaunchTopicQuiz}
            />
          )}
        </main>
      </div>

      {/* Floating Citation Inspector Modal */}
      <CitationModal
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
