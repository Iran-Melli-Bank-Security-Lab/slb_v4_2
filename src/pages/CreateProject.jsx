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
    Add as AddIcon,
    Remove as RemoveIcon,
    Code as CodeIcon,
    Palette as PaletteIcon,
    Science as ScienceIcon,
    Tag as TagIcon,
    Numbers as NumbersIcon,
    Security as SecurityIcon,
    VerifiedUser as QualityIcon,
    Public as WebIcon,
    PhoneIphone as MobileIcon,
    DesktopWindows as DesktopIcon,
    Memory as HardwareIcon,
    AccountTree as BlockchainIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { createProject } from '../api/projects/createProject';
import { useSocket } from '../context/SocketContext';
import {useSession} from "../SessionContext"
import { useUserId } from '../hooks/useUserId';
const theme = createTheme({
    palette: {
        primary: {
            main: '#2563eb',
            light: '#60a5fa',
            dark: '#1e40af',
        },
        secondary: {
            main: '#0f766e',
            light: '#2dd4bf',
            dark: '#115e59',
        },
        background: {
            default: '#f7f8fb',
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#475569',
        }
    },
    shape: {
        borderRadius: 14,
    },
    typography: {
        fontFamily: '"Manrope", "Segoe UI", sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        subtitle1: {
            fontWeight: 500,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        }
    }
});

const platformColors = {
    web: '#2563eb',
    mobile: '#0ea5e9',
    desktop: '#10b981',
    hardware: '#f59e0b',
    blockchain: '#0f172a'
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
            Swal.fire({
                icon: 'warning',
                title: 'Please review the form',
                text: 'Some required fields are missing or invalid.',
                confirmButtonText: 'Got it',
                confirmButtonColor: theme.palette.primary.main
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
        
            resetForm();
            Swal.fire({
                icon: 'success',
                title: 'Project created',
                text: 'Your project has been created successfully.',
                confirmButtonText: 'Continue',
                confirmButtonColor: theme.palette.primary.main
            });
        } catch (error) {
            console.error('Error creating project:', error);
            Swal.fire({
                icon: 'error',
                title: 'Create failed',
                text: error.message || 'An error occurred while creating the project',
                confirmButtonText: 'Ok',
                confirmButtonColor: theme.palette.primary.main
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: '#f8fafc',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '& fieldset': {
                borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
                borderColor: '#cbd5f5',
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`
            }
        },
        '& .MuiFormHelperText-root': {
            marginLeft: 0
        }
    };

    const sectionSx = {
        p: 3,
        borderRadius: 3,
        bgcolor: '#f8fafc',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.06)'
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
                py: 8,
                px: { xs: 2, sm: 4, md: 6 }
            }}>
                <Container maxWidth="sm" sx={{ position: 'relative' }}>
                    <Paper elevation={0} sx={{
                        p: { xs: 3, sm: 4, md: 5 },
                        borderRadius: 4,
                        background: '#ffffff',
                        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
                        border: '1px solid',
                        borderColor: '#e2e8f0',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 6,
                            background: 'linear-gradient(90deg, #2563eb 0%, #0f766e 100%)'
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
                                    letterSpacing: '0.2px',
                                    background: 'linear-gradient(90deg, #1e40af 0%, #0f766e 100%)',
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
                                            )
                                        }}
                                        sx={textFieldSx}
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
                                            )
                                        }}
                                        sx={textFieldSx}
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
                                            )
                                        }}
                                        sx={textFieldSx}
                                    />
                                </Grid>

                                {/* Project Type Selection */}
                                <Grid item xs={12}>
                                    <Box sx={{
                                        ...sectionSx,
                                        borderColor: errors.projectType ? 'error.main' : 'divider'
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
                                            <FormGroup row sx={{ gap: { xs: 1, sm: 2 } }}>
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
                                                        bgcolor: formData.projectType.security ? alpha(theme.palette.primary.light, 0.12) : '#ffffff',
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
                                                        bgcolor: formData.projectType.quality ? alpha(theme.palette.secondary.light, 0.12) : '#ffffff',
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
                                        ...sectionSx,
                                        borderColor: errors.platform ? 'error.main' : 'divider'
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
                                                                    bgcolor: formData.platform[platform] ? alpha(platformColors[platform], 0.1) : '#ffffff',
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
                                                            bgcolor: formData.platform[platform] ? alpha(platformColors[platform], 0.06) : '#ffffff',
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
                                    <Box sx={sectionSx}>
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
                                                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                                                    color: 'primary.main',
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
                                                    '& .MuiSlider-rail': {
                                                        opacity: 0.25
                                                    }
                                                }}
                                            />

                                            <IconButton
                                                aria-label="increase"
                                                onClick={incrementTests}
                                                disabled={isSubmitting}
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                                                    color: 'primary.main',
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
                                                    ...textFieldSx,
                                                    width: 180,
                                                    '& .MuiOutlinedInput-root': {
                                                        ...textFieldSx['& .MuiOutlinedInput-root'],
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
                                        py: 1.8,
                                        borderRadius: 3,
                                        background: 'primary.main',
                                        boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)',
                                        transition: 'all 0.25s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 14px 26px rgba(37, 99, 235, 0.25)',
                                            background: 'primary.dark',
                                        },
                                        '&:disabled': {
                                            opacity: 0.7,
                                            background: 'primary.main',
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
