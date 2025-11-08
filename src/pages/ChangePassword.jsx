import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import Swal from 'sweetalert2';
import { changePasswordApi } from '../api/users/changePassworApi';
import { useUserId } from '../hooks/useUserId';

// ایجاد کش برای RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, stylisRTLPlugin],
});

// ایجاد تم RTL
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: '"Vazirmatn", "IRANSans", "Tahoma", sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const userId = useUserId() 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // اعتبارسنجی بلادرنگ
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'currentPassword':
        if (!value) {
          newErrors.currentPassword = 'رمز عبور فعلی الزامی است';
        }
        // } else if (value.length < 6) {
        //   newErrors.currentPassword = 'رمز عبور باید حداقل ۶ کاراکتر باشد';

        // } 
            else {
          delete newErrors.currentPassword;
        }
        break;

      case 'newPassword':
        if (!value) {
          newErrors.newPassword = 'رمز عبور جدید الزامی است';
        } else if (value.length < 6) {
          newErrors.newPassword = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
        } else if (value === formData.currentPassword) {
          newErrors.newPassword = 'رمز عبور جدید باید با رمز عبور فعلی متفاوت باشد';
        } else {
          delete newErrors.newPassword;
          
          // اگر تکرار رمز عبور قبلا وارد شده، آن را هم اعتبارسنجی کن
          if (formData.confirmPassword) {
            if (value !== formData.confirmPassword) {
              newErrors.confirmPassword = 'رمز عبور و تکرار آن مطابقت ندارند';
            } else {
              delete newErrors.confirmPassword;
            }
          }
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'تکرار رمز عبور الزامی است';
        } else if (value !== formData.newPassword) {
          newErrors.confirmPassword = 'رمز عبور و تکرار آن مطابقت ندارند';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    


    if (!formData.currentPassword) {
      newErrors.currentPassword = 'رمز عبور فعلی الزامی است';
    } 
// else if (formData.currentPassword.length < 6) {
    //   newErrors.currentPassword = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    // }


    if (!formData.newPassword) {
      newErrors.newPassword = 'رمز عبور جدید الزامی است';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'رمز عبور جدید باید با رمز عبور فعلی متفاوت باشد';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تکرار رمز عبور الزامی است';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن مطابقت ندارند';
    }

    // علامت گذاری همه فیلدها به عنوان touched برای نمایش خطاها
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClickShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const showSuccessAlert = () => {
    Swal.fire({
      title: 'موفقیت آمیز!',
      text: 'رمز عبور شما با موفقیت تغییر یافت',
      icon: 'success',
      confirmButtonText: 'باشه',
      confirmButtonColor: '#1976d2',
      customClass: {
        popup: 'swal2-rtl',
        title: 'swal2-title-rtl',
        confirmButton: 'swal2-confirm-rtl'
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // شبیه سازی ارسال به API
    try {

 const passwordData = {
        userId,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };
    //   await new Promise(resolve => setTimeout(resolve, 2000));
    await changePasswordApi(passwordData)
      // نمایش پیام موفقیت با SweetAlert2
      showSuccessAlert();
      
      // ریست فرم
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTouched({});
      setErrors({});
      
    } catch (error) {
      setErrors({ submit: `${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.currentPassword && 
           formData.newPassword && 
           formData.confirmPassword && 
           Object.keys(errors).length === 0;
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2
            }}
          >
            <Typography component="h1" variant="h4" gutterBottom color="primary">
              تغییر رمز عبور
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              برای امنیت حساب کاربری خود، لطفاً رمز عبور خود را به طور مرتب تغییر دهید
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{   mt: 1, width: '100%' }}>
              {errors.submit && (
                <Alert severity="error" sx={{direction:"ltr" ,  mb: 2 }}>
                  {errors.submit}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                name="currentPassword"
                label="رمز عبور فعلی"
                type={showPassword.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.currentPassword && touched.currentPassword}
                inputProps={{
                  dir: 'rtl',
                  style: { textAlign: 'right' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() => handleClickShowPassword('current')}
                        edge="start"
                      >
                        {showPassword.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errors.currentPassword && touched.currentPassword && (
                <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                  {errors.currentPassword}
                </FormHelperText>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="رمز عبور جدید"
                type={showPassword.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.newPassword && touched.newPassword}
                inputProps={{
                  dir: 'rtl',
                  style: { textAlign: 'right' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() => handleClickShowPassword('new')}
                        edge="start"
                      >
                        {showPassword.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errors.newPassword && touched.newPassword && (
                <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                  {errors.newPassword}
                </FormHelperText>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="تکرار رمز عبور جدید"
                type={showPassword.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.confirmPassword && touched.confirmPassword}
                inputProps={{
                  dir: 'rtl',
                  style: { textAlign: 'right' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() => handleClickShowPassword('confirm')}
                        edge="start"
                      >
                        {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <FormHelperText error sx={{dir:'rtl' , mt: 0.5, fontSize: '0.75rem' }}>
                  {errors.confirmPassword}
                </FormHelperText>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading || !isFormValid()}
              >
                {loading ? 'در حال تغییر رمز عبور...' : 'تغییر رمز عبور'}
              </Button>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default ChangePasswordPage;