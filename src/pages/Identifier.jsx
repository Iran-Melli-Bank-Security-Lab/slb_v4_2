import React, { useEffect, useState } from 'react';
import { 
  Stepper, Step, StepLabel, Button, 
  TextField, FormControl, InputLabel, 
  Select, MenuItem, Typography, Box, Paper, Dialog, 
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  CircularProgress
} from '@mui/material';
import { useParams } from 'react-router';
import { styled } from '@mui/system';
import { postIdentifier } from '../api/projects/postIdentifier';

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
}));

const ProgressButton = styled(Button)(({ theme }) => ({
  padding: '12px 24px',
  borderRadius: '12px',
  fontWeight: '600',
  textTransform: 'none',
  fontSize: '16px',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
}));

function Identifier() {
  const { projectId } = useParams();

  const [activeStep, setActiveStep] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
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
  }, [ projectId]);

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
      if (!/^[0-9]{10}$/.test(formData.unitPhoneNumber)) newErrors.unitPhoneNumber = 'Valid 10-digit phone number is required';
    }
    
    if (step === 2) {
      if (!formData.beneficiaryOffice.trim()) newErrors.beneficiaryOffice = 'Beneficiary Office is required';
      if (!formData.followerName.trim()) newErrors.followerName = 'Follower Name is required';
      if (!/^[0-9]{10}$/.test(formData.beneficiaryPhoneNumber)) newErrors.beneficiaryPhoneNumber = 'Valid 10-digit phone number is required';
    }
    
    if (step === 3) {
      if (!formData.datacenterName.trim()) newErrors.datacenterName = 'Datacenter Name is required';
      if (!formData.responsibleName.trim()) newErrors.responsibleName = 'Responsible Name is required';
      if (!/^[0-9]{10}$/.test(formData.datacenterPhoneNumber)) newErrors.datacenterPhoneNumber = 'Valid 10-digit phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       setActiveStep((prev) => prev + 1);
//     }
//   };


  const handleNext = () => {
    if (validateStep(activeStep)) {
      setLoading(true); // Set loading to true before navigation
      // Simulate async operation (remove this in production)
      setTimeout(() => {
        setActiveStep((prev) => prev + 1);
        setLoading(false); // Set loading to false after navigation
      }, 100);
    }
  };


  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      try {
        await postIdentifier(projectId , formData)
        setIsSuccess(true);
        setDialogMessage('Project data submitted successfully!');
        setOpenDialog(true);
      } catch (error) {
        setIsSuccess(false);
        setDialogMessage('There was an error submitting the data. Please try again.');
        setOpenDialog(true);
      }
    }

  


  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (isSuccess) {
      // Reset form or navigate away on success if needed
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
              error={!!errors.unitPhoneNumber}
              helperText={errors.unitPhoneNumber || "10 digits without spaces or dashes"}
              placeholder="1234567890"
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
              error={!!errors.beneficiaryPhoneNumber}
              helperText={errors.beneficiaryPhoneNumber || "10 digits without spaces or dashes"}
              placeholder="1234567890"
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
              error={!!errors.datacenterPhoneNumber}
              helperText={errors.datacenterPhoneNumber || "10 digits without spaces or dashes"}
              placeholder="1234567890"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <FormContainer>
        <Box className="text-center mb-8">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Project Identifier Form
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600">
            {steps[activeStep]}
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel className="text-gray-600">{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* {loading ? (
          <Box className="flex justify-center items-center h-64">
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Box className="mb-8">
            {renderStepContent(activeStep)}
          </Box>
        )} */}
        {false  ? (
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
            className="text-gray-700 border-gray-300 hover:border-gray-400"
          >
            Back
          </ProgressButton>
          
          {activeStep === steps.length - 1 ? (
            <ProgressButton
              onClick={handleSubmit}
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </ProgressButton>
          ) : (
            <ProgressButton
              onClick={handleNext}
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
            </ProgressButton>
          )}
        </Box>
      </FormContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '20px',
          },
        }}
      >
        <DialogTitle className={isSuccess ? "text-green-600" : "text-red-600"}>
          {isSuccess ? "Success!" : "Error"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-gray-700">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            className={`${isSuccess ? 'text-green-600' : 'text-red-600'} hover:bg-opacity-20`}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Identifier ;