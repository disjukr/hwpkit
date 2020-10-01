import HWPDocument from 'hwp.js/build/models/document';
import DocParagraph from 'hwp.js/build/models/paragraph';
import HWPChar, { CharType } from 'hwp.js/build/models/char';
import CharShape from 'hwp.js/build/models/charShape';

import { LayoutConfig } from '.';
import { Offset2d, Paragraph } from '../rendering-model';
import {
  FloatingObjectEnvironment,
  isWhitespaceCharCode,
  isHangulCharCode,
  SizeConstraint,
} from './misc';

export interface LayoutParagraphConfig extends LayoutConfig {
  readonly docParagraph: DocParagraph;
  readonly startControlOffset: number;
  readonly startOffset: Offset2d;
  readonly containerSizeConstraint: SizeConstraint;
  readonly floatingObjectEnvironment: FloatingObjectEnvironment;
}
export interface LayoutParagraphResult {
  readonly paragraph: Paragraph;
  readonly endControlOffset: number;
}
export function layoutParagraph(config: LayoutParagraphConfig): LayoutParagraphResult {
  const { document, docParagraph } = config;
  const charShapeBuffer = getCharShapeBuffer(document, docParagraph);
  return {} as LayoutParagraphResult;
}

export type CharShapeBuffer = (CharShape | undefined)[];
function getCharShapeBuffer(document: HWPDocument, docParagraph: DocParagraph): CharShapeBuffer {
  const charShapeBuffer: (CharShape | undefined)[] = new Array(docParagraph.content.length);
  for (let i = 0; i < docParagraph.shapeBuffer.length; ++i) {
    const shapePointer = docParagraph.shapeBuffer[i];
    const charShape = document.info.charShapes[shapePointer.shapeIndex];
    const start = shapePointer.pos;
    const end = docParagraph.getShapeEndPos(i);
    for (let j = start; j <= end; ++j) charShapeBuffer[j] = charShape;
  }
  return charShapeBuffer;
}

function getNextBreakableControlOffset(docParagraph: DocParagraph, currentOffset: number): number {
  // 줄 나눔 기준이 한글 단위: '글자', 영어 단위: '단어'라고 가정
  const len = docParagraph.content.length;
  if (currentOffset >= len) return currentOffset;
  const nextOffset = currentOffset + 1;
  if (nextOffset >= len) return nextOffset;
  let currentBreakableType: BreakableType = getBreakableType(docParagraph.content[currentOffset]);
  if (currentBreakableType === BreakableType.Hangul) return nextOffset;
  for (let i = nextOffset; i < len; ++i) {
    const nextBreakableType = getBreakableType(docParagraph.content[i]);
    if (currentBreakableType !== nextBreakableType) return i;
    currentBreakableType = nextBreakableType;
  }
  return len;
}

const enum BreakableType {
  Hangul,
  English,
  Whitespace,
  Other,
}
function getBreakableType(control: HWPChar): BreakableType {
  if (control.type !== CharType.Char) return BreakableType.Other;
  const charCode = typeof control.value === 'string' ? control.value.charCodeAt(0) : control.value;
  if (isWhitespaceCharCode(charCode)) return BreakableType.Whitespace;
  if (isHangulCharCode(charCode)) return BreakableType.Hangul;
  return BreakableType.English;
}

function charControlsToString(controls: HWPChar[]): string {
  return controls.map(control => {
    if (control.type !== CharType.Char) return '?';
    if (typeof control.value === 'string') return control.value;
    return String.fromCharCode(control.value);
  }).join('');
}
