export interface SearchResult {
  insights: string;
  script: string;
  groundingChunks: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  data: SearchResult | null;
  companyName: string;
}

export enum Tab {
  INSIGHTS = 'INSIGHTS',
  SCRIPT = 'SCRIPT',
  SOURCES = 'SOURCES'
}

export type Language = 'en' | 'da';
