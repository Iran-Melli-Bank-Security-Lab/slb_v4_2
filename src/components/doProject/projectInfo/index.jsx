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

// Elevated palette and gradients
const colors = {
  ink: "#0B1020",
  slate: "#1E2333",
  primary: "#1B6EF3",
  secondary: "#00B2FF",
  accent: "#7B2FF7",
  success: "#12C48B",
  warning: "#FFB020",
  error: "#FF4D6D",
  surface: "#FFFFFF",
  surfaceMuted: "#F6F8FC"
};

const gradients = {
  canvas: "radial-gradient(1200px circle at 10% -20%, rgba(27,110,243,0.18), transparent 60%), radial-gradient(900px circle at 90% 10%, rgba(123,47,247,0.12), transparent 55%), linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 65%)",
  hero: "radial-gradient(900px circle at 15% -30%, rgba(27,110,243,0.35), transparent 55%), radial-gradient(700px circle at 85% 0%, rgba(0,178,255,0.25), transparent 55%), linear-gradient(135deg, #F7F9FF 0%, #FFFFFF 70%)",
  card: "linear-gradient(180deg, rgba(27,110,243,0.08) 0%, rgba(255,255,255,0.92) 60%)"
};

// Styled components
const PageShell = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(4, 2, 6),
  borderRadius: 28,
  background: gradients.canvas,
  border: `1px solid ${alpha(colors.ink, 0.06)}`,
  boxShadow: `0 24px 60px ${alpha(colors.ink, 0.12)}`,
  overflow: "hidden",
  fontFamily: '"Vazirmatn", "IRANSans", "Tahoma", sans-serif',
  "&:before": {
    content: '""',
    position: "absolute",
    inset: "0",
    background: "repeating-linear-gradient(90deg, rgba(11,16,32,0.04) 0px, rgba(11,16,32,0.04) 1px, transparent 1px, transparent 40px)",
    opacity: 0.35,
    pointerEvents: "none"
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${alpha(colors.accent, 0.28)} 0%, transparent 70%)`,
    top: -120,
    right: -80,
    pointerEvents: "none"
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 1.5, 5)
  }
}));

const HeroCard = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3.5, 4),
  borderRadius: 24,
  background: gradients.hero,
  border: `1px solid ${alpha(colors.primary, 0.18)}`,
  overflow: "hidden",
  boxShadow: `0 16px 40px ${alpha(colors.ink, 0.12)}`
}));

const StatPill = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 2,
  padding: theme.spacing(1, 1.5),
  borderRadius: 14,
  background: alpha(colors.ink, 0.04),
  border: `1px solid ${alpha(colors.ink, 0.08)}`,
  minWidth: 120
}));

const SectionCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "accent"
})(({ theme, accent }) => ({
  borderRadius: 20,
  overflow: "hidden",
  border: `1px solid ${alpha(accent || colors.primary, 0.16)}`,
  background: gradients.card,
  boxShadow: `0 16px 36px ${alpha(colors.ink, 0.1)}`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 22px 48px ${alpha(colors.ink, 0.14)}`
  }
}));

const SectionHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== "accent"
})(({ theme, accent }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  background: `linear-gradient(90deg, ${alpha(accent || colors.primary, 0.16)} 0%, transparent 75%)`,
  borderBottom: `1px solid ${alpha(accent || colors.primary, 0.12)}`,
  cursor: "pointer",
  transition: "background 0.3s ease",
  "&:hover": {
    background: `linear-gradient(90deg, ${alpha(accent || colors.primary, 0.24)} 0%, transparent 75%)`
  }
}));

const SectionBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: alpha(colors.surface, 0.92)
}));

const IconOrb = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "accent"
})(({ accent }) => ({
  width: 48,
  height: 48,
  borderRadius: 16,
  background: `linear-gradient(135deg, ${alpha(accent || colors.primary, 0.2)} 0%, ${alpha(accent || colors.primary, 0.04)} 100%)`,
  color: accent || colors.primary,
  border: `1px solid ${alpha(accent || colors.primary, 0.3)}`
}));

const InfoBadge = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "tone"
})(({ tone }) => ({
  borderRadius: "12px",
  fontWeight: 700,
  fontSize: "0.7rem",
  padding: "4px 8px",
  height: 26,
  backgroundColor: alpha(tone || colors.primary, 0.14),
  color: tone || colors.primary,
  border: `1px solid ${alpha(tone || colors.primary, 0.32)}`
}));

const ClickableText = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
  fontWeight: 700,
  color: colors.ink,
  "&:hover": {
    color: colors.primary,
    textDecoration: "underline"
  }
}));

const EndpointCard = styled(Box)(({ theme }) => ({
  borderRadius: 18,
  padding: theme.spacing(2.5),
  border: `1px solid ${alpha(colors.primary, 0.16)}`,
  background: `linear-gradient(180deg, ${alpha(colors.primary, 0.06)} 0%, ${alpha(colors.surface, 0.98)} 60%)`,
  boxShadow: `inset 0 1px 0 ${alpha(colors.surface, 0.9)}`
}));

const CredentialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  border: `1px solid ${alpha(colors.ink, 0.08)}`,
  background: `linear-gradient(180deg, ${alpha(colors.ink, 0.02)} 0%, ${alpha(colors.surface, 0.98)} 60%)`,
  boxShadow: "none"
}));

const CopyButton = ({ value, tooltip = "Copy to clipboard" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback for non-secure contexts
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed"; // Prevent scrolling
        textarea.style.opacity = "0"; // Hide element
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        // Still use deprecated method as fallback
        const success = document.execCommand("copy");
        if (!success) throw new Error("Fallback copy failed");

        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      alert("Copying to clipboard is not supported in this environment.");
    }
  };

  if (value === undefined || value === null) return null;

  return (
    <Tooltip title={copied ? "Copied!" : tooltip} arrow>
      <IconButton
        size="small"
        onClick={handleCopy}
        sx={{
          ml: 1,
          borderRadius: "10px",
          border: `1px solid ${alpha(colors.ink, 0.12)}`,
          bgcolor: alpha(colors.surface, 0.9),
          "&:hover": {
            bgcolor: alpha(colors.primary, 0.12),
            borderColor: alpha(colors.primary, 0.4)
          }
        }}
      >
        <CopyIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};



const PasswordField = ({ value }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{ fontFamily: '"IBM Plex Mono", "SFMono-Regular", Menlo, monospace' }}
      >
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

const DetailRow = ({ icon, label, value, children, copyable = false, tone = colors.primary }) => {
  const hasValue = value !== undefined && value !== null && value !== "";
  const isPrimitive = typeof value === "string" || typeof value === "number";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
        p: 1.5,
        borderRadius: 16,
        backgroundColor: alpha(tone, 0.06),
        border: `1px solid ${alpha(tone, 0.18)}`
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: 12,
          bgcolor: alpha(tone, 0.18),
          color: tone,
          flexShrink: 0
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: alpha(colors.slate, 0.7),
            fontWeight: 700,
            display: "block",
            mb: 0.5
          }}
        >
          {label}
        </Typography>
        {children}
        {!children && hasValue && (
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            {isPrimitive ? (
              <Typography variant="body1" fontWeight={600} sx={{ color: colors.ink }}>
                {value}
              </Typography>
            ) : (
              value
            )}
            {copyable && isPrimitive && <CopyButton value={value} />}
          </Box>
        )}
      </Box>
    </Box>
  );
};

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

const DevOpsInfoDisplay = ({ }) => {
  const [devOpsInfo, setDevOpsInfo] = useState(null);
  const { id: projectId } = useParams();
  const userId = useUserId();

  useEffect(() => {
    const fetchDevOpsInfo = async () => {
      const result = await getDevOpsInfo(projectId, userId);
      setDevOpsInfo(result);
    }

    fetchDevOpsInfo();
  }, [projectId, userId]);

  const [expandedSections, setExpandedSections] = useState({
    platform: true,
    endpoints: false,
    technology: false,
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
      <SectionCard accent={colors.primary}>
        <SectionHeader accent={colors.primary} onClick={() => toggleSection('platform')}>
          <IconOrb accent={colors.primary}>
            <WebIcon />
          </IconOrb>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: colors.ink }}>
              Web Platform Configuration
            </Typography>
            <Typography variant="body2" sx={{ color: alpha(colors.slate, 0.7) }}>
              Environment, access, and runtime topology
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {data.environmentType && (
              <InfoBadge
                label={data.environmentType}
                size="small"
                tone={colors.primary}
              />
            )}
            <IconButton
              size="small"
              sx={{
                borderRadius: "10px",
                border: `1px solid ${alpha(colors.primary, 0.3)}`,
                color: colors.primary,
                transform: expandedSections.platform ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease"
              }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Box>
        </SectionHeader>

        <Collapse in={expandedSections.platform}>
          <SectionBody>
            <Box sx={{ display: "grid", gap: 2 }}>
              <DetailRow
                icon={<SettingsIcon />}
                label="Environment Type"
                value={data.environmentType}
                tone={colors.primary}
              />

            {hasAccessInfo && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 3, mb: 2, color: colors.secondary, fontWeight: 700 }}>
                  Access Information
                </Typography>
                <Grid container spacing={2}>
                  {data.accessInfo.address && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow
                        icon={<PublicIcon />}
                        label="Address"
                        value={data.accessInfo.address}
                        tone={colors.secondary}
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
                        tone={colors.secondary}
                      />
                    </Grid>
                  )}
                  {data.accessInfo.username && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow
                        icon={<KeyIcon />}
                        label="Username"
                        value={data.accessInfo.username}
                        tone={colors.secondary}
                        copyable
                      />
                    </Grid>
                  )}
                  {data.accessInfo.password && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow
                        icon={<LockIcon />}
                        label="Password"
                        tone={colors.secondary}
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
                        tone={colors.secondary}
                      />
                    </Grid>
                  )}
                </Grid>
              </>
            )}

            {hasVmInfo && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 3, mb: 2, color: colors.accent, fontWeight: 700 }}>
                  Virtual Machine Details
                </Typography>
                <Grid container spacing={2}>
                  {data.vmInfo.vmName && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow
                        icon={<ComputerIcon />}
                        label="VM Name"
                        value={data.vmInfo.vmName}
                        tone={colors.accent}
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
                        tone={colors.accent}
                      />
                    </Grid>
                  )}
                  {data.vmInfo.hypervisor && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow
                        icon={<SettingsIcon />}
                        label="Hypervisor"
                        value={data.vmInfo.hypervisor}
                        tone={colors.accent}
                      />
                    </Grid>
                  )}
                  {data.vmInfo.sshKey && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow
                        icon={<KeyIcon />}
                        label="SSH Key"
                        tone={colors.accent}
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
                        tone={colors.accent}
                      />
                    </Grid>
                  )}
                </Grid>
              </>
            )}

            {hasDockerInfo && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 3, mb: 2, color: colors.primary, fontWeight: 700 }}>
                  Docker Configuration
                </Typography>
                <Grid container spacing={2}>
                  {data.dockerInfo.imageName && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow
                        icon={<CloudIcon />}
                        label="Image Name"
                        value={data.dockerInfo.imageName}
                        tone={colors.primary}
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
                        tone={colors.primary}
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
                        tone={colors.primary}
                      />
                    </Grid>
                  )}
                  {data.dockerInfo.volumes?.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow
                        icon={<StorageIcon />}
                        label="Volumes"
                        value={data.dockerInfo.volumes.join(', ')}
                        tone={colors.primary}
                      />
                    </Grid>
                  )}
                  {data.dockerInfo.envVariables?.length > 0 && (
                    <Grid item xs={12}>
                      <DetailRow
                        icon={<CodeIcon />}
                        label="Environment Variables"
                        tone={colors.primary}
                        value={
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {data.dockerInfo.envVariables.map((env, i) => (
                              <Chip
                                key={i}
                                label={env}
                                size="small"
                                sx={{
                                  bgcolor: alpha(colors.secondary, 0.12),
                                  color: colors.secondary,
                                  border: `1px solid ${alpha(colors.secondary, 0.3)}`,
                                  fontWeight: 600
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
                        tone={colors.primary}
                      />
                    </Grid>
                  )}
                  {data.dockerInfo.dockerHost && (
                    <Grid item xs={12} sm={6}>
                      <DetailRow
                        icon={<ComputerIcon />}
                        label="Docker Host"
                        value={data.dockerInfo.dockerHost}
                        tone={colors.primary}
                        copyable
                      />
                    </Grid>
                  )}
                </Grid>
              </>
            )}
            </Box>
          </SectionBody>
        </Collapse>
      </SectionCard>
    );
  };

  const renderEndpoints = () => {
    if (!devOpsInfo?.endpoints?.length) return null;

    return (
      <SectionCard accent={colors.accent} sx={{ mt: 3 }}>
        <SectionHeader accent={colors.accent} onClick={() => toggleSection('endpoints')}>
          <IconOrb accent={colors.accent}>
            <DnsIcon />
          </IconOrb>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: colors.ink }}>
              Endpoints
            </Typography>
            <Typography variant="body2" sx={{ color: alpha(colors.slate, 0.7) }}>
              {devOpsInfo.endpoints.length} configured access points
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InfoBadge
              label={`${devOpsInfo.endpoints.length} total`}
              size="small"
              tone={colors.accent}
            />
            <IconButton
              size="small"
              sx={{
                borderRadius: "10px",
                border: `1px solid ${alpha(colors.accent, 0.3)}`,
                color: colors.accent,
                transform: expandedSections.endpoints ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease"
              }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Box>
        </SectionHeader>

        <Collapse in={expandedSections.endpoints}>
          <SectionBody>
            <Box sx={{ display: "grid", gap: 3 }}>
              {devOpsInfo.endpoints.map((endpoint, index) => {
                const hasTechStack = hasTechnologyStack(endpoint.technologyStack);
                const endpointUrl = endpoint.url || "";
                const fullUrl = endpointUrl.startsWith('http') ? endpointUrl : `https://${endpointUrl}`;
                const endpointTone = endpoint.isDns ? colors.success : colors.primary;

                return (
                  <EndpointCard key={index}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <IconOrb accent={endpointTone} sx={{ width: 42, height: 42 }}>
                          {endpoint.isDns ? <DnsIcon /> : <PublicIcon />}
                        </IconOrb>
                        <Box>
                          <ClickableText
                            variant="subtitle1"
                            onClick={() => window.open(fullUrl, '_blank', 'noopener,noreferrer')}
                          >
                            {endpoint.url}
                          </ClickableText>
                          <Typography variant="body2" sx={{ color: alpha(colors.slate, 0.7) }}>
                            {endpoint.isDns ? "DNS record" : "Public address"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                        <InfoBadge
                          label={endpoint.isDns ? "DNS" : "Public"}
                          size="small"
                          tone={endpointTone}
                        />
                        {endpoint.ip && (
                          <>
                            <InfoBadge
                              label={endpoint.ip}
                              size="small"
                              tone={colors.slate}
                              sx={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(endpoint.ip);
                              }}
                            />
                            <CopyButton value={endpoint.ip} tooltip="Copy IP" />
                          </>
                        )}
                      </Box>
                    </Box>

                    {hasTechStack && (
                      <Box sx={{ mt: 2.5 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: colors.slate, fontWeight: 700 }}>
                          Technology Stack
                        </Typography>
                        <Grid container spacing={1.5} sx={{ mb: 1 }}>
                          {endpoint.technologyStack.frontendLanguage && (
                            <Grid item xs={12} sm={6} md={3}>
                              <DetailRow
                                icon={<CodeIcon />}
                                label="Frontend"
                                value={endpoint.technologyStack.frontendLanguage}
                                tone={colors.primary}
                              />
                            </Grid>
                          )}
                          {endpoint.technologyStack.backendLanguage && (
                            <Grid item xs={12} sm={6} md={3}>
                              <DetailRow
                                icon={<CodeIcon />}
                                label="Backend"
                                value={endpoint.technologyStack.backendLanguage}
                                tone={colors.primary}
                              />
                            </Grid>
                          )}
                          {endpoint.technologyStack.databases?.length > 0 && (
                            <Grid item xs={12} sm={6} md={3}>
                              <DetailRow
                                icon={<StorageIcon />}
                                label="Databases"
                                value={endpoint.technologyStack.databases.join(', ')}
                                tone={colors.primary}
                              />
                            </Grid>
                          )}
                          {endpoint.technologyStack.webServer && (
                            <Grid item xs={12} sm={6} md={3}>
                              <DetailRow
                                icon={<ComputerIcon />}
                                label="Web Server"
                                value={endpoint.technologyStack.webServer}
                                tone={colors.primary}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    )}

                    {endpoint.credentials?.length > 0 && (
                      <Box sx={{ mt: 2.5 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: colors.slate, fontWeight: 700 }}>
                          Access Credentials
                        </Typography>
                        <Grid container spacing={2}>
                          {endpoint.credentials.map((cred, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                              <CredentialCard>
                                {cred.description && (
                                  <DetailRow
                                    icon={<InfoIcon />}
                                    label="Description"
                                    tone={colors.secondary}
                                    children={
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          bgcolor: alpha(colors.secondary, 0.08),
                                          p: 1,
                                          borderRadius: "10px",
                                          border: `1px solid ${alpha(colors.secondary, 0.2)}`,
                                          fontStyle: "italic"
                                        }}
                                      >
                                        {cred.description}
                                      </Typography>
                                    }
                                  />
                                )}
                                <Box sx={{ mt: cred.description ? 2 : 0, display: "grid", gap: 1.5 }}>
                                  <DetailRow
                                    icon={<KeyIcon />}
                                    label="Username"
                                    value={cred.username}
                                    tone={colors.secondary}
                                    copyable
                                  />
                                  <DetailRow
                                    icon={<LockIcon />}
                                    label="Password"
                                    tone={colors.secondary}
                                    children={<PasswordField value={cred.password} />}
                                  />
                                </Box>
                              </CredentialCard>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </EndpointCard>
                );
              })}
            </Box>
          </SectionBody>
        </Collapse>
      </SectionCard>
    );
  };

  const renderTechnologyStack = () => {
    if (!devOpsInfo?.technologyStack?.web) return null;

    const { web } = devOpsInfo.technologyStack;

    return (
      <SectionCard accent={colors.secondary} sx={{ mt: 3 }}>
        <SectionHeader accent={colors.secondary} onClick={() => toggleSection('technology')}>
          <IconOrb accent={colors.secondary}>
            <FrameworkIcon />
          </IconOrb>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: colors.ink }}>
              Technology Stack
            </Typography>
            <Typography variant="body2" sx={{ color: alpha(colors.slate, 0.7) }}>
              Platform architecture and components
            </Typography>
          </Box>
          <IconButton
            size="small"
            sx={{
              borderRadius: "10px",
              border: `1px solid ${alpha(colors.secondary, 0.3)}`,
              color: colors.secondary,
              transform: expandedSections.technology ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease"
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </SectionHeader>

        <Collapse in={expandedSections.technology}>
          <SectionBody>
            <Grid container spacing={2}>
              {web.frontendLanguage && (
                <Grid item xs={12} sm={6} md={4}>
                  <DetailRow
                    icon={<CodeIcon />}
                    label="Frontend Language"
                    value={web.frontendLanguage}
                    tone={colors.secondary}
                  />
                </Grid>
              )}
              {web.backendLanguage && (
                <Grid item xs={12} sm={6} md={4}>
                  <DetailRow
                    icon={<CodeIcon />}
                    label="Backend Language"
                    value={web.backendLanguage}
                    tone={colors.secondary}
                  />
                </Grid>
              )}
              {web.databases?.length > 0 && (
                <Grid item xs={12} sm={6} md={4}>
                  <DetailRow
                    icon={<StorageIcon />}
                    label="Databases"
                    value={web.databases.join(', ')}
                    tone={colors.secondary}
                  />
                </Grid>
              )}
              {web.frameworks?.length > 0 && (
                <Grid item xs={12}>
                  <DetailRow
                    icon={<FrameworkIcon />}
                    label="Frameworks"
                    tone={colors.secondary}
                    value={
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {web.frameworks.map((fw, i) => (
                          <Chip
                            key={i}
                            label={fw}
                            size="small"
                            sx={{
                              bgcolor: alpha(colors.secondary, 0.12),
                              color: colors.secondary,
                              border: `1px solid ${alpha(colors.secondary, 0.3)}`,
                              fontWeight: 600
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
                    tone={colors.secondary}
                  />
                </Grid>
              )}
            </Grid>
          </SectionBody>
        </Collapse>
      </SectionCard>
    );
  };

  if (!devOpsInfo) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <HeroCard>
          <Typography variant="overline" sx={{ color: alpha(colors.slate, 0.7), letterSpacing: "0.2em" }}>
            DEVOPS CONSOLE
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ mt: 1, color: colors.ink }}>
            DevOps Configuration
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: alpha(colors.slate, 0.7) }}>
            Loading DevOps information...
          </Typography>
        </HeroCard>
      </Box>
    );
  }

  const endpointCount = devOpsInfo?.endpoints?.length || 0;
  const hasPlatform = Boolean(devOpsInfo?.platformData?.web);
  const hasTech = Boolean(devOpsInfo?.technologyStack?.web);
  const credentialCount = devOpsInfo?.endpoints?.reduce(
    (sum, endpoint) => sum + (endpoint.credentials?.length || 0),
    0
  );
  const ipCount = devOpsInfo?.endpoints?.filter((endpoint) => endpoint.ip).length || 0;

  return (
    <PageShell sx={{ maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ position: "relative", zIndex: 1, display: "grid", gap: 3 }}>
        <HeroCard>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="overline"
                sx={{ color: alpha(colors.slate, 0.7), letterSpacing: "0.25em", fontWeight: 700 }}
              >
                DEVOPS CONSOLE
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mt: 1,
                  fontWeight: 800,
                  color: colors.ink,
                  fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em"
                }}
              >
                DevOps Configuration
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 1.5,
                  color: alpha(colors.slate, 0.72),
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  lineHeight: 1.7,
                  maxWidth: 560
                }}
              >
                Everything you need to operate the platform. Secure access, infrastructure context, and runtime stack in
                one premium surface.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {hasPlatform && (
                  <InfoBadge label="Platform Ready" size="small" tone={colors.success} />
                )}
                {hasTech && (
                  <InfoBadge label="Stack Mapped" size="small" tone={colors.secondary} />
                )}
                {credentialCount > 0 && (
                  <InfoBadge label="Credentials Secured" size="small" tone={colors.accent} />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                <StatPill>
                  <Typography variant="caption" sx={{ color: alpha(colors.slate, 0.7), fontWeight: 700 }}>
                    Endpoints
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: colors.ink }}>
                    {endpointCount}
                  </Typography>
                </StatPill>
                <StatPill>
                  <Typography variant="caption" sx={{ color: alpha(colors.slate, 0.7), fontWeight: 700 }}>
                    IP Addresses
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: colors.ink }}>
                    {ipCount}
                  </Typography>
                </StatPill>
                <StatPill>
                  <Typography variant="caption" sx={{ color: alpha(colors.slate, 0.7), fontWeight: 700 }}>
                    Credentials
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: colors.ink }}>
                    {credentialCount}
                  </Typography>
                </StatPill>
                <StatPill>
                  <Typography variant="caption" sx={{ color: alpha(colors.slate, 0.7), fontWeight: 700 }}>
                    Sections Ready
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: colors.ink }}>
                    {[hasPlatform, endpointCount > 0, hasTech].filter(Boolean).length}/3
                  </Typography>
                </StatPill>
              </Box>
            </Grid>
          </Grid>
        </HeroCard>

        {renderPlatformInfo()}
        {renderEndpoints()}
        {renderTechnologyStack()}
      </Box>
    </PageShell>
  );
};

export default DevOpsInfoDisplay;
