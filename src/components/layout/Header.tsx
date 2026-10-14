import React from 'react';
import { NavView } from './Sidebar';

interface HeaderProps {
  currentView: NavView;
  totalChunks: number;
  averageMastery: number;
  onQuickAction: (action: 'tutor' | 'quiz') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  totalChunks,
  averageMastery,
  onQuickAction
}) => {
  const titles: Record<NavView, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Learning Overview & Mastery Dashboard',
      subtitle: 'Real-time Bayesian Knowledge Tracing metrics across uploaded course materials'
    },
    materials: {
      title: 'Multimodal Course Materials',
      subtitle: 'PDFs, PowerPoint slides, and timestamped lecture video transcripts with source chunking'
    },
    knowledgeGraph: {
      title: 'Concept & Prerequisite Knowledge Graph',
      subtitle: 'Interactive map of course topics, prerequisite pathways, and supporting source nodes'
    },
    tutor: {
      title: 'Source-Grounded AI Tutor',
      subtitle: 'Strictly cited conversational learning with verified evidence and honest query refusal'
    },
    quiz: {
      title: 'Adaptive Assessment Studio',
      subtitle: 'Dynamic quiz generation calibrated to learner mastery with deterministic answer verification'
    },
    progress: {
      title: 'Bayesian Knowledge Tracing (BKT) Model',
      subtitle: 'Live mathematical parameter updates P(L), slip/guess rates, and explainable recommendations'
    },
    evaluation: {
      title: 'RAGAS & System Evaluation Lab',
      subtitle: 'Synthetic benchmark testing for Faithfulness, Relevancy, Precision, Recall, and simulated students'
    },
    planner: {
      title: 'Adaptive Revision & Study Planner',
      subtitle: 'Spaced repetition schedule and smart flashcard generator targeting weak concepts'
    }
  };

  const current = titles[currentView] || { title: 'LearnSphere AI', subtitle: 'Personalized Multimodal Tutor' };

  return (
    <header className="h-18 bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          {current.title}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {current.subtitle}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Knowledge Base Status Pill */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-lg text-xs">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="font-semibold text-slate-700">{totalChunks} Chunks</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">Avg Mastery: <strong className="text-indigo-600 font-bold">{Math.round(averageMastery * 100)}%</strong></span>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onQuickAction('tutor')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Ask Tutor
          </button>
          <button
            onClick={() => onQuickAction('quiz')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Take Quiz
          </button>
        </div>
      </div>
    </header>
  );
};
