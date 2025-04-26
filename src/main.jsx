import  React from 'react';
import  ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import Projects from './pages/Projects';
import SignInPage from './pages/signIn';
import  RequireAuth from './components/RequireAuth' 
import { Provider } from 'react-redux';
import store from "./store"
import { SocketProvider } from './context/SocketContext';

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
        ],
      },
      {
        path: '/sign-in',
        Component: SignInPage,
      },
    ],
  },
]);

 
// const router = createBrowserRouter([
//   {
//     Component: App,
//     children: [
//       {
//         path: '/',
//         Component: RequireAuth, // 🔐 Wrap with ProtectedRoute
//         children: [
//           {
//             path: '/',
//             Component: Layout,
//             children: [
//               {
//                 path: '/',
//                 Component: DashboardPage,
//               },
//               {
//                 path: '/orders',
//                 Component: OrdersPage,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/sign-in',
//         Component: SignInPage,
//       },
//     ],
//   },
// ]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <SocketProvider>

    <RouterProvider router={router} />
    </SocketProvider>

    </Provider>
  </React.StrictMode>, 
);
