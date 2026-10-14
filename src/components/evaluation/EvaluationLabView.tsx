import React, { useState } from 'react';
import { MaterialChunk, EvaluationMetricReport, SimulatedLearnerExperiment } from '../../types';
import { EVALUATION_BENCHMARK } from '../../data/sampleCoursePack';
import { runSystemEvaluation, runSimulatedLearnerTrials } from '../../services/evaluationEngine';

interface EvaluationLabViewProps {
  chunks: MaterialChunk[];
}

export const EvaluationLabView: React.FC<EvaluationLabViewProps> = ({ chunks }) => {
  const [evalResult, setEvalResult] = useState<{
    report: EvaluationMetricReport;
    itemDetails: any[];
  } | null>(() => runSystemEvaluation(EVALUATION_BENCHMARK, chunks));

  const [simulatedProfiles, setSimulatedProfiles] = useState<SimulatedLearnerExperiment[] | null>(() =>
    runSimulatedLearnerTrials()
  );

  const [isRunningEval, setIsRunningEval] = useState(false);
  const [isRunningSim, setIsRunningSim] = useState(false);

  const handleRunEvaluation = () => {
    setIsRunningEval(true);
    setTimeout(() => {
      const res = runSystemEvaluation(EVALUATION_BENCHMARK, chunks);
      setEvalResult(res);
      setIsRunningEval(false);
    }, 500);
  };

  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setTimeout(() => {
      const res = runSimulatedLearnerTrials();
      setSimulatedProfiles(res);
      setIsRunningSim(false);
    }, 500);
  };

  const report = evalResult?.report;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
              RAGAS & TruLens Synthetic Benchmark Harness
            </span>
            <span className="text-xs font-mono text-slate-500">15% Evaluation Area</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            System Retrieval & Generation Metric Evaluation Lab
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Measures faithfulness, answer relevancy, context precision, context recall, and refusal honesty across team-built test benchmarks.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isRunningEval}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition flex items-center gap-2 shrink-0"
        >
          {isRunningEval ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Evaluating Corpus...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.03 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Rerun Benchmark Suite</span>
            </>
          )}
        </button>
      </div>

      {/* RAGAS Metric Cards */}
      {report && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Faithfulness</span>
            <div className="text-2xl font-black text-emerald-600">
              {Math.round(report.faithfulnessScore * 100)}%
            </div>
            <div className="text-[10px] text-slate-400">Factual grounding in retrieved chunks</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Answer Relevancy</span>
            <div className="text-2xl font-black text-blue-600">
              {Math.round(report.answerRelevancyScore * 100)}%
            </div>
            <div className="text-[10px] text-slate-400">Direct response to query intent</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Context Precision</span>
            <div className="text-2xl font-black text-indigo-600">
              {Math.round(report.contextPrecisionScore * 100)}%
            </div>
            <div className="text-[10px] text-slate-400">Signal-to-noise in top-k rankings</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Context Recall</span>
            <div className="text-2xl font-black text-violet-600">
              {Math.round(report.contextRecallScore * 100)}%
            </div>
            <div className="text-[10px] text-slate-400">Retrieval of gold-standard passages</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Citation Accuracy</span>
            <div className="text-2xl font-black text-teal-600">
              {Math.round(report.citationAccuracyScore * 100)}%
            </div>
            <div className="text-[10px] text-slate-400">Valid page/slide/time anchors</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Refusal Honesty</span>
            <div className="text-2xl font-black text-amber-600">
              {Math.round(report.refusalPrecisionScore * 100)}%
            </div>
            <div className="text-[10px] text-slate-400">Anti-hallucination on trick queries</div>
          </div>
        </div>
      )}

      {/* Benchmark Item Verification Table */}
      {evalResult && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900">
              Test Benchmark Queries & Gold-Standard Ground Truth ({evalResult.itemDetails.length} Items)
            </h4>
            <span className="text-xs font-mono text-slate-500">
              Evaluated {new Date(report?.evaluationTimestamp || '').toLocaleTimeString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono font-bold tracking-wider">
                  <th className="py-2.5 px-3">Benchmark Item</th>
                  <th className="py-2.5 px-3">Gold-Standard Ground Truth</th>
                  <th className="py-2.5 px-3">Recall</th>
                  <th className="py-2.5 px-3">Precision</th>
                  <th className="py-2.5 px-3">Refusal Safeguard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evalResult.itemDetails.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs">
                      {item.query}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-md font-serif italic">
                      "{item.groundTruth}"
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                      {Math.round(item.contextRecall * 100)}%
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">
                      {Math.round(item.contextPrecision * 100)}%
                    </td>
                    <td className="py-3 px-3">
                      {item.passedRefusalCheck ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ Safeguard Passed
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          ✕ Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Simulated Student Profile Experiments */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Simulated Learner Experiments
              </span>
              <span className="text-xs font-mono text-slate-400">Monte Carlo Simulation</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-1">
              BKT Adaptation Dynamics Across Different Student Profiles
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulates 5 consecutive learning sessions to observe BKT mastery trajectories and convergence stability.
            </p>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isRunningSim}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
          >
            <span>Rerun Student Simulation</span>
          </button>
        </div>

        {simulatedProfiles && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {simulatedProfiles.map(prof => {
              const finalMastery = prof.sessions[prof.sessions.length - 1]?.masteryAfter || 0;
              return (
                <div key={prof.learnerProfile} className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3">
                  <div className="border-b border-slate-200 pb-2">
                    <h5 className="font-bold text-sm text-slate-900">{prof.learnerProfile}</h5>
                    <p className="text-[11px] text-slate-500 mt-1">{prof.description}</p>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">Starting P(L₀):</span>
                    <span className="font-mono font-bold text-slate-700">{prof.startingMastery}</span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">Final Session P(L):</span>
                    <span className="font-mono font-extrabold text-blue-700 text-sm">
                      {finalMastery} ({Math.round(finalMastery * 100)}%)
                    </span>
                  </div>

                  {/* Visual Step-by-Step Trajectory Bar */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      5-Session Mastery Curve
                    </span>
                    <div className="flex items-end gap-1.5 h-16 bg-white p-2 rounded-lg border border-slate-200">
                      {prof.sessions.map((s, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                          <div
                            className="w-full bg-blue-600 rounded-t transition-all duration-500"
                            style={{ height: `${Math.round(s.masteryAfter * 100)}%` }}
                            title={`Session ${s.sessionNumber}: Score ${s.score}%, Mastery ${s.masteryAfter}`}
                          />
                          <span className="text-[9px] font-mono text-slate-400 mt-1">S{s.sessionNumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
