import React, { useState } from 'react';
import { History, Trash2, Building2, Search, Calendar, ChevronRight } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ReportListItem } from '../types';

interface ReportHistoryProps {
  reports: ReportListItem[];
  selectedReportId?: string | null;
  onSelectReport: (id: string) => void;
  onDeleteReport: (id: string) => void;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  onDeleteReport,
}) => {
  const [filterText, setFilterText] = useState('');

  const filteredReports = reports.filter((r) =>
    r.company_name.toLowerCase().includes(filterText.toLowerCase())
  );

  const formatTime = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  return (
    <div className="w-full lg:w-80 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col h-[calc(100vh-140px)] sticky top-24">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-200">
          <History className="w-4 h-4 text-blue-400" />
          <h2 className="font-semibold text-sm tracking-wide">Research History</h2>
        </div>
        <span className="text-xs bg-slate-800 text-slate-400 font-medium px-2 py-0.5 rounded-full border border-slate-700">
          {reports.length}
        </span>
      </div>

      {/* Filter Input */}
      {reports.length > 0 && (
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter past briefings..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredReports.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-400">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="text-xs font-medium">No saved briefings yet</p>
            <p className="text-[11px] text-slate-400 mt-1">Research a company above to build your sales intelligence database.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isSelected = selectedReportId === report.id;
            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report.id)}
                className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500/40 text-blue-100 shadow-md shadow-blue-500/5'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5 font-medium text-sm text-slate-100 truncate">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    <span className="truncate">{report.company_name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{formatTime(report.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteReport(report.id);
                    }}
                    title="Delete briefing"
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${isSelected ? 'text-blue-400 translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
