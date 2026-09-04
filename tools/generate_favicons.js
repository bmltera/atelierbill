#!/usr/bin/env node
/**
 * tools/generate_favicons.js
 *
 * Node.js wrapper for generate_favicons.py to extract the Atelier Bill "AB"
 * monogram logo, crop out extraneous text, and generate site favicons.
 */

const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, 'generate_favicons.py');
const args = process.argv.slice(2);

console.log('[*] Running Atelier Bill favicon generator...');
const py = spawn('python', [scriptPath, ...args], { stdio: 'inherit' });

py.on('close', (code) => {
  if (code === 0) {
    console.log('[OK] Favicon generation completed successfully.');
  } else {
    console.error(`[!] Favicon generator exited with error code ${code}`);
    process.exit(code);
  }
});
