import type { Hwp5Parser } from '../../parser';
import type { Hwp5ParsedDocument, Hwp5Paragraph, Hwp5Section } from '../../types';

import * as CFB from 'cfb';
import * as zlib from 'zlib';

function u32le(buf: Buffer, off: number) {
  return buf.readUInt32LE(off);
}

type RecordHeader = {
  tagId: number;
  level: number;
  size: number;
  data: Buffer;
};

function parseRecords(buf: Buffer): RecordHeader[] {
  const recs: RecordHeader[] = [];
  let off = 0;
  while (off + 4 <= buf.length) {
    const hdr = buf.readUInt32LE(off);
    off += 4;
    const tagId = hdr & 0x3ff;
    const level = (hdr >>> 10) & 0x3ff;
    let size = (hdr >>> 20) & 0xfff;
    if (size === 0xfff) {
      size = buf.readUInt32LE(off);
      off += 4;
    }
    const data = buf.subarray(off, off + size);
    off += size;
    recs.push({ tagId, level, size, data });
  }
  return recs;
}

function tryInflateRaw(buf: Buffer): Buffer {
  try {
    return zlib.inflateRawSync(buf);
  } catch {
    return buf;
  }
}

function parseU16Array(buf: Buffer, off: number, count: number): number[] {
  const out = new Array<number>(count);
  for (let i = 0; i < count; i++) out[i] = buf.readUInt16LE(off + i * 2);
  return out;
}

function tryFindUtf16AsciiZ(data: Buffer): string | null {
  for (let off = 0; off + 3 < data.length; off++) {
    const b0 = data[off];
    const b1 = data[off + 1];
    const b2 = data[off + 2];
    const b3 = data[off + 3];

    const isAscii = (b: number) => b >= 0x20 && b <= 0x7e;
    if (!isAscii(b0) || b1 !== 0x00 || !isAscii(b2) || b3 !== 0x00) continue;

    let end = data.length;
    for (let i = off; i + 1 < data.length; i += 2) {
      if (data.readUInt16LE(i) === 0) {
        end = i;
        break;
      }
    }

    const s = data.subarray(off, end).toString('utf16le').trim();
    if (s.length >= 1) return s;
  }
  return null;
}

function extractFontFaceNames(docInfoRaw: Buffer): string[] {
  const recs = parseRecords(docInfoRaw);
  const names: string[] = [];
  for (const r of recs) {
    // Empirical: tagId 19 contains face name like "HCR Dotum", "HCR Batang".
    if (r.tagId !== 19) continue;
    const name = tryFindUtf16AsciiZ(r.data);
    if (name) names.push(name);
  }
  return [...new Set(names)];
}

function extractDocInfoTables(docInfoRaw: Buffer): {
  fontFaceNames: string[];
  paragraphShapes: { align: number }[];
  charShapes: {
    fontBaseSize: number;
    fontId: number[];
    fontRatio: number[];
    fontSpacing: number[];
    fontScale: number[];
    fontLocation: number[];
  }[];
} {
  const recs = parseRecords(docInfoRaw);

  const fontFaceNames = extractFontFaceNames(docInfoRaw);

  const paragraphShapes = recs.filter((r) => r.tagId === 25).map(() => ({ align: 0 }));

  const charShapes = recs.filter((r) => r.tagId === 21).map((r) => {
    const fontId = parseU16Array(r.data, 0, 7);

    // Arrays layout is not fully decoded yet; keep stable partial values.
    const fontRatio = [100, 100, 100, 100, 100, 100, 100];
    const fontSpacing = parseU16Array(r.data, 28, 7);
    const fontScale = parseU16Array(r.data, 14, 7);
    const fontLocation = [0, 0, 0, 0, 0, 0, 0];

    // In our samples, base size (x100) appears at u16 offset 42: 1000 => 10pt.
    const baseSize100 = r.data.length >= 44 ? r.data.readUInt16LE(42) : 1000;
    const fontBaseSize = baseSize100 / 100;

    return { fontBaseSize, fontId, fontRatio, fontSpacing, fontScale, fontLocation };
  });

  return { fontFaceNames, paragraphShapes, charShapes };
}

function decodeParaText(data: Buffer): string {
  // Conservative decode for now:
  // - interpret as UTF-16LE stream
  // - normalize newlines: CRLF/CR/LF => \\n
  // - drop known marker sequences
  let out = '';
  for (let i = 0; i + 1 < data.length; i += 2) {
    const code = data.readUInt16LE(i);

    if (code === 0x0009) {
      out += '\\t';
      continue;
    }

    if (code === 0x000a) {
      // lone LF
      out += '\\n';
      continue;
    }

    if (code === 0x000d) {
      // CR (may be followed by LF)
      out += '\\n';
      if (i + 3 < data.length && data.readUInt16LE(i + 2) === 0x000a) {
        i += 2;
      }
      continue;
    }

    // Control marker: 0x0002 + two u16 that are ascii pairs (e.g. 'd''c''e''s').
    if (code === 0x0002 && i + 6 < data.length) {
      const w1 = data.readUInt16LE(i + 2);
      const w2 = data.readUInt16LE(i + 4);
      const isAsciiPair = (w: number) => {
        const a = w & 0xff;
        const b = (w >>> 8) & 0xff;
        const isAZ = (x: number) => x >= 0x61 && x <= 0x7a;
        return isAZ(a) && isAZ(b);
      };
      if (isAsciiPair(w1) && isAsciiPair(w2)) {
        i += 4;
      }
      continue;
    }

    if (code < 0x0020) continue;
    if (code === 0xffff || code === 0xfffe) continue;

    out += String.fromCharCode(code);
  }

  return out;
}


type ParaHeaderInfo = {
  nchars: number;
};

function parseParaHeader(data: Buffer): ParaHeaderInfo {
  if (data.length < 4) return { nchars: 0 };
  const raw = data.readUInt32LE(0);
  return { nchars: raw & 0x7fffffff };
}

function decodeParaTextWithCount(data: Buffer, nchars?: number): string {
  const maxBytes = nchars != null ? Math.min(data.length, nchars * 2) : data.length;
  return decodeParaText(data.subarray(0, maxBytes));
}

function buildParagraphTextsFromBodyRecords(records: RecordHeader[]): string[] {
  const paras: string[] = [];
  let currentHeader: ParaHeaderInfo | null = null;
  let currentTextParts: string[] = [];

  for (const r of records) {
    // In our samples: 66=PARA_HEADER, 67=PARA_TEXT
    if (r.tagId === 66) {
      if (currentHeader || currentTextParts.length) {
        paras.push(currentTextParts.join(''));
      }
      currentHeader = parseParaHeader(r.data);
      currentTextParts = [];
      continue;
    }

    if (r.tagId === 67) {
      currentTextParts.push(decodeParaTextWithCount(r.data, currentHeader?.nchars));
      continue;
    }
  }

  if (currentHeader || currentTextParts.length) {
    paras.push(currentTextParts.join(''));
  }

  return paras.filter((p) => p.length > 0);
}


function listBodyTextSections(cfb: any): string[] {
  const paths: string[] = (cfb.FullPaths ?? []) as string[];
  const secs = paths
    .filter((p) => /BodyText\/Section\d+$/.test(p))
    .map((p) => {
      const m = p.match(/BodyText\/(Section\d+)$/);
      return m ? `/BodyText/${m[1]}` : null;
    })
    .filter((p): p is string => !!p);

  // De-dupe + sort by section index
  const unique = [...new Set(secs)];
  unique.sort((a, b) => {
    const ai = parseInt(a.match(/Section(\d+)$/)?.[1] ?? '0', 10);
    const bi = parseInt(b.match(/Section(\d+)$/)?.[1] ?? '0', 10);
    return ai - bi;
  });
  return unique;
}

export class NativeHwp5Parser implements Hwp5Parser {
  parse(buffer: Buffer): Hwp5ParsedDocument {
    const cfb = CFB.read(buffer, { type: 'buffer' });

    const fileHeaderEntry = CFB.find(cfb as any, 'FileHeader') as any;
    const fh: Buffer | undefined = fileHeaderEntry?.content;
    if (!fh || !Buffer.isBuffer(fh) || fh.length < 64) {
      throw new Error('Invalid HWP5 FileHeader: missing/short content');
    }

    const sig = fh.subarray(0, 32).toString('ascii').replace(/\0+$/, '').trim();
    if (!sig.startsWith('HWP Document File')) {
      throw new Error(`Invalid HWP5 FileHeader signature: ${JSON.stringify(sig)}`);
    }

    const verA = u32le(fh, 32);
    const verB = u32le(fh, 36);
    const flags = u32le(fh, 40);

    const docInfoEntry = CFB.find(cfb as any, '/DocInfo') as any;
    const docInfoCompressed: Buffer | undefined = docInfoEntry?.content;
    if (!docInfoCompressed || !Buffer.isBuffer(docInfoCompressed)) {
      throw new Error('Missing DocInfo stream');
    }
    const docInfoRaw = tryInflateRaw(docInfoCompressed);
    const tables = extractDocInfoTables(docInfoRaw);
    const sectionPaths = listBodyTextSections(cfb);
    if (sectionPaths.length === 0) {
      throw new Error('Missing BodyText/Section* streams');
    }

    const paragraphsText: string[] = [];
    for (const secPath of sectionPaths) {
      const entry = CFB.find(cfb as any, secPath) as any;
      const comp: Buffer | undefined = entry?.content;
      if (!comp || !Buffer.isBuffer(comp)) continue;
      const raw = tryInflateRaw(comp);
      const recs = parseRecords(raw);
      paragraphsText.push(...buildParagraphTextsFromBodyRecords(recs));
    }

    if (process.env.HWPKIT_DEBUG_HWP5_NATIVE === '1') {
      console.log(JSON.stringify({ sig, verA, verB, flags, sectionCount: sectionPaths.length }, null, 2));
      console.log('native paras:', paragraphsText.length);
      console.log('native text preview:', JSON.stringify(paragraphsText.join('').slice(0, 200)));
    }

    const paragraphs: Hwp5Paragraph[] = (paragraphsText.length ? paragraphsText : ['']).map((pt) => ({
      shapeIndex: 0,
      shapeBuffer: [{ pos: 0, shapeIndex: 0 }],
      content: Array.from(pt).map((ch) => ({ type: 0 as const, value: ch.charCodeAt(0) })),
      controls: [],
    }));

    const section: Hwp5Section = {
      width: 59528,
      height: 84188,
      paddingLeft: 8504,
      paddingRight: 8504,
      paddingTop: 5669,
      paddingBottom: 4252,
      headerPadding: 4252,
      footerPadding: 4252,
      content: paragraphs,
    };

    return {
      info: {
        startingIndex: 0,
        caratLocation: { listId: 0, paragraphId: 0, charIndex: 0 },
        fontFaces: tables.fontFaceNames.map((name) => ({ name })),
        charShapes: tables.charShapes.map((cs) => ({
          fontBaseSize: cs.fontBaseSize,
          color: [0, 0, 0] as const,
          shadeColor: [255, 255, 255] as const,
          fontId: cs.fontId as any,
          fontRatio: cs.fontRatio as any,
          fontSpacing: cs.fontSpacing as any,
          fontScale: cs.fontScale as any,
          fontLocation: cs.fontLocation as any,
        })),
        paragraphShapes: tables.paragraphShapes,
      },
      sections: [section],
    };
  }
}













