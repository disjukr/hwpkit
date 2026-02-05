import {
  AlignmentType1,
  BreakLatinWordType,
  Control,
  ControlType,
  DocumentModel,
  GutterType,
  HeadingType,
  LangType,
  LineType2,
  LineWrapType,
  Paragraph,
  RgbColor,
  Section,
  StrikeoutType,
  StyleType,
  TextDirection,
  VerAlignType,
} from '../../model/document';

import * as CFB from 'cfb';
import * as zlib from 'zlib';

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
  // Heuristic bitfield decode from first u32. (Spec-accurate decode TBD)
  const props = data.length >= 4 ? data.readUInt32LE(0) : 0;

  return {
    align: (props >>> 2) & 0x7,
    verAlign: (props >>> 5) & 0x3,
    headingType: (props >>> 7) & 0x3,
    level: (props >>> 9) & 0x7,
    tabDef: 0,
    breakLatinWordType: 0,
    breakNonLatinWord: true,
    condense: 0,
    widowOrphan: false,
    keepWithNext: false,
    keepLines: false,
    pageBreakBefore: false,
    fontLineHeight: false,
    snapToGrid: true,
    lineWrapType: 0,
    autoSpaceEAsianEng: true,
    autoSpaceEAsianNum: true,
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
    fontId: number[];
    fontRatio: number[];
    fontSpacing: number[];
    fontScale: number[];
    fontLocation: number[];
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
    const fontId = parseU16Array(r.data, 0, 7);

    // TODO: parse properly per spec. For now keep stable minimal defaults.
    const fontRatio = [100, 100, 100, 100, 100, 100, 100];
    const fontSpacing = parseU16Array(r.data, 28, 7);
    const fontScale = parseU16Array(r.data, 14, 7);
    const fontLocation = [0, 0, 0, 0, 0, 0, 0];

    const baseSize100 = r.data.length >= 44 ? r.data.readUInt16LE(42) : 1000;
    const fontBaseSize = baseSize100 / 100;

    return {
      fontBaseSize,
      color: r.data.length >= 68 ? bbggrrToRgb(r.data.readUInt32LE(60) >>> 0) : ([0, 0, 0] as const),
      shadeColor: r.data.length >= 72 ? bbggrrToRgb(r.data.readUInt32LE(64) >>> 0) : ([255, 255, 255] as const),
      fontId,
      fontRatio,
      fontSpacing,
      fontScale,
      fontLocation,
      strikeColor: r.data.length >= 56 && r.data.readUInt32LE(52) !== 0 ? bbggrrToRgb(r.data.readUInt32LE(52) >>> 0) : undefined,
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

    if (code === 0x0009) {
      out += '\t';
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

    // CtrlCh placeholder+skip
    if (code > 0x0000 && code < 0x0020) {
      out += '\uFFFC';
      if (i + 9 < data.length) i += 8;
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
      if (isAsciiPair(w1) && isAsciiPair(w2)) i += 4;
      continue;
    }

    if (code < 0x0020) continue;
    if (code === 0xffff || code === 0xfffe) continue;

    out += String.fromCharCode(code);
  }
  return out;
}

type ParaHeaderInfo = { nchars: number };

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

  const flush = () => {
    const joined = currentTextParts.join('');
    // HWP sometimes encodes paragraph breaks as newline chars inside PARA_TEXT.
    // As a pragmatic fallback, split on \n into multiple paragraphs.
    const parts = joined.split('\n');
    for (const part of parts) paras.push(part);
  };

  for (const r of records) {
    if (r.tagId === 66) {
      if (currentHeader || currentTextParts.length) flush();
      currentHeader = parseParaHeader(r.data);
      currentTextParts = [];
      continue;
    }
    if (r.tagId === 67) {
      currentTextParts.push(decodeParaTextWithCount(r.data, currentHeader?.nchars));
      continue;
    }
  }

  if (currentHeader || currentTextParts.length) flush();
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

  // BodyText
  const sectionPaths = listBodyTextSections(cfb);
  if (sectionPaths.length === 0) throw new Error('Missing BodyText/Section* streams');

  const paragraphsText: string[] = [];
  let parsedPageDef: ReturnType<typeof parsePageDefFromBodyRecords> = null;
  for (const secPath of sectionPaths) {
    const entry = CFB.find(cfb as any, secPath) as any;
    const comp: Buffer | undefined = entry?.content;
    if (!comp || !Buffer.isBuffer(comp)) continue;
    const raw = tryInflateRaw(comp);
    const recs = parseRecords(raw);
    if (!parsedPageDef) parsedPageDef = parsePageDefFromBodyRecords(recs);
    paragraphsText.push(...buildParagraphTextsFromBodyRecords(recs));
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
          useFontSpace: false,
          useKerning: false,
          fontIds: toLangMap(cs.fontId, 0),
          ratios: toLangMap(cs.fontRatio, 100),
          charSpacings: toLangMap(cs.fontSpacing, 0),
          relSizes: toLangMap(cs.fontScale, 100),
          charOffsets: toLangMap(cs.fontLocation, 0),
          italic: false,
          bold: false,
          underline: undefined,
          strikeout: cs.strikeColor
            ? { type: StrikeoutType.Continuous, shape: LineType2.Solid, color: rgb(cs.strikeColor) }
            : undefined,
          outline: undefined,
          shadow: undefined,
          emboss: false,
          engrave: false,
          superscript: false,
          subscript: false,
        })),
        paraShapes: paraShapesTable.map((ps) => ({
          align: (ps.align as number) as AlignmentType1,
          verAlign: (ps.verAlign as number) as VerAlignType,
          headingType: (ps.headingType as number) as HeadingType,
          level: (Math.min(6, ps.level) as any) as any,
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
          paragraphs: paragraphsText.map((pt) => ({
            paraShapeIndex: 0,
            styleIndex: 0,
            instId: 0,
            pageBreak: false,
            columnBreak: false,
            texts: [
              {
                charShapeIndex: 0,
                controls: Array.from(pt).map((ch) => ({
                  type: ControlType.Char,
                  code: ch.charCodeAt(0),
                })) as Control[],
              },
            ],
          })),
        },
      ],
    },
  };

  return doc;
}







