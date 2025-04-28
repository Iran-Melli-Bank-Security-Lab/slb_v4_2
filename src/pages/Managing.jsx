import { useState } from 'react';
import { 
  MenuItem, 
  Select, 
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PeopleIcon from '@mui/icons-material/People';
import DataTable from '../components/projects/DataTable';

const ManagerProjects = () => {
  const [assignments, setAssignments] = useState({});
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' },
  ]);

  const handleAssignChange = (projectId, userId) => {
    setAssignments(prev => ({
      ...prev,
      [projectId]: userId
    }));
    // API call to update assignment would go here
    console.log(`Assigned project ${projectId} to user ${userId}`);
  };

  const handleGenerateReport = (projectId) => {
    // Report generation logic
    console.log(`Generating report for project ${projectId}`);
    // In real app: trigger report generation API
  };

  const handleViewIdentifier = (projectId) => {
    console.log(`Viewing identifier for project ${projectId}`);
    window.open(`/projects/${projectId}/info`, '_blank');
  };
 
  const columns = [
    { 
      id: 'name', 
      label: 'Project Name',
      sortable: true
    },
    { 
      id: 'assign', 
      label: 'Assign',
      sortable: false,
      render: (row) => (
        <Select
          value={assignments[row.id] || ''}
          onChange={(e) => handleAssignChange(row.id, e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 120 }}
          startAdornment={
            <PeopleIcon color="action" sx={{ mr: 1 }} />
          }
        >
          <MenuItem value="" disabled>
            <em>Select pentester</em>
          </MenuItem>
          {users.map(user => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      )
    },
    { 
      id: 'identifier', 
      label: 'Identifier',
      sortable: false,
      render: (row) => (
        <Tooltip title="View project identifier">
          <IconButton 
            onClick={() => handleViewIdentifier(row.id)}
            color="primary"
          >
            <FingerprintIcon />
          </IconButton>
        </Tooltip>
      )
    },
    { 
      id: 'generateReport', 
      label: 'Generate Report',
      sortable: false,
      render: (row) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<DescriptionIcon />}
          onClick={() => handleGenerateReport(row.id)}
          sx={{ textTransform: 'none' }}
        >
          Generate
        </Button>
      )
    },
    { 
      id: 'version', 
      label: 'Version',
      sortable: true
    },
    { 
      id: 'date', 
      label: 'Date',
      sortable: true
    },
  ];

  return (
    <DataTable 
      columns={columns}
      fetchUserType="manager"
      title="Manager Projects Dashboard"
    />
  );
};

export default ManagerProjects;