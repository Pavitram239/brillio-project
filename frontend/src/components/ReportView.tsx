import React from 'react';
import { 
  Building2, Users, Newspaper, DollarSign, AlertTriangle, 
  CheckCircle2, Loader2, Clock, Award, Tag, Target, TrendingUp, UserCheck
} from 'lucide-react';
import { ReportData, StreamStatusMap } from '../types';

interface ReportViewProps {
  companyName: string;
  reportData: ReportData;
  isStreaming: boolean;
  streamStatus?: StreamStatusMap;
  createdAt?: string;
}

export const ReportView: React.FC<ReportViewProps> = ({
  companyName,
  reportData,
  isStreaming,
  streamStatus,
}) => {
  const { overview, key_people, news, financials, risks } = reportData;

  const renderSectionBadge = (sectionKey: keyof StreamStatusMap) => {
    if (!isStreaming || !streamStatus) return null;
    const status = streamStatus[sectionKey]?.state;
    if (status === 'streaming') {
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Researching...</span>
        </span>
      );
    }
    if (status === 'complete') {
      return (
        <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          <span>Ready</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
        <Clock className="w-3 h-3" />
        <span>Pending</span>
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Report Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <span>Executive Briefing</span>
              <span>•</span>
              <span>2-Min Scan</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              {companyName}
            </h1>
          </div>
          {isStreaming && (
            <div className="flex items-center gap-2 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3.5 py-2 rounded-xl">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Live Agent Research Streaming...</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 1: Company Overview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">1. Company Overview</h2>
          </div>
          {renderSectionBadge('overview')}
        </div>

        {overview ? (
          <div className="space-y-4">
            {/* 30-Second Primer Box */}
            <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>30-Second Briefing Primer</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{overview.summary}</p>
            </div>

            {/* Structured Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/30 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium mb-1">
                  <Tag className="w-3.5 h-3.5 text-blue-400" /> Industry Segment
                </span>
                <p className="text-sm font-semibold text-slate-200">{overview.industry}</p>
              </div>

              <div className="bg-slate-800/30 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium mb-1">
                  <Target className="w-3.5 h-3.5 text-indigo-400" /> Target Customers
                </span>
                <p className="text-sm font-semibold text-slate-200">{overview.target_customers}</p>
              </div>
            </div>

            {/* Core Products Tags */}
            {overview.core_products && overview.core_products.length > 0 && (
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-2">Core Products & Offerings:</span>
                <div className="flex flex-wrap gap-2">
                  {overview.core_products.map((prod, i) => (
                    <span key={i} className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-lg">
                      {prod}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Market Positioning */}
            {overview.market_positioning && (
              <div className="text-xs text-slate-400 bg-slate-800/20 p-3 rounded-xl border border-slate-800/60">
                <span className="font-semibold text-slate-300 block mb-0.5">Market Positioning:</span>
                <p className="text-slate-300 leading-normal">{overview.market_positioning}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 text-sm animate-pulse">
            Waiting for company overview analysis...
          </div>
        )}
      </div>

      {/* SECTION 2: Key People */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">2. Key People</h2>
              <p className="text-xs text-slate-400">C-suite & senior leadership for sales persona mapping</p>
            </div>
          </div>
          {renderSectionBadge('key_people')}
        </div>

        {key_people && key_people.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {key_people.map((person, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 bg-slate-800/40 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 flex-shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">{person.name}</h3>
                  <p className="text-xs text-indigo-400 font-medium mt-0.5">{person.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 text-sm animate-pulse">
            Researching key leadership and executive team...
          </div>
        )}
      </div>

      {/* SECTION 3: Recent News */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">3. Recent News</h2>
              <p className="text-xs text-slate-400">Acquisitions, product launches & current developments</p>
            </div>
          </div>
          {renderSectionBadge('news')}
        </div>

        {news && news.length > 0 ? (
          <ul className="space-y-3">
            {news.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-slate-800/30 border border-slate-800/80 rounded-xl text-sm text-slate-200">
                <span className="flex-shrink-0 h-2 w-2 rounded-full bg-amber-400 mt-2"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-6 text-center text-slate-500 text-sm animate-pulse">
            Scanning web news sources...
          </div>
        )}
      </div>

      {/* SECTION 4: Financial Highlights */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">4. Financial Highlights</h2>
              <p className="text-xs text-slate-400">Shapes deal sizing and pricing positioning</p>
            </div>
          </div>
          {renderSectionBadge('financials')}
        </div>

        {financials ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium block mb-1">Revenue</span>
              <span className="text-base font-bold text-emerald-400">
                {financials.revenue ?? <span className="text-slate-500 text-xs italic">N/A (Private)</span>}
              </span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium block mb-1">Headcount</span>
              <span className="text-base font-bold text-slate-200">
                {financials.employee_count ?? <span className="text-slate-500 text-xs italic">N/A</span>}
              </span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium block mb-1">Market Cap</span>
              <span className="text-base font-bold text-blue-400">
                {financials.market_cap ?? <span className="text-slate-500 text-xs italic">N/A (Private)</span>}
              </span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium block mb-1">YoY Growth</span>
              <span className="text-base font-bold text-amber-400 flex items-center justify-center gap-1">
                {financials.yoy_growth ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" />
                    {financials.yoy_growth}
                  </>
                ) : (
                  <span className="text-slate-500 text-xs italic">N/A</span>
                )}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 text-sm animate-pulse">
            Extracting financial data...
          </div>
        )}
      </div>

      {/* SECTION 5: Risk Factors */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">5. Risk Factors & Objections</h2>
              <p className="text-xs text-slate-400">Anticipate objections & potential friction points</p>
            </div>
          </div>
          {renderSectionBadge('risks')}
        </div>

        {risks && risks.length > 0 ? (
          <ul className="space-y-3">
            {risks.map((risk, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-sm text-slate-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-6 text-center text-slate-500 text-sm animate-pulse">
            Identifying risk factors and objections...
          </div>
        )}
      </div>
    </div>
  );
};
