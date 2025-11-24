import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
  placeholder: string;
  buttonText: string;
  loadingText: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading, 
  placeholder, 
  buttonText, 
  loadingText 
}) => {
  const [term, setTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <div className="flex shadow-lg shadow-black/20 rounded-lg overflow-hidden border border-midnight-700 bg-midnight-800 group-focus-within:border-brand-500 group-focus-within:ring-1 group-focus-within:ring-brand-500 transition-all duration-200">
          <input
            type="text"
            className="block w-full py-3 pl-10 pr-3 text-sm text-slate-100 bg-transparent border-none focus:ring-0 placeholder-slate-500"
            placeholder={placeholder}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !term.trim()}
            className="px-6 py-2.5 bg-midnight-900 text-slate-300 hover:text-white hover:bg-brand-600 border-l border-midnight-700 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                 <svg className="animate-spin h-4 w-4 text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                 <span className="hidden sm:inline text-slate-400">{loadingText}</span>
              </>
            ) : (
              <span className="text-brand-400 group-hover:text-white font-semibold">{buttonText}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;