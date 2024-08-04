import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import './layout/index.css'
import "react-day-picker/dist/style.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
