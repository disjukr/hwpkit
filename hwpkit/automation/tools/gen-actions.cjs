const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const inPath = path.join(root, 'src', 'spec', 'parametersets.json');
const outPath = path.join(root, 'src', 'generated', 'actions.ts');

const fixed = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const actions = Object.keys(fixed).sort();

function q(s) { return JSON.stringify(s); }

const lines = [];
lines.push('// AUTO-GENERATED. DO NOT EDIT.');
lines.push('// Source: tools/gen-actions.cjs');
lines.push('// Inputs: src/spec/parametersets.json');
lines.push('');
lines.push('export type HwpActionName =');
for (const a of actions) lines.push(`  | ${q(a)}`);
lines.push('  ;');
lines.push('');
lines.push('export type HwpActionSpec = {');
lines.push('  action: HwpActionName;');
lines.push('  /** HParameterSet runtime id (e.g. HInsertText) */');
lines.push('  runtimeId: string;');
lines.push('  title: string;');
lines.push('};');
lines.push('');
lines.push('export const HWP_ACTIONS: Record<HwpActionName, HwpActionSpec> = {');
for (const a of actions) {
  const spec = fixed[a];
  lines.push(`  ${q(a)}: { action: ${q(a)}, runtimeId: ${q(String(spec.runtimeId))}, title: ${q(String(spec.title ?? ''))} },`);
}
lines.push('} as const;');
lines.push('');

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('wrote', path.relative(root, outPath), `(actions=${actions.length})`);






