import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import parseBdlAst from '@disjukr/bdl/parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const modelRoot = path.join(repoRoot, 'model');
const outRoot = path.join(repoRoot, 'hwpkit', 'src', 'model-from-bdl');

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && p.endsWith('.bdl')) out.push(p);
  }
  return out;
}

const stripLineComment = (s) => s.replace(/\s*\/\/.*$/g, '');

function mapPrimitive(t) {
  if (['int32', 'int64', 'integer', 'float64'].includes(t)) return 'number';
  if (t === 'boolean' || t === 'string' || t === 'void') return t;
  if (t === 'bytes') return 'Uint8Array';
  return t;
}

function mapTypeExpr(expr) {
  expr = stripLineComment(expr).trim();
  if (expr.endsWith('[]')) return `${mapTypeExpr(expr.slice(0, -2).trim())}[]`;
  const m = expr.match(/^(.*)\[([^\]]+)\]$/);
  if (m) return `{ [key in ${mapTypeExpr(m[2].trim())}]: ${mapTypeExpr(m[1].trim())} }`;
  return mapPrimitive(expr);
}

function moduleNameFromFile(absFile) {
  const rel = path.relative(modelRoot, absFile).split(path.sep).join('/').replace(/\.bdl$/, '');
  return `hwpkit.${rel.replace(/\//g, '.')}`;
}

function outFileFromModule(moduleName) {
  return path.join(outRoot, `${moduleName.replace(/^hwpkit\./, '').replace(/\./g, '/')}.ts`);
}

function relImport(fromFile, toModule, names) {
  const toFile = outFileFromModule(toModule);
  let rel = path.relative(path.dirname(fromFile), toFile).split(path.sep).join('/').replace(/\.ts$/, '');
  if (!rel.startsWith('.')) rel = './' + rel;
  return `import type { ${names.join(', ')} } from '${rel}';`;
}

function parseBlocks(text, kind) {
  const re = new RegExp(`${kind}\s+(\w+)\s*\{([\s\S]*?)\}`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(text))) out.push({ name: m[1], body: m[2] });
  return out;
}

function parseBdl(file) {
  const src = fs.readFileSync(file, 'utf8').replace(/\r/g, '');

  // Use official BDL parser first to ensure syntax validity.
  // (Generation below still uses a lightweight emitter tailored to this repo's current schema subset.)
  parseBdlAst(src);

  const imports = [...src.matchAll(/^import\s+([\w.]+)\s*\{\s*([^}]+)\s*\}\s*$/gm)].map((m) => ({
    module: m[1].trim(),
    names: m[2].split(',').map((x) => x.trim()).filter(Boolean),
  }));
  const customs = [...src.matchAll(/^custom\s+(\w+)\s*=\s*(.+)$/gm)].map((m) => ({
    name: m[1],
    expr: stripLineComment(m[2]).trim(),
  }));
  const enums = parseBlocks(src, 'enum').map(({ name, body }) => ({
    name,
    items: body.split('\n').map((l) => stripLineComment(l).trim().replace(/,$/, '')).filter(Boolean),
  }));
  const structs = parseBlocks(src, 'struct').map(({ name, body }) => ({
    name,
    fields: body
      .split('\n')
      .map((l) => stripLineComment(l).trim().replace(/,$/, ''))
      .filter(Boolean)
      .map((l) => l.match(/^(\w+)(\?)?:\s*(.+)$/))
      .filter(Boolean)
      .map((m) => ({ name: m[1], optional: !!m[2], type: m[3].trim() })),
  }));
  const unions = parseBlocks(src, 'union').map(({ name, body }) => ({
    name,
    items: body
      .split('\n')
      .map((l) => stripLineComment(l).trim().replace(/,$/, ''))
      .filter(Boolean)
      .map((l) => {
        const withFields = l.match(/^(\w+)\((.*)\)$/);
        if (!withFields) return { name: l, fields: [] };
        const inl = withFields[2].trim();
        if (!inl) return { name: withFields[1], fields: [] };
        return {
          name: withFields[1],
          fields: inl
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean)
            .map((f) => f.match(/^(\w+)(\?)?:\s*(.+)$/))
            .filter(Boolean)
            .map((m) => ({ name: m[1], optional: !!m[2], type: m[3].trim() })),
        };
      }),
  }));
  return { imports, customs, enums, structs, unions };
}

function emitTs(moduleName, ast) {
  const lines = ['// AUTO-GENERATED from BDL. DO NOT EDIT.'];
  const bodyText = JSON.stringify(ast);
  for (const im of ast.imports) {
    const names = im.names.filter((n) => bodyText.includes(n));
    if (names.length) lines.push(relImport(outFileFromModule(moduleName), im.module, names));
  }
  if (lines.length > 1) lines.push('');

  for (const c of ast.customs) lines.push(`export type ${c.name} = ${mapTypeExpr(c.expr)};`);
  if (ast.customs.length) lines.push('');

  for (const e of ast.enums) {
    lines.push(`export const enum ${e.name} {`);
    for (const i of e.items) lines.push(`  ${i},`);
    lines.push('}', '');
  }

  for (const s of ast.structs) {
    lines.push(`export interface ${s.name} {`);
    for (const f of s.fields) lines.push(`  ${f.name}${f.optional ? '?' : ''}: ${mapTypeExpr(f.type)};`);
    lines.push('}', '');
  }

  for (const u of ast.unions) {
    for (const it of u.items) {
      lines.push(`export interface ${it.name} {`, `  type: '${it.name}';`);
      for (const f of it.fields) lines.push(`  ${f.name}${f.optional ? '?' : ''}: ${mapTypeExpr(f.type)};`);
      lines.push('}', '');
    }
    lines.push(`export type ${u.name} =`);
    for (const it of u.items) lines.push(`  | ${it.name}`);
    lines.push(';', '');
  }

  return lines.join('\n').trim() + '\n';
}

fs.rmSync(outRoot, { recursive: true, force: true });
const files = walk(modelRoot);
for (const f of files) {
  const moduleName = moduleNameFromFile(f);
  const out = outFileFromModule(moduleName);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, emitTs(moduleName, parseBdl(f)));
}
console.log(`Generated ${files.length} files into ${path.relative(repoRoot, outRoot)}`);
