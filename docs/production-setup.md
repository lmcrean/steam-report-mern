# Production API Setup

Production setup uses

- vercel.json
- package.json
- api/index.js
- api/package.json

To test the API in production we run `tests/production-healthcheck.test.js` with `npm run test:prod`.


to deploy the API to vercel we run `vercel --prod` from the root of the project.

