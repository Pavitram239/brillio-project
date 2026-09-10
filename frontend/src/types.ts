export interface CompanyOverview {
  industry: string;
  core_products: string[];
  target_customers: string;
  market_positioning: string;
  summary: string;
}

export interface KeyPerson {
  name: string;
  title: string;
}

export interface FinancialHighlights {
  revenue?: string | null;
  employee_count?: string | null;
  market_cap?: string | null;
  yoy_growth?: string | null;
}

export interface ReportData {
  overview?: CompanyOverview;
  key_people?: KeyPerson[];
  news?: string[];
  financials?: FinancialHighlights;
  risks?: string[];
}

export interface ReportRecord {
  id: string;
  company_name: string;
  created_at: string;
  data: ReportData;
}

export interface ReportListItem {
  id: string;
  company_name: string;
  created_at: string;
}

export type SectionType = 'overview' | 'key_people' | 'news' | 'financials' | 'risks';

export interface SectionStatus {
  state: 'idle' | 'streaming' | 'complete';
}

export type StreamStatusMap = Record<SectionType, SectionStatus>;
