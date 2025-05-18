import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
  Container,
  Tooltip,
  LinearProgress,
  IconButton,
  Collapse,
  Modal,
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
import { useParams } from "react-router";
import { styled } from "@mui/material/styles";
import OpenStatusContent from "../components/doProject/OpenStatusContent";
import InProgressContent from "../components/doProject/InProgressContent";
import PendingStatusContent from "../components/doProject/PendingStatusContent";
import FinishStatusContent from "../components/doProject/FinishStatusContent";
import StatusButton from "../components/doProject/StatusButton";
import DetailItem from "../components/doProject/DetailItem";
import ProjectInfo from "../components/doProject/projectInfo";

// Styled components
const ExpandableSection = styled(Box)(({ theme }) => ({
  transition: theme.transitions.create("all"),
  overflow: "hidden",
}));



// Utility function to format time
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const ProjectPage = () => {
  const { id } = useParams();
  const [projectStatus, setProjectStatus] = useState("open");
  const [tabValue, setTabValue] = useState(0);
  const [workTime, setWorkTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [lastStatusChange, setLastStatusChange] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    setLoading(true);
    const savedData = localStorage.getItem(`projectTimeTracking-${id}`);
    if (savedData) {
      const { status, time, entries } = JSON.parse(savedData);
      setProjectStatus(status);
      setWorkTime(time);
      setTimeEntries(entries);
      if (status === "in-progress") {
        setIsTracking(true);
        setLastStatusChange(new Date());
      }
    }
    setLoading(false);
  }, [id]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      status: projectStatus,
      time: workTime,
      entries: timeEntries,
    };
    localStorage.setItem(
      `projectTimeTracking-${id}`,
      JSON.stringify(dataToSave)
    );
  }, [id, projectStatus, workTime, timeEntries]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setWorkTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const handleStatusChange = (newStatus) => {
    const now = new Date();

    // Record time entry when switching from in-progress to another status
    if (projectStatus === "in-progress" && lastStatusChange) {
      const duration = Math.floor((now - lastStatusChange) / 1000);
      const newEntry = {
        start: lastStatusChange.toISOString(),
        end: now.toISOString(),
        duration,
        status: "work",
      };
      setTimeEntries((prev) => [...prev, newEntry]);
    }

    // Handle the new status
    setProjectStatus(newStatus);

    // Start/stop tracking based on new status
    if (newStatus === "in-progress") {
      setIsTracking(true);
      setLastStatusChange(now);
    } else {
      setIsTracking(false);
    }
  };

 

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Mock project data
  const projectData = {
    title: `E-commerce Platform Migration #${id}`,
    description:
      "Migration of legacy e-commerce platform to modern microservices architecture with CI/CD pipeline implementation.",
    startDate: "2023-06-15",
    endDate: "2023-12-20",
    owner: "Jane Smith",
    team: [
      {
        name: "Alex Johnson",
        role: "DevOps Engineer",
        avatar: "AJ",
        status: "active",
      },
      {
        name: "Maria Garcia",
        role: "Backend Developer",
        avatar: "MG",
        status: "active",
      },
      {
        name: "Sam Wilson",
        role: "Frontend Developer",
        avatar: "SW",
        status: "active",
      },
      {
        name: "Taylor Swift",
        role: "UI/UX Designer",
        avatar: "TS",
        status: "inactive",
      },
    ],
    technologies: [
      "AWS",
      "Kubernetes",
      "Docker",
      "Terraform",
      "React",
      "Node.js",
    ],
    progress: 65,
    rating: 4.5,
  };

  const devOpsInfo = {
    repoUrl: "https://github.com/company/ecommerce-migration",
    ciTool: "GitHub Actions",
    deploymentTarget: "AWS EKS",
    monitoring: "Prometheus + Grafana",
    logging: "ELK Stack",
  };

  const statusComponents = {
    open: <OpenStatusContent />,
    pending: <PendingStatusContent />,
    "in-progress": <InProgressContent progress={projectData.progress} />,
    finish: <FinishStatusContent  />,
  };

  // Calculate total work time from entries plus current session
  const totalWorkTime = timeEntries.reduce((sum, entry) => sum + entry.duration, 0) +(isTracking && lastStatusChange
      ? Math.floor((new Date() - lastStatusChange) / 1000)
      : 0);

  if (loading) {
    return (
      <Container maxWidth="xl" className="py-12 px-4 sm:px-6 lg:px-8">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Section 1: Project Information */}
    <ProjectInfo projectData={projectData} devOpsInfo={devOpsInfo} totalWorkTime={totalWorkTime} isTracking={isTracking} />

      <Card className="mb-8 shadow-lg rounded-xl overflow-hidden">
        <Box className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" className="font-bold text-white">
                Project Status
              </Typography>
              <Typography variant="subtitle1" className="text-gray-300 mt-1">
                Current phase and progress tracking
              </Typography>
            </Box>
            <IconButton color="info" onClick={toggleExpand} className="text-white">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <CardContent className="p-6">
            <Box className="flex flex-wrap justify-center gap-4 mb-8">
              <StatusButton
                icon={<LockOpenIcon />}
                label="Open"
                active={projectStatus === "open"}
                onClick={() => handleStatusChange("open")}
                color="blue"
              />
              <StatusButton
                icon={<PendingActionsIcon />}
                label="Pending"
                active={projectStatus === "pending"}
                onClick={() => handleStatusChange("pending")}
                color="amber"
              />
              <StatusButton
                icon={<BuildIcon />}
                label="In Progress"
                active={projectStatus === "in-progress"}
                onClick={() => handleStatusChange("in-progress")}
                color="indigo"
              />
              <StatusButton
                icon={<CheckCircleOutlineIcon />}
                label="Finish"
                active={projectStatus === "finish"}
                onClick={() => handleStatusChange("finish")}
                color="green"
              />
            </Box>

            {/* Time Tracking Section */}
            <Box className="bg-indigo-50 p-5 rounded-lg mb-6 border-l-4 border-indigo-500">
              <Typography
                variant="h6"
                className="font-semibold mb-3 text-indigo-800 flex items-center"
              >
                <TimeIcon className="mr-2" />
                Work Time Tracking
              </Typography>

              <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <Box>
                  <Typography variant="body1" className="text-indigo-800 mb-1">
                    Current Status:{" "}
                    <span className="font-medium capitalize">
                      {projectStatus}
                    </span>
                  </Typography>
                  <Typography variant="body1" className="text-indigo-800">
                    Total Work Time:{" "}
                    <span className="font-medium">
                      {formatTime(totalWorkTime)}
                    </span>
                  </Typography>
                </Box>

                <Box className="flex flex-wrap gap-2 justify-center md:justify-end">
                  {projectStatus === "in-progress" ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      className="rounded-full min-w-[120px]"
                      startIcon={<PauseIcon />}
                      onClick={() => handleStatusChange("pending")}
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className="rounded-full min-w-[120px]"
                      startIcon={<StartIcon />}
                      disabled={projectStatus === "finish"}
                      onClick={() => handleStatusChange("in-progress")}
                    >
                      Start
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    className="rounded-full min-w-[120px]"
                    startIcon={<StopIcon />}
                    disabled={projectStatus !== "in-progress"}
                    onClick={() => handleStatusChange("finish")}
                  >
                    Complete
                  </Button>
                </Box>
              </Box>
            </Box>

            {timeEntries.length > 0 && (
              <>
                <Button
                  variant="text"
                  color="primary"
                  className="mb-4"
                  onClick={() => setOpenHistoryModal(true)}
                >
                  View Full Work History
                </Button>

                <Modal
                  open={openHistoryModal}
                  onClose={() => setOpenHistoryModal(false)}
                  aria-labelledby="work-history-modal"
                  aria-describedby="work-sessions-history"
                >
                  <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 max-h-[80vh] overflow-y-auto">
                    <Typography variant="h5" className="font-bold mb-4">
                      Work Sessions History
                    </Typography>
                    <Box className="space-y-3">
                      {timeEntries.map((entry, index) => (
                        <Paper key={index} className="p-4 hover:shadow-md transition-shadow">
                          <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <Box>
                              <Typography variant="subtitle1" className="font-medium">
                                Session {index + 1}
                              </Typography>
                              <Typography variant="body2" className="text-gray-500">
                                {new Date(entry.start).toLocaleDateString()} • {new Date(entry.start).toLocaleTimeString()} - {new Date(entry.end).toLocaleTimeString()}
                              </Typography>
                            </Box>
                            <Box className="flex items-center gap-2">
                              <Chip
                                label={formatTime(entry.duration)}
                                className="bg-blue-100 text-blue-800 font-medium"
                                size="small"
                                icon={<TimeIcon className="text-blue-600" />}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      className="mt-4"
                      onClick={() => setOpenHistoryModal(false)}
                    >
                      Close
                    </Button>
                  </Box>
                </Modal>
              </>
            )}

            <Divider className="my-6 border-gray-200" />

            {/* Section 3: Status-specific Content */}
            <Box className="mt-6">{statusComponents[projectStatus]}</Box>
          </CardContent>
        </Collapse>
      </Card>

    </Container>
  );
};





export default ProjectPage;
