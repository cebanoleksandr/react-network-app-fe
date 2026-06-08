import { createBrowserRouter } from 'react-router-dom';
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
            index: true,
            Component: Landing,
          },
        ],
      },
      {
        path: 'app',
        element: <MainLayout />,
        children: [
          {
            index: true,
            Component: Feed,
          },
          {
            path: 'search',
            Component: Search,
          },
          {
            path: 'profile/:userId',
            Component: Profile,
          },
          {
            path: 'dialogs',
            Component: Dialogs,
          },
          {
            path: 'dialogs/:dialogId',
            Component: Chat,
          },
        ],
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            Component: Login,
          },
          {
            path: 'register',
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

const router = createBrowserRouter(routes);

export default router;
