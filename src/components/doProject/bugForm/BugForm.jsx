import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 2rem;
  margin-top: 1rem;
  max-width: 900px;
`;

const FormHeader = styled.h3`
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const FileUpload = styled.div`
  border: 2px dashed #ddd;
  padding: 1.5rem;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    border-color: #6366f1;
  }
`;

const PreviewSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 1rem;

  &:hover {
    background: #4f46e5;
  }
`;

const VulnerabilityForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    cvss: '3.1',
    severity: 'Medium',
    path: '',
    exploit: '',
    impact: '',
    description: '',
    remediation: '',
    pocImages: [],
    pocVideos: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      [type]: [...formData[type], ...files]
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <FormContainer>
      <FormHeader>Report Vulnerability</FormHeader>
      
      <FormGrid>
        <FormField>
          <Label>Vulnerability Name</Label>
          <Input 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            placeholder="Reflected XSS in search parameter"
          />
        </FormField>

        <FormField>
          <Label>CVSS Score (v3.1)</Label>
          <Select name="cvss" value={formData.cvss} onChange={handleChange}>
            <option value="3.1">CVSS 3.1</option>
            <option value="3.0">CVSS 3.0</option>
          </Select>
        </FormField>

        <FormField>
          <Label>Severity</Label>
          <Select name="severity" value={formData.severity} onChange={handleChange}>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </FormField>

        <FormField>
          <Label>Vulnerable Path</Label>
          <Input 
            name="path" 
            value={formData.path} 
            onChange={handleChange}
            placeholder="/search?q=<script>alert(1)</script>"
          />
        </FormField>
      </FormGrid>

      <FormField>
        <Label>Description</Label>
        <TextArea 
          name="description" 
          value={formData.description} 
          onChange={handleChange}
          placeholder="Detailed description of the vulnerability..."
        />
      </FormField>

      <FormField>
        <Label>Exploit Details</Label>
        <TextArea 
          name="exploit" 
          value={formData.exploit} 
          onChange={handleChange}
          placeholder="Steps to reproduce the vulnerability..."
        />
      </FormField>

      <FormField>
        <Label>Impact</Label>
        <TextArea 
          name="impact" 
          value={formData.impact} 
          onChange={handleChange}
          placeholder="Potential impact of this vulnerability..."
        />
      </FormField>

      <FormField>
        <Label>Remediation</Label>
        <TextArea 
          name="remediation" 
          value={formData.remediation} 
          onChange={handleChange}
          placeholder="Recommended fixes..."
        />
      </FormField>

      <FormField>
        <Label>Proof of Concept (Screenshots)</Label>
        <FileUpload>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={(e) => handleFileUpload(e, 'pocImages')}
            style={{ display: 'none' }}
            id="pocImages"
          />
          <label htmlFor="pocImages">
            {formData.pocImages.length > 0 
              ? `${formData.pocImages.length} images selected` 
              : 'Click to upload screenshots'}
          </label>
        </FileUpload>
      </FormField>

      <FormField>
        <Label>Proof of Concept (Screen Recordings)</Label>
        <FileUpload>
          <input 
            type="file" 
            multiple 
            accept="video/*" 
            onChange={(e) => handleFileUpload(e, 'pocVideos')}
            style={{ display: 'none' }}
            id="pocVideos"
          />
          <label htmlFor="pocVideos">
            {formData.pocVideos.length > 0 
              ? `${formData.pocVideos.length} videos selected` 
              : 'Click to upload screen recordings'}
          </label>
        </FileUpload>
      </FormField>

      <PreviewSection>
        <h4>Report Preview</h4>
        <div>
          <strong>Name:</strong> {formData.name || 'Not specified'}
        </div>
        <div>
          <strong>Severity:</strong> {formData.severity} (CVSS {formData.cvss})
        </div>
        <div>
          <strong>Path:</strong> {formData.path || 'Not specified'}
        </div>
      </PreviewSection>

      <div style={{ marginTop: '2rem' }}>
        <Button onClick={handleSubmit}>Save Report</Button>
        <Button onClick={onCancel} style={{ background: '#ef4444' }}>Cancel</Button>
      </div>
    </FormContainer>
  );
};

export default VulnerabilityForm;