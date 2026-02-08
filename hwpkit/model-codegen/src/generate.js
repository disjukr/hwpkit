import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBdlIr } from '@disjukr/bdl/ir/builder';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const modelRoot = path.join(repoRoot, 'model');
const outRoot = path.join(repoRoot, 'hwpkit', 'src', 'model-from-bdl');

const PRIMITIVE_TS = {
  boolean: 'boolean',
  int32: 'number',
  int64: 'number',
  integer: 'number',
  float64: 'number',
  string: 'string',
  bytes: 'Uint8Array',
  object: 'Record<string, unknown>',
  void: 'void',
};

const splitDefPath = (p) => {
  const i = p.lastIndexOf('.');
  return { modulePath: p.slice(0, i), name: p.slice(i + 1) };
};

function outFileFromModule(modulePath) {
  return path.join(outRoot, `${modulePath.replace(/^hwpkit\./, '').replace(/\./g, '/')}.ts`);
}

function relImport(fromFile, toModule, names) {
  const toFile = outFileFromModule(toModule);
  let rel = path.relative(path.dirname(fromFile), toFile).split(path.sep).join('/').replace(/\.ts$/, '');
  if (!rel.startsWith('.')) rel = './' + rel;
  return `import type { ${[...names].sort().join(', ')} } from '${rel}';`;
}

function generateModuleTs(modulePath, moduleDefPaths, defs, sourceBdlPath) {
  const outFile = outFileFromModule(modulePath);
  const imports = new Map(); // modulePath -> Set<name>

  const refType = (ty) => {
    if (!ty) return 'unknown';
    if (ty.type === 'Plain') {
      const p = ty.valueTypePath;
      if (PRIMITIVE_TS[p]) return PRIMITIVE_TS[p];
      const { modulePath: m, name } = splitDefPath(p);
      if (m !== modulePath) {
        if (!imports.has(m)) imports.set(m, new Set());
        imports.get(m).add(name);
      }
      return name;
    }
    if (ty.type === 'Array') {
      const base = refType({ type: 'Plain', valueTypePath: ty.valueTypePath });
      return `${base}[]`;
    }
    if (ty.type === 'Dictionary') {
      const key = refType({ type: 'Plain', valueTypePath: ty.keyTypePath });
      const val = refType({ type: 'Plain', valueTypePath: ty.valueTypePath });
      return `Record<${key}, ${val}>`; 
    }
    return 'unknown';
  };

  const lines = [
    '// AUTO-GENERATED from BDL IR. DO NOT EDIT.',
    `// Source: ${sourceBdlPath}`,
  ];

  const body = [];
  for (const defPath of moduleDefPaths) {
    const def = defs[defPath];
    if (!def) continue;

    if (def.type === 'Custom') {
      body.push(`export type ${def.name} = ${refType(def.originalType)};`, '');
      continue;
    }

    if (def.type === 'Enum') {
      body.push(`export const enum ${def.name} {`);
      for (const item of def.items) body.push(`  ${item.name},`);
      body.push('}', '');
      continue;
    }

    if (def.type === 'Struct') {
      body.push(`export interface ${def.name} {`);
      for (const f of def.fields) {
        body.push(`  ${f.name}${f.optional ? '?' : ''}: ${refType(f.fieldType)};`);
      }
      body.push('}', '');
      continue;
    }

    if (def.type === 'Union') {
      for (const item of def.items) {
        body.push(`export interface ${item.name} {`);
        body.push(`  type: '${item.name}';`);
        for (const f of item.fields) {
          body.push(`  ${f.name}${f.optional ? '?' : ''}: ${refType(f.fieldType)};`);
        }
        body.push('}', '');
      }
      body.push(`export type ${def.name} =`);
      for (const item of def.items) body.push(`  | ${item.name}`);
      body.push(';', '');
      continue;
    }
  }

  for (const [m, names] of [...imports.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(relImport(outFile, m, names));
  }
  if (lines.length > 1) lines.push('');

  lines.push(...body);
  return lines.join('\n').trim() + '\n';
}

async function resolveModuleFile(modulePath) {
  if (!modulePath.startsWith('hwpkit.')) throw new Error(`unsupported module path: ${modulePath}`);
  const rel = modulePath.slice('hwpkit.'.length).replace(/\./g, '/');
  const filePath = path.join(modelRoot, `${rel}.bdl`);
  return { fileUrl: `file://${filePath}`, text: await fsp.readFile(filePath, 'utf8') };
}

const { ir } = await buildBdlIr({
  entryModulePaths: ['hwpkit.document'],
  resolveModuleFile,
});

fs.rmSync(outRoot, { recursive: true, force: true });
for (const [modulePath, mod] of Object.entries(ir.modules)) {
  const outFile = outFileFromModule(modulePath);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const sourceBdlPath = path.posix.join('model', modulePath.slice('hwpkit.'.length).replace(/\./g, '/')) + '.bdl';
  fs.writeFileSync(outFile, generateModuleTs(modulePath, mod.defPaths, ir.defs, sourceBdlPath));
}

console.log(`Generated ${Object.keys(ir.modules).length} modules into ${path.relative(repoRoot, outRoot)}`);
