// This is page of create proejct by devops user 
import React , { useState } from 'react';
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
    Chip
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
import {useSession} from "../SessionContext"
import { useUserId } from '../hooks/useUserId';
const theme = createTheme({
    palette: {
        primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
        },
        secondary: {
            main: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
    },
    shape: {
        borderRadius: 12,
    },
});

const platformColors = {
    web: '#3b82f6',
    mobile: '#ec4899',
    desktop: '#10b981',
    hardware: '#f59e0b',
    blockchain: '#8b5cf6'
};

const ProjectForm = () => {
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
    const user = useSession().session
   const userId = useUserId() 

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

        // Check if at least one project type is selected
        const isProjectTypeSelected = formData.projectType.security || formData.projectType.quality;
        
        // Check if at least one platform is selected
        const isPlatformSelected = Object.values(formData.platform).some(val => val);

        // Final validation
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
        const {success , project }=   await createProject(
            userId, 
                formData.projectName.trim(), 
                formData.projectVersion, 
                formData.letterNumber, 
                formData.numberOfTests,
                formData.projectType,
                formData.platform
            );

           
            socket.emit("createProject" , {
                projectId : project._id , 
                devOpsId : user.user.id , 
                projectName : project.projectName
            } )
        
            setSubmitSuccess(true);
            resetForm();

            // Reset success message after 3 seconds
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            console.error('Error creating project:', error);
            setSubmitError(error.message || 'An error occurred while creating the project');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #fae8ff 100%)',
                py: 8,
                px: { xs: 2, sm: 4, md: 6 }
            }}>
                <Container maxWidth="sm" sx={{ position: 'relative' }}>
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
                                Project created successfully!
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

                    <Paper elevation={8} sx={{
                        p: { xs: 3, sm: 4, md: 5 },
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.light, 0.3),
                        position: 'relative',
                        overflow: 'hidden',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 6,
                            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'
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
                                    letterSpacing: '0.5px',
                                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                Create New Project
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
                                Configure your project settings to get started
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
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
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PaletteIcon color={errors.projectName ? 'error' : 'action'} />
                                                </InputAdornment>
                                            ),
                                            sx: {
                                                borderRadius: 3,
                                                bgcolor: 'background.paper'
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        fullWidth
                                        label="Project Version"
                                        name="projectVersion"
                                        value={formData.projectVersion}
                                        onChange={handleChange}
                                        error={errors.projectVersion}
                                        helperText={errors.projectVersion ? 'Must be in format X.X.X' : 'Semantic version (e.g. 1.0.0)'}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <TagIcon color={errors.projectVersion ? 'error' : 'action'} />
                                                </InputAdornment>
                                            ),
                                            sx: {
                                                borderRadius: 3,
                                                bgcolor: 'background.paper'
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Letter Number"
                                        name="letterNumber"
                                        value={formData.letterNumber}
                                        onChange={handleChange}
                                        error={errors.letterNumber}
                                        helperText={errors.letterNumber ? 'Must be digit' : 'e.g. 4244334'}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <NumbersIcon color={errors.letterNumber ? 'error' : 'action'} />
                                                </InputAdornment>
                                            ),
                                            sx: {
                                                borderRadius: 3,
                                                bgcolor: 'background.paper',
                                            }
                                        }}
                                    />
                                </Grid>

                                {/* Project Type Selection */}
                                <Grid item xs={12}>
                                    <Box sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: errors.projectType ? 'error.main' : 'divider',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
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

                                {/* Platform Selection */}
                                <Grid item xs={12}>
                                    <Box sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: errors.platform ? 'error.main' : 'divider',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
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

                                <Grid item xs={12}>
                                    <Box sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <ScienceIcon color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600 }}>
                                                Initial Test Cases
                                            </Typography>
                                            <Tooltip title="Number of test cases to generate initially">
                                                <InfoIcon color="action" sx={{ ml: 1, fontSize: '1rem' }} />
                                            </Tooltip>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <IconButton
                                                aria-label="decrease"
                                                onClick={decrementTests}
                                                disabled={isSubmitting}
                                                sx={{
                                                    bgcolor: 'primary.light',
                                                    color: 'primary.contrastText',
                                                    '&:hover': {
                                                        bgcolor: 'primary.main',
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
                                                }}
                                            />

                                            <IconButton
                                                aria-label="increase"
                                                onClick={incrementTests}
                                                disabled={isSubmitting}
                                                sx={{
                                                    bgcolor: 'primary.light',
                                                    color: 'primary.contrastText',
                                                    '&:hover': {
                                                        bgcolor: 'primary.main',
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
                            </Grid>

                            <Box sx={{ pt: 4 }}>
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
                                        background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                                        boxShadow: '0 4px 6px rgba(99, 102, 241, 0.3)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 12px rgba(99, 102, 241, 0.4)',
                                            background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                                        },
                                        '&:disabled': {
                                            opacity: 0.7,
                                            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                                        }
                                    }}
                                    startIcon={<AddIcon />}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Project'}
                                </Button>
                            </Box>
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
                        Your data is secure and will only be used for project configuration.
                    </Typography>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default ProjectForm;