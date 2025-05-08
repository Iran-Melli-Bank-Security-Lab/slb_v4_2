import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useSession } from '../SessionContext';
import { Suspense, lazy } from 'react';

// 👇 Lazy load MyToolbarActions
const MyToolbarActions = lazy(() => import('./MyToolbarActions'));

export default function Layout() {
  const { session } = useSession();
  const location = useLocation();

  if (!session) {
    const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <DashboardLayout
      defaultSidebarCollapsed={false}
      sidebarExpandedWidth={250}
      // 👇 Wrap with Suspense fallback
      slots={{
        toolbarActions: () => (
          <Suspense fallback={<div>Loading toolbar...</div>}>
            <MyToolbarActions />
          </Suspense>
        ),
      }}
    >
      <PageContainer>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
