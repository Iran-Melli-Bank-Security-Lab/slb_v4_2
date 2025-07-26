import React, { useState } from "react";
import {
  Box, Card, Typography, Grid, Divider, Chip, Avatar,
  IconButton, Collapse, Tooltip, Paper, Badge
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Code as CodeIcon,
  Dns as DnsIcon,
  Storage as StorageIcon,
  VpnKey as KeyIcon,
  Public as PublicIcon,
  Computer as ComputerIcon,
  PhoneIphone as MobileIcon,
  Web as WebIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  DeveloperBoard as FrameworkIcon,
  Cloud as CloudIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ContentCopy as CopyIcon
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";

// Luxury color palette
const colors = {
  primary: "#4361EE",
  secondary: "#3A0CA3",
  accent: "#7209B7",
  success: "#4CC9F0",
  warning: "#F8961E",
  error: "#F72585",
  dark: "#1A1A2E",
  light: "#F8F9FA"
};

// Styled components
const SectionCard = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: `0 8px 32px ${alpha(colors.dark, 0.08)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 40px ${alpha(colors.dark, 0.12)}`
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${alpha(colors.primary, 0.1)} 0%, transparent 100%)`,
  borderBottom: `1px solid ${alpha(colors.primary, 0.1)}`,
  cursor: "pointer",
  "&:hover": {
    background: `linear-gradient(135deg, ${alpha(colors.primary, 0.15)} 0%, transparent 100%)`
  }
}));

const InfoBadge = styled(Chip)(({ type }) => ({
  borderRadius: "12px",
  fontWeight: 700,
  fontSize: "0.65rem",
  padding: "4px 8px",
  backgroundColor: type === 'success' ? `${colors.success}20` :
                type === 'warning' ? `${colors.warning}20` :
                type === 'error' ? `${colors.error}20` : `${colors.primary}20`,
  color: type === 'success' ? colors.success :
       type === 'warning' ? colors.warning :
       type === 'error' ? colors.error : colors.primary,
  border: `1px solid ${type === 'success' ? colors.success :
          type === 'warning' ? colors.warning :
          type === 'error' ? colors.error : colors.primary}`
}));

const ClickableText = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    color: colors.primary,
    textDecoration: "underline"
  }
}));

const CopyButton = ({ value, tooltip = "Copy to clipboard" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip title={copied ? "Copied!" : tooltip} arrow>
      <IconButton size="small" onClick={handleCopy} sx={{ ml: 1 }}>
        <CopyIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

const DetailRow = ({ icon, label, value, children, copyable = false }) => (
  <Box sx={{ display: "flex", mb: 2, alignItems: "flex-start" }}>
    <Box sx={{ 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      borderRadius: "12px",
      bgcolor: alpha(colors.primary, 0.1),
      color: colors.primary,
      mr: 2,
      flexShrink: 0
    }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      {value && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" fontWeight={500}>
            {value}
          </Typography>
          {copyable && <CopyButton value={value} />}
        </Box>
      )}
      {children}
    </Box>
  </Box>
);

const DevOpsInfoDisplay = ({ devOpsInfo }) => {
  const [expandedSections, setExpandedSections] = useState({
    platform: false,
    endpoints: false,
    technology: false, 
    dashboard:true 
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderPlatformInfo = () => {
    if (!devOpsInfo.platformData) return null;
    
    const platform = devOpsInfo.platform;
    const data = devOpsInfo.platformData[platform];

    return (
      <SectionCard>
        <SectionHeader onClick={() => toggleSection('platform')}>
          <Avatar sx={{ 
            bgcolor: alpha(colors.primary, 0.1),
            color: colors.primary,
            mr: 2
          }}>
            {platform === 'web' ? <WebIcon /> :
             platform === 'mobile' ? <MobileIcon /> : <ComputerIcon />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)} Platform
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Configuration and deployment details
            </Typography>
          </Box>
          <IconButton size="small">
            {expandedSections.platform ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </SectionHeader>
        
        <Collapse in={expandedSections.platform}>
          <Box sx={{ p: 3 }}>
            {platform === 'web' && (
              <>
                <DetailRow 
                  icon={<SettingsIcon />}
                  label="Environment Type"
                  value={data.environmentType}
                />
                
                {data.vmInfo && (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 2, mt: 3, color: colors.secondary }}>
                      Virtual Machine Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <DetailRow 
                          icon={<ComputerIcon />}
                          label="VM Name"
                          value={data.vmInfo.vmName}
                          copyable
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DetailRow 
                          icon={<StorageIcon />}
                          label="OS Type"
                          value={data.vmInfo.osType}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DetailRow 
                          icon={<SettingsIcon />}
                          label="CPU Cores"
                          value={data.vmInfo.cpuCores}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DetailRow 
                          icon={<StorageIcon />}
                          label="Memory"
                          value={data.vmInfo.memory}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DetailRow 
                          icon={<StorageIcon />}
                          label="Storage"
                          value={data.vmInfo.storage}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DetailRow 
                          icon={<PublicIcon />}
                          label="IP Address"
                          value={data.vmInfo.ipAddress}
                          copyable
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <DetailRow 
                          icon={<DnsIcon />}
                          label="Hostname"
                          value={data.vmInfo.hostname}
                          copyable
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
                
                {data.dockerInfo && (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 2, mt: 3, color: colors.secondary }}>
                      Docker Configuration
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <DetailRow 
                          icon={<CloudIcon />}
                          label="Image Name"
                          value={data.dockerInfo.imageName}
                          copyable
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DetailRow 
                          icon={<SettingsIcon />}
                          label="Container Name"
                          value={data.dockerInfo.containerName}
                          copyable
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DetailRow 
                          icon={<StorageIcon />}
                          label="Port Mapping"
                          value={data.dockerInfo.portMapping}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DetailRow 
                          icon={<StorageIcon />}
                          label="Volume Mapping"
                          value={data.dockerInfo.volumeMapping}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </>
            )}
            
            {platform === 'mobile' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailRow 
                    icon={<MobileIcon />}
                    label="Platform"
                    value={data.platform}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailRow 
                    icon={<StorageIcon />}
                    label="App File"
                    value={data.appFile || 'Not specified'}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </Collapse>
      </SectionCard>
    );
  };

  const renderEndpoints = () => {
    if (!devOpsInfo.endpoints?.length) return null;

    return (
      <SectionCard sx={{ mt: 3 }}>
        <SectionHeader onClick={() => toggleSection('endpoints')}>
          <Avatar sx={{ 
            bgcolor: alpha(colors.accent, 0.1),
            color: colors.accent,
            mr: 2
          }}>
            <DnsIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              Endpoints
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {devOpsInfo.endpoints.length} configured access points
            </Typography>
          </Box>
          <IconButton size="small">
            {expandedSections.endpoints ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </SectionHeader>
        
        <Collapse in={expandedSections.endpoints}>
          <Box sx={{ p: 3 }}>
            {devOpsInfo.endpoints.map((endpoint, index) => (
              <Box key={index} sx={{ 
                mb: 3,
                p: 2,
                borderRadius: "12px",
                bgcolor: alpha(colors.primary, 0.03),
                borderLeft: `3px solid ${colors.primary}`
              }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {endpoint.isDns ? (
                    <DnsIcon sx={{ color: colors.success, mr: 1.5 }} />
                  ) : (
                    <PublicIcon sx={{ color: colors.primary, mr: 1.5 }} />
                  )}
                  <ClickableText 
                    fontWeight={600}
                    onClick={() => window.open(endpoint.url, '_blank')}
                  >
                    {endpoint.url}
                  </ClickableText>
                  {endpoint.ip && (
                    <>
                      <InfoBadge 
                        label={endpoint.ip} 
                        size="small" 
                        sx={{ ml: 1.5, cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(endpoint.ip);
                        }}
                      />
                      <CopyButton value={endpoint.ip} tooltip="Copy IP" />
                    </>
                  )}
                </Box>
                
                {endpoint.credentials?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                      Access Credentials
                    </Typography>
                    <Grid container spacing={2}>
                      {endpoint.credentials.map((cred, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                          <Paper sx={{ p: 2, borderRadius: "12px" }}>
                            <DetailRow 
                              icon={<KeyIcon />}
                              label="Username"
                              value={cred.username}
                              copyable
                            />
                            <DetailRow 
                              icon={<LockIcon />}
                              label="Password"
                              value="••••••••"
                              copyable={!!cred.password}
                            >
                              {cred.password && (
                                <Box sx={{ display: "none" }}>{cred.password}</Box>
                              )}
                            </DetailRow>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Collapse>
      </SectionCard>
    );
  };

  const renderTechnologyStack = () => {
    if (!devOpsInfo.technologyStack) return null;

    const { technologyStack } = devOpsInfo;
    const platform = devOpsInfo.platform;

    return (
      <SectionCard sx={{ mt: 3 }}>
        <SectionHeader onClick={() => toggleSection('technology')}>
          <Avatar sx={{ 
            bgcolor: alpha(colors.secondary, 0.1),
            color: colors.secondary,
            mr: 2
          }}>
            <CodeIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              Technology Stack
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Platform architecture and components
            </Typography>
          </Box>
          <IconButton size="small">
            {expandedSections.technology ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </SectionHeader>
        
        <Collapse in={expandedSections.technology}>
          <Box sx={{ p: 3 }}>
            {platform === 'web' && technologyStack.web && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <DetailRow 
                    icon={<CodeIcon />}
                    label="Frontend Language"
                    value={technologyStack.web.frontendLanguage}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <DetailRow 
                    icon={<CodeIcon />}
                    label="Backend Language"
                    value={technologyStack.web.backendLanguage}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <DetailRow 
                    icon={<StorageIcon />}
                    label="Databases"
                    value={technologyStack.web.databases?.join(', ')}
                  />
                </Grid>
                {technologyStack.web.frameworks?.length > 0 && (
                  <Grid item xs={12}>
                    <DetailRow 
                      icon={<FrameworkIcon />}
                      label="Frameworks"
                      value={
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {technologyStack.web.frameworks.map((fw, i) => (
                            <Chip 
                              key={i}
                              label={fw}
                              size="small"
                              sx={{
                                bgcolor: alpha(colors.secondary, 0.1),
                                color: colors.secondary
                              }}
                            />
                          ))}
                        </Box>
                      }
                    />
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </Collapse>
      </SectionCard>
    );
  };

   const renderPlatformInfo1 = () => {
    if (!devOpsInfo.platformData) return null;
    
    const platform = devOpsInfo.platform;
    const data = devOpsInfo.platformData[platform];

    return (
      <SectionCard>
        <SectionHeader onClick={() => toggleSection('dashboard')}>
          <Avatar sx={{ 
            bgcolor: alpha(colors.primary, 0.1),
            color: colors.primary,
            mr: 2
          }}>
            {platform === 'web' ? <WebIcon /> :
             platform === 'mobile' ? <MobileIcon /> : <ComputerIcon />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)} Platform
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Configuration and deployment details
            </Typography>
          </Box>
          <IconButton size="small">
            {expandedSections.platform ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </SectionHeader>
        
        <Collapse in={expandedSections.platform}>
          <Box sx={{ p: 3 }}>
            
          </Box>
        </Collapse>
      </SectionCard>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
        DevOps Configuration
      </Typography>
      
      {renderPlatformInfo()}
      {renderEndpoints()}
      {/* {renderTechnologyStack()} */}
      
    </Box>
  );
};

export default DevOpsInfoDisplay;