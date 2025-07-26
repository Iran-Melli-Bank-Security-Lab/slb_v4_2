import React, { useState } from "react";
import {
    Box, Card, Typography, Grid, Divider, Chip, Avatar,
    IconButton, Collapse, Tooltip, Paper, Badge
} from "@mui/material";
import {
    
    Dashboard as DashboardIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    LockOpen as LockOpenIcon, 
      PendingActions as PendingActionsIcon,
        Build as BuildIcon,  
        CheckCircleOutline as CheckCircleOutlineIcon,



    
} from "@mui/icons-material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { useParams } from "react-router";
import { useUserId } from "../../../hooks/useUserId";

// Luxury color palette
const colors = {
    primary: "#4361EE",
    secondary: "#3A0CA3",
    accent: "#7209B7",
    success: "#4CC9F0",
    warning: "#F8961E",
    error: "#F72585",
    dark: "#1A1A2E",
    light: "#F8F9FA"
};

// Styled components
const SectionCard = styled(Paper)(({ theme }) => ({
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: `0 8px 32px ${alpha(colors.dark, 0.08)}`,
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: `0 12px 40px ${alpha(colors.dark, 0.12)}`
    }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(3),
    background: `linear-gradient(135deg, ${alpha(colors.primary, 0.1)} 0%, transparent 100%)`,
    borderBottom: `1px solid ${alpha(colors.primary, 0.1)}`,
    cursor: "pointer",
    "&:hover": {
        background: `linear-gradient(135deg, ${alpha(colors.primary, 0.15)} 0%, transparent 100%)`
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




const ProjcetStates = ({statusComponents }) => {
    const [expandedSections, setExpandedSections] = useState({dashboard: true});
    const {id , projectManager } = useParams()
  const userId = useUserId()
  const theme = useTheme()
    const [hoveredStatus, setHoveredStatus] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('Open'); // Initialize with default status


    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderDashboard = () => {

        return (
            <SectionCard>
                <SectionHeader onClick={() => toggleSection('dashboard')}>
                    <Avatar sx={{
                        bgcolor: alpha(colors.primary, 0.1),
                        color: colors.primary,
                        mr: 2
                    }}>
                        <DashboardIcon />
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                        {/* <Typography variant="h6" fontWeight={700}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)} Platform
                        </Typography> */}
                        <Typography variant="body2" color="textSecondary">
                            Configuration and deployment details
                        </Typography>
                    </Box>
                    <IconButton size="small">
                        {expandedSections.dashboard ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </SectionHeader>

                <Collapse in={expandedSections.dashboard}>
                    <Box sx={{ p: 3 }}>
                      






                    </Box>
                </Collapse>
            </SectionCard>
        );
    };




    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
                PROJECT STATUS DASHBOARD     
             </Typography>

             <SectionCard>
                <SectionHeader onClick={() => toggleSection('dashboard')}>
                    <Avatar sx={{
                        bgcolor: alpha(colors.primary, 0.1),
                        color: colors.primary,
                        mr: 2
                    }}>
                        <DashboardIcon />
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                        {/* <Typography variant="h6" fontWeight={700}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)} Platform
                        </Typography> */}
                        <Typography variant="body2" color="textSecondary">
                            Configuration and deployment details
                        </Typography>
                    </Box>
                    <IconButton size="small">
                        {expandedSections.dashboard ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </SectionHeader>

                <Collapse in={expandedSections.dashboard}>
                    <Box sx={{ p: 3 }}>
                      






                    </Box>
                </Collapse>
            </SectionCard>





        </Box>
    );
};

export default ProjcetStates;