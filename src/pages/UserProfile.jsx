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
  Rating
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
  Share
} from '@mui/icons-material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { useUserId } from '../hooks/useUserId';
import { getUserInfoById } from '../api/users/getUserInfoById';

// داده نمونه کاربر
const user1 = {
  firstName: "امین",
  lastName: "رضایی",
  username: "aminkh",
  roles: {
    User: 2001,
    Admin: 5001
  },
  profileImageUrl: "/path/to/image.jpg",
  status: "Active",
  score: 2850,
  devOps: true,
  security: false,
  qualityAssurance: true,
  userProject: ["project1", "project2", "project3"],
  email: "amin.rezaei@example.com",
  phone: "+98 912 345 6789",
  location: "تهران, ایران",
  bio: "توسعه دهنده full-stack با ۵ سال تجربه در زمینه توسعه وب اپلیکیشن‌های مدرن",
  joinDate: "۱۴۰۲/۰۱/۱۵"
};

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
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '4px solid #ffffff',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// کامپوننت UserProfile
const UserProfileContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
const userId = useUserId() 

  const [user , setUser ] = useState(user1)

  const fetchUser = async()=>{

    const data = await getUserInfoById(userId) 
    console.log(data) 
    

  }

  useEffect(()=>{
    fetchUser()
  } ,[userId])
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

  // تابع برای نمایش نقش‌ها
  const renderRoles = (roles) => {
    const activeRoles = [];
    if (roles?.Admin) activeRoles.push({ label: 'مدیر', color: 'secondary' });
    if (roles?.User) activeRoles.push({ label: 'کاربر', color: 'primary' });
    
    return activeRoles.map((role, index) => (
      <Chip
        key={index}
        label={role.label}
        color={role.color}
        variant="filled"
        size="small"
        sx={{ ml: 1, fontWeight: 600 }}
      />
    ));
  };

  // تابع برای نمایش تخصص‌ها
  const renderSkills = (user) => {
    const skills = [];
    if (user.devOps) skills.push({ label: 'DevOps', color: '#10b981', icon: '🔄' });
    if (user.security) skills.push({ label: 'Security', color: '#ef4444', icon: '🛡️' });
    if (user.qualityAssurance) skills.push({ label: 'Quality Assurance', color: '#f59e0b', icon: '✅' });
    
    return skills.map((skill, index) => (
      <Chip
        key={index}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <span>{skill.icon}</span>
            {skill.label}
          </Box>
        }
        sx={{ 
          ml: 1, 
          mb: 1,
          background: `linear-gradient(135deg, ${skill.color}20, ${skill.color}40)`,
          border: `1px solid ${skill.color}30`,
          color: skill.color,
          fontWeight: 600,
        }}
        size="small"
      />
    ));
  };

  // محاسبه پیشرفت بر اساس امتیاز
  const calculateProgress = (score) => {
    return Math.min((score / 5000) * 100, 100);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            {/* هدر پروفایل */}
            <Paper 
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                color: 'white',
                p: { xs: 3, md: 4 },
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
                  background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                }
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar
                      src={user.profileImageUrl}
                      sx={{
                        width: { xs: 100, md: 140 },
                        height: { xs: 100, md: 140 },
                        border: '4px solid rgba(255,255,255,0.3)',
                        bgcolor: 'primary.light'
                      }}
                    >
                      <Person sx={{ fontSize: 60 }} />
                    </Avatar>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                      {user.firstName} {user.lastName}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }} gutterBottom>
                      @{user.username}
                    </Typography>

                    <Typography variant="body1" sx={{ opacity: 0.8, mb: 2 }}>
                      {user.bio}
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      {getStatusChip(user.status)}
                      {renderRoles(user.roles)}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-end' } }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<Edit />}
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
                    <Button 
                      variant="contained" 
                      startIcon={<Share />}
                      sx={{ 
                        background: 'rgba(255,255,255,0.9)',
                        color: 'primary.main',
                        '&:hover': {
                          background: 'white',
                        }
                      }}
                    >
                      اشتراک‌گذاری
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={3}>
              {/* سایدبار سمت چپ */}
              <Grid item xs={12} lg={4}>
                <Stack spacing={3}>
                  {/* کارت اطلاعات تماس */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Badge sx={{ ml: 1, color: 'primary.main' }} />
                        اطلاعات تماس
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{ ml: 1, color: 'primary.main' }} />
                          <Typography variant="body2">{user.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Phone sx={{ ml: 1, color: 'primary.main' }} />
                          <Typography variant="body2">{user.phone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ ml: 1, color: 'primary.main' }} />
                          <Typography variant="body2">{user.location}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Group sx={{ ml: 1, color: 'primary.main' }} />
                          <Typography variant="body2">عضو since {user.joinDate}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* کارت امتیاز و پیشرفت */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUp sx={{ ml: 1, color: 'secondary.main' }} />
                        پیشرفت و امتیاز
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h2" fontWeight="bold" color="primary.main">
                          {user.score}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          امتیاز کلی
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            سطح بعدی: ۵۰۰۰
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {calculateProgress(user.score).toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={calculateProgress(user.score)} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                              borderRadius: 4,
                            }
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                        <Rating value={4.5} precision={0.5} readOnly />
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          (۴.۵)
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* کارت آمار پروژه‌ها */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Work sx={{ ml: 1, color: 'primary.main' }} />
                        آمار پروژه‌ها
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Box sx={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #10b98120, #10b98140)',
                          border: '2px solid #10b98130',
                          mb: 2
                        }}>
                          <Typography variant="h4" fontWeight="bold" color="#10b981">
                            {user.userProject?.length || 0}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          پروژه‌های فعال
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              {/* محتوای اصلی سمت راست */}
              <Grid item xs={12} lg={8}>
                <Stack spacing={3}>
                  {/* کارت تخصص‌ها */}
                  <Card>
                    <CardContent>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Assignment sx={{ ml: 1, color: 'primary.main' }} />
                        تخصص‌ها و مهارت‌ها
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {renderSkills(user)}
                      </Box>
                    </CardContent>
                  </Card>

                  {/* کارت وضعیت دسترسی‌ها */}
                  <Card>
                    <CardContent>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Security sx={{ ml: 1, color: 'primary.main' }} />
                        وضعیت دسترسی‌ها
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Paper 
                            elevation={0}
                            sx={{ 
                              p: 2,
                              background: user.devOps ? 
                                'linear-gradient(135deg, #10b98110, #10b98120)' : 
                                'linear-gradient(135deg, #ef444410, #ef444420)',
                              border: `1px solid ${user.devOps ? '#10b98130' : '#ef444430'}`,
                              borderRadius: 2,
                              textAlign: 'center'
                            }}
                          >
                            {user.devOps ? 
                              <CheckCircle sx={{ fontSize: 40, color: '#10b981', mb: 1 }} /> : 
                              <Cancel sx={{ fontSize: 40, color: '#ef4444', mb: 1 }} />
                            }
                            <Typography variant="h6" gutterBottom>
                              DevOps
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.devOps ? 'فعال' : 'غیرفعال'}
                            </Typography>
                          </Paper>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Paper 
                            elevation={0}
                            sx={{ 
                              p: 2,
                              background: user.security ? 
                                'linear-gradient(135deg, #10b98110, #10b98120)' : 
                                'linear-gradient(135deg, #ef444410, #ef444420)',
                              border: `1px solid ${user.security ? '#10b98130' : '#ef444430'}`,
                              borderRadius: 2,
                              textAlign: 'center'
                            }}
                          >
                            {user.security ? 
                              <CheckCircle sx={{ fontSize: 40, color: '#10b981', mb: 1 }} /> : 
                              <Cancel sx={{ fontSize: 40, color: '#ef4444', mb: 1 }} />
                            }
                            <Typography variant="h6" gutterBottom>
                              Security
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.security ? 'فعال' : 'غیرفعال'}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Paper 
                            elevation={0}
                            sx={{ 
                              p: 2,
                              background: user.qualityAssurance ? 
                                'linear-gradient(135deg, #10b98110, #10b98120)' : 
                                'linear-gradient(135deg, #ef444410, #ef444420)',
                              border: `1px solid ${user.qualityAssurance ? '#10b98130' : '#ef444430'}`,
                              borderRadius: 2,
                              textAlign: 'center'
                            }}
                          >
                            {user.qualityAssurance ? 
                              <CheckCircle sx={{ fontSize: 40, color: '#10b981', mb: 1 }} /> : 
                              <Cancel sx={{ fontSize: 40, color: '#ef4444', mb: 1 }} />
                            }
                            <Typography variant="h6" gutterBottom>
                              Quality Assurance
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.qualityAssurance ? 'فعال' : 'غیرفعال'}
                            </Typography>
                          </Paper>
                        </Grid>
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