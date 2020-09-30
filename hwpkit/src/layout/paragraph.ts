import DocSection from 'hwp.js/build/models/section';
import DocParagraph from 'hwp.js/build/models/paragraph';
import HWPChar, { CharType } from 'hwp.js/build/models/char';

import { LayoutConfig } from '.';
import { Offset2d, Paragraph } from '../rendering-model';
import {
  FloatingObjectEnvironment,
  isWhitespaceCharCode,
  isHangulCharCode,
  SizeConstraint,
} from './misc';

export interface LayoutParagraphConfig extends LayoutConfig {
  readonly docSection: DocSection;
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
  const { docParagraph } = config;
  return {} as LayoutParagraphResult;
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
