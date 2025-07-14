import { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/devops/DataTable';
import { Button, Chip, Menu, MenuItem } from '@mui/material';
import { format } from 'date-fns';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getDevopsProjects } from '../api/devops/project/getProject';
import { useUserId } from '../hooks/useUserId';

export default function UserProjectsTable() {
  
  const socket = useSocket();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const userId = useUserId()

  useEffect(()=>{

     const fetchDevopsProjects = async () => {
      try {
        const res = await getDevopsProjects( userId );
        setProjects(res.devOpsProjects);
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    };
    fetchDevopsProjects();


  }, [userId])
  const handleClickMenu = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

const handleMenuAction = async (action) => {
  if (!selectedProject) {
    handleCloseMenu();
    return;
  }

  const projectId = selectedProject._id;
  
  try {
    switch (action) {
      case 'edit':
        // Example: navigate to edit page
        navigate(`/edit_project/${projectId}`);
        break;
      case 'delete':
        // Example API call
        await deleteDevopsProject(projectId);
        toast.success('Project deleted successfully');
        // Refresh projects list
        const res = await getDevopsProjects(userId);
        setProjects(res.devOpsProjects);
        break;
      case 'devops':
        navigate(`/devops/${projectId}`);
        break;
      case 'identifier':
        navigate(`/projects/identifier/${projectId}`);
        break;
      default:
        break;
    }
  } catch (error) {
    toast.error(`Failed to ${action} project: ${error.message}`);
  } finally {
    handleCloseMenu();
  }
};

  const columns = useMemo(() => [
    {
      id: 'projectName',
      label: 'Project Name',
      sortable: true,
      render: (row) => row?.projectName || '—',
    },
    {
      id: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => (
        <Chip
          label={row?.projectType || '—'}
          color={
            row.type === 'Security' ? 'secondary' :
            row.type === 'Quality' ? 'info' :
            'default'
          }
          size="small"
        />
      ),
    },
    {
      id: 'letterNumber',
      label: 'Letter Number',
      sortable: true,
      render: (row) => row.letterNumber || '—',
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Chip
          label={row.status || 'Unknown'}
          color={
            row.status === 'close' ? 'success' :
            row.status === 'in-progress' ? 'primary' :
            row.status === 'pend' ? 'warning' :
            row.status === 'open' ? 'info' :
            'default'
          }
          size="small"
        />
      ),
    },
    {
      id: 'tests',
      label: 'Tests',
      sortable: true,
      render: (row) => row?.numberOfTest || 0,
    },
    {
      id: 'version',
      label: 'Version',
      sortable: true,
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <>
          <Button
            aria-controls={`actions-menu-${row._id}`}
            aria-haspopup="true"
            onClick={(e) => handleClickMenu(e, row)}
            size="small"
            startIcon={<MoreVertIcon />}
          >
            
          </Button>
          <Menu
            id={`actions-menu-${row._id}`}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl && selectedProject?._id === row._id)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => handleMenuAction('edit')}>Edit</MenuItem>
            <MenuItem onClick={() => handleMenuAction('delete')}>Delete</MenuItem>
            <MenuItem onClick={() => handleMenuAction('devops')}>DevOps</MenuItem>
            <MenuItem onClick={() => handleMenuAction('identifier')}>Identifier</MenuItem>
          </Menu>
        </>
      ),
    },
  ], [anchorEl, selectedProject]);

  return (
    <DataTable
      columns={columns}
      title="Devops Projects"
      overrideRows={projects}
      
    />
  );
}