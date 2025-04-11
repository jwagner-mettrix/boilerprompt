import { StrictMode, Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import '@/App.css'
import App from './App.tsx'

// Determine the wrapper based on the environment
const RootWrapper = import.meta.env.DEV ? StrictMode : Fragment;

createRoot(document.getElementById('root')!).render(
  <RootWrapper>
    <App />
  </RootWrapper>,
)
