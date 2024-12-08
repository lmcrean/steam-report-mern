import fetch from 'node-fetch';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const API_DIR = join(__dirname, '..');

describe('Development API Health Check', () => {
  const API_URL = 'http://localhost:8000';
  let serverProcess;

  beforeAll(async () => {
    // Verify package.json exists
    const packageJsonPath = join(API_DIR, 'package.json');
    if (!existsSync(packageJsonPath)) {
      throw new Error(`Cannot find package.json at ${packageJsonPath}`);
    }

    console.log('Starting server from directory:', API_DIR);
    
    // Start the development server
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    serverProcess = spawn(npmCommand, ['run', 'dev'], {
      cwd: API_DIR,
      stdio: 'inherit',
      shell: true
    });

    // Wait for server to start
    await new Promise((resolve, reject) => {
      let checkCount = 0;
      const maxChecks = 10;
      
      const checkServer = async () => {
        try {
          const response = await fetch(`${API_URL}/health`);
          if (response.ok) {
            console.log('Server started successfully');
            resolve();
          } else {
            throw new Error(`Server responded with status: ${response.status}`);
          }
        } catch (error) {
          checkCount++;
          if (checkCount >= maxChecks) {
            reject(new Error(`Server failed to start after ${maxChecks} attempts: ${error.message}`));
          } else {
            // Try again in 1 second
            setTimeout(checkServer, 1000);
          }
        }
      };

      // Start checking
      checkServer();

      // Handle server process errors
      serverProcess.on('error', (err) => {
        reject(new Error(`Failed to start server: ${err.message}`));
      });

      serverProcess.on('exit', (code) => {
        reject(new Error(`Server process exited with code ${code}`));
      });
    });
  });

  afterAll(() => {
    // Cleanup: Kill the server process if it exists
    if (serverProcess) {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
      } else {
        serverProcess.kill('SIGTERM');
      }
    }
  });

  test('health endpoint returns OK status', async () => {
    console.log('Testing development health endpoint:', `${API_URL}/health`);
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    console.log('Development health check response:', {
      status: response.status,
      data
    });
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
    expect(data.aws).toBeDefined();
  });
});
