
# Vercel Monorepo Deployment Issue: Frontend 404s When Deployed from Root

How can I maintain a monorepo structure while correctly serving both the frontend and API from Vercel? I'd prefer not to split into separate deployments if possible, as the monorepo structure helps with CORS and security issues, particularly in Safari browsers.

## Problem Description
I'm working on a MERN stack application with the following structure:

```
steam-report-mern/
├── api/
│   └── index.js
├── client/
│   ├── dist/
│   ├── src/
│   └── package.json
└── vercel.json
```

When deploying from the root directory:
- ✅ API endpoints work correctly (`/api/test` returns 200)
- ❌ Frontend routes return 404s
- ❌ Static assets (CSS/JS) return 404s

However, when deploying from the `client` directory:
- ✅ Frontend works perfectly
- ❌ Can't access the API

## What I've Tried

### 1. Root Deployment Configuration

I have tried most combinations of dist/ and client/ in order to locate the root directory. This is the Vercel file that deploys the API but not the frontend.

I also have this same file in the client directory, which deploys the frontend but not the API.

I'm willing to predict this as the key problem file.

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

### 1.2 Vite config:

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

### 2. Verification Tests
```bash
# API works
curl -I https://steamreport.lauriecrean.dev/api/test
# Returns 200 OK

# Frontend fails
curl -I https://steamreport.lauriecrean.dev/
# Returns 404 Not Found

# Assets fail
curl -I https://steamreport.lauriecrean.dev/assets/index-212a1c80.css
# Returns 404 Not Found
```

### 3. Build Output
The build process completes successfully:
```bash
vite v4.3.3 building for production...
✓ 157 modules transformed.
dist/index.html                     0.47 kB
dist/assets/index-212a1c80.css    249.45 kB
dist/assets/index-73d86b56.js     255.70 kB
✓ built in 1.75s
```



## Environment
- Vite for frontend build
- Node.js backend
- Vercel CLI 35.1.0
- Node v20.5.1
- npm 10.2.5

Any insights would be greatly appreciated!


Codebase: https://github.com/lmcrean/steam-report-mern



## Error Messages in full for CURL VERIFICATION TESTS

```bash

PS C:\Projects\steam-report-mern> curl -I https://steamreport.lauriecrean.dev/

cmdlet Invoke-WebRequest at command pipeline position 1
Supply values for the following parameters:
Uri: 
PS C:\Projects\steam-report-mern> Invoke-WebRequest -Uri "https://steamreport.lauriecrean.dev/" -Method HEAD
>>                                                              Invoke-WebRequest : The remote server returned an error: (404)  Not Found.                                                      At line:1 char:1                                                
+ Invoke-WebRequest -Uri 
"https://steamreport.lauriecrean.dev/" -Method ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.Ht 
   tpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExcep  
  tion
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Mi 
   crosoft.PowerShell.Commands.InvokeWebRequestCommand
 
PS C:\Projects\steam-report-mern> Invoke-WebRequest -Uri "https://steamreport.lauriecrean.dev/assets/index-212a1c80.css" -Method HEAD
>> 
Invoke-WebRequest : The remote server returned an error: (404) 
Not Found.
At line:1 char:1
+ Invoke-WebRequest -Uri 
"https://steamreport.lauriecrean.dev/assets/in ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.Ht 
   tpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExcep  
  tion
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Mi 
   crosoft.PowerShell.Commands.InvokeWebRequestCommand

PS C:\Projects\steam-report-mern> Invoke-WebRequest -Uri "https://steamreport.lauriecrean.dev/api/test" -Method HEAD
>>


StatusCode        : 200
StatusDescription : OK
Content           :
RawContent        : HTTP/1.1 200 OK
                    Access-Control-Allow-Headers: Origin,       
                    X-Requested-With, Content-Type, Accept      
                    Access-Control-Allow-Methods:
                    GET,HEAD,PUT,PATCH,POST,DELETE
                    Access-Control-Allow-Origin: *
                    Age: 0
                    Str...
Forms             : {}
Headers           : {[Access-Control-Allow-Headers, Origin,     
                    X-Requested-With, Content-Type, Accept],    
                    [Access-Control-Allow-Methods,
                    GET,HEAD,PUT,PATCH,POST,DELETE],
                    [Access-Control-Allow-Origin, *], [Age,     
                    0]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : System.__ComObject
RawContentLength  : 0



PS C:\Projects\steam-report-mern> Invoke-WebRequest -Uri "https://steamreport.lauriecrean.dev/index.html" -Method HEAD
Invoke-WebRequest : The remote server returned an error: (404)     
Not Found.
At line:1 char:1
+ Invoke-WebRequest -Uri
"https://steamreport.lauriecrean.dev/index.htm ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    
~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.Ht     
   tpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExcep      
  tion
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Mi     
   crosoft.PowerShell.Commands.InvokeWebRequestCommand
```
