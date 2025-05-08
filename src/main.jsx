import  React, { Suspense , lazy } from 'react';
import  ReactDOM from 'react-dom/client';
import './index.css'      // ← make sure this import is here
import { createBrowserRouter, RouterProvider } from 'react-router';
const App = lazy(() => import('./App'));
const Layout = lazy(() => import('./layouts/dashboard'));
const DashboardPage = lazy(() => import('./pages/index'));
const Projects = lazy(() => import('./pages/Projects'));
const Managing = lazy(() => import('./pages/Managing'));
const SignInPage = lazy(() => import('./pages/signIn'));

import { Provider } from 'react-redux';
import store from "./store"
import { SocketProvider } from './context/SocketContext';
import { SessionProvider } from './SessionContext'; // 👈 updated import

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '/',
            Component: DashboardPage,
          },
          {
            path: '/projects',
            Component: Projects,
          },
          {
            path: '/managing',
            Component: Managing ,
          },
        ],
      },
      {
        path: '/sign-in',
        Component: SignInPage,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <SessionProvider>
    <SocketProvider>
    <Suspense fallback={<div>Loading...</div>}>

    <RouterProvider router={router} />
    </Suspense>

    </SocketProvider>
    </SessionProvider>
    </Provider>
  </React.StrictMode>, 
);
