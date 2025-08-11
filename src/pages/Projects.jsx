import  { useEffect , useMemo, useState} from 'react';
import DataTable from '../components/projects/DataTable';
import { Button, Chip } from '@mui/material';
import { format } from 'date-fns';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import { getProjects } from '../api/projects/getProject';
import { useSession } from '../SessionContext';
import { useNavigate } from 'react-router';
import PersianDateWithTooltip from '../components/dateTime/PersainDate';

export default function UserProjectsTable() {
  const { user } = useSession().session;
  const socket = useSocket();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Initial fetch
    const fetchProjects = async () => {
      try {
        const res = await getProjects('user', user.id);
        console.log("res in line 21 : "  , res )
        setProjects(res.projects);
      } catch (err) {
        console.error('Failed to fetch user projects:', err);
      }

    };

    fetchProjects();

    // Socket listener for real-time assignment
    const handleAssigned = (newProject) => {

      if (!newProject) return;

      fetchProjects();

      // Add to top of list
      // setProjects(prev => [newProject, ...prev]);

      // Show toast notification
      toast.info(`You have been assigned to a new project: ${newProject}`, {
        position: 'top-right',
        autoClose: 4000,
      });
    };

    socket.on('newProjectForUser', handleAssigned);

    return () => {
      socket.off('newProjectForUser', handleAssigned);
    };
  }, [socket, user.id]);

  
const columns = useMemo(() => [
  {
    id: 'projectName',
    label: 'Project Name',
    sortable: true,
    render: (row) => row.project?.projectName || '—',
  },
  {
    id: 'manager',
    label: 'Manager',
    sortable: true,
    render: (row) =>
      row.manager ? `${row.manager.firstName} ${row.manager.lastName}` : '—',

  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    render: (row) => (
      <Chip
        label={row.status || 'Unknown'}
        color={
          row.status === 'completed' ? 'success' :
          row.status === 'in-progress' ? 'primary' :
          row.status === 'pending' ? 'warning' :
          'default'
        }
        size="small"
      />
    ),
  },
  {
    id: 'progress',
    label: 'Progress',
    sortable: false,
    render: (row) => `${row.progress}%`,
  },
  {
    id: 'report',
    label: 'Report',
    sortable: false,
    render: (row) => (
      <Button
        size="small"
        variant="outlined"
        onClick={() => window.open(`/reports/${row?.project?._id}`, '_blank')}
      >{console.log("row in line 105 : , " , row ) }
        View
      </Button>
    ),
  },
   {
    id: 'version',
    label: 'Version',
    sortable: true,
  },
  {
    id: 'expireAt',
    label: 'Expire At',
    sortable: true,
    render: (row) =>
      row?.project?.expireDay ? <PersianDateWithTooltip tooltipFormat = 'jD jMMMM jYYYY' date={row?.project?.expireDay} /> : '—',
  },
 
  {
    id: 'createdAt',
    label: 'Created At',
    sortable: true,
    render: (row) =>
      row.created_at ? <PersianDateWithTooltip date={row.created_at}  /> : '—',
  },
], []);
    


  return (
    <DataTable
      columns={columns}
      fetchUserType="user" // still needed for DataTable fallback
      title="My Projects"
      overrideRows={projects} // optional: allow injecting preloaded rows
      doubleClickable
      onRowDoubleClick={(row) => {
        console.log(" row in line 141: " , row )
        return navigate(`/do-project/${row?.project?._id}/${row?.manager?._id}`)}}
    />
  );
}
