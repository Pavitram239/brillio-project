import React, { useEffect, useState, useRef } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ReportHistory } from './components/ReportHistory';
import { ReportView } from './components/ReportView';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { fetchReports, fetchReportById, deleteReport, streamResearch } from './services/api';
import { ReportListItem, ReportRecord, ReportData, SectionType, StreamStatusMap } from './types';

export const App: React.FC = () => {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [activeCompany, setActiveCompany] = useState<string>('');
  
  // Streaming state
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [activeStatusMessage, setActiveStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [streamData, setStreamData] = useState<ReportData>({});
  const [streamStatus, setStreamStatus] = useState<StreamStatusMap>({
    overview: { state: 'idle' },
    key_people: { state: 'idle' },
    news: { state: 'idle' },
    financials: { state: 'idle' },
    risks: { state: 'idle' },
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history on mount
  const loadReportsList = async () => {
    try {
      const data = await fetchReports();
      setReports(data);
    } catch (err: any) {
      console.error('Failed to load reports history:', err);
    }
  };

  useEffect(() => {
    loadReportsList();
  }, []);

  const handleStartResearch = async (companyName: string) => {
    // Prevent duplicate concurrent research for the same company
    if (isStreaming && activeCompany.toLowerCase() === companyName.toLowerCase()) {
      return;
    }

    // Cancel any active stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Reset view state
    setActiveCompany(companyName);
    setSelectedReport(null);
    setErrorMessage(null);
    setIsStreaming(true);
    setStreamData({});
    setStreamStatus({
      overview: { state: 'idle' },
      key_people: { state: 'idle' },
      news: { state: 'idle' },
      financials: { state: 'idle' },
      risks: { state: 'idle' },
    });
    setActiveStatusMessage(`Initializing agent research for ${companyName}...`);

    await streamResearch(
      companyName,
      {
        onStatus: (data) => {
          setActiveStatusMessage(data.message);
        },
        onSectionStart: (section: SectionType) => {
          setStreamStatus((prev) => ({
            ...prev,
            [section]: { state: 'streaming' },
          }));
        },
        onSectionData: (section: SectionType, data: any) => {
          setStreamData((prev) => ({
            ...prev,
            [section]: data,
          }));
        },
        onSectionComplete: (section: SectionType) => {
          setStreamStatus((prev) => ({
            ...prev,
            [section]: { state: 'complete' },
          }));
        },
        onComplete: (completedReport: ReportRecord) => {
          setIsStreaming(false);
          setSelectedReport(completedReport);
          setActiveStatusMessage('');
          abortControllerRef.current = null;
          loadReportsList();
        },
        onError: (errMsg: string) => {
          setIsStreaming(false);
          setErrorMessage(errMsg);
          setActiveStatusMessage('');
          abortControllerRef.current = null;
        },
      },
      controller.signal
    );
  };

  const handleCancelResearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setActiveStatusMessage('');
  };

  const handleSelectReport = async (id: string) => {
    if (isStreaming) {
      handleCancelResearch();
    }
    setErrorMessage(null);
    try {
      const record = await fetchReportById(id);
      setSelectedReport(record);
      setActiveCompany(record.company_name);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not load requested report.');
    }
  };

  const handleDeleteReport = async (id: string) => {
    try {
      await deleteReport(id);
      if (selectedReport?.id === id) {
        setSelectedReport(null);
        setActiveCompany('');
      }
      loadReportsList();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete report.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Prominent Search Bar */}
        <SearchBar
          onSearch={handleStartResearch}
          onCancel={handleCancelResearch}
          isStreaming={isStreaming}
          activeStatusMessage={activeStatusMessage}
        />

        {/* Main Content Layout with Sidebar History */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mt-4">
          {/* Sidebar History */}
          <ReportHistory
            reports={reports}
            selectedReportId={selectedReport?.id}
            onSelectReport={handleSelectReport}
            onDeleteReport={handleDeleteReport}
          />

          {/* Main Display Area */}
          <div className="flex-1 w-full min-w-0">
            {errorMessage ? (
              <ErrorState
                message={errorMessage}
                onRetry={() => activeCompany && handleStartResearch(activeCompany)}
              />
            ) : isStreaming || selectedReport ? (
              <ReportView
                companyName={activeCompany}
                reportData={isStreaming ? streamData : selectedReport!.data}
                isStreaming={isStreaming}
                streamStatus={streamStatus}
                createdAt={selectedReport?.created_at}
              />
            ) : (
              <EmptyState onSelectSample={handleStartResearch} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
