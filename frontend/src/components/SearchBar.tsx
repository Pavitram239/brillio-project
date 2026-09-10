import React, { useEffect, useRef, useState } from 'react';
import { Search, Loader2, Square, Sparkles } from 'lucide-react';

interface SearchBarProps {
  onSearch: (companyName: string) => void;
  onCancel?: () => void;
  isStreaming: boolean;
  activeStatusMessage?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onCancel,
  isStreaming,
  activeStatusMessage
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery || isStreaming) return;
    onSearch(cleanQuery);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20">
          <div className="pl-4 pr-2 text-slate-400">
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            ) : (
              <Search className="w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isStreaming}
            placeholder="Enter company name (e.g. Stripe, Apple, Snowflake)..."
            className="w-full bg-transparent py-4 pr-36 text-slate-100 placeholder-slate-400 text-base focus:outline-none disabled:opacity-60"
          />

          <div className="absolute right-2 flex items-center gap-2">
            {isStreaming ? (
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600/90 hover:bg-rose-600 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-rose-600/20 active:scale-95"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Cancel</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!query.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95 disabled:pointer-events-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>Research</span>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Streaming status live bar */}
      {isStreaming && activeStatusMessage && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full py-1.5 px-4 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span className="font-medium">{activeStatusMessage}</span>
        </div>
      )}
    </div>
  );
};
