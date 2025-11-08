import React, { useState, useEffect } from 'react';
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
import { PhotoCamera, Edit } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { getUserInfoById } from '../api/users/getUserInfoById';
import { updateUserApi } from '../api/users/updateUserApi';

// ✅ ایجاد کش برای پشتیبانی از جهت راست به چپ
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, stylisRTLPlugin],
});

// ✅ ساخت تم MUI با جهت RTL
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4338ca',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
    },
  },
  typography: {
    fontFamily: 'Vazirmatn, Tahoma, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
});

// تابع کمکی برای ساخت URL کامل عکس
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  return `${BASE_URL}/${imagePath}`;
};

const UserEditProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    devOps: false,
    security: false,
    qualityAssurance: false,
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // دریافت اطلاعات کاربر از سرور
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setFetchLoading(true);
        const userData = await getUserInfoById(userId);
        
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          username: userData.username || '',
          devOps: userData.devOps || false,
          security: userData.security || false,
          qualityAssurance: userData.qualityAssurance || false,
          profileImage: null,
        });

        // تنظیم عکس فعلی کاربر
        if (userData.profileImageUrl) {
          const fullImageUrl = getFullImageUrl(userData.profileImageUrl);
          setCurrentImageUrl(fullImageUrl);
          setImagePreview(fullImageUrl);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setSnackbar({
          open: true,
          message: 'خطا در دریافت اطلاعات کاربر',
          severity: 'error',
        });
        navigate('/profile');
      } finally {
        setFetchLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, navigate]);

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

      if (file.size > 50 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: 'حجم تصویر باید کمتر از ۵۰ مگابایت باشد' }));
        return;
      }

      setFormData((prev) => ({ ...prev, profileImage: file }));
      setErrors((prev) => ({ ...prev, profileImage: '' }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
    setImagePreview(currentImageUrl);
    setErrors((prev) => ({ ...prev, profileImage: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!formData.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
    if (!formData.username.trim()) newErrors.username = 'نام کاربری الزامی است';
    else if (formData.username.length < 3)
      newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';

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
      submitFormData.append('devOps', formData.devOps);
      submitFormData.append('security', formData.security);
      submitFormData.append('qualityAssurance', formData.qualityAssurance);
      submitFormData.append("userId", userId);

      if (formData.profileImage) {
        // submitFormData.append('profileImage', formData.profileImage);
                submitFormData.append('profileImage', formData.profileImage);

      }


      // ارسال درخواست آپدیت کاربر
      const response = await updateUserApi(submitFormData);
      
      setSnackbar({
        open: true,
        message: 'اطلاعات کاربر با موفقیت به‌روزرسانی شد!',
        severity: 'success',
      });

      // بازگشت به صفحه پروفایل پس از 2 ثانیه
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

      console.log('Update response:', response);
    } catch (error) {
      console.error('Update error:', error);
      let errorMessage = 'به‌روزرسانی انجام نشد. لطفاً دوباره تلاش کنید.';
      
      if (error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 409) {
          errorMessage = 'نام کاربری از قبل وجود دارد';
        } else if (error.response.status === 404) {
          errorMessage = 'کاربر یافت نشد';
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

  const handleCancel = () => {
    navigate('/profile');
  };

  const handleChangePassword = () => {
    navigate(`/change-password/${userId}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // نمایش اسکلتون در حین لودینگ
  if (fetchLoading) {
    return (
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <Box
            dir="rtl"
            sx={{
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 3,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        </ThemeProvider>
      </CacheProvider>
    );
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Box
          dir="rtl"
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            py: 4,
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            }
          }}
        >
          <Box
            sx={{
              maxWidth: 600,
              margin: 'auto',
              p: 3,
            }}
          >
            <Paper 
              elevation={8}
              sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 1 }}>
                ویرایش پروفایل
              </Typography>

              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                در حال ویرایش پروفایل: {formData.firstName} {formData.lastName}
              </Typography>

              {/* دکمه تغییر رمز عبور */}
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleChangePassword}
                  disabled={loading}
                  startIcon={<Edit />}
                  sx={{ borderRadius: 3 }}
                >
                  تغییر رمز عبور
                </Button>
              </Box>

              <form onSubmit={handleSubmit}>
                {/* آپلود تصویر پروفایل */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Avatar 
                      src={imagePreview} 
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        border: '4px solid',
                        borderColor: 'primary.light',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <Edit sx={{ fontSize: 18 }} />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoCamera />}
                      disabled={loading}
                      sx={{ borderRadius: 3 }}
                    >
                      تغییر تصویر
                      <input
                        type="file"
                        hidden
                        name='profileImage'
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={loading}
                      />
                    </Button>

                    {imagePreview && imagePreview !== currentImageUrl && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRemoveImage}
                        disabled={loading}
                        sx={{ borderRadius: 3 }}
                      >
                        حذف تصویر جدید
                      </Button>
                    )}
                  </Box>

                  {currentImageUrl && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      تصویر فعلی شما
                    </Typography>
                  )}

                  {errors.profileImage && (
                    <Alert severity="error" sx={{ mt: 2, width: '100%', borderRadius: 2 }}>
                      {errors.profileImage}
                    </Alert>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
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
                      sx={{ 
                        '& .MuiOutlinedInput-root': { borderRadius: 3 },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
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
                      sx={{ 
                        '& .MuiOutlinedInput-root': { borderRadius: 3 },
                      }}
                    />
                  </Grid>
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
                  sx={{ 
                    mt: 3,
                    '& .MuiOutlinedInput-root': { borderRadius: 3 },
                  }}
                />

                {/* بخش تیم */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: 'primary.main' }}>
                  تیم‌های فعال
                </Typography>

                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: 'grey.50' }}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="devOps"
                          checked={formData.devOps}
                          onChange={handleInputChange}
                          disabled={loading}
                          color="primary"
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
                          color="primary"
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
                          color="primary"
                        />
                      }
                      label="تیم کنترل کیفیت"
                    />
                  </FormGroup>
                </Paper>

                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    onClick={handleCancel}
                    disabled={loading}
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 3,
                      fontSize: '1.1rem'
                    }}
                    size="large"
                  >
                    انصراف
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5659e3 0%, #d63d87 100%)',
                      }
                    }}
                    size="large"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'ذخیره تغییرات'}
                  </Button>
                </Box>
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
                sx={{ 
                  width: '100%',
                  borderRadius: 3,
                  '& .MuiAlert-message': { fontSize: '1rem' }
                }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default UserEditProfile;