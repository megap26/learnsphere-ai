import React from 'react';
import { Citation } from '../../types';

interface CitationModalProps {
  citation: Citation | null;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  const typeIcons: Record<string, string> = {
    pdf: '📄 PDF Textbook',
    slides: '📊 Slide Deck',
    video: '🎬 Video Transcript',
    notes: '📝 Study Notes'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              {typeIcons[citation.materialType] || 'Source Document'}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {citation.locationString}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Document Title */}
        <div>
          <h4 className="text-base font-bold text-slate-900">
            {citation.materialTitle}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500">Retrieval Confidence Score:</span>
            <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${Math.round(citation.confidenceScore * 100)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-600">
              {Math.round(citation.confidenceScore * 100)}%
            </span>
          </div>
        </div>

        {/* Verbatim Excerpt */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Extracted Verbatim Passage
          </span>
          <p className="text-sm text-slate-700 leading-relaxed font-serif italic">
            "{citation.excerpt}"
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400">
            LearnSphere Evidence Grounding Engine
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
          >
            Close Excerpt
          </button>
        </div>
      </div>
    </div>
  );
};
