

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TimezoneProvider } from './context/TimezoneContext';
import './styles/mobile-layout.css';
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TimezoneProvider>
      <App />
    </TimezoneProvider>
  </React.StrictMode>
);