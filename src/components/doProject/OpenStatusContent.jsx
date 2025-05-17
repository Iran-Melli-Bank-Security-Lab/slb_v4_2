import {
  Box,
  Typography,
  List,
  ListItem,
  Button
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  PendingActions as PendingActionsIcon,
  Build as BuildIcon,
  LockOpen as LockOpenIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Cloud as CloudIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  Assessment as ReportIcon,
  Chat as FeedbackIcon,
  AccessTime as TimeIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
const OpenStatusContent = () => {
  return (
    <Box className="text-center py-6 px-4">
      <Box className="inline-flex p-5 bg-blue-50 rounded-full mb-5">
        <LockOpenIcon className="text-blue-500 text-5xl" />
      </Box>
      <Typography variant="h4" className="font-bold mb-4 text-gray-800">
        Project is Open for Work
      </Typography>
      <Typography
        variant="body1"
        className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg leading-relaxed"
      >
        This project is currently open and available for team members to start
        working on. Please review the requirements and documentation before
        claiming tasks.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className="rounded-full px-6 py-2 text-lg font-medium shadow-md hover:shadow-lg transition-shadow"
        startIcon={<PersonIcon />}
      >
        Claim Project
      </Button>
    </Box>
  );
};

export default OpenStatusContent