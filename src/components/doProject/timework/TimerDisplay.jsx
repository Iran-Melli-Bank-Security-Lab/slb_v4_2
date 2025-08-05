import { memo, useState, useRef, useEffect } from "react";
import { formatTime } from "../../../utils/formatTime";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const TimerDisplay = ({ 
  totalWorkTime = 0,    // Total accumulated time in seconds from backend
  isTracking = false,  // Whether timer should be running now
  lastStatusChange     // ISO string of when current status began
}) => {
  const [displayTime, setDisplayTime] = useState(totalWorkTime);
  const intervalRef = useRef(null);

  // Handle all timing logic in a single effect to avoid race conditions
  useEffect(() => {
    // Clear any existing interval
    clearInterval(intervalRef.current);

    if (isTracking && lastStatusChange) {
      try {
        // Safely parse the timestamp and ensure it's valid
        const lastChangeTime = new Date(lastStatusChange).getTime();
        
        // Validate the timestamp isn't in the future
        const now = Date.now();
        const initialOffset = Math.max(0, Math.floor((now - lastChangeTime) / 1000));
        
        // Set initial time (total + current session)
        setDisplayTime(totalWorkTime + initialOffset);

        // Start updating every second
        intervalRef.current = setInterval(() => {
          setDisplayTime(prev => Math.max(0, prev + 1)); // Ensure never goes negative
        }, 1000);
      } catch (error) {
        console.error('Error parsing timestamp:', error);
        setDisplayTime(totalWorkTime); // Fallback to total time
      }
    } else {
      // When not tracking, just show totalWorkTime
      setDisplayTime(totalWorkTime);
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
        {formatTime(Math.max(0, displayTime))} {/* Double protection against negatives */}
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