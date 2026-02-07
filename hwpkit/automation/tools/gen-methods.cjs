const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const inPath = path.join(root, 'src', 'spec', 'canonical-methods.json');
const outPath = path.join(root, 'src', 'generated', 'methods.ts');

const methods = JSON.parse(fs.readFileSync(inPath, 'utf8'));
if (!Array.isArray(methods)) throw new Error('canonical-methods.json must be an array');

const uniq = Array.from(new Set(methods.map(String))).sort();

function q(s) {
  return JSON.stringify(s);
}

const lines = [];
lines.push('// AUTO-GENERATED. DO NOT EDIT.');
lines.push('// Source: tools/gen-methods.cjs');
lines.push('// Inputs: src/spec/canonical-methods.json');
lines.push('export type HwpMethodName =');
for (const m of uniq) lines.push(`  | ${q(m)}`);
lines.push('  ;');
lines.push('');
lines.push('export const HWP_METHODS: readonly HwpMethodName[] = [');
for (const m of uniq) lines.push(`  ${q(m)},`);
lines.push('] as const;');
lines.push('');

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('wrote', path.relative(root, outPath), `(methods=${uniq.length})`);





