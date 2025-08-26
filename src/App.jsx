import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import AddIcon from '@mui/icons-material/Add';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from 'react-router';
import { useSession } from './SessionContext';
import validateSession from './utils/validateSession';
import { jwtDecode } from 'jwt-decode';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Snackbar,
  IconButton,
  Slide,
  Paper,
  useTheme,
  useMediaQuery,
  Fade,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LoginIcon from '@mui/icons-material/Login';

const BASE_NAVIGATION = [
  {
    kind: 'header',
    title: 'User Dashboard',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'projects',
    title: 'Projects',
    icon: <AssignmentIcon />,
  },
  {
    kind: 'header',
    title: 'Project Manager',
  },
  {
    segment: 'managing',
    title: 'Managing',
    icon: <ManageAccountsIcon />,
  },
  {
    kind: 'header',
    title: 'Ticket System',
  },
  {
    segment: 'tickets/list',
    title: 'Ticket List',
    icon: <ManageAccountsIcon />,
  },
];

const DEVOPS_NAVIGATION = [
  {
    kind: 'header',
    title: 'DevOps',
  },
  {
    segment: 'create_project',
    title: 'Create Project',
    icon: <AddIcon />,
  },
  {
    segment: 'devops',
    title: 'DevOps',
    icon: <SettingsInputComponentIcon />,
  },
];

// Slide transition for toast
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

function AppContent() {
  const { session, clearSession, loading } = useSession();
  const navigate = useNavigate();
  const [showSessionExpired, setShowSessionExpired] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    if (!loading && session?.token) {
      try {
        const decoded = jwtDecode(session.token);
        const expiryTime = decoded.exp * 1000;
        const now = Date.now();
        const timeLeft = expiryTime - now;

        if (timeLeft <= 0) {
          handleSessionExpired();
        } else {
          const timer = setTimeout(handleSessionExpired, timeLeft);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.error('Failed to decode token', err);
        handleSessionExpired();
      }
    }
  }, [loading, session]);

  const handleSessionExpired = () => {
    clearSession();
    setShowSessionExpired(true);
    setShowToast(false);
  };

  const handleLoginAgain = () => {
    setShowSessionExpired(false);
    navigate('/sign-in');
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  React.useEffect(() => {
    async function checkSession() {
      if (!loading && session) {
        const valid = await validateSession();
        if (!valid) {
          clearSession();
          navigate('/sign-in');
        }
      } else if (!loading && !session) {
        navigate('/sign-in');
      }
    }
    checkSession();
  }, [loading, session, navigate, clearSession]);

  const signIn = React.useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  const signOut = React.useCallback(async () => {
    try {
      const URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      await fetch(`${URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearSession();
      navigate('/sign-in');
    }
  }, [clearSession, navigate]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  const navigation = React.useMemo(() => {
    const navItems = [...BASE_NAVIGATION];
    if (session?.user?.devOps) {
      navItems.push(...DEVOPS_NAVIGATION);
    }
    return navItems;
  }, [session]);

  return (
    <>
      <ReactRouterAppProvider
        navigation={navigation}
        session={session}
        authentication={{ signIn, signOut }}
      >
        <Outlet />
      </ReactRouterAppProvider>

      {/* Beautiful Modal for Session Expired */}
      <Dialog
        open={showSessionExpired}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleLoginAgain();
          }
        }}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
          </Box>
          
          <DialogTitle
            sx={{
              color: 'white',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              p: 0,
              mb: 2,
            }}
          >
            Session Expired
          </DialogTitle>
          
          <DialogContent sx={{ p: 0, mb: 3 }}>
            <Typography variant="body1" sx={{ color: 'white', mb: 2, fontSize: '1.1rem' }}>
              Your session has ended for security reasons.
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
              Please sign in again to continue using the application.
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ justifyContent: 'center', p: 0 }}>
            <Button
              onClick={handleLoginAgain}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
              startIcon={<LoginIcon />}
            >
              Sign In Again
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Toast Notification Alternative */}
      <Snackbar
        open={showSessionExpired}
        autoHideDuration={6000}
        onClose={handleLoginAgain}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
        sx={{
          bottom: { xs: 70, sm: 80 },
        }}
      >
        <Alert
          severity="warning"
          variant="filled"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleLoginAgain}
            >
              <LoginIcon fontSize="small" />
            </IconButton>
          }
          sx={{
            minWidth: isMobile ? 300 : 400,
            alignItems: 'center',
            bgcolor: 'warning.dark',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '& .MuiAlert-message': {
              flexGrow: 1,
              py: 1,
            },
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Session Expired
            </Typography>
            <Typography variant="body2">
              Please sign in again to continue
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
}

export default function App() {
  return <AppContent />;
}