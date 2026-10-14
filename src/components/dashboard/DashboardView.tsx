import React from 'react';
import { StudyMaterial, TopicMastery } from '../../types';
import { NavView } from '../layout/Sidebar';

interface DashboardViewProps {
  materials: StudyMaterial[];
  masteryMap: Record<string, TopicMastery>;
  quizCount: number;
  totalQuestionsAttempted: number;
  onNavigate: (view: NavView) => void;
  onTriggerDemoAction: (action: 'ask_supported' | 'ask_unsupported' | 'adaptive_quiz') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  materials,
  masteryMap,
  quizCount,
  totalQuestionsAttempted,
  onNavigate,
  onTriggerDemoAction
}) => {
  const masteries = Object.values(masteryMap);
  const totalChunks = materials.reduce((acc, m) => acc + m.chunks.length, 0);

  const avgMastery = masteries.length > 0
    ? masteries.reduce((acc, m) => acc + m.pMastery, 0) / masteries.length
    : 0.3;

  // Find weakest topic
  const sortedByMastery = [...masteries].sort((a, b) => a.pMastery - b.pMastery);
  const weakest = sortedByMastery[0];
  const strongest = sortedByMastery[sortedByMastery.length - 1];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome & Recommendation Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs px-3 py-1 rounded-full font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              Active Course: CS 229 Deep Learning Architectures
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Personalized Mastery Engine is Online
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {weakest ? weakest.recommendedAction : 'Ready to start learning. Take an adaptive quiz or ask the tutor questions to initialize your learner profile.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('quiz')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <span>Practice Weakest Topic</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button
              onClick={() => onNavigate('knowledgeGraph')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition"
            >
              View Concept Graph
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Materials Ingested</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{materials.length}</span>
            <span className="text-xs text-slate-500">sources ({totalChunks} chunks)</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">PDF, Slides, Timestamped Video, Notes</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average BKT Mastery</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600">{Math.round(avgMastery * 100)}%</span>
            <span className="text-xs text-slate-500">P(L) probability</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Calculated via Bayesian Knowledge Tracing</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quizzes Completed</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{quizCount}</span>
            <span className="text-xs text-slate-500">sessions</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">{totalQuestionsAttempted} verified items answered</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Priority Topic</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 truncate">
            <span className="text-xl font-extrabold text-amber-700 truncate block">
              {weakest ? weakest.topic : 'None'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {weakest ? `Mastery: ${Math.round(weakest.pMastery * 100)}%` : 'All topics balanced'}
          </div>
        </div>
      </div>

      {/* Guided Hackathon Judge Flow */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-blue-400">⚡</span> Hackathon Demonstration Quick Actions
            </h3>
            <p className="text-xs text-slate-400">
              Test the core evaluation criteria with one click:
            </p>
          </div>
          <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded border border-blue-500/30">
            Track D Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onTriggerDemoAction('ask_supported')}
            className="p-4 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 text-left transition group"
          >
            <div className="text-xs font-bold text-blue-400 mb-1 group-hover:translate-x-0.5 transition-transform">
              1. Grounded Question & Citation →
            </div>
            <div className="text-sm font-semibold text-slate-200">
              "Why divide by sqrt(d_k) in attention?"
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Tests passage retrieval, citation generation to Slide 5, and excerpt modal.
            </div>
          </button>

          <button
            onClick={() => onTriggerDemoAction('ask_unsupported')}
            className="p-4 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 text-left transition group"
          >
            <div className="text-xs font-bold text-amber-400 mb-1 group-hover:translate-x-0.5 transition-transform">
              2. Query Refusal & Anti-Hallucination →
            </div>
            <div className="text-sm font-semibold text-slate-200">
              "Explain quantum teleportation in BERT"
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Demonstrates refusal when materials lack evidence, avoiding hallucination.
            </div>
          </button>

          <button
            onClick={() => onTriggerDemoAction('adaptive_quiz')}
            className="p-4 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 text-left transition group"
          >
            <div className="text-xs font-bold text-emerald-400 mb-1 group-hover:translate-x-0.5 transition-transform">
              3. Adaptive Assessment & BKT Update →
            </div>
            <div className="text-sm font-semibold text-slate-200">
              Take Calibrated Quiz on Weak Topics
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Verifies mathematical answer checking and live BKT probability updates.
            </div>
          </button>
        </div>
      </div>

      {/* Topic Mastery Distribution */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Topic Knowledge Mastery Breakdown</h3>
            <p className="text-xs text-slate-500">Calculated using Bayesian Knowledge Tracing with Slip P(S)=0.10 and Guess P(G)=0.20</p>
          </div>
          <button
            onClick={() => onNavigate('progress')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            View BKT Formula & Math →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {masteries.map(topicItem => {
            const pct = Math.round(topicItem.pMastery * 100);
            const statusColors = {
              'Mastered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
              'Practicing': 'bg-blue-50 text-blue-700 border-blue-200',
              'Needs Attention': 'bg-amber-50 text-amber-700 border-amber-200'
            };

            const barColors = {
              'Mastered': 'bg-emerald-500',
              'Practicing': 'bg-blue-600',
              'Needs Attention': 'bg-amber-500'
            };

            return (
              <div key={topicItem.topic} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">{topicItem.topic}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${statusColors[topicItem.status]}`}>
                    {topicItem.status}
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${barColors[topicItem.status]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>P(L): <strong className="text-slate-700">{topicItem.pMastery}</strong></span>
                  <span>Accuracy: <strong className="text-slate-700">{Math.round(topicItem.accuracy * 100)}%</strong> ({topicItem.correctAttempts}/{topicItem.totalAttempts})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
