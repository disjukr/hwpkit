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
  return ((b << 16) & (g << 8) & r) as unknown as RgbColor;
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
    color: readonly [number, number, number];
    shadeColor: readonly [number, number, number];
    fontId: number[];
    fontRatio: number[];
    fontSpacing: number[];
    fontScale: number[];
    fontLocation: number[];
    strikeColor?: readonly [number, number, number];
  }[];
} {
  const recs = parseRecords(docInfoRaw);

  const fontFaceNames = extractFontFaceNames(docInfoRaw);

  const paragraphShapes = recs.filter((r) => r.tagId === 25).map(() => ({ align: 0 }));

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
      color: [0, 0, 0] as const,
      shadeColor: [255, 255, 255] as const,
      fontId,
      fontRatio,
      fontSpacing,
      fontScale,
      fontLocation,
    };
  });

  return { fontFaceNames, paragraphShapes, charShapes };
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

  for (const r of records) {
    if (r.tagId === 66) {
      if (currentHeader || currentTextParts.length) paras.push(currentTextParts.join(''));
      currentHeader = parseParaHeader(r.data);
      currentTextParts = [];
      continue;
    }
    if (r.tagId === 67) {
      currentTextParts.push(decodeParaTextWithCount(r.data, currentHeader?.nchars));
      continue;
    }
  }

  if (currentHeader || currentTextParts.length) paras.push(currentTextParts.join(''));
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
  for (const secPath of sectionPaths) {
    const entry = CFB.find(cfb as any, secPath) as any;
    const comp: Buffer | undefined = entry?.content;
    if (!comp || !Buffer.isBuffer(comp)) continue;
    const raw = tryInflateRaw(comp);
    const recs = parseRecords(raw);
    paragraphsText.push(...buildParagraphTextsFromBodyRecords(recs));
  }

  const fonts = tables.fontFaceNames.map((name) => ({ name, type: undefined }));

  const doc: DocumentModel = {
    head: {
      docSetting: {
        beginNumber: 0 as any,
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
        charShapes: tables.charShapes.map((cs) => ({
          height: cs.fontBaseSize * 100,
          textColor: rgb(cs.color),
          shadeColor: rgb(cs.shadeColor),
          useFontSpace: false,
          useKerning: false,
          fontIds: cs.fontId as any,
          ratios: cs.fontRatio as any,
          charSpacings: cs.fontSpacing as any,
          relSizes: cs.fontScale as any,
          charOffsets: cs.fontLocation as any,
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
        paraShapes: tables.paragraphShapes.map((ps) => ({
          align: ps.align as AlignmentType1,
          verAlign: VerAlignType.Baseline,
          headingType: HeadingType.None,
          level: 0,
          tabDef: 0,
          breakLatinWordType: BreakLatinWordType.KeepWord,
          breakNonLatinWord: true,
          condense: 0,
          widowOrphan: false,
          keepWithNext: false,
          keepLines: false,
          pageBreakBefore: false,
          fontLineHeight: false,
          snapToGrid: true,
          lineWrapType: LineWrapType.Break,
          autoSpaceEAsianEng: true,
          autoSpaceEAsianNum: true,
        })),
        styles: [
          {
            type: StyleType.Para,
            name: '바탕글',
            engName: 'Normal',
            paraShapeIndex: 0,
            charShapeIndex: 0,
            nextStyleIndex: 0,
          },
        ],
      },
    },
    body: {
      sections: [
        {
          def: {
            textDirection: TextDirection.Horizontal,
            spaceColumns: 1134,
            tabStop: 8000,
            pageDef: {
              landscape: false,
              width: 59528,
              height: 84188,
              gutterType: GutterType.LeftOnly,
              margin: {
                left: 8504,
                right: 8504,
                top: 5669,
                bottom: 4252,
                header: 4252,
                footer: 4252,
                gutter: 0,
              },
            },
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
