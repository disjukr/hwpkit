import { parse } from 'hwp.js';
import type HwpjsSection from 'hwp.js/build/models/section';
import type HwpjsParagraph from 'hwp.js/build/models/paragraph';
import type HwpjsChar from 'hwp.js/build/models/char';
import type { RGB as HwpjsRgb } from 'hwp.js/build/types/color';

import type { Hwp5Parser } from '../parser';
import type {
  Hwp5ParsedDocument,
  Hwp5Section,
  Hwp5Paragraph,
  Hwp5Char,
  Hwp5Control,
  Hwp5Rgb,
} from '../types';

type HwpjsDocument = {
  info: {
    startingIndex: number;
    caratLocation: { listId: number; paragraphId: number; charIndex: number };
    fontFaces: { name: string }[];
    charShapes: Array<{
      fontBaseSize: number;
      color: HwpjsRgb;
      shadeColor: HwpjsRgb;
      fontId: number[];
      fontRatio: number[];
      fontSpacing: number[];
      fontScale: number[];
      fontLocation: number[];
      strikeColor?: HwpjsRgb;
    }>;
    paragraphShapes: Array<{ align: number }>;
  };
  sections: HwpjsSection[];
};

export class HwpjsHwp5Parser implements Hwp5Parser {
  parse(buffer: Buffer): Hwp5ParsedDocument {
    const doc = readAsHwpjsDocument(buffer) as HwpjsDocument;
    return {
      info: {
        startingIndex: doc.info.startingIndex,
        caratLocation: doc.info.caratLocation,
        fontFaces: doc.info.fontFaces,
        charShapes: doc.info.charShapes.map((cs) => ({
          fontBaseSize: cs.fontBaseSize,
          color: cs.color as unknown as Hwp5Rgb,
          shadeColor: cs.shadeColor as unknown as Hwp5Rgb,
          fontId: cs.fontId,
          fontRatio: cs.fontRatio,
          fontSpacing: cs.fontSpacing,
          fontScale: cs.fontScale,
          fontLocation: cs.fontLocation,
          strikeColor: cs.strikeColor as unknown as (Hwp5Rgb | undefined),
        })),
        paragraphShapes: doc.info.paragraphShapes,
      },
      sections: doc.sections.map(section),
    };
  }
}

function section(s: HwpjsSection): Hwp5Section {
  return {
    width: s.width,
    height: s.height,
    paddingLeft: s.paddingLeft,
    paddingRight: s.paddingRight,
    paddingTop: s.paddingTop,
    paddingBottom: s.paddingBottom,
    headerPadding: s.headerPadding,
    footerPadding: s.footerPadding,
    content: s.content.map(paragraph),
  };
}

function paragraph(p: HwpjsParagraph): Hwp5Paragraph {
  return {
    shapeIndex: p.shapeIndex,
    shapeBuffer: p.shapeBuffer.map((sp) => ({ pos: sp.pos, shapeIndex: sp.shapeIndex })),
    content: p.content.map(char),
    controls: p.controls as unknown as Hwp5Control[],
  };
}

function char(c: HwpjsChar): Hwp5Char {
  return {
    type: c.type as 0 | 2,
    value: c.value,
  };
}

export function readAsHwpjsDocument(buffer: Buffer): unknown {
  return parse(buffer, { type: 'buffer' });
}
