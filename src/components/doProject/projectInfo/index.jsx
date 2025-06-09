import React, { memo, useState } from "react";
import {
  Avatar, Box, Card, Chip, Divider, Grid, List, ListItem, ListItemText,
  CardContent, ListItemAvatar, Typography, Tooltip, IconButton, LinearProgress,
  Badge, alpha, Button, Fade, Grow, Zoom
} from "@mui/material";
import {
  Person as PersonIcon,
  Code as CodeIcon,
  Cloud as CloudIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  Link as LinkIcon,
  OpenInNew as OpenInNewIcon,
  Verified as VerifiedIcon,
  MoreVert as MoreVertIcon,
  Work as WorkIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Circle as CircleIcon,
  Bolt as BoltIcon,
  Palette as PaletteIcon,
  Dashboard as DashboardIcon
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import DetailItem from "../DetailItem"
// Luxury color palette inspired by modern design systems
const luxuryColors = {
  primary: "#4361EE",       // Vibrant electric blue
  secondary: "#3A0CA3",     // Deep royal purple
  accent: "#7209B7",        // Rich magenta
  success: "#4CC9F0",       // Bright cyan
  warning: "#F8961E",       // Golden orange
  error: "#F72585",         // Electric pink
  dark: "#1A1A2E",          // Navy darkness
  light: "#F8F9FA",         // Pure white
  textPrimary: "#2B2D42",    // Dark blue-gray
  textSecondary: "#8D99AE",  // Soft blue-gray
  background: "#FFFFFF",     // Crisp white
  paper: "#F8F7FF",         // Subtle purple tint
  glow: "rgba(67, 97, 238, 0.4)" // Blue glow
};

// Gradient definitions with vibrant colors
const gradients = {
  header: `linear-gradient(135deg, ${luxuryColors.primary} 0%, ${luxuryColors.secondary} 100%)`,
  success: `linear-gradient(90deg, ${luxuryColors.success} 0%, ${luxuryColors.accent} 100%)`,
  warning: `linear-gradient(90deg, ${luxuryColors.warning} 0%, ${luxuryColors.error} 100%)`,
  cardHover: `linear-gradient(135deg, ${alpha(luxuryColors.primary, 0.1)} 0%, ${alpha(luxuryColors.secondary, 0.1)} 100%)`
};

// Custom animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 ${alpha(luxuryColors.primary, 0.4)}; }
  70% { box-shadow: 0 0 20px 10px ${alpha(luxuryColors.primary, 0)}; }
  100% { box-shadow: 0 0 0 0 ${alpha(luxuryColors.primary, 0)}; }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components with luxury design
const LuxuryCard = styled(Card)(({ theme }) => ({
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: `0 15px 35px ${alpha(luxuryColors.dark, 0.1)}`,
  transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
  background: luxuryColors.background,
  border: `1px solid ${alpha(luxuryColors.primary, 0.1)}`,
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 20px 50px ${alpha(luxuryColors.dark, 0.2)}`,
    borderColor: alpha(luxuryColors.primary, 0.3)
  }
}));

const HeaderGradient = styled(Box)(({ theme }) => ({
  background: gradients.header,
  padding: theme.spacing(5, 4, 4, 4),
  color: "white",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -50,
    right: -50,
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${alpha(luxuryColors.light, 0.1)} 0%, transparent 70%)`
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: gradients.success,
    animation: `${glowAnimation} 3s infinite`
  }
}));

const StatusPill = styled(Chip)(({ status }) => ({
  position: "absolute",
  top: 24,
  right: 24,
  fontWeight: 800,
  fontSize: "0.7rem",
  letterSpacing: "1px",
  textTransform: "uppercase",
  padding: "6px 16px",
  backgroundColor: status === "active" 
    ? `${luxuryColors.success}30` 
    : `${luxuryColors.error}30`,
  color: "white",
  backdropFilter: "blur(10px)",
  border: `1px solid ${status === "active" 
    ? luxuryColors.success 
    : luxuryColors.error}`,
  boxShadow: `0 4px 15px ${status === "active" 
    ? alpha(luxuryColors.success, 0.3) 
    : alpha(luxuryColors.error, 0.3)}`,
  animation: `${pulseAnimation} 2s infinite`,
  "& .MuiChip-icon": {
    color: "white",
    opacity: 0.8
  }
}));

const DetailCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3.5),
  background: luxuryColors.paper,
  borderRadius: "18px",
  height: "100%",
  border: `1px solid ${alpha(luxuryColors.primary, 0.1)}`,
  boxShadow: `0 8px 20px ${alpha(luxuryColors.dark, 0.05)}`,
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 15px 35px ${alpha(luxuryColors.dark, 0.15)}`,
    background: gradients.cardHover,
    borderColor: alpha(luxuryColors.primary, 0.3)
  }
}));

const TechPill = styled(Chip)(({ theme }) => ({
  borderRadius: "12px",
  fontWeight: 700,
  fontSize: "0.65rem",
  letterSpacing: "0.5px",
  height: "28px",
  padding: theme.spacing(0.5, 2),
  transition: "all 0.3s ease",
  "&.MuiChip-outlined": {
    borderWidth: "2px"
  },
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: `0 5px 15px ${alpha(luxuryColors.primary, 0.2)}`
  }
}));

const TimelineItem = styled(Box)(({ theme }) => ({
  minWidth: "260px",
  padding: theme.spacing(3),
  marginRight: theme.spacing(3),
  background: luxuryColors.paper,
  borderRadius: "16px",
  borderLeft: `5px solid ${luxuryColors.primary}`,
  boxShadow: `0 10px 25px ${alpha(luxuryColors.dark, 0.08)}`,
  transition: "all 0.4s ease",
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: `0 15px 35px ${alpha(luxuryColors.dark, 0.15)}`,
    borderLeft: `5px solid ${luxuryColors.accent}`
  }
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: "10px",
  borderRadius: "8px",
  backgroundColor: alpha(luxuryColors.light, 0.2),
  boxShadow: `inset 0 1px 3px ${alpha(luxuryColors.dark, 0.2)}`,
  "& .MuiLinearProgress-bar": {
    borderRadius: "8px",
    background: gradients.success,
    boxShadow: `0 0 10px ${alpha(luxuryColors.success, 0.5)}`,
    animation: `${glowAnimation} 3s infinite`
  }
}));

const FloatingActionButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  right: 24,
  bottom: -24,
  minWidth: "auto",
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  background: gradients.warning,
  color: "white",
  boxShadow: `0 10px 25px ${alpha(luxuryColors.warning, 0.4)}`,
  transition: "all 0.3s ease",
  animation: `${floatAnimation} 4s infinite ease-in-out`,
  "&:hover": {
    transform: "scale(1.1)",
    background: gradients.warning,
    boxShadow: `0 15px 35px ${alpha(luxuryColors.warning, 0.6)}`
  }
}));

function ProjectInfo({ projectData, devOpsInfo }) {
  const progress = projectData.progress || 0;
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Calculate project status
  const getProjectStatus = () => {
    if (progress >= 100) return { text: "COMPLETED", status: "active" };
    if (progress >= 75) return { text: "ON TRACK", status: "active" };
    if (progress >= 50) return { text: "IN PROGRESS", status: "active" };
    if (progress >= 25) return { text: "DELAYED", status: "inactive" };
    return { text: "AT RISK", status: "inactive" };
  };

  const projectStatus = getProjectStatus();

  return (
    <LuxuryCard>
      <HeaderGradient>
        <StatusPill 
          label={projectStatus.text} 
          status={projectStatus.status}
          icon={
            projectStatus.status === "active" ? 
              <BoltIcon fontSize="small" /> : 
              <CircleIcon fontSize="small" />
          }
        />
        
        <Box display="flex" alignItems="flex-end" mb={1}>
          <Typography variant="h3" fontWeight="900" sx={{ 
            letterSpacing: "-1px",
            lineHeight: 1.2,
            textShadow: `0 2px 10px ${alpha(luxuryColors.dark, 0.2)}`,
            position: "relative",
            zIndex: 2
          }}>
            {projectData.title}
          </Typography>
          {projectData.isVerified && (
            <Tooltip 
              title="Verified Project" 
              placement="top"
              TransitionComponent={Zoom}
              arrow
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{ ml: 2, mb: 0.5 }}
                badgeContent={
                  <Avatar sx={{ 
                    width: 28, 
                    height: 28,
                    bgcolor: luxuryColors.warning,
                    boxShadow: `0 4px 15px ${alpha(luxuryColors.warning, 0.5)}`
                  }}>
                    <VerifiedIcon fontSize="small" />
                  </Avatar>
                }
              >
                <Box />
              </Badge>
            </Tooltip>
          )}
        </Box>
        
        <Typography variant="h6" sx={{ 
          opacity: 0.9, 
          fontWeight: 400,
          letterSpacing: "0.5px",
          position: "relative",
          zIndex: 2
        }}>
          {projectData.subtitle || "Premium Project Dashboard"}
        </Typography>
        
        {/* Progress with animated bar */}
        <Box mt={4} position="relative" zIndex={2}>
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography variant="caption" fontWeight="700" letterSpacing="1px">
              PROJECT PROGRESS
            </Typography>
            <Typography variant="caption" fontWeight="800" sx={{ 
              background: gradients.success,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              {progress}%
            </Typography>
          </Box>
          <ProgressBar variant="determinate" value={progress} />
          <Box display="flex" justifyContent="space-between" mt={1.5}>
            <Typography variant="caption" fontWeight="600">
              {projectData.startDate}
            </Typography>
            <Typography variant="caption" fontWeight="600">
              {projectData.endDate}
            </Typography>
          </Box>
        </Box>

        <FloatingActionButton aria-label="Quick action">
          <BoltIcon fontSize="medium" />
        </FloatingActionButton>
      </HeaderGradient>

      <CardContent sx={{ p: 5, pt: 7 }}>
        {/* Project Description */}
        <Box mb={5}>
          <Typography 
            variant="body1" 
            color={luxuryColors.textSecondary}
            sx={{ 
              lineHeight: 1.9,
              fontSize: "1rem",
              letterSpacing: "0.3px"
            }}
          >
            {projectData.description || "This premium project dashboard showcases the highest quality design with smooth animations and attention to detail."}
          </Typography>
        </Box>

        <Divider sx={{ 
          my: 5, 
          borderColor: alpha(luxuryColors.primary, 0.1),
          borderWidth: "2px" 
        }} />

        {/* Main Cards Grid */}
        <Grid container spacing={4}>
          {/* Project Details Card */}
          <Grid item xs={12} md={4}>
            <Grow in={true} timeout={800}>
              <DetailCard>
                <Box display="flex" alignItems="center" mb={4}>
                  <Avatar sx={{ 
                    bgcolor: alpha(luxuryColors.primary, 0.1),
                    color: luxuryColors.primary,
                    width: 48,
                    height: 48,
                    mr: 2,
                    border: `2px solid ${alpha(luxuryColors.primary, 0.2)}`
                  }}>
                    <DashboardIcon fontSize="medium" />
                  </Avatar>
                  <Typography 
                    variant="h5" 
                    fontWeight="800"
                    color={luxuryColors.textPrimary}
                    sx={{ letterSpacing: "0.5px" }}
                  >
                    Project Details
                  </Typography>
                </Box>

                <Box sx={{ "& > *:not(:last-child)": { mb: 3 } }}>
                  <DetailItem
                    icon={
                      <Avatar sx={{ 
                        bgcolor: alpha(luxuryColors.primary, 0.1),
                        color: luxuryColors.primary,
                        width: 36,
                        height: 36
                      }}>
                        <CalendarIcon fontSize="small" />
                      </Avatar>
                    }
                    title="Timeline"
                    value={`${projectData.startDate} - ${projectData.endDate}`}
                    subtext={`${projectData.duration || "3 months"}`}
                    titleColor={luxuryColors.textPrimary}
                    valueColor={luxuryColors.textSecondary}
                  />
                  <DetailItem
                    icon={
                      <Avatar sx={{ 
                        bgcolor: alpha(luxuryColors.accent, 0.1),
                        color: luxuryColors.accent,
                        width: 36,
                        height: 36
                      }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    }
                    title="Owner"
                    value={
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          sx={{ 
                            width: 28, 
                            height: 28, 
                            mr: 2,
                            bgcolor: alpha(luxuryColors.secondary, 0.1),
                            color: luxuryColors.secondary,
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            border: `1px solid ${alpha(luxuryColors.secondary, 0.3)}`
                          }}
                        >
                          {projectData.owner.charAt(0)}
                        </Avatar>
                        <Typography fontWeight="600">
                          {projectData.owner}
                        </Typography>
                      </Box>
                    }
                    subtext={projectData.ownerRole || "Project Manager"}
                    titleColor={luxuryColors.textPrimary}
                    valueColor={luxuryColors.textSecondary}
                  />
                  <DetailItem
                    icon={
                      <Avatar sx={{ 
                        bgcolor: alpha(luxuryColors.success, 0.1),
                        color: luxuryColors.success,
                        width: 36,
                        height: 36
                      }}>
                        <WorkIcon fontSize="small" />
                      </Avatar>
                    }
                    title="Project Type"
                    value={projectData.type || "Web Application"}
                    titleColor={luxuryColors.textPrimary}
                    valueColor={luxuryColors.textSecondary}
                  />
                </Box>
              </DetailCard>
            </Grow>
          </Grid>

          {/* DevOps Information Card */}
          <Grid item xs={12} md={4}>
            <Grow in={true} timeout={1000}>
              <DetailCard>
                <Box display="flex" alignItems="center" mb={4}>
                  <Avatar sx={{ 
                    bgcolor: alpha(luxuryColors.error, 0.1),
                    color: luxuryColors.error,
                    width: 48,
                    height: 48,
                    mr: 2,
                    border: `2px solid ${alpha(luxuryColors.error, 0.2)}`
                  }}>
                    <SettingsIcon fontSize="medium" />
                  </Avatar>
                  <Typography 
                    variant="h5" 
                    fontWeight="800"
                    color={luxuryColors.textPrimary}
                    sx={{ letterSpacing: "0.5px" }}
                  >
                    DevOps
                  </Typography>
                </Box>

                <Box sx={{ "& > *:not(:last-child)": { mb: 3 } }}>
                  <DetailItem
                    icon={
                      <Avatar sx={{ 
                        bgcolor: alpha(luxuryColors.primary, 0.1),
                        color: luxuryColors.primary,
                        width: 36,
                        height: 36
                      }}>
                        <CodeIcon fontSize="small" />
                      </Avatar>
                    }
                    title="Repository"
                    value={
                      <Box 
                        display="flex" 
                        alignItems="center"
                        sx={{
                          "&:hover": {
                            "& a": {
                              color: luxuryColors.primary,
                              textDecoration: "underline"
                            },
                            "& svg": {
                              color: luxuryColors.primary
                            }
                          }
                        }}
                      >
                        <LinkIcon sx={{ 
                          color: luxuryColors.textSecondary, 
                          mr: 1.5, 
                          fontSize: "1.2rem" 
                        }} />
                        <a 
                          href={devOpsInfo.repoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: luxuryColors.textSecondary,
                            textDecoration: "none",
                            fontSize: "0.95rem",
                            transition: "color 0.2s ease",
                            fontWeight: 500
                          }}
                        >
                          {devOpsInfo.repoUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                        </a>
                        <OpenInNewIcon sx={{ 
                          color: luxuryColors.textSecondary, 
                          ml: 1.5, 
                          fontSize: "1.1rem",
                          transition: "color 0.2s ease"
                        }} />
                      </Box>
                    }
                    titleColor={luxuryColors.textPrimary}
                    valueColor={luxuryColors.textSecondary}
                  />
                  <DetailItem
                    icon={
                      <Avatar sx={{ 
                        bgcolor: alpha(luxuryColors.warning, 0.1),
                        color: luxuryColors.warning,
                        width: 36,
                        height: 36
                      }}>
                        <SettingsIcon fontSize="small" />
                      </Avatar>
                    }
                    title="CI/CD Pipeline"
                    value={devOpsInfo.ciTool}
                    subtext={`Last build: ${devOpsInfo.lastBuild || "2 days ago"}`}
                    titleColor={luxuryColors.textPrimary}
                    valueColor={luxuryColors.textSecondary}
                  />
                  <DetailItem
                    icon={
                      <Avatar sx={{ 
                        bgcolor: alpha(luxuryColors.success, 0.1),
                        color: luxuryColors.success,
                        width: 36,
                        height: 36
                      }}>
                        <CloudIcon fontSize="small" />
                      </Avatar>
                    }
                    title="Deployment"
                    value={devOpsInfo.deploymentTarget}
                    subtext={`Last deploy: ${devOpsInfo.lastDeploy || "1 day ago"}`}
                    titleColor={luxuryColors.textPrimary}
                    valueColor={luxuryColors.textSecondary}
                  />
                </Box>
              </DetailCard>
            </Grow>
          </Grid>

          {/* Team Members Card */}
          <Grid item xs={12} md={4}>
            <Grow in={true} timeout={1200}>
              <DetailCard>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ 
                      bgcolor: alpha(luxuryColors.secondary, 0.1),
                      color: luxuryColors.secondary,
                      width: 48,
                      height: 48,
                      mr: 2,
                      border: `2px solid ${alpha(luxuryColors.secondary, 0.2)}`
                    }}>
                      <GroupIcon fontSize="medium" />
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      fontWeight="800"
                      color={luxuryColors.textPrimary}
                      sx={{ letterSpacing: "0.5px" }}
                    >
                      Team Members
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${projectData.team.length}`}
                    size="medium"
                    sx={{
                      bgcolor: alpha(luxuryColors.primary, 0.1),
                      color: luxuryColors.primary,
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      height: "28px",
                      border: `1px solid ${alpha(luxuryColors.primary, 0.2)}`
                    }}
                  />
                </Box>

                <List sx={{ py: 0 }}>
                  {projectData.team.map((member, index) => (
                    <ListItem 
                      key={index} 
                      sx={{ 
                        px: 0, 
                        py: 2,
                        transition: "all 0.3s ease",
                        borderRadius: "12px",
                        mb: 1,
                        "&:hover": { 
                          bgcolor: alpha(luxuryColors.primary, 0.05),
                          transform: "translateX(8px)"
                        }
                      }}
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
                      secondaryAction={
                        <Fade in={hoveredItem === index}>
                          <IconButton edge="end" size="small" sx={{ 
                            bgcolor: alpha(luxuryColors.primary, 0.1),
                            "&:hover": {
                              bgcolor: alpha(luxuryColors.primary, 0.2)
                            }
                          }}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Fade>
                      }
                    >
                      <ListItemAvatar>
                        <Tooltip 
                          title={member.status === "active" ? "Active member" : "Inactive"} 
                          placement="top"
                          arrow
                        >
                          <Avatar
                            sx={{
                              width: 42,
                              height: 42,
                              bgcolor: member.status === "active" 
                                ? alpha(luxuryColors.primary, 0.1) 
                                : alpha(luxuryColors.textSecondary, 0.05),
                              color: member.status === "active" 
                                ? luxuryColors.primary 
                                : luxuryColors.textSecondary,
                              border: member.status === "active" 
                                ? `2px solid ${alpha(luxuryColors.primary, 0.3)}` 
                                : `1px solid ${alpha(luxuryColors.textSecondary, 0.1)}`,
                              fontSize: "1rem",
                              fontWeight: 600,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.1)"
                              }
                            }}
                            src={member.avatarUrl}
                          >
                            {member.avatar || member.name.charAt(0)}
                          </Avatar>
                        </Tooltip>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography 
                            fontWeight="700"
                            color={luxuryColors.textPrimary}
                            sx={{ fontSize: "1rem", letterSpacing: "0.2px" }}
                          >
                            {member.name}
                            {member.isLead && (
                              <Tooltip title="Team Lead">
                                <StarIcon 
                                  sx={{ 
                                    color: luxuryColors.warning, 
                                    ml: 1.5, 
                                    fontSize: "1.2rem",
                                    verticalAlign: "middle"
                                  }} 
                                />
                              </Tooltip>
                            )}
                          </Typography>
                        }
                        secondary={
                          <Box component="span" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <Typography 
                              variant="body2" 
                              color={luxuryColors.textSecondary}
                              sx={{ 
                                mr: 1.5,
                                fontSize: "0.85rem",
                                letterSpacing: "0.1px"
                              }}
                            >
                              {member.role}
                            </Typography>
                            {member.skills?.slice(0, 2).map((skill, i) => (
                              <TechPill
                                key={i}
                                label={skill}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  mr: 1,
                                  bgcolor: "transparent",
                                  borderColor: alpha(luxuryColors.primary, 0.2),
                                  color: luxuryColors.primary,
                                  fontSize: "0.7rem"
                                }}
                              />
                            ))}
                            {member.skills?.length > 2 && (
                              <TechPill
                                label={`+${member.skills.length - 2}`}
                                size="small"
                                sx={{ 
                                  bgcolor: alpha(luxuryColors.primary, 0.05),
                                  color: luxuryColors.primary,
                                  fontSize: "0.7rem"
                                }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </DetailCard>
            </Grow>
          </Grid>
        </Grid>

        {/* Technologies Section */}
        <Box mt={6}>
          <Box display="flex" alignItems="center" mb={4}>
            <Avatar sx={{ 
              bgcolor: alpha(luxuryColors.primary, 0.1),
              color: luxuryColors.primary,
              width: 48,
              height: 48,
              mr: 2,
              border: `2px solid ${alpha(luxuryColors.primary, 0.2)}`
            }}>
              <CodeIcon fontSize="medium" />
            </Avatar>
            <Typography 
              variant="h5" 
              fontWeight="800"
              color={luxuryColors.textPrimary}
              sx={{ letterSpacing: "0.5px" }}
            >
              Technology Stack
            </Typography>
          </Box>
          
          <Box display="flex" flexWrap="wrap" gap={2}>
            {projectData.technologies?.map((tech, index) => (
              <TechPill
                key={index}
                label={tech}
                variant="outlined"
                sx={{
                  borderColor: alpha(luxuryColors.primary, 0.3),
                  color: luxuryColors.primary,
                  "&:hover": {
                    bgcolor: alpha(luxuryColors.primary, 0.1),
                    borderColor: luxuryColors.primary,
                    transform: "translateY(-2px)"
                  }
                }}
              />
            ))}
            
            {projectData.frameworks?.map((framework, index) => (
              <TechPill
                key={`fw-${index}`}
                label={framework}
                sx={{
                  bgcolor: alpha(luxuryColors.secondary, 0.1),
                  color: luxuryColors.secondary,
                  border: `1px solid ${alpha(luxuryColors.secondary, 0.3)}`,
                  "&:hover": {
                    bgcolor: alpha(luxuryColors.secondary, 0.2),
                    transform: "translateY(-2px)"
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Timeline Section */}
        {projectData.timeline && (
          <>
            <Divider sx={{ 
              my: 6, 
              borderColor: alpha(luxuryColors.primary, 0.1),
              borderWidth: "2px" 
            }} />
            <Box>
              <Box display="flex" alignItems="center" mb={4}>
                <Avatar sx={{ 
                  bgcolor: alpha(luxuryColors.accent, 0.1),
                  color: luxuryColors.accent,
                  width: 48,
                  height: 48,
                  mr: 2,
                  border: `2px solid ${alpha(luxuryColors.accent, 0.2)}`
                }}>
                  <TimelineIcon fontSize="medium" />
                </Avatar>
                <Typography 
                  variant="h5" 
                  fontWeight="800"
                  color={luxuryColors.textPrimary}
                  sx={{ letterSpacing: "0.5px" }}
                >
                  Project Milestones
                </Typography>
              </Box>
              <Box display="flex" overflow="auto" py={2} sx={{
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  height: "8px"
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: alpha(luxuryColors.primary, 0.3),
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: luxuryColors.primary
                  }
                }
              }}>
                {projectData.timeline.map((item, index) => (
                  <TimelineItem key={index}>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="800"
                      color={luxuryColors.textPrimary}
                      sx={{ letterSpacing: "0.2px" }}
                    >
                      {item.date}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={luxuryColors.textSecondary}
                      sx={{ mt: 1.5, fontSize: "0.9rem", lineHeight: 1.7 }}
                    >
                      {item.event}
                    </Typography>
                    <Chip 
                      label={item.status} 
                      size="small" 
                      sx={{ 
                        mt: 2,
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        letterSpacing: "0.5px",
                        height: "26px",
                        bgcolor: item.status === "Completed" 
                          ? alpha(luxuryColors.success, 0.1) 
                          : item.status === "Pending" 
                            ? alpha(luxuryColors.warning, 0.1) 
                            : alpha(luxuryColors.info, 0.1),
                        color: item.status === "Completed" 
                          ? luxuryColors.success 
                          : item.status === "Pending" 
                            ? luxuryColors.warning 
                            : luxuryColors.info,
                        border: `1px solid ${item.status === "Completed" 
                          ? alpha(luxuryColors.success, 0.3) 
                          : item.status === "Pending" 
                            ? alpha(luxuryColors.warning, 0.3) 
                            : alpha(luxuryColors.info, 0.3)}`,
                        "&:hover": {
                          transform: "scale(1.05)"
                        }
                      }} 
                    />
                  </TimelineItem>
                ))}
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </LuxuryCard>
  );
}

export default memo(ProjectInfo);