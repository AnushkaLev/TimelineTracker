import axios from 'axios';
import { Company, ApplicationStage, TimelineEntry, AirtableConfig } from '../types';

class AirtableService {
  private config: AirtableConfig;
  private baseUrl: string;

  constructor(config: AirtableConfig) {
    this.config = config;
    this.baseUrl = `https://api.airtable.com/v0/${config.baseId}`;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  //fetch all companies
  async getCompanies(): Promise<Company[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/${this.config.tables.companies}`, {
        headers: this.getHeaders()
      });
      return response.data.records.map((record: any) => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  }

  //fetch all application stages
  async getStages(): Promise<ApplicationStage[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/${this.config.tables.stages}`, {
        headers: this.getHeaders()
      });
      return response.data.records.map((record: any) => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error('Error fetching stages:', error);
      return [];
    }
  }

  //fetch all timeline entries
  async getTimelineEntries(): Promise<TimelineEntry[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/${this.config.tables.applications}`, {
        headers: this.getHeaders()
      });
      return response.data.records.map((record: any) => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error('Error fetching timeline entries:', error);
      return [];
    }
  }

  //add new timeline entry
  async addTimelineEntry(entry: Omit<TimelineEntry, 'id'>): Promise<TimelineEntry | null> {
    try {
      const response = await axios.post(`${this.baseUrl}/${this.config.tables.applications}`, {
        fields: entry
      }, {
        headers: this.getHeaders()
      });
      return {
        id: response.data.id,
        ...response.data.fields
      };
    } catch (error) {
      console.error('Error adding timeline entry:', error);
      return null;
    }
  }

  //update timeline entry
  async updateTimelineEntry(id: string, fields: Partial<TimelineEntry>): Promise<boolean> {
    try {
      await axios.patch(`${this.baseUrl}/${this.config.tables.applications}`, {
        records: [{
          id,
          fields
        }]
      }, {
        headers: this.getHeaders()
      });
      return true;
    } catch (error) {
      console.error('Error updating timeline entry:', error);
      return false;
    }
  }

  //delete timeline entry
  async deleteTimelineEntry(id: string): Promise<boolean> {
    try {
      await axios.delete(`${this.baseUrl}/${this.config.tables.applications}/${id}`, {
        headers: this.getHeaders()
      });
      return true;
    } catch (error) {
      console.error('Error deleting timeline entry:', error);
      return false;
    }
  }
}

export default AirtableService; 