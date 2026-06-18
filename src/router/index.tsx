import { createBrowserRouter, redirect } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import App from '../App';
import NotFound from '../pages/NotFound';
import Search from '../pages/Search';
import Feed from '../pages/Feed';
import Profile from '../pages/Profile';
import Dialogs from '../pages/Dialogs';
import Chat from '../pages/Chat';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import LandingLayout from '../components/layouts/LandingLayout';
import Landing from '../pages/Landing';
import People from '../pages/People';
import Groups from '../pages/Groups';
import Photos from '../pages/Photos';
import Music from '../pages/Music';
import Video from '../pages/Video';
import Games from '../pages/Games';
import Settings from '../pages/Settings';
import ResetPassword from '../pages/auth/ResetPassword';

const loader = () => {
  const token = localStorage.getItem("network-token");
  if (!token) return redirect("/auth/login");
  return null;
}

const authLoader = () => {
  const token = localStorage.getItem("network-token");
  if (token) return redirect("/app");
  return null;
}

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
        Component: MainLayout,
        loader,
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
            path: 'people',
            Component: People,
          },
          {
            path: 'groups',
            Component: Groups,
          },
          {
            path: 'photos',
            Component: Photos,
          },
          {
            path: 'music',
            Component: Music,
          },
          {
            path: 'video',
            Component: Video,
          },
          {
            path: 'games',
            Component: Games,
          },
          {
            path: 'settings',
            Component: Settings,
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
            path: 'chat/:chatId',
            Component: Chat,
          },
        ],
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        loader: authLoader,
        children: [
          {
            path: 'login',
            Component: Login,
          },
          {
            path: 'register',
            Component: Register,
          },
          {
            path: 'reset-password',
            Component: ResetPassword,
          }
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
