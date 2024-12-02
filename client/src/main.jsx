import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Use relative path to API since it's in a sibling directory
const apiUrl = import.meta.env.VITE_API_URL || '../api';

// Debug API configuration
console.log('API Debug Info:', {
    baseUrl: apiUrl,
    testEndpoint: `${apiUrl}/test`,
    environment: import.meta.env.MODE,
    envVars: {
        VITE_API_URL: import.meta.env.VITE_API_URL || 'not set',
        BASE_URL: import.meta.env.BASE_URL || 'not set',
        DEV: import.meta.env.DEV ? 'true' : 'false',
        PROD: import.meta.env.PROD ? 'true' : 'false'
    },
    location: window.location.href
});

// Test API connection
fetch(`${apiUrl}/test`)
    .then(response => {
        console.log('API Response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });
        return response.json();
    })
    .then(data => console.log('API Data:', data))
    .catch(error => console.error('API Error:', {
        message: error.message,
        type: error.type,
        stack: error.stack
    }));

// Export for use in other components
export const API_BASE_URL = apiUrl;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
