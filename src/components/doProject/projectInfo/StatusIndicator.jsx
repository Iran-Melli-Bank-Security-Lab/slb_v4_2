import { Box, styled } from "@mui/material";

const StatusIndicator = styled(Box)(({ theme, color }) => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  backgroundColor: theme.palette[color].main,
  marginRight: theme.spacing(1),
  animation: "pulse 1.5s infinite",
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.4 },
    "100%": { opacity: 1 },
  },
}));

export default StatusIndicator