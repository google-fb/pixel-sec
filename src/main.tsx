import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { injectZpixFont } from './assets/zpix/inject'
import './index.css'
import App from './App.tsx'

injectZpixFont()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
