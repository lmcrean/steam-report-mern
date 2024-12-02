# Vercel API Returns 404 When Deploying from Client Directory in Monorepo

How can I properly configure Vercel to serve both the frontend and API when deploying from the client directory in a monorepo structure? The key challenge is accessing the API files that live in a sibling directory while maintaining the monorepo structure.

## Problem
When deploying a MERN stack application from the client directory of a monorepo to Vercel, the API endpoints return 404 errors. The frontend works perfectly, but any API calls fail with:

```
404: NOT_FOUND
Code: NOT_FOUND
ID: lhr1:lhr1::rkhhg-1733058610304-2a9a890b3a94
```

inspecting the deployed static assets, the build suggests index.js is there


```bash

/assets/index-98a74854.js #this should contain the api
256 kB

/assets/index-513856e0.css # this and files below render as expected
245 kB

/assets/personalityQuestions-7ebff02e.js
6.98 kB

/index.html
468 B 

/tailwind.svg
771 B 

/vite.svg
1.5 kB
```

there is no index.js in the /api/test URL when inspecting sources

## Project Structure
```
steam-report-mern/
├── api/
│   └── index.js         # Express API with routes
├── client/
│   ├── dist/
│   ├── src/
│   ├── package.json     # Client dependencies and build scripts
│   ├── vite.config.js   # Vite configuration
│   └── vercel.json      # Vercel deployment configuration. I am deploying from the client directory.
```

I am deploying from the client directory, I had issues with the frontend when deploying from the root and figured getting the API working from here would be a smaller problem to solve.

# Current Configuration

## client/vercel.json
```json
{
    "version": 2,
    "builds": [
        {
            "src": "package.json",
            "use": "@vercel/static-build",
            "config": {
                "distDir": "dist"
            }
        },
        {
            "src": "server/index.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/api/test",
            "dest": "server/index.js"
        },
        {
            "src": "/api/(.*)",
            "dest": "/api/$1"
        },
        {
            "src": "/assets/(.*)",
            "dest": "/assets/$1"
        },
        {
            "handle": "filesystem"
        },
        {
            "src": "/((?!api/.*).*)",
            "dest": "/index.html"
        }
    ]
}
```

## client/package.json
```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "build": "vite build",
    "vercel-build": "npm install && vite build"
  },
  "vercel": {
    "includeFiles": [
      "../api/**"
    ],
    "buildCommand": "npm run vercel-build"
  }
}
```

## client/src/main.jsx

This file does reveal some console.logs, however they return 404.

```javascript
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
```

This returns

```bash
API Debug Info: {
  baseUrl: 'https://steam-report-frontend.vercel.app/api',
  testEndpoint: 'https://steam-report-frontend.vercel.app/api/test',
  environment: 'production',
  envVars: {
    BASE_URL: './',
    DEV: 'false',
    PROD: 'true',
    VITE_API_URL: 'https://steam-report-frontend.vercel.app/api'
  },
  location: 'https://steam-report-frontend.vercel.app/'
}
```

```
index-24109c29.js:172 GET https://steam-report-frontend.vercel.app/api/test 404 (Not Found)
```

```bash
API Response: 
{status: 404, statusText: '', headers: {…}}
index-24109c29.js:172 
 API Error: 
{message: `Unexpected token 'T', "The page c"... is not valid JSON`, type: undefined, stack: `SyntaxError: Unexpected token 'T', "The page c"... is not valid JSON`}
message
: 
"Unexpected token 'T', \"The page c\"... is not valid JSON"
```

# inspecting the index-24109c29.js file, the invalid line is the fetch call.

```js
fetch(`${getApiUrl()}/test`).then(e => (console.log("API Response:", {
    status: e.status,
    statusText: e.statusText,
    headers: Object.fromEntries(e.headers.entries())
}),
```

## api/index.js

Cannot find these console.logs anywhere in the deployed build. I would expect them in the logs somewhere.

```bash
import express from 'express';
import cors from 'cors';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import fs from 'fs';

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'default-table-name';

dotenv.config();

console.log('API Starting...');
console.log('Environment:', process.env.NODE_ENV);

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
    console.log('Test route hit');
    res.json({ 
        message: 'API is working',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Debug route
app.get('/debug', (req, res) => {
    console.log('Debug route hit');
    res.json({
        message: 'Debug endpoint',
        env: process.env.NODE_ENV,
        currentDirectory: process.cwd(),
        timestamp: new Date().toISOString()
    });
});

// Export the app
export default app;

// Enhanced middleware logging
app.use(cors({
  origin: [
    'https://steam-report-frontend-khosanq59-lmcreans-projects.vercel.app',
    'https://steam-report-frontend.vercel.app',
    'https://steamreport.lauriecrean.dev',
    'https://steamreport.lauriecrean.dev/api',
    'https://steam-report-frontend.vercel.app/',
    'https://steam-report-frontend.vercel.app/api'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

console.log('⚙️ Express middleware configured:', {
  cors: '✓ (with credentials)',
  jsonParser: '✓'
});

```


# Console Output from client/src/main.jsx
```bash
API Debug Info: {
  baseUrl: 'https://steam-report-frontend.vercel.app/api',
  testEndpoint: 'https://steam-report-frontend.vercel.app/api/test',
  environment: 'production',
  envVars: {
    BASE_URL: './',
    DEV: 'false',
    PROD: 'true',
    VITE_API_URL: 'https://steam-report-frontend.vercel.app/api'
  },
  location: 'https://steam-report-frontend.vercel.app/'
}
```

## client/package.json

```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "playwright test --ui --timeout=600000",
    "vercel-build": "npm install && vite build"
  },
  "dependencies": {
    "...": "..."
    
  },
  "devDependencies": {
    "...": "..."
  },
  "vercel": {
    "includeFiles": [
      "../api/**"
    ],
    "buildCommand": "npm run vercel-build"
  }
}

```


## What I've Tried

1. **Different "Builds" { "src": "..." } Path Configurations in `client/vercel.json` **:
- Using `"../api/index.js"` -- from the `/client/vercel.json` file, this should be the correct path, since it's in a sibling directory (`/api/index.js`)
   - Using `"/api/index.js"`
   - Using `"api/index.js"`

2. **Various "Routes" { "src": "/api/(.*)", "dest": "/api/$1" } Configurations in `client/vercel.json`**:
   - using `"/api/(.*)"` as `"Src"` value

3. **Debugging with client/src/main.jsx**:
   - console.log the apiUrl reveals the 404 error
   - the client should be able to reach the api at `https://steam-report-frontend.vercel.app/api`

## Expected Behavior
- Frontend should serve from `/`
- API should serve from `/api/*` 
- Specifically `/api/test` should return `{"message": "API is working"}`

## Actual Behavior
- Frontend serves correctly
- All API routes return 404
- Build process completes successfully but API files seem to be missing or inaccessible

# Environment
- Vite 4.3.3
- Vercel CLI 39.1.1
- Node v22.11.0
- npm 10.9.0
