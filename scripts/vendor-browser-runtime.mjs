import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const packageRoot = join(root, 'node_modules', 'es-module-shims');
const destination = join(root, 'public', 'vendor', 'es-module-shims');
const files = ['es-module-shims.js', 'es-module-shims-typescript.js'];

const manifest = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
if (manifest.version !== '2.8.4') {
  throw new Error(`Expected es-module-shims 2.8.4, received ${manifest.version}.`);
}

await mkdir(destination, { recursive: true });
await Promise.all(files.map(async (file) => {
  const source = join(packageRoot, 'dist', file);
  const target = join(destination, file);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}));

console.log(`Vendored ES Module Shims ${manifest.version} with its on-demand Amaro TypeScript transformer.`);
