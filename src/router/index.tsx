import { createHashRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import App from '../App';
import NotFound from '../pages/NotFound';
import Search from '../pages/Search';
import Feed from '../pages/Feed';
import Profile from '../pages/Profile';
import Dialogs from '../pages/Dialogs';
import Chat from '../pages/Chat';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import LandingLayout from '../components/layouts/LandingLayout';
import Landing from '../pages/Landing';

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: App,
    children: [
      {
        element: <LandingLayout />,
        children: [
          {
            path: '/',
            Component: Landing,
          },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: '/app',
            Component: Feed,
          },
          {
            path: '/app/search',
            Component: Search,
          },
          {
            path: '/app/profile/:userId',
            Component: Profile,
          },
          {
            path: '/app/dialogs',
            Component: Dialogs,
          },
          {
            path: '/app/dialogs/:dialogId',
            Component: Chat,
          },
        ],
      },
      
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/auth/login',
            Component: Login,
          },
          {
            path: '/auth/register',
            Component: Register,
          },
        ],
      },

      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
];

const router = createHashRouter(routes);

export default router;
