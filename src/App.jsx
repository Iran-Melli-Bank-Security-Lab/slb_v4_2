import  React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BugReportIcon from '@mui/icons-material/BugReport';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from 'react-router';
import { SessionContext } from './SessionContext';

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
    icon: <AssignmentIcon/>,
  },
  {
    segment: 'managing',
    title: 'Managing',
    icon: <ManageAccountsIcon/>,
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BugReportIcon/>,
  },
];

const BRANDING = {
  title: 'My Toolpad Core App',
};

export default function App() {
  const [session, setSession] = React.useState(null);
  const navigate = useNavigate();

  const signIn = React.useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  const signOut = React.useCallback(() => {
    setSession(null);
    navigate('/sign-in');
  }, [navigate]);

  const sessionContextValue = React.useMemo(() => ({ session, setSession }), [session, setSession]);

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <ReactRouterAppProvider
        navigation={NAVIGATION}
        session={session}
        authentication={{ signIn, signOut }}
      >
        <Outlet />
      </ReactRouterAppProvider>
     </SessionContext.Provider>
  );
}
