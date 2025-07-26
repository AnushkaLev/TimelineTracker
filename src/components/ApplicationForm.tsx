import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';
import { Company, ApplicationStage, TimelineEntry } from '../types';

const FormContainer = styled.div`
  width: 100%;
`;
const FormTitle = styled.h3`
  font-size: 1.5rem;
  color: ${colors.teal};
  margin: 0 0 1.5rem 0;
  text-align: center;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.gray.dark};
`;
const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${colors.gray.light};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: ${colors.accent};
  }
`;
const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid ${colors.gray.light};
  border-radius: 8px;
  font-size: 1rem;
  background: ${colors.white};
  cursor: pointer;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: ${colors.accent};
  }
`;
const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid ${colors.gray.light};
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: ${colors.accent};
  }
`;
const SubmitButton = styled.button`
  padding: 1rem;
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  &:hover {
    background: ${colors.accent};
    transform: translateY(-1px);
  }
  &:disabled {
    background: ${colors.gray.medium};
    cursor: not-allowed;
    transform: none;
  }
`;
const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;
const SuccessMessage = styled.div`
  color: ${colors.accent};
  font-size: 0.85rem;
  margin-top: 0.25rem;
  text-align: center;
`;
const IndustryInfo = styled.div`
  padding: 0.75rem;
  background: ${colors.cream};
  border-radius: 8px;
  font-size: 0.85rem;
  color: ${colors.gray.dark};
  margin-top: 0.5rem;
`;

interface ApplicationFormProps {
  companies: Company[];
  stages: ApplicationStage[];
  onSubmit: (entry: Omit<TimelineEntry, 'id'>) => void;
}

//templates
const industryStages = {
  technology: [
    { name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
    { name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
    { name: 'Technical Interview', order: 3, color: '#44916F', description: 'Technical assessment' },
    { name: 'Final Round', order: 4, color: '#247D7F', description: 'Final interview round' },
    { name: 'Offer', order: 5, color: '#80B9C8', description: 'Offer received' }
  ],
  business: [
    { name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
    { name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
    { name: 'Case Interview 1', order: 3, color: '#44916F', description: 'First case interview' },
    { name: 'Case Interview 2', order: 4, color: '#247D7F', description: 'Second case interview' },
    { name: 'Final Round', order: 5, color: '#80B9C8', description: 'Final interview round' },
    { name: 'Offer', order: 6, color: '#C29470', description: 'Offer received' }
  ],
  consulting: [
    { name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
    { name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
    { name: 'Case Interview 1', order: 3, color: '#44916F', description: 'First case interview' },
    { name: 'Case Interview 2', order: 4, color: '#247D7F', description: 'Second case interview' },
    { name: 'Partner Interview', order: 5, color: '#80B9C8', description: 'Partner interview' },
    { name: 'Offer', order: 6, color: '#C29470', description: 'Offer received' }
  ],
  finance: [
    { name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
    { name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
    { name: 'Technical Interview', order: 3, color: '#44916F', description: 'Financial modeling/technical' },
    { name: 'Superday', order: 4, color: '#247D7F', description: 'Superday interviews' },
    { name: 'Final Round', order: 5, color: '#80B9C8', description: 'Final interview round' },
    { name: 'Offer', order: 6, color: '#C29470', description: 'Offer received' }
  ],
  marketing: [
    { name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
    { name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
    { name: 'Portfolio Review', order: 3, color: '#44916F', description: 'Portfolio/past work review' },
    { name: 'Creative Interview', order: 4, color: '#247D7F', description: 'Creative assessment' },
    { name: 'Final Round', order: 5, color: '#80B9C8', description: 'Final interview round' },
    { name: 'Offer', order: 6, color: '#C29470', description: 'Offer received' }
  ],
  custom: [
    { name: 'Applied', order: 1, color: '#C29470', description: 'Application submitted' },
    { name: 'Screening', order: 2, color: '#B2D9C4', description: 'Initial screening call' },
    { name: 'Interview 1', order: 3, color: '#44916F', description: 'First interview round' },
    { name: 'Interview 2', order: 4, color: '#247D7F', description: 'Second interview round' },
    { name: 'Final Round', order: 5, color: '#80B9C8', description: 'Final interview round' },
    { name: 'Offer', order: 6, color: '#C29470', description: 'Offer received' }
  ]
};

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  companies,
  stages,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    industry: 'technology',
    applicationDate: new Date().toISOString().split('T')[0],
    currentStage: '',
    notes: '',
    status: 'active' as const
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentIndustryStages = industryStages[formData.industry as keyof typeof industryStages] || industryStages.technology;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Please enter a company name';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Please enter a position';
    }
    
    if (!formData.applicationDate) {
      newErrors.applicationDate = 'Please select an application date';
    }
    
    if (!formData.currentStage) {
      newErrors.currentStage = 'Please select a current stage';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newEntry: Omit<TimelineEntry, 'id'> = {
        companyId: formData.companyName, //using company name as ID for now
        position: formData.position,
        applicationDate: formData.applicationDate,
        currentStage: formData.currentStage,
        notes: formData.notes,
        status: formData.status,
        lastUpdated: new Date().toISOString()
      };
      
      await onSubmit(newEntry);
      
      //reset form
      setFormData({
        companyName: '',
        position: '',
        industry: 'technology',
        applicationDate: new Date().toISOString().split('T')[0],
        currentStage: '',
        notes: '',
        status: 'active'
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    //reset current stage when industry changes
    if (field === 'industry') {
      setFormData(prev => ({ ...prev, currentStage: '' }));
    }
  };

  return (
    <FormContainer>
      <FormTitle>Add New Application</FormTitle>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="company">Company Name *</Label>
          <Input
            id="company"
            type="text"
            placeholder="e.g., Google, McKinsey, Goldman Sachs"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
          />
          {errors.companyName && <ErrorMessage>{errors.companyName}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            type="text"
            placeholder="e.g., Software Engineering Intern, Business Analyst"
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
          />
          {errors.position && <ErrorMessage>{errors.position}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="industry">Industry *</Label>
          <Select
            id="industry"
            value={formData.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
          >
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="consulting">Consulting</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
            <option value="custom">Custom</option>
          </Select>
          <IndustryInfo>
            <strong>Industry Stages:</strong> {currentIndustryStages.map(stage => stage.name).join(' → ')}
          </IndustryInfo>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="applicationDate">Application Date *</Label>
          <Input
            id="applicationDate"
            type="date"
            value={formData.applicationDate}
            onChange={(e) => handleInputChange('applicationDate', e.target.value)}
          />
          {errors.applicationDate && <ErrorMessage>{errors.applicationDate}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="currentStage">Current Stage *</Label>
          <Select
            id="currentStage"
            value={formData.currentStage}
            onChange={(e) => handleInputChange('currentStage', e.target.value)}
          >
            <option value="">Select current stage</option>
            {currentIndustryStages.map(stage => (
              <option key={stage.order} value={stage.order.toString()}>
                {stage.name}
              </option>
            ))}
          </Select>
          {errors.currentStage && <ErrorMessage>{errors.currentStage}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option value="active">Active</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <TextArea
            id="notes"
            placeholder="Add any notes about this application..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Application'}
        </SubmitButton>

        {showSuccess && (
          <SuccessMessage>
            Application added successfully!
          </SuccessMessage>
        )}
      </Form>
    </FormContainer>
  );
};

export default ApplicationForm; 