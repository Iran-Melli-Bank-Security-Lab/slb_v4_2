import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getDevopsProject, getUserProjectsByProjectId,  } from '../api/devops/project/getProject';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem
} from '@mui/material';
import {useUserId} from "../hooks/useUserId"

const DevOpsInfoForm = () => {
  const { projectId } = useParams();
  const [projectInfo, setProjectInfo] = useState(null);
  const [pentesters, setPentesters] = useState([]);
const userId = useUserId() 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await getDevopsProject(projectId , userId );
        const userProjectRes = await getUserProjectsByProjectId(projectId);
        console.log("userProjectRes : " , userProjectRes )
        console.log("projectRes : " , projectRes)
        setProjectInfo(projectRes?.devOpsProject);
        setPentesters(userProjectRes?.projectPentesters
?.map(up => up.pentester));
      } catch (err) {
        toast.error("Failed to load project or pentester info");
      }
    };

    fetchData();
  }, [projectId]);

  if (!projectInfo) return <Typography>Loading project info...</Typography>;

  return (
    <Card sx={{ p: 4, my: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Project: {projectInfo.name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Type: {projectInfo.projectType} | Platform: {projectInfo.platform}
        </Typography>

        {pentesters.map((user, index) => (
          <PentesterDevOpsForm
            key={index}
            user={user}
            projectId={projectId}
            platform={projectInfo.platform}
          />
        ))}
      </CardContent>
    </Card>
  );
};

const PentesterDevOpsForm = ({ user, projectId, platform }) => {
  const [formData, setFormData] = useState({
    envType: '',
    envImage: '',
    platformData: {},
    config: { cpu: '', ram: '', storage: '', os: '' },
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
    accessCredentials: { username: '', password: '', notes: '' },
    status: 'pending',
    logs: ''
  });

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

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        project: projectId,
        pentester: user._id,
        platform
      };
      await createDevOpsInfo(payload);
      toast.success("DevOps Info saved for " + (user.fullName || user.email));
    } catch (err) {
      toast.error("Error saving DevOps Info for " + (user.fullName || user.email));
    }
  };

  const renderTextField = (label, name, type = 'text') => (
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label={label}
        name={name}
        type={type}
        value={name.split('.').reduce((o, i) => (o ? o[i] : ''), formData)}
        onChange={handleChange}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />
    </Grid>
  );

  return (
    <Paper elevation={3} sx={{ p: 3, my: 4 }}>
      <Typography variant="h6" gutterBottom>
        {user.fullName || user.email}
      </Typography>
      <Grid container spacing={2}>
        {renderTextField("Environment Type", "envType")}
        {renderTextField("Environment Image", "envImage")}

        {platform === 'web' && (
          <>
            {renderTextField("Web Server URL", "platformData.webServerURL")}
            {renderTextField("Browser Targets (comma separated)", "platformData.browserTargets")}
          </>
        )}

        {platform === 'mobile' && (
          <>
            {renderTextField("App File Path", "platformData.appFile")}
            {renderTextField("Mobile Platform (android/ios)", "platformData.platform")}
            {renderTextField("Emulator Image", "platformData.emulatorImage")}
          </>
        )}

        {renderTextField("CPU", "config.cpu")}
        {renderTextField("RAM", "config.ram")}
        {renderTextField("Storage", "config.storage")}
        {renderTextField("OS", "config.os")}

        {renderTextField("Runtime Address", "runtimeAccess.address")}
        {renderTextField("Port", "runtimeAccess.port")}
        {renderTextField("Protocol", "runtimeAccess.protocol")}
        {renderTextField("Username", "runtimeAccess.username")}
        {renderTextField("Password", "runtimeAccess.password", 'password')}
        {renderTextField("SSH Key Reference", "runtimeAccess.sshKeyReference")}
        {renderTextField("Startup Script", "runtimeAccess.startupScript")}
        {renderTextField("Internal IP", "runtimeAccess.internalIP")}
        {renderTextField("Volume Mount Path", "runtimeAccess.volumeMountPath")}
        {renderTextField("OS Platform", "runtimeAccess.osPlatform")}

        {renderTextField("Access Username", "accessCredentials.username")}
        {renderTextField("Access Password", "accessCredentials.password", 'password')}
        {renderTextField("Access Notes", "accessCredentials.notes")}

        {renderTextField("Status", "status")}
        {renderTextField("Logs", "logs")}
      </Grid>

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        Save DevOps Info
      </Button>
    </Paper>
  );
};

export default DevOpsInfoForm;
