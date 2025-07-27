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
  Stop as StopIcon,  TaskAlt as TaskIcon



} from "@mui/icons-material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { useParams } from "react-router";
import { useUserId } from "../../../hooks/useUserId";
import { fetchProjectByUserProjectManager } from "../../../api/projects/fetchProjectById";
import { AnimatePresence, motion  } from "framer-motion";
import TimerDisplay from "../timework/TimerDisplay";
import { updateProjectStatus } from "../../../api/projects/updateProjectStatus";

// Luxury color palette
const colors = {
  primary: "#4361EE",
  secondary: "#3A0CA3",
  accent: "#7209B7",
  success: "#4CC9F0",
  warning: "#F8961E",
  error: "#F72585",
  dark: "#1A1A2E",
  light: "#F8F9FA",
};

// Styled components
const SectionCard = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: `0 8px 32px ${alpha(colors.dark, 0.08)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 40px ${alpha(colors.dark, 0.12)}`,
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${alpha(colors.primary, 0.1)} 0%, transparent 100%)`,
  borderBottom: `1px solid ${alpha(colors.primary, 0.1)}`,
  cursor: "pointer",
  "&:hover": {
    background: `linear-gradient(135deg, ${alpha(colors.primary, 0.15)} 0%, transparent 100%)`,
  },
}));


const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #3f51b5 0%, #2196f3 100%)',
  color: 'white',
  fontWeight: 600,
  borderRadius: '12px',
  padding: '8px 24px',
  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(33, 150, 243, 0.3)',
    transform: 'translateY(-2px)'
  }
}));
const statusConfig = [
  {
    key: "Open",
    label: "Open",
    icon: <LockOpenIcon />,
    color: "#2196F3",
    gradient: "linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)",
    description: "Project is ready to start",
  },
  {
    key: "Pending",
    label: "Pending",
    icon: <PendingActionsIcon />,
    color: "#FFC107",
    gradient: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    description: "Waiting for resources or approval",
  },
  {
    key: "In-Progress",
    label: "In Progress",
    icon: <BuildIcon />,
    color: "#3F51B5",
    gradient: "linear-gradient(135deg, #3F51B5 0%, #7986CB 100%)",
    description: "Active development underway",
  },
  {
    key: "Finish",
    label: "Completed",
    icon: <CheckCircleOutlineIcon />,
    color: "#4CAF50",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
    description: "Project successfully delivered",
  },
];

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
      // Optimistic UI update
      const previousStatus = currentStatus;
      setCurrentStatus(newStatus);
      
      // Update local state
      setProjectData(prev => ({
        ...prev,
        status: newStatus,
        stateChanges: [
          ...(prev.stateChanges || []),
          {
            from: prev.status,
            to: newStatus,
            timestamp: new Date().toISOString()
          }
        ]
      }));

      // Call API to update status in database
      await updateProjectStatus(projectData._id , newStatus);
      
    } catch (err) {
      // Revert if API call fails
      setCurrentStatus(previousStatus);
      setError('Failed to update project status');
      console.error('Error updating project status:', err);
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

  const { status, totalWorkTime, stateChanges = [] } = projectData;

  // Calculate if the project is currently being tracked (in-progress)
  const isTracking = currentStatus === "In-Progress";

  // Get the last status change timestamp
  const lastStatusChange =
    stateChanges.length > 0
      ? stateChanges[stateChanges.length - 1].timestamp
      : null;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
        PROJECT STATUS DASHBOARD
      </Typography>

      <SectionCard>
        <SectionHeader onClick={() => toggleSection("dashboard")}>
          <Avatar
            sx={{
              bgcolor: alpha(colors.primary, 0.1),
              color: colors.primary,
              mr: 2,
            }}
          >
            <DashboardIcon />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            {/* <Typography variant="h6" fontWeight={700}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)} Platform
                        </Typography> */}
            <Typography variant="body2" color="textSecondary">
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


            <CardContent sx={{ 
                      background: 'radial-gradient(circle at top left, #f5f7fa 0%, #f0f4f8 100%)',
                      padding: '2px'
                    }}>
                      {/* Status Selection */}
                      <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                        gap: '16px',
                        mb: '24px'
                      }}>
                        {statusConfig.map((statusItem) => (
                          <Tooltip key={statusItem.key} title={statusItem.description} arrow>
                            <div>
                              <Box
                                onClick={() => handleStatusChange(statusItem.key)}
                                sx={{
                                  background: statusItem.key === currentStatus ? statusItem.gradient : '#fff',
                                  color: statusItem.key === status ? '#fff' : theme.palette.text.primary,
                                  border: `1px solid ${statusItem.key === status ? 'transparent' : theme.palette.divider}`,
                                  borderRadius: '12px',
                                  padding: '16px',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  boxShadow: statusItem.key === status ? `0 8px 16px ${statusItem.color}40` : '0 4px 12px rgba(0, 0, 0, 0.05)',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 8px 24px ${statusItem.color}40`
                                  }
                                }}
                              >
                                <Box display="flex" alignItems="center" mb={1}>
                                  <Avatar
                                    sx={{
                                      backgroundColor: statusItem.key === status ? '#fff' : `${statusItem.color}20`,
                                      color: statusItem.key === status ? statusItem.color : statusItem.color,
                                      mr: 2,
                                      width: 40,
                                      height: 40
                                    }}
                                  >
                                    {statusItem.icon}
                                  </Avatar>
                                  <Typography fontWeight="600">{statusItem.label}</Typography>
                                </Box>
                                <AnimatePresence>
                                  {hoveredStatus === statusItem.key && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        {statusItem.description}
                                      </Typography>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                                {statusItem.key === status && (
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: 0,
                                      right: 0,
                                      width: 0,
                                      height: 0,
                                      borderTop: '24px solid #fff',
                                      borderLeft: '24px solid transparent',
                                      opacity: 0.2
                                    }}
                                  />
                                )}
                              </Box>
                            </div>
                          </Tooltip>
                        ))}
                      </Box>
            
                      {/* Time Tracking Section */}
                      <Box sx={{ 
                        mb: '24px', 
                        p: '20px', 
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.03)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '100%',
                          background: statusConfig.find(s => s.key === status).gradient
                        }
                      }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                          <Box display="flex" alignItems="center">
                            <TimeIcon sx={{ 
                              color: statusConfig.find(s => s.key === status).color,
                              mr: 1.5,
                              fontSize: '28px'
                            }} />
                            <Typography variant="h6" fontWeight="700">
                              TIME TRACKER
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2" color="text.secondary" mr={1}>
                              Current Status:
                            </Typography>
                            <Chip
                              label={status.replace('-', ' ').toUpperCase()}
                              size="small"
                              sx={{
                                fontWeight: '700',
                                backgroundColor: statusConfig.find(s => s.key === status).color + '20',
                                color: statusConfig.find(s => s.key === status).color
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
                              initialTime={totalWorkTime}
                              isTracking={isTracking}
                              lastStatusChange={lastStatusChange}
                              sx={{ 
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                fontFamily: 'monospace',
                                color: theme.palette.text.primary,
                                letterSpacing: '1px'
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              TOTAL TIME INVESTED
                            </Typography>
                          </Box>
            
                          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
                            {status === "In-Progress" ? (
                              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                  variant="contained"
                                  startIcon={<PauseIcon />}
                                  sx={{
                                    background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                                    color: 'white',
                                    fontWeight: '600',
                                    borderRadius: '8px',
                                    minWidth: '140px',
                                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.2)'
                                  }}
                                  onClick={() => handleStatusChange("Pending")}
                                >
                                  PAUSE
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
                                >
                                  START WORK
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
                                  background: status === "In-Progress" 
                                    ? 'linear-gradient(135deg, #F44336 0%, #E57373 100%)' 
                                    : 'rgba(0, 0, 0, 0.05)',
                                  color: status === "In-Progress" ? 'white' : theme.palette.text.disabled,
                                  fontWeight: '600',
                                  borderRadius: '8px',
                                  minWidth: '140px',
                                  boxShadow: status === "In-Progress" 
                                    ? '0 4px 12px rgba(244, 67, 54, 0.2)' 
                                    : 'none',
                                  cursor: status === "In-Progress" ? 'pointer' : 'not-allowed'
                                }}
                                disabled={status !== "In-Progress"}
                                onClick={() => handleStatusChange("Finish")}
                              >
                                COMPLETE
                              </Button>
                            </motion.div>
                          </Box>
                        </Box>
                      </Box>
            
            
                      <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />
            
                      {/* Dynamic Content Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ 
                          p: '20px',
                          background: '#fff',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                          border: '1px solid rgba(0, 0, 0, 0.05)'
                        }}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <TaskIcon sx={{ 
                              color: statusConfig.find(s => s.key === status).color,
                              mr: 1.5
                            }} />
                            <Typography variant="h6" fontWeight="700">
                              {status.toUpperCase()} STATUS DETAILS
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
