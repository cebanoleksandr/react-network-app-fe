# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`tsc -b`) then production build via Vite
- `npm run lint` — run ESLint over the project
- `npm run preview` — preview the production build

There is no test setup in this repo currently.

## Architecture

React 19 + TypeScript SPA (Vite), a social-network frontend ("network"). Key layers:

- **Routing** (`src/router/index.tsx`): a single `routes` array (react-router-dom v7, `createBrowserRouter`) nested under `App` (`src/App.tsx`, just an `<Outlet />`). Three top-level branches, each wrapped in its own layout:
  - `/` → `LandingLayout` → `Landing`
  - `/app/*` → `MainLayout`, gated by a `loader` that redirects to `/auth/login` when `localStorage['network-token']` is absent — this is the authenticated app shell (Feed, Search, People, Groups, Photos, Music, Video, Games, Settings, Profile, Dialogs, Chat).
  - `/auth/*` → `AuthLayout`, gated by `authLoader` that redirects to `/app` when a token is already present.
  Auth gating is done entirely via these loaders reading `localStorage`, not React context/guards.

- **Services** (`src/services/`): one file per domain (`auth.service.ts`, `posts.service.ts`, `users.service.ts`, `chats.service.ts`, `groupsService.ts`, `mediaService.ts`, `storyService.ts`), all built on a shared axios instance `api` exported from `src/services/index.ts` (`baseURL` from `VITE_BASE_URL`). `src/services/interceptors.ts` is imported for its side effects: it attaches the bearer token from `localStorage['network-token']` to every request and implements silent-refresh-on-401 (queues concurrent requests while a `/auth/refresh` call is in flight, replays them after). `src/services/interfaces.ts` holds all shared DTOs/response types (User, Post, Comment, ChatRoom, Message, IStory, IGroup, etc.) used across services, components, and store slices.

- **Realtime** (`src/services/socket.ts`): a singleton `socketService` wrapping `socket.io-client`, typed against `ServerToClientEvents`/`ClientToServerEvents` from `interfaces.ts`. Connected explicitly with the auth token (not auto-connected on import); used for chat (new message, typing, read receipts) and inbox join events.

- **State** (`src/store/`): Redux Toolkit store with three slices — `userSlice`, `postsSlice`, `alertSlice` (global alert/toast state). Use the typed hooks in `src/store/hooks.ts` (`useAppDispatch`, `useAppSelector`) instead of the raw react-redux hooks.

- **Components** (`src/components/`):
  - `layouts/` — route-level shells (`MainLayout`, `AuthLayout`, `LandingLayout`, `Header`, `Sidebar`).
  - `business/` — feature components tied to domain data (currently `posts/`: `PostList`, `PostItem`, `PostComments`, `CreatePostBlock`, etc.).
  - `popups/` — modal dialogs (built on a shared `BasePopup`), e.g. `DeletePostPopup`, `UpdatePostPopup`, `LogoutPopup`, `StoriesViewerPopup`.
  - `UI/` — generic reusable UI (`CustomAlert`, `LanguageSwitcher`).

- **Styling**: MUI (`@mui/material`, `@mui/icons-material`) with a custom theme in `src/theme.ts`, plus Tailwind CSS v4 (via `@tailwindcss/vite`) available for utility classes. Both systems coexist.

- **Forms**: `react-hook-form` + `@hookform/resolvers` + `yup` schemas colocated with their page, e.g. `src/pages/auth/loginSchema.ts`, `registerSchema.ts`, `resetPasswordSchema.ts`.

- **i18n**: `src/i18n.ts` configures `i18next` with `i18next-http-backend` (loads `/locales/{{lng}}/{{ns}}.json` from `public/`) and browser language detection, cached in `localStorage['i18nextLng']`.

- **Env vars** (Vite `import.meta.env`, see `.env`): `VITE_BASE_URL` (REST API base), `VITE_SOCKET_URL` (Socket.IO server), `VITE_SUPABASE_URL`.

## Conventions

- Auth token is stored under the fixed key `network-token` in `localStorage`; both the router loaders and the axios interceptor read/write this key directly — keep them in sync if the auth scheme changes.
- New domain data types go in `src/services/interfaces.ts` rather than being declared locally in components.
- New API calls belong in the relevant `*.service.ts` file using the shared `api` instance from `src/services/index.ts`, not ad hoc axios calls.
