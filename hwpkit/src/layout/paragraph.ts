import HWPDocument from 'hwp.js/build/models/document';
import DocParagraph from 'hwp.js/build/models/paragraph';
import HWPChar, { CharType } from 'hwp.js/build/models/char';
import { Control as DocControl } from 'hwp.js/build/models/controls';
import CharShape from 'hwp.js/build/models/charShape';

import { LayoutConfig } from '.';
import { Offset2d, subOffset2d } from '../geom';
import { Control, ControlType, FloatingObject, InlineControl, Paragraph, Segment, Word, WordType } from '../rendering-model';
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
  readonly inlineControls: InlineControl[];
  readonly floatingObjectEnvironment: FloatingObjectEnvironment;
}
export function blockLayout(config: BlockLayoutConfig): BlockLayoutResult {
  const {
    expandedParagraph,
    floatingObjectEnvironment,
  } = config;
  const { expandedControls } = expandedParagraph;
  const inlineControls: InlineControl[] = [];
  let accWidth = 0;
  for (let i = 0; i < expandedControls.length; ++i) {
    const expandedControl = expandedControls[i];
    const layoutControlResult = layoutControl({ ...config, expandedControl });
    if (layoutControlResult.type === LayoutControlResultType.Inline) {
      const inlineControl = layoutControlResult.control as InlineControl;
      inlineControl.accWidth = accWidth += inlineControl.width;
      inlineControls.push(inlineControl);
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
  readonly inlineControls: InlineControl[];
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
  readonly endOffset: Offset2d;
}
interface OverflowedInlineLayoutResult extends InlineLayoutResultBase<InlineLayoutResultType.Overflowed> {
  readonly paragraph: Paragraph | undefined;
  readonly endInlineControlOffset: number;
  readonly endOffset: Offset2d;
}
export function inlineLayout(config: InlineLayoutConfig): InlineLayoutResult {
  const {
    document,
    expandedParagraph,
    inlineControls,
    startInlineControlOffset,
    startOffset,
    containerSizeConstraint,
    floatingObjects,
  } = config;
  const defaultCharShape = getDefaultCharShape(document, expandedParagraph.docParagraph);
  let currentInlineControlOffset = startInlineControlOffset;
  let currentOffset = { ...startOffset };
  const paragraph: Paragraph = {
    ...startOffset,
    width: containerSizeConstraint.maxWidth - startOffset.x,
    height: 0,
    lines: [],
  };
  while (currentInlineControlOffset < inlineControls.length) {
    const lineBoundingHeight = scanLineBoundingHeight(inlineControls, currentInlineControlOffset, containerSizeConstraint.maxWidth);
    const segments = getSegments(currentOffset, lineBoundingHeight, containerSizeConstraint, floatingObjects);
    if (!segments) {
      return {
        type: InlineLayoutResultType.Overflowed,
        paragraph: paragraph.lines.length === 0 ? undefined : paragraph,
        endInlineControlOffset: currentInlineControlOffset,
        endOffset: currentOffset,
      };
    }
    const currentLine = {
      ...(subOffset2d(startOffset, currentOffset)),
      width: 0,
      height: 0,
      segments,
    };
    paragraph.lines.push(currentLine);
    for (const segment of segments) {
      for (const word of words(inlineControls, currentInlineControlOffset)) {
        const overflowedWord = pushWordToSegment(segment, word);
        if (overflowedWord) {
          currentInlineControlOffset += word.controls.length - overflowedWord.controls.length;
          break;
        } else {
          currentInlineControlOffset += word.controls.length;
        }
      }
    }
    const segmentHeight = max(segments.map(segment => getMaxHeight(segment.words))) || defaultCharShape.fontBaseSize;
    for (const segment of segments) segment.height = segmentHeight;
    currentOffset.y += currentLine.height = segmentHeight * 1.6;
    // TODO: wrap up
  }
  return {
    type: InlineLayoutResultType.Completed,
    paragraph,
    endOffset: currentOffset,
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
export function getDefaultCharShape(document: HWPDocument, docParagraph: DocParagraph): CharShape {
  const shapePointer = docParagraph.shapeBuffer[0];
  return document.info.charShapes[shapePointer.shapeIndex];
}

/**
 * segment에 word를 집어넣습니다.
 * word가 segment에 들어가지 못하고 넘칠 경우 넘친 만큼을 잘라서 반환합니다.
 * 한 글자도 들어가지 못할 경우 그대로 반환합니다.
*/
function pushWordToSegment(segment: Segment, word: Word): Word | undefined {
  if (word.type === WordType.Whitespace) {
    segment.words.push(word);
    return undefined;
  }
  const restWidth = getRestWidthOfSegment(segment);
  if (restWidth >= word.width) {
    segment.words.push(word);
    return undefined;
  }
  const firstControl = word.controls[0];
  const left = firstControl.accWidth - firstControl.width;
  const overflowIndex = bisectRight(i => word.controls[i].accWidth, left + restWidth, 0, word.controls.length);
  const cutHere = segment.atLeastOne ? Math.max(1, overflowIndex) : overflowIndex;
  if (cutHere === 0) return word;
  const head = wrapControls(word.controls.slice(0, cutHere));
  const tail = wrapControls(word.controls.slice(cutHere));
  segment.words.push(head);
  return tail;
}
function bisectRight(get: (index: number) => number, target: number, lo: number, hi: number): number {
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (target < get(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

function getRestWidthOfSegment(segment: Segment): number {
  if (segment.words.length === 0) {
    return segment.width;
  } else {
    const firstControl = segment.words[0].controls[0];
    const lastWord = segment.words[segment.words.length - 1];
    const lastControl = lastWord.controls[lastWord.controls.length - 1];
    const using = lastControl.accWidth - (firstControl.accWidth - firstControl.width);
    return segment.width - using;
  }
}

function* words(inlineControls: InlineControl[], currentOffset: number): Generator<Word, void> {
  let curr = currentOffset;
  while (curr < inlineControls.length) {
    const next = getNextLineBreakableControlOffset(inlineControls, curr);
    if (next <= curr) return;
    yield wrapControls(inlineControls.slice(curr, next));
    curr = next;
  }
}

/**
 * control들을 묶어서 word로 만듭니다.
 * word의 height, x, y는 여기서 결정하지 않습니다.
*/
function wrapControls(inlineControls: InlineControl[]): Word {
  const firstControl = inlineControls[0];
  const endControl = inlineControls[inlineControls.length - 1];
  const type = (
    firstControl.type === ControlType.Whitespace ?
    WordType.Whitespace :
    WordType.Text
  );
  const left = firstControl.accWidth - firstControl.width;
  const right = endControl.accWidth;
  return {
    type,
    controls: inlineControls,
    width: right - left,
    height: 0,
    x: 0,
    y: 0,
  } as Word;
}

function max(numbers: number[]): number {
  return Math.max(0, Math.max.apply(null, numbers));
}
function getMaxHeight<T extends { height: number }>(items: T[]): number {
  return max(items.map(item => item.height));
}

function scanLineBoundingHeight(inlineControls: Control[], currentOffset: number, maxWidth: number): number {
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

/**
 * 지금 컨테이너 안에 segment 배치가 불가능한 경우 undefined를 반환합니다.
*/
function getSegments(
  startOffset: Offset2d,
  lineBoundingHeight: number,
  containerSizeConstraint: SizeConstraint,
  _floatingObjects: FloatingObject[]
): Segment[] | undefined {
  const bottom = startOffset.y + lineBoundingHeight;
  if (bottom > containerSizeConstraint.maxHeight) return undefined;
  // TODO: floatingObjects를 피해가는 Segment 목록 반환하기
  // floatingObjects와 맞닿은 Segment의 경우 atLeastOne 속성이 false여야 함
  return [
    {
      x: startOffset.x,
      y: startOffset.y,
      width: containerSizeConstraint.maxWidth - startOffset.x,
      height: lineBoundingHeight,
      words: [],
      atLeastOne: true,
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
