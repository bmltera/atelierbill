const fs = require('fs');
const path = require('path');

const lightningPackages = {
  'lightningcss-android-arm64': {
    version: '1.32.0',
    resolved: 'https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.32.0.tgz',
    integrity: 'sha512-YK7/ClTt4kAK0vo6w3X+Pnm0D2cf2vPHbhOXdoNti1Ga0al1P4TBZhwjATvjNwLEBCnKvjJc2jQgHXH0NEwlAg==',
    cpu: ['arm64'],
    dev: true,
    license: 'MPL-2.0',
    optional: true,
    os: ['android'],
    engines: { node: '>= 12.0.0' },
    funding: { type: 'opencollective', url: 'https://opencollective.com/parcel' }
  },
  'lightningcss-darwin-arm64': {
    version: '1.32.0',
    resolved: 'https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.32.0.tgz',
    integrity: 'sha512-RzeG9Ju5bag2Bv1/lwlVJvBE3q6TtXskdZLLCyfg5pt+HLz9BqlICO7LZM7VHNTTn/5PRhHFBSjk5lc4cmscPQ==',
    cpu: ['arm64'],
    dev: true,
    license: 'MPL-2.0',
    optional: true,
    os: ['darwin'],
    engines: { node: '>= 12.0.0' },
    funding: { type: 'opencollective', url: 'https://opencollective.com/parcel' }
  },
  'lightningcss-darwin-x64': {
    version: '1.32.0',
    resolved: 'https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.32.0.tgz',
    integrity: 'sha512-U+QsBp2m/s2wqpUYT/6wnlagdZbtZdndSmut/NJqlCcMLTWp5muCrID+K5UJ6jqD2BFshejCYXniPDbNh73V8w==',
    cpu: ['x64'],
    dev: true,
    license: 'MPL-2.0',
    optional: true,
    os: ['darwin'],
    engines: { node: '>= 12.0.0' },
    funding: { type: 'opencollective', url: 'https://opencollective.com/parcel' }
  },
  'lightningcss-freebsd-x64': {
    version: '1.32.0',
    resolved: 'https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.32.0.tgz',
    integrity: 'sha512-JCTigedEksZk3tHTTthnMdVfGf61Fky8Ji2E4YjUTEQX14xiy/lTzXnu1vwiZe3bYe0q+SpsSH/CTeDXK6WHig==',
    cpu: ['x64'],
    dev: true,
    license: 'MPL-2.0',
    optional: true,
    os: ['freebsd'],
    engines: { node: '>= 12.0.0' },
    funding: { type: 'opencollective', url: 'https://opencollective.com/parcel' }
  },
  'lightningcss-linux-arm-gnueabihf': {
    version: '1.32.0',
    resolved: 'https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.32.0.tgz',
    integrity: 'sha512-x6rnnpRa2GL0zQOkt6rts3YDPzduLpWvwAF6EMhXFVZXD4tPrBkEFqzGowzCsIWsPjqSK+tyNEODUBXeeVHSkw==',
    cpu: ['arm'],
    dev: true,
    license: 'MPL-2.0',
    optional: true,
    os: ['linux'],
    engines: { node: '>= 12.0.0' },
    funding: { type: 'opencollective', url: 'https://opencollective.com/parcel' }
  },
  'lightningcss-linux-arm64-gnu': {
    version: '1.32.0',
    resolved: 'https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.32.0.tgz',
    integrity: 'sha512-0nnMyoyOLRJXfbMOilaSRcLH3Jw5z9HDNGfT/gwCPgaDjnx0i8w7vBzFLFR1f6CMLKF8gVbebmkUN3fa/kQJpQ==',
    cpu: ['arm64'],
    dev: true,
    license: 'MPL-2.0',
    optional: true,
    os: ['linux'],
    engines: { node: '>= 12.0.0' },
    funding: { type: 'opencollective', url: 'https://opencollective.com/parcel' }
  },
  'lightningcss-linux-arm64-musl': {
    version: '1.32.0',
    resolved: 'https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.32.0.tgz',
    integrity: 'sha512-UpQkoenr4UJEzgVIYpI80lDFvRmPVg6oqboNHfoH4CQIfNA+HOrZ7Mo7KZP02dC6LjghPQJeBsvXhJod/wnIBg==',
    cpu: ['arm64'],
    dev: true,
    license: 'MPL-2.0',
    optional: true,
    os: ['linux'],
    engines: { node: '>= 12.0.0' },
    funding: { type: 'opencollective', url: 'https://opencollective.com/parcel' }
  },
  'lightningcss-linux-x64-gnu': {
    version: '1.32.0',
    resolved: 'https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.32.0.tgz',
    integrity: 'sha512-V7Qr52IhZmdKPVr+Vtw8o+WLsQJYCTd8loIfpDaMRWGUZfBOYEJeyJIkqGIDMZPwPx24pUMfwSxxI8phr/MbOA==',
    cpu: ['x64'],
    dev: true,
    license: 'MPL-2.0',
    optional: true,
    os: ['linux'],
    engines: { node: '>= 12.0.0' },
    funding: { type: 'opencollective', url: 'https://opencollective.com/parcel' }
  },
  'lightningcss-linux-x64-musl': {
    version: '1.32.0',
    resolved: 'https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.32.0.tgz',
    integrity: 'sha512-bYcLp+Vb0awsiXg/80uCRezCYHNg1/l3mt0gzHnWV9XP1W5sKa5/TCdGWaR/zBM2PeF/HbsQv/j2URNOiVuxWg==',
    cpu: ['x64'],
    dev: true,
    license: 'MPL-2.0',
    optional: true,
    os: ['linux'],
    engines: { node: '>= 12.0.0' },
    funding: { type: 'opencollective', url: 'https://opencollective.com/parcel' }
  },
  'lightningcss-win32-arm64-msvc': {
    version: '1.32.0',
    resolved: 'https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.32.0.tgz',
    integrity: 'sha512-8SbC8BR40pS6baCM8sbtYDSwEVQd4JlFTOlaD3gWGHfThTcABnNDBda6eTZeqbofalIJhFx0qKzgHJmcPTnGdw==',
    cpu: ['arm64'],
    dev: true,
    license: 'MPL-2.0',
    optional: true,
    os: ['win32'],
    engines: { node: '>= 12.0.0' },
    funding: { type: 'opencollective', url: 'https://opencollective.com/parcel' }
  },
  'lightningcss-win32-x64-msvc': {
    version: '1.32.0',
    resolved: 'https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.32.0.tgz',
    integrity: 'sha512-Amq9B/SoZYdDi1kFrojnoqPLxYhQ4Wo5XiL8EVJrVsB8ARoC1PWW6VGtT0WKCemjy8aC+louJnjS7U18x3b06Q==',
    cpu: ['x64'],
    dev: true,
    license: 'MPL-2.0',
    optional: true,
    os: ['win32'],
    engines: { node: '>= 12.0.0' },
    funding: { type: 'opencollective', url: 'https://opencollective.com/parcel' }
  }
};

function patchFile(filePath, isRoot) {
  if (!fs.existsSync(filePath)) return;
  console.log(`Patching ${filePath}...`);
  const lock = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const packages = lock.packages || {};

  const optDepsMap = {};
  for (const name of Object.keys(lightningPackages)) {
    optDepsMap[name] = '1.32.0';
  }

  // Update root or workspace optionalDependencies
  if (isRoot) {
    if (packages['']) {
      packages[''].optionalDependencies = {
        ...(packages[''].optionalDependencies || {}),
        ...optDepsMap
      };
    }
    if (packages['frontend']) {
      packages['frontend'].optionalDependencies = {
        ...(packages['frontend'].optionalDependencies || {}),
        ...optDepsMap
      };
    }
  } else {
    if (packages['']) {
      packages[''].optionalDependencies = {
        ...(packages[''].optionalDependencies || {}),
        ...optDepsMap
      };
    }
  }

  // Update lightningcss optionalDependencies wherever it appears
  for (const pkgPath of Object.keys(packages)) {
    if (pkgPath.endsWith('node_modules/lightningcss')) {
      packages[pkgPath].optionalDependencies = {
        ...(packages[pkgPath].optionalDependencies || {}),
        ...optDepsMap
      };
    }
  }

  // Insert package entries for all platforms
  for (const [name, data] of Object.entries(lightningPackages)) {
    if (isRoot) {
      packages[`frontend/node_modules/${name}`] = { ...data };
      packages[`frontend/node_modules/lightningcss/node_modules/${name}`] = { ...data };
      packages[`node_modules/${name}`] = { ...data };
    } else {
      packages[`node_modules/${name}`] = { ...data };
      packages[`node_modules/lightningcss/node_modules/${name}`] = { ...data };
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
  console.log(`✓ Successfully patched ${filePath}`);
}

const rootDir = path.resolve(__dirname, '..');
patchFile(path.join(rootDir, 'package-lock.json'), true);
patchFile(path.join(rootDir, 'frontend', 'package-lock.json'), false);
