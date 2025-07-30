import  React, { Suspense , lazy } from 'react';
import  ReactDOM from 'react-dom/client';
import './index.css'      // ← make sure this import is here
import { createBrowserRouter, RouterProvider } from 'react-router';
// In your main App.js or layout component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = lazy(() => import('./App'));
const Layout = lazy(() => import('./layouts/dashboard'));
const DashboardPage = lazy(() => import('./pages/index'));
const Projects = lazy(() => import('./pages/Projects'));
const Managing = lazy(() => import('./pages/Managing'));
const SignInPage = lazy(() => import('./pages/signIn'));
const MainReport = lazy(()=>import("./report/MainReport"))

import { Provider } from 'react-redux';
import store from "./store"
import { SocketProvider } from './context/SocketContext';
import { SessionProvider } from './SessionContext'; // 👈 updated import
import DoProjectPage from './pages/DoProject';
import CreateProject from './pages/CreateProject';
import DevOps from "./pages/DevOps"
import EditProjectForm from './pages/EditProject';
import DevOpsInfoForm from './pages/DevOpsInfo';
import BugReport from './pages/BugReport';
import ProjectReport from './pages/ProjectReport';
import ReportDetailsManager from './pages/ReportDetailsManager';
import UserProjectReport from './pages/UserProjectReport';
import UserReportDetails from './pages/UserReportDetails';

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
          {
            path:'do-project/:id/:projectManager' , 
            Component:DoProjectPage
          }, 
          {
            path:"create_project",
            Component:CreateProject
            
          }, 
          {
            path:"devops",
            Component:DevOps
            
          },
           {
            path:"edit_project/:projectId",
            Component:EditProjectForm
            
          },
           {
            path:"devopsinfo/:projectId",
            Component:DevOpsInfoForm
            
          }, 
          {
            path:"bugReportForm/:id/:wstg/:label/:projectId/:projectManager",
            Component:BugReport
            
          },
           {
            path:"project/:projectId/reports",
            Component:ProjectReport
            
          },
          {
            path:"project/report/:reportId",
            Component:ReportDetailsManager
            
          }, 
          {
            path:"reports/:projectId",
            Component:UserProjectReport
            
          }, 
          {
            path:"user/report/:reportId",
            Component:UserReportDetails
            
          } , 
           {
            path:"userreports",
            Component:MainReport
            
          }

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
              <ToastContainer 
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    <SocketProvider>
    <Suspense fallback={<div>Loading...</div>}>

    <RouterProvider router={router} />
    </Suspense>

    </SocketProvider>
    </SessionProvider>
    </Provider>
  </React.StrictMode>, 
);
