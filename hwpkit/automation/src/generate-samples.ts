import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import * as fs from "node:fs";
import * as CFB from "cfb";
import * as zlib from "zlib";
import { createHwp } from "./hwp.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const outDir = path.resolve(root, "artifacts", "samples");

type BatchOp = any;

type RecordHeader = { tagId: number; size: number; data: Buffer };

function parseRecords(buf: Buffer): RecordHeader[] {
  const recs: RecordHeader[] = [];
  let off = 0;
  while (off + 4 <= buf.length) {
    const hdr = buf.readUInt32LE(off);
    off += 4;
    const tagId = hdr & 0x3ff;
    let size = (hdr >>> 20) & 0xfff;
    if (size === 0xfff) {
      size = buf.readUInt32LE(off);
      off += 4;
    }
    const data = buf.subarray(off, off + size);
    off += size;
    recs.push({ tagId, size, data });
  }
  return recs;
}

function inflateRawOrSelf(buf: Buffer): Buffer {
  try {
    return zlib.inflateRawSync(buf);
  } catch {
    return buf;
  }
}

function inspectHwpDocInfo(filePath: string) {
  const buf = fs.readFileSync(filePath);
  const cfb = CFB.read(buf, { type: "buffer" });
  const docInfo = (CFB.find(cfb as any, "/DocInfo") as any)?.content as Buffer;
  const raw = inflateRawOrSelf(docInfo);
  const recs = parseRecords(raw);

  const tag21 = recs.filter((r) => r.tagId === 21);
  const h = crypto.createHash("sha1");
  for (const r of tag21) h.update(r.data);

  return {
    file: path.basename(filePath),
    docInfoTags: recs.length,
    tag21Count: tag21.length,
    tag21Sha1: h.digest("hex"),
  };
}

async function makeDoc(name: string, ops: BatchOp[]) {
  const hwp = createHwp();
  const outPath = path.resolve(outDir, name);

  const results = await hwp.batch([
    { op: "runAction", action: "FileNew" },
    ...ops,
    { op: "getTextFile", format: "TEXT", option: "" },
    {
      op: "action",
      action: "FileSaveAs",
      parameterSet: {
        runtimeId: "HFileSaveAs",
        fields: {
          SaveFileName: outPath,
          SaveFormat: "HWP",
          SaveOverWrite: 1,
        },
      },
    },
  ] as any);

  const exported = results.find((r: any) => r.op === "getTextFile") as any;
  const exportedText = String(exported?.text ?? "");
  if (!exportedText.trim()) {
    throw new Error(`generated doc has empty exported text: ${name}`);
  }

  return outPath;
}

function setCharShape(fields: Record<string, any>): BatchOp {
  return { op: "action", action: "CharShape", setId: "CharShape", fields };
}

function insertText(text: string): BatchOp {
  return { op: "action", action: "InsertText", setId: "InsertText", fields: { Text: text } };
}

(async () => {
  const token = `gen-${Date.now()}`;
  const files: string[] = [];

  files.push(await makeDoc("01-plain-text.hwp", [insertText(`Hello HWP!\n${token}\n한글 테스트\nEnglish 123\n`)]));

  files.push(await makeDoc("02-multi-paragraph.hwp", [insertText(`첫 문단\n\n둘째 문단\n\n셋째 문단\n`)]));

  files.push(
    await makeDoc("03-bold-italic-underline.hwp", [
      insertText("normal "),
      setCharShape({ Bold: 1, Italic: 1, UnderlineType: 1, UnderlineShape: 0, UnderlineColor: 0x000000ff }),
      insertText("BOLD+ITALIC+UNDERLINE"),
      setCharShape({ Bold: 0, Italic: 0, UnderlineType: 0 }),
      insertText(" normal\n"),
    ])
  );

  files.push(
    await makeDoc("04-strikeout.hwp", [
      insertText("strike "),
      setCharShape({ StrikeOutType: 3, StrikeOutShape: 0, StrikeOutColor: 0x00b5742e }),
      insertText("STRIKEOUT"),
      setCharShape({ StrikeOutType: 0 }),
      insertText(" end\n"),
    ])
  );

  files.push(
    await makeDoc("05-shadow-outline.hwp", [
      insertText("shadow "),
      setCharShape({ ShadowType: 0, ShadowColor: 0x00000000, ShadowOffsetX: 30, ShadowOffsetY: 30, OutLineType: 1 }),
      insertText("SHADOW+OUTLINE"),
      setCharShape({ ShadowType: 0, OutLineType: 0 }),
      insertText(" end\n"),
    ])
  );

  files.push(
    await makeDoc("06-mixed-charshape-runs.hwp", [
      insertText("AAA "),
      setCharShape({ Bold: 1 }),
      insertText("BBB"),
      setCharShape({ Bold: 0 }),
      insertText(" CCC\n"),
    ])
  );

  // Verify: re-read generated HWP and ensure DocInfo reflects style deltas
  const infos = files.map(inspectHwpDocInfo);
  const byName: Record<string, any> = Object.fromEntries(infos.map((x) => [x.file, x]));

  const base = byName["01-plain-text.hwp"]; // baseline
  const mustDiffer = [
    "03-bold-italic-underline.hwp",
    "04-strikeout.hwp",
    "05-shadow-outline.hwp",
    "06-mixed-charshape-runs.hwp",
  ];

  const deltas = mustDiffer.map((f) => {
    const x = byName[f];
    return { file: f, tag21Sha1: x.tag21Sha1, differsFromBase: x.tag21Sha1 !== base.tag21Sha1 };
  });

  const ok = deltas.every((d) => d.differsFromBase);

  console.log(JSON.stringify({ ok, outDir, files, inspect: infos, deltas }, null, 2));

  if (!ok) {
    throw new Error(
      `style samples did not change DocInfo tag21 vs baseline. deltas=${JSON.stringify(deltas)}`
    );
  }
})();
