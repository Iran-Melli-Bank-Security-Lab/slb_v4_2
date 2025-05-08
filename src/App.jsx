import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BugReportIcon from '@mui/icons-material/BugReport';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from 'react-router';
import { useSession } from './SessionContext'; // 👈 updated import
import validateSession from './utils/validateSession';

const NAVIGATION = [
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
    segment: 'managing',
    title: 'Managing',
    icon: <ManageAccountsIcon />,
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BugReportIcon />,
  },
];



function AppContent() {
  const { session, clearSession, loading } = useSession();
  const navigate = useNavigate();

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
      await fetch('http://localhost:4000/api/auth/logout', {
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

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      session={session}
      authentication={{ signIn, signOut }}
    >
      <Outlet />
    </ReactRouterAppProvider>
  );
}

export default function App() {
  return (
   <>
      <AppContent />
  </>
  );
}
