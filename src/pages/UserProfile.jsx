import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Fade,
  Button,
  LinearProgress,
  Skeleton
} from '@mui/material';
import {
  Person,
  Badge,
  Security,
  Assignment,
  CheckCircle,
  Cancel,
  Star,
  Work,
  TrendingUp,
  Group,
  Email,
  Phone,
  LocationOn,
  Edit,
  Share,
  CalendarToday,
  EmojiEvents
} from '@mui/icons-material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { useUserId } from '../hooks/useUserId';
import { getUserInfoById } from '../api/users/getUserInfoById';
import { useNavigate } from 'react-router';
import { useImageUrl } from '../hooks/useImageUrl';

// ✅ ایجاد کش برای پشتیبانی از جهت راست به چپ
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, stylisRTLPlugin],
});

// ✅ ساخت تم MUI با جهت RTL و طراحی مدرن
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
    success: {
      main: '#10b981',
      light: '#34d399',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Vazirmatn, Tahoma, Arial, sans-serif',
    h3: {
      fontWeight: 800,
      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '4px solid #ffffff',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      },
    },
  },
});

// کامپوننت UserProfile
const UserProfileContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userId = useUserId();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const profileImageUrl = useImageUrl(user?.profileImageUrl);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUserInfoById(userId);
      console.log('User data:', data);
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // تابع برای هدایت به صفحه ویرایش پروفایل
  const handleEditProfile = () => {
    navigate(`/edit-profile/${userId}`);
  };

  // تابع برای نمایش وضعیت
  const getStatusChip = (status) => {
    const statusConfig = {
      Active: { color: 'success', label: 'فعال', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
      Inactive: { color: 'default', label: 'غیرفعال', icon: <Cancel sx={{ fontSize: 16 }} /> },
      Suspended: { color: 'error', label: 'معلق', icon: <Cancel sx={{ fontSize: 16 }} /> }
    };
    
    const config = statusConfig[status] || statusConfig.Active;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        sx={{ 
          fontWeight: 600,
          '& .MuiChip-icon': { ml: 0.5 }
        }}
      />
    );
  };

  // تابع برای نمایش تخصص‌ها
  const renderSkills = (user) => {
    const skills = [];
    if (user.devOps) skills.push({ label: 'DevOps', color: '#10b981', icon: '🔄', bgColor: 'rgba(16, 185, 129, 0.1)' });
    if (user.security) skills.push({ label: 'Security', color: '#ef4444', icon: '🛡️', bgColor: 'rgba(239, 68, 68, 0.1)' });
    if (user.qualityAssurance) skills.push({ label: 'Quality Assurance', color: '#f59e0b', icon: '✅', bgColor: 'rgba(245, 158, 11, 0.1)' });
    
    return skills.map((skill, index) => (
      <Chip
        key={index}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <span style={{ fontSize: '16px' }}>{skill.icon}</span>
            {skill.label}
          </Box>
        }
        sx={{ 
          ml: 1, 
          mb: 1,
          background: skill.bgColor,
          border: `1px solid ${skill.color}30`,
          color: skill.color,
          fontWeight: 600,
          fontSize: '0.8rem',
          padding: '8px 12px',
          height: 'auto'
        }}
        size="medium"
      />
    ));
  };

  // در تابع calculateProgress
  const calculateProgress = (score) => {
    return Math.min(Math.round((score / 1000) * 100), 100);
  };

  // تابع برای نمایش اسکلتون در حین لودینگ
  const renderSkeleton = () => (
    <Box>
      {/* هدر اسکلتون */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Skeleton variant="circular" width={140} height={140} sx={{ mx: 'auto' }} />
          </Grid>
          <Grid item xs={12} md={9}>
            <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="rounded" width={80} height={32} />
              <Skeleton variant="rounded" width={80} height={32} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            <Skeleton variant="rounded" height={200} />
            <Skeleton variant="rounded" height={200} />
            <Skeleton variant="rounded" height={150} />
          </Stack>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            <Skeleton variant="rounded" height={150} />
            <Skeleton variant="rounded" height={200} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', py: 4 }}>
        <Container maxWidth="lg">
          {renderSkeleton()}
        </Container>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <Typography variant="h5" color="text.secondary">
          کاربر یافت نشد
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
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
    }}>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            {/* هدر پروفایل */}
            <Paper 
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 50%, rgba(236, 72, 153, 0.95) 100%)',
                color: 'white',
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                mb: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)',
                }
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                    <Avatar
                      src={profileImageUrl}
                      sx={{
                        width: { xs: 120, md: 160 },
                        height: { xs: 120, md: 160 },
                        border: '4px solid rgba(255,255,255,0.3)',
                        background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 100%)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                      }}
                    >
                      <Person sx={{ fontSize: 70 }} />
                    </Avatar>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: { xs: 'center', md: 'right' }, position: 'relative', zIndex: 1 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                    
                    <Typography variant="h5" sx={{ opacity: 0.9, mb: 3 }} gutterBottom>
                      @{user.username}
                    </Typography>

                    <Typography variant="body1" sx={{ opacity: 0.8, mb: 3, lineHeight: 1.8 }}>
                      توسعه‌دهنده نرم‌افزار با تخصص در زمینه امنیت و کیفیت‌سنجی
                    </Typography>
                    
                    <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      {getStatusChip(user.status)}
                      <Chip
                        label="کاربر"
                        color="primary"
                        variant="filled"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-end' }, position: 'relative', zIndex: 1 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<Edit />}
                      onClick={handleEditProfile}
                      sx={{ 
                        background: 'rgba(255,255,255,0.1)',
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.2)',
                          borderColor: 'rgba(255,255,255,0.5)',
                        }
                      }}
                    >
                      ویرایش
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={4}>
              {/* سایدبار سمت چپ */}
              <Grid item xs={12} lg={4}>
                <Stack spacing={4}>
                  {/* کارت اطلاعات کاربر */}
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 3 }}>
                        <Badge sx={{ ml: 1, color: 'inherit' }} />
                        اطلاعات کاربر
                      </Typography>
                      
                      <Stack spacing={2.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                          <Email sx={{ ml: 1, color: 'primary.main', fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              ایمیل
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {user.username}@company.com
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                          <CalendarToday sx={{ ml: 1, color: 'primary.main', fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              تاریخ عضویت
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {new Date(user.createdAt || Date.now()).toLocaleDateString('fa-IR')}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                          <Group sx={{ ml: 1, color: 'primary.main', fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              وضعیت حساب
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {user.status === 'Active' ? 'فعال' : 'غیرفعال'}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* کارت امتیاز و پیشرفت */}
                  <Card>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', mb: 3 }}>
                        <EmojiEvents sx={{ ml: 1, color: 'inherit' }} />
                        امتیاز کاربر
                      </Typography>
                      
                      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          background: `conic-gradient(#6366f1 ${calculateProgress(user.score)}%, #e2e8f0 ${calculateProgress(user.score)}%)`,
                          position: 'relative'
                        }}>
                          <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                          }}>
                            <Star sx={{ color: 'warning.main', fontSize: 24, mb: 0.5 }} />
                            <Typography variant="caption" fontWeight="bold" color="primary.main">
                              {Math.min(Math.floor(user.score))} 
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        امتیاز کلی کاربر
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            سطح بعدی: ۱۰۰۰
                          </Typography>
                          <Typography variant="caption" fontWeight="bold" color="primary.main">
                            {calculateProgress(user.score).toFixed(0)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={calculateProgress(user.score)} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                              borderRadius: 3,
                            }
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  {/* کارت آمار پروژه‌ها */}
                  <Card>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', mb: 3 }}>
                        <Work sx={{ ml: 1, color: 'inherit' }} />
                        آمار پروژه‌ها
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b98120, #10b98140)',
                        border: '3px solid #10b98130',
                        mb: 2
                      }}>
                        <Typography variant="h3" fontWeight="bold" color="#10b981">
                          {user.userProject?.length || 0}
                        </Typography>
                      </Box>
                     
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              {/* محتوای اصلی سمت راست */}
              <Grid item xs={12} lg={8}>
                <Stack spacing={4}>
                  {/* کارت تخصص‌ها */}
                  <Card>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 4 }}>
                        <Assignment sx={{ ml: 1, color: 'inherit' }} />
                        تخصص‌ها و مهارت‌ها
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {renderSkills(user)}
                      </Box>

                      {user.devOps === false && user.security === false && user.qualityAssurance === false && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            هنوز هیچ تخصصی اضافه نکرده‌اید
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>

                  {/* کارت وضعیت دسترسی‌ها */}
                  <Card>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 4 }}>
                        <Security sx={{ ml: 1, color: 'inherit' }} />
                        وضعیت دسترسی‌ها
                      </Typography>
                      
                      <Grid container spacing={3}>
                        {[
                          { 
                            label: 'DevOps', 
                            value: user.devOps, 
                            description: 'دسترسی به ابزارهای توسعه و عملیات',
                            icon: '🔄'
                          },
                          { 
                            label: 'Security', 
                            value: user.security, 
                            description: 'دسترسی به ابزارهای امنیتی',
                            icon: '🛡️'
                          },
                          { 
                            label: 'Quality Assurance', 
                            value: user.qualityAssurance, 
                            description: 'دسترسی به ابزارهای تست و کیفیت',
                            icon: '✅'
                          }
                        ].map((item, index) => (
                          <Grid item xs={12} md={4} key={index}>
                            <Paper 
                              elevation={0}
                              sx={{ 
                                p: 3,
                                height: '100%',
                                background: item.value ? 
                                  'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' : 
                                  'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                                border: `2px solid ${item.value ? '#10b98130' : '#ef444430'}`,
                                borderRadius: 3,
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                }
                              }}
                            >
                              <Typography variant="h4" sx={{ mb: 2, fontSize: '2.5rem' }}>
                                {item.icon}
                              </Typography>
                              
                              {item.value ? 
                                <CheckCircle sx={{ fontSize: 40, color: '#10b981', mb: 2 }} /> : 
                                <Cancel sx={{ fontSize: 40, color: '#ef4444', mb: 2 }} />
                              }
                              
                              <Typography variant="h6" gutterBottom sx={{ color: item.value ? '#10b981' : '#ef4444' }}>
                                {item.label}
                              </Typography>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {item.description}
                              </Typography>
                              
                              <Chip
                                label={item.value ? 'فعال' : 'غیرفعال'}
                                color={item.value ? 'success' : 'error'}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

// کامپوننت اصلی
export default function Profile() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div dir="rtl">
          <UserProfileContent />
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}