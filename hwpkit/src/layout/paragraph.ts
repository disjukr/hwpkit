import HWPDocument from 'hwp.js/build/models/document';
import DocParagraph from 'hwp.js/build/models/paragraph';
import HWPChar, { CharType } from 'hwp.js/build/models/char';
import { Control as DocControl } from 'hwp.js/build/models/controls';
import CharShape from 'hwp.js/build/models/charShape';

import { LayoutConfig } from '.';
import { Control, ControlType, FloatingObject, Offset2d, Paragraph, Segment } from '../rendering-model';
import {
  FloatingObjectEnvironment,
  isHangulCharCode,
  SizeConstraint,
} from './misc';
import { layoutControl, LayoutControlResultType } from './control';

/**
 * 문단 레이아웃은 크게 세 단계로 이루어집니다:
 * 1. `expandParagraph` - 컨트롤 목록에 관련 속성들을 찾아서 이어놓기
 * 2. `blockLayout` - 떠다니는 객체들과 각 글자를 레이아웃
 * 3. `inlineLayout` - 글자처럼 취급되는 객체들과 글자를 페이지 안쪽 및 떠다니는 객체 주변을 흘러다니도록 레이아웃
*/

export interface BlockLayoutConfig extends LayoutConfig {
  readonly expandedParagraph: ExpandedParagraph;
  readonly containerSizeConstraint: SizeConstraint;
  readonly floatingObjectEnvironment: FloatingObjectEnvironment;
}
export interface BlockLayoutResult {
  readonly inlineControls: Control[];
  readonly floatingObjectEnvironment: FloatingObjectEnvironment;
}
export function blockLayout(config: BlockLayoutConfig): BlockLayoutResult {
  const {
    expandedParagraph,
    floatingObjectEnvironment,
  } = config;
  const { expandedControls } = expandedParagraph;
  const inlineControls: Control[] = [];
  for (let i = 0; i < expandedControls.length; ++i) {
    const expandedControl = expandedControls[i];
    const layoutControlResult = layoutControl({ ...config, expandedControl });
    if (layoutControlResult.type === LayoutControlResultType.Inline) {
      inlineControls.push(layoutControlResult.control);
    }
    // TODO: floating object
  }
  return {
    inlineControls,
    floatingObjectEnvironment,
  };
}

export interface InlineLayoutConfig extends LayoutConfig {
  readonly expandedParagraph: ExpandedParagraph;
  readonly inlineControls: Control[];
  readonly startInlineControlOffset: number;
  readonly startOffset: Offset2d;
  readonly containerSizeConstraint: SizeConstraint;
  readonly floatingObjects: FloatingObject[];
}
export type InlineLayoutResult =
  | CompletedInlineLayoutResult
  | OverflowedInlineLayoutResult
;
export const enum InlineLayoutResultType {
  Completed,
  Overflowed,
}
interface InlineLayoutResultBase<TType extends InlineLayoutResultType> {
  readonly type: TType;
}
interface CompletedInlineLayoutResult extends InlineLayoutResultBase<InlineLayoutResultType.Completed> {
  readonly paragraph: Paragraph;
}
interface OverflowedInlineLayoutResult extends InlineLayoutResultBase<InlineLayoutResultType.Overflowed> {
  readonly paragraph: Paragraph | undefined;
  readonly endInlineControlOffset: number;
  readonly endOffset: Offset2d;
}
export function inlineLayout(config: InlineLayoutConfig): InlineLayoutResult {
  const {
    inlineControls,
    startInlineControlOffset,
    startOffset,
    containerSizeConstraint,
    floatingObjects,
  } = config;
  let currentInlineControlOffset = startInlineControlOffset;
  let currentOffset = { ...startOffset };
  const paragraph: Paragraph = {
    ...startOffset,
    width: 0,
    height: 0,
    lines: [],
  };
  while (currentInlineControlOffset < inlineControls.length) {
    const lineHeight = scanLineHeight(inlineControls, currentInlineControlOffset, containerSizeConstraint.maxWidth);
    const segments = getSegments(currentOffset, lineHeight, containerSizeConstraint, floatingObjects);
    if (segments.length === 0) {
      return {
        type: InlineLayoutResultType.Overflowed,
        paragraph: paragraph.lines.length === 0 ? undefined : paragraph,
        endInlineControlOffset: currentInlineControlOffset,
        endOffset: currentOffset,
      };
    }
    paragraph.lines.push({
      ...currentOffset,
      width: 0,
      height: 0,
      segments,
    });
    // TODO: currentInlineControlOffset가 증가해야함. 단어 배치, wrap up 등
  }
  return {
    type: InlineLayoutResultType.Completed,
    paragraph,
  };
}

export interface ExpandedParagraph {
  readonly docParagraph: DocParagraph;
  readonly expandedControls: ExpandedControl[];
}
export interface ExpandedControl {
  readonly char: HWPChar;
  readonly charShape: CharShape;
  readonly control: DocControl | undefined;
}
export function expandParagraph(document: HWPDocument, docParagraph: DocParagraph): ExpandedParagraph {
  const paragraphLength = docParagraph.content.length;
  const charShapes: CharShape[] = new Array(paragraphLength);
  for (let i = 0; i < docParagraph.shapeBuffer.length; ++i) {
    const shapePointer = docParagraph.shapeBuffer[i];
    const charShape = document.info.charShapes[shapePointer.shapeIndex];
    const start = shapePointer.pos;
    const end = docParagraph.getShapeEndPos(i);
    for (let j = start; j <= end; ++j) charShapes[j] = charShape;
  }
  const expandedControls: ExpandedControl[] = new Array(paragraphLength);
  let controlIndex = 0;
  for (let i = 0; i < paragraphLength; ++i) {
    const char = docParagraph.content[i];
    const charShape = charShapes[i];
    const control = (
      char.type === CharType.Extened ?
      docParagraph.controls[controlIndex++] :
      undefined
    );
    expandedControls[i] = { char, charShape, control };
  }
  return {
    docParagraph,
    expandedControls,
  };
}

function getMaxHeight<T extends { height: number }>(items: T[]): number {
  return Math.max.apply(null, items.map(item => item.height));
}

function scanLineHeight(inlineControls: Control[], currentOffset: number, maxWidth: number): number {
  let offsetX = 0;
  let maxControlHeight = 1; // 줄 높이가 1pt보다 작아질 수 없음
  for (let i = currentOffset; i < inlineControls.length; ++i) {
    const control = inlineControls[i];
    maxControlHeight = Math.max(maxControlHeight, control.height);
    offsetX += control.width;
    if (offsetX > maxWidth) return maxControlHeight;
  }
  return maxControlHeight;
}

function getSegments(
  startOffset: Offset2d,
  lineHeight: number,
  containerSizeConstraint: SizeConstraint,
  _floatingObjects: FloatingObject[]
): Segment[] {
  const bottom = startOffset.y + lineHeight;
  if (bottom > containerSizeConstraint.maxHeight) {
    return [];
  }
  // TODO: floatingObjects를 피해가는 Segment 목록 반환하기
  return [
    {
      x: startOffset.x,
      y: startOffset.y,
      width: containerSizeConstraint.maxWidth - startOffset.x,
      height: lineHeight,
      words: [],
    }
  ];
}

function getNextLineBreakableControlOffset(inlineControls: Control[], currentOffset: number): number {
  // 줄 나눔 기준이 한글 단위: '글자', 영어 단위: '단어'라고 가정
  const len = inlineControls.length;
  if (currentOffset >= len) return currentOffset;
  const nextOffset = currentOffset + 1;
  if (nextOffset >= len) return nextOffset;
  let currentLineBreakableType: LineBreakableType = getLineBreakableType(inlineControls[currentOffset]);
  if (currentLineBreakableType === LineBreakableType.Hangul) return nextOffset;
  for (let i = nextOffset; i < len; ++i) {
    const nextLineBreakableType = getLineBreakableType(inlineControls[i]);
    if (currentLineBreakableType !== nextLineBreakableType) return i;
    currentLineBreakableType = nextLineBreakableType;
  }
  return len;
}

const enum LineBreakableType {
  Hangul,
  English,
  Whitespace,
  Other,
}
function getLineBreakableType(control: Control): LineBreakableType {
  switch (control.type) {
    case ControlType.Whitespace: return LineBreakableType.Whitespace;
    case ControlType.Char:
      const charCode = control.char.charCodeAt(0);
      if (isHangulCharCode(charCode)) return LineBreakableType.Hangul;
      return LineBreakableType.English;
    default: return LineBreakableType.Other;
  }
}
