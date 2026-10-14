import React, { useState } from 'react';
import { StudyMaterial, MaterialType, MaterialChunk, Citation } from '../../types';

interface MaterialsViewProps {
  materials: StudyMaterial[];
  onAddMaterial: (material: StudyMaterial) => void;
  onOpenCitation: (citation: Citation) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  onAddMaterial,
  onOpenCitation
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Ingestion form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MaterialType>('pdf');
  const [topic, setTopic] = useState('Optimization');
  const [rawText, setRawText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const filteredMaterials = materials.filter(m => {
    const matchesType = selectedType === 'all' || m.type === selectedType;
    const matchesSearch = m.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          m.topics.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawText.trim()) return;

    // Split text into coherent paragraphs as chunks
    const paragraphs = rawText
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 30);

    const newChunks: MaterialChunk[] = paragraphs.map((p, idx) => ({
      id: `chunk-user-${Date.now()}-${idx}`,
      materialId: `mat-user-${Date.now()}`,
      materialTitle: title,
      materialType: type,
      location: type === 'pdf' ? { page: idx + 1 } : type === 'slides' ? { slide: idx + 1 } : type === 'video' ? { timestamp: `0${idx * 4}:00` } : { paragraph: idx + 1 },
      locationString: type === 'pdf' ? `Page ${idx + 1}` : type === 'slides' ? `Slide ${idx + 1}` : type === 'video' ? `Timestamp 0${idx * 4}:00` : `¶${idx + 1}`,
      text: p,
      topic: topic,
      subtopic: 'User Ingested Concept'
    }));

    const newMaterial: StudyMaterial = {
      id: `mat-user-${Date.now()}`,
      title,
      course: 'CS 229: Deep Learning',
      type,
      description: `User-ingested ${type} material containing ${newChunks.length} chunked passages.`,
      topics: [topic],
      uploadDate: new Date().toISOString().split('T')[0],
      itemCountLabel: `${newChunks.length} Chunks Processed`,
      chunks: newChunks,
      videoUrl: type === 'video' ? videoUrl : undefined,
      hasTranscript: type === 'video'
    };

    onAddMaterial(newMaterial);
    setShowAddModal(false);
    setTitle('');
    setRawText('');
    setVideoUrl('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {['all', 'pdf', 'slides', 'video', 'notes'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition ${
                selectedType === t
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search materials or topics..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ingest Material
          </button>
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMaterials.map(mat => (
          <div
            key={mat.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:border-slate-300 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                  {mat.type.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {mat.title}
                </h3>
                <p className="text-xs text-slate-500">{mat.course} • {mat.itemCountLabel}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {mat.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {mat.topics.map(tp => (
                <span key={tp} className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                  {tp}
                </span>
              ))}
            </div>

            {/* Chunks Preview */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Indexed Evidence Chunks ({mat.chunks.length})
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {mat.chunks.map(chunk => (
                  <div
                    key={chunk.id}
                    onClick={() => onOpenCitation({
                      id: `cit-${chunk.id}`,
                      materialId: mat.id,
                      materialTitle: mat.title,
                      materialType: mat.type,
                      locationString: chunk.locationString,
                      excerpt: chunk.text,
                      confidenceScore: 0.95
                    })}
                    className="p-2 bg-slate-50 hover:bg-blue-50/60 rounded-lg border border-slate-100 cursor-pointer transition text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span className="font-semibold text-blue-700">{chunk.locationString}</span>
                      <span>{chunk.subtopic}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 italic">
                      "{chunk.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Material Ingestion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Ingest New Multimodal Material
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleIngest} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Material Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4: Recurrent Neural Networks"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Material Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as MaterialType)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pdf">PDF Textbook / Notes</option>
                    <option value="slides">PowerPoint Slide Deck</option>
                    <option value="video">Lecture Video Transcript</option>
                    <option value="notes">Handwritten Study Notes</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Topic</label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {type === 'video' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Lecture Video URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Extracted Text / Transcript (Paragraphs will be chunked)
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Paste textbook excerpts, slide bullets, or timestamped transcripts here..."
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition"
                >
                  Process & Index Chunks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
