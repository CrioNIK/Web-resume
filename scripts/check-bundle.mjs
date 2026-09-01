import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const assetsDirectory = fileURLToPath(new URL('../dist/assets/', import.meta.url));
const limits = {
  largestJavaScriptGzip: 90 * 1024,
  totalJavaScriptGzip: 175 * 1024,
  totalCssGzip: 45 * 1024,
};

const files = await readdir(assetsDirectory);
const measured = [];
for (const file of files) {
  if (!/\.(?:js|css)$/.test(file)) continue;
  const buffer = await readFile(join(assetsDirectory, file));
  measured.push({ file, raw: buffer.byteLength, gzip: gzipSync(buffer).byteLength });
}

const javascript = measured.filter(({ file }) => file.endsWith('.js'));
const css = measured.filter(({ file }) => file.endsWith('.css'));
const largestJavaScript = Math.max(0, ...javascript.map(({ gzip }) => gzip));
const totalJavaScript = javascript.reduce((sum, item) => sum + item.gzip, 0);
const totalCss = css.reduce((sum, item) => sum + item.gzip, 0);

console.table(measured.map(({ file, raw, gzip }) => ({
  file,
  'raw KiB': (raw / 1024).toFixed(1),
  'gzip KiB': (gzip / 1024).toFixed(1),
})));

const failures = [
  [largestJavaScript > limits.largestJavaScriptGzip, `Largest JS chunk is ${(largestJavaScript / 1024).toFixed(1)} KiB gzip (budget: 90 KiB).`],
  [totalJavaScript > limits.totalJavaScriptGzip, `Total JS is ${(totalJavaScript / 1024).toFixed(1)} KiB gzip (budget: 175 KiB).`],
  [totalCss > limits.totalCssGzip, `Total CSS is ${(totalCss / 1024).toFixed(1)} KiB gzip (budget: 45 KiB).`],
].filter(([failed]) => failed).map(([, message]) => message);

if (failures.length > 0) {
  throw new Error(`Bundle budget failed:\n${failures.join('\n')}`);
}

console.log(`Bundle budget passed: JS ${(totalJavaScript / 1024).toFixed(1)} KiB gzip, CSS ${(totalCss / 1024).toFixed(1)} KiB gzip.`);
