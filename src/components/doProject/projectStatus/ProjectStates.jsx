import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Collapse,
  Tooltip,
  Paper,
  Badge,
  CircularProgress,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LockOpen as LockOpenIcon,
  PendingActions as PendingActionsIcon,
  Build as BuildIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  AccessTime as TimeIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon, TaskAlt as TaskIcon,
  PlayArrow,
  AccessTime,
  Fullscreen as FullscreenIcon,



} from "@mui/icons-material";

import { styled, alpha, useTheme } from "@mui/material/styles";
import { useParams } from "react-router";
import { useUserId } from "../../../hooks/useUserId";
import { fetchProjectByUserProjectManager } from "../../../api/projects/fetchProjectById";
import { AnimatePresence, motion } from "framer-motion";
import TimerDisplay from "../timework/TimerDisplay";
import { updateProjectStatus } from "../../../api/projects/updateProjectStatus";
import { savaProjectDate } from "../../../api/projects/saveProjectDate";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';


import { formatDistanceToNow } from 'date-fns';

import AdapterJalali from "../../dateTime/AdapterJalali";
import { faIR } from 'date-fns-jalali/locale';
import { format as formatJalali } from 'date-fns-jalali';
import { toast } from "react-toastify";

// Luxury color palette
const colors = {
  primary: "#2563EB",
  secondary: "#1F2A44",
  accent: "#6366F1",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  dark: "#0F172A",
  light: "#F8FAFC",
};

// Styled components
const SectionCard = styled(Paper)(({ theme }) => ({
  borderRadius: "24px",
  overflow: "hidden",
  border: `1px solid ${alpha(colors.primary, 0.08)}`,
  background: `linear-gradient(180deg, ${alpha(
    theme.palette.background.paper,
    0.96
  )} 0%, ${theme.palette.background.paper} 100%)`,
  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
  transition: "box-shadow 0.2s ease, transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 24px 48px rgba(15, 23, 42, 0.12)",
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2.5, 3),
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.08
  )} 0%, transparent 100%)`,
  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
  cursor: "pointer",
  "&:hover": {
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.12
    )} 0%, transparent 100%)`,
  },
}));


const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  fontWeight: 700,
  borderRadius: "999px",
  padding: "8px 24px",
  textTransform: "none",
  boxShadow: `0 10px 22px ${alpha(theme.palette.primary.main, 0.22)}`,
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: `0 12px 26px ${alpha(theme.palette.primary.main, 0.28)}`,
    transform: "translateY(-1px)",
  },
}));

const statusConfig = [
  {
    key: "Open",
    label: "Open",
    icon: <LockOpenIcon />,
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #93C5FD 100%)",
    description: "Project is ready to start",
  },
  {
    key: "Pending",
    label: "Pending",
    icon: <PendingActionsIcon />,
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)",
    description: "Waiting for resources or approval",
  },
  {
    key: "In-Progress",
    label: "In Progress",
    icon: <BuildIcon />,
    color: "#6366F1",
    gradient: "linear-gradient(135deg, #6366F1 0%, #A5B4FC 100%)",
    description: "Active development underway",
  },
  {
    key: "Finish",
    label: "Completed",
    icon: <CheckCircleOutlineIcon />,
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981 0%, #6EE7B7 100%)",
    description: "Project successfully delivered",
  },
];
const formatPersianDate = (date) => {
  if (!date) return '';
  return formatJalali(date, 'yyyy/M/d', { locale: faIR });
};
const ProjcetStates = ({ statusComponents }) => {
  const [expandedSections, setExpandedSections] = useState({ dashboard: true });
  const { id, projectManager } = useParams();
  const userId = useUserId();
  const theme = useTheme();
  const [hoveredStatus, setHoveredStatus] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("Open"); // Initialize with default status

  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [dateType, setDateType] = useState(null); // 'start' or 'finish'
  const [startDate, setStartDate] = useState(projectData?.startDate ? new Date(projectData.startDate) : null);
  const [finishDate, setFinishDate] = useState(projectData?.finishDate ? new Date(projectData.finishDate) : null);

  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  // const handleSaveProjectDates = async (e) => {

  //   try{
  //   if (dateType === "start") {

  //     const result =  await savaProjectDate(id , userId , startDate , "start")
  //     toast.success("Sucessfully Updated Project Start Date!!")

  //   } else {

  //     const result = await savaProjectDate(id , userId , finishDate , "finish")
  //     toast.success("Sucessfully Updated Project Finish Date!!")


  //   }
  // }catch(error){
  //   console.log("error in line 196 : " , error.message )
  // }
  //   setDateModalOpen(false);

  // }
  const handleSaveProjectDates = async (e) => {
    try {
      if (dateType === "start") {
         await savaProjectDate(id, userId, startDate, "start");
        toast.success("Successfully Updated Project Start Date!!");
      } else {
         await savaProjectDate(id, userId, finishDate, "finish");
        toast.success("Successfully Updated Project Finish Date!!");
      }
    } catch (error) {
      console.log("Error saving date:", error);
      // Display the actual error message from backend
      toast.error(error.message || "Failed to save project date");
      return; // Don't close the modal if there's an error
    }
    setDateModalOpen(false);
  }


  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const result = await fetchProjectByUserProjectManager(
          id,
          userId,
          projectManager
        );
        setProjectData(result);
        setLoading(false);
        if (result?.status) {
          setCurrentStatus(result.status);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id, userId, projectManager]);

  const handleStatusChange = async (newStatus) => {
    try {
      setCurrentStatus(newStatus);

      const response = await updateProjectStatus({
        projectId: projectData?.project,
        userId,
        newStatus
      });

      // داده‌های برگشتی از بک‌اند منبع حقیقت هستند
      setProjectData(prev => ({
        ...prev,
        status: response.status,
        totalWorkTime: response.totalWorkTime,
        stateChanges: response.stateChanges,
        startDate: response.startDate,
      }));

    } catch (err) {
      console.error("Status change error:", err);
      setError(err.message || 'Failed to update project status');
    }
  };



  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!projectData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <Typography color="error">No Project Found </Typography>
      </Box>
    );
  }

  const status = currentStatus || projectData.status || "Open";
  const activeStatus = statusConfig.find((item) => item.key === status) || statusConfig[0];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ mb: 0.5, letterSpacing: "-0.02em" }}
        >
          Project Status Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track progress, time, and key status changes in one view
        </Typography>
      </Box>

      <SectionCard>
        <SectionHeader onClick={() => toggleSection("dashboard")}>
          <Avatar
            sx={{
              bgcolor: alpha(colors.primary, 0.12),
              color: colors.primary,
              width: 44,
              height: 44,
            }}
          >
            <DashboardIcon />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              Status Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track and manage your project lifecycle
            </Typography>
          </Box>
          <IconButton size="small">
            {expandedSections.dashboard ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </IconButton>
        </SectionHeader>

        <Collapse in={expandedSections.dashboard}>
          <Box sx={{ p: 2 }}>


            <CardContent
              sx={{
                background: `linear-gradient(180deg, ${alpha(
                  colors.primary,
                  0.04
                )} 0%, #ffffff 100%)`,
                p: { xs: 2, md: 3 },
              }}
            >
              {/* Status Selection */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
                  gap: 2,
                  mb: 3,
                }}
              >
                {statusConfig.map((statusItem) => {
                  const isActive = statusItem.key === status;
                  const showDescription =
                    hoveredStatus === statusItem.key || isActive;

                  return (
                    <Tooltip
                      key={statusItem.key}
                      title={statusItem.description}
                      arrow
                    >
                      <Box
                        onMouseEnter={() => setHoveredStatus(statusItem.key)}
                        onMouseLeave={() => setHoveredStatus(null)}
                        onClick={() => handleStatusChange(statusItem.key)}
                        sx={{
                          background: isActive
                            ? `linear-gradient(135deg, ${alpha(
                                statusItem.color,
                                0.16
                              )} 0%, ${alpha(statusItem.color, 0.04)} 100%)`
                            : "#ffffff",
                          color: isActive ? theme.palette.text.primary : theme.palette.text.primary,
                          border: `1px solid ${alpha(
                            statusItem.color,
                            isActive ? 0.4 : 0.18
                          )}`,
                          borderRadius: 3,
                          padding: 2,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: isActive
                            ? `0 14px 28px ${alpha(statusItem.color, 0.18)}`
                            : "0 6px 16px rgba(15, 23, 42, 0.06)",
                          position: "relative",
                          overflow: "hidden",
                          minHeight: 120,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 16px 32px ${alpha(
                              statusItem.color,
                              0.2
                            )}`,
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: 4,
                            height: "100%",
                            background: statusItem.gradient,
                            opacity: isActive ? 1 : 0.5,
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center" mb={1}>
                          <Avatar
                            sx={{
                              backgroundColor: isActive
                                ? "#ffffff"
                                : alpha(statusItem.color, 0.12),
                              color: statusItem.color,
                              mr: 2,
                              width: 42,
                              height: 42,
                              boxShadow: isActive
                                ? `0 6px 16px ${alpha(
                                    statusItem.color,
                                    0.2
                                  )}`
                                : "none",
                            }}
                          >
                            {statusItem.icon}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={700}>
                              {statusItem.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {isActive ? "Current status" : "Tap to set"}
                            </Typography>
                          </Box>
                        </Box>
                        <AnimatePresence>
                          {showDescription && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: "text.secondary" }}
                              >
                                {statusItem.description}
                              </Typography>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>

              {/* Time Tracking Section */}
              <Box
                sx={(theme) => ({
                  mb: 3,
                  p: { xs: 2, md: 3 },
                  background: `linear-gradient(180deg, ${alpha(
                    activeStatus.color,
                    0.08
                  )} 0%, #ffffff 100%)`,
                  borderRadius: 3,
                  border: `1px solid ${alpha(activeStatus.color, 0.18)}`,
                  boxShadow: `0 14px 30px ${alpha(activeStatus.color, 0.1)}`,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 4,
                    height: "100%",
                    background: activeStatus.gradient,
                    opacity: 0.9,
                  },
                })}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                  flexWrap="wrap"
                  gap={2}
                >
                  <Box display="flex" alignItems="center">
                    <TimeIcon sx={{
                      color: activeStatus.color,
                      mr: 1.5,
                      fontSize: '28px'
                    }} />
                    <Typography variant="h6" fontWeight="700">
                      Time Tracking
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" color="text.secondary" mr={1}>
                      Current status:
                    </Typography>
                    <Chip
                      label={status.replace('-', ' ').toUpperCase()}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        borderRadius: 999,
                        backgroundColor: alpha(activeStatus.color, 0.16),
                        color: activeStatus.color,
                        border: `1px solid ${alpha(activeStatus.color, 0.3)}`,
                      }}
                    />
                  </Box>
                </Box>

                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between">
                  <Box sx={{
                    textAlign: 'center',
                    mb: { xs: 3, md: 0 },
                    mr: { md: 3 }
                  }}>
                    <TimerDisplay
                      totalWorkTime={projectData.totalWorkTime} // Total seconds from backend
                      isTracking={currentStatus === "In-Progress"} // True when in-progress
                      lastStatusChange={
                        projectData?.stateChanges?.filter(c => c.state === "In-Progress").slice(-1)[0]?.timestamp
                      }
                    />
                    <Typography variant="caption" color="text.secondary">
                      Total time invested
                    </Typography>
                  </Box>

                  <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
                    {status === "In-Progress" ? (
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          variant="contained"
                          startIcon={<PauseIcon />}
                          sx={{
                            background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`,
                            color: theme.palette.warning.contrastText,
                            fontWeight: 700,
                            borderRadius: 999,
                            minWidth: 140,
                            textTransform: "none",
                            boxShadow: `0 10px 20px ${alpha(
                              theme.palette.warning.main,
                              0.22
                            )}`,
                          }}
                          onClick={() => handleStatusChange("Pending")}
                        >
                          Pause
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: status !== "Finish" ? 1.03 : 1 }}
                        whileTap={{ scale: status !== "Finish" ? 0.97 : 1 }}
                      >
                        <GradientButton
                          startIcon={<StartIcon />}
                          disabled={status === "Finish"}
                          onClick={() => handleStatusChange("In-Progress")}
                          sx={{ minWidth: 140 }}
                        >
                          Start work
                        </GradientButton>
                      </motion.div>
                    )}

                    <motion.div
                      whileHover={{ scale: status === "In-Progress" ? 1.03 : 1 }}
                      whileTap={{ scale: status === "In-Progress" ? 0.97 : 1 }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<StopIcon />}
                        sx={{
                          background:
                            status === "In-Progress"
                              ? `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`
                              : alpha(theme.palette.error.main, 0.08),
                          color:
                            status === "In-Progress"
                              ? theme.palette.error.contrastText
                              : theme.palette.text.disabled,
                          fontWeight: 700,
                          borderRadius: 999,
                          minWidth: 140,
                          textTransform: "none",
                          boxShadow:
                            status === "In-Progress"
                              ? `0 10px 20px ${alpha(
                                  theme.palette.error.main,
                                  0.22
                                )}`
                              : "none",
                          cursor:
                            status === "In-Progress" ? "pointer" : "not-allowed",
                        }}
                        disabled={status !== "In-Progress"}
                        onClick={() => handleStatusChange("Finish")}
                      >
                        Complete
                      </Button>
                    </motion.div>
                  </Box>
                </Box>
              </Box>

              {/* Date Buttons Section */}
              <Box
                sx={(theme) => ({
                  mb: 3,
                  p: { xs: 2, md: 3 },
                  background: `linear-gradient(180deg, ${alpha(
                    activeStatus.color,
                    0.04
                  )} 0%, #ffffff 100%)`,
                  borderRadius: 3,
                  border: `1px solid ${alpha(activeStatus.color, 0.14)}`,
                  boxShadow: `0 12px 26px ${alpha(activeStatus.color, 0.08)}`,
                })}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Box display="flex" alignItems="center">
                    <PendingActionsIcon sx={{
                      color: activeStatus.color,
                      mr: 1.5,
                      fontSize: '28px'
                    }} />
                    <Typography variant="h6" fontWeight="700">
                      Project Dates
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setDateType('start');
                        setDateModalOpen(true);
                      }}
                      sx={(theme) => ({
                        minWidth: 180,
                        direction: "rtl",
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 700,
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },
                      })}
                    >
                      {startDate ? formatPersianDate(startDate) : 'Set Start Date'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setDateType('finish');
                        setDateModalOpen(true);
                      }}
                      sx={(theme) => ({
                        minWidth: 180,
                        direction: "rtl",
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 700,
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },
                      })}
                      disabled={!startDate} // Disable finish date until start date is set
                    >
                      {finishDate ? formatPersianDate(finishDate) : 'Set Finish Date'}
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Date Selection Modal with Jalali Calendar */}
              <Dialog open={dateModalOpen} onClose={() => setDateModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                  Set {dateType === 'start' ? 'Project Start' : 'Project Finish'} Date
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                  <AdapterJalali
                    value={dateType === 'start' ? startDate : finishDate}
                    onChange={(newValue) => {
                      if (dateType === 'start') {
                        setStartDate(newValue);
                      } else {
                        setFinishDate(newValue);
                      }
                    }}
                  // minDate={dateType === 'finish' ? startDate : null}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDateModalOpen(false)}>Cancel</Button>
                  <Button
                    onClick={handleSaveProjectDates}
                    variant="contained"
                    color="primary"
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>


              {/* Status History Section */}
              <Box
                sx={(theme) => ({
                  mb: 3,
                  p: { xs: 2, md: 3 },
                  background: `linear-gradient(180deg, ${alpha(
                    activeStatus.color,
                    0.04
                  )} 0%, #ffffff 100%)`,
                  borderRadius: 3,
                  border: `1px solid ${alpha(activeStatus.color, 0.14)}`,
                  boxShadow: `0 12px 26px ${alpha(activeStatus.color, 0.08)}`,
                  position: "relative",
                  overflow: "hidden",
                })}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box display="flex" alignItems="center">
                    <AccessTime sx={{
                      color: activeStatus.color,
                      mr: 1.5,
                      fontSize: '28px'
                    }} />
                    <Typography variant="h6" fontWeight="700">
                      Status History
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip title="View full history">
                      <IconButton
                        onClick={() => setHistoryDialogOpen(true)}
                        sx={{ mr: 1 }}
                      >
                        <FullscreenIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton onClick={() => setHistoryExpanded(!historyExpanded)}>
                      {historyExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </Box>

                <Collapse in={historyExpanded}>
                  {projectData?.stateChanges?.length > 0 ? (
                    <Timeline position="alternate" sx={{ p: 0 }}>
                      {projectData.stateChanges.slice(0, historyExpanded ? undefined : 3).map((change, index) => {
                        const statusItem = statusConfig.find(s => s.key === change.state);
                        const isLast = index === projectData.stateChanges.length - 1;
                        const date = new Date(change.timestamp);

                        return (
                          <TimelineItem sx={{ direction: 'ltr' }} key={index}>
                            <TimelineOppositeContent
                              sx={{ m: 'auto 0', direction: "rtl" }}
                              align="right"
                              variant="body2"
                              color="text.secondary"
                            >
                              {formatPersianDate(date, 'MMM d, yyyy')}
                              <br />
                              {formatJalali(date, 'h:mm a')}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                              <TimelineConnector />
                              <TimelineDot sx={{ bgcolor: statusItem.color }}>
                                {statusItem.icon}
                              </TimelineDot>
                              {!isLast && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                              <Typography variant="h6" component="span">
                                Changed to {statusItem.label}
                              </Typography>
                              <Typography>
                                {formatDistanceToNow(date, { addSuffix: true })}
                              </Typography>
                              {change.note && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  Note: {change.note}
                                </Typography>
                              )}
                            </TimelineContent>
                          </TimelineItem>
                        );
                      })}
                    </Timeline>
                  ) : (
                    <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                      No status history available
                    </Typography>
                  )}
                </Collapse>

                {!historyExpanded && projectData?.stateChanges?.length > 3 && (
                  <Button
                    fullWidth
                    onClick={() => setHistoryExpanded(true)}
                    endIcon={<ExpandMoreIcon />}
                    sx={(theme) => ({
                      mt: 2,
                      borderRadius: 999,
                      textTransform: "none",
                      fontWeight: 700,
                      backgroundColor: alpha(activeStatus.color, 0.08),
                      color: theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: alpha(activeStatus.color, 0.14),
                      },
                    })}
                  >
                    Show more history
                  </Button>
                )}
              </Box>

              {/* Status History Dialog */}
              <Dialog
                open={historyDialogOpen}
                onClose={() => setHistoryDialogOpen(false)}
                fullWidth
                maxWidth="md"
              >
                <DialogTitle>
                  <Box display="flex" alignItems="center">
                    <AccessTime sx={{ mr: 1.5, color: activeStatus.color }} />
                    <Typography variant="h6">Complete Status History</Typography>
                  </Box>
                </DialogTitle>
                <DialogContent dividers>
                  {projectData?.stateChanges?.length > 0 ? (
                    <Timeline position="alternate" sx={{ p: 0 }}>
                      {projectData?.stateChanges.map((change, index) => {
                        const statusItem = statusConfig.find(s => s.key === change.state);
                        const isLast = index === projectData?.stateChanges.length - 1;
                        const date = new Date(change.timestamp);

                        return (
                          <TimelineItem key={index}>
                            <TimelineOppositeContent
                              sx={{ m: 'auto 0' }}
                              align="right"
                              variant="body2"
                              color="text.secondary"
                            >
                              {formatPersianDate(date, 'MMM d, yyyy')}


                              <br />
                              {formatJalali(date, 'h:mm a')}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                              <TimelineConnector />
                              <TimelineDot sx={{ bgcolor: statusItem.color }}>
                                {statusItem.icon}
                              </TimelineDot>
                              {!isLast && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                              <Typography variant="h6" component="span">
                                Changed to {statusItem.label}
                              </Typography>
                              <Typography>
                                {formatDistanceToNow(date, { addSuffix: true })}
                              </Typography>
                              {change.note && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  Note: {change.note}
                                </Typography>
                              )}
                              {change.changedBy && (
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                  Changed by: {change.changedBy}
                                </Typography>
                              )}
                            </TimelineContent>
                          </TimelineItem>
                        );
                      })}
                    </Timeline>
                  ) : (
                    <DialogContentText textAlign="center" py={4}>
                      No status history available
                    </DialogContentText>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
                </DialogActions>
              </Dialog>

              <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

              {/* Dynamic Content Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{
                  p: { xs: 2, md: 3 },
                  background: `linear-gradient(180deg, ${alpha(
                    activeStatus.color,
                    0.04
                  )} 0%, #ffffff 100%)`,
                  borderRadius: 3,
                  boxShadow: `0 12px 26px ${alpha(activeStatus.color, 0.08)}`,
                  border: `1px solid ${alpha(activeStatus.color, 0.14)}`,
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TaskIcon sx={{
                      color: activeStatus.color,
                      mr: 1.5
                    }} />
                    <Typography variant="h6" fontWeight="700">
                      {status.replace('-', ' ')} Details
                    </Typography>
                  </Box>

                  {statusComponents[status]}

                </Box>
              </motion.div>
            </CardContent>
          </Box>
        </Collapse>
      </SectionCard>
    </Box>
  );
};

export default ProjcetStates;
