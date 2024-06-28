const { join } = require('node:path');
const fs = require('node:fs');
const { buildSync } = require('esbuild');

const { dependencies, peerDependencies, version } = require("../package.json");

const opts  = {
  entryPoints: ['src/index.ts'],
  absWorkingDir: join(__dirname, '..'),
  bundle: true,
  sourcemap: true,
  external: Object.keys({ ...dependencies, ...peerDependencies }),
};

buildSync({
  ...opts,
  platform: 'neutral',
  outfile: 'dist/esm/index.js',
});

fs.writeFileSync("dist/esm/package.json", JSON.stringify({
  type: "module",
  version
}, null, 2));

buildSync({
  ...opts,
  platform: 'node',
  outfile: 'dist/umd/index.js',
});