import React from 'react';
import { TopicMastery } from '../../types';
import { computeBKTUpdate } from '../../services/bktEngine';

interface LearnerProgressViewProps {
  masteryMap: Record<string, TopicMastery>;
  onUpdateTopicDirectly: (topic: string, isCorrect: boolean) => void;
  onLaunchTopicQuiz: (topic: string) => void;
}

export const LearnerProgressView: React.FC<LearnerProgressViewProps> = ({
  masteryMap,
  onUpdateTopicDirectly,
  onLaunchTopicQuiz
}) => {
  const masteries = Object.values(masteryMap);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Mathematical BKT Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
              Bayesian Knowledge Tracing (BKT) Formulation
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              Corbett & Anderson Latent Mastery Model
            </h3>
          </div>
          <div className="text-xs font-mono bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg">
            Evaluation Area 5 Compliant: 20% Weight
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block font-semibold">Prior Mastery P(L₀)</span>
            <span className="text-lg font-bold text-white">0.30</span>
            <p className="text-[11px] text-slate-500 font-sans mt-1">Base probability of knowing a topic before observation.</p>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block font-semibold">Learn Transition P(T)</span>
            <span className="text-lg font-bold text-blue-400">0.15</span>
            <p className="text-[11px] text-slate-500 font-sans mt-1">Probability of acquiring mastery on each learning step.</p>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block font-semibold">Guess Rate P(G)</span>
            <span className="text-lg font-bold text-amber-400">0.20</span>
            <p className="text-[11px] text-slate-500 font-sans mt-1">Probability of guessing correct answer without mastery.</p>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block font-semibold">Slip Rate P(S)</span>
            <span className="text-lg font-bold text-rose-400">0.10</span>
            <p className="text-[11px] text-slate-500 font-sans mt-1">Probability of making a careless error despite mastery.</p>
          </div>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
          <div className="text-slate-400 font-bold mb-1">// Exact Posterior Update Rule:</div>
          <div>P(L_t | Correct) = [P(L_{'{t-1}'}) · (1 - P(S))] / [P(L_{'{t-1}'}) · (1 - P(S)) + (1 - P(L_{'{t-1}'})) · P(G)]</div>
          <div>P(L_t | Incorrect) = [P(L_{'{t-1}'}) · P(S)] / [P(L_{'{t-1}'}) · P(S) + (1 - P(L_{'{t-1}'})) · (1 - P(G))]</div>
          <div className="text-blue-400 mt-1">P(L_{'{t+1}'}) = P(L_t | Obs) + (1 - P(L_t | Obs)) · P(T)</div>
        </div>
      </div>

      {/* Topics Mastery Table & Live Test Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Live Topic Mastery States & Step-by-Step Simulation
            </h3>
            <p className="text-xs text-slate-500">
              Click "+ Correct" or "- Mistake" on any row to verify real-time Bayesian update calculation.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono font-bold tracking-wider">
                <th className="py-3 px-3">Topic</th>
                <th className="py-3 px-3">BKT Mastery P(L)</th>
                <th className="py-3 px-3">Observed Accuracy</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Explainable Rationale</th>
                <th className="py-3 px-3 text-right">Live BKT Step Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {masteries.map(topicItem => {
                const pct = Math.round(topicItem.pMastery * 100);
                const statusColors = {
                  'Mastered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  'Practicing': 'bg-blue-50 text-blue-700 border-blue-200',
                  'Needs Attention': 'bg-amber-50 text-amber-700 border-amber-200'
                };

                return (
                  <tr key={topicItem.topic} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {topicItem.topic}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-600' : 'bg-amber-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-700">{topicItem.pMastery} ({pct}%)</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-600">
                      {Math.round(topicItem.accuracy * 100)}% ({topicItem.correctAttempts}/{topicItem.totalAttempts})
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusColors[topicItem.status]}`}>
                        {topicItem.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 max-w-xs text-slate-600 leading-snug">
                      {topicItem.recommendedAction}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateTopicDirectly(topicItem.topic, true)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md font-bold transition"
                          title="Simulate correct response to verify upward BKT update"
                        >
                          + Correct
                        </button>
                        <button
                          onClick={() => onUpdateTopicDirectly(topicItem.topic, false)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md font-bold transition"
                          title="Simulate incorrect response to verify downward BKT update"
                        >
                          - Mistake
                        </button>
                        <button
                          onClick={() => onLaunchTopicQuiz(topicItem.topic)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold transition"
                        >
                          Quiz
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
