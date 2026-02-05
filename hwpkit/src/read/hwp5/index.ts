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

import { NativeHwp5Parser } from './native';

import type { Hwp5Control, Hwp5Paragraph, Hwp5ParsedDocument, Hwp5Rgb, Hwp5Section } from './types';

export function readHwp5(buffer: Buffer): DocumentModel {
  const doc = parseHwp5(buffer);

  const { info, sections } = doc;
  const { startingIndex: beginNumber, caratLocation, fontFaces, charShapes, paragraphShapes } = info;

  const fonts = fontFaces.map((fontFace) => ({
    name: fontFace.name,
    type: undefined,
  }));

  return {
    head: {
      docSetting: {
        beginNumber: beginNumber as any,
        caretPos: {
          list: caratLocation.listId,
          para: caratLocation.paragraphId,
          pos: caratLocation.charIndex,
        },
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
        charShapes: charShapes.map((charShape) => ({
          height: charShape.fontBaseSize * 100,
          textColor: rgb(charShape.color),
          shadeColor: rgb(charShape.shadeColor),
          useFontSpace: false,
          useKerning: false,
          fontIds: charShape.fontId as any,
          ratios: charShape.fontRatio as any,
          charSpacings: charShape.fontSpacing as any,
          relSizes: charShape.fontScale as any,
          charOffsets: charShape.fontLocation as any,
          italic: false,
          bold: false,
          underline: undefined,
          strikeout: charShape.strikeColor
            ? {
                type: StrikeoutType.Continuous,
                shape: LineType2.Solid,
                color: rgb(charShape.strikeColor),
              }
            : undefined,
          outline: undefined,
          shadow: undefined,
          emboss: false,
          engrave: false,
          superscript: false,
          subscript: false,
        })),
        paraShapes: paragraphShapes.map((paragraphShape) => ({
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
      sections: sections.map(section),
    },
  };
}

function parseHwp5(buffer: Buffer): Hwp5ParsedDocument {
  return new NativeHwp5Parser().parse(buffer);
}

function rgb(rgb: Hwp5Rgb): RgbColor {
  const [r, g, b] = rgb;
  return ((b << 16) & (g << 8) & r) as unknown as RgbColor;
}

function section(section: Hwp5Section): Section {
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

function paragraph(paragraph: Hwp5Paragraph): Paragraph {
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

type ExpandedChar = [Hwp5Paragraph['content'][number], Hwp5Control | null];

function isTextChar([char]: ExpandedChar): boolean {
  return char.type === 0;
}

function control([char, _control]: ExpandedChar): Control {
  if (char.type !== 0) throw new Error();
  const code = typeof char.value === 'string' ? char.value.charCodeAt(0) : char.value;
  return { type: ControlType.Char, code };
}

function splitCharsByShapes(paragraph: Hwp5Paragraph) {
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

function expandChars(paragraph: Hwp5Paragraph) {
  const len = paragraph.content.length;
  const result: ExpandedChar[] = new Array(len);
  let controlIndex = 0;
  for (let i = 0; i < len; ++i) {
    const char = paragraph.content[i];
    if (char.type === 2) {
      result[i] = [char, paragraph.controls[controlIndex++]];
    } else {
      result[i] = [char, null];
    }
  }
  return result;
}




