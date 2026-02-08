import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  TablePagination,
  Card,
  CardContent,
  Grid,
  alpha
} from '@mui/material';
import {
  Assessment,
  Code,
  Warning,
  Person,
  Business,
  Storage
} from '@mui/icons-material';

// داده‌های استاتیک برای نمایش
const projectsData = [
  {
    id: 1,
    name: 'سامانه مالی',
    testLevel: 'تست یکپارچگی',
    version: '2.3.1',
    riskLevel: 'بالا',
    riskColor: '#f44336',
    maintainer: 'علی محمدی',
    department: 'اداره فناوری اطلاعات'
  },
  {
    id: 2,
    name: 'پورتال سازمانی',
    testLevel: 'تست عملکردی',
    version: '1.8.4',
    riskLevel: 'متوسط',
    riskColor: '#ff9800',
    maintainer: 'فاطمه احمدی',
    department: 'اداره خدمات الکترونیک'
  },
  {
    id: 3,
    name: 'سامانه منابع انسانی',
    testLevel: 'تست امنیتی',
    version: '3.0.0',
    riskLevel: 'کم',
    riskColor: '#4caf50',
    maintainer: 'رضا کریمی',
    department: 'اداره توسعه منابع'
  },
  {
    id: 4,
    name: 'سیستم انبارداری',
    testLevel: 'تست یکپارچگی',
    version: '2.1.5',
    riskLevel: 'بالا',
    riskColor: '#f44336',
    maintainer: 'مریم حسینی',
    department: 'اداره لجستیک'
  },
  {
    id: 5,
    name: 'اپلیکیشن موبایل',
    testLevel: 'تست کاربری',
    version: '1.2.3',
    riskLevel: 'متوسط',
    riskColor: '#ff9800',
    maintainer: 'محمد تقوی',
    department: 'اداره فناوری اطلاعات'
  },
  {
    id: 6,
    name: 'سامانه گزارش‌گیری',
    testLevel: 'تست عملکردی',
    version: '4.0.1',
    riskLevel: 'کم',
    riskColor: '#4caf50',
    maintainer: 'سارا رضایی',
    department: 'اداره کنترل کیفیت'
  },
  {
    id: 7,
    name: 'پلتفرم تحلیل داده',
    testLevel: 'تست امنیتی',
    version: '2.7.0',
    riskLevel: 'بالا',
    riskColor: '#f44336',
    maintainer: 'امیرحسین نجفی',
    department: 'اداره هوش تجاری'
  },
  {
    id: 8,
    name: 'سیستم مدیریت محتوا',
    testLevel: 'تست کاربری',
    version: '3.5.2',
    riskLevel: 'متوسط',
    riskColor: '#ff9800',
    maintainer: 'زهرا محمدی',
    department: 'اداره ارتباطات'
  },
  {
    id: 9,
    name: 'سامانه پرداخت الکترونیک',
    testLevel: 'تست امنیتی',
    version: '5.1.0',
    riskLevel: 'بالا',
    riskColor: '#f44336',
    maintainer: 'حسین رضوانی',
    department: 'اداره مالی'
  },
  {
    id: 10,
    name: 'پورتال مشتریان',
    testLevel: 'تست عملکردی',
    version: '2.0.2',
    riskLevel: 'متوسط',
    riskColor: '#ff9800',
    maintainer: 'نرگس سلیمانی',
    department: 'اداره بازاریابی'
  }
];

// کامپوننت ستون سفارشی برای ریسک
const RiskBadge = ({ level, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Warning sx={{ color: color, fontSize: 20 }} />
    <Chip
      label={level}
      sx={{
        backgroundColor: alpha(color, 0.1),
        color: color,
        fontWeight: 'bold',
        border: `1px solid ${alpha(color, 0.3)}`,
        minWidth: 80
      }}
      size="small"
    />
  </Box>
);

const ManagementReport = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // محاسبات آماری
  const highRiskCount = projectsData.filter(project => project.riskLevel === 'بالا').length;
  const mediumRiskCount = projectsData.filter(project => project.riskLevel === 'متوسط').length;
  const lowRiskCount = projectsData.filter(project => project.riskLevel === 'کم').length;

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      direction: 'rtl'
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          color: '#1a237e',
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Assessment sx={{ fontSize: 36 }} />
        گزارش مدیریتی پروژه‌ها
      </Typography>

      {/* کارت‌های آماری */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#1a237e', 
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>کل پروژه‌ها</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{projectsData.length}</Typography>
                </Box>
                <Storage sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#d32f2f', 
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>ریسک بالا</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{highRiskCount}</Typography>
                </Box>
                <Warning sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#ff9800', 
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>ریسک متوسط</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{mediumRiskCount}</Typography>
                </Box>
                <Code sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#388e3c', 
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>ریسک کم</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{lowRiskCount}</Typography>
                </Box>
                <Assessment sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* جدول گزارش */}
      <Card sx={{ 
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              p: 3, 
              pb: 2, 
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e0e0e0',
              color: '#1a237e'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment />
              لیست پروژه‌ها و سامانه‌ها
            </Box>
          </Typography>
          
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="management report table">
              <TableHead sx={{ backgroundColor: '#f5f7fa' }}>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: '#1a237e',
                    width: '5%'
                  }}>
                    ردیف
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: '#1a237e',
                    width: '20%'
                  }}>
                    نام سامانه/پروژه
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: '#1a237e',
                    width: '15%'
                  }}>
                    مرتبه تست
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: '#1a237e',
                    width: '10%'
                  }}>
                    ورژن سامانه
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: '#1a237e',
                    width: '15%'
                  }}>
                    ریسک سامانه
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: '#1a237e',
                    width: '15%'
                  }}>
                    نام متولی سامانه
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: '#1a237e',
                    width: '20%'
                  }}>
                    اداره بهره‌بردار
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectsData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((project, index) => (
                    <TableRow 
                      key={project.id}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {page * rowsPerPage + index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: alpha('#1a237e', 0.1), 
                            color: '#1a237e',
                            width: 36,
                            height: 36,
                            fontSize: '1rem'
                          }}>
                            {project.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {project.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              ID: PRJ-{project.id.toString().padStart(3, '0')}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={project.testLevel} 
                          size="small" 
                          sx={{ 
                            backgroundColor: alpha('#1976d2', 0.1),
                            color: '#1976d2',
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: alpha('#000', 0.05),
                          border: `1px solid ${alpha('#000', 0.1)}`
                        }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            v{project.version}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <RiskBadge level={project.riskLevel} color={project.riskColor} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Person sx={{ color: '#555', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {project.maintainer}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#888' }}>
                              مسئول فنی
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Business sx={{ color: '#555', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {project.department}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#888' }}>
                              واحد بهره‌برداری
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={projectsData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="تعداد ردیف در صفحه:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
            sx={{ 
              direction: 'ltr',
              borderTop: '1px solid #e0e0e0'
            }}
          />
        </CardContent>
      </Card>
      
      {/* توضیحات پایین صفحه */}
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        backgroundColor: 'white', 
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
          راهنمای رنگ‌بندی ریسک:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: '#f44336' 
              }} />
              <Typography variant="body2">
                <strong>ریسک بالا:</strong> نیاز به توجه فوری و اقدامات اصلاحی
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: '#ff9800' 
              }} />
              <Typography variant="body2">
                <strong>ریسک متوسط:</strong> نیاز به نظارت و برنامه‌ریزی
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: '#4caf50' 
              }} />
              <Typography variant="body2">
                <strong>ریسک کم:</strong> وضعیت مطلوب و پایدار
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ManagementReport;