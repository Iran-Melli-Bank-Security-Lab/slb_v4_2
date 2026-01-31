import  { useCallback, useEffect , useMemo, useState} from 'react';
import DataTable from '../components/projects/DataTable';
import { Box, Button, Chip, LinearProgress, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import moment from 'moment-jalaali';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import { getProjects } from '../api/projects/getProject';
import { useSession } from '../SessionContext';
import { useNavigate } from 'react-router';
import { fetchOriginalProject } from '../api/projects/fetchOriginalProject';
import { set } from 'react-hook-form';

moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

export default function UserProjectsTable() {
  const { user } = useSession().session;
  const socket = useSocket();
  const navigate = useNavigate();

  const [originalProject , setOriginalProject] = useState([]);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getOriginalProject = async (projectId )=>{
      try{

        const res = await fetchOriginalProject(projectId)
        console.log("res in line 35 : " , res )
        
        setOriginalProject(res)
  
      }catch(error){
        console.error(error)
      }
    }
    // Initial fetch

    const fetchProjects = async () => {
      try {
        const res = await getProjects('user', user.id);
       
    //     if (res?.projects[0]._id) {
    //   await getOriginalProject(res.projects._id);
    // } else {
    //   console.error("No valid project ID found");
    // }
        setProjects(res?.projects);
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

//  const handleViewReport = (project) => {
//   if (!project) return;
//   console.log("selected Project line 91 in project : " , originalProject) 

//   navigate('/userreports', { state: { project:project } });
// };

// تابع handleViewReport را به این صورت اصلاح کنید:
const handleViewReport = useCallback(async (row) => {

  if (!row) return;
  

  console.log("line 100 : " , row )


  try {
    // استخراج آیدی پروژه از ردیف
    const projectId = row?.project?._id;
    
    if (!projectId) {
      toast.error('Project ID not found');
      return;
    }
    
    console.log("Fetching original project for ID:", projectId);
    
    // فراخوانی API برای دریافت پروژه اصلی
    const originalProject = await fetchOriginalProject(projectId);
    console.log("Original project received:", originalProject);
    
    // ذخیره در state (اگر نیاز باشد)
    setOriginalProject(originalProject);
    
    // هدایت به صفحه گزارشات همراه با پروژه اصلی
    navigate('/userreports', { 
      state: { 
        project: originalProject,
        projectId: projectId 
      } 
    });
    
  } catch (error) {
    console.error('Failed to fetch original project:', error);
    toast.error('Failed to fetch project details');
  }
}, [navigate]);




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
    width: 260,
    render: (row) => {
      const name = row.project?.projectName || row.projectName;
      const projectId = row.project?._id;
      const shortId = projectId
        ? `${projectId.slice(0, 6)}...${projectId.slice(-4)}`
        : null;

      if (!name) {
        return (
          <Typography variant="caption" color="text.secondary">
            —
          </Typography>
        );
      }

      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          <Box
            sx={(theme) => ({
              width: 34,
              height: 34,
              borderRadius: 2,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.light,
                0.2
              )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
              border: "1px solid",
              borderColor: alpha(theme.palette.primary.main, 0.2),
              color: theme.palette.primary.main,
            })}
          >
            <LanguageRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {name}
            </Typography>
            {shortId && (
              <Typography variant="caption" color="text.secondary" noWrap>
                ID: {shortId}
              </Typography>
            )}
          </Box>
        </Box>
      );
    },
  },
  {
    id: 'manager',
    label: 'Manager',
    sortable: true,
    width: 210,
    render: (row) => {
      const firstName = row.manager?.firstName || "";
      const lastName = row.manager?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
      const initials = `${firstName.trim().charAt(0)}${lastName
        .trim()
        .charAt(0)}`.trim();

      if (!fullName) {
        return (
          <Typography variant="caption" color="text.secondary">
            —
          </Typography>
        );
      }

      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          <Box
            sx={(theme) => ({
              width: 34,
              height: 34,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.75rem",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.secondary.light,
                0.25
              )} 0%, ${alpha(theme.palette.secondary.main, 0.12)} 100%)`,
              border: "1px solid",
              borderColor: alpha(theme.palette.secondary.main, 0.25),
              color: theme.palette.secondary.dark,
            })}
          >
            {initials || <PersonRoundedIcon sx={{ fontSize: 16 }} />}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Project Manager
            </Typography>
          </Box>
        </Box>
      );
    },

  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    width: 140,
    render: (row) => {
      const status = row.status || 'Open';
      const statusKey = status.toLowerCase();
      const palette =
        statusKey === 'finish' || statusKey === 'completed'
          ? 'success'
          : statusKey === 'in progress' || statusKey === 'in-progress'
          ? 'primary'
          : statusKey === 'pending'
          ? 'warning'
          : 'info';

      return (
        <Box
          sx={(theme) => ({
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 0.4,
            borderRadius: 999,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
            border: "1px solid",
            borderColor: alpha(theme.palette[palette].main, 0.35),
            color: theme.palette[palette].dark,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette[palette].light,
              0.45
            )} 0%, ${alpha(theme.palette[palette].main, 0.12)} 100%)`,
            boxShadow: `0 6px 14px ${alpha(
              theme.palette[palette].main,
              0.12
            )}`,
            textTransform: "capitalize",
          })}
        >
          <Box
            sx={(theme) => ({
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: theme.palette[palette].main,
              boxShadow: `0 0 0 3px ${alpha(
                theme.palette[palette].main,
                0.16
              )}`,
            })}
          />
          {status}
        </Box>
      );
    },
  },
  {
    id: 'progress',
    label: 'Progress',
    sortable: false,
    width: 190,
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
              {progress >= 80
                ? "طبق برنامه"
                : progress >= 40
                ? "در حال پیشرفت"
                : "نیاز به توجه"}
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
    id: 'expireAt',
    label: 'Expire At',
    sortable: true,
    width: 160,
    render: (row) => renderDatePill(row?.project?.expireDay, { showTime: false }),
  },
  {
    id: 'version',
    label: 'Version',
    sortable: true,
    width: 110,
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
    id: 'report',
    label: 'Findings',
    sortable: false,
    width: 140,
    render: (row) => (
      <Button
        size="small"
        variant="contained"
        endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 18 }} />}
        onClick={() => window.open(`/reports/${row?.project?._id}`, '_blank')}
        sx={(theme) => ({
          position: "relative",
          borderRadius: 999,
          px: 2,
          py: 0.75,
          fontWeight: 700,
          textTransform: "none",
          letterSpacing: "0.02em",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          border: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.3),
          boxShadow: `0 8px 18px ${alpha(theme.palette.primary.main, 0.18)}`,
          overflow: "hidden",
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.22)}`,
            transform: "translateY(-1px)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 35%, rgba(255,255,255,0) 70%)",
            transform: "translateX(-120%)",
            transition: "transform 450ms ease",
          },
          "&:hover::after": {
            transform: "translateX(120%)",
          },
        })}
      >{console.log("row in line 105 : , " , row ) }
        مشاهده
      </Button>
    ),
  },
  {
    id: 'pdfReport',
    label: 'PDF Report',
    sortable: false,
    width: 140,
    render: (row) => (
      <Button
        size="small"
        variant="outlined"
        startIcon={<PictureAsPdfRoundedIcon sx={{ fontSize: 18 }} />}
        onClick={() => handleViewReport(row)}
        sx={(theme) => ({
          borderRadius: 999,
          px: 1.75,
          py: 0.65,
          fontWeight: 700,
          textTransform: "none",
          letterSpacing: "0.02em",
          color: theme.palette.secondary.dark,
          borderColor: alpha(theme.palette.secondary.main, 0.35),
          backgroundColor: alpha(theme.palette.secondary.main, 0.08),
          "&:hover": {
            borderColor: theme.palette.secondary.main,
            backgroundColor: alpha(theme.palette.secondary.main, 0.14),
            transform: "translateY(-1px)",
          },
        })}
      >
        دریافت
      </Button>
    ),
  },
], [handleViewReport, renderDatePill]);
    


  return (
    <DataTable
      columns={columns}
      fetchUserType="user" // still needed for DataTable fallback
      title="My Projects"
      subtitle="نمای کلی پروژه‌ها و وضعیت آن‌ها"
      dense
      overrideRows={projects} // optional: allow injecting preloaded rows
      doubleClickable
      onRowDoubleClick={(row) => {
        console.log(" row in line 141: " , row )
        return navigate(`/do-project/${row?.project?._id}/${row?.manager?._id}`)}}
    />
  );
}
