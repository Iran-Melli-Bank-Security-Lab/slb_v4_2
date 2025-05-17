import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  LinearProgress,
} from "@mui/material";
import {
  Build as BuildIcon,
} from "@mui/icons-material";

const InProgressContent = ({ progress }) => {
  return (
    <Box>
      
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <Box className="flex items-center mb-3 md:mb-0">
          <Box className="inline-flex p-3 bg-indigo-50 rounded-full mr-3">
            <BuildIcon className="text-indigo-500 text-3xl" />
          </Box>
          <Box>
            <Typography variant="h4" className="font-bold text-gray-800">
              Project in Progress
            </Typography>
            <Typography
              variant="subtitle1"
              className="text-indigo-600 font-medium"
            >
              Active Pentest Phase
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`${progress}% Complete`}
          className={`bg-indigo-100 text-indigo-800 font-medium px-3 py-1 text-base ${progress === 100 ? "animate-pulse" : ""}`}
          icon={
            <CircularProgress
              size={18}
              thickness={5}
              variant="determinate"
              value={progress}
              className="text-indigo-500"
            />
          }
        />
      </Box>
      
      <Box className="mb-6">
        <Box className="flex justify-between mb-1">
          <Typography variant="body2" className="text-gray-600 font-medium">
            Project Completion
          </Typography>
          <Typography variant="body2" className="text-gray-600 font-medium">
            {progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          className="h-2 rounded-full"
          color="primary"
        />
      </Box>

      <Tabs
        value={0}
        onChange={() => {}}
        indicatorColor="primary"
        textColor="primary"
        className="mb-4"
        variant="fullWidth"
      >
        <Tab label="Active Tasks" className="py-3 font-medium" />
        <Tab label="Recent Updates" className="py-3 font-medium" />
        <Tab label="Blockers" className="py-3 font-medium" />
      </Tabs>
      
    </Box>
  );
};

export default InProgressContent