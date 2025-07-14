import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DevOpsInfoForm = ({ projectId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      project: projectId || '',
      projectName: '',
      projectType: 'security',
      platform: 'web',
      environments: {
        development: [],
        staging: [],
        production: [],
        pentest: []
      },
      sharedResources: {
        databases: [],
        storage: []
      }
    }
  });

  const platform = watch('platform');
  const projectType = watch('projectType');

  useEffect(() => {
    // Load users and projects
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // const [usersRes, projectsRes] = await Promise.all([
        //   axios.get('/api/users'),
        //   axios.get('/api/projects')
        // ]);
        // setUsers(usersRes.data);
        // setProjects(projectsRes.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // const response = await axios.post('/api/devops-info', data);
      alert('DevOps info saved successfully!');
      console.log('Saved data:', response.data);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save DevOps info');
    }
    setIsLoading(false);
  };

  const addUserEnvironment = (environmentType) => {
    const newEnvironment = {
      user: '',
      role: 'developer',
      platformConfig: getDefaultPlatformConfig(),
      compute: {
        vm: {
          instanceId: '',
          specs: { cpu: 2, memory: 4, storage: 50 }
        }
      },
      network: {
        endpoints: [],
        firewallRules: []
      },
      status: {
        current: 'provisioning'
      }
    };

    setValue(`environments.${environmentType}`, [
      ...watch(`environments.${environmentType}`),
      newEnvironment
    ]);
  };

  const getDefaultPlatformConfig = () => {
    switch (platform) {
      case 'web':
        return {
          server: { type: 'nginx', version: '', configPaths: [] },
          security: { ssl: { certificates: [] } }
        };
      case 'mobile':
        return {
          build: { version: '', minSdkVersion: '' },
          signing: { certificates: [] }
        };
      default:
        return {};
    }
  };

  const steps = [
    'Project Information',
    'Environments Setup',
    'Shared Resources',
    'Review & Submit'
  ];

  const renderPlatformConfig = (envPath, index) => {
    switch (platform) {
      case 'web':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Web Server Configuration</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name={`${envPath}.platformConfig.server.type`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Server Type</InputLabel>
                      <Select {...field} label="Server Type">
                        <MenuItem value="nginx">Nginx</MenuItem>
                        <MenuItem value="apache">Apache</MenuItem>
                        <MenuItem value="iis">IIS</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name={`${envPath}.platformConfig.server.version`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Server Version"
                      placeholder="1.23.0"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 'mobile':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Mobile Build Configuration</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name={`${envPath}.platformConfig.build.version`}
                  control={control}
                  rules={{ pattern: /^\d+\.\d+\.\d+$/ }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="App Version"
                      placeholder="1.0.0"
                      error={!!errors[`${envPath}.platformConfig.build.version`]}
                      helperText="Use semantic versioning (x.y.z)"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name={`${envPath}.platformConfig.build.minSdkVersion`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Min SDK Version"
                      placeholder="21"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Project Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="project"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Project</InputLabel>
                      <Select {...field} label="Project" disabled={!!projectId}>
                        {projects.map((project) => (
                          <MenuItem key={project._id} value={project._id}>
                            {project.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="projectName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Project Name"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="projectType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Project Type</InputLabel>
                      <Select {...field} label="Project Type">
                        <MenuItem value="security">Security Testing</MenuItem>
                        <MenuItem value="quality">Quality Assurance</MenuItem>
                        <MenuItem value="compliance">Compliance</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="platform"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Platform</InputLabel>
                      <Select {...field} label="Platform">
                        <MenuItem value="web">Web Application</MenuItem>
                        <MenuItem value="mobile">Mobile Application</MenuItem>
                        <MenuItem value="desktop">Desktop Application</MenuItem>
                        <MenuItem value="hardware">Hardware/IoT</MenuItem>
                        <MenuItem value="blockchain">Blockchain</MenuItem>
                        <MenuItem value="cloud">Cloud Infrastructure</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Environment Configuration
            </Typography>
            
            {['development', 'staging', 'production', 'pentest'].map((envType) => (
              <Accordion key={envType} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{envType.charAt(0).toUpperCase() + envType.slice(1)} Environments</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {watch(`environments.${envType}`).map((env, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Environment #{index + 1}
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name={`environments.${envType}[${index}].user`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <InputLabel>User</InputLabel>
                                <Select {...field} label="User" required>
                                  {users.map((user) => (
                                    <MenuItem key={user._id} value={user._id}>
                                      {user.name} ({user.email})
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name={`environments.${envType}[${index}].role`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <InputLabel>Role</InputLabel>
                                <Select {...field} label="Role">
                                  <MenuItem value="pentester">Pentester</MenuItem>
                                  <MenuItem value="developer">Developer</MenuItem>
                                  <MenuItem value="devops-engineer">DevOps Engineer</MenuItem>
                                  <MenuItem value="qa-engineer">QA Engineer</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                      </Grid>

                      {renderPlatformConfig(`environments.${envType}[${index}]`, index)}

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Compute Resources</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Controller
                              name={`environments.${envType}[${index}].compute.vm.specs.cpu`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  type="number"
                                  label="CPU Cores"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Controller
                              name={`environments.${envType}[${index}].compute.vm.specs.memory`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  type="number"
                                  label="Memory (GB)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Controller
                              name={`environments.${envType}[${index}].compute.vm.specs.storage`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  type="number"
                                  label="Storage (GB)"
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  ))}
                  
                  <Button 
                    variant="outlined" 
                    onClick={() => addUserEnvironment(envType)}
                    sx={{ mt: 1 }}
                  >
                    Add {envType} Environment
                  </Button>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Shared Resources
            </Typography>
            
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Databases</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Database configuration fields */}
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Storage</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Storage configuration fields */}
              </AccordionDetails>
            </Accordion>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Review Your Configuration
            </Typography>
            <pre>{JSON.stringify(watch(), null, 2)}</pre>
          </Box>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {renderStepContent(activeStep)}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          Back
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Submit'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => setActiveStep(activeStep + 1)}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DevOpsInfoForm;