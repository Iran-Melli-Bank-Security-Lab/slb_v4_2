import  React from 'react';
import  ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import OrdersPage from './pages/orders';
import SignInPage from './pages/signIn';
import  RequireAuth from './components/RequireAuth' 

// const router = createBrowserRouter([
//   {
//     Component: App,
//     children: [
//       {
//         path: '/',
//         Component: Layout,
//         children: [
//           {
//             path: '/',
//             Component: DashboardPage,
//           },
//           {
//             path: '/orders',
//             Component: OrdersPage,
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

 
const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: RequireAuth, // 🔐 Wrap with ProtectedRoute
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
                path: '/orders',
                Component: OrdersPage,
              },
            ],
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
    <RouterProvider router={router} />
  </React.StrictMode>,
);
