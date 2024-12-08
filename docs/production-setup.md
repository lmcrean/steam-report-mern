# Production API Setup

Production setup uses

- `vercel.json` for API routing
- `package.json` for API dependencies
- `client/src/config/environment.js` for API URL configuration
- `api/index.js` for API server
- `api/package.json` for API dependencies

To test the API in production we run 
- `api/tests/production-healthcheck.test.js` with `npm run test:prod`.
- `api/tests/development-healthcheck.test.js` with `npm run test:dev`.


to deploy the API to vercel we run `vercel --prod` from the root of the project.

# Development and Production production tests return successful.

```powershell
PS C:\Projects\steam-report-mern> npm run test:dev

> test:dev
> cd api && npm run test:dev


> api@1.0.0 test:dev
> node --experimental-vm-modules node_modules/jest/bin/jest.js development-healthcheck.test.js

  console.log
    Starting server from directory: C:\Projects\steam-report-mern\api

      at Object.<anonymous> (tests/development-healthcheck.test.js:22:13)

(node:32280) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 RUNS  tests/development-healthcheck.test.js              

> api@1.0.0 dev
> nodemon index.js
 RUNS  tests/development-healthcheck.test.js
[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
⚙️ Express middleware configured: { cors: '✓ (with credenttials)', jsonParser: '✓' }
🔑 AWS credentials check: { region: '✓', accessKey: '✓', secretKey: '✓' }

🚀 Server Status:
   • Running on: http://localhost:8000
   • Environment: test
   • AWS Region: eu-west-2
   • DynamoDB Table: NetworkBoard

(node:29048) NOTE: The AWS SDK for JavaScript (v2) is in maintenance mode.
 SDK releases are limited to address critical bug fixes and security issues only.

Please migrate your code to use AWS SDK for JavaScript (v3).
For more information, check the blog post at https://a.co/cUPnyil
(Use `node --trace-warnings ...` to show where the warning RUNS  tests/development-healthcheck.test.js
📥 Incoming request: { method: 'GET', path: '/health', baseUrl: '', originalUrl: '/hea JavaScript (v3).
For more information, check the blog post at https://a.co/cUPnyil
(Use `node --trace-warnings ...` to show where the warning RUNS  tests/development-healthcheck.test.js
📥 Incoming request: { method: 'GET', path: '/health', baseUrl: '', originalUrl: '/health' }
  console.log
    Server started successfully

      at Timeout.checkServer [as _onTimeout] (tests/development-healthcheck.test.js:41:21)

  console.log
    Testing development health endpoint: http://localhost:8000/health

      at Object.<anonymous> (tests/development-healthcheck.test.js:83:13)


 RUNS  tests/development-healthcheck.test.js
📥 Incoming request: { method: 'GET', path: '/health', baseUrl: '', originalUrl: '/health' }
  console.log
    Development health check response: {   
      status: 200,
      data: {
        status: 'ok',
        timestamp: '2024-12-08T15:39:25.356Z',
        aws: 'configured',
        debug: { path: '/health', baseUrl: '', originalUrl: '/health' }
      }
    }

      at Object.<anonymous> (tests/development-healthcheck.test.js:87:13)

 PASS  tests/development-healthcheck.test.js
  Development API Health Check
    √ health endpoint returns OK status (12 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.371 s, estimated 3 s        
Ran all test suites matching /development-healthcheck.test.js/i.
PS C:\Projects\steam-report-mern> vercel --prod
Vercel CLI 35.1.0
🔍  Inspect: https://vercel.com/lmcreans-projects/steam-report-mern/9ZvNWviReJJecZUNtKFSmsRu95r2 [7s]
✅  Production: https://steam-report-mern-6yv3vuo2g-lmcreans-projects.vercel.app [7s] 
PS C:\Projects\steam-report-mern> npm run test:prod

> test:prod
> cd api && npm run test:prod

      at Object.<anonymous> (tests/production-healthcheck.test.js:7:13)

(node:30424) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
  console.log
    Response status: 200

      at Object.<anonymous> (tests/production-healthcheck.test.js:10:13)

  console.log
    Response headers: {
      'access-control-allow-credentials': [ 'true' ],
      age: [ '0' ],
      'cache-control': [ 'public, max-age=0, must-revalidate' ],  
      'content-length': [ '145' ],
      'content-type': [ 'application/json; charset=utf-8' ],      
      date: [ 'Sun, 08 Dec 2024 15:41:32 GMT' ],
      etag: [ 'W/"91-DkO685UOfbIe4aPnYAcGTrHUpRM"' ],
      server: [ 'Vercel' ],
      'strict-transport-security': [ 'max-age=63072000' ],        
      vary: [ 'Origin' ],
      'x-powered-by': [ 'Express' ],
      'x-vercel-cache': [ 'MISS' ],
      'x-vercel-id': [ 'lhr1::iad1::kwxlb-1733672491888-f4eed4c1636a' ]
    }

      at Object.<anonymous> (tests/production-healthcheck.test.js:11:13)

  console.log
    Response data: {
      status: 'ok',
    }

      at Object.<anonymous> (tests/production-healthcheck.test.js:21:13)

 PASS  tests/production-healthcheck.test.js  Production API Health Check
    √ health endpoint returns OK status (439 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.742 s, estimated 1 s
Ran all test suites matching /production-healthcheck.test.js/i.
```


# The frontend accesses the API through client/src/config/environment.js

```javascript
const ENV = {
  development: {
    API_URL: 'http://localhost:8000'
  },
  production: {
    API_URL: 'https://steamreport.lauriecrean.dev'
  }
};

export const getApiUrl = () => {
  const isProduction = window.location.hostname !== 'localhost';
  return isProduction ? ENV.production.API_URL : ENV.development.API_URL;
}; 
```