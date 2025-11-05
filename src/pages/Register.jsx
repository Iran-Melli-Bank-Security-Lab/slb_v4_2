import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Avatar,
  Grid,
  Alert,
  FormGroup,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { registerUserApi } from '../api/auth/registerUserApi';

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    repeatPassword: '',
    devOps: false,
    security: false,
    qualityAssurance: false,
    profileImage: null,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profileImage: 'Please select an image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'Image size should be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, profileImage: file }));
      setErrors(prev => ({ ...prev, profileImage: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Repeat password validation
    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match';
    }

    // Checkbox validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData object to handle file upload
      const submitFormData = new FormData();

      // Add text fields
      submitFormData.append('firstName', formData.firstName);
      submitFormData.append('lastName', formData.lastName);
      submitFormData.append('username', formData.username);
      submitFormData.append('password', formData.password);
      // Add team selections
      submitFormData.append('devOps', formData.devOps);
      submitFormData.append('security', formData.security);
      submitFormData.append('qualityAssurance', formData.qualityAssurance);

   
      // Add profile image if exists
      if (formData.profileImage) {
        submitFormData.append('profileImageUrl', formData.profileImage);
      }



      const response = await registerUserApi(submitFormData)
      setSnackbar({
        open: true,
        message: 'Registration successful!',
        severity: 'success'
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        repeatPassword: '',
        devOps: false,
        security: false,
        qualityAssurance: false,
        profileImage: null,
        agreeToTerms: false,
      });
      setImagePreview('');

      console.log('Registration response:', response.data);

    } catch (error) {
      console.error('Registration error:', error);

      let errorMessage = 'Registration failed. Please try again.';

      if (error.response) {
        // Server responded with error status
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 409) {
          errorMessage = 'Username already exists';
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: 'auto',
        mt: 4,
        p: 3,
      }}
    >
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          User Registration
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Profile Image Upload */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={imagePreview}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              disabled={loading}
            >
              Upload Profile Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
            </Button>
            {errors.profileImage && (
              <Alert severity="error" sx={{ mt: 1, width: '100%' }}>
                {errors.profileImage}
              </Alert>
            )}
          </Box>

          <Grid container spacing={2}>
            {/* First Name Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={loading}
                required
              />
            </Grid>

            {/* Last Name Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={loading}
                required
              />
            </Grid>
          </Grid>

          {/* Username Field */}
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            error={!!errors.username}
            helperText={errors.username}
            margin="normal"
            disabled={loading}
            required
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            disabled={loading}
            required
          />

          {/* Repeat Password Field */}
          <TextField
            fullWidth
            label="Repeat Password"
            name="repeatPassword"
            type="password"
            value={formData.repeatPassword}
            onChange={handleInputChange}
            error={!!errors.repeatPassword}
            helperText={errors.repeatPassword}
            margin="normal"
            disabled={loading}
            required
          />

          {/* Team Section */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Team
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  name="devOps"
                  checked={formData.devOps}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              }
              label="DevOps"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="security"
                  checked={formData.security}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              }
              label="Security"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="qualityAssurance"
                  checked={formData.qualityAssurance}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              }
              label="Quality Assurance"
            />
          </FormGroup>


          {/* Terms and Conditions Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            }
            label="I agree to the terms and conditions"
            sx={{ mt: 2 }}
          />
          {errors.agreeToTerms && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.agreeToTerms}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserRegistration;