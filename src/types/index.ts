export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  location: string;
  website: string;
}

export interface ApplicationStage {
  id: string;
  name: string;
  order: number;
  color: string;
  description: string;
}

export interface TimelineEntry {
  id: string;
  companyId: string;
  position: string;
  applicationDate: string;
  currentStage: string;
  notes?: string;
  lastUpdated: string;
  status: 'active' | 'rejected' | 'accepted' | 'withdrawn';
}

export interface TimelineData {
  companies: Company[];
  stages: ApplicationStage[];
  entries: TimelineEntry[];
}

export interface AirtableConfig {
  baseId: string;
  apiKey: string;
  tables: {
    companies: string;
    applications: string;
    stages: string;
  };
} 