import { ReportListItem, ReportRecord, SectionType } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api';

export async function fetchReports(): Promise<ReportListItem[]> {
  const res = await fetch(`${API_BASE}/reports`);
  if (!res.ok) throw new Error(`Failed to fetch reports list (${res.status})`);
  return res.json();
}

export async function fetchReportById(id: string): Promise<ReportRecord> {
  const res = await fetch(`${API_BASE}/reports/${id}`);
  if (!res.ok) throw new Error(`Report not found (${res.status})`);
  return res.json();
}

export async function deleteReport(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/reports/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete report (${res.status})`);
}

export async function checkHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed (${res.status})`);
  return res.json();
}

export interface StreamCallbacks {
  onStatus?: (data: { stage: string; message: string }) => void;
  onSectionStart?: (section: SectionType) => void;
  onSectionData?: (section: SectionType, data: any) => void;
  onSectionComplete?: (section: SectionType) => void;
  onComplete?: (report: ReportRecord) => void;
  onError?: (error: string) => void;
}

export async function streamResearch(
  companyName: string,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_name: companyName }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `HTTP Error ${response.status}`;
      try {
        const parsed = JSON.parse(errorText);
        errorMsg = parsed.detail || errorMsg;
      } catch {
        if (errorText) errorMsg = errorText;
      }
      callbacks.onError?.(errorMsg);
      return;
    }

    if (!response.body) {
      callbacks.onError?.('Server returned empty response stream.');
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || ''; // Keep trailing incomplete block in buffer

      for (const part of parts) {
        if (!part.trim()) continue;

        let eventType = 'message';
        let eventData = '';

        const lines = part.split('\n');
        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.substring(6).trim();
          } else if (line.startsWith('data:')) {
            eventData += line.substring(5).trim();
          }
        }

        if (!eventData) continue;

        try {
          const payload = JSON.parse(eventData);

          switch (eventType) {
            case 'status':
              callbacks.onStatus?.(payload);
              break;
            case 'section_start':
              callbacks.onSectionStart?.(payload.section as SectionType);
              break;
            case 'section_data':
              callbacks.onSectionData?.(payload.section as SectionType, payload.data);
              break;
            case 'section_complete':
              callbacks.onSectionComplete?.(payload.section as SectionType);
              break;
            case 'complete':
              callbacks.onComplete?.(payload.report);
              break;
            case 'error':
              callbacks.onError?.(payload.message || 'Stream error occurred.');
              break;
          }
        } catch (err) {
          console.error('Failed to parse SSE payload:', eventData, err);
        }
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.log('Stream research request canceled by user.');
      return;
    }
    callbacks.onError?.(err.message || 'Network error while streaming research.');
  }
}
