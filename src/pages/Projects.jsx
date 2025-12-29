import  { useCallback, useEffect , useMemo, useState} from 'react';
import DataTable from '../components/projects/DataTable';
import { Box, Button, Chip, LinearProgress, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import moment from 'moment-jalaali';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import { getProjects } from '../api/projects/getProject';
import { useSession } from '../SessionContext';
import { useNavigate } from 'react-router';

moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

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

  const renderDatePill = useCallback((dateValue, { showTime = true } = {}) => {
    if (!dateValue) {
      return (
        <Typography variant="caption" color="text.secondary">
          —
        </Typography>
      );
    }

    const date = moment(dateValue);
    if (!date.isValid()) {
      return (
        <Typography variant="caption" color="text.secondary">
          —
        </Typography>
      );
    }

    return (
      <Box
        sx={(theme) => ({
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 1.25,
          py: 0.6,
          borderRadius: 2,
          border: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.2),
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.light,
            0.15
          )} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
          boxShadow: `0 6px 16px ${alpha(
            theme.palette.primary.main,
            0.1
          )}`,
        })}
        dir="rtl"
      >
        <Box
          sx={(theme) => ({
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
          })}
        >
          <EventRoundedIcon sx={{ fontSize: 16 }} />
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {date.format("jD jMMMM jYYYY")}
          </Typography>
          {showTime && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.secondary",
                lineHeight: 1.2,
              }}
            >
              {date.format("HH:mm")}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }, []);

  
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
    render: (row) => {
      const rawProgress = Number(row.progress ?? 0);
      const progress = Number.isFinite(rawProgress)
        ? Math.min(100, Math.max(0, rawProgress))
        : 0;

      return (
        <Box sx={{ minWidth: 140 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.75,
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, letterSpacing: "0.04em" }}
            >
              {progress}%
            </Typography>
            <Box
              sx={(theme) => ({
                px: 0.75,
                py: 0.1,
                borderRadius: 999,
                fontSize: "0.7rem",
                fontWeight: 700,
                color:
                  progress >= 80
                    ? theme.palette.success.dark
                    : progress >= 40
                    ? theme.palette.warning.dark
                    : theme.palette.error.dark,
                backgroundColor:
                  progress >= 80
                    ? alpha(theme.palette.success.main, 0.12)
                    : progress >= 40
                    ? alpha(theme.palette.warning.main, 0.12)
                    : alpha(theme.palette.error.main, 0.12),
              })}
            >
              {progress >= 80 ? "On Track" : progress >= 40 ? "In Progress" : "At Risk"}
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={(theme) => ({
              height: 8,
              borderRadius: 999,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            })}
          />
        </Box>
      );
    },
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
    render: (row) => {
      const version = row.version || row.project?.version;
      if (!version) {
        return (
          <Typography variant="caption" color="text.secondary">
            —
          </Typography>
        );
      }

      return (
        <Box
          sx={(theme) => ({
            display: "inline-flex",
            alignItems: "center",
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            border: "1px solid",
            borderColor: alpha(theme.palette.secondary.main, 0.3),
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.secondary.light,
              0.2
            )} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
            boxShadow: `0 6px 14px ${alpha(
              theme.palette.secondary.main,
              0.12
            )}`,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily:
              '"IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, monospace',
            color: theme.palette.secondary.dark,
          })}
        >
          {version}
        </Box>
      );
    },
  },
  {
    id: 'expireAt',
    label: 'Expire At',
    sortable: true,
    render: (row) => renderDatePill(row?.project?.expireDay, { showTime: false }),
  },
 
  {
    id: 'createdAt',
    label: 'Created At',
    sortable: true,
    render: (row) => renderDatePill(row?.created_at, { showTime: false }),
  },
], [renderDatePill]);
    


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
