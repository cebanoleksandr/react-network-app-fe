import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppThemeProvider from './components/providers/AppThemeProvider.tsx'
import './services/interceptors.ts'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.tsx'
import './i18n'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>
    </Provider>
  </StrictMode>,
)
