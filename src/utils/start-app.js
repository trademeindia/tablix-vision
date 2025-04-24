
#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

// Define content types
const contentTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

console.log('Starting Lovable development server...');

// Install dependencies if needed
try {
  if (!fs.existsSync(path.resolve(process.cwd(), 'node_modules'))) {
    console.log('Installing dependencies first...');
    execSync('npm install', { stdio: 'inherit' });
  }
} catch (e) {
  console.error('Failed to check or install dependencies:', e);
}

// First, try to check if Vite is available
try {
  console.log('Checking for Vite installation...');
  
  try {
    // Check if vite exists in node_modules
    const viteExists = fs.existsSync(path.resolve(process.cwd(), 'node_modules', '.bin', 'vite')) || 
                      fs.existsSync(path.resolve(process.cwd(), 'node_modules', '.bin', 'vite.cmd'));
                      
    if (viteExists) {
      console.log('Vite found in node_modules, starting Vite server...');
      const child = exec('npx vite', { stdio: 'inherit' });
      
      child.stdout.on('data', (data) => {
        console.log(data.toString());
      });
      
      child.stderr.on('data', (data) => {
        console.error(data.toString());
      });
      
      child.on('exit', (code) => {
        if (code !== 0) {
          console.log('Vite exited with code ' + code + ', falling back to simple HTTP server');
          startHttpServer();
        }
      });
      
      return; // If Vite starts successfully, exit this script
    } else {
      console.log('Vite not found in node_modules, falling back to simple HTTP server');
      startHttpServer();
    }
  } catch (e) {
    console.log('Failed to start Vite, falling back to simple HTTP server');
    startHttpServer();
  }
} catch (error) {
  console.log('Error checking for Vite:', error.message);
  console.log('Falling back to simple HTTP server');
  startHttpServer();
}

// Create a basic HTTP server as fallback
function startHttpServer() {
  const PORT = process.env.PORT || 8080;
  console.log(`Starting simple HTTP server on port ${PORT}...`);

  const server = http.createServer((req, res) => {
    // Default to index.html
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './index.html';
    }

    // Resolve the file path from project root
    filePath = path.resolve(process.cwd(), filePath);
    
    // Get file extension
    const extname = path.extname(filePath);
    const contentType = contentTypes[extname] || 'application/octet-stream';

    // Read file
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // If requesting a specific file that doesn't exist, try serving index.html
          // This enables client-side routing
          fs.readFile(path.resolve(process.cwd(), 'index.html'), (err, content) => {
            if (err) {
              res.writeHead(404);
              res.end('File not found');
              return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
        } else {
          // Server error
          res.writeHead(500);
          res.end(`Server Error: ${err.code}`);
        }
        return;
      }

      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop the server');
  });

  // Handle server errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Try a different port.`);
    } else {
      console.error('Server error:', err.message);
    }
    process.exit(1);
  });
}
