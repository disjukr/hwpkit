import { parse } from 'hwp.js';
import type HwpjsSection from 'hwp.js/build/models/section';
import type HwpjsParagraph from 'hwp.js/build/models/paragraph';
import type HwpjsChar from 'hwp.js/build/models/char';
import type { Control as HwpjsControl } from 'hwp.js/build/models/controls';
import type { RGB as HwpjsRgb } from 'hwp.js/build/types/color';

import { Bufferlike } from '../misc/type';
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
  TextDirection,
  VerAlignType,
} from '../model/document';

export function parseHwp5(bufferlike: Bufferlike): DocumentModel {
  const hwpjsDocument = parseAsHwpjsDocument(bufferlike);
  const {
    info,
    sections,
  } = hwpjsDocument;
  const {
    startingIndex: beginNumber,
    caratLocation,
    fontFaces,
    charShapes,
    paragraphShapes,
  } = info;
  return {
    head: {
      docSetting: {
        beginNumber,
        caretPos: {
          list: caratLocation.listId,
          para: caratLocation.paragraphId,
          pos: caratLocation.charIndex,
        }
      },
      mappingTable: {
        fontFaces: [{
          // TODO: 국가별 글꼴 정보는 HWPTAG_ID_MAPPINGS 정보가 있어야 제대로 처리할 수 있음
          lang: LangType.Hangul,
          fonts: fontFaces.map(fontFace => ({
            name: fontFace.name,
            type: undefined,
          })),
        }],
        charShapes: charShapes.map(charShape => ({
          height: charShape.fontBaseSize * 1000,
          textColor: rgb(charShape.color),
          shadeColor: rgb(charShape.shadeColor),
          useFontSpace: false,
          useKerning: false,
          fontIds: charShape.fontId,
          ratios: charShape.fontRatio,
          charSpacings: charShape.fontSpacing,
          relSizes: charShape.fontScale,
          charOffsets: charShape.fontLocation,
          italic: false,
          bold: false,
          underline: undefined,
          strikeout: charShape.strikeColor ? {
            type: StrikeoutType.Continuous,
            shape: LineType2.Solid,
            color: rgb(charShape.strikeColor),
          } : undefined,
          outline: undefined,
          shadow: undefined,
          emboss: false,
          engrave: false,
          superscript: false,
          subscript: false,
        })),
        paraShapes: paragraphShapes.map(paragraphShape => ({
          align: paragraphShape.align as AlignmentType1,
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
      },
    },
    body: {
      sections: sections.map(section),
    },
  }
}

function rgb(rgb: HwpjsRgb): RgbColor {
  const [r, g, b] = rgb;
  return (b << 16) & (g << 8) & r;
}

function section(section: HwpjsSection): Section {
  return {
    def: {
      textDirection: TextDirection.Horizontal,
      spaceColumns: 1134,
      tabStop: 8000,
      pageDef: {
        landscape: false,
        width: section.width,
        height: section.height,
        gutterType: GutterType.LeftOnly,
        margin: {
          left: section.paddingLeft,
          right: section.paddingRight,
          top: section.paddingTop,
          bottom: section.paddingBottom,
          header: section.headerPadding,
          footer: section.footerPadding,
          gutter: 0,
        },
      },
    },
    paragraphs: section.content.map(paragraph),
  };
}

function paragraph(paragraph: HwpjsParagraph): Paragraph {
  const texts = splitCharsByShapes(paragraph);
  return {
    paraShapeIndex: paragraph.shapeIndex,
    styleIndex: 0,
    instId: 0,
    pageBreak: false,
    columnBreak: false,
    texts: texts.map(([chars, charShapeIndex]) => ({
      charShapeIndex,
      controls: chars.filter(isTextChar).map(control),
    })),
  };
}

function isTextChar([char]: ExpandedChar): boolean {
  return char.type === 0 /* CharType.Char */;
}

function control([char, _control]: ExpandedChar): Control {
  if (char.type !== 0 /* CharType.Char */) throw new Error(); // TODO: 텍스트가 아닌 경우 처리
  const code = typeof char.value === 'string' ? char.value.charCodeAt(0) : char.value;
  return { type: ControlType.Char, code };
}

function splitCharsByShapes(paragraph: HwpjsParagraph) {
  const result: [ExpandedChar[], number][] = [];
  const chars = expandChars(paragraph);
  for (let i = 0; i < paragraph.shapeBuffer.length; ++i) {
    const shapePointer = paragraph.shapeBuffer[i];
    const nextShapePointer = paragraph.shapeBuffer[i + 1];
    const start = shapePointer.pos;
    const end = nextShapePointer?.pos ?? chars.length;
    result.push([chars.slice(start, end), shapePointer.shapeIndex]);
  }
  return result;
}

type ExpandedChar = [HwpjsChar, HwpjsControl | null];
function expandChars(paragraph: HwpjsParagraph) {
  const len = paragraph.content.length;
  const result: ExpandedChar[] = new Array(len);
  let controlIndex = 0;
  for (let i = 0; i < len; ++i) {
    const char = paragraph.content[i];
    if (char.type === 2 /* CharType.Extened */) {
      result[i] = [char, paragraph.controls[controlIndex++]];
    } else {
      result[i] = [char, null];
    }
  }
  return result;
}

export function parseAsHwpjsDocument(bufferlike: Bufferlike) {
  return parse(Buffer.from(bufferlike), { type: 'buffer' });
}
