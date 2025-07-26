import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors, gradients } from '../styles/colors';
import { TimelineEntry, Company, ApplicationStage } from '../types';
import TimelineVisualization from './TimelineVisualization';
import ApplicationForm from './ApplicationForm';
import StatsCard from './StatsCard';
import ProgressChart from './ProgressChart';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${gradients.background};
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  background: ${gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${colors.teal};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TimelineSection = styled.div`
  background: ${colors.white};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const FormSection = styled.div`
  background: ${colors.white};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const ViewToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.active ? colors.accent : colors.gray.light};
  border-radius: 8px;
  background: ${props => props.active ? colors.accent : colors.white};
  color: ${props => props.active ? colors.white : colors.gray.dark};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${colors.accent};
    background: ${props => props.active ? colors.accent : colors.cream};
  }
`;

interface DashboardProps {
  airtableService: any;
}

const Dashboard: React.FC<DashboardProps> = ({ airtableService }) => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stages, setStages] = useState<ApplicationStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'chart'>('timeline');

  //templates
  const industryStages = {
    technology: [
      { id: '1', name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
      { id: '2', name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
      { id: '3', name: 'Technical Interview', order: 3, color: '#44916F', description: 'Technical assessment' },
      { id: '4', name: 'Final Round', order: 4, color: '#247D7F', description: 'Final interview round' },
      { id: '5', name: 'Offer', order: 5, color: '#80B9C8', description: 'Offer received' }
    ],
    business: [
      { id: '1', name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
      { id: '2', name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
      { id: '3', name: 'Case Interview 1', order: 3, color: '#44916F', description: 'First case interview' },
      { id: '4', name: 'Case Interview 2', order: 4, color: '#247D7F', description: 'Second case interview' },
      { id: '5', name: 'Final Round', order: 5, color: '#80B9C8', description: 'Final interview round' },
      { id: '6', name: 'Offer', order: 6, color: '#C29470', description: 'Offer received' }
    ],
    consulting: [
      { id: '1', name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
      { id: '2', name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
      { id: '3', name: 'Case Interview 1', order: 3, color: '#44916F', description: 'First case interview' },
      { id: '4', name: 'Case Interview 2', order: 4, color: '#247D7F', description: 'Second case interview' },
      { id: '5', name: 'Partner Interview', order: 5, color: '#80B9C8', description: 'Partner interview' },
      { id: '6', name: 'Offer', order: 6, color: '#C29470', description: 'Offer received' }
    ],
    finance: [
      { id: '1', name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
      { id: '2', name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
      { id: '3', name: 'Technical Interview', order: 3, color: '#44916F', description: 'Financial modeling/technical' },
      { id: '4', name: 'Superday', order: 4, color: '#247D7F', description: 'Superday interviews' },
      { id: '5', name: 'Final Round', order: 5, color: '#80B9C8', description: 'Final interview round' },
      { id: '6', name: 'Offer', order: 6, color: '#C29470', description: 'Offer received' }
    ],
    marketing: [
      { id: '1', name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
      { id: '2', name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
      { id: '3', name: 'Portfolio Review', order: 3, color: '#44916F', description: 'Portfolio/past work review' },
      { id: '4', name: 'Creative Interview', order: 4, color: '#247D7F', description: 'Creative assessment' },
      { id: '5', name: 'Final Round', order: 5, color: '#80B9C8', description: 'Final interview round' },
      { id: '6', name: 'Offer', order: 6, color: '#C29470', description: 'Offer received' }
    ],
    custom: [
      { id: '1', name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
      { id: '2', name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
      { id: '3', name: 'Interview 1', order: 3, color: '#44916F', description: 'First interview round' },
      { id: '4', name: 'Interview 2', order: 4, color: '#247D7F', description: 'Second interview round' },
      { id: '5', name: 'Final Round', order: 5, color: '#80B9C8', description: 'Final interview round' },
      { id: '6', name: 'Offer', order: 6, color: '#C29470', description: 'Offer received' }
    ]
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [entriesData, companiesData, stagesData] = await Promise.all([
        airtableService.getTimelineEntries(),
        airtableService.getCompanies(),
        airtableService.getStages()
      ]);
      
      setEntries(entriesData);
      setCompanies(companiesData);
      setStages(stagesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (newEntry: Omit<TimelineEntry, 'id'>) => {
    const added = await airtableService.addTimelineEntry(newEntry);
    if (added) {
      setEntries([...entries, added]);
    }
  };

  const handleUpdateEntry = async (id: string, updates: Partial<TimelineEntry>) => {
    const success = await airtableService.updateTimelineEntry(id, updates);
    if (success) {
      setEntries(entries.map(entry => 
        entry.id === id ? { ...entry, ...updates } : entry
      ));
    }
  };

  const getStats = () => {
    const total = entries.length;
    const active = entries.filter(e => e.status === 'active').length;
    const accepted = entries.filter(e => e.status === 'accepted').length;
    const rejected = entries.filter(e => e.status === 'rejected').length;
    
    return { total, active, accepted, rejected };
  };

  const getStagesForEntry = (entry: TimelineEntry) => {
    //default to technology stages
    return industryStages.technology;
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', color: colors.primary }}>Loading...</div>
        </div>
      </DashboardContainer>
    );
  }

  const stats = getStats();

  return (
    <DashboardContainer>
      <Header>
        <Title>Internship Timeline Tracker</Title>
        <Subtitle>Visualize your job hunt journey across companies</Subtitle>
      </Header>

      <StatsGrid>
        <StatsCard
          title="Total Applications"
          value={stats.total}
          color={colors.primary}
          icon="📝"
        />
        <StatsCard
          title="Active Applications"
          value={stats.active}
          color={colors.accent}
          icon="⏳"
        />
        <StatsCard
          title="Accepted"
          value={stats.accepted}
          color={colors.secondary}
          icon="✅"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          color={colors.teal}
          icon="❌"
        />
      </StatsGrid>

      <ViewToggle>
        <ToggleButton 
          active={viewMode === 'timeline'} 
          onClick={() => setViewMode('timeline')}
        >
          📋 Timeline View
        </ToggleButton>
        <ToggleButton 
          active={viewMode === 'chart'} 
          onClick={() => setViewMode('chart')}
        >
          📊 Progress Chart
        </ToggleButton>
      </ViewToggle>

      <MainContent>
        <TimelineSection>
          {viewMode === 'timeline' ? (
            <TimelineVisualization
              entries={entries}
              companies={companies}
              stages={stages}
              onUpdateEntry={handleUpdateEntry}
            />
          ) : (
            <ProgressChart
              entries={entries}
              companies={companies}
              stages={stages}
            />
          )}
        </TimelineSection>

        <FormSection>
          <ApplicationForm
            companies={companies}
            stages={stages}
            onSubmit={handleAddEntry}
          />
        </FormSection>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard; 