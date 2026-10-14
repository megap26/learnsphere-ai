import React, { useState } from 'react';
import { TutorMessage, MaterialChunk, ExplanationStyle, Citation } from '../../types';
import { askTutor } from '../../services/aiTutorService';

interface TutorViewProps {
  chunks: MaterialChunk[];
  onOpenCitation: (citation: Citation) => void;
  preloadedQuery?: string;
  onClearPreloadedQuery?: () => void;
}

export const TutorView: React.FC<TutorViewProps> = ({
  chunks,
  onOpenCitation,
  preloadedQuery,
  onClearPreloadedQuery
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I am your LearnSphere Source-Grounded Tutor for **CS 229: Deep Learning**. 

All my responses are strictly anchored in your uploaded textbook chapters, lecture slides, video transcripts, and lab notes. If an answer cannot be proven by your materials, I will honestly refuse rather than hallucinate.

How can I help you understand your course concepts today?`,
      timestamp: Date.now() - 60000,
      followUpQuestions: [
        'Why divide by sqrt(d_k) in attention?',
        'How does backpropagation use the chain rule?',
        'Why does standard sigmoid cause vanishing gradients?'
      ],
      explanationStyle: 'standard'
    }
  ]);

  const [inputQuery, setInputQuery] = useState(preloadedQuery || '');
  const [style, setStyle] = useState<ExplanationStyle>('standard');
  const [isLoading, setIsLoading] = useState(false);

  // If preloadedQuery comes from quick actions, handle it
  React.useEffect(() => {
    if (preloadedQuery) {
      setInputQuery(preloadedQuery);
      if (onClearPreloadedQuery) onClearPreloadedQuery();
    }
  }, [preloadedQuery, onClearPreloadedQuery]);

  const handleSend = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: TutorMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askTutor(query, chunks, style);
      setMessages(prev => [...prev, response]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: 'An error occurred while evaluating course evidence.',
          timestamp: Date.now(),
          isRefusal: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    { label: 'Attention Scaling', query: 'Why divide by sqrt(d_k) in Scaled Dot-Product Attention?' },
    { label: 'Backprop Derivation', query: 'How does backpropagation use the multivariate chain rule?' },
    { label: 'Gradient Overshoot', query: 'What happens when the learning rate η is set excessively high?' },
    { label: 'Trick / Unsupported Refusal', query: 'How does quantum entanglement accelerate BERT pretraining?' }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header & Style Selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            Evidence Grounding Engine
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Active Study Mode: <span className="text-indigo-600 capitalize">{style}</span>
          </h3>
        </div>

        {/* Style Selector Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {(['standard', 'simple', 'step-by-step', 'worked-example'] as ExplanationStyle[]).map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                style === s
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400">Quick Test Queries:</span>
        {samplePrompts.map(p => (
          <button
            key={p.label}
            onClick={() => handleSend(p.query)}
            className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 transition font-medium flex items-center gap-1.5 shadow-sm"
          >
            <span>{p.label}</span>
            <span className="text-slate-400">→</span>
          </button>
        ))}
      </div>

      {/* Chat Conversation Thread */}
      <div className="space-y-4 min-h-[420px]">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-5 shadow-sm space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : msg.isRefusal
                  ? 'bg-amber-50/90 border border-amber-200 text-slate-900 rounded-bl-none'
                  : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-xs opacity-75 pb-1 border-b border-current/10">
                <span className="font-bold flex items-center gap-1.5">
                  {msg.sender === 'user' ? '👤 Student' : '🎓 LearnSphere Tutor'}
                </span>
                <span className="font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Message Text */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              {/* Honest Refusal Alert Banner */}
              {msg.isRefusal && (
                <div className="bg-amber-100/80 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <strong className="block font-bold">Integrity Safeguard Triggered</strong>
                    The system verified that this question lacks evidence in your CS 229 materials. No fabricated citations or speculative answers were generated.
                  </div>
                </div>
              )}

              {/* Citations Badges */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Verified Supporting Sources (Click to Inspect Excerpt):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {msg.citations.map((c, idx) => (
                      <button
                        key={c.id || idx}
                        onClick={() => onOpenCitation(c)}
                        className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs px-3 py-1.5 rounded-lg transition font-medium group"
                      >
                        <span className="font-bold text-blue-600">[{idx + 1}]</span>
                        <span className="font-semibold">{c.materialTitle}</span>
                        <span className="text-slate-500 font-mono">({c.locationString})</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                          {Math.round(c.confidenceScore * 100)}% Match
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up suggestions */}
              {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Recommended Follow-up Questions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.followUpQuestions.map(fq => (
                      <button
                        key={fq}
                        onClick={() => handleSend(fq)}
                        className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 transition text-left"
                      >
                        {fq}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-4 rounded-xl border border-slate-200 w-64 shadow-sm animate-pulse">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>Retrieving course passages & verifying citations...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm sticky bottom-4">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            placeholder="Ask anything grounded in your course materials (e.g. gradient descent, attention, loss functions)..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-40 transition flex items-center gap-1.5 shrink-0"
          >
            <span>Ask Tutor</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
