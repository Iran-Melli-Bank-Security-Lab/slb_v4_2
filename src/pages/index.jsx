import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

// Styled Components
const FormContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-top: 1rem;
  max-width: 900px;
`;

const FormHeader = styled.h3`
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
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
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
`;

const FileUpload = styled.div`
  border: 2px dashed #ddd;
  padding: 2rem;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
  position: relative;
  transition: all 0.3s ease;
  background: ${props => props.isDragActive ? '#f8fafc' : 'white'};

  &:hover {
    border-color: #6366f1;
    background: #f8fafc;
  }
`;

const FilePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const FilePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background: #f1f5f9;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveFileButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-size: 12px;
`;

const PreviewSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 4px;
  border: 1px solid #eee;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;

  &.primary {
    background: #6366f1;
    color: white;

    &:hover {
      background: #4f46e5;
    }
  }

  &.secondary {
    background: #f1f5f9;
    color: #334155;

    &:hover {
      background: #e2e8f0;
    }
  }

  &.danger {
    background: #fee2e2;
    color: #b91c1c;

    &:hover {
      background: #fecaca;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

// Main Component
const VulnerabilityForm = ({ 
  onSave, 
  onCancel, 
  title = "Report Vulnerability",
  initialData = null 
}) => {
  const [formData, setFormData] = useState(initialData || {
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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle file uploads with react-dropzone
  const onDropImages = useCallback(acceptedFiles => {
    handleFileUpload(acceptedFiles, 'pocImages');
  }, []);

  const onDropVideos = useCallback(acceptedFiles => {
    handleFileUpload(acceptedFiles, 'pocVideos');
  }, []);

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive
  } = useDropzone({
    onDrop: onDropImages,
    accept: 'image/*',
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDragActive
  } = useDropzone({
    onDrop: onDropVideos,
    accept: 'video/*',
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileUpload = (files, type) => {
    const validFiles = files.filter(file => {
      if (type === 'pocImages' && !file.type.startsWith('image/')) return false;
      if (type === 'pocVideos' && !file.type.startsWith('video/')) return false;
      return true;
    });

    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...validFiles]
    }));
  };

  const removeFile = (type, index) => {
    const updatedFiles = [...formData[type]];
    updatedFiles.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      [type]: updatedFiles
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Vulnerability name is required';
    if (!formData.path.trim()) newErrors.path = 'Vulnerable path is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.exploit.trim()) newErrors.exploit = 'Exploit details are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const reportData = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      onSave(reportData);
    } catch (error) {
      console.error('Error saving report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormHeader>
          {title}
          {initialData && (
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Editing report
            </span>
          )}
        </FormHeader>
        
        <FormGrid>
          <FormField>
            <Label>Vulnerability Name*</Label>
            <Input 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="Reflected XSS in search parameter"
              hasError={!!errors.name}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormField>

          <FormField>
            <Label>CVSS Version</Label>
            <Select name="cvss" value={formData.cvss} onChange={handleChange}>
              <option value="3.1">CVSS 3.1</option>
              <option value="3.0">CVSS 3.0</option>
            </Select>
          </FormField>

          <FormField>
            <Label>Severity*</Label>
            <Select name="severity" value={formData.severity} onChange={handleChange}>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </FormField>

          <FormField>
            <Label>Vulnerable Path*</Label>
            <Input 
              name="path" 
              value={formData.path} 
              onChange={handleChange}
              placeholder="/search?q=<script>alert(1)</script>"
              hasError={!!errors.path}
            />
            {errors.path && <ErrorMessage>{errors.path}</ErrorMessage>}
          </FormField>
        </FormGrid>

        <FormField>
          <Label>Description*</Label>
          <TextArea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            placeholder="Detailed description of the vulnerability..."
            hasError={!!errors.description}
          />
          {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label>Exploit Details*</Label>
          <TextArea 
            name="exploit" 
            value={formData.exploit} 
            onChange={handleChange}
            placeholder="Steps to reproduce the vulnerability..."
            hasError={!!errors.exploit}
          />
          {errors.exploit && <ErrorMessage>{errors.exploit}</ErrorMessage>}
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
          <FileUpload {...getImageRootProps()} isDragActive={isImageDragActive}>
            <input {...getImageInputProps()} />
            {isImageDragActive ? (
              <p>Drop the screenshots here...</p>
            ) : (
              <p>Drag & drop screenshots, or click to select</p>
            )}
          </FileUpload>
          
          {formData.pocImages.length > 0 && (
            <FilePreviewContainer>
              {formData.pocImages.map((file, index) => (
                <FilePreview key={index}>
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`POC Screenshot ${index + 1}`}
                  />
                  <RemoveFileButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile('pocImages', index);
                    }}
                    title="Remove file"
                  >
                    ×
                  </RemoveFileButton>
                </FilePreview>
              ))}
            </FilePreviewContainer>
          )}
        </FormField>

        <FormField>
          <Label>Proof of Concept (Screen Recordings)</Label>
          <FileUpload {...getVideoRootProps()} isDragActive={isVideoDragActive}>
            <input {...getVideoInputProps()} />
            {isVideoDragActive ? (
              <p>Drop the recordings here...</p>
            ) : (
              <p>Drag & drop screen recordings, or click to select</p>
            )}
          </FileUpload>
          
          {formData.pocVideos.length > 0 && (
            <FilePreviewContainer>
              {formData.pocVideos.map((file, index) => (
                <FilePreview key={index}>
                  <video controls>
                    <source src={URL.createObjectURL(file)} type={file.type} />
                  </video>
                  <RemoveFileButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile('pocVideos', index);
                    }}
                    title="Remove file"
                  >
                    ×
                  </RemoveFileButton>
                </FilePreview>
              ))}
            </FilePreviewContainer>
          )}
        </FormField>

        <PreviewSection>
          <h4>Report Preview</h4>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Name:</strong> {formData.name || 'Not specified'}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Severity:</strong> {formData.severity} (CVSS {formData.cvss})
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Path:</strong> {formData.path || 'Not specified'}
          </div>
          <div>
            <strong>Attachments:</strong> {formData.pocImages.length + formData.pocVideos.length} files
          </div>
        </PreviewSection>

        <ButtonGroup>
          <Button 
            type="submit" 
            className="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Report'}
          </Button>
          <Button 
            type="button" 
            className="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default VulnerabilityForm;