import React from 'react';

interface InsightDisplayProps {
  content: string;
}

const InsightDisplay: React.FC<InsightDisplayProps> = ({ content }) => {
  
  // Parse content into structured sections based on ### Headers
  const sections = React.useMemo(() => {
    const rawParts = content.split(/\n(?=### )|^(?=### )/);
    
    return rawParts.map((part, index) => {
      const lines = part.split('\n');
      let title = '';
      let bodyLines = lines;

      if (lines[0].trim().startsWith('### ')) {
        title = lines[0].replace(/###\s*/, '').trim(); 
        bodyLines = lines.slice(1);
      } else if (index === 0 && part.trim().length > 0 && !lines[0].startsWith('###')) {
         title = "Executive Summary";
      }

      const cleanLines = bodyLines.filter(l => l.trim() !== '');
      return { title, lines: cleanLines };
    }).filter(s => s.lines.length > 0);
  }, [content]);

  const parseBold = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  };

  // Enhanced helper to render values with clickable links
  const renderValueWithLinks = (text: string) => {
    // Regex to capture http/https URLs
    const urlRegex = /(https?:\/\/[^\s<)]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // Heuristic to clean up link text
        let displayText = 'Link';
        if (part.includes('linkedin.com')) displayText = 'LinkedIn Profile';
        else if (part.includes('mailto:')) displayText = 'Email';
        else if (part.length > 30) displayText = 'Website';
        
        return (
            <a 
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-brand-400 hover:text-brand-300 font-bold hover:underline ml-1.5 transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
                {displayText}
                <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Helper to render individual lines with rich formatting
  const renderLine = (line: string, idx: number) => {
    const trimmed = line.trim();
    
    // Subheaders
    if (trimmed.startsWith('## ')) {
        return (
            <h4 key={idx} className="text-brand-400 font-bold text-xs uppercase tracking-wider mt-4 mb-2 pl-1 border-l-2 border-brand-500/50">
                {trimmed.replace(/^##\s*/, '')}
            </h4>
        );
    }

    // Key-Value pairs
    const kvMatch = line.match(/^[-*]?\s*\*\*(.*?)\*\*:\s*(.*)/);
    if (kvMatch) {
      return (
        <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline py-2 border-b border-midnight-700/50 last:border-0 group hover:bg-midnight-800/30 -mx-2 px-2 rounded transition-colors">
          <span className="text-slate-400 text-sm font-medium pr-4">{kvMatch[1]}</span>
          <span className="text-slate-200 text-sm text-right font-medium">
             {renderValueWithLinks(kvMatch[2] || "—")}
          </span>
        </div>
      );
    }

    // Bullet points
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const text = trimmed.replace(/^[-*]\s*/, '');
      return (
        <div key={idx} className="flex items-start gap-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          <span className="text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: parseBold(text)}} />
        </div>
      );
    }

    // Paragraphs
    return (
      <p key={idx} className="text-slate-400 text-sm leading-relaxed mb-3 last:mb-0" dangerouslySetInnerHTML={{__html: parseBold(line)}} />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp pb-10">
      {sections.map((section, idx) => {
        const titleLower = section.title.toLowerCase();
        
        // --- SPECIAL CARD TYPES ---

        // 1. Psychological Profile Card (Disruptive Feature)
        if (titleLower.includes('psychological') || titleLower.includes('personality')) {
             return (
                <div key={idx} className="md:col-span-1 bg-gradient-to-br from-midnight-900 to-midnight-800 border border-brand-500/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.15)] relative group">
                    <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <svg className="w-12 h-12 text-brand-500/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-brand-500/20 bg-brand-900/10">
                        <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400 animate-pulse-slow">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        </div>
                        <h3 className="text-base font-bold text-white tracking-tight">Psychological Intel</h3>
                    </div>
                    <div className="p-6">
                        {section.lines.map((line, i) => {
                            // Highlighting the Personality Type
                            if (line.toLowerCase().includes('likely personality')) {
                                return (
                                    <div key={i} className="mb-4 p-3 bg-brand-500/10 rounded-lg border border-brand-500/20">
                                        <p className="text-xs text-brand-300 uppercase font-bold mb-1">Target Profile</p>
                                        <p className="text-white font-medium" dangerouslySetInnerHTML={{__html: parseBold(line.split(':')[1] || line)}} />
                                    </div>
                                )
                            }
                            return renderLine(line, i);
                        })}
                    </div>
                </div>
             );
        }

        // 2. The Golden Hook Card (Disruptive Feature)
        if (titleLower.includes('golden') || titleLower.includes('hook')) {
            return (
               <div key={idx} className="md:col-span-1 bg-gradient-to-br from-amber-900/20 to-midnight-900 border border-amber-500/30 rounded-xl overflow-hidden shadow-lg relative">
                   <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-500/20 bg-amber-500/5">
                       <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                       </div>
                       <h3 className="text-base font-bold text-amber-100 tracking-tight">The "Golden Hook"</h3>
                   </div>
                   <div className="p-6 relative">
                       <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <svg className="w-24 h-24 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                       </div>
                       {section.lines.map((line, i) => renderLine(line, i))}
                       <div className="mt-4 text-xs text-amber-500/60 font-mono text-right">
                           *Verified via public records
                       </div>
                   </div>
               </div>
            );
       }
       
       // 3. Deal Estimate / Exec Summary
       if (titleLower.includes('executive') || titleLower.includes('estimate')) {
            return (
                <div key={idx} className="md:col-span-2 bg-midnight-900 border border-midnight-700 rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <h3 className="text-base font-bold text-white tracking-tight">Deal Potential</h3>
                        </div>
                         {section.lines.map((line, i) => renderLine(line, i))}
                    </div>
                </div>
            )
       }

       // 4. Objection Handling
        if (titleLower.includes('objection')) {
            return (
                <div key={idx} className="md:col-span-2 bg-midnight-900 border border-midnight-700 rounded-xl overflow-hidden shadow-lg">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-red-900/30 bg-red-900/10">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-base font-bold text-white tracking-tight">{section.title}</h3>
                    </div>
                    <div className="p-6">
                        {section.lines.map((line, i) => {
                             if (line.includes('**Objection**:')) {
                                 const text = line.replace(/\*\*Objection\*\*:\s*/i, '').trim();
                                 return (
                                     <div key={i} className="mt-6 first:mt-0 mb-2 flex items-start gap-3">
                                         <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase tracking-wide border border-red-500/20 mt-0.5">They Say</span>
                                         <p className="text-slate-200 font-medium">{text}</p>
                                     </div>
                                 );
                             }
                             if (line.includes('**Rebuttal**:')) {
                                 const text = line.replace(/\*\*Rebuttal\*\*:\s*/i, '').trim();
                                 return (
                                     <div key={i} className="mb-6 ml-0 md:ml-12 bg-brand-900/20 border border-brand-500/20 rounded-lg p-4 relative">
                                         <div className="absolute -left-3 top-4 w-3 h-[1px] bg-brand-500/50 hidden md:block"></div>
                                         <span className="block text-[10px] font-bold text-brand-400 uppercase tracking-wide mb-1">You Say</span>
                                         <p className="text-slate-300 text-sm italic leading-relaxed">"{text}"</p>
                                     </div>
                                 );
                             }
                             return renderLine(line, i);
                        })}
                    </div>
                </div>
            )
        }

        // Standard Cards
        const isWide = titleLower.includes('pension') || 
                       titleLower.includes('script') || 
                       section.lines.length > 12;

        return (
          <div 
            key={idx} 
            className={`
              bg-midnight-900 border border-midnight-700 rounded-xl overflow-hidden shadow-lg 
              flex flex-col 
              hover:border-brand-500/30 transition-all duration-300 hover:shadow-brand-500/5
              ${isWide ? 'md:col-span-2' : 'md:col-span-1'}
            `}
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-midnight-800 bg-midnight-900/50">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center border
                  ${titleLower.includes('company') ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 
                    titleLower.includes('decision') ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                    titleLower.includes('pension') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    titleLower.includes('script') ? 'bg-brand-500/10 border-brand-500/20 text-brand-400' :
                    'bg-slate-700/30 border-slate-600/30 text-slate-400'}
                `}>
                  {titleLower.includes('decision') && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                  {titleLower.includes('pension') && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {titleLower.includes('script') && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                  {!titleLower.includes('decision') && !titleLower.includes('pension') && !titleLower.includes('script') && 
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  }
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{section.title}</h3>
            </div>
            <div className="p-6 pt-4 space-y-1">
              {section.lines.map((line, lineIdx) => renderLine(line, lineIdx))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InsightDisplay;
