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
  OpenInNew as OpenInNewIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Info as InfoIcon,
  ContentCopy as CopyIcon
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { getDevOpsInfo } from "../../../api/devops/getDevOpsInfo";
import { useParams } from "react-router";
import { useUserId } from "../../../hooks/useUserId";
import "./endpoints.css";
import "./platform.css";

// Elevated palette and gradients
const colors = {
  ink: "#0B1020",
  slate: "#1E2333",
  primary: "#0A84FF",
  secondary: "#5E5CE6",
  accent: "#BF5AF2",
  success: "#34C759",
  warning: "#FFB020",
  error: "#FF4D6D",
  surface: "#FFFFFF",
  surfaceMuted: "#F6F8FC"
};

// Apple-like text palette
const textColors = {
  primary: "#1D1D1F",
  secondary: "#6E6E73",
  tertiary: "#86868B",
  muted: "#A1A1A6"
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

const SectionKicker = styled(Typography)(({ theme }) => ({
  textTransform: "uppercase",
  letterSpacing: "0.26em",
  fontWeight: 700,
  color: textColors.tertiary,
  fontSize: "0.6rem"
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: textColors.primary,
  letterSpacing: "-0.01em",
  lineHeight: 1.3
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: textColors.secondary,
  fontWeight: 500,
  lineHeight: 1.7,
  fontSize: "0.95rem"
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
  fontWeight: 600,
  color: textColors.primary,
  letterSpacing: "-0.01em",
  "&:hover": {
    color: colors.primary,
    textDecoration: "underline",
    textDecorationThickness: "1.5px",
    textUnderlineOffset: "3px",
    textDecorationColor: alpha(colors.primary, 0.4)
  }
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



const PasswordField = ({ value, size = "default" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isCompact = size === "compact";

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{
          fontFamily: '"IBM Plex Mono", "SFMono-Regular", Menlo, monospace',
          fontSize: isCompact ? "0.95rem" : "1rem",
          color: textColors.primary
        }}
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

const DetailRow = ({ icon, label, value, children, copyable = false, tone = colors.primary, size = "default" }) => {
  const hasValue = value !== undefined && value !== null && value !== "";
  const isPrimitive = typeof value === "string" || typeof value === "number";
  const isCompact = size === "compact";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
        p: isCompact ? 1.2 : 1.5,
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
          width: isCompact ? 34 : 38,
          height: isCompact ? 34 : 38,
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
              letterSpacing: "0.18em",
              color: textColors.tertiary,
              fontWeight: 700,
              display: "block",
              mb: 0.5,
              fontSize: isCompact ? "0.58rem" : "0.62rem"
            }}
          >
            {label}
          </Typography>
        {children}
        {!children && hasValue && (
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            {isPrimitive ? (
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ color: textColors.primary, fontSize: isCompact ? "0.92rem" : "0.98rem", lineHeight: 1.6 }}
              >
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
    const accessItems = [];
    const vmItems = [];
    const dockerItems = [];

    if (data.accessInfo?.address) {
      accessItems.push({
        label: "Address",
        value: data.accessInfo.address,
        icon: <PublicIcon />,
        copyable: true
      });
    }
    if (data.accessInfo?.port) {
      accessItems.push({
        label: "Port",
        value: data.accessInfo.port,
        icon: <SettingsIcon />
      });
    }
    if (data.accessInfo?.username) {
      accessItems.push({
        label: "Username",
        value: data.accessInfo.username,
        icon: <KeyIcon />,
        copyable: true
      });
    }
    if (data.accessInfo?.password) {
      accessItems.push({
        label: "Password",
        icon: <LockIcon />,
        children: <PasswordField value={data.accessInfo.password} />
      });
    }
    if (data.accessInfo?.notes) {
      accessItems.push({
        label: "Notes",
        value: data.accessInfo.notes,
        icon: <InfoIcon />
      });
    }

    if (data.vmInfo?.vmName) {
      vmItems.push({
        label: "VM Name",
        value: data.vmInfo.vmName,
        icon: <ComputerIcon />,
        copyable: true
      });
    }
    if (data.vmInfo?.osType) {
      vmItems.push({
        label: "OS Type",
        value: data.vmInfo.osType,
        icon: <StorageIcon />
      });
    }
    if (data.vmInfo?.hypervisor) {
      vmItems.push({
        label: "Hypervisor",
        value: data.vmInfo.hypervisor,
        icon: <SettingsIcon />
      });
    }
    if (data.vmInfo?.sshKey) {
      vmItems.push({
        label: "SSH Key",
        icon: <KeyIcon />,
        children: <PasswordField value={data.vmInfo.sshKey} />
      });
    }
    if (data.vmInfo?.snapshot) {
      vmItems.push({
        label: "Snapshot",
        value: data.vmInfo.snapshot,
        icon: <StorageIcon />
      });
    }

    if (data.dockerInfo?.imageName) {
      dockerItems.push({
        label: "Image Name",
        value: data.dockerInfo.imageName,
        icon: <CloudIcon />,
        copyable: true
      });
    }
    if (data.dockerInfo?.containerName) {
      dockerItems.push({
        label: "Container Name",
        value: data.dockerInfo.containerName,
        icon: <SettingsIcon />,
        copyable: true
      });
    }
    if (data.dockerInfo?.ports?.length > 0) {
      dockerItems.push({
        label: "Ports",
        value: data.dockerInfo.ports.join(", "),
        icon: <StorageIcon />
      });
    }
    if (data.dockerInfo?.volumes?.length > 0) {
      dockerItems.push({
        label: "Volumes",
        value: data.dockerInfo.volumes.join(", "),
        icon: <StorageIcon />
      });
    }
    if (data.dockerInfo?.envVariables?.length > 0) {
      dockerItems.push({
        label: "Environment Variables",
        icon: <CodeIcon />,
        value: (
          <Box className="platform-chip-list">
            {data.dockerInfo.envVariables.map((env, i) => (
              <span className="platform-chip" key={`${env}-${i}`}>
                {env}
              </span>
            ))}
          </Box>
        )
      });
    }
    if (data.dockerInfo?.network) {
      dockerItems.push({
        label: "Network",
        value: data.dockerInfo.network,
        icon: <PublicIcon />
      });
    }
    if (data.dockerInfo?.dockerHost) {
      dockerItems.push({
        label: "Docker Host",
        value: data.dockerInfo.dockerHost,
        icon: <ComputerIcon />,
        copyable: true
      });
    }

    const hasAccessInfo = accessItems.length > 0;
    const hasVmInfo = vmItems.length > 0;
    const hasDockerInfo = dockerItems.length > 0;

    if (!hasAccessInfo && !hasVmInfo && !hasDockerInfo) return null;

    const platformSections = [];
    if (hasAccessInfo) {
      platformSections.push({
        key: "access",
        title: "Access Layer",
        subtitle: "Ingress & credentials",
        tone: colors.secondary,
        items: accessItems
      });
    }
    if (hasVmInfo) {
      platformSections.push({
        key: "vm",
        title: "Virtual Machine",
        subtitle: "Host & virtualization details",
        tone: colors.accent,
        items: vmItems
      });
    }
    if (hasDockerInfo) {
      platformSections.push({
        key: "docker",
        title: "Docker Runtime",
        subtitle: "Images, containers & network",
        tone: colors.primary,
        items: dockerItems
      });
    }

    const PlatformField = ({ icon, label, value, children, copyable, tone }) => {
      const isPrimitive = typeof value === "string" || typeof value === "number";

      return (
        <Box className="platform-field" style={{ "--tone": tone, "--toneSoft": alpha(tone, 0.12) }}>
          <Box className="platform-field-icon">{icon}</Box>
          <Box className="platform-field-body">
            <span className="platform-field-label">{label}</span>
            <Box className="platform-field-value">
              {children ? (
                children
              ) : isPrimitive ? (
                <Typography component="span" className="platform-field-text">
                  {value}
                </Typography>
              ) : (
                value
              )}
              {copyable && isPrimitive && <CopyButton value={value} />}
            </Box>
          </Box>
        </Box>
      );
    };

    return (
      <SectionCard accent={colors.primary} className="platform-card">
        <SectionHeader accent={colors.primary} onClick={() => toggleSection('platform')}>
          <IconOrb accent={colors.primary}>
            <WebIcon />
          </IconOrb>
          <Box sx={{ flex: 1 }}>
            <SectionTitle variant="h6">Web Platform Configuration</SectionTitle>
            <SectionSubtitle variant="body2">Environment, access, and runtime topology</SectionSubtitle>
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
          <SectionBody className="platform-body">
            <Box className="platform-layout">
              <Box className="platform-banner">
                <Box className="platform-banner-main">
                  <span className="platform-banner-kicker">Web Platform</span>
                  <span className="platform-banner-title">
                    {data.environmentType || "Environment not set"}
                  </span>
                  <span className="platform-banner-subtitle">Environment Type</span>
                </Box>
                <Box className="platform-banner-side">
                  <Box className="platform-banner-metrics">
                    <Box className="platform-metric">
                      <span className="platform-metric-label">Access</span>
                      <span className="platform-metric-value">{accessItems.length}</span>
                    </Box>
                    <Box className="platform-metric">
                      <span className="platform-metric-label">VM</span>
                      <span className="platform-metric-value">{vmItems.length}</span>
                    </Box>
                    <Box className="platform-metric">
                      <span className="platform-metric-label">Docker</span>
                      <span className="platform-metric-value">{dockerItems.length}</span>
                    </Box>
                  </Box>
                  <Box className="platform-banner-tags">
                    {hasAccessInfo && <span className="platform-tag platform-tag-success">Access Ready</span>}
                    {hasVmInfo && <span className="platform-tag platform-tag-accent">VM Ready</span>}
                    {hasDockerInfo && <span className="platform-tag platform-tag-primary">Docker Ready</span>}
                  </Box>
                </Box>
              </Box>

              <Box className="platform-panels">
                {platformSections.map((section, index) => (
                  <Box
                    key={section.key}
                    className="platform-panel"
                    style={{
                      "--tone": section.tone,
                      "--toneSoft": alpha(section.tone, 0.16),
                      "--delay": `${index * 0.08}s`
                    }}
                  >
                    <Box className="platform-panel-head">
                      <Box className="platform-panel-title">
                        <span className="platform-panel-kicker">{section.title}</span>
                        <span className="platform-panel-subtitle">{section.subtitle}</span>
                      </Box>
                      <span className="platform-panel-count">{section.items.length}</span>
                    </Box>
                    <Box className="platform-fields">
                      {section.items.map((item, i) => (
                        <PlatformField
                          key={`${section.key}-${item.label}-${i}`}
                          icon={item.icon}
                          label={item.label}
                          value={item.value}
                          children={item.children}
                          copyable={item.copyable}
                          tone={section.tone}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </SectionBody>
        </Collapse>
      </SectionCard>
    );
  };

  const renderEndpoints = () => {
    if (!devOpsInfo?.endpoints?.length) return null;
    const endpointCount = devOpsInfo.endpoints.length;
    const credentialCount = devOpsInfo.endpoints.reduce(
      (sum, endpoint) => sum + (endpoint.credentials?.length || 0),
      0
    );
    const ipCount = devOpsInfo.endpoints.filter((endpoint) => endpoint.ip).length;
    const dnsCount = devOpsInfo.endpoints.filter((endpoint) => endpoint.isDns).length;
    const publicCount = endpointCount - dnsCount;

    return (
      <SectionCard accent={colors.accent} sx={{ mt: 3 }}>
        <SectionHeader accent={colors.accent} onClick={() => toggleSection('endpoints')}>
          <IconOrb accent={colors.accent}>
            <DnsIcon />
          </IconOrb>
          <Box sx={{ flex: 1 }}>
            <SectionTitle variant="h6">Endpoints</SectionTitle>
            <SectionSubtitle variant="body2">
              {devOpsInfo.endpoints.length} configured access points
            </SectionSubtitle>
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
          <SectionBody className="endpoints-body">
            <Box className="endpoints-shell">
              <Box className="endpoints-banner">
                <Box className="endpoints-banner-main">
                  <span className="endpoints-kicker">Network Surface</span>
                  <span className="endpoints-title">Endpoints</span>
                  <span className="endpoints-subtitle">
                    {endpointCount} access points tracked across DNS and public gateways.
                  </span>
                </Box>
                <Box className="endpoints-banner-stats">
                  <Box className="endpoints-stat">
                    <span className="endpoints-stat-label">Total</span>
                    <span className="endpoints-stat-value">{endpointCount}</span>
                  </Box>
                  <Box className="endpoints-stat">
                    <span className="endpoints-stat-label">IP Records</span>
                    <span className="endpoints-stat-value">{ipCount}</span>
                  </Box>
                  <Box className="endpoints-stat">
                    <span className="endpoints-stat-label">Credentials</span>
                    <span className="endpoints-stat-value">{credentialCount}</span>
                  </Box>
                </Box>
                <Box className="endpoints-banner-tags">
                  <span className="endpoints-tag">DNS {dnsCount}</span>
                  <span className="endpoints-tag">Public {publicCount}</span>
                </Box>
              </Box>

              <Box className="endpoint-deck">
                {devOpsInfo.endpoints.map((endpoint, index) => {
                  const endpointUrl = endpoint.url || "";
                  const fullUrl = endpointUrl.startsWith('http') ? endpointUrl : `https://${endpointUrl}`;
                  const endpointTone = endpoint.isDns ? colors.success : colors.primary;
                  const credentialsCount = endpoint.credentials?.length || 0;
                  const endpointGlow = alpha(endpointTone, 0.2);
                  const stackItems = [];

                  if (endpoint.technologyStack?.frontendLanguage) {
                    stackItems.push(`Frontend • ${endpoint.technologyStack.frontendLanguage}`);
                  }
                  if (endpoint.technologyStack?.backendLanguage) {
                    stackItems.push(`Backend • ${endpoint.technologyStack.backendLanguage}`);
                  }
                  if (endpoint.technologyStack?.webServer) {
                    stackItems.push(`Server • ${endpoint.technologyStack.webServer}`);
                  }
                  (endpoint.technologyStack?.databases || []).forEach((db) => {
                    stackItems.push(`DB • ${db}`);
                  });
                  (endpoint.technologyStack?.frameworks || []).forEach((fw) => {
                    stackItems.push(`FW • ${fw}`);
                  });

                  return (
                    <Box
                      key={index}
                      className="endpoint-card"
                      style={{
                        "--accent": endpointTone,
                        "--accentGlow": endpointGlow,
                        "--delay": `${index * 0.07}s`
                      }}
                    >
                      <Box className="endpoint-card-head">
                        <Box className="endpoint-card-icon">
                          {endpoint.isDns ? <DnsIcon /> : <PublicIcon />}
                        </Box>
                        <Box className="endpoint-card-title">
                          <span className="endpoint-card-kicker">Endpoint</span>
                          <Box className="endpoint-card-url-row">
                            <Typography
                              className="endpoint-card-url"
                              onClick={() => window.open(fullUrl, '_blank', 'noopener,noreferrer')}
                            >
                              {endpoint.url}
                            </Typography>
                            <CopyButton value={fullUrl} tooltip="Copy URL" />
                          </Box>
                          <span className="endpoint-card-subtitle">
                            {endpoint.isDns ? "DNS record" : "Public address"}
                          </span>
                        </Box>
                        <Box className="endpoint-card-actions">
                          <span className="endpoint-pill" style={{ borderColor: endpointTone, color: endpointTone }}>
                            {endpoint.isDns ? "DNS" : "Public"}
                          </span>
                          {credentialsCount > 0 && (
                            <span className="endpoint-pill endpoint-pill-secure">Secured</span>
                          )}
                          <Tooltip title="Open endpoint" arrow>
                            <IconButton
                              size="small"
                              onClick={() => window.open(fullUrl, '_blank', 'noopener,noreferrer')}
                              className="endpoint-open"
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box className="endpoint-quick">
                        <Box className="endpoint-quick-item">
                          <span className="endpoint-quick-label">IP Address</span>
                          <Box className="endpoint-quick-value">
                            <Typography component="span">{endpoint.ip || "—"}</Typography>
                            {endpoint.ip && <CopyButton value={endpoint.ip} tooltip="Copy IP" />}
                          </Box>
                        </Box>
                        <Box className="endpoint-quick-item">
                          <span className="endpoint-quick-label">Credentials</span>
                          <span className="endpoint-quick-value">{credentialsCount}</span>
                        </Box>
                        <Box className="endpoint-quick-item">
                          <span className="endpoint-quick-label">Stack Items</span>
                          <span className="endpoint-quick-value">{stackItems.length}</span>
                        </Box>
                      </Box>

                      <Box className="endpoint-panel">
                        <span className="endpoint-panel-title">Technology Stack</span>
                        {stackItems.length > 0 ? (
                          <Box className="endpoint-stack-list">
                            {stackItems.map((item, i) => (
                              <span key={`${item}-${i}`} className="endpoint-stack-pill">
                                {item}
                              </span>
                            ))}
                          </Box>
                        ) : (
                          <span className="endpoint-empty">No stack data provided.</span>
                        )}
                      </Box>

                      <Box className="endpoint-panel">
                        <span className="endpoint-panel-title">Access Credentials</span>
                        {endpoint.credentials?.length > 0 ? (
                          <Box className="endpoint-credentials">
                            {endpoint.credentials.map((cred, i) => (
                              <Box className="endpoint-credential" key={i}>
                                {cred.description && (
                                  <Box className="endpoint-credential-desc">
                                    {cred.description}
                                  </Box>
                                )}
                                <Box className="endpoint-credential-row">
                                  <span className="endpoint-credential-label">Username</span>
                                  <Box className="endpoint-credential-value">
                                    <Typography component="span">{cred.username}</Typography>
                                    <CopyButton value={cred.username} tooltip="Copy username" />
                                  </Box>
                                </Box>
                                <Box className="endpoint-credential-row">
                                  <span className="endpoint-credential-label">Password</span>
                                  <Box className="endpoint-credential-value">
                                    <PasswordField value={cred.password} size="compact" />
                                  </Box>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <span className="endpoint-empty">No credentials stored.</span>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
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
            <SectionTitle variant="h6">Technology Stack</SectionTitle>
            <SectionSubtitle variant="body2">Platform architecture and components</SectionSubtitle>
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
          <Typography variant="overline" sx={{ color: textColors.tertiary, letterSpacing: "0.3em", fontSize: "0.6rem" }}>
            DEVOPS CONSOLE
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: textColors.primary }}>
            DevOps Configuration
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: textColors.secondary }}>
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
                sx={{ color: textColors.tertiary, letterSpacing: "0.3em", fontWeight: 700, fontSize: "0.6rem" }}
              >
                DEVOPS CONSOLE
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mt: 1,
                  fontWeight: 700,
                  color: textColors.primary,
                  fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
                  lineHeight: 1.25,
                  letterSpacing: "-0.015em"
                }}
              >
                DevOps Configuration
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 1.5,
                  color: textColors.secondary,
                  fontSize: { xs: "0.95rem", md: "1rem" },
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
                  <Typography
                    variant="caption"
                    sx={{
                      color: textColors.tertiary,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontSize: "0.6rem"
                    }}
                  >
                    Endpoints
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: textColors.primary }}>
                    {endpointCount}
                  </Typography>
                </StatPill>
                <StatPill>
                  <Typography
                    variant="caption"
                    sx={{
                      color: textColors.tertiary,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontSize: "0.6rem"
                    }}
                  >
                    IP Addresses
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: textColors.primary }}>
                    {ipCount}
                  </Typography>
                </StatPill>
                <StatPill>
                  <Typography
                    variant="caption"
                    sx={{
                      color: textColors.tertiary,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontSize: "0.6rem"
                    }}
                  >
                    Credentials
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: textColors.primary }}>
                    {credentialCount}
                  </Typography>
                </StatPill>
                <StatPill>
                  <Typography
                    variant="caption"
                    sx={{
                      color: textColors.tertiary,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontSize: "0.6rem"
                    }}
                  >
                    Sections Ready
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: textColors.primary }}>
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
