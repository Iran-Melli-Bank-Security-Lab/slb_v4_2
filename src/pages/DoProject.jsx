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

// Styled components
const ExpandableSection = styled(Box)(({ theme }) => ({
  transition: theme.transitions.create("all"),
  overflow: "hidden",
}));

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
    finish: <FinishStatusContent rating={projectData.rating} />,
  };

  // Calculate total work time from entries plus current session
  const totalWorkTime =
    timeEntries.reduce((sum, entry) => sum + entry.duration, 0) +
    (isTracking && lastStatusChange
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
      <Card className="mb-8 shadow-lg rounded-xl overflow-hidden">
        <Box className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <Typography variant="h3" className="font-bold text-white">
            {projectData.title}
          </Typography>
          <Typography variant="subtitle1" className="text-blue-100 mt-2">
            Project Overview
          </Typography>
        </Box>

        <CardContent className="p-6">
          <Box className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <Typography
              variant="body1"
              className="text-gray-600 text-lg leading-relaxed mb-4 md:mb-0"
            >
              {projectData.description}
            </Typography>

            {/* Work Time Display */}
            <Box className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <TimeIcon className="text-blue-500 mr-2" />
              <Typography variant="h6" className="font-medium text-gray-800">
                Work Time: {formatTime(totalWorkTime)}
              </Typography>
              {isTracking && (
                <Tooltip title="Work in progress">
                  <StatusIndicator color="success" />
                </Tooltip>
              )}
            </Box>
          </Box>

          <Divider className="my-6 border-gray-200" />

          <Grid container spacing={4}>
            {/* Project Details */}
            <Grid item xs={12} md={4}>
              <Box className="p-4 bg-gray-50 rounded-lg h-full">
                <Typography
                  variant="h5"
                  className="font-semibold mb-4 text-gray-800 flex items-center"
                >
                  <StarIcon className="text-amber-500 mr-2" />
                  Project Details
                </Typography>

                <Box className="space-y-3">
                  <DetailItem
                    icon={<CalendarIcon className="text-blue-500" />}
                    title="Timeline"
                    value={`${projectData.startDate} to ${projectData.endDate}`}
                  />

                  <DetailItem
                    icon={<PersonIcon className="text-purple-500" />}
                    title="Owner"
                    value={projectData.owner}
                  />
                </Box>
              </Box>
            </Grid>

            {/* DevOps Information */}
            <Grid item xs={12} md={4}>
              <Box className="p-4 bg-gray-50 rounded-lg h-full">
                <Typography
                  variant="h5"
                  className="font-semibold mb-4 text-gray-800 flex items-center"
                >
                  <SettingsIcon className="text-indigo-500 mr-2" />
                  DevOps Information
                </Typography>

                <Box className="space-y-3">
                  <DetailItem
                    icon={<CodeIcon className="text-red-500" />}
                    title="Repository"
                    value={
                      <a
                        href={devOpsInfo.repoUrl}
                        className="text-blue-600 hover:underline break-all"
                      >
                        {devOpsInfo.repoUrl}
                      </a>
                    }
                  />

                  <DetailItem
                    icon={<SettingsIcon className="text-amber-500" />}
                    title="CI Tool"
                    value={devOpsInfo.ciTool}
                  />

                  <DetailItem
                    icon={<CloudIcon className="text-teal-500" />}
                    title="Deployment Target"
                    value={devOpsInfo.deploymentTarget}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Team Members */}
            <Grid item xs={12} md={4}>
              <Box className="p-4 bg-gray-50 rounded-lg h-full">
                <Typography
                  variant="h5"
                  className="font-semibold mb-4 text-gray-800 flex items-center"
                >
                  <GroupIcon className="text-green-500 mr-2" />
                  Team Members
                </Typography>
                <List className="p-0">
                  {projectData.team.map((member, index) => (
                    <ListItem key={index} className="pl-0 pr-0 py-2">
                      <ListItemAvatar>
                        <Avatar
                          className={`${member.status === "active" ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"} font-medium`}
                        >
                          {member.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <span className="font-medium">{member.name}</span>
                        }
                        secondary={member.role}
                        secondaryTypographyProps={{
                          className: "text-gray-500",
                        }}
                      />
                      <Chip
                        label={
                          member.status === "active" ? "Active" : "Inactive"
                        }
                        size="small"
                        className={
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>

          {/* Technologies */}
          <Box className="mt-6">
            <Typography
              variant="subtitle1"
              className="font-medium text-gray-700 mb-3 flex items-center"
            >
              <CodeIcon className="text-gray-500 mr-2" />
              Technologies
            </Typography>
            <Box className="flex flex-wrap gap-2">
              {projectData.technologies.map((tech, index) => (
                <Chip
                  key={index}
                  label={tech}
                  className="bg-white border border-gray-200 text-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Section 2: Project Status */}
      <Card className="mb-8 shadow-lg rounded-xl overflow-hidden">
        <Box className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h3" className="font-bold text-white">
                Project Status
              </Typography>
              <Typography variant="subtitle1" className="text-gray-300 mt-1">
                Current phase and progress tracking
              </Typography>
            </Box>
            <IconButton onClick={toggleExpand} className="text-white">
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

            {/* Time Entries History */}
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

// Detail Item Component
const DetailItem = ({ icon, title, value }) => {
  return (
    <Box className="flex items-start mb-2 last:mb-0">
      <Box className="mr-3 text-gray-500">{icon}</Box>
      <Box>
        <Typography variant="subtitle2" className="font-medium text-gray-500">
          {title}
        </Typography>
        <Typography variant="body1" className="text-gray-800">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

// Enhanced Status Button Component
const StatusButton = ({ icon, label, active, onClick, color }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      activeBg: "bg-blue-600",
      activeText: "text-white",
      hoverBg: "bg-blue-100",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      activeBg: "bg-amber-600",
      activeText: "text-white",
      hoverBg: "bg-amber-100",
    },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      activeBg: "bg-indigo-600",
      activeText: "text-white",
      hoverBg: "bg-indigo-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      activeBg: "bg-green-600",
      activeText: "text-white",
      hoverBg: "bg-green-100",
    },
  };

  return (
    <Button
      variant={active ? "contained" : "outlined"}
      startIcon={React.cloneElement(icon, { className: `text-${color}-500` })}
      onClick={onClick}
      sx={{
        "&.MuiButton-contained": {
          backgroundColor: colorMap[color].activeBg,
          color: colorMap[color].acti,
          "&:hover": {
            backgroundColor: colorMap[color].activeBg,
            opacity: 0.9,
            transform: "translateY(-2px)",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        "&.MuiButton-outlined": {
          "&:hover": {
            backgroundColor: colorMap[color].hoverBg,
            transform: "translateY(-2px)",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        minWidth: "160px",
      }}
    >
      {label}
    </Button>
  );
};

// Enhanced Status Content Components
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

const PendingStatusContent = () => {
  return (
    <Box>
      <Box className="flex flex-col items-center mb-8">
        <Box className="inline-flex p-4 bg-amber-50 rounded-full mb-3">
          <PendingActionsIcon className="text-amber-500 text-4xl" />
        </Box>
        <Typography variant="h4" className="font-bold text-gray-800">
          Awaiting Approval
        </Typography>
        <Typography variant="subtitle1" className="text-amber-600 font-medium">
          Action required from stakeholders
        </Typography>
      </Box>

      <Box className="bg-amber-50 p-4 rounded-lg mb-6 border-l-4 border-amber-500">
        <Typography variant="body1" className="text-amber-800 mb-3">
          This project is currently pending approval from the stakeholders. The
          following items need to be completed before we can proceed:
        </Typography>

        <List className="space-y-1">
          {[
            "Final budget approval from finance department",
            "Legal review of vendor contracts",
            "Resource allocation confirmation from HR",
            "Infrastructure provisioning approval",
          ].map((item, index) => (
            <ListItem key={index} className="pl-0">
              <Box className="mr-2 text-amber-500">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Box>
              <Typography className="text-amber-800">{item}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

const InProgressContent = ({ progress }) => {
  return (
    <Box>
      veText
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
              Active development phase
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
      <Box className="space-y-3">
        {[
          {
            title: "Implement Payment Gateway Integration",
            due: "2023-08-15",
            assignee: "Alex Johnson",
            status: "In Progress",
            statusColor: "blue",
          },
          {
            title: "User Authentication Microservice",
            due: "2023-08-20",
            assignee: "Maria Garcia",
            status: "Code Review",
            statusColor: "purple",
          },
          {
            title: "Product Catalog UI Components",
            due: "2023-08-18",
            assignee: "Sam Wilson",
            status: "Testing",
            statusColor: "amber",
          },
        ].map((task, index) => (
          <Paper
            key={index}
            className="p-4 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 rounded-lg"
            elevation={1}
          >
            <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <Box>
                <Typography variant="subtitle1" className="font-medium mb-1">
                  {task.title}
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Due: {task.due} • Assigned to: {task.assignee}
                </Typography>
              </Box>
              <Chip
                label={task.status}
                size="medium"
                className={`bg-${task.statusColor}-100 text-${task.statusColor}-800 px-2 py-0.5 font-medium`}
              />
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

const FinishStatusContent = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={`full-${i}`} className="text-amber-400 text-3xl" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon
          key="half"
          className="text-amber-400 text-3xl"
          style={{ opacity: 0.7 }}
        />
      );
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="text-gray-300 text-3xl" />
      );
    }

    return stars;
  };

  return (
    <Box className="text-center py-6 px-4">
      <Box className="inline-flex p-5 bg-green-50 rounded-full mb-5">
        <CheckCircleOutlineIcon className="text-green-500 text-5xl" />
      </Box>
      <Typography variant="h3" className="font-bold mb-4 text-gray-800">
        Project Completed Successfully!
      </Typography>
      <Typography
        variant="body1"
        className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg leading-relaxed"
      >
        This project has been marked as finished. All tasks are completed and
        the final deliverables have been approved by stakeholders.
      </Typography>

      <Box className="flex justify-center mb-6">
        <Box className="flex items-center">
          {renderStars()}
          <Typography variant="h6" className="ml-2 text-gray-700 font-medium">
            {rating.toFixed(1)}/5.0
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            value="32"
            label="Completed Tasks"
            icon={<DescriptionIcon className="text-blue-500" />}
            color="bg-blue-50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            value="15"
            label="Team Members"
            icon={<GroupIcon className="text-purple-500" />}
            color="bg-purple-50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            value="98%"
            label="Satisfaction"
            icon={<CheckCircleOutlineIcon className="text-green-500" />}
            color="bg-green-50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            value="0"
            label="Critical Issues"
            icon={<CheckCircleOutlineIcon className="text-amber-500" />}
            color="bg-amber-50"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const MetricCard = ({ value, label, icon, color }) => {
  return (
    <Paper className="p-4 text-center rounded-lg shadow-sm hover:shadow-md transition-shadow h-full">
      <Box className={`inline-flex p-3 rounded-full mb-3 ${color}`}>
        {React.cloneElement(icon, { className: "text-xl" })}
      </Box>
      <Typography variant="h4" className="font-bold mb-1">
        {value}
      </Typography>
      <Typography variant="body2" className="text-gray-600">
        {label}
      </Typography>
    </Paper>
  );
};

export default ProjectPage;
