import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Dashboard from './components/Dashboard';
import AirtableService from './services/airtableService';
import { AirtableConfig } from './types';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

//mock Airtable configuration
//replace with your actual Airtable credentials
const airtableConfig: AirtableConfig = {
  baseId: 'your_base_id_here',
  apiKey: 'your_api_key_here',
  tables: {
    companies: 'Companies',
    applications: 'Applications',
    stages: 'Stages'
  }
};

//for demo purposes, created a mock service that returns sample data
class MockAirtableService {
  private mockData = {
    companies: [
      { id: '1', name: 'Google', industry: 'Technology', location: 'Mountain View, CA', website: 'https://google.com' },
      { id: '2', name: 'Microsoft', industry: 'Technology', location: 'Redmond, WA', website: 'https://microsoft.com' },
      { id: '3', name: 'Apple', industry: 'Technology', location: 'Cupertino, CA', website: 'https://apple.com' },
      { id: '4', name: 'Meta', industry: 'Technology', location: 'Menlo Park, CA', website: 'https://meta.com' },
      { id: '5', name: 'Amazon', industry: 'Technology', location: 'Seattle, WA', website: 'https://amazon.com' },
      { id: '6', name: 'Netflix', industry: 'Technology', location: 'Los Gatos, CA', website: 'https://netflix.com' },
      { id: '7', name: 'Spotify', industry: 'Technology', location: 'Stockholm, Sweden', website: 'https://spotify.com' },
      { id: '8', name: 'Uber', industry: 'Technology', location: 'San Francisco, CA', website: 'https://uber.com' },
      { id: '9', name: 'Airbnb', industry: 'Technology', location: 'San Francisco, CA', website: 'https://airbnb.com' },
      { id: '10', name: 'Stripe', industry: 'Technology', location: 'San Francisco, CA', website: 'https://stripe.com' },
      { id: '11', name: 'Slack', industry: 'Technology', location: 'San Francisco, CA', website: 'https://slack.com' },
      { id: '12', name: 'Salesforce', industry: 'Technology', location: 'San Francisco, CA', website: 'https://salesforce.com' },
      { id: '13', name: 'Adobe', industry: 'Technology', location: 'San Jose, CA', website: 'https://adobe.com' },
      { id: '14', name: 'Intel', industry: 'Technology', location: 'Santa Clara, CA', website: 'https://intel.com' },
      { id: '15', name: 'Oracle', industry: 'Technology', location: 'Austin, TX', website: 'https://oracle.com' }
    ],
    stages: [
      { id: '1', name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
      { id: '2', name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
      { id: '3', name: 'Technical Interview', order: 3, color: '#44916F', description: 'Technical assessment' },
      { id: '4', name: 'Final Round', order: 4, color: '#247D7F', description: 'Final interview round' },
      { id: '5', name: 'Offer', order: 5, color: '#80B9C8', description: 'Offer received' }
    ],
    entries: [
      {
        id: '1',
        companyId: 'Google',
        position: 'Software Engineering Intern',
        applicationDate: '2024-01-15',
        currentStage: '3',
        notes: 'Great technical interview, waiting for final round',
        lastUpdated: '2024-01-20',
        status: 'active'
      },
      {
        id: '2',
        companyId: 'McKinsey',
        position: 'Business Analyst Intern',
        applicationDate: '2024-01-10',
        currentStage: '3',
        notes: 'First case interview completed, waiting for second round',
        lastUpdated: '2024-01-18',
        status: 'active'
      },
      {
        id: '3',
        companyId: 'Apple',
        position: 'Data Science Intern',
        applicationDate: '2024-01-05',
        currentStage: '5',
        notes: 'Offer received! Starting in June',
        lastUpdated: '2024-01-22',
        status: 'accepted'
      },
      {
        id: '4',
        companyId: 'Goldman Sachs',
        position: 'Investment Banking Intern',
        applicationDate: '2024-01-12',
        currentStage: '4',
        notes: 'Superday completed, waiting for final decision',
        lastUpdated: '2024-01-12',
        status: 'active'
      },
      {
        id: '5',
        companyId: 'Netflix',
        position: 'Backend Engineering Intern',
        applicationDate: '2024-01-08',
        currentStage: '4',
        notes: 'Final round interview completed, waiting for decision',
        lastUpdated: '2024-01-21',
        status: 'active'
      },
      {
        id: '6',
        companyId: 'Bain & Company',
        position: 'Consulting Intern',
        applicationDate: '2024-01-03',
        currentStage: '2',
        notes: 'First screening call went well',
        lastUpdated: '2024-01-16',
        status: 'active'
      },
      {
        id: '7',
        companyId: 'Stripe',
        position: 'Full Stack Engineering Intern',
        applicationDate: '2024-01-01',
        currentStage: '1',
        notes: 'Just applied, excited about this opportunity',
        lastUpdated: '2024-01-01',
        status: 'active'
      }
    ]
  };

  async getCompanies() {
    return Promise.resolve(this.mockData.companies);
  }

  async getStages() {
    return Promise.resolve(this.mockData.stages);
  }

  async getTimelineEntries() {
    return Promise.resolve(this.mockData.entries);
  }

  async addTimelineEntry(entry: any) {
    const newEntry = {
      ...entry,
      id: (this.mockData.entries.length + 1).toString()
    };
    this.mockData.entries.push(newEntry);
    return Promise.resolve(newEntry);
  }

  async updateTimelineEntry(id: string, updates: any) {
    const index = this.mockData.entries.findIndex(entry => entry.id === id);
    if (index !== -1) {
      this.mockData.entries[index] = { ...this.mockData.entries[index], ...updates };
    }
    return Promise.resolve(true);
  }

  async deleteTimelineEntry(id: string) {
    this.mockData.entries = this.mockData.entries.filter(entry => entry.id !== id);
    return Promise.resolve(true);
  }
}

function App() {
  //uses mock service for demo; replace with real AirtableService when ready
  const airtableService = new MockAirtableService();

  return (
    <>
      <GlobalStyle />
      <Dashboard airtableService={airtableService} />
    </>
  );
}

export default App;
