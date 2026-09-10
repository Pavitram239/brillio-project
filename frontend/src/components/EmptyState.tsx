import React from 'react';
import { Building2, Sparkles, ArrowUp } from 'lucide-react';

interface EmptyStateProps {
  onSelectSample: (companyName: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectSample }) => {
  const samples = [
    { name: 'Stripe', label: 'Fintech & Payments', tag: 'Private' },
    { name: 'Apple', label: 'Tech & Hardware', tag: 'Public' },
    { name: 'Snowflake', label: 'Cloud & AI Data', tag: 'Public' },
    { name: 'Tesla', label: 'Automotive & Energy', tag: 'Public' },
  ];

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-slate-900/60 border border-slate-800 rounded-3xl text-center shadow-xl relative overflow-hidden">
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-400 mb-6 shadow-lg shadow-blue-500/10">
        <Building2 className="w-10 h-10" />
      </div>

      <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
        Instant Pre-Meeting Sales Briefings
      </h2>

      <p className="text-slate-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
        Stop spending 30 minutes before every sales call reading articles. Enter any company name above to generate a structured 2-minute executive briefing with overview, leadership, news, financials, and objections.
      </p>

      {/* Suggested Quick Searches */}
      <div className="pt-4 border-t border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Or try a sample briefing:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {samples.map((sample) => (
            <button
              key={sample.name}
              onClick={() => onSelectSample(sample.name)}
              className="group flex flex-col items-center p-3 bg-slate-800/50 hover:bg-blue-600/15 border border-slate-700/60 hover:border-blue-500/40 rounded-xl transition-all text-left"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-sm text-slate-100 group-hover:text-blue-300 transition-colors">
                  {sample.name}
                </span>
                <ArrowUp className="w-3 h-3 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <span className="text-[11px] text-slate-400 truncate w-full">{sample.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
