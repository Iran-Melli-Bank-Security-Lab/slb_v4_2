import { memo, useState, useRef, useEffect } from "react";
import { formatTime } from "../../../utils/formatTime";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const TimerDisplay = ({ 
  totalWorkTime = 0,    // Total accumulated time in seconds from backend
  isTracking = false,  // Whether timer should be running now
  lastStatusChange     // Timestamp when current status began
}) => {
  const [displayTime, setDisplayTime] = useState(totalWorkTime);
  const intervalRef = useRef(null);

  // Reset display time when totalWorkTime changes
  useEffect(() => {
    setDisplayTime(totalWorkTime);
  }, [totalWorkTime]);

  // Handle timer start/stop based on isTracking
  useEffect(() => {
    if (isTracking) {
      // Calculate initial offset since last status change
      const lastChangeTime = new Date(lastStatusChange).getTime();
      const initialOffset = Math.floor((Date.now() - lastChangeTime) / 1000);
      setDisplayTime(totalWorkTime + initialOffset);

      // Start updating every second
      intervalRef.current = setInterval(() => {
        setDisplayTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isTracking, totalWorkTime, lastStatusChange]);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: 1,
      mt: 1
    }}>
      <AccessTimeIcon color="primary" />
      <Typography 
        variant="h6"
        sx={{
          fontFamily: 'monospace',
          fontWeight: 'bold',
          color: 'text.primary'
        }}
      >
        {formatTime(displayTime)}
      </Typography>
      {isTracking && (
        <Box 
          component="span"
          sx={{
            width: 10,
            height: 10,
            bgcolor: 'success.main',
            borderRadius: '50%',
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(0.95)', opacity: 0.8 },
              '50%': { transform: 'scale(1.1)', opacity: 1 },
              '100%': { transform: 'scale(0.95)', opacity: 0.8 }
            }
          }}
        />
      )}
    </Box>
  );
};

export default memo(TimerDisplay);