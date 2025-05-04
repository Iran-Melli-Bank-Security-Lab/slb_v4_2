import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout, ToolbarActions } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useSession } from '../SessionContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, IconButton } from '@mui/material';
import { useSocket } from '../context/SocketContext';
import { useEffect } from 'react';

const MyToolbarActions = () => {

  const socket = useSocket()
  useEffect(()=>{

    socket.on("assignedUser" , (data)=>{
      console.log("socket data in here : " , data )
    })

  }, [socket])
  
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <ToolbarActions />
    
    
    

      <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="primary"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
      
    </div>
  );
};


export default function Layout() {
  
  const { session } = useSession();
  const location = useLocation();

  if (!session) {
    // Add the `callbackUrl` search parameter
    const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;

    return <Navigate to={redirectTo} replace />;
  }

  return (
    <DashboardLayout
    defaultSidebarCollapsed={false }
    sidebarExpandedWidth={250}
    slots={{toolbarActions:MyToolbarActions}}
    >
      <PageContainer>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
