const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function ensureLightningCss() {
  console.log('[ensure_lightningcss] Running platform check:', process.platform, process.arch);

  if (process.platform !== 'linux') {
    console.log('[ensure_lightningcss] Not running on Linux. Nothing to do.');
    return;
  }

  const rootDir = path.resolve(__dirname, '..');
  const frontendDir = path.join(rootDir, 'frontend');

  const targets = [
    path.join(frontendDir, 'node_modules', 'lightningcss', 'lightningcss.linux-x64-gnu.node'),
    path.join(frontendDir, 'node_modules', 'lightningcss-linux-x64-gnu', 'lightningcss.linux-x64-gnu.node'),
    path.join(rootDir, 'node_modules', 'lightningcss', 'lightningcss.linux-x64-gnu.node'),
    path.join(rootDir, 'node_modules', 'lightningcss-linux-x64-gnu', 'lightningcss.linux-x64-gnu.node')
  ];

  const allExist = targets.every(t => fs.existsSync(t));
  if (allExist) {
    console.log('[ensure_lightningcss] Linux native binaries already present.');
    return;
  }

  console.log('[ensure_lightningcss] Downloading lightningcss-linux-x64-gnu@1.32.0...');
  const tarballUrl = 'https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.32.0.tgz';
  const tmpTarball = path.join(rootDir, '.lightningcss-linux-x64-gnu.tgz');
  const tmpExtractDir = path.join(rootDir, '.lightningcss-extract');

  try {
    await download(tarballUrl, tmpTarball);
    fs.mkdirSync(tmpExtractDir, { recursive: true });

    // Extract package/lightningcss.linux-x64-gnu.node using tar
    execSync(`tar -xzf "${tmpTarball}" -C "${tmpExtractDir}"`);

    const extractedNodeFile = path.join(tmpExtractDir, 'package', 'lightningcss.linux-x64-gnu.node');
    const extractedPkgJson = path.join(tmpExtractDir, 'package', 'package.json');

    if (!fs.existsSync(extractedNodeFile)) {
      throw new Error(`Extracted file not found at ${extractedNodeFile}`);
    }

    // Deploy to all target paths
    for (const target of targets) {
      const parentDir = path.dirname(target);
      fs.mkdirSync(parentDir, { recursive: true });
      fs.copyFileSync(extractedNodeFile, target);
      console.log(`[ensure_lightningcss] Installed binary to ${target}`);
    }

    // Ensure package.json exists in lightningcss-linux-x64-gnu directories
    const pkgJsonTargets = [
      path.join(frontendDir, 'node_modules', 'lightningcss-linux-x64-gnu', 'package.json'),
      path.join(rootDir, 'node_modules', 'lightningcss-linux-x64-gnu', 'package.json')
    ];

    for (const pkgTarget of pkgJsonTargets) {
      if (fs.existsSync(extractedPkgJson)) {
        fs.mkdirSync(path.dirname(pkgTarget), { recursive: true });
        fs.copyFileSync(extractedPkgJson, pkgTarget);
      }
    }

    console.log('[ensure_lightningcss] Successfully prepared Linux native lightningcss binaries!');
  } catch (err) {
    console.error('[ensure_lightningcss] Error ensuring lightningcss Linux binary:', err.message);
  } finally {
    try {
      if (fs.existsSync(tmpTarball)) fs.unlinkSync(tmpTarball);
      if (fs.existsSync(tmpExtractDir)) fs.rmSync(tmpExtractDir, { recursive: true, force: true });
    } catch (_) {}
  }
}

ensureLightningCss();
