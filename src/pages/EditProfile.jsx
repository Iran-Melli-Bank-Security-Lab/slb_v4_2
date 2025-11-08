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
import { PhotoCamera } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { getUserInfoById } from '../api/users/getUserInfoById';
import { updateUserApi } from '../api/users/updateUserApi';

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

        if (userData.profileImageUrl) {
          setImagePreview(userData.profileImageUrl);
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
      submitFormData.append("userId" , userId  )
      if (formData.profileImage) {
        submitFormData.append('profileImageUrl', formData.profileImage);
      }

      // ارسال درخواست آپدیت کاربر
      const response = await updateUserApi( submitFormData);
      
      setSnackbar({
        open: true,
        message: 'اطلاعات کاربر با موفقیت به‌روزرسانی شد!',
        severity: 'success',
      });

      // بازگشت به صفحه پروفایل پس از 2 ثانیه
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

      console.log('Update response:', response.data);
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
              maxWidth: 500,
              margin: 'auto',
              mt: 4,
              p: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <CircularProgress />
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
            maxWidth: 500,
            margin: 'auto',
            mt: 4,
            p: 3,
          }}
        >
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              ویرایش پروفایل
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              در حال ویرایش پروفایل کاربر: {userId}
            </Typography>

            {/* دکمه تغییر رمز عبور */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleChangePassword}
                disabled={loading}
              >
                تغییر رمز عبور
              </Button>
            </Box>

            <form onSubmit={handleSubmit}>
              {/* آپلود تصویر پروفایل */}
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
                  تغییر تصویر پروفایل
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
              />

              {/* بخش تیم */}
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                تیم‌ها
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

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ py: 1.5 }}
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'ذخیره تغییرات'}
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
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default UserEditProfile;