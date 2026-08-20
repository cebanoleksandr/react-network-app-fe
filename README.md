# Network

A social-network frontend built with React 19, TypeScript, and Vite. Feed with stories, posts (likes, comments, bookmarks), direct messaging over sockets, groups, people search, and a profile system — with light/dark theming and i18n (English, Russian, Ukrainian, Polish, Spanish).

Live demo: `https://cebanoleksandr.github.io/react-network-app-fe/`

## Tech stack

- **React 19 + TypeScript**, bundled with **Vite**
- **react-router-dom v7** (`createHashRouter`) for routing
- **Redux Toolkit** for state (`userSlice`, `postsSlice`, `alertSlice`)
- **MUI** (`@mui/material`, `@mui/icons-material`) with a custom theme, plus **Tailwind CSS v4** for utility styling
- **axios**, with a shared instance handling bearer-token auth and silent refresh-on-401
- **socket.io-client** for realtime chat (typing indicators, read receipts)
- **react-hook-form** + **yup** for forms
- **i18next** / **react-i18next** for translations, loaded from `public/locales`

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` (if present) or create a `.env` with:

```
VITE_BASE_URL=       # REST API base URL
VITE_SOCKET_URL=     # Socket.IO server URL
VITE_SUPABASE_URL=   # Supabase project ref, used for media URLs
```

## Scripts

| Command           | Description                                  |
| ------------------ | --------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                     |
| `npm run build`     | Type-check (`tsc -b`) and build for production |
| `npm run lint`      | Run ESLint over the project                   |
| `npm run preview`   | Preview the production build locally          |
| `npm run deploy`    | Build and publish `dist/` to GitHub Pages      |

There is no test setup in this repo currently.

## Project structure

```
src/
  router/         route table (createHashRouter), auth-gating loaders
  services/       one file per API domain, shared axios instance + interceptors
  store/          Redux Toolkit slices and typed hooks
  components/
    layouts/      route-level shells (MainLayout, AuthLayout, LandingLayout, Header, Sidebar)
    business/     feature components tied to domain data (posts/, etc.)
    popups/       modal dialogs built on a shared BasePopup
    UI/           generic reusable UI
  pages/          route-level page components
public/
  locales/        i18next translation files, per language
```

### Routing

Three top-level branches, each under its own layout:

- `/` → `LandingLayout` → `Landing`
- `/app/*` → `MainLayout` — the authenticated shell (Feed, Search, People, Groups, Photos, Music, Video, Games, Settings, Profile, Dialogs, Chat), gated by a loader that redirects to `/auth/login` when no token is present
- `/auth/*` → `AuthLayout` (Login, Register, Reset Password), gated by a loader that redirects to `/app` when a token is already present

Auth gating reads `localStorage['network-token']` directly in the route loaders, not through React context.

### Services

Each domain has its own service file (`auth.service.ts`, `posts.service.ts`, `users.service.ts`, `chats.service.ts`, `groupsService.ts`, `mediaService.ts`, `storyService.ts`) built on the shared `api` axios instance from `src/services/index.ts`. `src/services/interceptors.ts` attaches the bearer token to every request and silently refreshes on 401, queuing concurrent requests while a refresh is in flight. Shared DTOs live in `src/services/interfaces.ts`.

### Realtime

`src/services/socket.ts` wraps `socket.io-client` in a singleton, typed against the server/client event interfaces, and is connected explicitly with the auth token — not on import.

## Conventions

- The auth token is stored under `localStorage['network-token']`; router loaders and the axios interceptor both read/write this key.
- New domain types go in `src/services/interfaces.ts` rather than being declared locally in components.
- New API calls belong in the relevant `*.service.ts` file using the shared `api` instance, not ad hoc axios calls.
