import React, { useState } from 'react';
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
  useTheme
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
    key: "open", 
    label: "Open", 
    icon: <LockOpenIcon />, 
    color: "#2196F3",
    gradient: "linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)",
    description: "Project is ready to start" 
  },
  { 
    key: "pending", 
    label: "Pending", 
    icon: <PendingActionsIcon />, 
    color: "#FFC107",
    gradient: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
    description: "Waiting for resources or approval" 
  },
  { 
    key: "in-progress", 
    label: "In Progress", 
    icon: <BuildIcon />, 
    color: "#3F51B5",
    gradient: "linear-gradient(135deg, #3F51B5 0%, #7986CB 100%)",
    description: "Active development underway" 
  },
  { 
    key: "finish", 
    label: "Completed", 
    icon: <CheckCircleOutlineIcon />, 
    color: "#4CAF50",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
    description: "Project successfully delivered" 
  },
];

const statusProgressValues = {
  'open': 0,
  'pending': 30,
  'in-progress': 65,
  'finish': 100
};

const ProjectStatus = ({
  projectStatus,
  toggleExpand,
  expanded,
  handleStatusChange,
  totalWorkTime,
  isTracking,
  lastStatusChange,
  timeEntries,
  openHistoryModal,
  setOpenHistoryModal,
  statusComponents,
}) => {
  const theme = useTheme();
  const [hoveredStatus, setHoveredStatus] = useState(null);

  return (
    <GlowCard className="mb-8">
      <CardHeader
        sx={{
          background: 'linear-gradient(90deg, #1A237E 0%, #283593 100%)',
          color: 'white',
          padding: '20px 24px'
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
            {statusConfig.map((status) => (
              <Tooltip key={status.key} title={status.description} arrow>
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredStatus(status.key)}
                  onHoverEnd={() => setHoveredStatus(null)}
                >
                  <Box
                    onClick={() => handleStatusChange(status.key)}
                    sx={{
                      background: status.key === projectStatus ? status.gradient : '#fff',
                      color: status.key === projectStatus ? '#fff' : theme.palette.text.primary,
                      border: `1px solid ${status.key === projectStatus ? 'transparent' : theme.palette.divider}`,
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: status.key === projectStatus ? `0 8px 16px ${status.color}40` : '0 4px 12px rgba(0, 0, 0, 0.05)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 24px ${status.color}40`
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <Avatar
                        sx={{
                          backgroundColor: status.key === projectStatus ? '#fff' : `${status.color}20`,
                          color: status.key === projectStatus ? status.color : status.color,
                          mr: 2,
                          width: 40,
                          height: 40
                        }}
                      >
                        {status.icon}
                      </Avatar>
                      <Typography fontWeight="600">{status.label}</Typography>
                    </Box>
                    <AnimatePresence>
                      {hoveredStatus === status.key && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {status.description}
                          </Typography>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {status.key === projectStatus && (
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
                </motion.div>
              </Tooltip>
            ))}
          </Box>

          {/* Progress Section */}
          <Box sx={{ mb: '24px', p: '16px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Box display="flex" alignItems="center">
                <HourglassIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                  PROJECT PROGRESS
                </Typography>
              </Box>
              <StatusBadge 
                status={projectStatus} 
                label={`${statusProgressValues[projectStatus]}% COMPLETE`} 
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={statusProgressValues[projectStatus]}
              sx={{
                height: '8px',
                borderRadius: '4px',
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: '4px',
                  background: statusConfig.find(s => s.key === projectStatus).gradient
                }
              }}
            />
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
              background: statusConfig.find(s => s.key === projectStatus).gradient
            }
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center">
                <TimeIcon sx={{ 
                  color: statusConfig.find(s => s.key === projectStatus).color,
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
                  label={projectStatus.replace('-', ' ').toUpperCase()}
                  size="small"
                  sx={{
                    fontWeight: '700',
                    backgroundColor: statusConfig.find(s => s.key === projectStatus).color + '20',
                    color: statusConfig.find(s => s.key === projectStatus).color
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
                {projectStatus === "in-progress" ? (
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
                      onClick={() => handleStatusChange("pending")}
                    >
                      PAUSE
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    whileHover={{ scale: projectStatus !== "finish" ? 1.03 : 1 }} 
                    whileTap={{ scale: projectStatus !== "finish" ? 0.97 : 1 }}
                  >
                    <GradientButton
                      startIcon={<StartIcon />}
                      disabled={projectStatus === "finish"}
                      onClick={() => handleStatusChange("in-progress")}
                    >
                      START WORK
                    </GradientButton>
                  </motion.div>
                )}

                <motion.div 
                  whileHover={{ scale: projectStatus === "in-progress" ? 1.03 : 1 }} 
                  whileTap={{ scale: projectStatus === "in-progress" ? 0.97 : 1 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<StopIcon />}
                    sx={{
                      background: projectStatus === "in-progress" 
                        ? 'linear-gradient(135deg, #F44336 0%, #E57373 100%)' 
                        : 'rgba(0, 0, 0, 0.05)',
                      color: projectStatus === "in-progress" ? 'white' : theme.palette.text.disabled,
                      fontWeight: '600',
                      borderRadius: '8px',
                      minWidth: '140px',
                      boxShadow: projectStatus === "in-progress" 
                        ? '0 4px 12px rgba(244, 67, 54, 0.2)' 
                        : 'none',
                      cursor: projectStatus === "in-progress" ? 'pointer' : 'not-allowed'
                    }}
                    disabled={projectStatus !== "in-progress"}
                    onClick={() => handleStatusChange("finish")}
                  >
                    COMPLETE
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </Box>

          {/* History Section */}
          {timeEntries.length > 0 && (
            <Box sx={{ 
              mb: '24px',
              textAlign: 'center'
            }}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  onClick={() => setOpenHistoryModal(true)}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: '600',
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      backgroundColor: 'rgba(33, 150, 243, 0.04)'
                    }
                  }}
                >
                  VIEW WORK HISTORY ({timeEntries.length} SESSIONS)
                </Button>
              </motion.div>
              <SessionWorkModal
                open={openHistoryModal}
                onClose={() => setOpenHistoryModal(false)}
                timeEntries={timeEntries}
              />
            </Box>
          )}

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
                  color: statusConfig.find(s => s.key === projectStatus).color,
                  mr: 1.5
                }} />
                <Typography variant="h6" fontWeight="700">
                  {projectStatus.toUpperCase()} STATUS DETAILS
                </Typography>
              </Box>
              {statusComponents[projectStatus]}
            </Box>
          </motion.div>
        </CardContent>
      </Collapse>
    </GlowCard>
  );
};

export default ProjectStatus;