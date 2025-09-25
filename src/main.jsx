import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import './App.css';
import { worker } from './mocks/browser.js';

// Avoid MSW warnings for non-API requests (e.g., document navigation to "/campaigns").
worker.start({ onUnhandledRequest: 'bypass' }).then(() =>
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  )
);
