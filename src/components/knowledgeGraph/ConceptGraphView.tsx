import React, { useState } from 'react';
import { ConceptNode, TopicMastery, Citation, StudyMaterial } from '../../types';

interface ConceptGraphViewProps {
  concepts: ConceptNode[];
  masteryMap: Record<string, TopicMastery>;
  materials: StudyMaterial[];
  onOpenCitation: (citation: Citation) => void;
  onLaunchTopicQuiz: (topic: string) => void;
}

export const ConceptGraphView: React.FC<ConceptGraphViewProps> = ({
  concepts,
  masteryMap,
  materials,
  onOpenCitation,
  onLaunchTopicQuiz
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(concepts[0]?.id || 'c-opt');

  const selectedConcept = concepts.find(c => c.id === selectedConceptId) || concepts[0];

  // Map concept to matching mastery entry
  const getConceptMastery = (concept: ConceptNode) => {
    // Find matching topic in masteryMap
    for (const [key, val] of Object.entries(masteryMap)) {
      if (concept.label.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(concept.label.toLowerCase())) {
        return val;
      }
    }
    return null;
  };

  // Find chunks linked to this concept
  const allChunks = materials.flatMap(m => m.chunks);
  const linkedChunks = allChunks.filter(ch => selectedConcept?.chunkIds.includes(ch.id));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Interactive Concept & Prerequisite Map
          </h3>
          <p className="text-xs text-slate-500">
            Click on any concept node to inspect prerequisites, mastery level, and linked evidence chunks.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Mastered (≥80%)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" /> Practicing (50-79%)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Needs Revision (&lt;50%)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Graph Flow (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white shadow-inner min-h-[460px] flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between border-b border-slate-800 pb-2">
            <span>DIRECTED PREREQUISITE TOPOLOGY</span>
            <span>TOP-DOWN SYNTHESIS FLOW</span>
          </div>

          {/* Node Grid Layout */}
          <div className="py-6 space-y-6">
            {/* Level 1: Foundations */}
            <div className="flex items-center justify-around gap-3">
              {concepts.slice(0, 3).map(concept => {
                const isSelected = concept.id === selectedConceptId;
                const mastery = getConceptMastery(concept);
                const pL = mastery ? mastery.pMastery : 0.4;
                const ringColor = pL >= 0.8 ? 'border-emerald-400' : pL >= 0.5 ? 'border-blue-400' : 'border-amber-400';

                return (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConceptId(concept.id)}
                    className={`p-3.5 rounded-xl border-2 transition text-left w-48 shadow-lg ${ringColor} ${
                      isSelected ? 'bg-slate-800 ring-2 ring-white/50 scale-105' : 'bg-slate-950/70 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Foundational Level</div>
                    <div className="text-xs font-bold text-white truncate mt-0.5">{concept.label}</div>
                    <div className="text-[11px] text-slate-300 mt-1 font-mono">
                      Mastery: {Math.round(pL * 100)}%
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Connecting Arrows */}
            <div className="flex justify-around text-slate-600 text-lg font-mono">
              <span>↓</span>
              <span>↓</span>
              <span>↓</span>
            </div>

            {/* Level 2: Core Algorithm */}
            <div className="flex items-center justify-center gap-4">
              {concepts.slice(3, 4).map(concept => {
                const isSelected = concept.id === selectedConceptId;
                const mastery = getConceptMastery(concept);
                const pL = mastery ? mastery.pMastery : 0.35;
                const ringColor = pL >= 0.8 ? 'border-emerald-400' : pL >= 0.5 ? 'border-blue-400' : 'border-amber-400';

                return (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConceptId(concept.id)}
                    className={`p-3.5 rounded-xl border-2 transition text-left w-56 shadow-lg ${ringColor} ${
                      isSelected ? 'bg-slate-800 ring-2 ring-white/50 scale-105' : 'bg-slate-950/70 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Intermediate Synthesis</div>
                    <div className="text-xs font-bold text-white truncate mt-0.5">{concept.label}</div>
                    <div className="text-[11px] text-slate-300 mt-1 font-mono">
                      Mastery: {Math.round(pL * 100)}%
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Connecting Arrows */}
            <div className="flex justify-center text-slate-600 text-lg font-mono">
              <span>↓</span>
            </div>

            {/* Level 3: Advanced Architectures */}
            <div className="flex items-center justify-center gap-4">
              {concepts.slice(4).map(concept => {
                const isSelected = concept.id === selectedConceptId;
                const mastery = getConceptMastery(concept);
                const pL = mastery ? mastery.pMastery : 0.3;
                const ringColor = pL >= 0.8 ? 'border-emerald-400' : pL >= 0.5 ? 'border-blue-400' : 'border-amber-400';

                return (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConceptId(concept.id)}
                    className={`p-3.5 rounded-xl border-2 transition text-left w-52 shadow-lg ${ringColor} ${
                      isSelected ? 'bg-slate-800 ring-2 ring-white/50 scale-105' : 'bg-slate-950/70 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Advanced Architecture</div>
                    <div className="text-xs font-bold text-white truncate mt-0.5">{concept.label}</div>
                    <div className="text-[11px] text-slate-300 mt-1 font-mono">
                      Mastery: {Math.round(pL * 100)}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center">
            Prerequisite paths are dynamically resolved to order study sessions and practice difficulty.
          </div>
        </div>

        {/* Concept Inspector Sidebar */}
        {selectedConcept && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Concept Inspector
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-1">
                {selectedConcept.label}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {selectedConcept.description}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Subtopics & Competencies
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedConcept.subtopics.map(sub => (
                  <span key={sub} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Learning Target
              </span>
              <p className="text-xs text-slate-600 italic bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/60">
                "{selectedConcept.masteryTarget}"
              </p>
            </div>

            {/* Linked Chunks */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Supporting Material Evidence ({linkedChunks.length})
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {linkedChunks.map(chunk => (
                  <div
                    key={chunk.id}
                    onClick={() => onOpenCitation({
                      id: `cit-${chunk.id}`,
                      materialId: chunk.materialId,
                      materialTitle: chunk.materialTitle,
                      materialType: chunk.materialType,
                      locationString: chunk.locationString,
                      excerpt: chunk.text,
                      confidenceScore: 0.96
                    })}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 cursor-pointer text-xs space-y-0.5"
                  >
                    <div className="font-semibold text-blue-700 text-[11px] flex justify-between">
                      <span>{chunk.materialTitle}</span>
                      <span>{chunk.locationString}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 italic">
                      "{chunk.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onLaunchTopicQuiz(selectedConcept.label.split('&')[0].trim())}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>Practice This Concept</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
