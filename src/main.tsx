import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './main.module.scss'
import App from './App.tsx'

import { TaskStoreProvider } from './store/context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskStoreProvider>
      <App />
    </TaskStoreProvider>
  </StrictMode>
)
