import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';
import { TimelineEntry, Company, ApplicationStage } from '../types';

const ChartContainer = styled.div`
  background: ${colors.white};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.8rem;
  color: ${colors.teal};
  margin: 0 0 2rem 0;
  text-align: center;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  align-items: start;
`;

const StageLabels = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
`;

const StageLabel = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.gray.dark};
  height: 40px;
`;

const StageColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  flex-shrink: 0;
`;

const ChartArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CompanyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${colors.gray.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const CompanyName = styled.div`
  width: 150px;
  font-weight: 600;
  color: ${colors.teal};
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const ProgressBars = styled.div`
  display: flex;
  gap: 0.5rem;
  flex: 1;
  align-items: center;
`;

const ProgressBar = styled.div<{ 
  width: number; 
  color: string; 
  isActive: boolean;
  isCompleted: boolean;
}>`
  height: 8px;
  background: ${props => {
    if (props.isCompleted) return props.color;
    if (props.isActive) return props.color;
    return colors.gray.light;
  }};
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.isActive && `
    box-shadow: 0 0 8px ${props.color}40;
  `}
`;

const StageIndicator = styled.div<{ 
  color: string; 
  isActive: boolean;
  isCompleted: boolean;
}>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => {
    if (props.isCompleted) return props.color;
    if (props.isActive) return props.color;
    return colors.gray.light;
  }};
  border: 2px solid ${colors.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  ${props => props.isActive && `
    transform: scale(1.2);
    box-shadow: 0 0 12px ${props.color}60;
  `}
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'accepted': return colors.secondary;
      case 'rejected': return colors.teal;
      case 'withdrawn': return colors.gray.medium;
      default: return colors.primary;
    }
  }};
  color: ${colors.white};
  margin-left: auto;
  flex-shrink: 0;
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

interface ProgressChartProps {
  entries: TimelineEntry[];
  companies: Company[];
  stages: ApplicationStage[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  entries,
  companies,
  stages
}) => {
  const uniqueCompanies = Array.from(new Set(entries.map(entry => entry.companyId)));
  const getStageById = (id: string) => stages.find(s => s.id === id);

  const getCompanyProgress = (companyName: string) => {
    const entry = entries.find(e => e.companyId === companyName);
    if (!entry) return null;
    
    const currentStage = getStageById(entry.currentStage);
    if (!currentStage) return null;
    
    const stageIndex = stages.findIndex(s => s.id === entry.currentStage);
    return {
      entry,
      currentStage,
      stageIndex,
      progress: ((stageIndex + 1) / stages.length) * 100
    };
  };

  if (uniqueCompanies.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>Application Progress Chart</ChartTitle>
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <h3>No applications yet</h3>
          <p>Add your first application to see the progress chart!</p>
        </EmptyState>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartTitle>Application Progress Chart</ChartTitle>
      
      <ChartGrid>
        <StageLabels>
          {stages.map((stage, index) => (
            <StageLabel key={stage.id} color={stage.color}>
              <StageColor color={stage.color} />
              {stage.name}
            </StageLabel>
          ))}
        </StageLabels>
        
        <ChartArea>
          {uniqueCompanies.map(companyName => {
            const progress = getCompanyProgress(companyName);
            if (!progress) return null;
            
            return (
              <CompanyRow key={companyName}>
                <CompanyName>{companyName}</CompanyName>
                
                <ProgressBars>
                  {stages.map((stage, index) => {
                    const isCompleted = index < progress.stageIndex;
                    const isActive = index === progress.stageIndex;
                    const barWidth = 100 / stages.length;
                    
                    return (
                      <ProgressBar
                        key={stage.id}
                        width={barWidth}
                        color={stage.color}
                        isActive={isActive}
                        isCompleted={isCompleted}
                        style={{ width: `${barWidth}%` }}
                      >
                        {isActive && (
                          <StageIndicator
                            color={stage.color}
                            isActive={isActive}
                            isCompleted={isCompleted}
                          />
                        )}
                      </ProgressBar>
                    );
                  })}
                </ProgressBars>
                
                <StatusBadge status={progress.entry.status}>
                  {progress.entry.status}
                </StatusBadge>
              </CompanyRow>
            );
          })}
        </ChartArea>
      </ChartGrid>
    </ChartContainer>
  );
};

export default ProgressChart; 