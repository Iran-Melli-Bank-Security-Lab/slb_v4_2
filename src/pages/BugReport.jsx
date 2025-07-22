import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Box,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Chip
} from '@mui/material';
import { 
  BugReport as BugReportIcon, 
  Add as AddIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// داده‌های استاتیک برای گزارش‌های باگ
const sampleBugReports = [
  {
    _id: '1',
    labelfa: 'تزریق SQL',
    label: 'SQL Injection',
    wstg: 'WSTG-INPV-05',
    CVSS: '8.8',
    severity: 'High',
    CVE: 'CVE-2021-1234',
    impact: 'این آسیب‌پذیری می‌تواند منجر به افشای اطلاعات حساس از پایگاه داده شود.',
    description: 'در صفحه لاگین، پارامتر username در برابر تزریق SQL آسیب‌پذیر است.',
    solutions: '1. استفاده از prepared statements\n2. اعتبارسنجی ورودی‌ها\n3. محدود کردن دسترسی به پایگاه داده',
    tools: ['Burp Suite', 'SQLmap'],
    pocs: [
      { path: 'poc1.pdf', originalname: 'اثبات مفهوم SQLi.pdf' },
      { path: 'screenshot1.png', originalname: 'اسکرین‌شوت آسیب‌پذیری.png' }
    ],
    state: 'Verified',
    path: '/login.php',
    exploits: "' OR '1'='1",
    refrence: 'https://owasp.org/www-community/attacks/SQL_Injection',
    vector: 'حمله از طریق پارامتر username',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
  },
  {
    _id: '2',
    labelfa: 'XSS ذخیره‌شده',
    label: 'Stored XSS',
    wstg: 'WSTG-INPV-02',
    CVSS: '7.5',
    severity: 'Medium',
    impact: 'مهاجم می‌تواند اسکریپت‌های مخرب را در صفحه ذخیره کند که برای تمام کاربران اجرا می‌شود.',
    description: 'در بخش نظرات، ورودی کاربر بدون اعتبارسنجی و فیلتر کردن ذخیره می‌شود.',
    solutions: '1. اعتبارسنجی و فیلتر کردن ورودی‌ها\n2. استفاده از Content Security Policy\n3. رمزگذاری خروجی',
    tools: ['Burp Suite', 'OWASP ZAP'],
    pocs: [
      { path: 'xss-poc.html', originalname: 'نمونه حمله XSS.html' }
    ],
    state: 'Pending',
    path: '/comments',
    refrence: 'https://owasp.org/www-community/attacks/xss/',
    vector: 'حمله از طریق فیلد نظر در فرم نظرات',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:L/I:L/A:N'
  },
  {
    _id: '3',
    labelfa: 'اعتبارسنجی ناقص',
    label: 'Broken Authentication',
    wstg: 'WSTG-ATHN-01',
    CVSS: '6.5',
    severity: 'Medium',
    impact: 'مهاجم می‌تواند با استفاده از حملات brute-force به حساب کاربری دسترسی پیدا کند.',
    description: 'سیستم محدودیتی در تعداد تلاش‌های ناموفق برای ورود ندارد.',
    solutions: '1. پیاده‌سازی محدودیت تلاش ورود\n2. استفاده از احراز هویت دو مرحله‌ای\n3. پیاده‌سازی مکانیزم قفل حساب',
    tools: ['Burp Suite', 'Hydra'],
    pocs: [],
    state: 'New',
    path: '/login',
    refrence: 'https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N'
  }
];

const StatusChip = ({ status }) => {
  const statusMap = {
    'New': { color: 'primary', label: 'جدید', icon: <BugReportIcon /> },
    'Pending': { color: 'warning', label: 'در حال بررسی', icon: <PendingIcon /> },
    'Verified': { color: 'success', label: 'تایید شده', icon: <CheckCircleIcon /> }
  };
  
  return (
    <Chip
      icon={statusMap[status]?.icon}
      label={statusMap[status]?.label}
      color={statusMap[status]?.color}
      size="small"
      variant="outlined"
    />
  );
};

const SeverityChip = ({ severity }) => {
  const severityMap = {
    'Low': { color: 'success', label: 'کم' },
    'Medium': { color: 'warning', label: 'متوسط' },
    'High': { color: 'error', label: 'زیاد' },
    'Critical': { color: 'error', label: 'بحرانی' }
  };
  
  return (
    <Chip
      label={severityMap[severity]?.label}
      color={severityMap[severity]?.color}
      size="small"
    />
  );
};

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const BugReportForm = () => {
  const { id, label, projectid } = useParams();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // تغییر به false برای نمایش داده‌های استاتیک
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [openForm, setOpenForm] = useState(false);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  
  const [newBug, setNewBug] = useState({
    id: id,
    label: label,
    labelfa: '',
    wstg: '',
    CVSS: '',
    severity: 'Medium',
    CVE: '',
    impact: '',
    other_information: '',
    pocs: [],
    verify: false,
    path: '',
    solutions: '',
    exploits: '',
    tools: [],
    state: 'New',
    description: '',
    refrence: '',
    securingByOptions: {
      webServerSettings: false,
      modificationInProgramCode: false
    },
    securingByWAF: '',
    vector: '',
    cvssVector: ''
  });

  const severityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const toolOptions = ['Burp Suite', 'Nmap', 'Metasploit', 'OWASP ZAP', 'SQLmap', 'Other'];

  // استفاده از داده‌های استاتیک به جای فراخوانی API
  useEffect(() => {
    setReports(sampleBugReports);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // شبیه‌سازی ارسال فرم
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReport = {
        ...newBug,
        _id: Math.random().toString(36).substr(2, 9),
        pocs: filePreviews.map(file => ({ 
          path: file.name, 
          originalname: file.name 
        }))
      };
      
      setReports([newReport, ...reports]);
      
      setNewBug({
        id: id,
        label: label,
        labelfa: '',
        wstg: '',
        CVSS: '',
        severity: 'Medium',
        CVE: '',
        impact: '',
        other_information: '',
        pocs: [],
        verify: false,
        path: '',
        solutions: '',
        exploits: '',
        tools: [],
        state: 'New',
        description: '',
        refrence: '',
        securingByOptions: {
          webServerSettings: false,
          modificationInProgramCode: false
        },
        securingByWAF: '',
        vector: '',
        cvssVector: ''
      });
      setFiles([]);
      setFilePreviews([]);
      setOpenForm(false);
      setSnackbar({
        open: true,
        message: 'گزارش با موفقیت ثبت شد',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
    
    // Create previews
    const previews = selectedFiles.map(file => ({
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file)
    }));
    setFilePreviews([...filePreviews, ...previews]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    const newPreviews = [...filePreviews];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setFilePreviews(newPreviews);
  };

  const handleToolChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewBug({
      ...newBug,
      tools: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <BugReportIcon color="error" sx={{ mr: 1 }} />
        گزارش باگ برای: {decodeURIComponent(label)}
      </Typography>
      
      {reports.length > 0 && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
          sx={{ mb: 3 }}
        >
          افزودن گزارش جدید
        </Button>
      )}

      {isLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : reports.length === 0 ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: '50vh' }}
        >
          <Fab
            color="primary"
            aria-label="add"
            size="large"
            onClick={handleOpenForm}
            sx={{
              width: 80,
              height: 80,
              fontSize: '2rem'
            }}
          >
            <AddIcon fontSize="large" />
          </Fab>
        </Grid>
      ) : (
        reports.map((report) => (
          <StyledCard key={report._id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{report.labelfa || report.label}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <StatusChip status={report.state} />
                  <SeverityChip severity={report.severity} />
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>CVSS:</strong> {report.CVSS} | <strong>CVE:</strong> {report.CVE || 'ندارد'} | <strong>WSTG:</strong> {report.wstg || 'ندارد'}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {report.description}
              </Typography>
              
              {report.impact && (
                <>
                  <Typography variant="subtitle2">تأثیر:</Typography>
                  <Typography variant="body2" paragraph>
                    {report.impact}
                  </Typography>
                </>
              )}
              
              {report.solutions && (
                <>
                  <Typography variant="subtitle2">راهکارهای اصلاحی:</Typography>
                  <Typography variant="body2" paragraph>
                    {report.solutions.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </Typography>
                </>
              )}
              
              {report.tools?.length > 0 && (
                <>
                  <Typography variant="subtitle2">ابزارهای استفاده شده:</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {report.tools.map((tool, index) => (
                      <Chip key={index} label={tool} size="small" />
                    ))}
                  </Box>
                </>
              )}
              
              {report.pocs?.length > 0 && (
                <>
                  <Typography variant="subtitle2">مدارک و مستندات:</Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {report.pocs.map((poc, index) => (
                      <Grid item key={index}>
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setSnackbar({
                              open: true,
                              message: `فایل ${poc.originalname} در حالت دمو قابل نمایش نیست`,
                              severity: 'info'
                            });
                          }}
                          style={{ textDecoration: 'none' }}
                        >
                          <Chip
                            icon={<CloudUploadIcon />}
                            label={poc.originalname}
                            variant="outlined"
                            clickable
                          />
                        </a>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              
              {report.path && (
                <Typography variant="body2" color="text.secondary">
                  <strong>مسیر:</strong> {report.path}
                </Typography>
              )}
              
              {report.exploits && (
                <>
                  <Typography variant="subtitle2">نمونه اکسپلویت:</Typography>
                  <Typography variant="body2" paragraph sx={{ fontFamily: 'monospace' }}>
                    {report.exploits}
                  </Typography>
                </>
              )}
              
              {report.refrence && (
                <Typography variant="body2">
                  <strong>منبع:</strong> <a href={report.refrence} target="_blank" rel="noopener noreferrer">{report.refrence}</a>
                </Typography>
              )}
            </CardContent>
          </StyledCard>
        ))
      )}
      
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="md">
        <DialogTitle>
          ایجاد گزارش باگ جدید
          <IconButton
            aria-label="close"
            onClick={handleCloseForm}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="عنوان فارسی (labelfa)"
                  value={newBug.labelfa}
                  onChange={(e) => setNewBug({ ...newBug, labelfa: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="WSTG"
                  value={newBug.wstg}
                  onChange={(e) => setNewBug({ ...newBug, wstg: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CVSS"
                  value={newBug.CVSS}
                  onChange={(e) => setNewBug({ ...newBug, CVSS: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>شدت باگ</InputLabel>
                  <Select
                    value={newBug.severity}
                    label="شدت باگ"
                    onChange={(e) => setNewBug({ ...newBug, severity: e.target.value })}
                    required
                  >
                    {severityOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CVE"
                  value={newBug.CVE}
                  onChange={(e) => setNewBug({ ...newBug, CVE: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="مسیر (Path)"
                  value={newBug.path}
                  onChange={(e) => setNewBug({ ...newBug, path: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="توضیحات"
                  multiline
                  rows={4}
                  value={newBug.description}
                  onChange={(e) => setNewBug({ ...newBug, description: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="تأثیر (Impact)"
                  multiline
                  rows={3}
                  value={newBug.impact}
                  onChange={(e) => setNewBug({ ...newBug, impact: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="اطلاعات دیگر"
                  multiline
                  rows={3}
                  value={newBug.other_information}
                  onChange={(e) => setNewBug({ ...newBug, other_information: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="راهکارهای اصلاحی (Solutions)"
                  multiline
                  rows={4}
                  value={newBug.solutions}
                  onChange={(e) => setNewBug({ ...newBug, solutions: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="اکسپلویت (Exploits)"
                  multiline
                  rows={3}
                  value={newBug.exploits}
                  onChange={(e) => setNewBug({ ...newBug, exploits: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="مرجع (Reference)"
                  value={newBug.refrence}
                  onChange={(e) => setNewBug({ ...newBug, refrence: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="بردار حمله (Vector)"
                  value={newBug.vector}
                  onChange={(e) => setNewBug({ ...newBug, vector: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="بردار CVSS (CVSS Vector)"
                  value={newBug.cvssVector}
                  onChange={(e) => setNewBug({ ...newBug, cvssVector: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>ابزارهای استفاده شده</InputLabel>
                  <Select
                    multiple
                    value={newBug.tools}
                    onChange={handleToolChange}
                    label="ابزارهای استفاده شده"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {toolOptions.map((tool) => (
                      <MenuItem key={tool} value={tool}>
                        {tool}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  راهکارهای امنیتی
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={newBug.securingByOptions.webServerSettings} 
                      onChange={(e) => setNewBug({
                        ...newBug,
                        securingByOptions: {
                          ...newBug.securingByOptions,
                          webServerSettings: e.target.checked
                        }
                      })} 
                    />
                  }
                  label="تنظیمات وب سرور"
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={newBug.securingByOptions.modificationInProgramCode} 
                      onChange={(e) => setNewBug({
                        ...newBug,
                        securingByOptions: {
                          ...newBug.securingByOptions,
                          modificationInProgramCode: e.target.checked
                        }
                      })} 
                    />
                  }
                  label="تغییر در کد برنامه"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="امن‌سازی توسط WAF"
                  value={newBug.securingByWAF}
                  onChange={(e) => setNewBug({ ...newBug, securingByWAF: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <input
                  accept="image/*,.pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  id="bug-attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="bug-attachments">
                  <Button 
                    variant="outlined" 
                    startIcon={<CloudUploadIcon />}
                    component="span"
                    fullWidth
                  >
                    افزودن مدارک و مستندات (POCs)
                  </Button>
                </label>
                
                {filePreviews.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      فایل‌های انتخاب شده:
                    </Typography>
                    <Grid container spacing={1}>
                      {filePreviews.map((file, index) => (
                        <Grid item key={index}>
                          <Chip
                            icon={<CloudUploadIcon />}
                            label={file.name}
                            onDelete={() => removeFile(index)}
                            deleteIcon={<DeleteIcon />}
                            variant="outlined"
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="error">انصراف</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            ثبت گزارش
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BugReportForm;