import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FplProvider } from './context/FplContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FplProvider>
      <App />
    </FplProvider>
  </StrictMode>,
)