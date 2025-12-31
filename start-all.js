const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to run backend
function startBackend() {
  console.log('Starting backend server...');

  // Backend is now in the parent directory (hackathon_4/backend)
  const backendDir = path.join(__dirname, '..', 'backend');

  // Check if backend directory exists
  if (!fs.existsSync(backendDir)) {
    console.error('Error: Backend directory not found at ' + backendDir);
    process.exit(1);
  }

  // Check if backend requirements exist
  const backendRequirements = path.join(backendDir, 'requirements.txt');
  if (!fs.existsSync(backendRequirements)) {
    console.error('Error: Backend requirements.txt not found!');
    process.exit(1);
  }

  // Use python on both Windows and Unix (both work with .exe/.cmd lookup)
  const pythonCommand = 'python';

  const backend = spawn(pythonCommand, ['-m', 'uvicorn', 'src.app:app', '--host', '127.0.0.1', '--port', '8000', '--reload'], {
    cwd: backendDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: process.env.PATH || '',
      PYTHONPATH: backendDir,
      PYTHONUNBUFFERED: '1'
    },
    shell: true
  });

  backend.on('error', (err) => {
    console.error('Failed to start backend:', err.message);
  });

  backend.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
    process.exit(code);
  });

  return backend;
}

// Function to run frontend
function startFrontend() {
  console.log('Starting frontend server...');

  // Create environment with PATH explicitly included
  const env = {
    ...process.env,
    PATH: process.env.PATH || ''
  };

  // Use npm.cmd on Windows, npm on Unix
  const isWindows = process.platform === 'win32';
  const npmCommand = isWindows ? 'npm.cmd' : 'npm';

  const frontend = spawn(npmCommand, ['run', 'start', '--', '--host', '127.0.0.1', '--port', '3000'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: env,
    shell: true
  });

  frontend.on('error', (err) => {
    console.error('Failed to start frontend:', err.message);
  });

  frontend.on('close', (code) => {
    console.log(`Frontend process exited with code ${code}`);
    process.exit(code);
  });

  return frontend;
}

// Check if Node.js and Python are available
function checkDependencies() {
  const { execSync } = require('child_process');

  try {
    execSync('node --version', { stdio: 'pipe' });
  } catch (e) {
    console.error('Error: Node.js is not installed or not in PATH');
    process.exit(1);
  }

  try {
    execSync('python --version', { stdio: 'pipe' });
  } catch (e) {
    try {
      execSync('python3 --version', { stdio: 'pipe' });
    } catch (e2) {
      console.error('Error: Python is not installed or not in PATH');
      process.exit(1);
    }
  }
}

// Start both servers
console.log('Starting both frontend and backend servers...');
console.log('Note: This script will start both servers simultaneously');
console.log('Frontend will be available at: http://127.0.0.1:3000');
console.log('Backend API will be available at: http://127.0.0.1:8000');
console.log('');

checkDependencies();

const backendProcess = startBackend();
const frontendProcess = startFrontend();

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down servers...');
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
});