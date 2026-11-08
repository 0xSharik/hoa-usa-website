import React from 'react'
import { initializeEmailJS } from './utils/emailService';
import { initializeSilentAuth } from './firebase/silentAuth';

// Initialize services
initializeEmailJS();
initializeSilentAuth();

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
