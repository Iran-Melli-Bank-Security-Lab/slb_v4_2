import React, { useState, useEffect, useCallback, memo } from 'react';
import { useParams } from 'react-router';
import { getDevopsProject, getUserProjectsByProjectId, submitDevOpsInfo } from '../api/devops/project/getProject';
import { toast } from 'react-toastify';
import { useUserId } from "../hooks/useUserId";

import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  OutlinedInput
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Info as InfoIcon,
  Computer as ComputerIcon,
  PhoneIphone as MobileIcon,
  Web as WebIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const DevOpsInfoForm = () => {
  const { projectId } = useParams();
  const userId = useUserId();

  // State for project data and users
  const [projectData, setProjectData] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPentester, setSelectedPentester] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [environmentType, setEnvironmentType] = useState('OVF');

  const getInitialFormData = () => ({
    project: projectId || '',
    pentester: '',
    platform: 'web',
    platformData: {
      web: {
        environmentType: 'OVF',
        accessInfo: {
          address: '',
          port: '',
          username: '',
          password: ''
        }
      },
      mobile: {
        appFile: '',
        platform: 'android'
      },
      desktop: {
        installerFile: '',
        os: 'windows'
      }
    },
    endpoints: []
  });

  // Form state
  const [formData, setFormData] = useState(getInitialFormData);

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    pentester: false,
    platform: false,
    address: false,
    port: false,
    appFile: false,
    installerFile: false,
    endpoints: false
  });

  // Temporary state for new items
  const [newEndpoint, setNewEndpoint] = useState({
    url: '',
    ip: '',
    credentials: []
  });
  const [newCredential, setNewCredential] = useState({
    username: '',
    password: '',
    description: '' // اضافه کردن فیلد description
  });

  // Memoized fetch function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch project data
      const projectResponse = await getDevopsProject(projectId, userId);
      setProjectData(projectResponse?.devOpsProject);

      // Fetch assigned users
      const usersResponse = await getUserProjectsByProjectId(projectId);
      setAssignedUsers(usersResponse?.projectPentesters || []);

      // Initialize form with project data
      setFormData(prev => ({
        ...prev,
        project: projectResponse?.projectName || projectId,
        version: projectResponse?.version || ''
      }));

    } catch (error) {
      toast.error('Failed to fetch project data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePlatformChange = (e) => {
    setFormData(prev => ({
      ...prev,
      platform: e.target.value
    }));
    setValidationErrors(prev => ({
      ...prev,
      platform: false
    }));
  };

  const handlePentesterSelect = (userId) => {
    setSelectedPentester(userId);
    setFormData(prev => ({
      ...prev,
      pentester: userId
    }));
    setValidationErrors(prev => ({
      ...prev,
      pentester: false
    }));
    setShowForm(true);
  };

  const handleEnvironmentTypeChange = (e) => {
    const newEnvType = e.target.value;
    setEnvironmentType(newEnvType);

    setFormData(prev => ({
      ...prev,
      platform: ['Production', 'Development'].includes(newEnvType) ? 'web' : prev.platform,
      platformData: {
        ...prev.platformData,
        web: {
          ...prev.platformData.web,
          environmentType: newEnvType
        }
      }
    }));
  };


  const handleWebAccessChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      platformData: {
        ...prev.platformData,
        web: {
          ...prev.platformData.web,
          accessInfo: {
            ...prev.platformData.web.accessInfo,
            [field]: value
          }
        }
      }
    }));
    setValidationErrors(prev => ({
      ...prev,
      [field]: false
    }));
  }, []);

  const handleMobileChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      platformData: {
        ...prev.platformData,
        mobile: {
          ...prev.platformData.mobile,
          [field]: value
        }
      }
    }));
    if (field === 'appFile') {
      setValidationErrors(prev => ({
        ...prev,
        appFile: false
      }));
    }
  }, []);

  const handleDesktopChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      platformData: {
        ...prev.platformData,
        desktop: {
          ...prev.platformData.desktop,
          [field]: value
        }
      }
    }));
    if (field === 'installerFile') {
      setValidationErrors(prev => ({
        ...prev,
        installerFile: false
      }));
    }
  }, []);

  const handleFileUpload = useCallback((e, platform) => {
    const file = e.target.files[0];
    if (file) {
      if (platform === 'mobile') {
        handleMobileChange('appFile', file.name);
      } else if (platform === 'desktop') {
        handleDesktopChange('installerFile', file.name);
      }
    }
  }, [handleMobileChange, handleDesktopChange]);

  const addEndpoint = useCallback(() => {
    if (newEndpoint.url) {
      setFormData(prev => ({
        ...prev,
        endpoints: [...prev.endpoints, { ...newEndpoint, ip: newEndpoint.ip }]
      }));

      setNewEndpoint({
        url: '',
        credentials: [],
        ip: ''
      });
      setValidationErrors(prev => ({
        ...prev,
        endpoints: false
      }));
    }
  }, [newEndpoint]);

  const removeEndpoint = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      endpoints: prev.endpoints.filter((_, i) => i !== index)
    }));
  }, []);

  const addCredential = useCallback((endpointIndex) => {
    if (newCredential.username && newCredential.password) {
      setFormData(prev => {
        const updatedEndpoints = [...prev.endpoints];
        updatedEndpoints[endpointIndex] = {
          ...updatedEndpoints[endpointIndex],
          credentials: [
            ...updatedEndpoints[endpointIndex].credentials,
            {
              username: newCredential.username,
              password: newCredential.password,
              description: newCredential.description // اضافه کردن description
            }
          ]
        };
        return {
          ...prev,
          endpoints: updatedEndpoints
        };
      });
      // Reset the new credential fields
      setNewCredential({
        username: '',
        password: '',
        description: ''
      });
    }
  }, [newCredential]);


  const removeCredential = useCallback((endpointIndex, credentialIndex) => {
    setFormData(prev => {
      const updatedEndpoints = [...prev.endpoints];
      updatedEndpoints[endpointIndex].credentials =
        updatedEndpoints[endpointIndex].credentials.filter((_, i) => i !== credentialIndex);
      return {
        ...prev,
        endpoints: updatedEndpoints
      };
    });
  }, []);

  const validateForm = () => {
    const isShared = ['Production', 'Development'].includes(environmentType);

    const errors = {
      pentester: !isShared && !formData.pentester,
      platform: !formData.platform || (isShared && formData.platform !== 'web'),
      address: !isShared && formData.platform === 'web' && !formData.platformData.web.accessInfo.address,
      port: !isShared && formData.platform === 'web' && !formData.platformData.web.accessInfo.port,
      appFile: !isShared && formData.platform === 'mobile' && !formData.platformData.mobile.appFile,
      installerFile: !isShared && formData.platform === 'desktop' && !formData.platformData.desktop.installerFile,
      endpoints: formData.endpoints.length === 0
    };

    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };



  const handleSubmit = async () => {
    const isShared = ['Production', 'Development'].includes(environmentType);

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      const baseData = {
        projectId,
        submittedBy: userId,
        platformType: 'web',
        endpoints: formData.endpoints,
        platformData: {
          web: {
            ...formData.platformData.web,
            environmentType // 👈 مطمئن شو environmentType هم هست
          }
        },
        isShared,
      };

      const submissionData = isShared
        ? baseData
        : {
          ...baseData,
          pentesterId: formData.pentester,
          platformType: formData.platform,
          platformData: formData.platformData
        };

      const response = await submitDevOpsInfo(submissionData);

      if (response.success) {
        toast.success('DevOps information submitted successfully');
        setFormData(getInitialFormData());
        setSelectedPentester(null);
        setShowForm(false);
      } else {
        throw new Error(response.message || 'Failed to submit DevOps information');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit DevOps information');
    } finally {
      setSubmitting(false);
    }
  };




  const handleBackToPentesterSelection = () => {
    setShowForm(false);
    setFormData(getInitialFormData());
    setSelectedPentester(null);
  };





  const renderEnvironmentSelection = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Project Information
      </Typography>

      <Card sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <InfoIcon color="primary" fontSize="large" />
            <Typography variant="h5">{projectData?.projectName}</Typography>
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="textSecondary">Version</Typography>
              <Typography variant="h6">{projectData?.version}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">Letter Number</Typography>
              <Typography variant="h6">{projectData?.letterNumber || 'Not specified'}</Typography>
            </Grid>

          </Grid>
        </CardContent>
      </Card>

      <Grid item xs={12}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="environment-type-label">Environment Type</InputLabel>
          <Select
            labelId="environment-type-label"
            id="environmentType"
            value={environmentType}
            onChange={handleEnvironmentTypeChange}
            label="Environment Type"
            input={<OutlinedInput label="Environment Type" />}
          >
            <MenuItem value="OVF">OVF</MenuItem>
            <MenuItem value="VM">VM</MenuItem>
            <MenuItem value="Docker">Docker</MenuItem>
            <MenuItem value="Production">Production</MenuItem>
            <MenuItem value="Development">Development</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {['OVF', 'VM', 'Docker'].includes(environmentType) && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Select Pentester
          </Typography>

          <Grid container spacing={3}>
            {assignedUsers?.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card
                  variant={selectedPentester === user.pentester._id ? 'outlined' : 'elevation'}
                  sx={{
                    height: '100%',
                    border: selectedPentester === user.pentester._id ? '2px solid' : undefined,
                    borderColor: selectedPentester === user.pentester._id ? 'primary.main' : undefined,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                        <PersonIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{user.pentester.firstName}</Typography>
                        <Typography variant="body2" color="textSecondary">{user.pentester.username}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {user.pentester.lastName || 'No bio provided'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      variant={selectedPentester === user.pentester._id ? 'contained' : 'outlined'}
                      color="primary"
                      startIcon={selectedPentester === user.pentester._id ? <CheckIcon /> : null}
                      onClick={() => handlePentesterSelect(user.pentester._id)}
                      fullWidth
                    >
                      {selectedPentester === user.pentester._id ? 'Selected' : 'Select'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {['Production', 'Development'].includes(environmentType) && (
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(true)}
            fullWidth
            size="large"
          >
            Continue to Endpoints Configuration
          </Button>
        </Box>
      )}
    </Box>
  );

  const renderDevOpsForm = () => {
    const selectedPentesterData = assignedUsers.find(u => u.pentester._id === selectedPentester);
    const isProdDev = ['Production', 'Development'].includes(environmentType);

    return (
      <Box sx={{ p: 3 }}>
        <Card sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <IconButton
                onClick={handleBackToPentesterSelection}
                sx={{ mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>

              {!isProdDev && (
                <>
                  <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h5">{selectedPentesterData?.pentester?.lastName}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {selectedPentesterData?.pentester?.firstName}
                    </Typography>
                  </Box>
                </>
              )}

              {isProdDev && (
                <Box>
                  <Typography variant="h5">Environment: {environmentType}</Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ maxWidth: 800, mx: 'auto' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              {isProdDev ? 'Endpoints Configuration' : 'DevOps Information'}
            </Typography>

            {!isProdDev && (
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  Platform Configuration
                </Typography>
                <FormControl fullWidth margin="normal" required error={validationErrors.platform}>
                  <ToggleButtonGroup
                    color="primary"
                    value={formData.platform}
                    exclusive
                    onChange={handlePlatformChange}
                    fullWidth
                  >
                    <ToggleButton value="web">
                      <WebIcon sx={{ mr: 1 }} />
                      Web
                    </ToggleButton>
                    <ToggleButton value="mobile">
                      <MobileIcon sx={{ mr: 1 }} />
                      Mobile
                    </ToggleButton>
                    <ToggleButton value="desktop">
                      <ComputerIcon sx={{ mr: 1 }} />
                      Desktop
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {validationErrors.platform && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      Platform selection is required
                    </Typography>
                  )}
                </FormControl>

                {formData.platform === 'web' && (
                  <Box mt={3}>
                    <Typography variant="subtitle1">Web Platform Configuration</Typography>
                    <Typography variant="subtitle2" gutterBottom style={{ marginTop: '16px' }}>
                      Access Information eg.OVF,VM,Docker
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Address"
                          value={formData.platformData.web.accessInfo.address}
                          onChange={(e) => handleWebAccessChange('address', e.target.value)}
                          required
                          error={validationErrors.address}
                          helperText={validationErrors.address ? 'Address is required' : ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Port"
                          value={formData.platformData.web.accessInfo.port}
                          onChange={(e) => handleWebAccessChange('port', e.target.value)}
                          required
                          error={validationErrors.port}
                          helperText={validationErrors.port ? 'Port is required' : ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Username"
                          value={formData.platformData.web.accessInfo.username}
                          onChange={(e) => handleWebAccessChange('username', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Password"
                          type="password"
                          value={formData.platformData.web.accessInfo.password}
                          onChange={(e) => handleWebAccessChange('password', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {formData.platform === 'mobile' && (
                  <Box mt={3}>
                    <Typography variant="subtitle1">Mobile Platform Configuration</Typography>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="mobile-platform-label">Platform</InputLabel>
                      <Select
                        labelId="mobile-platform-label"
                        id="mobilePlatform"
                        value={formData.platformData.mobile.platform}
                        onChange={(e) => handleMobileChange('platform', e.target.value)}
                        label="Mobile Platform"
                        input={<OutlinedInput label="Mobile Platform" />}
                      >
                        <MenuItem value="android">Android</MenuItem>
                        <MenuItem value="ios">iOS</MenuItem>
                      </Select>
                    </FormControl>

                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Application File (Required)
                      </Typography>
                      <input
                        accept={formData.platformData.mobile.platform === 'android' ? '.apk' : '.ipa'}
                        style={{ display: 'none' }}
                        id="mobile-app-upload"
                        type="file"
                        onChange={(e) => handleFileUpload(e, 'mobile')}
                        required
                      />
                      <label htmlFor="mobile-app-upload">
                        <Button
                          variant="contained"
                          color="default"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          fullWidth
                        >
                          Upload {formData.platformData.mobile.platform === 'android' ? 'APK' : 'IPA'}
                        </Button>
                      </label>
                      {formData.platformData.mobile.appFile && (
                        <Box mt={1}>
                          <Chip
                            label={formData.platformData.mobile.appFile}
                            onDelete={() => handleMobileChange('appFile', '')}
                            deleteIcon={<DeleteIcon />}
                            variant="outlined"
                          />
                        </Box>
                      )}
                      {validationErrors.appFile && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          Application file is required
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}

                {formData.platform === 'desktop' && (
                  <Box mt={3}>
                    <Typography variant="subtitle1">Desktop Platform Configuration</Typography>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="desktop-os-label">Operating System</InputLabel>
                      <Select
                        labelId="desktop-os-label"
                        id="desktopOS"
                        value={formData.platformData.desktop.os}
                        onChange={(e) => handleDesktopChange('os', e.target.value)}
                        label="Operating System"
                        input={<OutlinedInput label="Operating System" />}
                      >
                        <MenuItem value="windows">Windows</MenuItem>
                        <MenuItem value="macos">macOS</MenuItem>
                        <MenuItem value="linux">Linux</MenuItem>
                      </Select>
                    </FormControl>

                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Installer File (Required)
                      </Typography>
                      <input
                        accept=".exe,.dmg,.deb,.rpm"
                        style={{ display: 'none' }}
                        id="desktop-installer-upload"
                        type="file"
                        onChange={(e) => handleFileUpload(e, 'desktop')}
                        required
                      />
                      <label htmlFor="desktop-installer-upload">
                        <Button
                          variant="contained"
                          color="default"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          fullWidth
                        >
                          Upload Installer
                        </Button>
                      </label>
                      {formData.platformData.desktop.installerFile && (
                        <Box mt={1}>
                          <Chip
                            label={formData.platformData.desktop.installerFile}
                            onDelete={() => handleDesktopChange('installerFile', '')}
                            deleteIcon={<DeleteIcon />}
                            variant="outlined"
                          />
                        </Box>
                      )}
                      {validationErrors.installerFile && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          Installer file is required
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            <Box mb={4}>
              <Typography variant="h6" gutterBottom>
                Endpoints Configuration
              </Typography>
              {validationErrors.endpoints && formData.endpoints.length === 0 && (
                <Typography variant="caption" color="error" gutterBottom>
                  At least one endpoint is required
                </Typography>
              )}

              <Box mb={3}>
                <Typography variant="subtitle1">Add New Endpoint</Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      label="Endpoint URL"
                      value={newEndpoint.url}
                      onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
                      placeholder="https://example.com/api"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="IP Address"
                      value={newEndpoint.ip}
                      onChange={(e) => setNewEndpoint({ ...newEndpoint, ip: e.target.value })}
                      placeholder="192.168.1.1"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={addEndpoint}
                      disabled={!newEndpoint.url}
                      fullWidth
                    >
                      Add Endpoint
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {formData.endpoints.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Configured Endpoints ({formData.endpoints.length})
                  </Typography>
                  {formData.endpoints.map((endpoint, endpointIndex) => (
                    <Accordion key={endpointIndex} defaultExpanded sx={{ mb: 2 }}>
                      <Box sx={{ marginLeft: '-20px' }} display="flex" alignItems="center" width="100%">

                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box display="flex" alignItems="center" width="100%">
                            <Typography sx={{ flexGrow: 1, marginLeft: '20px' }}>{endpoint.url}</Typography>
                            <Typography sx={{ flexGrow: 1 }}>{endpoint.ip}</Typography>

                          </Box>

                        </AccordionSummary>
                        <IconButton
                          edge="center"
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEndpoint(endpointIndex);
                          }}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      <AccordionDetails>
                        <Box width="100%">
                          <Box mb={2}>
                            <Typography variant="subtitle2">
                              Credentials ({endpoint.credentials.length})
                            </Typography>

                            {endpoint.credentials.length > 0 && (
                              <List dense>
                                {endpoint.credentials.map((credential, credentialIndex) => (
                                  <ListItem key={credentialIndex}>
                                    <ListItemText
                                      primary={credential.username}
                                      secondary={
                                        <>
                                          <div>{`Password: ${'•'.repeat(credential.password.length)}`}</div>
                                          {credential.description && <div dir='rtl' >{`توضیحات: ${credential.description}`}</div>}
                                        </>
                                      }
                                    />
                                    <ListItemSecondaryAction>
                                      <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => removeCredential(endpointIndex, credentialIndex)}
                                        color="error"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </Box>

                          <Box mt={2} p={2} border={1} borderColor="divider" borderRadius={4}>
                            <Typography variant="subtitle2" gutterBottom>
                              Add New Credential
                            </Typography>
                            <form onSubmit={(e) => {
                              e.preventDefault();
                              addCredential(endpointIndex);
                            }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Username"
                                    value={newCredential.username}
                                    onChange={(e) => setNewCredential({ ...newCredential, username: e.target.value })}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={newCredential.password}
                                    onChange={(e) => setNewCredential({ ...newCredential, password: e.target.value })}
                                  />
                                </Grid>
                               
<Divider sx={{ my: 2 }} />
                                
                                <Box sx={{mb:2}}>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={2}
                                    value={newCredential.description}
                                    onChange={(e) => setNewCredential({ ...newCredential, description: e.target.value })}
                                    placeholder="Optional description for this credential"
                                    sx={{ direction: "rtl" }}
                                  />
                                </Grid>
                                </Box>
                                <Grid item xs={12}>
                                  <Button
                                    type="submit"
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    disabled={!newCredential.username || !newCredential.password}
                                    fullWidth
                                  >
                                    Add Credential
                                  </Button>
                                </Grid>
                              </Grid>
                            </form>
                          </Box>

                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBackToPentesterSelection}
              sx={{ mr: 2 }}
              disabled={submitting}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : null}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </CardActions>
        </Card>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={80} />
      </Box>
    );
  }

  return (
    <>
      {!showForm && renderEnvironmentSelection()}
      {showForm && renderDevOpsForm()}
    </>
  );
};

export default memo(DevOpsInfoForm);