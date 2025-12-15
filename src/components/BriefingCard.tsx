import React from 'react';
import type { BriefingData } from '../types.ts';

interface BriefingCardProps {
  data: BriefingData;
}

const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-4 text-stone-700">
      {lines.map((line, idx) => {
        // H2 Headers (Categories)
        if (line.startsWith('## ')) {
          return (
            <div key={idx} className="mt-8 mb-4 border-b border-yellow-600/20 pb-2">
              <h3 className="text-xl serif font-bold text-stone-900">
                {line.replace('## ', '')}
              </h3>
            </div>
          );
        }
        // H3 Headers
        if (line.startsWith('### ')) {
          return <h4 key={idx} className="text-lg font-medium text-yellow-800 mt-6 mb-2">{line.replace('### ', '')}</h4>;
        }
        // Bullet points
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-3 mb-2 group">
              <span className="text-yellow-600 mt-2 text-[8px] transition-transform group-hover:scale-125">◆</span>
              <span className="leading-relaxed font-light">{line.replace(/^[-*] /, '')}</span>
            </div>
          );
        }
        if (line.trim().length === 0) return <div key={idx} className="h-1" />;
        return <p key={idx} className="leading-relaxed font-light">{line}</p>;
      })}
    </div>
  );
};

export const BriefingCard: React.FC<BriefingCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-stone-100 fade-in-up">
      {/* Header */}
      <div className="bg-stone-50 px-8 py-6 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl serif font-bold text-stone-900 flex items-center gap-3">
            Daily Executive Summary
          </h2>
          <p className="text-stone-500 text-sm mt-1">Prepared by AI Analyst for Global Textile Markets</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border border-stone-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono text-stone-600 uppercase tracking-widest">
            {new Date(data.timestamp).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 md:p-10 max-h-[80vh] overflow-y-auto">
        <SimpleMarkdownRenderer content={data.summary} />
      </div>

      {/* Footer / Sources */}
      {data.sources.length > 0 && (
        <div className="bg-stone-900 text-stone-400 p-8">
          <h3 className="text-xs font-bold text-yellow-600 uppercase tracking-[0.2em] mb-4">Verified Intelligence Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-xs hover:text-white transition-colors p-2 rounded hover:bg-stone-800"
              >
                <span className="text-stone-600 group-hover:text-yellow-500 transition-colors">↗</span>
                <span className="truncate">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};