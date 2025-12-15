export interface GroundingSource {
  title: string;
  uri: string;
}

export interface BriefingData {
  timestamp: string;
  summary: string; // Markdown formatted bullet points
  sources: GroundingSource[];
}

export const AppStatus = {
  IDLE: 'IDLE',
  FETCHING: 'FETCHING',
  SUMMARIZING: 'SUMMARIZING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
} as const;

export type AppStatus = typeof AppStatus[keyof typeof AppStatus];


export interface TargetSource {
  name: string;
  focus: string;
}

export const PRIORITY_SOURCES: TargetSource[] = [
  { name: 'Fibre2Fashion', focus: 'Global supply chain & market trends' },
  { name: 'Just Style', focus: 'Sourcing & sustainability' },
  { name: 'Textile Exchange', focus: 'Sustainable materials & standards' },
  { name: 'The Textile Magazine', focus: 'Indian industry & machinery' },
  { name: 'Bloomberg/FT (Textile Sector)', focus: 'Financials & M&A' },
];