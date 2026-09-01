import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const cargoHome = process.env.CARGO_HOME || join(homedir(), '.cargo');
const remapFlag = `--remap-path-prefix=${cargoHome}=/cargo`;
const rustFlags = [process.env.RUSTFLAGS, remapFlag].filter(Boolean).join(' ');
const outputDirectory = fileURLToPath(new URL('../src/generated/horizon-engine', import.meta.url));

const result = spawnSync(
  'wasm-pack',
  ['build', 'crates/horizon-engine', '--target', 'web', '--release', '--out-dir', '../../src/generated/horizon-engine'],
  {
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    env: { ...process.env, RUSTFLAGS: rustFlags },
    shell: process.platform === 'win32',
    stdio: 'inherit',
  },
);

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

rmSync(join(outputDirectory, '.gitignore'), { force: true });
