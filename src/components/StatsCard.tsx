import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';

const Card = styled.div`
  background: ${colors.white};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: ${colors.secondary};
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconContainer = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
`;

const TextContent = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 0.9rem;
  color: ${colors.gray.dark};
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.div<{ color: string }>`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.color};
  margin: 0;
  line-height: 1;
`;

interface StatsCardProps {
  title: string;
  value: number;
  color: string;
  icon: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color, icon }) => {
  return (
    <Card>
      <CardContent>
        <IconContainer color={color}>
          {icon}
        </IconContainer>
        <TextContent>
          <Title>{title}</Title>
          <Value color={color}>{value}</Value>
        </TextContent>
      </CardContent>
    </Card>
  );
};

export default StatsCard; 