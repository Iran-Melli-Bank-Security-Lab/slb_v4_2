import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  IconButton,
  Collapse,
  LinearProgress,
  Chip,
  Tooltip,
  Avatar,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  PendingActions as PendingActionsIcon,
  Build as BuildIcon,
  LockOpen as LockOpenIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AccessTime as TimeIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Info as InfoIcon,
  History as HistoryIcon,
  RocketLaunch as RocketIcon,
  HourglassTop as HourglassIcon,
  TaskAlt as TaskIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/system';
import TimerDisplay from "../timework/TimerDisplay"
import SessionWorkModal from "../sessionWork/SessionWorkModal"
import { fetchProjectByUserProjectManager } from "../../../api/projects/fetchProjectById";
import { useParams } from 'react-router';
import { useUserId } from '../../../hooks/useUserId';
import { updateProjectStatus } from '../../../api/projects/updateProjectStatus';
// استایل‌های سفارشی
const GlowCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: `0 12px 48px rgba(0, 0, 0, 0.15)`,
    transform: 'translateY(-2px)'
  },
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #3f51b5, #2196f3, #00bcd4)',
    zIndex: 1
  }
}));

const StatusBadge = styled(Chip)(({ theme, status }) => ({
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  backgroundColor: 
    status === 'in-progress' ? 'rgba(63, 81, 181, 0.1)' :
    status === 'finish' ? 'rgba(76, 175, 80, 0.1)' :
    status === 'pending' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(33, 150, 243, 0.1)',
  color: 
    status === 'in-progress' ? '#3f51b5' :
    status === 'finish' ? '#4caf50' :
    status === 'pending' ? '#ffc107' : '#2196f3',
  border: `1px solid ${
    status === 'in-progress' ? '#3f51b5' :
    status === 'finish' ? '#4caf50' :
    status === 'pending' ? '#ffc107' : '#2196f3'
  }`,
  borderRadius: '12px',
  padding: '4px 12px'
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
    description: "Project is ready to start" 
  },
  { 
    key: "Pending", 
    label: "Pending", 
    icon: <PendingActionsIcon />, 
    color: "#FFC107",
    gradient: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    description: "Waiting for resources or approval" 
  },
  { 
    key: "In-Progress", 
    label: "In Progress", 
    icon: <BuildIcon />, 
    color: "#3F51B5",
    gradient: "linear-gradient(135deg, #3F51B5 0%, #7986CB 100%)",
    description: "Active development underway" 
  },
  { 
    key: "Finish", 
    label: "Completed", 
    icon: <CheckCircleOutlineIcon />, 
    color: "#4CAF50",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
    description: "Project successfully delivered" 
  },
];



const ProjectStatus = ({statusComponents }) => {
  const {id , projectManager } = useParams()
  const userId = useUserId()
  const theme = useTheme();
  const [hoveredStatus, setHoveredStatus] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('Open'); // Initialize with default status

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const result = await fetchProjectByUserProjectManager(id , userId , projectManager);
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
  }, [id , userId , projectManager]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

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
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!projectData) {
    return null;
  }

  const { status, totalWorkTime, stateChanges = [] } = projectData;
  
  // Calculate if the project is currently being tracked (in-progress)
  const isTracking = currentStatus === 'In-Progress';
  
  // Get the last status change timestamp
  const lastStatusChange = stateChanges.length > 0 
    ? stateChanges[stateChanges.length - 1].timestamp 
    : null;


  return (
    <GlowCard className="mb-8">
      <CardHeader
        sx={{
          background: 'linear-gradient(90deg, #1A237E 0%, #283593 100%)',
          color: 'white',
        }}
        title={
          <Box display="flex" alignItems="center">
            <RocketIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6" fontWeight="700">
              PROJECT STATUS DASHBOARD
            </Typography>
          </Box>
        }
        subheader={
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mt: 0.5 }}>
            Track and manage your project lifecycle
          </Typography>
        }
        action={
          <motion.div 
            animate={{ rotate: expanded ? 180 : 0 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IconButton 
              onClick={toggleExpand}
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </motion.div>
        }
      />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ 
          background: 'radial-gradient(circle at top left, #f5f7fa 0%, #f0f4f8 100%)',
          padding: '24px'
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
              
              {/* {statusComponents[status]} */}
           
           
           
            </Box>
          </motion.div>
          
        </CardContent>
      </Collapse>
    </GlowCard>
  );
};

export default ProjectStatus;