import { memo , useState , useRef , useEffect } from "react";
import { formatTime } from "../../../utils/formatTime";
import Typography  from "@mui/material/Typography";


const TimerDisplay = ({ initialTime, isTracking, lastStatusChange }) => {
  const [displayTime, setDisplayTime] = useState(initialTime);
  const intervalRef = useRef(null);

  useEffect(() => {
    setDisplayTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(() => {
        setDisplayTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isTracking]);

  return (
    <Typography variant="body2" className="text-indigo-700 font-mono mt-2">
      Total Work Time: {formatTime(displayTime)}
    </Typography>
  );
};

export default memo(TimerDisplay);