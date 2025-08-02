import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Avatar, IconButton, Collapse, Tooltip, Paper, Chip
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Code as CodeIcon,
  Dns as DnsIcon,
  Storage as StorageIcon,
  VpnKey as KeyIcon,
  Public as PublicIcon,
  Computer as ComputerIcon,
  Web as WebIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  DeveloperBoard as FrameworkIcon,
  Cloud as CloudIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Info as InfoIcon,
  ContentCopy as CopyIcon
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { getDevOpsInfo } from "../../../api/devops/getDevOpsInfo";
import { useParams } from "react-router";
import { useUserId } from "../../../hooks/useUserId";

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

const PasswordField = ({ value }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography variant="body1" fontWeight={500}>
        {showPassword ? value : "••••••••"}
      </Typography>
      <Tooltip title={showPassword ? "Hide password" : "Show password"}>
        <IconButton 
          size="small" 
          onClick={() => setShowPassword(!showPassword)}
          sx={{ ml: 1 }}
        >
          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <CopyButton value={value} tooltip="Copy password" />
    </Box>
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
      {value && !children && (
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

const hasValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
  return value !== null && value !== undefined && value !== '';
};

const hasTechnologyStack = (stack) => {
  return stack && (
    stack.frontendLanguage ||
    stack.backendLanguage ||
    (stack.databases && stack.databases.length > 0) ||
    stack.webServer ||
    (stack.frameworks && stack.frameworks.length > 0)
  );
};

const DevOpsInfoDisplay = ({}) => {
  const [devOpsInfo, setDevOpsInfo] = useState(null);
  const {id: projectId} = useParams();
  const userId = useUserId();

  useEffect(() => {
    const fetchDevOpsInfo = async() => {
      const result = await getDevOpsInfo(projectId, userId);
      setDevOpsInfo(result);
    }

    fetchDevOpsInfo();
  }, [projectId, userId]);

  const [expandedSections, setExpandedSections] = useState({
    platform: false ,
    endpoints: false ,
    technology: false ,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderPlatformInfo = () => {
    if (!devOpsInfo?.platformData?.web) return null;
    
    const data = devOpsInfo.platformData.web;
    const hasAccessInfo = hasValue(data.accessInfo);
    const hasVmInfo = hasValue(data.vmInfo);
    const hasDockerInfo = hasValue(data.dockerInfo);

    if (!hasAccessInfo && !hasVmInfo && !hasDockerInfo) return null;

    return (
      <SectionCard>
        <SectionHeader onClick={() => toggleSection('platform')}>
          <Avatar sx={{ 
            bgcolor: alpha(colors.primary, 0.1),
            color: colors.primary,
            mr: 2
          }}>
            <WebIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              Web Platform Configuration
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Environment and access details
            </Typography>
          </Box>
          <IconButton size="small">
            {expandedSections.platform ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </SectionHeader>
        
        <Collapse in={expandedSections.platform}>
          <Box sx={{ p: 3 }}>
            <DetailRow 
              icon={<SettingsIcon />}
              label="Environment Type"
              value={data.environmentType}
            />
            
            {hasAccessInfo && (
              <>
                <Typography variant="subtitle2" sx={{ mb: 2, mt: 3, color: colors.secondary }}>
                  Access Information
                </Typography>
                <Grid container spacing={2}>
                  {data.accessInfo.address && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<PublicIcon />}
                        label="Address"
                        value={data.accessInfo.address}
                        copyable
                      />
                    </Grid>
                  )}
                  {data.accessInfo.port && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<SettingsIcon />}
                        label="Port"
                        value={data.accessInfo.port}
                      />
                    </Grid>
                  )}
                  {data.accessInfo.username && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<KeyIcon />}
                        label="Username"
                        value={data.accessInfo.username}
                        copyable
                      />
                    </Grid>
                  )}
                  {data.accessInfo.password && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<LockIcon />}
                        label="Password"
                        children={<PasswordField value={data.accessInfo.password} />}
                      />
                    </Grid>
                  )}
                  {data.accessInfo.notes && (
                    <Grid item xs={12}>
                      <DetailRow 
                        icon={<InfoIcon />}
                        label="Notes"
                        value={data.accessInfo.notes}
                      />
                    </Grid>
                  )}
                </Grid>
              </>
            )}
            
            {hasVmInfo && (
              <>
                <Typography variant="subtitle2" sx={{ mb: 2, mt: 3, color: colors.secondary }}>
                  Virtual Machine Details
                </Typography>
                <Grid container spacing={2}>
                  {data.vmInfo.vmName && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<ComputerIcon />}
                        label="VM Name"
                        value={data.vmInfo.vmName}
                        copyable
                      />
                    </Grid>
                  )}
                  {data.vmInfo.osType && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<StorageIcon />}
                        label="OS Type"
                        value={data.vmInfo.osType}
                      />
                    </Grid>
                  )}
                  {data.vmInfo.hypervisor && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<SettingsIcon />}
                        label="Hypervisor"
                        value={data.vmInfo.hypervisor}
                      />
                    </Grid>
                  )}
                  {data.vmInfo.sshKey && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<KeyIcon />}
                        label="SSH Key"
                        children={<PasswordField value={data.vmInfo.sshKey} />}
                      />
                    </Grid>
                  )}
                  {data.vmInfo.snapshot && (
                    <Grid item xs={12}>
                      <DetailRow 
                        icon={<StorageIcon />}
                        label="Snapshot"
                        value={data.vmInfo.snapshot}
                      />
                    </Grid>
                  )}
                </Grid>
              </>
            )}
            
            {hasDockerInfo && (
              <>
                <Typography variant="subtitle2" sx={{ mb: 2, mt: 3, color: colors.secondary }}>
                  Docker Configuration
                </Typography>
                <Grid container spacing={2}>
                  {data.dockerInfo.imageName && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<CloudIcon />}
                        label="Image Name"
                        value={data.dockerInfo.imageName}
                        copyable
                      />
                    </Grid>
                  )}
                  {data.dockerInfo.containerName && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<SettingsIcon />}
                        label="Container Name"
                        value={data.dockerInfo.containerName}
                        copyable
                      />
                    </Grid>
                  )}
                  {data.dockerInfo.ports?.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<StorageIcon />}
                        label="Ports"
                        value={data.dockerInfo.ports.join(', ')}
                      />
                    </Grid>
                  )}
                  {data.dockerInfo.volumes?.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<StorageIcon />}
                        label="Volumes"
                        value={data.dockerInfo.volumes.join(', ')}
                      />
                    </Grid>
                  )}
                  {data.dockerInfo.envVariables?.length > 0 && (
                    <Grid item xs={12}>
                      <DetailRow 
                        icon={<CodeIcon />}
                        label="Environment Variables"
                        value={
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {data.dockerInfo.envVariables.map((env, i) => (
                              <Chip 
                                key={i}
                                label={env}
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
                  {data.dockerInfo.network && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<PublicIcon />}
                        label="Network"
                        value={data.dockerInfo.network}
                      />
                    </Grid>
                  )}
                  {data.dockerInfo.dockerHost && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow 
                        icon={<ComputerIcon />}
                        label="Docker Host"
                        value={data.dockerInfo.dockerHost}
                        copyable
                      />
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </Box>
        </Collapse>
      </SectionCard>
    );
  };

  const renderEndpoints = () => {
    if (!devOpsInfo?.endpoints?.length) return null;

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
            {devOpsInfo.endpoints.map((endpoint, index) => {
              const hasTechStack = hasTechnologyStack(endpoint.technologyStack);
              const fullUrl = endpoint.url.startsWith('http') ? endpoint.url : `https://${endpoint.url}`;
              
              return (
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
                      onClick={() => window.open(fullUrl, '_blank', 'noopener,noreferrer')}
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
                  
                  {hasTechStack && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                        Technology Stack
                      </Typography>
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        {endpoint.technologyStack.frontendLanguage && (
                          <Grid item xs={12} sm={6} md={3}>
                            <DetailRow 
                              icon={<CodeIcon />}
                              label="Frontend"
                              value={endpoint.technologyStack.frontendLanguage}
                            />
                          </Grid>
                        )}
                        {endpoint.technologyStack.backendLanguage && (
                          <Grid item xs={12} sm={6} md={3}>
                            <DetailRow 
                              icon={<CodeIcon />}
                              label="Backend"
                              value={endpoint.technologyStack.backendLanguage}
                            />
                          </Grid>
                        )}
                        {endpoint.technologyStack.databases?.length > 0 && (
                          <Grid item xs={12} sm={6} md={3}>
                            <DetailRow 
                              icon={<StorageIcon />}
                              label="Databases"
                              value={endpoint.technologyStack.databases.join(', ')}
                            />
                          </Grid>
                        )}
                        {endpoint.technologyStack.webServer && (
                          <Grid item xs={12} sm={6} md={3}>
                            <DetailRow 
                              icon={<ComputerIcon />}
                              label="Web Server"
                              value={endpoint.technologyStack.webServer}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  )}
                  
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
                                children={<PasswordField value={cred.password} />}
                              />
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Collapse>
      </SectionCard>
    );
  };

  const renderTechnologyStack = () => {
    if (!devOpsInfo?.technologyStack?.web) return null;

    const { web } = devOpsInfo.technologyStack;

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
            <Grid container spacing={3}>
              {web.frontendLanguage && (
                <Grid item xs={12} sm={6} md={4}>
                  <DetailRow 
                    icon={<CodeIcon />}
                    label="Frontend Language"
                    value={web.frontendLanguage}
                  />
                </Grid>
              )}
              {web.backendLanguage && (
                <Grid item xs={12} sm={6} md={4}>
                  <DetailRow 
                    icon={<CodeIcon />}
                    label="Backend Language"
                    value={web.backendLanguage}
                  />
                </Grid>
              )}
              {web.databases?.length > 0 && (
                <Grid item xs={12} sm={6} md={4}>
                  <DetailRow 
                    icon={<StorageIcon />}
                    label="Databases"
                    value={web.databases.join(', ')}
                  />
                </Grid>
              )}
              {web.frameworks?.length > 0 && (
                <Grid item xs={12}>
                  <DetailRow 
                    icon={<FrameworkIcon />}
                    label="Frameworks"
                    value={
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {web.frameworks.map((fw, i) => (
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
              {web.webServer && (
                <Grid item xs={12} sm={6}>
                  <DetailRow 
                    icon={<ComputerIcon />}
                    label="Web Server"
                    value={web.webServer}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </Collapse>
      </SectionCard>
    );
  };

  if (!devOpsInfo) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
          DevOps Configuration
        </Typography>
        <Typography>Loading DevOps information...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
        DevOps Configuration
      </Typography>
      
      {renderPlatformInfo()}
      {renderEndpoints()}
      {renderTechnologyStack()}
    </Box>
  );
};

export default DevOpsInfoDisplay;