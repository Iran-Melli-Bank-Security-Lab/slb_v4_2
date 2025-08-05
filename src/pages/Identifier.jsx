import React, { useEffect, useState } from 'react';
import { 
  Stepper, Step, StepLabel, Button, 
  TextField, FormControl, InputLabel, 
  Select, MenuItem, Typography, Box, Paper, 
  CircularProgress
} from '@mui/material';
import { useParams } from 'react-router';
import { styled } from '@mui/system';
import { postIdentifier } from '../api/projects/postIdentifier';
import { toast } from 'react-toastify';

const steps = ['Project Details', 'Organizational Unit', 'Beneficiary', 'Datacenter'];

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  backgroundColor: 'white',
  maxWidth: '800px',
  margin: 'auto',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
    maxWidth: '100%',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748B',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: '12px',
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
  },
  '& .MuiInputLabel-root': {
    color: '#64748B',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const ProgressButton = styled(Button)(({ theme }) => ({
  padding: '12px 24px',
  borderRadius: '12px',
  fontWeight: '600',
  textTransform: 'none',
  fontSize: '16px',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: 'none',
    transform: 'translateY(-2px)',
  },
}));

const StepIcon = styled('div')(({ theme, active }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.primary.main : '#E2E8F0',
  color: active ? 'white' : '#64748B',
  fontWeight: 'bold',
}));

function Identifier() {
  const { projectId } = useParams();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    developer: '',
    certificateRequest: 'Yes',
    employer: '',
    organizationalUnitName: '',
    projectManagerName: '',
    unitPhoneNumber: '',
    beneficiaryOffice: '',
    followerName: '',
    beneficiaryPhoneNumber: '',
    datacenterName: '',
    responsibleName: '',
    datacenterPhoneNumber: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axiosPrivate.get(`${serverIp}project/complete/${projectId}`);
        if (response.data) {
          setFormData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch project data:', error);
      } finally {
        setLoading(false);
      }
    };

    // fetchProjectData();
  }, [projectId]);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.developer.trim()) newErrors.developer = 'Developer name is required';
      if (!formData.employer.trim()) newErrors.employer = 'Employer is required';
      if (!formData.certificateRequest) newErrors.certificateRequest = 'Certificate Request is required';
    }
    
    if (step === 1) {
      if (!formData.organizationalUnitName.trim()) newErrors.organizationalUnitName = 'Organizational Unit Name is required';
      if (!formData.projectManagerName.trim()) newErrors.projectManagerName = 'Project Manager Name is required';
    }
    
    if (step === 2) {
      if (!formData.beneficiaryOffice.trim()) newErrors.beneficiaryOffice = 'Beneficiary Office is required';
      if (!formData.followerName.trim()) newErrors.followerName = 'Follower Name is required';
    }
    
    if (step === 3) {
      if (!formData.datacenterName.trim()) newErrors.datacenterName = 'Datacenter Name is required';
      if (!formData.responsibleName.trim()) newErrors.responsibleName = 'Responsible Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setLoading(true);
      setTimeout(() => {
        setActiveStep((prev) => prev + 1);
        setLoading(false);
      }, 100);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      try {
        await postIdentifier(projectId, formData);
        toast.success('Project data submitted successfully!', {
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            borderRadius: '12px',
            background: '#F8FAFC',
            color: '#1E293B',
            borderLeft: '6px solid #10B981',
          },
        });
      } catch (error) {
        toast.error('There was an error submitting the data. Please try again.', {
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            borderRadius: '12px',
            background: '#F8FAFC',
            color: '#1E293B',
            borderLeft: '6px solid #EF4444',
          },
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="grid grid-cols-1 gap-6">
            <StyledTextField
              label="Developer Name"
              name="developer"
              value={formData.developer}
              onChange={handleChange}
              fullWidth
              error={!!errors.developer}
              helperText={errors.developer}
            />
            
            <StyledTextField
              label="Employer"
              name="employer"
              value={formData.employer}
              onChange={handleChange}
              fullWidth
              error={!!errors.employer}
              helperText={errors.employer}
            />
            
            <FormControl fullWidth>
              <InputLabel id="certificateRequest-label">Certificate Request</InputLabel>
              <StyledSelect
                labelId="certificateRequest-label"
                name="certificateRequest"
                value={formData.certificateRequest}
                onChange={handleChange}
                label="Certificate Request"
                error={!!errors.certificateRequest}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </StyledSelect>
              {errors.certificateRequest && (
                <Typography color="error" variant="body2" sx={{ mt: -2, mb: 2 }}>
                  {errors.certificateRequest}
                </Typography>
              )}
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box className="grid grid-cols-1 gap-6">
            <StyledTextField
              label="Organizational Unit Name"
              name="organizationalUnitName"
              value={formData.organizationalUnitName}
              onChange={handleChange}
              fullWidth
              error={!!errors.organizationalUnitName}
              helperText={errors.organizationalUnitName}
            />
            <StyledTextField
              label="Project Manager Name"
              name="projectManagerName"
              value={formData.projectManagerName}
              onChange={handleChange}
              fullWidth
              error={!!errors.projectManagerName}
              helperText={errors.projectManagerName}
            />
            <StyledTextField
              label="Phone Number"
              name="unitPhoneNumber"
              value={formData.unitPhoneNumber}
              onChange={handleChange}
              fullWidth
              placeholder="9137033909"
            />
          </Box>
        );
      case 2:
        return (
          <Box className="grid grid-cols-1 gap-6">
            <StyledTextField
              label="Beneficiary Office"
              name="beneficiaryOffice"
              value={formData.beneficiaryOffice}
              onChange={handleChange}
              fullWidth
              error={!!errors.beneficiaryOffice}
              helperText={errors.beneficiaryOffice}
            />
            <StyledTextField
              label="Follower Name"
              name="followerName"
              value={formData.followerName}
              onChange={handleChange}
              fullWidth
              error={!!errors.followerName}
              helperText={errors.followerName}
            />
            <StyledTextField
              label="Phone Number"
              name="beneficiaryPhoneNumber"
              value={formData.beneficiaryPhoneNumber}
              onChange={handleChange}
              fullWidth
              placeholder="9137033909"
            />
          </Box>
        );
      case 3:
        return (
          <Box className="grid grid-cols-1 gap-6">
            <StyledTextField
              label="Datacenter Name"
              name="datacenterName"
              value={formData.datacenterName}
              onChange={handleChange}
              fullWidth
              error={!!errors.datacenterName}
              helperText={errors.datacenterName}
            />
            <StyledTextField
              label="Responsible Name"
              name="responsibleName"
              value={formData.responsibleName}
              onChange={handleChange}
              fullWidth
              error={!!errors.responsibleName}
              helperText={errors.responsibleName}
            />
            <StyledTextField
              label="Phone Number"
              name="datacenterPhoneNumber"
              value={formData.datacenterPhoneNumber}
              onChange={handleChange}
              fullWidth
              placeholder="9137033909"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
      <FormContainer>
        <Box className="text-center mb-8">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2" sx={{ fontWeight: 700 }}>
            Project Identifier Form
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600" sx={{ color: '#64748B' }}>
            Complete all steps to register your project
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                StepIconComponent={(props) => (
                  <StepIcon active={props.active || props.completed}>
                    {index + 1}
                  </StepIcon>
                )}
                sx={{
                  '& .MuiStepLabel-label': {
                    color: activeStep === index ? '#1E293B' : '#64748B',
                    fontWeight: activeStep === index ? 600 : 400,
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {false ? (
          <Box className="flex justify-center items-center h-64">
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Box className="mb-8">
            {renderStepContent(activeStep)}
          </Box>
        )}

        <Box className="flex justify-between mt-8">
          <ProgressButton
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            sx={{
              color: '#64748B',
              borderColor: '#E2E8F0',
              '&:hover': {
                borderColor: '#CBD5E1',
                backgroundColor: '#F8FAFC',
              },
            }}
          >
            Back
          </ProgressButton>
          
          {activeStep === steps.length - 1 ? (
            <ProgressButton
              onClick={handleSubmit}
              variant="contained"
              sx={{
                backgroundColor: '#3B82F6',
                '&:hover': {
                  backgroundColor: '#2563EB',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </ProgressButton>
          ) : (
            <ProgressButton
              onClick={handleNext}
              variant="contained"
              sx={{
                backgroundColor: '#3B82F6',
                '&:hover': {
                  backgroundColor: '#2563EB',
                },
              }}
            >
              Next
            </ProgressButton>
          )}
        </Box>
      </FormContainer>
    </Box>
  );
}

export default Identifier;