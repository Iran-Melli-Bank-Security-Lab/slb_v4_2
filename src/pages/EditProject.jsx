// This is page of Edit project by devops user 
import React, { useState } from 'react';
import {
    TextField,
    Button,
    Container,
    Paper,
    Typography,
    Box,
    Slider,
    InputAdornment,
    IconButton,
    Tooltip,
    Alert,
    Fade,
    Grid,
    Avatar,
    FormControlLabel,
    Checkbox,
    FormGroup,
    FormControl,
    FormHelperText,
    Chip,
    LinearProgress
} from '@mui/material';
import {
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Code as CodeIcon,
    Palette as PaletteIcon,
    Science as ScienceIcon,
    Tag as TagIcon,
    Numbers as NumbersIcon,
    Error as ErrorIcon,
    Security as SecurityIcon,
    VerifiedUser as QualityIcon,
    Public as WebIcon,
    PhoneIphone as MobileIcon,
    DesktopWindows as DesktopIcon,
    Memory as HardwareIcon,
    AccountTree as BlockchainIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { createProject } from '../api/projects/createProject';
import { useSocket } from '../context/SocketContext';
import { useSession } from "../SessionContext"
import { useUserId } from '../hooks/useUserId';
import { useParams } from 'react-router';
import { getDevopsProject, updateDevopsProject } from '../api/devops/project/getProject';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
const theme = createTheme({
    palette: {
        primary: {
            main: '#2563eb',
            light: '#60a5fa',
            dark: '#1d4ed8',
        },
        secondary: {
            main: '#0f766e',
            light: '#14b8a6',
            dark: '#0f5f5a',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#475569',
        },
    },
    shape: {
        borderRadius: 14,
    },
    typography: {
        fontFamily: '"Space Grotesk", "Manrope", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        subtitle1: {
            fontWeight: 500,
        },
    },
});

const platformColors = {
    web: '#2563eb',
    mobile: '#e11d48',
    desktop: '#16a34a',
    hardware: '#f59e0b',
    blockchain: '#0ea5e9'
};

const EditProjectForm = () => {

    const { projectId } = useParams();
    const isEditMode = Boolean(projectId);
    const submitLabel = isEditMode ? 'Update Project' : 'Create Project';
    const submitProgressLabel = isEditMode ? 'Updating...' : 'Creating...';

    const sectionCardSx = {
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.92)',
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.14),
        boxShadow: '0 18px 36px rgba(15, 23, 42, 0.08)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 24px 44px rgba(15, 23, 42, 0.12)'
        }
    };

    const sectionHeaderSx = {
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        mb: 2
    };

    const sectionIconSx = {
        width: 40,
        height: 40,
        borderRadius: 3,
        display: 'grid',
        placeItems: 'center',
        background: alpha(theme.palette.primary.main, 0.12),
        color: theme.palette.primary.main,
        boxShadow: '0 8px 16px rgba(37, 99, 235, 0.18)'
    };

    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: 'background.paper',
            boxShadow: '0 10px 18px rgba(15, 23, 42, 0.06)',
            transition: 'all 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.primary.main, 0.4)
            },
            '&.Mui-focused': {
                boxShadow: '0 14px 28px rgba(37, 99, 235, 0.18)'
            }
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.primary.main, 0.18)
        },
        '& .MuiFormHelperText-root': {
            marginLeft: 0
        }
    };

    const overviewPanelSx = {
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.16),
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(14, 165, 233, 0.06))',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)'
    };

    const overviewItemSx = {
        p: 1.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.14),
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 10px 18px rgba(15, 23, 42, 0.06)',
        minHeight: 78
    };

    const [formData, setFormData] = useState({
        projectName: '',
        projectVersion: '1.0.0',
        letterNumber: '',
        numberOfTests: 1,
        projectType: {
            security: true,
            quality: false
        },
        platform: {
            web: true,
            mobile: false,
            desktop: false,
            hardware: false,
            blockchain: false
        }
    });

    const [errors, setErrors] = useState({
        projectName: false,
        projectVersion: false,
        letterNumber: false,
        projectType: false,
        platform: false
    });

    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userId = useUserId()
    const navigate = useNavigate()
    const socket = useSocket();

    const validateVersion = (version) => {
        const versionRegex = /^\d+\.\d+\.\d+$/;
        return versionRegex.test(version);
    };

    const validateLetterNumber = (number) => {
        const numberRegex = /^[0-9]/;
        return numberRegex.test(number);
    };

    const handleProjectTypeChange = (type) => (event) => {
        // If user is trying to uncheck the only selected option, prevent it
        if (type === 'security' && !event.target.checked && !formData.projectType.quality) return;
        if (type === 'quality' && !event.target.checked && !formData.projectType.security) return;

        setFormData(prev => ({
            ...prev,
            projectType: {
                ...prev.projectType,
                [type]: event.target.checked
            }
        }));

        // Clear any project type error when user makes a selection
        if (errors.projectType) {
            setErrors(prev => ({
                ...prev,
                projectType: false
            }));
        }
    };

    const handlePlatformChange = (platform) => (event) => {
        // If user is trying to uncheck the only selected option, prevent it
        const selectedPlatforms = Object.values(formData.platform).filter(val => val).length;
        if (!event.target.checked && selectedPlatforms === 1) return;

        setFormData(prev => ({
            ...prev,
            platform: {
                ...prev.platform,
                [platform]: event.target.checked
            }
        }));

        // Clear any platform error when user makes a selection
        if (errors.platform) {
            setErrors(prev => ({
                ...prev,
                platform: false
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'letterNumber' ? value.replace(/[^0-9]/g, '') : value
        }));

        // Clear any submit errors when user starts typing
        if (submitError) setSubmitError(null);

        // Validation
        if (name === 'projectName') {
            setErrors(prev => ({
                ...prev,
                projectName: value.trim() === ''
            }));
        }

        if (name === 'projectVersion') {
            setErrors(prev => ({
                ...prev,
                projectVersion: !validateVersion(value)
            }));
        }

        if (name === 'letterNumber') {
            setErrors(prev => ({
                ...prev,
                letterNumber: !validateLetterNumber(value)
            }));
        }
    };

    const handleSliderChange = (e, newValue) => {
        setFormData(prev => ({
            ...prev,
            numberOfTests: newValue
        }));
    };

    const handleInputChange = (e) => {
        const value = e.target.value === '' ? 0 : Number(e.target.value);
        setFormData(prev => ({
            ...prev,
            numberOfTests: Math.min(100, Math.max(1, value))
        }));
    };

    const handleBlur = () => {
        if (formData.numberOfTests < 1) {
            setFormData(prev => ({
                ...prev,
                numberOfTests: 1
            }));
        } else if (formData.numberOfTests > 100) {
            setFormData(prev => ({
                ...prev,
                numberOfTests: 100
            }));
        }
    };

    const incrementTests = () => {
        setFormData(prev => ({
            ...prev,
            numberOfTests: Math.min(100, prev.numberOfTests + 1)
        }));
    };

    const decrementTests = () => {
        setFormData(prev => ({
            ...prev,
            numberOfTests: Math.max(1, prev.numberOfTests - 1)
        }));
    };

    const resetForm = () => {
        setFormData({
            projectName: '',
            projectVersion: '',
            letterNumber: '',
            numberOfTests: 1,
            projectType: {
                security: true,
                quality: false
            },
            platform: {
                web: true,
                mobile: false,
                desktop: false,
                hardware: false,
                blockchain: false
            }
        });
        setErrors({
            projectName: false,
            projectVersion: false,
            letterNumber: false,
            projectType: false,
            platform: false
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        // Validation
        const isProjectTypeSelected = formData.projectType.security || formData.projectType.quality;
        const isPlatformSelected = Object.values(formData.platform).some(val => val);

        const hasErrors =
            formData.projectName.trim() === '' ||
            !validateVersion(formData.projectVersion) ||
            !validateLetterNumber(formData.letterNumber) ||
            !isProjectTypeSelected ||
            !isPlatformSelected;

        if (hasErrors) {
            setErrors({
                projectName: formData.projectName.trim() === '',
                projectVersion: !validateVersion(formData.projectVersion),
                letterNumber: !validateLetterNumber(formData.letterNumber),
                projectType: !isProjectTypeSelected,
                platform: !isPlatformSelected
            });
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare project type array
            const projectTypeArray = [];
            if (formData.projectType.security) projectTypeArray.push("Security");
            if (formData.projectType.quality) projectTypeArray.push("Quality");

            // Prepare platform array
            const platformArray = Object.entries(formData.platform)
                .filter(([_, value]) => value)
                .map(([key]) => key);

            if (projectId) {
                // Update existing project
                const updateData = {
                    projectName: formData.projectName.trim(),
                    version: formData.projectVersion, // Note: field is called "version" in the API
                    letterNumber: formData.letterNumber,
                    numberOfTest: formData.numberOfTests, // Note: field is called "numberOfTest" in the API
                    projectType: projectTypeArray,
                    platform: platformArray
                };

                // Call your update API here
                const result = await updateDevopsProject(projectId, userId, updateData);
                console.log("Would update project with:", updateData);

                toast.success("Project updated successfully!", {
                    position: "bottom-right",
                    autoClose: 1000,
                    onClose: () => navigate('/devops') // Navigate after toast closes

                })

                // Optionally navigate back or refresh data
                // navigate('/projects');
            } else {
                // Create new project
                const { success, project } = await createProject(
                    userId,
                    formData.projectName.trim(),
                    formData.projectVersion,
                    formData.letterNumber,
                    formData.numberOfTests,
                    projectTypeArray,
                    platformArray
                );

                // socket.emit("createProject", {
                //     projectId: project._id,
                //     devOpsId: user.user.id,
                //     projectName: project.projectName
                // });

                setSubmitSuccess(true);
                resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
            setSubmitError(error.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };


    React.useEffect(() => {
        async function fetchProject() {
            try {
                const result = await getDevopsProject(projectId, userId);
                console.log("Fetched project data:", result);

                if (result && result.devOpsProject) {
                    const project = result.devOpsProject;
                    setFormData({
                        projectName: project.projectName || '',
                        projectVersion: project.version || '1.0.0', // Note: field is called "version" in the data
                        letterNumber: project.letterNumber || '',
                        numberOfTests: project.numberOfTest || 1,
                        projectType: {
                            security: project.projectType.includes("Security"),
                            quality: project.projectType.includes("Quality")
                        },
                        platform: {
                            web: project.platform.includes("web"),
                            mobile: project.platform.includes("mobile"),
                            desktop: project.platform.includes("desktop"),
                            hardware: project.platform.includes("hardware"),
                            blockchain: project.platform.includes("blockchain")
                        }
                    });
                }
            } catch (error) {
                console.error("Failed to fetch project:", error);
                toast.error("Failed to load project data");
            }
        }

        if (projectId) {
            fetchProject();
        }
    }, [projectId, userId]);

    const selectedProjectTypes = Object.entries(formData.projectType)
        .filter(([_, value]) => value)
        .map(([key]) => (key === 'security' ? 'Security' : 'Quality'));

    const selectedPlatforms = Object.entries(formData.platform)
        .filter(([_, value]) => value)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

    const completionSteps = [
        formData.projectName.trim() !== '',
        validateVersion(formData.projectVersion),
        validateLetterNumber(formData.letterNumber),
        selectedProjectTypes.length > 0,
        selectedPlatforms.length > 0
    ];
    const completionPercent = Math.round((completionSteps.filter(Boolean).length / completionSteps.length) * 100);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                minHeight: '100vh',
                background: 'radial-gradient(1200px circle at 90% -10%, rgba(37, 99, 235, 0.12), transparent 60%), radial-gradient(900px circle at 10% 10%, rgba(14, 165, 233, 0.12), transparent 55%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 60%, #f8fafc 100%)',
                py: { xs: 5, md: 8 },
                px: { xs: 2, sm: 4, md: 6 },
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    width: 320,
                    height: 320,
                    right: -80,
                    bottom: -120,
                    background: 'radial-gradient(circle, rgba(15, 118, 110, 0.18), transparent 70%)',
                    filter: 'blur(6px)',
                    pointerEvents: 'none',
                    zIndex: 0
                },
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                    opacity: 0.4,
                    pointerEvents: 'none',
                    zIndex: 0
                }
            }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Success Alert */}
                    <Fade in={submitSuccess}>
                        <Box sx={{
                            mb: 4,
                            position: 'absolute',
                            top: -60,
                            left: 0,
                            right: 0,
                            zIndex: 1
                        }}>
                            <Alert
                                icon={<CheckCircleIcon fontSize="inherit" />}
                                severity="success"
                                onClose={() => setSubmitSuccess(false)}
                                sx={{
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    borderLeft: '4px solid',
                                    borderColor: 'success.main'
                                }}
                            >
                                {isEditMode ? 'Project updated successfully!' : 'Project created successfully!'}
                            </Alert>
                        </Box>
                    </Fade>

                    {/* Error Alert */}
                    <Fade in={!!submitError}>
                        <Box sx={{
                            mb: 4,
                            position: 'absolute',
                            top: -60,
                            left: 0,
                            right: 0,
                            zIndex: 1
                        }}>
                            <Alert
                                icon={<ErrorIcon fontSize="inherit" />}
                                severity="error"
                                onClose={() => setSubmitError(null)}
                                sx={{
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    borderLeft: '4px solid',
                                    borderColor: 'error.main'
                                }}
                            >
                                {submitError}
                            </Alert>
                        </Box>
                    </Fade>

                    <Paper elevation={0} sx={{
                        p: { xs: 3, sm: 4, md: 5 },
                        borderRadius: 5,
                        background: 'rgba(255, 255, 255, 0.96)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.16),
                        boxShadow: '0 24px 60px rgba(2, 6, 23, 0.12)',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: 'rise 0.6s ease both',
                        '@keyframes rise': {
                            from: { opacity: 0, transform: 'translateY(14px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 6,
                            background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)'
                        }
                    }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Avatar sx={{
                                width: 64,
                                height: 64,
                                bgcolor: 'primary.main',
                                margin: '0 auto 16px',
                                boxShadow: 2,
                                color: 'white'
                            }}>
                                <CodeIcon fontSize="large" />
                            </Avatar>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    letterSpacing: '-0.02em',
                                    background: 'linear-gradient(90deg, #1d4ed8 0%, #0ea5e9 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                {isEditMode ? 'Edit Project' : 'Create New Project'}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                sx={{
                                    opacity: 0.8,
                                    maxWidth: '80%',
                                    mx: 'auto'
                                }}
                            >
                                {isEditMode
                                    ? 'Refine the project details and keep everything up to date.'
                                    : 'Configure your project settings to get started.'}
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={overviewPanelSx}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                                            <Box>
                                                <Typography
                                                    variant="overline"
                                                    sx={{
                                                        letterSpacing: '0.26em',
                                                        fontWeight: 700,
                                                        color: 'text.secondary'
                                                    }}
                                                >
                                                    Project Overview
                                                </Typography>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                    Live project snapshot
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={`${completionPercent}% complete`}
                                                size="small"
                                                sx={{
                                                    borderRadius: 999,
                                                    fontWeight: 700,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.16),
                                                    color: 'primary.main'
                                                }}
                                            />
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={completionPercent}
                                            sx={{
                                                mt: 1.5,
                                                height: 8,
                                                borderRadius: 999,
                                                bgcolor: alpha(theme.palette.primary.main, 0.12),
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 999,
                                                    background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)'
                                                }
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                mt: 2,
                                                display: 'grid',
                                                gap: 1.5,
                                                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }
                                            }}
                                        >
                                            <Box sx={overviewItemSx}>
                                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                                    Name
                                                </Typography>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        mt: 0.5,
                                                        fontWeight: 700,
                                                        color: 'text.primary',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {formData.projectName || 'Untitled project'}
                                                </Typography>
                                            </Box>
                                            <Box sx={overviewItemSx}>
                                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                                    Version
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ mt: 0.5, fontWeight: 700 }}>
                                                    {formData.projectVersion || '—'}
                                                </Typography>
                                            </Box>
                                            <Box sx={overviewItemSx}>
                                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                                    Letter #
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ mt: 0.5, fontWeight: 700 }}>
                                                    {formData.letterNumber || 'Not set'}
                                                </Typography>
                                            </Box>
                                            <Box sx={overviewItemSx}>
                                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                                    Test Cases
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ mt: 0.5, fontWeight: 700 }}>
                                                    {formData.numberOfTests}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{
                                                mt: 2.5,
                                                display: 'grid',
                                                gap: 2,
                                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                                    Project Type
                                                </Typography>
                                                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    {selectedProjectTypes.length ? selectedProjectTypes.map((type) => (
                                                        <Chip
                                                            key={type}
                                                            label={type}
                                                            size="small"
                                                            sx={{
                                                                borderRadius: 999,
                                                                fontWeight: 600,
                                                                bgcolor: alpha(type === 'Security' ? theme.palette.primary.main : theme.palette.secondary.main, 0.16),
                                                                color: type === 'Security' ? theme.palette.primary.main : theme.palette.secondary.main
                                                            }}
                                                        />
                                                    )) : (
                                                        <Chip label="Select type" size="small" variant="outlined" />
                                                    )}
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                                    Platforms
                                                </Typography>
                                                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    {selectedPlatforms.length ? selectedPlatforms.map((platform) => {
                                                        const platformKey = platform.toLowerCase();
                                                        const platformColor = platformColors[platformKey] || theme.palette.primary.main;
                                                        return (
                                                            <Chip
                                                                key={platform}
                                                                label={platform}
                                                                size="small"
                                                                sx={{
                                                                    borderRadius: 999,
                                                                    fontWeight: 600,
                                                                    bgcolor: alpha(platformColor, 0.16),
                                                                    color: platformColor
                                                                }}
                                                            />
                                                        );
                                                    }) : (
                                                        <Chip label="Select platforms" size="small" variant="outlined" />
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={sectionCardSx}>
                                        <Box sx={sectionHeaderSx}>
                                            <Box sx={sectionIconSx}>
                                                <PaletteIcon fontSize="small" />
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                    Project Basics
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Name, version, and identifiers used across teams.
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Project Name"
                                                    name="projectName"
                                                    value={formData.projectName}
                                                    onChange={handleChange}
                                                    error={errors.projectName}
                                                    helperText={errors.projectName ? 'Project name is required' : 'Give your project a descriptive name'}
                                                    variant="outlined"
                                                    sx={textFieldSx}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PaletteIcon color={errors.projectName ? 'error' : 'action'} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={8}>
                                                <TextField
                                                    fullWidth
                                                    label="Project Version"
                                                    name="projectVersion"
                                                    value={formData.projectVersion}
                                                    onChange={handleChange}
                                                    error={errors.projectVersion}
                                                    helperText={errors.projectVersion ? 'Must be in format X.X.X' : 'Semantic version (e.g. 1.0.0)'}
                                                    variant="outlined"
                                                    sx={textFieldSx}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <TagIcon color={errors.projectVersion ? 'error' : 'action'} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Letter Number"
                                                    name="letterNumber"
                                                    value={formData.letterNumber}
                                                    onChange={handleChange}
                                                    error={errors.letterNumber}
                                                    helperText={errors.letterNumber ? 'Must be digit' : 'e.g. 4244334'}
                                                    variant="outlined"
                                                    sx={textFieldSx}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <NumbersIcon color={errors.letterNumber ? 'error' : 'action'} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                {/* Classification */}
                                <Grid item xs={12}>
                                    <Box sx={sectionCardSx}>
                                        <Box sx={sectionHeaderSx}>
                                            <Box sx={sectionIconSx}>
                                                <SecurityIcon fontSize="small" />
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                    Classification
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Choose the audit type and platforms in scope.
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{
                                                    p: 2.5,
                                                    borderRadius: 3,
                                                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                                                    border: '1px solid',
                                                    borderColor: errors.projectType ? 'error.main' : alpha(theme.palette.primary.main, 0.12),
                                                    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)'
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <SecurityIcon color={errors.projectType ? 'error' : 'primary'} sx={{ mr: 1 }} />
                                                        <Typography variant="subtitle2" color={errors.projectType ? 'error' : 'text.primary'} sx={{ fontWeight: 600 }}>
                                                            Project Type
                                                        </Typography>
                                                        <Tooltip title="Select at least one project type">
                                                            <InfoIcon color={errors.projectType ? 'error' : 'action'} sx={{ ml: 1, fontSize: '1rem' }} />
                                                        </Tooltip>
                                                    </Box>

                                                    <FormControl error={errors.projectType} component="fieldset" variant="standard">
                                                        <FormGroup row sx={{ gap: { xs: 1, sm: 3 } }}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={formData.projectType.security}
                                                                        onChange={handleProjectTypeChange('security')}
                                                                        icon={<SecurityIcon />}
                                                                        checkedIcon={<SecurityIcon color="primary" />}
                                                                        name="Security"
                                                                        sx={{
                                                                            '& .MuiSvgIcon-root': {
                                                                                fontSize: 24
                                                                            }
                                                                        }}
                                                                    />
                                                                }
                                                                label={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <SecurityIcon color={formData.projectType.security ? 'primary' : 'action'} sx={{ mr: 1 }} />
                                                                        <Typography variant="body1" color={formData.projectType.security ? 'primary' : 'text.primary'}>
                                                                            Security
                                                                        </Typography>
                                                                    </Box>
                                                                }
                                                                sx={{
                                                                    p: 2,
                                                                    borderRadius: 2,
                                                                    border: '1px solid',
                                                                    borderColor: formData.projectType.security ? 'primary.main' : 'divider',
                                                                    bgcolor: formData.projectType.security ? alpha(theme.palette.primary.light, 0.1) : 'background.paper',
                                                                    transition: 'all 0.2s ease',
                                                                    '&:hover': {
                                                                        borderColor: formData.projectType.security ? 'primary.dark' : 'text.secondary'
                                                                    }
                                                                }}
                                                            />

                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={formData.projectType.quality}
                                                                        onChange={handleProjectTypeChange('quality')}
                                                                        icon={<QualityIcon />}
                                                                        checkedIcon={<QualityIcon color="secondary" />}
                                                                        name="Quality"
                                                                        sx={{
                                                                            '& .MuiSvgIcon-root': {
                                                                                fontSize: 24
                                                                            }
                                                                        }}
                                                                    />
                                                                }
                                                                label={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <QualityIcon color={formData.projectType.quality ? 'secondary' : 'action'} sx={{ mr: 1 }} />
                                                                        <Typography variant="body1" color={formData.projectType.quality ? 'secondary' : 'text.primary'}>
                                                                            Quality
                                                                        </Typography>
                                                                    </Box>
                                                                }
                                                                sx={{
                                                                    p: 2,
                                                                    borderRadius: 2,
                                                                    border: '1px solid',
                                                                    borderColor: formData.projectType.quality ? 'secondary.main' : 'divider',
                                                                    bgcolor: formData.projectType.quality ? alpha(theme.palette.secondary.light, 0.1) : 'background.paper',
                                                                    transition: 'all 0.2s ease',
                                                                    '&:hover': {
                                                                        borderColor: formData.projectType.quality ? 'secondary.dark' : 'text.secondary'
                                                                    }
                                                                }}
                                                            />
                                                        </FormGroup>
                                                        {errors.projectType && (
                                                            <FormHelperText sx={{ ml: 0, mt: 1 }}>
                                                                Please select at least one project type
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Box sx={{
                                                    p: 2.5,
                                                    borderRadius: 3,
                                                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                                                    border: '1px solid',
                                                    borderColor: errors.platform ? 'error.main' : alpha(theme.palette.primary.main, 0.12),
                                                    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)'
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <WebIcon color={errors.platform ? 'error' : 'primary'} sx={{ mr: 1 }} />
                                                        <Typography variant="subtitle2" color={errors.platform ? 'error' : 'text.primary'} sx={{ fontWeight: 600 }}>
                                                            Platform
                                                        </Typography>
                                                        <Tooltip title="Select at least one platform">
                                                            <InfoIcon color={errors.platform ? 'error' : 'action'} sx={{ ml: 1, fontSize: '1rem' }} />
                                                        </Tooltip>
                                                    </Box>

                                                    <FormControl error={errors.platform} component="fieldset" variant="standard">
                                                        <FormGroup row sx={{ gap: 2, flexWrap: 'wrap' }}>
                                                            {Object.entries({
                                                                web: { icon: <WebIcon />, label: 'Web' },
                                                                mobile: { icon: <MobileIcon />, label: 'Mobile' },
                                                                desktop: { icon: <DesktopIcon />, label: 'Desktop' },
                                                                hardware: { icon: <HardwareIcon />, label: 'Hardware' },
                                                                blockchain: { icon: <BlockchainIcon />, label: 'Blockchain' }
                                                            }).map(([platform, { icon, label }]) => (
                                                                <FormControlLabel
                                                                    key={platform}
                                                                    control={
                                                                        <Checkbox
                                                                            checked={formData.platform[platform]}
                                                                            onChange={handlePlatformChange(platform)}
                                                                            icon={React.cloneElement(icon, {
                                                                                style: { color: formData.platform[platform] ? platformColors[platform] : undefined }
                                                                            })}
                                                                            checkedIcon={React.cloneElement(icon, {
                                                                                style: { color: platformColors[platform] }
                                                                            })}
                                                                            name={platform}
                                                                            sx={{
                                                                                '& .MuiSvgIcon-root': {
                                                                                    fontSize: 24
                                                                                }
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={
                                                                        <Chip
                                                                            label={label}
                                                                            sx={{
                                                                                ml: 1,
                                                                                bgcolor: formData.platform[platform] ? alpha(platformColors[platform], 0.1) : 'transparent',
                                                                                color: formData.platform[platform] ? platformColors[platform] : 'text.primary',
                                                                                border: '1px solid',
                                                                                borderColor: formData.platform[platform] ? platformColors[platform] : 'divider',
                                                                                transition: 'all 0.2s ease'
                                                                            }}
                                                                            size="small"
                                                                        />
                                                                    }
                                                                    sx={{
                                                                        m: 0,
                                                                        p: 1,
                                                                        borderRadius: 2,
                                                                        border: '1px solid',
                                                                        borderColor: formData.platform[platform] ? platformColors[platform] : 'divider',
                                                                        bgcolor: formData.platform[platform] ? alpha(platformColors[platform], 0.05) : 'background.paper',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            borderColor: formData.platform[platform] ? platformColors[platform] : 'text.secondary',
                                                                            bgcolor: formData.platform[platform] ? alpha(platformColors[platform], 0.1) : alpha('#000', 0.03)
                                                                        }
                                                                    }}
                                                                />
                                                            ))}
                                                        </FormGroup>
                                                        {errors.platform && (
                                                            <FormHelperText sx={{ ml: 0, mt: 1 }}>
                                                                Please select at least one platform
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={sectionCardSx}>
                                        <Box sx={sectionHeaderSx}>
                                            <Box sx={sectionIconSx}>
                                                <ScienceIcon fontSize="small" />
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                    Testing Setup
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Define how many test cases to generate initially.
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                                            <IconButton
                                                aria-label="decrease"
                                                onClick={decrementTests}
                                                disabled={isSubmitting}
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                                                    color: 'primary.main',
                                                    border: '1px solid',
                                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                    }
                                                }}
                                            >
                                                <RemoveIcon />
                                            </IconButton>

                                            <Slider
                                                value={formData.numberOfTests}
                                                onChange={handleSliderChange}
                                                aria-labelledby="input-slider"
                                                min={1}
                                                max={100}
                                                disabled={isSubmitting}
                                                sx={{
                                                    flexGrow: 1,
                                                    color: 'primary.main',
                                                    minWidth: { xs: '100%', md: 280 }
                                                }}
                                            />

                                            <IconButton
                                                aria-label="increase"
                                                onClick={incrementTests}
                                                disabled={isSubmitting}
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                                                    color: 'primary.main',
                                                    border: '1px solid',
                                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                    }
                                                }}
                                            >
                                                <AddIcon />
                                            </IconButton>

                                            <TextField
                                                value={formData.numberOfTests}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                type="number"
                                                disabled={isSubmitting}
                                                inputProps={{
                                                    min: 1,
                                                    max: 100,
                                                    'aria-labelledby': 'input-slider',
                                                    style: {
                                                        fontSize: '1rem',
                                                        padding: '12px 14px',
                                                        textAlign: 'center'
                                                    }
                                                }}
                                                sx={{
                                                    width: 180,
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 3,
                                                        fontSize: '1rem',
                                                        height: '48px'
                                                    }
                                                }}
                                                variant="outlined"
                                            />
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ pt: 1 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            size="large"
                                            disabled={isSubmitting}
                                            sx={{
                                                py: 2,
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)',
                                                boxShadow: '0 10px 24px rgba(37, 99, 235, 0.25)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 12px 28px rgba(37, 99, 235, 0.3)',
                                                    background: 'linear-gradient(90deg, #1d4ed8 0%, #0284c7 100%)',
                                                },
                                                '&:disabled': {
                                                    opacity: 0.7,
                                                    background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)',
                                                }
                                            }}
                                            startIcon={isEditMode ? <CheckCircleIcon /> : <AddIcon />}
                                        >
                                            {isSubmitting ? submitProgressLabel : submitLabel}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                    sx={{
                        mt: 4,
                        opacity: 0.7
                    }}
                >
                        Your updates are saved securely and applied to this project.
                    </Typography>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default EditProjectForm;
