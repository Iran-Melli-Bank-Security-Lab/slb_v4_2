import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import AddIcon from '@mui/icons-material/Add';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from 'react-router';
import { useSession } from './SessionContext'; // 👈 updated import
import validateSession from './utils/validateSession';
import {jwtDecode} from 'jwt-decode';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

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
  // {
  //   segment: 'reports',
  //   title: 'Reports',
  //   icon: <BugReportIcon />,
  // },
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
    title: 'Tiket System',
  },

   {
    segment: 'tickets/list',
    title: 'Ticket List',
    icon: <ManageAccountsIcon />,
  },

];


// DevOps navigation items that are conditionally shown
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


function AppContent() {
  const { session, clearSession, loading } = useSession();
  const navigate = useNavigate();
  const [showSessionExpired, setShowSessionExpired] = React.useState(false);


React.useEffect(() => {
    if (!loading && session?.token) {
      try {
        // decode JWT to get expiration time
        const decoded = jwtDecode(session.token);
        const expiryTime = decoded.exp * 1000; // convert to ms
        const now = Date.now();
        const timeLeft = expiryTime - now;

        if (timeLeft <= 0) {
          // already expired
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
  };

  const handleLoginAgain = () => {
    setShowSessionExpired(false);
    navigate('/sign-in');
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

      await fetch(URL, {
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
    return <div>Loading...</div>;
  }

    // Build the navigation array based on user permissions
  const navigation = React.useMemo(() => {
    const navItems = [...BASE_NAVIGATION];
    if (session?.user?.devOps) {
      navItems.push(...DEVOPS_NAVIGATION);
    }
    return navItems;
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (<>
    <ReactRouterAppProvider
      navigation={navigation}
      session={session}
      authentication={{ signIn, signOut }}
    >
      <Outlet />
    </ReactRouterAppProvider>

 {/* Modal for session expired */}
      <Dialog open={showSessionExpired} disableEscapeKeyDown disableBackdropClick>
        <DialogTitle>Session Expired</DialogTitle>
        <DialogContent>
          Your session has expired. Please login again to continue.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginAgain} variant="contained" color="primary">
            Login Again
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

export default function App() {
  return (
   <>
      <AppContent />
  </>
  );
}
