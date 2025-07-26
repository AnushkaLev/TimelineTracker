import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';
import { TimelineEntry, Company, ApplicationStage } from '../types';

const TimelineContainer = styled.div`
  width: 100%;
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: ${colors.teal};
  margin: 0;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid ${colors.secondary};
  border-radius: 8px;
  background: ${colors.white};
  color: ${colors.teal};
  font-size: 0.9rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${colors.accent};
  }
`;

const TimelineGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const CompanyCard = styled.div<{ status: string }>`
  background: ${colors.white};
  border: 2px solid ${props => {
    switch (props.status) {
      case 'accepted': return colors.secondary;
      case 'rejected': return colors.teal;
      case 'withdrawn': return colors.gray.medium;
      default: return colors.primary;
    }
  }};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CompanyLogo = styled.div`
  width: 50px;
  height: 50px;
  background: ${colors.blue};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: ${colors.white};
  font-size: 1.2rem;
`;

const CompanyDetails = styled.div`
  flex: 1;
`;

const CompanyName = styled.h3`
  font-size: 1.2rem;
  color: ${colors.teal};
  margin: 0 0 0.25rem 0;
`;

const Position = styled.p`
  font-size: 1rem;
  color: ${colors.gray.dark};
  margin: 0;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'accepted': return colors.secondary;
      case 'rejected': return colors.teal;
      case 'withdrawn': return colors.gray.light;
      default: return colors.primary;
    }
  }};
  color: ${colors.white};
`;

const TimelineProgress = styled.div`
  margin: 1rem 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${colors.gray.light};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ progress: number; color: string }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: ${props => props.color};
  transition: width 0.3s ease;
`;

const StageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: ${colors.gray.dark};
`;

const CurrentStage = styled.span`
  font-weight: 600;
  color: ${colors.accent};
`;

const DateInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: ${colors.gray.medium};
  margin-top: 1rem;
`;

const Notes = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: ${colors.cream};
  border-radius: 8px;
  font-size: 0.9rem;
  color: ${colors.gray.dark};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${colors.gray.medium};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

interface TimelineVisualizationProps {
  entries: TimelineEntry[];
  companies: Company[];
  stages: ApplicationStage[];
  onUpdateEntry: (id: string, updates: Partial<TimelineEntry>) => void;
}

const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  entries,
  companies,
  stages,
  onUpdateEntry
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');

  const filteredEntries = entries.filter(entry => {
    const statusMatch = statusFilter === 'all' || entry.status === statusFilter;
    const companyMatch = companyFilter === 'all' || entry.companyId === companyFilter;
    return statusMatch && companyMatch;
  });

  // Get unique company names from entries
  const uniqueCompanies = Array.from(new Set(entries.map(entry => entry.companyId)));

  const getStageById = (id: string) => stages.find(s => s.id === id);

  const getProgressPercentage = (entry: TimelineEntry) => {
    const currentStage = getStageById(entry.currentStage);
    if (!currentStage) return 0;
    
    const stageIndex = stages.findIndex(s => s.id === entry.currentStage);
    return ((stageIndex + 1) / stages.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return colors.secondary;
      case 'rejected': return colors.teal;
      case 'withdrawn': return colors.gray.medium;
      default: return colors.primary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (entries.length === 0) {
    return (
      <TimelineContainer>
        <TimelineHeader>
          <Title>Application Timeline</Title>
        </TimelineHeader>
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <h3>No applications yet</h3>
          <p>Add your first internship application to start tracking your timeline!</p>
        </EmptyState>
      </TimelineContainer>
    );
  }

  return (
    <TimelineContainer>
      <TimelineHeader>
        <Title>Application Timeline</Title>
        <FilterContainer>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </FilterSelect>
          <FilterSelect
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="all">All Companies</option>
            {uniqueCompanies.map(companyName => (
              <option key={companyName} value={companyName}>
                {companyName}
              </option>
            ))}
          </FilterSelect>
        </FilterContainer>
      </TimelineHeader>

      <TimelineGrid>
        {filteredEntries.map(entry => {
          const currentStage = getStageById(entry.currentStage);
          const progress = getProgressPercentage(entry);
          const statusColor = getStatusColor(entry.status);

          return (
            <CompanyCard
              key={entry.id}
              status={entry.status}
              onClick={() => onUpdateEntry(entry.id, { status: 'active' })}
            >
              <CompanyHeader>
                <CompanyInfo>
                  <CompanyLogo>
                    {entry.companyId.charAt(0).toUpperCase()}
                  </CompanyLogo>
                  <CompanyDetails>
                    <CompanyName>{entry.companyId}</CompanyName>
                    <Position>{entry.position}</Position>
                  </CompanyDetails>
                </CompanyInfo>
                <StatusBadge status={entry.status}>
                  {entry.status}
                </StatusBadge>
              </CompanyHeader>

              <TimelineProgress>
                <ProgressBar>
                  <ProgressFill progress={progress} color={statusColor} />
                </ProgressBar>
                <StageInfo>
                  <span>Progress</span>
                  <CurrentStage>
                    {currentStage?.name || 'Unknown Stage'}
                  </CurrentStage>
                </StageInfo>
              </TimelineProgress>

              <DateInfo>
                <span>Applied: {formatDate(entry.applicationDate)}</span>
                <span>Updated: {formatDate(entry.lastUpdated)}</span>
              </DateInfo>

              {entry.notes && (
                <Notes>
                  <strong>Notes:</strong> {entry.notes}
                </Notes>
              )}
            </CompanyCard>
          );
        })}
      </TimelineGrid>
    </TimelineContainer>
  );
};

export default TimelineVisualization; 