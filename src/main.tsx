import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app.tsx'
import { Toaster } from "react-hot-toast"
import { LoadingFallback } from './common/loader/loading.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <App />
      <Toaster />
    </Suspense>
  </StrictMode>,
)
