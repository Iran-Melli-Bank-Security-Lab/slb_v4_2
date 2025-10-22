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
  Alert,
  Breadcrumbs,
  Link,
  Avatar,
  Tooltip,
  IconButton
} from "@mui/material";
import {
  ArrowBack,
  InfoOutlined,
  Home,
  Category,
  Build,
  Computer,
  Description,
  LocalOffer,
  CalendarToday,
  Person,
  LocationOn,
  AttachMoney,
  Business,
  Security,
  Storage
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
        console.error("❌ Error fetching asset details:", err);
        setError("Failed to load asset details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [assetId]);

  // تابع برای انتخاب آیکون بر اساس نوع asset
  const getAssetIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'hardware':
        return <Computer sx={{ fontSize: 24 }} />;
      case 'software':
        return <Storage sx={{ fontSize: 24 }} />;
      case 'equipment':
        return <Build sx={{ fontSize: 24 }} />;
      default:
        return <Category sx={{ fontSize: 24 }} />;
    }
  };

  // تابع برای انتخاب رنگ بر اساس وضعیت
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'maintenance':
        return 'warning';
      case 'retired':
        return 'error';
      default:
        return 'primary';
    }
  };

  // تابع برای فرمت کردن تاریخ
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // کامپوننت برای نمایش مقادیر
  const DetailCard = ({ icon, label, value, tooltip }) => (
    <Tooltip title={tooltip || ''} arrow placement="top">
      <Card 
        variant="outlined" 
        sx={{ 
          height: '100%',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 2,
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box display="flex" alignItems="center" mb={1}>
            {icon}
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ ml: 1, fontWeight: 500 }}
            >
              {label}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {value || (
              <Typography 
                component="span" 
                variant="body2" 
                color="text.disabled" 
                fontStyle="italic"
              >
                Not specified
              </Typography>
            )}
          </Typography>
        </CardContent>
      </Card>
    </Tooltip>
  );

  // نمایش وضعیت لودینگ
  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="70vh"
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Asset Details...
        </Typography>
      </Box>
    );
  }

  // نمایش خطا
  if (error || !asset) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => navigate(-1)}
              startIcon={<ArrowBack />}
            >
              Back
            </Button>
          }
          sx={{ mb: 2 }}
        >
          {error || "Asset not found"}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/')}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Home sx={{ mr: 0.5, fontSize: 20 }} />
            Home
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/assets')}
          >
            Assets
          </Link>
          <Typography color="text.primary">{asset.name}</Typography>
        </Breadcrumbs>

        {/* Header Section */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{ 
                    bgcolor: 'primary.main', 
                    width: 56, 
                    height: 56,
                    mr: 2
                  }}
                >
                  {getAssetIcon(asset.type)}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {asset.name}
                  </Typography>
                  <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                    <Chip 
                      label={asset.type} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={asset.status} 
                      color={getStatusColor(asset.status)}
                      size="small"
                    />
                    <Chip 
                      label={asset.ownerType} 
                      size="small"
                      icon={<Business fontSize="small" />}
                    />
                  </Box>
                </Box>
              </Box>
              
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate(-1)}
                >
                  برگشت 
                </Button>
                {/* <Button variant="contained">
                  Edit Asset
                </Button> */}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Grid container spacing={3}>
          
          {/* Left Column - Basic Information */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoOutlined sx={{ mr: 1 }} />
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<Build fontSize="small" />}
                      label="Brand"
                      value={asset.brand}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<Category fontSize="small" />}
                      label="Model"
                      value={asset.model}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<Storage fontSize="small" />}
                      label="Version"
                      value={asset.version}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<Security fontSize="small" />}
                      label="Serial Number"
                      value={asset.serialNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<Security fontSize="small" />}
                      label="License Key"
                      value={asset.licenseKey}
                      tooltip="Software license key"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<Computer fontSize="small" />}
                      label="MAC Address"
                      value={asset.macAddress}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<Computer fontSize="small" />}
                      label="IP Address"
                      value={asset.ipAddress}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<LocationOn fontSize="small" />}
                      label="Location"
                      value={asset.location}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<Business fontSize="small" />}
                      label="Vendor"
                      value={asset.vendor}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            {/* Financial Information */}
            <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ mr: 1 }} />
                  Financial Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<AttachMoney fontSize="small" />}
                      label="Cost"
                      value={asset.cost ? `$${asset.cost}` : null}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<CalendarToday fontSize="small" />}
                      label="Purchase Date"
                      value={formatDate(asset.purchaseDate)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DetailCard 
                      icon={<CalendarToday fontSize="small" />}
                      label="Warranty Expiry"
                      value={formatDate(asset.warrantyExpiry)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            {/* Description */}
            {asset.description && (
              <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Description sx={{ mr: 1 }} />
                    Description
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" paragraph>
                    {asset.description}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
          
          {/* Right Column - Additional Details */}
          <Grid item xs={12} md={4}>
            
            {/* Assignment Information */}
            <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} />
                  Assignment
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <DetailCard 
                  icon={<Person fontSize="small" />}
                  label="Assigned To"
                  value={asset.assignedTo?.name}
                />
                
                <Box mt={2}>
                  <DetailCard 
                    icon={<CalendarToday fontSize="small" />}
                    label="Assigned Date"
                    value={formatDate(asset.assignedDate)}
                  />
                </Box>
              </CardContent>
            </Card>
            
            {/* Software Details */}
            {(asset.softwareType || asset.licenseStatus) && (
              <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Software Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <DetailCard 
                        icon={<Category fontSize="small" />}
                        label="Software Type"
                        value={asset.softwareType}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DetailCard 
                        icon={<Security fontSize="small" />}
                        label="License Status"
                        value={asset.licenseStatus}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DetailCard 
                        icon={<CalendarToday fontSize="small" />}
                        label="License Expiry"
                        value={formatDate(asset.licenseExpiry)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DetailCard 
                        icon={<CalendarToday fontSize="small" />}
                        label="Install Date"
                        value={formatDate(asset.installDate)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DetailCard 
                        icon={<Computer fontSize="small" />}
                        label="Allowed Installations"
                        value={asset.allowedInstallations}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
            
            {/* Maintenance */}
            <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Maintenance
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <DetailCard 
                  icon={<CalendarToday fontSize="small" />}
                  label="Maintenance Schedule"
                  value={formatDate(asset.maintenanceSchedule)}
                />
              </CardContent>
            </Card>
            
            {/* Tags */}
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalOffer sx={{ mr: 1 }} />
                  Tags
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {asset.tags?.length ? (
                    asset.tags.map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      No tags available
                    </Typography>
                  )}
                </Box>
                
                {/* Department Scope */}
                {asset.departmentScope?.length > 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                      Department Scope:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {asset.departmentScope.map((dep, index) => (
                        <Chip 
                          key={index} 
                          label={dep} 
                          size="small" 
                          color="secondary"
                        />
                      ))}
                    </Box>
                  </>
                )}
                
                {/* Platforms */}
                {asset.platforms?.length > 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                      Platforms:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {asset.platforms.map((platform, index) => (
                        <Chip 
                          key={index} 
                          label={platform} 
                          size="small" 
                          variant="outlined"
                          color="info"
                        />
                      ))}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AssetDetails;