import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getDevopsProject, getUserProjectsByProjectId,
 } from '../api/devops/project/getProject';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Avatar,
  Box,
  Tabs,
  Tab,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  CircularProgress,
  Switch,
  FormControlLabel,
  FormGroup,
  FormHelperText
} from '@mui/material';
import { useUserId } from "../hooks/useUserId";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TerminalIcon from '@mui/icons-material/Terminal';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SettingsIcon from '@mui/icons-material/Settings';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';
import DnsIcon from '@mui/icons-material/Dns';
import HttpIcon from '@mui/icons-material/Http';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArchiveIcon from '@mui/icons-material/Archive';

const statusIcons = {
  pending: <AccessTimeIcon color="warning" />,
  initializing: <CircularProgress size={20} />,
  active: <CheckCircleOutlineIcon color="success" />,
  failed: <ErrorOutlineIcon color="error" />,
  archived: <ArchiveIcon color="action" />
};

const DevOpsInfoForm = () => {
  const { projectId } = useParams();
  const [projectInfo, setProjectInfo] = useState(null);
  const [pentesters, setPentesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useUserId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const projectRes = await getDevopsProject(projectId, userId);
        const userProjectRes = await getUserProjectsByProjectId(projectId);
        setProjectInfo(projectRes?.devOpsProject);
        setPentesters(userProjectRes?.projectPentesters?.map(up => up.pentester) || []);
      } catch (err) {
        toast.error("Failed to load project or pentester info");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
      <CircularProgress size={60} />
    </Box>
  );

  if (!projectInfo) return (
    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', my: 4 }}>
      <Typography variant="h6" color="error">Failed to load project information</Typography>
    </Paper>
  );

  return (
    <Card sx={{ 
      p: 4, 
      my: 4, 
      borderRadius: 3,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
      background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ 
            width: 64, 
            height: 64, 
            mr: 3,
            bgcolor: 'primary.main',
            fontSize: '1.75rem',
            fontWeight: 'bold',
            boxShadow: 2
          }}>
            {projectInfo.projectName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {projectInfo.name}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip 
                label={projectInfo.projectType} 
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={projectInfo.platform} 
                color="secondary"
                sx={{ fontWeight: 600, color: 'white' }}
              />
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Pentester Environments
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Configure individual testing environments for each pentester
        </Typography>

        {pentesters.length === 0 ? (
          <Paper elevation={0} sx={{ 
            p: 4, 
            textAlign: 'center', 
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: 2
          }}>
            <Typography variant="body1" color="text.secondary">
              No pentesters assigned to this project yet
            </Typography>
          </Paper>
        ) : (
          pentesters.map((user) => (
            <PentesterDevOpsForm
              key={user._id}
              user={user}
              projectId={projectId}
              platform={projectInfo.platform}
              projectType={projectInfo.projectType}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

const PentesterDevOpsForm = ({ user, projectId, platform, projectType }) => {
  const [formData, setFormData] = useState({
    envType: 'docker',
    envImage: '',
    platform: platform,
    platformData: {
      browserTargets: [],
      webServerURL: '',
      endpoints: [],
      appFile: '',
      emulatorImage: '',
      installerFile: '',
      nodeInfo: '',
      smartContracts: [],
      network: ''
    },
    config: { 
      cpu: '', 
      ram: '', 
      storage: '', 
      os: '' 
    },
    runtimeAccess: {
      address: '',
      port: '',
      protocol: 'ssh',
      username: '',
      password: '',
      sshKeyReference: '',
      startupScript: '',
      environmentVars: {},
      internalIP: '',
      volumeMountPath: '',
      osPlatform: ''
    },
    accessCredentials: { 
      username: '', 
      password: '', 
      notes: '' 
    },
    status: 'pending',
    logs: ''
  });

  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [expanded, setExpanded] = useState('panel1');
  const [newEndpoint, setNewEndpoint] = useState({
    url: '',
    method: 'GET',
    description: '',
    credentials: {
      username: '',
      password: '',
      token: '',
      notes: ''
    }
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const path = name.split('.');
    
    if (path.length === 1) {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => {
        const updated = { ...prev };
        let obj = updated;
        for (let i = 0; i < path.length - 1; i++) {
          if (!obj[path[i]]) obj[path[i]] = {};
          obj = obj[path[i]];
        }
        obj[path[path.length - 1]] = value;
        return updated;
      });
    }
  };

  const handleEndpointChange = (e) => {
    const { name, value } = e.target;
    const path = name.split('.');
    
    if (path[0] === 'credentials') {
      setNewEndpoint(prev => ({
        ...prev,
        credentials: {
          ...prev.credentials,
          [path[1]]: value
        }
      }));
    } else {
      setNewEndpoint(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addEndpoint = () => {
    if (!newEndpoint.url) return;
    
    setFormData(prev => ({
      ...prev,
      platformData: {
        ...prev.platformData,
        endpoints: [...(prev.platformData.endpoints || []), newEndpoint]
      }
    }));
    
    setNewEndpoint({
      url: '',
      method: 'GET',
      description: '',
      credentials: {
        username: '',
        password: '',
        token: '',
        notes: ''
      }
    });
  };

  const removeEndpoint = (index) => {
    setFormData(prev => ({
      ...prev,
      platformData: {
        ...prev.platformData,
        endpoints: prev.platformData.endpoints.filter((_, i) => i !== index)
      }
    }));
  };

  const handleEnvironmentVarChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      runtimeAccess: {
        ...prev.runtimeAccess,
        environmentVars: {
          ...prev.runtimeAccess.environmentVars,
          [key]: value
        }
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        project: projectId,
        pentester: user._id,
        platform
      };
      // await createDevOpsInfo(payload);
      toast.success(`Environment configuration saved for ${user.fullName || user.email}`);
    } catch (err) {
      toast.error(`Error saving configuration for ${user.fullName || user.email}`);
    }
  };

  const renderTextField = (label, name, type = 'text', icon = null, adornment = null, multiline = false) => (
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label={label}
        name={name}
        type={type === 'password' && !showPassword ? 'password' : type}
        value={name.split('.').reduce((o, i) => (o ? o[i] : ''), formData)}
        onChange={handleChange}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">
              {icon}
            </InputAdornment>
          ) : null,
          endAdornment: adornment,
        }}
        multiline={multiline}
        rows={multiline ? 3 : undefined}
      />
    </Grid>
  );

  const renderPasswordField = (label, name) => (
    renderTextField(
      label,
      name,
      'password',
      <VpnKeyIcon fontSize="small" color="action" />,
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setShowPassword(!showPassword)}
          edge="end"
          size="small"
        >
          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </IconButton>
      </InputAdornment>
    )
  );

  const renderSelectField = (label, name, options) => (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          label={label}
          name={name}
          value={name.split('.').reduce((o, i) => (o ? o[i] : ''), formData)}
          onChange={handleChange}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );

  const renderEnvironmentVars = () => {
    const vars = formData.runtimeAccess.environmentVars || {};
    const keys = Object.keys(vars);
    
    return (
      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Environment Variables
        </Typography>
        {keys.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No environment variables configured
          </Typography>
        ) : (
          <List dense sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 1 }}>
            {keys.map((key) => (
              <ListItem key={key} sx={{ py: 0.5 }}>
                <ListItemText 
                  primary={`${key}=${vars[key]}`} 
                  primaryTypographyProps={{ fontFamily: 'monospace' }}
                />
                <IconButton size="small" onClick={() => handleEnvironmentVarChange(key, '')}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
        <Box mt={1} display="flex" alignItems="center">
          <TextField
            size="small"
            placeholder="KEY=VALUE"
            sx={{ flexGrow: 1, mr: 1 }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.includes('=')) {
                const [key, value] = e.target.value.split('=');
                handleEnvironmentVarChange(key.trim(), value.trim());
                e.target.value = '';
              }
            }}
          />
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => {
              const input = prompt("Enter environment variable in KEY=VALUE format");
              if (input && input.includes('=')) {
                const [key, value] = input.split('=');
                handleEnvironmentVarChange(key.trim(), value.trim());
              }
            }}
          >
            Add
          </Button>
        </Box>
      </Grid>
    );
  };

  const renderEndpoints = () => {
    const endpoints = formData.platformData.endpoints || [];
    
    return (
      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          API Endpoints
        </Typography>
        {endpoints.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No endpoints configured
          </Typography>
        ) : (
          <List dense sx={{ bgcolor: 'action.hover', borderRadius: 1 }}>
            {endpoints.map((endpoint, index) => (
              <ListItem key={index} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                <ListItemIcon>
                  <HttpIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <Chip 
                        label={endpoint.method} 
                        size="small" 
                        sx={{ mr: 1, minWidth: 60, fontWeight: 'bold' }}
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace' }}>
                        {endpoint.url}
                      </Typography>
                    </Box>
                  }
                  secondary={endpoint.description}
                />
                <IconButton size="small" onClick={() => removeEndpoint(index)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
        
        <Box mt={2} p={2} sx={{ border: '1px dashed rgba(0, 0, 0, 0.23)', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Add New Endpoint
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="URL"
                name="url"
                value={newEndpoint.url}
                onChange={handleEndpointChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HttpIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Method</InputLabel>
                <Select
                  label="Method"
                  name="method"
                  value={newEndpoint.method}
                  onChange={handleEndpointChange}
                >
                  {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'].map((method) => (
                    <MenuItem key={method} value={method}>{method}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newEndpoint.description}
                onChange={handleEndpointChange}
                size="small"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Accordion elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Endpoint Credentials</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="credentials.username"
                        value={newEndpoint.credentials.username}
                        onChange={handleEndpointChange}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="credentials.password"
                        type={showPassword ? 'text' : 'password'}
                        value={newEndpoint.credentials.password}
                        onChange={handleEndpointChange}
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                              >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Token"
                        name="credentials.token"
                        value={newEndpoint.credentials.token}
                        onChange={handleEndpointChange}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Notes"
                        name="credentials.notes"
                        value={newEndpoint.credentials.notes}
                        onChange={handleEndpointChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddCircleOutlineIcon />}
                onClick={addEndpoint}
                disabled={!newEndpoint.url}
                fullWidth
              >
                Add Endpoint
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    );
  };

  const renderPlatformSpecificFields = () => {
    switch (platform) {
      case 'web':
        return (
          <>
            {renderTextField("Web Server URL", "platformData.webServerURL", 'text', <DnsIcon fontSize="small" color="action" />)}
            <Grid item xs={12}>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Browser Targets</FormLabel>
                <FormGroup row>
                  {['chrome', 'firefox', 'safari', 'edge', 'opera'].map((browser) => (
                    <FormControlLabel
                      key={browser}
                      control={
                        <Checkbox
                          checked={formData.platformData.browserTargets?.includes(browser)}
                          onChange={(e) => {
                            const newTargets = e.target.checked
                              ? [...(formData.platformData.browserTargets || []), browser]
                              : (formData.platformData.browserTargets || []).filter(b => b !== browser);
                            setFormData(prev => ({
                              ...prev,
                              platformData: {
                                ...prev.platformData,
                                browserTargets: newTargets
                              }
                            }));
                          }}
                          name={browser}
                        />
                      }
                      label={browser.charAt(0).toUpperCase() + browser.slice(1)}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
            {renderEndpoints()}
          </>
        );
      case 'mobile':
        return (
          <>
            {renderTextField("App File Path", "platformData.appFile", 'text', <CloudUploadIcon fontSize="small" color="action" />)}
            {renderSelectField("Mobile Platform", "platformData.platform", [
              { value: 'android', label: 'Android' },
              { value: 'ios', label: 'iOS' }
            ])}
            {renderTextField("Emulator Image", "platformData.emulatorImage", 'text', <StorageIcon fontSize="small" color="action" />)}
          </>
        );
      case 'desktop':
        return (
          <>
            {renderTextField("Installer File", "platformData.installerFile", 'text', <CloudUploadIcon fontSize="small" color="action" />)}
            {renderSelectField("OS Target", "platformData.osTarget", [
              { value: 'windows', label: 'Windows' },
              { value: 'macos', label: 'macOS' },
              { value: 'linux', label: 'Linux' }
            ])}
          </>
        );
      case 'blockchain':
        return (
          <>
            {renderTextField("Node Info", "platformData.nodeInfo", 'text', <StorageIcon fontSize="small" color="action" />)}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Smart Contracts
              </Typography>
              <TextField
                fullWidth
                label="Add smart contract address"
                value=""
                onChange={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    setFormData(prev => ({
                      ...prev,
                      platformData: {
                        ...prev.platformData,
                        smartContracts: [...(prev.platformData.smartContracts || []), e.target.value]
                      }
                    }));
                    e.target.value = '';
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    setFormData(prev => ({
                      ...prev,
                      platformData: {
                        ...prev.platformData,
                        smartContracts: [...(prev.platformData.smartContracts || []), e.target.value]
                      }
                    }));
                    e.target.value = '';
                  }
                }}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => {
                          const input = prompt("Enter smart contract address");
                          if (input) {
                            setFormData(prev => ({
                              ...prev,
                              platformData: {
                                ...prev.platformData,
                                smartContracts: [...(prev.platformData.smartContracts || []), input]
                              }
                            }));
                          }
                        }}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {formData.platformData.smartContracts?.length > 0 && (
                <Box mt={1}>
                  {formData.platformData.smartContracts.map((contract, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={1}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', mr: 1 }}>
                        {contract}
                      </Typography>
                      <IconButton size="small" onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          platformData: {
                            ...prev.platformData,
                            smartContracts: prev.platformData.smartContracts.filter((_, i) => i !== index)
                          }
                        }));
                      }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
            {renderTextField("Network", "platformData.network", 'text', <DnsIcon fontSize="small" color="action" />)}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={3} sx={{ 
      p: 3, 
      my: 4, 
      borderRadius: 2,
      borderLeft: '4px solid',
      borderLeftColor: 'primary.main',
      background: 'white'
    }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={statusIcons[formData.status]}
        >
          <Avatar src={user.avatar} sx={{ 
            width: 56, 
            height: 56, 
            mr: 2,
            bgcolor: 'primary.main',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {user.fullName?.charAt(0) || user.email?.charAt(0)}
          </Avatar>
        </Badge>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {user.fullName || user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.role || 'Pentester'} • {projectType}
          </Typography>
        </Box>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 3,
          '& .MuiTabs-indicator': {
            height: 3,
          }
        }}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="secondary"
      >
        <Tab 
          label="Environment" 
          icon={<SettingsIcon fontSize="small" />} 
          iconPosition="start" 
          sx={{ minHeight: 48 }}
        />
        <Tab 
          label="Access" 
          icon={<TerminalIcon fontSize="small" />} 
          iconPosition="start" 
          sx={{ minHeight: 48 }}
        />
        <Tab 
          label="Credentials" 
          icon={<VpnKeyIcon fontSize="small" />} 
          iconPosition="start" 
          sx={{ minHeight: 48 }}
        />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={2}>
          <Accordion 
            expanded={expanded === 'panel1'} 
            onChange={handleAccordionChange('panel1')}
            sx={{ width: '100%' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                Basic Configuration
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {renderSelectField("Environment Type", "envType", [
                  { value: 'docker', label: 'Docker Container' },
                  { value: 'vm', label: 'Virtual Machine' },
                  { value: 'ovf', label: 'OVF Package' },
                  { value: 'other', label: 'Other' }
                ])}
                {renderTextField("Environment Image", "envImage", 'text', <CloudUploadIcon fontSize="small" color="action" />)}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded === 'panel2'} 
            onChange={handleAccordionChange('panel2')}
            sx={{ width: '100%' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                Platform Configuration ({platform})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {renderPlatformSpecificFields()}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded === 'panel3'} 
            onChange={handleAccordionChange('panel3')}
            sx={{ width: '100%' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                Resource Allocation
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {renderTextField("CPU Cores", "config.cpu", 'number', null, 
                  <InputAdornment position="end">cores</InputAdornment>
                )}
                {renderTextField("RAM", "config.ram", 'number', null, 
                  <InputAdornment position="end">GB</InputAdornment>
                )}
                {renderTextField("Storage", "config.storage", 'number', null, 
                  <InputAdornment position="end">GB</InputAdornment>
                )}
                {renderSelectField("OS", "config.os", [
                  { value: 'linux', label: 'Linux' },
                  { value: 'windows', label: 'Windows' },
                  { value: 'macos', label: 'macOS' }
                ])}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={2}>
          <Accordion 
            expanded={expanded === 'panel4'} 
            onChange={handleAccordionChange('panel4')}
            sx={{ width: '100%' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                Connection Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {renderTextField("Address", "runtimeAccess.address", 'text', <DnsIcon fontSize="small" color="action" />)}
                {renderTextField("Port", "runtimeAccess.port", 'number')}
                {renderSelectField("Protocol", "runtimeAccess.protocol", [
                  { value: 'ssh', label: 'SSH' },
                  { value: 'rdp', label: 'RDP' },
                  { value: 'http', label: 'HTTP' },
                  { value: 'https', label: 'HTTPS' },
                  { value: 'custom', label: 'Custom' }
                ])}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded === 'panel5'} 
            onChange={handleAccordionChange('panel5')}
            sx={{ width: '100%' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                Authentication
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {renderTextField("Username", "runtimeAccess.username", 'text')}
                {renderPasswordField("Password", "runtimeAccess.password")}
                {renderTextField("SSH Key Reference", "runtimeAccess.sshKeyReference", 'text', <VpnKeyIcon fontSize="small" color="action" />)}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded === 'panel6'} 
            onChange={handleAccordionChange('panel6')}
            sx={{ width: '100%' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                Advanced Settings
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {renderTextField("Startup Script", "runtimeAccess.startupScript", 'text', <TerminalIcon fontSize="small" color="action" />, null, true)}
                {renderTextField("Internal IP", "runtimeAccess.internalIP", 'text', <DnsIcon fontSize="small" color="action" />)}
                {renderTextField("Volume Mount Path", "runtimeAccess.volumeMountPath", 'text', <StorageIcon fontSize="small" color="action" />)}
                {renderSelectField("OS Platform", "runtimeAccess.osPlatform", [
                  { value: 'linux', label: 'Linux' },
                  { value: 'windows', label: 'Windows' },
                  { value: 'macos', label: 'macOS' }
                ])}
                {renderEnvironmentVars()}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={2}>
          <Accordion 
            expanded={expanded === 'panel7'} 
            onChange={handleAccordionChange('panel7')}
            sx={{ width: '100%' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                Access Credentials
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {renderTextField("Username", "accessCredentials.username", 'text')}
                {renderPasswordField("Password", "accessCredentials.password")}
                {renderTextField("Notes", "accessCredentials.notes", 'text', null, null, true)}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded === 'panel8'} 
            onChange={handleAccordionChange('panel8')}
            sx={{ width: '100%' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                Status & Logs
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {renderSelectField("Status", "status", [
                  { value: 'pending', label: 'Pending' },
                  { value: 'initializing', label: 'Initializing' },
                  { value: 'active', label: 'Active' },
                  { value: 'failed', label: 'Failed' },
                  { value: 'archived', label: 'Archived' }
                ])}
                {renderTextField("Logs", "logs", 'text', null, null, true)}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      )}

      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          startIcon={<CloudUploadIcon />}
          sx={{ 
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          Save Configuration
        </Button>
      </Box>
    </Paper>
  );
};

export default DevOpsInfoForm;