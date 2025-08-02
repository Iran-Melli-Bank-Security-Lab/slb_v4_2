import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
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
// Add this new component for password display
const PasswordField = ({ password }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography variant="body1" fontWeight={500}>
        {showPassword ? password : "••••••••"}
      </Typography>
      <Tooltip title={showPassword ? "Hide password" : "Show password"}>
        <IconButton 
          size="small" 
          onClick={() => setShowPassword(!showPassword)}
          sx={{ ml: 1 }}
        >
          {showPassword ? <LockIcon fontSize="small" /> : <KeyIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <CopyButton value={password} tooltip="Copy password" />
    </Box>
  );
};

export default PasswordField ;