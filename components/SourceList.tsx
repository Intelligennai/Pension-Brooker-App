import React from 'react';
import { GroundingChunk } from '../types';

interface SourceListProps {
  sources: GroundingChunk[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-6 bg-midnight-900 rounded-lg p-4 border border-midnight-700">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Verified Sources
      </h4>
      <div className="space-y-2">
        {sources.map((chunk, idx) => (
          chunk.web ? (
            <a
              key={idx}
              href={chunk.web.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 rounded hover:bg-midnight-800 transition-all duration-200 group border border-transparent hover:border-midnight-700"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-brand-900/50 text-brand-400 border border-brand-500/20 rounded-full flex items-center justify-center text-xs font-bold mr-3 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-300 truncate group-hover:text-brand-300">
                  {chunk.web.title}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {new URL(chunk.web.uri).hostname}
                </p>
              </div>
              <svg className="w-4 h-4 text-slate-600 group-hover:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default SourceList;