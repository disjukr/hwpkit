const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const inPath = path.join(root, 'src', 'spec', 'parametersets.json');
const outPath = path.join(root, 'src', 'generated', 'psets.ts');

const fixed = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const ids = Object.keys(fixed).sort();

function q(s) { return JSON.stringify(s); }

const lines = [];
lines.push('// AUTO-GENERATED. DO NOT EDIT.');
lines.push('// Source: tools/gen-psets.cjs');
lines.push('// Inputs: src/spec/parametersets.json');
lines.push('export type ParamValue = string | number | boolean | null;');
lines.push('export type ParamMap = Record<string, ParamValue>;');
lines.push('');
lines.push('export type ParameterSetId =');
for (const id of ids) lines.push(`  | ${q(id)}`);
lines.push('  ;');
lines.push('');
lines.push('export type ParameterSetSpec = {');
lines.push('  setId: ParameterSetId;');
lines.push('  runtimeId: string;');
lines.push('  title: string;');
lines.push('  keys: readonly string[];');
lines.push('};');
lines.push('');
lines.push('export const PARAMETER_SETS: Record<ParameterSetId, ParameterSetSpec> = {');
for (const id of ids) {
  const spec = fixed[id];
  const keys = Array.isArray(spec.keys) ? spec.keys.map(String) : Array.isArray(spec.items) ? spec.items.map((x) => String(x.id)) : [];
  lines.push(`  ${q(id)}: { setId: ${q(id)}, runtimeId: ${q(String(spec.runtimeId))}, title: ${q(String(spec.title ?? ''))}, keys: [${keys.map(q).join(', ')}] },`);
}
lines.push('} as const;');
lines.push('');
lines.push('export function validateParamSet(setId: ParameterSetId, params: Record<string, any>): { ok: true; params: ParamMap } | { ok: false; error: string } {');
lines.push('  const spec = PARAMETER_SETS[setId];');
lines.push('  if (!spec) return { ok: false, error: `unknown setId: ${setId}` };');
lines.push('  const out: any = {};');
lines.push('  for (const k of Object.keys(params || {})) {');
lines.push('    if (!spec.keys.includes(k)) return { ok: false, error: `unknown param key for ${setId}: ${k}` };');
lines.push('    out[k] = params[k];');
lines.push('  }');
lines.push('  return { ok: true, params: out };');
lines.push('}');
lines.push('');

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('wrote', path.relative(root, outPath), `(psets=${ids.length})`);







