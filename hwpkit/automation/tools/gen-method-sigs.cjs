const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const inPath = path.join(root, 'artifacts', 'hwp-method-tests-canonical.json');
const outPath = path.join(root, 'src', 'generated', 'method-sigs.ts');

function q(s) { return JSON.stringify(s); }

let map = {};
if (fs.existsSync(inPath)) {
  const j = JSON.parse(fs.readFileSync(inPath, 'utf8'));
  const results = Array.isArray(j?.results) ? j.results : [];
  for (const r of results) {
    if (!r || typeof r.method !== 'string') continue;
    if (!String(r.status || '').startsWith('PASS')) continue;

    // Best-effort: infer return types from the test output.
    const rt = String(r.returnType || '').toLowerCase();
    if (r.method === 'GetMessageBoxMode') map[r.method] = { args: [], ret: 'number' };
    else if (rt.includes('string')) map[r.method] = { args: [], ret: 'string' };
    else if (rt.includes('int32') || rt.includes('int64') || rt.includes('double') || rt.includes('single') || rt.includes('decimal')) map[r.method] = { args: [], ret: 'number' };
    else if (rt.includes('__comobject') || rt.includes('comobject')) map[r.method] = { args: [], ret: 'Record<string, JsonValue>' };
    else if (rt === 'null') map[r.method] = { args: [], ret: 'null' };
  }
}

const methods = Object.keys(map).sort();

const lines = [];
lines.push('// AUTO-GENERATED. DO NOT EDIT.');
lines.push('// Source: tools/gen-method-sigs.cjs');
lines.push('// Inputs: artifacts/hwp-method-tests-canonical.json');
lines.push('');
lines.push('import type { JsonValue } from "../types.js";');
lines.push('import type { HwpMethodName } from "./methods.js";');
lines.push('');
lines.push('export type HwpMethodSigMap = {');
lines.push('  // Best-effort signatures learned from canonical method tests.');
lines.push('  // Methods not listed here fall back to unknown args/return.');
for (const m of methods) {
  const spec = map[m];
  lines.push(`  ${q(m)}: () => ${spec.ret};`);
}
lines.push('};');
lines.push('');
lines.push('export type HwpMethodSig<K extends HwpMethodName> =');
lines.push('  K extends keyof HwpMethodSigMap ? HwpMethodSigMap[K] : (...args: JsonValue[]) => unknown;');
lines.push('');

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('wrote', path.relative(root, outPath), `(typed=${methods.length})`);




