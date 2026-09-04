const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const frontendOut = path.join(rootDir, 'frontend', 'out');
const rootDist = path.join(rootDir, 'dist');
const frontendDist = path.join(rootDir, 'frontend', 'dist');

if (fs.existsSync(frontendOut)) {
  fs.mkdirSync(rootDist, { recursive: true });
  fs.mkdirSync(frontendDist, { recursive: true });
  fs.cpSync(frontendOut, rootDist, { recursive: true });
  fs.cpSync(frontendOut, frontendDist, { recursive: true });
  console.log('✓ Successfully synced static build output to dist/ and frontend/dist/');
} else {
  console.error('Error: frontend/out directory was not found after next build.');
  process.exit(1);
}
