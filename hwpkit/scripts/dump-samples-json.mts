import fs from 'node:fs';
import path from 'node:path';

import { readHwp5 } from '../src/read/hwp5/index.ts';
import { readHwpml } from '../src/read/hwpml/index.ts';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const samplesDir = path.join(repoRoot, 'samples');

const names = fs.readdirSync(samplesDir)
  .filter((name) => /\.(hwp|hml|hwpml)$/i.test(name))
  .sort();

for (const name of names) {
  const full = path.join(samplesDir, name);
  const out = `${full}.json`;
  const ext = path.extname(name).toLowerCase();

  try {
    const doc = ext === '.hwp'
      ? readHwp5(fs.readFileSync(full))
      : readHwpml(fs.readFileSync(full, 'utf8'));

    fs.writeFileSync(out, JSON.stringify(doc, null, 2));
    console.log(`wrote: ${path.relative(repoRoot, out)}`);
  } catch (error) {
    const message = error instanceof Error ? (error.stack || error.message) : String(error);
    fs.writeFileSync(out, JSON.stringify({ error: message }, null, 2));
    console.log(`wrote(error): ${path.relative(repoRoot, out)}`);
  }
}
