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
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { registerUserApi } from '../api/auth/registerUserApi';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import stylisRTLPlugin from 'stylis-plugin-rtl';

// ✅ ایجاد کش برای پشتیبانی از جهت راست به چپ
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [stylisRTLPlugin],
});

// ✅ ساخت تم MUI با جهت RTL
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'IRANSans, Vazirmatn, Roboto, Arial, sans-serif',
  },
});

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
    severity: 'success',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, profileImage: 'لطفاً یک فایل تصویر انتخاب کنید' }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: 'حجم تصویر باید کمتر از ۵ مگابایت باشد' }));
        return;
      }

      setFormData((prev) => ({ ...prev, profileImage: file }));
      setErrors((prev) => ({ ...prev, profileImage: '' }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!formData.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
    if (!formData.username.trim()) newErrors.username = 'نام کاربری الزامی است';
    else if (formData.username.length < 3)
      newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';
    if (!formData.password) newErrors.password = 'رمز عبور الزامی است';
    else if (formData.password.length < 6)
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    if (formData.password !== formData.repeatPassword)
      newErrors.repeatPassword = 'رمزهای عبور مطابقت ندارند';
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = 'باید با شرایط و قوانین موافقت کنید';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append('firstName', formData.firstName);
      submitFormData.append('lastName', formData.lastName);
      submitFormData.append('username', formData.username);
      submitFormData.append('password', formData.password);
      submitFormData.append('devOps', formData.devOps);
      submitFormData.append('security', formData.security);
      submitFormData.append('qualityAssurance', formData.qualityAssurance);

      if (formData.profileImage) {
        submitFormData.append('profileImageUrl', formData.profileImage);
      }

      const response = await registerUserApi(submitFormData);
      setSnackbar({
        open: true,
        message: 'ثبت‌نام با موفقیت انجام شد!',
        severity: 'success',
      });

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
      let errorMessage = 'ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.';
      if (error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 409) {
          errorMessage = 'نام کاربری از قبل وجود دارد';
        }
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Box
          dir="rtl"
          sx={{
            maxWidth: 500,
            margin: 'auto',
            mt: 4,
            p: 3,
          }}
        >
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              ثبت‌نام کاربر
            </Typography>

            <form onSubmit={handleSubmit}>
              {/* آپلود تصویر پروفایل */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar src={imagePreview} sx={{ width: 100, height: 100, mb: 2 }} />
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  disabled={loading}
                >
                  بارگذاری تصویر پروفایل
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
                  <TextField
                    fullWidth
                    label="نام"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    disabled={loading}
                    required
                  />
             

                  <TextField
                    fullWidth
                    label="نام خانوادگی"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    disabled={loading}
                    required
                  />
              </Grid>

              <TextField
                fullWidth
                label="نام کاربری"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={!!errors.username}
                helperText={errors.username}
                margin="normal"
                disabled={loading}
                required
              />

              <TextField
                fullWidth
                label="رمز عبور"
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

              <TextField
                fullWidth
                label="تأیید رمز عبور"
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

              {/* بخش تیم */}
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                تیم
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
                  label="تیم DevOps"
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
                  label="تیم امنیت"
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
                  label="تیم کنترل کیفیت"
                />
              </FormGroup>

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
                label="با شرایط و قوانین موافقم"
                sx={{ mt: 2 }}
              />
              {errors.agreeToTerms && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.agreeToTerms}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'ثبت‌نام'}
              </Button>
            </form>
          </Paper>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default UserRegistration;
