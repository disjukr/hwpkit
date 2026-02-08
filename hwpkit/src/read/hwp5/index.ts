import {
  AlignmentType1,
  BreakLatinWordType,
  Control,
  ColDef,
  ColType,
  ColLayoutType,
  DocumentModel,
  GutterType,
  HeadingType,
  ParaLevel,
  LangType,
  LineType2,
  LineWrapType,
  Paragraph,
  RgbColor,
  Section,
  StrikeoutType,
  UnderlineType,
  ShadowType,
  LineType3,
  StyleType,
  TextDirection,
  VerAlignType,
} from '../../model/document';

import * as CFB from 'cfb';
import * as zlib from 'zlib';
import { decodeDistributeViewText } from './distribute-decrypt.js';

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

function u32le(buf: Buffer, off: number) {
  return buf.readUInt32LE(off);
}

function rgb(rgb: readonly [number, number, number]): RgbColor {
  const [r, g, b] = rgb;
  // NOTE: this matches previous code style even if questionable; good enough for now.
  return (((b << 16) | (g << 8) | r) >>> 0) as unknown as RgbColor;
}


function bbggrrToRgb(color: number): readonly [number, number, number] {
  const r = color & 0xff;
  const g = (color >>> 8) & 0xff;
  const b = (color >>> 16) & 0xff;
  return [r, g, b] as const;
}

function toLangMap<T>(arr: T[], fallback: T): { [k in LangType]: T } {
  return {
    [LangType.Hangul]: arr[0] ?? fallback,
    [LangType.Latin]: arr[1] ?? fallback,
    [LangType.Hanja]: arr[2] ?? fallback,
    [LangType.Japanese]: arr[3] ?? fallback,
    [LangType.Other]: arr[4] ?? fallback,
    [LangType.Symbol]: arr[5] ?? fallback,
    [LangType.User]: arr[6] ?? fallback,
  };
}
function parseU16Array(buf: Buffer, off: number, count: number): number[] {
  const out = new Array<number>(count);
  for (let i = 0; i < count; i++) out[i] = buf.readUInt16LE(off + i * 2);
  return out;
}



function i8(n: number): number {
  return (n << 24) >> 24;
}

function parseCharShapeRecord(data: Buffer): {
  fontIds: number[];
  ratios: number[];
  charSpacings: number[];
  relSizes: number[];
  charOffsets: number[];
  baseSize100: number;
  props: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  textColor: readonly [number, number, number];
  shadeColor: readonly [number, number, number];
  shadowColor: readonly [number, number, number];
  strikeColor?: readonly [number, number, number];
} {
  const fontIds = parseU16Array(data, 0, 7);
  const ratios = Array.from(data.subarray(14, 21));
  const charSpacings = Array.from(data.subarray(21, 28)).map(i8);
  const relSizes = Array.from(data.subarray(28, 35));
  const charOffsets = Array.from(data.subarray(35, 42)).map(i8);

  const baseSize100 = data.length >= 44 ? data.readUInt16LE(42) : 1000;
  const props = data.length >= 50 ? data.readUInt32LE(46) : 0;

  const shadowOffsetX = data.length > 50 ? i8(data[50]!) : 0;
  const shadowOffsetY = data.length > 51 ? i8(data[51]!) : 0;

  const textColor = data.length >= 60 ? bbggrrToRgb(data.readUInt32LE(56) >>> 0) : ([0, 0, 0] as const);
  const shadeColor = data.length >= 64 ? bbggrrToRgb(data.readUInt32LE(60) >>> 0) : ([255, 255, 255] as const);
  const shadowColor = data.length >= 68 ? bbggrrToRgb(data.readUInt32LE(64) >>> 0) : ([178, 178, 178] as const);

  const strikeColorRaw = data.length >= 74 ? (data.readUInt32LE(70) >>> 0) : 0;
  const strikeColor = strikeColorRaw ? bbggrrToRgb(strikeColorRaw) : undefined;

  return {
    fontIds,
    ratios,
    charSpacings,
    relSizes,
    charOffsets,
    baseSize100,
    props,
    shadowOffsetX,
    shadowOffsetY,
    textColor,
    shadeColor,
    shadowColor,
    strikeColor,
  };
}

function parseParaShapeRecord(data: Buffer): {
  align: number;
  verAlign: number;
  headingType: number;
  level: number;
  tabDef: number;
  breakLatinWordType: number;
  breakNonLatinWord: boolean;
  condense: number;
  widowOrphan: boolean;
  keepWithNext: boolean;
  keepLines: boolean;
  pageBreakBefore: boolean;
  fontLineHeight: boolean;
  snapToGrid: boolean;
  lineWrapType: number;
  autoSpaceEAsianEng: boolean;
  autoSpaceEAsianNum: boolean;
} {
  // Spec-based decode for HWPTAG_PARA_SHAPE (DocInfo tag 25).
  // Total size: 54 bytes.
  // - props1: u32 @ 0
  // - tabDefId: u16 @ 28
  // - props2: u32 @ 44
  // - props3: u32 @ 48
  // References: official HWP 5.0 spec (Table 43~46).

  const props1 = data.length >= 4 ? (data.readUInt32LE(0) >>> 0) : 0;
  const tabDef = data.length >= 30 ? data.readUInt16LE(28) : 0;
  const props2 = data.length >= 48 ? (data.readUInt32LE(44) >>> 0) : 0;
  const props3 = data.length >= 52 ? (data.readUInt32LE(48) >>> 0) : 0;

  // props1
  // bit 2~4: alignment
  const align = (props1 >>> 2) & 0x7;
  // bit 20~21: vertical alignment
  const verAlign = (props1 >>> 20) & 0x3;
  // bit 23~24: heading type
  const headingType = (props1 >>> 23) & 0x3;
  // bit 25~27: level (1~7 in spec; keep raw value)
  const level = (props1 >>> 25) & 0x7;

  // bit 5~6: BreakLatinWord
  const breakLatinWordType = (props1 >>> 5) & 0x3;
  // bit 7: BreakNonLatinWord (0=어절, 1=글자)
  const breakNonLatinWord = ((props1 >>> 7) & 0x1) !== 0;
  // bit 8: SnapToGrid (edit-grid)
  const snapToGrid = ((props1 >>> 8) & 0x1) !== 0;

  // bit 9~15: condense (0~75%)
  const condense = (props1 >>> 9) & 0x7f;

  const widowOrphan = ((props1 >>> 16) & 0x1) !== 0;
  const keepWithNext = ((props1 >>> 17) & 0x1) !== 0;
  const keepLines = ((props1 >>> 18) & 0x1) !== 0;
  const pageBreakBefore = ((props1 >>> 19) & 0x1) !== 0;
  const fontLineHeight = ((props1 >>> 22) & 0x1) !== 0;

  // props2 (Table 45)
  // bit 0~1: line-wrap related ("한 줄로 입력" etc). Keep raw value for now.
  const lineWrapType = props2 & 0x3;
  // bit 4: AutoSpaceEAsianEng
  const autoSpaceEAsianEng = ((props2 >>> 4) & 0x1) !== 0;
  // bit 5: AutoSpaceEAsianNum
  const autoSpaceEAsianNum = ((props2 >>> 5) & 0x1) !== 0;

  // props3 (Table 46): line spacing type. (Not mapped into current DocumentModel; keep parsed but unused.)
  void props3;

  return {
    align,
    verAlign,
    headingType,
    level,
    tabDef,
    breakLatinWordType,
    breakNonLatinWord,
    condense,
    widowOrphan,
    keepWithNext,
    keepLines,
    pageBreakBefore,
    fontLineHeight,
    snapToGrid,
    lineWrapType,
    autoSpaceEAsianEng,
    autoSpaceEAsianNum,
  };
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

function decodeUtf16ZStrings(data: Buffer): string[] {
  // Decode as UTF-16LE then split by NUL. Filter to segments that look like text.
  const s = data.toString('utf16le');
  return s
    .split('\u0000')
    .map((x) => x.replace(/[\u0000-]/g, '').trim())
    .filter((x) => x.length > 0)
    .filter((x) => /[A-Za-z가-힣]/.test(x));
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
  paragraphShapes: ReturnType<typeof parseParaShapeRecord>[];
  charShapes: {
    fontBaseSize: number;
    color: readonly [number, number, number];
    shadeColor: readonly [number, number, number];
    shadowColor?: readonly [number, number, number];
    fontId: number[];
    fontRatio: number[];
    fontSpacing: number[];
    fontScale: number[];
    fontLocation: number[];
    props?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    strikeColor?: readonly [number, number, number];
  }[];
  styles: { name: string; engName: string }[];
} {
  const recs = parseRecords(docInfoRaw);

  const fontFaceNames = extractFontFaceNames(docInfoRaw);

  const paragraphShapes = recs.filter((r) => r.tagId === 25).map((r) => parseParaShapeRecord(r.data));

  const styles = recs
    .filter((r) => r.tagId === 26)
    .map((r) => {
      const u = r.data.toString('utf16le').replace(/[\u0000-]/g, ' ');
      const name = (u.match(/[가-힣 ]{2,}/)?.[0] ?? '').trim();
      const engName = (u.match(/[A-Za-z0-9][A-Za-z0-9 ]{1,}/)?.[0] ?? '').trim();
      return {
        name: name || engName || 'Style',
        engName: engName || name || 'Style',
      };
    });

  const charShapes = recs.filter((r) => r.tagId === 21).map((r) => {
    const cs = parseCharShapeRecord(r.data);
    return {
      fontBaseSize: cs.baseSize100 / 100,
      color: cs.textColor,
      shadeColor: cs.shadeColor,
      shadowColor: cs.shadowColor,
      fontId: cs.fontIds,
      fontRatio: cs.ratios,
      fontSpacing: cs.charSpacings,
      fontScale: cs.relSizes,
      fontLocation: cs.charOffsets,
      props: cs.props,
      shadowOffsetX: cs.shadowOffsetX,
      shadowOffsetY: cs.shadowOffsetY,
      strikeColor: cs.strikeColor,
    };
  });

  return { fontFaceNames, paragraphShapes, charShapes, styles };
}

function decodeParaText(data: Buffer): string {
  // Conservative decode for now:
  // - interpret as UTF-16LE stream
  // - normalize newlines: CRLF/CR/LF => \n
  let out = '';
  for (let i = 0; i + 1 < data.length; i += 2) {
    const code = data.readUInt16LE(i);

    if (code === 0x001e) {
      out += ' ';
      continue;
    }

    if (code === 0x0009) {
      if (i + 15 < data.length && data.readUInt16LE(i + 14) === 0x0009) {
        out += '	';
        i += 14;
        continue;
      }
      out += '	';
      continue;

    }
    if (code === 0x000a) {
      out += '\n';
      continue;
    }

    if (code === 0x000d) {
      out += '\n';
      if (i + 3 < data.length && data.readUInt16LE(i + 2) === 0x000a) {
        i += 2;
      }
      continue;
    }

    // Extended control in ParaText (0x0002 + optional 6-word payload)
    if (code === 0x0002) {
      out += '￼';
      if (i + 5 < data.length) {
        const w1 = data.readUInt16LE(i + 2);
        const w2 = data.readUInt16LE(i + 4);
        const isAsciiPair = (w: number) => {
          const a = w & 0xff;
          const b = (w >>> 8) & 0xff;
          const isAZ = (x: number) => x >= 0x61 && x <= 0x7a;
          return isAZ(a) && isAZ(b);
        };
        if (isAsciiPair(w1) && isAsciiPair(w2) && i + 13 < data.length) i += 12;
      }
      continue;
    }

    // Inline control chars
    if (code > 0x0000 && code < 0x0020) {
      out += '￼';
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
  controlMask: number;
  flags: number;// legacy alias of controlMask
  paraShapeIndex: number;
  styleIndex: number;
  breakType: number;
  charShapeInfoCount: number;
  rangeTagCount: number;
  alignInfoCount: number;
  instId: number;
  trackInfo: number;
};

function parseParaHeader(data: Buffer): ParaHeaderInfo {
  // Spec-based decode for HWPTAG_PARA_HEADER (BodyText tag 66), HWP 5.0 rev 1.3 (Table 58).
  // Fixed 24 bytes for the common case (when nchars does NOT have 0x80000000 extension).
  //
  // Offsets (no extension):
  // 0  UINT32 nchars
  // 4  UINT32 controlMask
  // 8  UINT16 paraShapeId
  // 10 UINT8  styleId
  // 11 UINT8  breakType (Table 59)
  // 12 UINT16 charShapeInfoCount
  // 14 UINT16 rangeTagCount
  // 16 UINT16 alignInfoCount
  // 18 UINT32 instanceId
  // 22 UINT16 trackInfo (>=5.0.3.2)
  //
  // NOTE: We currently ignore the extended-header form (nchars & 0x80000000).
  if (data.length < 8) {
    return {
      nchars: 0,
      controlMask: 0,
      flags: 0,
      paraShapeIndex: 0,
      styleIndex: 0,
      breakType: 0,
      charShapeInfoCount: 0,
      rangeTagCount: 0,
      alignInfoCount: 0,
      instId: 0,
      trackInfo: 0,
    };
  }

  const raw = data.readUInt32LE(0) >>> 0;
  const nchars = raw & 0x7fffffff;
  const hasExt = (raw & 0x80000000) !== 0;

  if (hasExt) {
    // TODO: implement the extended variant (spec: additional UINT16/UINT8/UINT8/UINT16 after nchars).
    // For now, fall back to best-effort using the non-ext offsets if present.
  }

  const controlMask = data.length >= 8 ? (data.readUInt32LE(4) >>> 0) : 0;
  const paraShapeIndex = data.length >= 10 ? data.readUInt16LE(8) : 0;
  const styleIndex = data.length >= 11 ? data.readUInt8(10) : 0;
  const breakType = data.length >= 12 ? data.readUInt8(11) : 0;
  const charShapeInfoCount = data.length >= 14 ? data.readUInt16LE(12) : 0;
  const rangeTagCount = data.length >= 16 ? data.readUInt16LE(14) : 0;
  const alignInfoCount = data.length >= 18 ? data.readUInt16LE(16) : 0;
  const instId = data.length >= 22 ? (data.readUInt32LE(18) >>> 0) : 0;
  const trackInfo = data.length >= 24 ? data.readUInt16LE(22) : 0;

  return {
    nchars,
    controlMask,
    flags: controlMask,
    paraShapeIndex,
    styleIndex,
    breakType,
    charShapeInfoCount,
    rangeTagCount,
    alignInfoCount,
    instId,
    trackInfo,
  };
}

function decodeParaTextWithCount(data: Buffer, _nchars?: number): string {
  return decodeParaText(data);
}

// --- TODO(3): PARA_CHAR_SHAPE(run) support (empirical)

type ParaCharShapeRun = { pos: number; charShapeIndex: number };

type ParaTextDecoded = { text: string; rawToOut: number[] };

function decodeParaTextMapped(data: Buffer, _nchars?: number): ParaTextDecoded {
  const buf = data;

  let out = '';
  const rawToOut: number[] = [];

  const setBoundary = (rawPos: number, outPos: number) => {
    if (rawToOut[rawPos] == null) rawToOut[rawPos] = outPos;
  };

  let rawPos = 0;
  for (let i = 0; i + 1 < buf.length; i += 2) {
    const code = buf.readUInt16LE(i);
    setBoundary(rawPos, out.length);

    if (code === 0x001e) {
      out += ' ';
      rawPos += 1;
      continue;
    }

    if (code === 0x0009) {
      if (i + 15 < buf.length && buf.readUInt16LE(i + 14) === 0x0009) {
        out += '	';
        rawPos += 1;
        i += 14;
        rawPos += 7;
        continue;
      }
      out += '	';
      rawPos += 1;
      continue;
    }

    if (code === 0x000a) {
      out += '\n';
      rawPos += 1;
      continue;
    }

    if (code === 0x000d) {
      out += '\n';
      rawPos += 1;
      if (i + 3 < buf.length && buf.readUInt16LE(i + 2) === 0x000a) {
        i += 2;
        rawPos += 1;
      }
      continue;
    }

    // Extended control in ParaText (0x0002 + optional 6-word payload)
    if (code === 0x0002) {
      out += '￼';
      rawPos += 1;
      if (i + 5 < buf.length) {
        const w1 = buf.readUInt16LE(i + 2);
        const w2 = buf.readUInt16LE(i + 4);
        const isAsciiPair = (w: number) => {
          const a = w & 0xff;
          const b = (w >>> 8) & 0xff;
          const isAZ = (x: number) => x >= 0x61 && x <= 0x7a;
          return isAZ(a) && isAZ(b);
        };
        if (isAsciiPair(w1) && isAsciiPair(w2) && i + 13 < buf.length) {
          i += 12;
          rawPos += 6;
        }
      }
      continue;
    }

    // Inline control chars
    if (code > 0x0000 && code < 0x0020) {
      out += '￼';
      rawPos += 1;
      continue;
    }

    if (code < 0x0020 || code === 0xffff || code === 0xfffe) {
      rawPos += 1;
      continue;
    }

    out += String.fromCharCode(code);
    rawPos += 1;
  }

  setBoundary(rawPos, out.length);
  return { text: out, rawToOut };
}

function parseParaCharShapeRecord(data: Buffer): ParaCharShapeRun[] {
  // Empirical: u32le array.
  // Common layout: [0]=0, [1]=count, then pairs: (pos, charShapeIndex).
  // Some files appear to omit the leading (0,count) header and start directly with pairs.

  const out: ParaCharShapeRun[] = [];
  const n = Math.floor(data.length / 4);
  if (n < 2) return out;

  const isLikelyHeader = data.readUInt32LE(0) === 0 && n >= 4;
  const start = isLikelyHeader ? 2 : 0;

  for (let i = start; i + 1 < n; i += 2) {
    out.push({ pos: data.readUInt32LE(i * 4), charShapeIndex: data.readUInt32LE((i + 1) * 4) });
  }

  out.sort((a, b) => a.pos - b.pos);
  const uniq: ParaCharShapeRun[] = [];
  for (const r of out) {
    if (!uniq.length || uniq[uniq.length - 1]!.pos !== r.pos) uniq.push(r);
  }
  return uniq;
}


function u32Array(buf: Buffer): number[] {
  const out: number[] = [];
  for (let i = 0; i + 3 < buf.length; i += 4) out.push(buf.readUInt32LE(i));
  return out;
}

function charToControl(ch: string): Control | null {
  if (ch === '￼') return null;
  if (ch === '	') return { type: 'TabControl' } as Control;
  if (ch.charCodeAt(0) === 10) return { type: 'LineBreakControl' } as Control;
  if (ch === ' ') return { type: 'NbSpaceControl' } as Control;
  if (ch === '　') return { type: 'FwSpaceControl' } as Control;
  return { type: 'CharControl', text: ch } as Control;
}

function textToControls(text: string): Control[] {
  const out: Control[] = [];
  let acc = '';
  const flush = () => { if (acc) { out.push({ type: 'CharControl', text: acc } as Control); acc = ''; } };

  for (const ch of Array.from(text)) {
    const c = charToControl(ch);
    if (!c) continue;
    if (c.type === 'CharControl') acc += c.text;
    else { flush(); out.push(c); }
  }
  flush();
  return out;
}

function parseColDefFromTag69(tag69s: Buffer[]): ColDef | undefined {
  const u = u32Array(tag69s[0] ?? Buffer.alloc(0));
  const v = u.length >= 8 ? (u[7] ?? 0) : 0;

  // Empirical mapping from samples: v=20124 -> 2 cols, v=13416 -> 3 cols, v=42520 -> 1 col (default)
  const count = v === 20124 ? 2 : v === 13416 ? 3 : v === 42520 ? 1 : 0;
  if (count <= 1) return undefined;

  const gap = v;

  return {
    type: ColType.Newspaper,
    count,
    layoutType: ColLayoutType.Left,
    sameSize: true,
    sameGap: gap,
    columns: Array.from({ length: count }, () => ({ width: 0, gap })),
  };
}


function buildParagraphsFromBodyRecords(records: RecordHeader[]): { text: string; runs: ParaCharShapeRun[]; tag69s: Buffer[]; controlMask: number; breakType: number; paraShapeIndex: number; styleIndex: number; instId: number }[] {
  const paras: { text: string; runs: ParaCharShapeRun[]; tag69s: Buffer[]; controlMask: number; breakType: number; paraShapeIndex: number; styleIndex: number; instId: number }[] = [];

  let currentHeader: ParaHeaderInfo | null = null;
  let currentText: ParaTextDecoded | null = null;
  let currentRunsRaw: ParaCharShapeRun[] = [];
  let currentTag69s: Buffer[] = [];

  const mapRawPos = (rawToOut: number[], rawPos: number) => {
    if (!rawToOut.length) return 0;
    let rp = Math.max(0, rawPos | 0);
    if (rp >= rawToOut.length) rp = rawToOut.length - 1;
    for (let k = rp; k >= 0; k--) {
      const v = rawToOut[k];
      if (typeof v === 'number') return v;
    }
    return 0;
  };

  const flush = () => {
    const joined = currentText?.text ?? '';
    const rawToOut = currentText?.rawToOut ?? [];

    // Map raw run positions into decoded-string indices
    const runs = currentRunsRaw.map((r) => ({
      pos: mapRawPos(rawToOut, r.pos),
      charShapeIndex: r.charShapeIndex,
    }));
    paras.push({
      text: joined,
      runs,
      tag69s: currentTag69s,
      controlMask: currentHeader?.controlMask ?? 0,
      breakType: currentHeader?.breakType ?? 0,
      paraShapeIndex: currentHeader?.paraShapeIndex ?? 0,
      styleIndex: currentHeader?.styleIndex ?? 0,
      instId: currentHeader?.instId ?? 0,
    });
  };

  for (const r of records) {
    if (r.tagId === 66) {
      if (currentHeader || currentText) flush();
      currentHeader = parseParaHeader(r.data);
      currentText = null;
      currentRunsRaw = [];
      currentTag69s = [];
      continue;
    }
    if (r.tagId === 67) {
      currentText = decodeParaTextMapped(r.data, currentHeader?.nchars);
      continue;
    }
    if (r.tagId === 68) {
      currentRunsRaw = parseParaCharShapeRecord(r.data);
      continue;
    }
    if (r.tagId === 69) {
      currentTag69s.push(r.data);
      continue;
    }
  }

  if (currentHeader || currentText) flush();
  return paras;
}

function parsePageDefFromBodyRecords(records: RecordHeader[]): {
  width: number;
  height: number;
  margin: { left: number; right: number; top: number; bottom: number; header: number; footer: number; gutter: number };
} | null {
  // Empirical mapping from tag 73 (PAGE_DEF-like) record: sequence of (u32,u32) pairs
  // [0] width,height
  // [1] marginLeft, marginRight
  // [2] marginTop, marginBottom
  // [3] header, footer
  // [4] gutter, ?
  const r = records.find((x) => x.tagId === 73);
  if (!r || r.data.length < 32) return null;
  const pairs: { a: number; b: number }[] = [];
  for (let i = 0; i + 7 < r.data.length; i += 8) {
    pairs.push({ a: r.data.readUInt32LE(i), b: r.data.readUInt32LE(i + 4) });
  }
  if (pairs.length < 4) return null;
  const width = pairs[0].a;
  const height = pairs[0].b;
  const margin = {
    left: pairs[1].a,
    right: pairs[1].b,
    top: pairs[2].a,
    bottom: pairs[2].b,
    header: pairs[3].a,
    footer: pairs[3].b,
    gutter: pairs[4]?.a ?? 0,
  };
  if (!width || !height) return null;
  return { width, height, margin };
}
function listViewTextSections(cfb: any): string[] {
  const paths: string[] = (cfb.FullPaths ?? []) as string[];
  const secRe = new RegExp('ViewText/Section[0-9]+$');
  const capRe = new RegExp('ViewText/(Section[0-9]+)$');
  const idxRe = new RegExp('Section([0-9]+)$');

  const secs = paths
    .filter((p) => secRe.test(p))
    .map((p) => {
      const m = p.match(capRe);
      return m ? '/ViewText/' + m[1] : null;
    })
    .filter((p): p is string => !!p);

  const unique = [...new Set(secs)];
  unique.sort((a, b) => {
    const ai = parseInt(a.match(idxRe)?.[1] ?? '0', 10);
    const bi = parseInt(b.match(idxRe)?.[1] ?? '0', 10);
    return ai - bi;
  });
  return unique;
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

  const unique = [...new Set(secs)];
  unique.sort((a, b) => {
    const ai = parseInt(a.match(/Section(\d+)$/)?.[1] ?? '0', 10);
    const bi = parseInt(b.match(/Section(\d+)$/)?.[1] ?? '0', 10);
    return ai - bi;
  });
  return unique;
}

export function readHwp5(buffer: Buffer): DocumentModel {
  const cfb = CFB.read(buffer, { type: 'buffer' });

  // validate header
  const fileHeaderEntry = CFB.find(cfb as any, 'FileHeader') as any;
  const fh: Buffer | undefined = fileHeaderEntry?.content;
  if (!fh || !Buffer.isBuffer(fh) || fh.length < 64) {
    throw new Error('Invalid HWP5 FileHeader: missing/short content');
  }
  const sig = fh.subarray(0, 32).toString('ascii').replace(/\0+$/, '').trim();
  if (!sig.startsWith('HWP Document File')) {
    throw new Error(`Invalid HWP5 FileHeader signature: ${JSON.stringify(sig)}`);
  }

  const _verA = u32le(fh, 32);
  const _verB = u32le(fh, 36);
  const _flags = u32le(fh, 40);

  // DocInfo
  const docInfoEntry = CFB.find(cfb as any, '/DocInfo') as any;
  const docInfoCompressed: Buffer | undefined = docInfoEntry?.content;
  if (!docInfoCompressed || !Buffer.isBuffer(docInfoCompressed)) {
    throw new Error('Missing DocInfo stream');
  }
  const docInfoRaw = tryInflateRaw(docInfoCompressed);
  const tables = extractDocInfoTables(docInfoRaw);

  // BodyText (fallback) / ViewText (distribute docs)
  const bodyPaths = listBodyTextSections(cfb);
  const viewPaths = listViewTextSections(cfb);
  if (bodyPaths.length === 0 && viewPaths.length === 0) throw new Error('Missing BodyText/Section* and ViewText/Section* streams');

  const paragraphs: { text: string; runs: ParaCharShapeRun[]; tag69s: Buffer[]; controlMask: number; breakType: number; paraShapeIndex: number; styleIndex: number; instId: number }[] = [];
  let parsedPageDef: ReturnType<typeof parsePageDefFromBodyRecords> = null;

  const sectionIds = [...new Set([
    ...bodyPaths.map((p) => p.match(/Section([0-9]+)$/)?.[1]).filter((x): x is string => !!x),
    ...viewPaths.map((p) => p.match(/Section([0-9]+)$/)?.[1]).filter((x): x is string => !!x),
  ])].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  for (const sid of sectionIds) {
    const bodyPath = '/BodyText/Section' + sid;
    const viewPath = '/ViewText/Section' + sid;

    const bodyEntry = CFB.find(cfb as any, bodyPath) as any;
    const viewEntry = CFB.find(cfb as any, viewPath) as any;
    const bodyComp: Buffer | undefined = bodyEntry?.content;
    const viewComp: Buffer | undefined = viewEntry?.content;

    const bodyRaw = bodyComp && Buffer.isBuffer(bodyComp) ? tryInflateRaw(bodyComp) : null;
    const viewRaw = viewComp && Buffer.isBuffer(viewComp) ? decodeDistributeViewText(viewComp) : null;

    const bodyRecs = bodyRaw ? parseRecords(bodyRaw) : [];
    const viewRecs = viewRaw ? parseRecords(viewRaw) : [];

    const bodyScore = bodyRecs.reduce((acc, r) => acc + (r.tagId === 67 ? 5 : r.tagId === 66 ? 4 : r.tagId === 68 || r.tagId === 71 || r.tagId === 73 ? 2 : 0), 0);
    const viewScore = viewRecs.reduce((acc, r) => acc + (r.tagId === 67 ? 5 : r.tagId === 66 ? 4 : r.tagId === 68 || r.tagId === 71 || r.tagId === 73 ? 2 : 0), 0);

    const recs = viewScore > bodyScore ? viewRecs : bodyRecs;
    if (!recs.length) continue;

    if (!parsedPageDef) parsedPageDef = parsePageDefFromBodyRecords(recs);
    paragraphs.push(...buildParagraphsFromBodyRecords(recs));
  }

  const fonts = (tables.fontFaceNames.length ? tables.fontFaceNames : ['Default']).map((name) => ({ name, type: undefined }));

  const charShapesTable = tables.charShapes.length
    ? tables.charShapes
    : [
        {
          fontBaseSize: 10,
          color: [0, 0, 0] as const,
          shadeColor: [255, 255, 255] as const,
          fontId: [0, 0, 0, 0, 0, 0, 0],
          fontRatio: [100, 100, 100, 100, 100, 100, 100],
          fontSpacing: [0, 0, 0, 0, 0, 0, 0],
          fontScale: [100, 100, 100, 100, 100, 100, 100],
          fontLocation: [0, 0, 0, 0, 0, 0, 0],
        },
      ];

  const paraShapesTable = tables.paragraphShapes.length ? tables.paragraphShapes : [parseParaShapeRecord(Buffer.alloc(0))];

  const stylesTable = tables.styles.length
    ? tables.styles.map((s, i) => ({
        type: StyleType.Para,
        name: s.name,
        engName: s.engName,
        paraShapeIndex: 0,
        charShapeIndex: 0,
        nextStyleIndex: i + 1 < tables.styles.length ? i + 1 : 0,
      }))
    : [
        {
          type: StyleType.Para,
          name: '바탕글',
          engName: 'Normal',
          paraShapeIndex: 0,
          charShapeIndex: 0,
          nextStyleIndex: 0,
        },
      ];

  const pageDef = parsedPageDef
    ? {
        landscape: false,
        width: parsedPageDef.width,
        height: parsedPageDef.height,
        gutterType: GutterType.LeftOnly,
        margin: {
          left: parsedPageDef.margin.left,
          right: parsedPageDef.margin.right,
          top: parsedPageDef.margin.top,
          bottom: parsedPageDef.margin.bottom,
          header: parsedPageDef.margin.header,
          footer: parsedPageDef.margin.footer,
          gutter: parsedPageDef.margin.gutter,
        },
      }
    : {
        landscape: false,
        width: 59528,
        height: 84188,
        gutterType: GutterType.LeftOnly,
        margin: { left: 8504, right: 8504, top: 5669, bottom: 4252, header: 4252, footer: 4252, gutter: 0 },
      };

  const doc: DocumentModel = {
    head: {
      docSetting: {
        beginNumber: { page: 0, footnote: 0, endnote: 0, picture: 0, table: 0, equation: 0 },
        caretPos: { list: 0, para: 0, pos: 0 },
      },
      mappingTable: {
        fontFaces: {
          [LangType.Hangul]: fonts,
          [LangType.Latin]: fonts,
          [LangType.Hanja]: fonts,
          [LangType.Japanese]: fonts,
          [LangType.Other]: fonts,
          [LangType.Symbol]: fonts,
          [LangType.User]: fonts,
        },
        charShapes: charShapesTable.map((cs) => ({
          height: cs.fontBaseSize * 100,
          textColor: rgb(cs.color),
          shadeColor: rgb(cs.shadeColor),
          useFontSpace: (((cs.props ?? 0) >>> 25) & 0x1) !== 0,
          useKerning: ((cs.props ?? 0) & 0x40000000) !== 0,
          fontIds: toLangMap(cs.fontId, 0),
          ratios: toLangMap(cs.fontRatio, 100),
          charSpacings: toLangMap(cs.fontSpacing, 0),
          relSizes: toLangMap(cs.fontScale, 100),
          charOffsets: toLangMap(cs.fontLocation, 0),
          italic: ((cs.props ?? 0) & 0x2) !== 0,
          bold: ((cs.props ?? 0) & 0x1) !== 0,
          underline: ((cs.props ?? 0) & 0x4) !== 0
            ? { type: UnderlineType.Bottom, shape: LineType2.Solid, color: rgb(cs.color) }
            : undefined,
          strikeout: ((cs.props ?? 0) & 0x8) !== 0 || cs.strikeColor
            ? { type: StrikeoutType.Continuous, shape: LineType2.Solid, color: rgb(cs.strikeColor ?? cs.color) }
            : undefined,
          outline: (((cs.props ?? 0) >>> 8) & 0xff) !== 0 ? { type: LineType3.Solid } : undefined,
          shadow:
            (cs.shadowColor && ((cs.shadowOffsetX ?? 0) !== 0 || (cs.shadowOffsetY ?? 0) !== 0)) ||
            (cs.shadowOffsetX ?? 0) !== 0 ||
            (cs.shadowOffsetY ?? 0) !== 0
              ? {
                  type: ShadowType.Drop,
                  color: rgb((cs.shadowColor ?? [178, 178, 178]) as any),
                  offsetX: (cs.shadowOffsetX ?? 0) as any,
                  offsetY: (cs.shadowOffsetY ?? 0) as any,
                }
              : undefined,
          emboss: ((cs.props ?? 0) & 0x2000) !== 0,
          engrave: ((cs.props ?? 0) & 0x4000) !== 0,
          superscript: ((cs.props ?? 0) & 0x8000) !== 0,
          subscript: ((cs.props ?? 0) & 0x10000) !== 0,
        })),
        paraShapes: paraShapesTable.map((ps) => ({
          align: (ps.align as number) as AlignmentType1,
          verAlign: (ps.verAlign as number) as VerAlignType,
          headingType: (ps.headingType as number) as HeadingType,
          level: Math.min(ParaLevel.Level6 as number, ps.level) as ParaLevel,
          tabDef: ps.tabDef as any,
          breakLatinWordType: (ps.breakLatinWordType as number) as BreakLatinWordType,
          breakNonLatinWord: ps.breakNonLatinWord,
          condense: ps.condense,
          widowOrphan: ps.widowOrphan,
          keepWithNext: ps.keepWithNext,
          keepLines: ps.keepLines,
          pageBreakBefore: ps.pageBreakBefore,
          fontLineHeight: ps.fontLineHeight,
          snapToGrid: ps.snapToGrid,
          lineWrapType: (ps.lineWrapType as number) as LineWrapType,
          autoSpaceEAsianEng: ps.autoSpaceEAsianEng,
          autoSpaceEAsianNum: ps.autoSpaceEAsianNum,
        })),
        styles: stylesTable,
      },
    },
    body: {
      sections: [
        {
          def: {
            textDirection: TextDirection.Horizontal,
            spaceColumns: 1134,
            tabStop: 8000,
            pageDef: pageDef,
          },
          paragraphs: paragraphs.map((p) => {
            const text = p.text ?? '';
            const colDef = parseColDefFromTag69(p.tag69s ?? []);
            const pageBreak = (p.breakType & 0x04) !== 0;
            const columnBreak = (p.breakType & 0x02) !== 0 || (p.breakType & 0x08) !== 0;
            const baseIndex = 0;

            const points = [
              { pos: 0, charShapeIndex: baseIndex },
              ...(p.runs ?? []),
            ]
              .filter((r) => Number.isFinite(r.pos) && r.pos >= 0)
              .sort((a, b) => a.pos - b.pos);

            const uniq: { pos: number; charShapeIndex: number }[] = [];
            for (const r of points) {
              if (!uniq.length || uniq[uniq.length - 1]!.pos !== r.pos) uniq.push(r);
              else uniq[uniq.length - 1] = r;
            }

            const texts: { charShapeIndex: number; controls: Control[] }[] = [];
            for (let i = 0; i < uniq.length; i++) {
              const s = uniq[i]!.pos;
              const e = i + 1 < uniq.length ? uniq[i + 1]!.pos : text.length;
              const slice = text.slice(s, e);
              if (!slice) continue;
              const controls = textToControls(slice);
              if (!controls.length) continue;
              texts.push({
                charShapeIndex: uniq[i]!.charShapeIndex,
                controls,
              });
            }

            return {
              paraShapeIndex: p.paraShapeIndex ?? 0,
              styleIndex: p.styleIndex ?? 0,
              instId: p.instId ?? 0,
              pageBreak,
              columnBreak,
              colDef,
              texts: texts.length
                ? texts
                : [
                    {
                      charShapeIndex: 0,
                      controls: textToControls(text),
                    },
                  ],
            };
          }),
        },
      ],
    },
  };

  return doc;
}








