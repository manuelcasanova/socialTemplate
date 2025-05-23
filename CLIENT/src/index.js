import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { SuperAdminSettingsProvider } from './context/SuperAdminSettingsProvider';
import { AdminSettingsProvider } from './context/AdminSettingsProvider';
import { ScreenSizeProvider } from './context/ScreenSizeContext';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AuthProvider>
        <SuperAdminSettingsProvider>
          <AdminSettingsProvider>
            <ScreenSizeProvider>
              <App />
            </ScreenSizeProvider>
          </AdminSettingsProvider>
        </SuperAdminSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
