const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const scripts = [
  'gen-methods.cjs',
  'gen-actions.cjs',
  'gen-psets.cjs',
  'gen-method-sigs.cjs',
];

for (const s of scripts) {
  const p = path.join(__dirname, s);
  const r = spawnSync(process.execPath, [p], { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status || 1);
}





