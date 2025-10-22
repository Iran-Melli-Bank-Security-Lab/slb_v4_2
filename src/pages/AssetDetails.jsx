import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Divider,
  Button,
  Box,
  Avatar,
  Tooltip,
  Breadcrumbs,
  Link,
  Alert,
  Paper,
  Container,
} from "@mui/material";
import {
  ArrowBack,
  InfoOutlined,
  CalendarToday,
  Person,
  LocationOn,
  Business,
  AttachMoney,
  Security,
  Computer,
  Description,
  Tag,
  Memory,
  SdStorage,
  Speed,
} from "@mui/icons-material";
import { getAsset } from "../api/asset/getAsset";

const AssetDetails = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAsset(assetId);
        setAsset(data.data || null);
      } catch (err) {
        console.error("❌ خطا در دریافت اطلاعات دارایی:", err);
        setError("دریافت اطلاعات دارایی با خطا مواجه شد. لطفا مجددا تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [assetId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "فعال": return "success";
      case "غیرفعال": return "default";
      case "در حال تعمیر": return "warning";
      case "از رده خارج": return "error";
      default: return "primary";
    }
  };

  const getOwnerTypeColor = (ownerType) => {
    switch (ownerType?.toLowerCase()) {
      case "شرکتی": return "primary";
      case "شخصی": return "secondary";
      case "اشتراکی": return "info";
      default: return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "فعال";
      case "inactive": return "غیرفعال";
      case "maintenance": return "در حال تعمیر";
      case "retired": return "از رده خارج";
      default: return status;
    }
  };

  const getOwnerTypeText = (ownerType) => {
    switch (ownerType?.toLowerCase()) {
      case "company": return "شرکتی";
      case "personal": return "شخصی";
      case "shared": return "اشتراکی";
      default: return ownerType;
    }
  };

  const InfoCard = ({ label, value, icon = null, tooltip = "" }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
          borderColor: '#3b82f6'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, direction: 'rtl' }}>
        {icon && (
          <Avatar 
            sx={{ 
              width: 48, 
              height: 48, 
              bgcolor: 'primary.50',
              color: 'primary.main',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }} 
          >
            {icon}
          </Avatar>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: 0.5,
              display: 'block',
              mb: 0.5
            }}
          >
            {label}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              wordBreak: 'break-word',
              fontSize: '1rem',
              lineHeight: 1.4
            }}
          >
            {value || (
              <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic', fontWeight: 400 }}>
                مشخص نشده
              </Box>
            )}
          </Typography>
        </Box>
        {tooltip && (
          <Tooltip title={tooltip} arrow placement="left">
            <InfoOutlined sx={{ color: 'text.disabled', fontSize: 20, mt: 0.5, flexShrink: 0 }} />
          </Tooltip>
        )}
      </Box>
    </Paper>
  );

  const SectionHeader = ({ title, icon, subtitle = "" }) => (
    <Box sx={{ mb: 4, direction: 'rtl' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        {icon}
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mr: 4, fontSize: '0.9rem' }}>
          {subtitle}
        </Typography>
      )}
      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  const dateFormat = (date) =>
    date ? new Date(date).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null;

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <CircularProgress size={64} thickness={3} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary', fontWeight: 600 }}>
          در حال دریافت اطلاعات دارایی...
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.disabled' }}>
          لطفا چند لحظه صبر کنید
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              mb: 3,
              fontSize: '1rem'
            }}
          >
            {error}
          </Alert>
          <Button
            variant="contained"
            
            onClick={() => navigate(-1)}
            size="small"
            sx={{ 
              borderRadius: 2.5,
              px: 4,
              py: 1.2,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            بازگشت
          </Button>
        </Box>
      </Container>
    );
  }

  if (!asset) {
    return (
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ color: 'text.disabled', mb: 2, fontSize: '4rem' }}>
            ⚠️
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 800 }}>
            دارایی یافت نشد
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}>
            دارایی مورد نظر شما وجود ندارد یا به مکان دیگری منتقل شده است.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            size="large"
            sx={{ 
              borderRadius: 2.5,
              px: 4,
              py: 1.2,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            بازگشت به دارایی ها
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, px: 1, direction: 'ltr' }}>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/assets")}
            sx={{ 
              cursor: 'pointer', 
              fontWeight: 600, 
              fontSize: '0.95rem',
              '&:hover': { color: 'primary.main' }, 
              transition: 'color 0.3s ease' 
            }}
          >
            دارایی ها
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.95rem' }}>
            {asset.name}
          </Typography>
        </Breadcrumbs>

        {/* Header Section */}
        <Card 
        className="p-6 !bg-gradient-to-r !from-blue-600 !to-indigo-700 !text-white"
        sx={{ 
          borderRadius: 2, 
          mb: 1,
          overflow: 'hidden',
        }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', lg: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', lg: 'center' },
              gap: 3,
              direction: 'rtl'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flex: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 88, 
                    height: 88, 
                    bgcolor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    flexShrink: 0
                  }}
                >
                  <Computer sx={{ fontSize: 44 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, textAlign: 'right', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                    {asset.name}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                    <Chip 
                      label={asset.type?.toUpperCase()} 
                      size="medium" 
                      sx={{ 
                        backgroundColor: 'white', 
                        color: 'primary.main', 
                        fontWeight: 700, 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '0.8rem'
                      }}
                    />
                    <Chip 
                      label={`وضعیت: ${getStatusText(asset.status)}`} 
                      color={getStatusColor(asset.status)} 
                      size="medium"
                      variant="outlined"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'white', 
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}
                    />
                    <Chip 
                      label={`مالکیت: ${getOwnerTypeText(asset.ownerType)}`} 
                      color={getOwnerTypeColor(asset.ownerType)} 
                      size="medium"
                      variant="outlined"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'white', 
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white', 
                  fontWeight: 700, 
                  px: 4,
                  py: 1.2,
                  borderRadius: 2.5,
                  fontSize: '1rem',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}
                size="small"
              >
                بازگشت
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Grid container spacing={3} sx={{ direction: 'rtl' }}>
          {/* Left Column - Asset Details */}
          <Grid item xs={12} xl={9}>
            <Card sx={{ 
              borderRadius: 4, 
              boxShadow: '0 12px 40px rgba(0,0,0,0.12)', 
              border: 'none', 
              overflow: 'hidden',
              background: 'white'
            }}>
              <CardContent sx={{ p: 4 }}>
                <SectionHeader 
                  title="اطلاعات دارایی" 
                  icon={<InfoOutlined sx={{ color: 'primary.main', fontSize: '28px' }} />}
                  subtitle="جزئیات کامل و مشخصات فنی دارایی"
                />
                
                {/* Basic Information */}
                <SectionHeader 
                  title="اطلاعات پایه" 
                  icon={<Business sx={{ color: 'text.secondary', fontSize: '26px' }} />}
                />
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                  {[
                    { label: "برند", value: asset.brand, icon: <Business />, tooltip: "برند سازنده" },
                    { label: "مدل", value: asset.model, icon: <Computer />, tooltip: "مدل دستگاه" },
                    { label: "ورژن", value: asset.version, icon: <Security />, tooltip: "ورژن نرم افزار/فریمور" }
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={index}>
                      <InfoCard {...item} />
                    </Grid>
                  ))}
                </Grid>

                {/* Identification Details */}
                <SectionHeader 
                  title="مشخصات شناسایی" 
                  icon={<Memory sx={{ color: 'text.secondary', fontSize: '26px' }} />}
                />
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                  {[
                    { label: "شماره سریال", value: asset.serialNumber, tooltip: "شناسه یکتای سریال" },
                    { label: "آدرس MAC", value: asset.macAddress, tooltip: "آدرس رابط شبکه" },
                    { label: "آدرس IP", value: asset.ipAddress, tooltip: "آدرس پروتکل اینترنت" }
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={index}>
                      <InfoCard {...item} />
                    </Grid>
                  ))}
                </Grid>

                {/* Location & Vendor */}
                <SectionHeader 
                  title="موقعیت و فروشنده" 
                  icon={<LocationOn sx={{ color: 'text.secondary', fontSize: '26px' }} />}
                />
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                  {[
                    { label: "موقعیت", value: asset.location, icon: <LocationOn />, tooltip: "موقعیت فیزیکی" },
                    { label: "فروشنده", value: asset.vendor, icon: <Business />, tooltip: "تامین کننده یا فروشنده" },
                    { 
                      label: "هزینه", 
                      value: asset.cost ? `${parseFloat(asset.cost).toLocaleString('fa-IR')} تومان` : null, 
                      icon: <AttachMoney />, 
                      tooltip: "هزینه خرید" 
                    }
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={index}>
                      <InfoCard {...item} />
                    </Grid>
                  ))}
                </Grid>

                {/* Dates */}
                <SectionHeader 
                  title="تاریخ های مهم" 
                  icon={<CalendarToday sx={{ color: 'text.secondary', fontSize: '26px' }} />}
                />
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                  {[
                    { label: "تاریخ خرید", value: dateFormat(asset.purchaseDate), icon: <CalendarToday />, tooltip: "تاریخ خرید" },
                    { label: "تاریخ انقضای گارانتی", value: dateFormat(asset.warrantyExpiry), icon: <CalendarToday />, tooltip: "تاریخ انقضای گارانتی" },
                    { label: "برنامه تعمیرات", value: dateFormat(asset.maintenanceSchedule), icon: <CalendarToday />, tooltip: "تاریخ تعمیرات بعدی" }
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={index}>
                      <InfoCard {...item} />
                    </Grid>
                  ))}
                </Grid>

                {/* Assignment Information */}
                <SectionHeader 
                  title="اطلاعات انتساب" 
                  icon={<Person sx={{ color: 'text.secondary', fontSize: '26px' }} />}
                />
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                  {[
                    { label: "واگذار شده به", value: asset.assignedTo?.name, icon: <Person />, tooltip: "شخص محول شده این دارایی" },
                    { label: "تاریخ انتساب", value: dateFormat(asset.assignedDate), icon: <CalendarToday />, tooltip: "تاریخ زمانی که محول شد" }
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={index}>
                      <InfoCard {...item} />
                    </Grid>
                  ))}
                </Grid>

                {/* Software Information */}
                {asset.softwareType && (
                  <>
                    <SectionHeader 
                      title="اطلاعات نرم افزار" 
                      icon={<Speed sx={{ color: 'text.secondary', fontSize: '26px' }} />}
                    />
                    <Grid container spacing={2.5} sx={{ mb: 4 }}>
                      {[
                        { label: "نوع نرم افزار", value: asset.softwareType },
                        { label: "کلید لایسنس", value: asset.licenseKey },
                        { label: "وضعیت لایسنس", value: asset.licenseStatus },
                        { label: "تاریخ انقضای لایسنس", value: dateFormat(asset.licenseExpiry), icon: <CalendarToday /> },
                        { label: "تاریخ نصب", value: dateFormat(asset.installDate), icon: <CalendarToday /> },
                        { label: "تعداد نصب مجاز", value: asset.allowedInstallations }
                      ].map((item, index) => (
                        <Grid item xs={12} sm={6} lg={4} key={index}>
                          <InfoCard {...item} />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}

                {/* Description */}
                {asset.description && (
                  <>
                    <SectionHeader 
                      title="توضیحات" 
                      icon={<Description sx={{ color: 'text.secondary', fontSize: '26px' }} />}
                    />
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
                        border: '1px solid #bfdbfe'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, direction: 'rtl' }}>
                        <Avatar sx={{ width: 52, height: 52, bgcolor: 'primary.main', flexShrink: 0 }}>
                          <Description />
                        </Avatar>
                        <Typography variant="body1" sx={{ 
                          color: 'text.primary', 
                          lineHeight: 1.8, 
                          fontSize: '1.05rem', 
                          textAlign: 'right' 
                        }}>
                          {asset.description}
                        </Typography>
                      </Box>
                    </Paper>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Metadata */}
          <Grid item xs={12} xl={3}>
            {/* Tags */}
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
              border: 'none', 
              mb: 3,
              background: 'white'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  color: 'text.primary', 
                  textAlign: 'right',
                  fontSize: '1.1rem'
                }}>
                  <Tag sx={{ color: 'primary.main' }} />
                  تگ های دارایی
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, direction: 'rtl' }}>
                  {asset.tags?.length ? (
                    asset.tags.map((tag) => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        variant="outlined" 
                        color="primary"
                        size="medium"
                        sx={{ 
                          fontWeight: 600, 
                          borderRadius: 2, 
                          borderWidth: 2,
                          fontSize: '0.8rem'
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ 
                      color: 'text.disabled', 
                      fontStyle: 'italic', 
                      textAlign: 'center', 
                      width: '100%', 
                      p: 2,
                      fontSize: '0.9rem'
                    }}>
                      تگی موجود نیست
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Department Scope */}
            {asset.departmentScope?.length > 0 && (
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                border: 'none', 
                mb: 3,
                background: 'white'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    mb: 2, 
                    color: 'text.primary', 
                    textAlign: 'right',
                    fontSize: '1.1rem'
                  }}>
                    محدوده دپارتمان
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, direction: 'rtl' }}>
                    {asset.departmentScope.map((dep) => (
                      <Chip 
                        key={dep} 
                        label={dep} 
                        color="success" 
                        size="medium"
                        variant="outlined"
                        sx={{ 
                          fontWeight: 600, 
                          borderRadius: 2, 
                          borderWidth: 2,
                          fontSize: '0.8rem'
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Platforms */}
            {asset.platforms?.length > 0 && (
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                border: 'none',
                background: 'white'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    mb: 2, 
                    color: 'text.primary', 
                    textAlign: 'right',
                    fontSize: '1.1rem'
                  }}>
                    پلتفرم های پشتیبانی شده
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, direction: 'rtl' }}>
                    {asset.platforms.map((p) => (
                      <Chip 
                        key={p} 
                        label={p} 
                        variant="outlined" 
                        color="info"
                        size="medium"
                        sx={{ 
                          fontWeight: 600, 
                          borderRadius: 2, 
                          borderWidth: 2,
                          fontSize: '0.8rem'
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AssetDetails;