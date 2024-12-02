
# Vercel Monorepo Deployment Issue: Frontend 404s When Deployed from Root

How can I maintain a monorepo structure while correctly serving both the frontend and API from Vercel? I'd prefer not to split into separate deployments if possible, as the monorepo structure helps with CORS and security issues, particularly in Safari browsers.

I'm working on a MERN stack application with the following structure:

```
steam-report-mern/
├── api/
│   └── index.js
├── client/
│   ├── dist/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
```

When deploying from the root directory:
- ✅ API endpoints work correctly (`/api/test` returns 200)
- ❌ Frontend routes return 404s
- ❌ Static assets (CSS/JS) return 404s

However, when deploying from the `client` directory:
- ✅ Frontend works perfectly
- ❌ Can't access the API

# Testing Method with vercel build and Invoke-WebRequest

The tests are conducted with `vercel build` and `Invoke-WebRequest` from a Windows PowerShell terminal.

`vercel build` is run from the root directory. This should build both the API and the frontend ready to be deployed.

It should return something like this when run locally, and of course can be checked in the vercel build log when deployed.

```bash
vercel build
```

should return something like this:

```bash
vite v4.3.3 building for production...
✓ 157 modules transformed.
client/dist/index.html                                 0.47 kB │ gzip:  0.31 kB
client/dist/assets/index-212a1c80.css                249.45 kB │ gzip: 35.03 kB
client/dist/assets/personalityQuestions-7ebff02e.js    6.98 kB │ gzip:  2.78 kB
client/dist/assets/index-73d86b56.js                 255.70 kB │ gzip: 83.07 kB
✓ built in 1.62s
```

If successful, the `Invoke-WebRequest` command will return a 200 status code for both the API and the frontend.

- The Frontend is expected to serve the static assets from the `dist` directory and deploy to `http://steamreport.lauriecrean.dev/`.

- The API is expected to be deployed to `http://steamreport.lauriecrean.dev/api/`. Specifically the endpoint `http://steamreport.lauriecrean.dev/api/test` should return a 200 status code with a JSON body containing `{"message":"API is working"}`.

- The following commands should be used to test the API and frontend:

```bash
Invoke-WebRequest -Uri "https://steamreport.lauriecrean.dev/" -Method GET -UseBasicParsing
Invoke-WebRequest -Uri "https://steamreport.lauriecrean.dev/api/test" -Method GET -UseBasicParsing
```

should return a 200 status code for the API and a 404 status code for the frontend.

```bash
PS C:\Projects\steam-report-mern> Invoke-WebRequest -Uri "https://steamreport.lauriecrean.dev/api/test" -Method GET -UseBasicParsing 


StatusCode        : 200
StatusDescription : OK
Content           : {"message":"API is working"}
```

```bash
Invoke-WebRequest -Uri "https://steamreport.lauriecrean.dev/" -Method GET -UseBasicParsing


StatusCode        : 200
StatusDescription : OK
```

# Problem Files

The key problem files are:

- `client/vercel.json` which handles the deployment
- `client/vite.config.js` which handles the build process
- `client/package.json` which handles the dependencies and build script

Testing was done with using the root folder, and achieved an API only deployment. Seeing as the frontend was working when deployed from the client directory, it seems more desirable to work from the client directory -- and try and get the API working from there.

## 1. client/vercel.json

```json
{
    "version": 2,
    "builds": [
        {
            "src": "api/index.js",
            "use": "@vercel/node"
        },
        {
            "src": "client/package.json",
            "use": "@vercel/static-build",
            "config": {
                "distDir": "dist",
                "buildCommand": "cd client && npm install && npm run build"
            }
        }
    ],
    "routes": [
        {
            "src": "/api/(.*)",
            "dest": "/api/index.js"
        },
        {
            "src": "/assets/(.*)",
            "dest": "/dist/assets/$1"
        },
        {
            "handle": "filesystem"
        },
        {
            "src": "/(.*)",
            "dest": "/dist/index.html"
        }
    ]
}
```

## 2. client/vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  base: '',
  css: {
    postcss: {
     plugins: [tailwindcss],
    },
   },
});
```

## 3. client/package.json

```json
{
  "dependencies": {
    "docsify": "^4.13.1",
    "node-fetch": "^3.3.2",
    "repo-to-one-file": "^1.0.2"
  },
  "type": "module",
  "scripts": {
    "start": "node api/index.js && cd client && npm install && npm run build",
    "vercel-build": "cd client && npm install && npm run build"
  }
}
```


## 1.1 "builds" section in client/vercel.json

```json
   "distDir": "dist"
```

I have tried changing "distDir" value from `dist` to `client/dist` in the client build, but that didn't work. It returned `Error: No Output Directory named "dist" found after the Build completed. You can configure the Output Directory in your Project Settings.`

I don't think the builds are the problem, seeing as we get the return message:

```bash
vite v4.3.3 building for production...
✓ 157 modules transformed.
dist/index.html                                 0.47 kB │ gzip:  0.31 kB
dist/assets/index-212a1c80.css                249.45 kB │ gzip: 35.03 kB
dist/assets/personalityQuestions-7ebff02e.js    6.98 kB │ gzip:  2.78 kB
dist/assets/index-73d86b56.js                 255.70 kB │ gzip: 83.07 kB
✓ built in 1.54s
```

regardless of the vite config, the build process completes successfully.

### 1.2.1: "dest" combinations in Vercel.json routes section

```json
        {
            "dest": "/api/index.js"
        },
        {
            "dest": "/assets/$1"
        },
        {
            "dest": "/$1.svg"
        },
        {
            "dest": "/index.html"
        }
    ]
```

I have tried removing the /client/dist from the routes section, but that didn't work. The hope was that this would correctly serve the frontend from the root directory.


### 1.3.1: Vite config "outDir" value:

I have tried changing the "outDir" value from `dist` to `client/dist` in the client vite config this did change the build log

```bash
vite v4.3.3 building for production...
✓ 157 modules transformed.
client/dist/index.html                                 0.47 kB │ gzip:  0.31 kB
client/dist/assets/index-212a1c80.css                249.45 kB │ gzip: 35.03 kB
client/dist/assets/personalityQuestions-7ebff02e.js    6.98 kB │ gzip:  2.78 kB
client/dist/assets/index-73d86b56.js                 255.70 kB │ gzip: 83.07 kB
✓ built in 1.62s
```

using `/client/dist` in the vite config changes the build log to

```bash
vite v4.3.3 building for production...
✓ 157 modules transformed.
../../../client/dist/index.html                                 0.47 kB │ gzip:  0.31 kB
../../../client/dist/assets/index-212a1c80.css                249.45 kB │ gzip: 35.03 kB        
../../../client/dist/assets/personalityQuestions-7ebff02e.js    6.98 kB │ gzip:  2.78 kB        
../../../client/dist/assets/index-73d86b56.js                 255.70 kB │ gzip: 83.07 kB        
✓ built in 1.72s
Installing dependencies...
```

## 1.2 Package.json:

I've tried setting up the start script to run the build command in the client directory.

---

# Project Environment
- Vite 4.3.3
- Vercel CLI 39.1.1
- Node v20.5.1
- npm 10.2.5
- Codebase: https://github.com/lmcrean/steam-report-mern

Any insights would be greatly appreciated!


# Next Steps

- TODO Tuesday:
    - [ ] Debug further back in development, try and get the API working in the console.log.
- TODO Wednesday:
    - [ ] Fix the bug.