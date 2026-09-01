import { access, readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const root = resolve(process.cwd(), 'dist-oj');
const required = ['index.html', 'en/index.html', 'uk/index.html'];

for (const file of required) await access(join(root, file));

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(absolute));
    else output.push(absolute);
  }
  return output;
}

const files = await walk(root);
const relativeFiles = files.map((file) => relative(root, file).replaceAll('\\', '/'));
const wasm = relativeFiles.filter((file) => file.endsWith('.wasm'));
if (wasm.length === 0) throw new Error('oj build emitted no WebAssembly artifact.');

for (const file of wasm) {
  const artifact = await readFile(join(root, file));
  if (artifact.length < 8 || !artifact.subarray(0, 4).equals(Buffer.from([0x00, 0x61, 0x73, 0x6d]))) {
    throw new Error(`${file} is not a valid WebAssembly binary.`);
  }
}

const workerEntries = ['analytics', 'component-mesh', 'horizon-compute'];
const workers = Object.fromEntries(workerEntries.map((entry) => {
  const file = relativeFiles.find((candidate) => candidate.includes(`${entry}.worker-`) && candidate.endsWith('.js'));
  if (!file) throw new Error(`oj build emitted no ${entry} worker entry.`);
  return [entry, file];
}));

for (const route of required) {
  const html = await readFile(join(root, route), 'utf8');
  const references = [...html.matchAll(/(?:src|href)="([^"#?]+)"/g)]
    .map((match) => match[1])
    .filter((value) => value.startsWith('/') && !value.startsWith('//'));
  for (const reference of references) {
    const target = join(root, reference.slice(1));
    await access(target).catch(() => {
      throw new Error(`${route} references missing build output ${reference}.`);
    });
  }
}

const bytes = (await Promise.all(files.map((file) => stat(file))))
  .reduce((total, entry) => total + entry.size, 0);
const report = {
  tool: 'oj',
  version: '0.1.11',
  routes: required,
  files: files.length,
  wasm,
  workers,
  bytes,
};
console.log(JSON.stringify(report, null, 2));
