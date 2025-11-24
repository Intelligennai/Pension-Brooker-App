import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import InsightDisplay from './components/InsightDisplay';
import SourceList from './components/SourceList';
import { analyzeCompany } from './services/geminiService';
import { AnalysisState, Tab, Language } from './types';

const TRANSLATIONS = {
  en: {
    subtitle: "Psychological Sales Intel",
    placeholder: "Search company (e.g. Acme Corp)",
    analyze: "Generate Intelligence",
    analyzing: "Profiling...",
    readyTitle: "Don't Just Call. Connect with Psychological Intel.",
    readyDesc: "Go beyond basic data. IntelliGenN profiles the CEO's personality, estimates pension volume, and finds the 'Golden Hook' icebreaker to guarantee a meeting.",
    badges: {
      psych: "Psychological Profiling",
      hook: "The 'Golden Hook'",
      provider: "Provider Detection",
      script: "Tailored Scripts"
    },
    tabs: {
      insights: "Analysis & Psych",
      script: "Call Script",
      sources: "Verified Sources"
    },
    loadingStats: "Analyzing personality types, news signals, and financial data...",
    errorTitle: "Search Failed"
  },
  da: {
    subtitle: "Psykologisk Salgsindsigt",
    placeholder: "Søg virksomhed (f.eks. Novo Nordisk A/S)",
    analyze: "Generer Indsigt",
    analyzing: "Analyserer...",
    readyTitle: "Ring ikke bare op. Skab kontakt med Psykologisk Indsigt.",
    readyDesc: "Gå ud over basisdata. IntelliGenN profilerer CEO'ens personlighed, estimerer pensionsvolumen og finder 'Den Gyldne Krog' der sikrer mødet.",
    badges: {
      psych: "Psykologisk Profilering",
      hook: "Den Gyldne Krog",
      provider: "Udbudsdetektion",
      script: "Skræddersyede Manuskripter"
    },
    tabs: {
      insights: "Analyse & Profil",
      script: "Call Script",
      sources: "Verificerede Kilder"
    },
    loadingStats: "Analyserer personlighedstyper, nyheder og regnskaber...",
    errorTitle: "Søgning mislykkedes"
  }
};

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    data: null,
    companyName: ''
  });

  const [activeTab, setActiveTab] = useState<Tab>(Tab.INSIGHTS);
  const [language, setLanguage] = useState<Language>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[language];

  const handleSearch = async (term: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, companyName: term }));
    // Reset tab to insights on new search
    setActiveTab(Tab.INSIGHTS);
    try {
      const result = await analyzeCompany(term, language);
      setState(prev => ({
        ...prev,
        isLoading: false,
        data: result
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      }));
    }
  };

  const TabButton = ({ tab, icon, label, count }: { tab: Tab, icon: React.ReactNode, label: string, count?: number }) => (
    <button
      onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group mb-1 ${
        activeTab === tab 
          ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30' 
          : 'text-slate-400 hover:bg-midnight-800 hover:text-slate-200'
      }`}
    >
      <div className="flex items-center">
        <span className={`mr-3 ${activeTab === tab ? 'text-brand-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
          {icon}
        </span>
        {label}
      </div>
      {count !== undefined && count > 0 && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-brand-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-midnight-800 text-slate-500'}`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex h-screen bg-midnight-950 overflow-hidden font-sans">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-midnight-900 border-r border-midnight-700/50 flex-shrink-0 z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-2 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none font-sans">IntelliGenN</h1>
              <p className="text-[10px] text-brand-400 font-medium uppercase tracking-wider mt-1">{t.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-widest px-4 mb-3 mt-6">Menu</div>
          <TabButton 
            tab={Tab.INSIGHTS} 
            label={t.tabs.insights}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
          />
          <TabButton 
            tab={Tab.SCRIPT} 
            label={t.tabs.script}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
          />
          <TabButton 
            tab={Tab.SOURCES} 
            label={t.tabs.sources}
            count={state.data?.groundingChunks.length || 0}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
          />
        </div>

        <div className="p-4 border-t border-midnight-800">
           <div className="bg-midnight-800/50 border border-midnight-700 rounded-lg p-4 text-xs">
             <div className="flex items-center gap-2 mb-2 text-brand-400 font-semibold">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               Pro Tip
             </div>
             <p className="text-slate-400 leading-relaxed">
               Use the "Call Script" tab. It now integrates the Psychological Profile to match the decision maker's style.
             </p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-midnight-950">
        
        {/* Header */}
        <header className="bg-midnight-950/80 backdrop-blur-md border-b border-midnight-800 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 z-10 sticky top-0">
           <div className="flex items-center flex-1 max-w-2xl">
             <div className="md:hidden mr-4">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
             </div>
             <SearchBar 
                onSearch={handleSearch} 
                isLoading={state.isLoading} 
                placeholder={t.placeholder}
                buttonText={t.analyze}
                loadingText={t.analyzing}
              />
           </div>

           <div className="flex items-center ml-4 space-x-4">
              <div className="flex bg-midnight-900 rounded-lg p-1 border border-midnight-800">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[4px] transition-all ${
                    language === 'en' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('da')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[4px] transition-all ${
                    language === 'da' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  DA
                </button>
              </div>
           </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
           <div className="md:hidden absolute top-20 left-0 w-full bg-midnight-900 z-30 p-4 border-b border-midnight-700 shadow-2xl">
              <TabButton 
                tab={Tab.INSIGHTS} 
                label={t.tabs.insights}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
              />
              <div className="h-2"></div>
              <TabButton 
                tab={Tab.SCRIPT} 
                label={t.tabs.script}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
              />
              <div className="h-2"></div>
              <TabButton 
                tab={Tab.SOURCES} 
                label={t.tabs.sources}
                count={state.data?.groundingChunks.length || 0}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
              />
           </div>
        )}

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar">
          
          {/* Empty State / Dashboard Hero */}
          {!state.data && !state.isLoading && !state.error && (
            <div className="flex flex-col items-center justify-center min-h-[80%] max-w-4xl mx-auto text-center animate-fadeIn px-4">
              
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-midnight-900 border border-midnight-700 text-brand-400 text-sm font-medium mb-8 animate-slideUp">
                <span className="w-2 h-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
                Built for Elite Pension Brokers
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight animate-slideUp">
                {t.readyTitle.split("Psychological").map((part, i) => (
                    <React.Fragment key={i}>
                        {i === 1 && <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-brand-600"> Psychological</span>}
                        {part}
                    </React.Fragment>
                ))}
              </h1>
              
              <p className="text-slate-400 text-lg mb-12 max-w-2xl leading-relaxed mx-auto">
                {t.readyDesc}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                 <div className="bg-midnight-900/50 backdrop-blur border border-midnight-800 p-5 rounded-2xl text-left hover:border-brand-500/50 hover:bg-midnight-800 transition-all duration-300 group cursor-default">
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                        <span className="text-brand-400">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        </span>
                    </div>
                    <p className="text-slate-200 font-semibold mb-1">{t.badges.psych}</p>
                    <p className="text-xs text-slate-500">CEO Personality Decoder</p>
                 </div>
                 
                 <div className="bg-midnight-900/50 backdrop-blur border border-midnight-800 p-5 rounded-2xl text-left hover:border-brand-500/50 hover:bg-midnight-800 transition-all duration-300 group cursor-default">
                     <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                        <span className="text-amber-400">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </span>
                    </div>
                    <p className="text-slate-200 font-semibold mb-1">{t.badges.hook}</p>
                    <p className="text-xs text-slate-500">The "Impossible to Ignore" Icebreaker</p>
                 </div>

                 <div className="bg-midnight-900/50 backdrop-blur border border-midnight-800 p-5 rounded-2xl text-left hover:border-brand-500/50 hover:bg-midnight-800 transition-all duration-300 group cursor-default">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <span className="text-emerald-400">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </span>
                    </div>
                    <p className="text-slate-200 font-semibold mb-1">{t.badges.provider}</p>
                    <p className="text-xs text-slate-500">Current Setup Intel</p>
                 </div>
                 
                 <div className="bg-midnight-900/50 backdrop-blur border border-midnight-800 p-5 rounded-2xl text-left hover:border-brand-500/50 hover:bg-midnight-800 transition-all duration-300 group cursor-default">
                     <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                        <span className="text-blue-400">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                        </span>
                    </div>
                    <p className="text-slate-200 font-semibold mb-1">{t.badges.script}</p>
                    <p className="text-xs text-slate-500">AI Scripting + Objection Handling</p>
                 </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {state.isLoading && (
            <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
               <div className="relative w-20 h-20 mb-8">
                 <div className="absolute top-0 left-0 w-full h-full border-4 border-midnight-800 rounded-full"></div>
                 <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-brand-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">{t.analyzing} {state.companyName}</h3>
               <p className="text-slate-500 text-sm max-w-sm text-center">{t.loadingStats}</p>
            </div>
          )}

          {/* Error State */}
          {state.error && (
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-900/10 border border-red-900/30 rounded-xl flex items-start animate-slideUp">
               <div className="bg-red-900/20 p-2 rounded-full mr-4 flex-shrink-0">
                 <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
               </div>
               <div>
                 <h3 className="text-base font-bold text-red-400">{t.errorTitle}</h3>
                 <p className="mt-1 text-sm text-red-200/70 leading-relaxed">{state.error}</p>
                 <button 
                  onClick={() => handleSearch(state.companyName)}
                  className="mt-3 text-xs font-semibold text-red-400 hover:text-red-300 underline"
                 >
                   Try again
                 </button>
               </div>
            </div>
          )}

          {/* Results View */}
          {state.data && !state.isLoading && (
            <div className="h-full flex flex-col gap-6 max-w-5xl mx-auto">
              {/* Header Info */}
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-white tracking-tight">{state.companyName}</h2>
                 <span className="text-xs font-mono text-brand-300 bg-brand-900/30 border border-brand-500/20 px-2 py-1 rounded">
                   Generated via Gemini 2.5
                 </span>
              </div>

              {activeTab === Tab.INSIGHTS && (
                 <InsightDisplay content={state.data.insights} />
              )}

              {activeTab === Tab.SCRIPT && (
                 <InsightDisplay content={state.data.script} />
              )}
              
              {activeTab === Tab.SOURCES && (
                 <div className="bg-midnight-900 rounded-xl border border-midnight-700 p-6 shadow-xl">
                    <SourceList sources={state.data.groundingChunks} />
                 </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;