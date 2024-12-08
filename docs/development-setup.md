# Development Setup Documentation

## Overview
The application consists of two main parts:
1. A React frontend (client)
2. An Express.js API backend with AWS DynamoDB integration

## Development Mode Setup

### Prerequisites
- Node.js installed
- AWS credentials configured with DynamoDB access
- Environment variables set up in `/api/.env`:
  ```
  AWS_REGION=your-region
  AWS_ACCESS_KEY_ID=your-key
  AWS_SECRET_ACCESS_KEY=your-secret
  DYNAMODB_TABLE_NAME=your-table
  ```

### Starting Development Servers

The application requires running two separate servers in development:

1. **API Server** (Port 8000)
   ```bash
   cd api
   npm install
   npm run dev
   ```
   This starts the Express server using nodemon for hot reloading.

2. **Frontend Server** (Port 3000)
   ```bash
   cd client
   npm install
   npm run dev
   ```
   This starts the Vite development server.

### Development Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│   React App     │   ���→→   │   Express API    │   →→→   │   DynamoDB  │
│  localhost:3000 │         │  localhost:8000  │         │             │
└─────────────────┘         └──────────────────┘         └─────────────┘
```

- Frontend makes API calls to `http://localhost:8000/api/*`
- API server handles requests and interacts with DynamoDB
- CORS is configured to allow localhost connections

### Configuration Files

1. **API Configuration** (`api/index.js`):
   - Express server setup
   - CORS configuration
   - AWS/DynamoDB connection
   - API endpoints

2. **Frontend Configuration** (`client/src/config.js`):
   ```javascript
   export const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://steamreport.lauriecrean.dev/api'
     : 'http://localhost:8000/api';
   ```

### Testing
Playwright tests are configured to run against the development servers:
```javascript
// client/playwright.config.js
webServer: {
  command: 'npm run dev',
  port: 3000,
  reuseExistingServer: !process.env.CI,
}
```

### Development Workflow
1. Start the API server
2. Start the frontend server
3. Access the application at `http://localhost:3000`
4. API endpoints are available at `http://localhost:8000/api/*`

### Available API Endpoints
- `POST /api/user-result`: Save user quiz results
- `GET /api/network-board`: Retrieve network board data
- `DELETE /api/user-result/:id`: Delete a user result
- `GET /health`: API health check

### Verifying Development Setup

You can verify the setup is working by:

1. **Check API Server**
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"ok", ...}`

2. **Check Frontend**
   - Open `http://localhost:3000`
   - Should see the React application
   - No console errors

3. **Verify Database Connection**
   - Submit a test result through the UI
   - Check Network Board displays results
   - Verify data in DynamoDB table

## Common Development Issues

1. **API Connection Errors**
   - Ensure both servers are running
   - Check CORS configuration
   - Verify API_BASE_URL in config.js

2. **AWS/DynamoDB Issues**
   - Verify AWS credentials in .env
   - Check AWS region configuration
   - Ensure DynamoDB table exists

3. **Port Conflicts**
   - Ensure ports 3000 and 8000 are available
   - Check for other running services on these ports

### Development Logs

When running correctly, you should see logs like:
```
API Server:
🚀 Server Status:
   • Running on: http://localhost:8000
   • Environment: development
   • AWS Region: eu-west-2
   • DynamoDB Table: NetworkBoard

Frontend:
  VITE v4.3.9  ready in 326 ms
  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Environment Variables
Make sure all required environment variables are set in both development servers:

1. **API Server** (.env):
   ```
   AWS_REGION=eu-west-2
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   DYNAMODB_TABLE_NAME=NetworkBoard
   NODE_ENV=development
   ```

2. **Frontend** (.env):
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

### Development Tools

#### Nodemon
The API server uses nodemon for development, which automatically restarts the server when files change. This is configured in `api/package.json`:

```javascript
{
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

Benefits of nodemon:
- Auto-restarts server on file changes
- Watches for file extensions: js, mjs, json
- Improves development workflow
- Only used in development (not production)

To see nodemon in action:
```bash
cd api
npm run dev

[nodemon] 2.0.22
[nodemon] to restart at any time, enter 'rs'
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
```

#### Vite
The frontend uses Vite as its development server and build tool, configured in `client/package.json`:

```javascript
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.9"
  }
}
```

Benefits of Vite:
- Extremely fast hot module replacement (HMR)
- Built-in support for React
- Optimized build process
- Development server with instant updates

To see Vite in action:
```bash
cd client
npm run dev

  VITE v4.3.9  ready in 326 ms
  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

#### Playwright
End-to-end testing is handled by Playwright, configured in `client/playwright.config.js`:

```javascript
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@playwright/test": "^1.35.1"
  }
}
```

Benefits of Playwright:
- Cross-browser testing
- Automatic wait capabilities
- Network request interception
- Visual regression testing
- Test isolation

Running Playwright tests:
```bash
cd client
npm run test       # Run tests in headless mode
npm run test:ui    # Run tests with UI mode
```

#### Development Server Architecture
The development environment uses multiple tools working together:

```
┌─────────────┐    ┌──────────────┐    ┌───────────────┐
│   Vite Dev  │    │   Nodemon    │    │   Playwright  │
│   Server    │    │   (Express)  │    │   (Testing)   │
│  Port 3000  │    │  Port 8000   │    │   Port auto  │
└─────────────┘    └──────────────┘    └───────────────┘
      ↓                   ↓                    ↓
┌─────────────────────────────────────────────────────┐
│                  Development Flow                    │
├─────────────────────────────────────────────────────┤
│ 1. Vite serves frontend with hot reloading          │
│ 2. Nodemon watches API changes                      │
│ 3. Playwright runs automated tests                  │
└─────────────────────────────────────────────────────┘
```
