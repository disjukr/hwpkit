import { LayoutConfig } from '.';
import { Offset2d, subOffset2d } from '../model/geom';
import {
  Paragraph as DocParagraph,
  ParaShape,
  AlignmentType1,
} from '../model/document';
import { Control, ControlType, FloatingObject, InlineControl, Paragraph, Segment, Word, WordType } from '../model/rendering';
import {
  ColumnInfo,
  PaperInfo,
  isHangulCharCode,
  SizeConstraint,
} from './misc';
import { layoutControl, LayoutControlResultType } from './control';

/**
 * 문단 레이아웃은 크게 두 단계로 이루어집니다:
 * 1. `blockLayout` - 떠다니는 객체들과 각 글자를 레이아웃
 * 2. `inlineLayout` - 글자처럼 취급되는 객체들과 글자를 페이지 안쪽 및 떠다니는 객체 주변을 흘러다니도록 레이아웃
*/

export interface BlockLayoutConfig extends LayoutConfig {
  readonly docParagraph: DocParagraph;
  readonly columnSizeConstraint: SizeConstraint;
  readonly paperInfo: PaperInfo;
  readonly columnInfo: ColumnInfo;
  readonly floatingObjects: FloatingObject[];
}
export interface BlockLayoutResult {
  readonly inlineControls: InlineControl[];
  readonly floatingObjects: FloatingObject[];
}
export function blockLayout(config: BlockLayoutConfig): BlockLayoutResult {
  const {
    document,
    docParagraph,
    floatingObjects,
  } = config;
  const { charShapes } = document.head.mappingTable;
  const inlineControls: InlineControl[] = [];
  let accWidth = 0;
  for (const text of docParagraph.texts) {
    const charShape = charShapes[text.charShapeIndex];
    for (const control of text.controls) {
      const layoutControlResult = layoutControl({ ...config, control, charShape });
      if (layoutControlResult.type === LayoutControlResultType.Inline) {
        const inlineControl = layoutControlResult.control as InlineControl;
        inlineControl.accWidth = accWidth += inlineControl.width;
        inlineControls.push(inlineControl);
      }
      // TODO: floating object
    }
  }
  return {
    inlineControls,
    floatingObjects,
  };
}

export interface InlineLayoutConfig extends LayoutConfig {
  readonly docParagraph: DocParagraph;
  readonly inlineControls: InlineControl[];
  readonly startInlineControlOffset: number;
  readonly startOffset: Offset2d;
  readonly columnSizeConstraint: SizeConstraint;
  readonly paperInfo: PaperInfo;
  readonly columnInfo: ColumnInfo;
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
    docParagraph,
    inlineControls,
    startInlineControlOffset,
    startOffset,
    columnSizeConstraint,
    paperInfo,
    columnInfo,
    floatingObjects,
  } = config;
  const { mappingTable } = document.head;
  const paraShape = mappingTable.paraShapes[docParagraph.paraShapeIndex];
  const style = mappingTable.styles[docParagraph.styleIndex];
  const defaultCharShape = mappingTable.charShapes[style.charShapeIndex];
  let currentInlineControlOffset = startInlineControlOffset;
  let currentOffset = { ...startOffset };
  const paragraph: Paragraph = {
    ...(subOffset2d(subOffset2d(currentOffset, paperInfo.page), columnInfo)),
    width: columnSizeConstraint.maxWidth,
    height: 0,
    lines: [],
  };
  do {
    const lineBoundingHeight = scanLineBoundingHeight(
      inlineControls,
      currentInlineControlOffset,
      columnSizeConstraint.maxWidth
    ) || defaultCharShape.height;
    const segments = getSegments(
      currentOffset,
      lineBoundingHeight,
      columnSizeConstraint,
      paperInfo,
      columnInfo,
      floatingObjects
    );
    if (!segments) {
      return {
        type: InlineLayoutResultType.Overflowed,
        paragraph: wrapUp(paragraph, paraShape, currentOffset),
        endInlineControlOffset: currentInlineControlOffset,
        endOffset: currentOffset,
      };
    }
    const currentLine = {
      ...(subOffset2d(currentOffset, startOffset)),
      width: paragraph.width,
      height: 0,
      segments,
    };
    paragraph.lines.push(currentLine);
    for (const segment of segments) {
      for (const word of words(inlineControls, currentInlineControlOffset)) {
        const overflowedWord = pushWordToSegment(segment, word);
        if (overflowedWord) {
          currentInlineControlOffset += word.controls.length - overflowedWord.controls.length;
          segment.full = true;
          break;
        } else {
          currentInlineControlOffset += word.controls.length;
        }
      }
    }
    const segmentHeight = max(segments.map(segment => getMaxHeight(segment.words))) || defaultCharShape.height;
    for (const segment of segments) segment.height = segmentHeight;
    currentOffset.y += currentLine.height = segmentHeight * 1.6;
  } while (currentInlineControlOffset < inlineControls.length);
  return {
    type: InlineLayoutResultType.Completed,
    paragraph: wrapUp(paragraph, paraShape, currentOffset)!,
    endOffset: currentOffset,
  };
}

function wrapUp(
  paragraph: Paragraph,
  paraShape: ParaShape,
  currentOffset: Offset2d
): Paragraph | undefined {
  if (paragraph.lines.length === 0) return undefined;
  for (const line of paragraph.lines) {
    for (const segment of line.segments) {
      align(paraShape.align, segment);
      for (const word of segment.words) {
        word.height = segment.height;
        let offsetX = 0;
        for (const control of word.controls) {
          control.y = word.height - control.height;
          control.x = offsetX;
          offsetX += control.width;
        }
      }
    }
  }
  paragraph.height = currentOffset.y - paragraph.y;
  return paragraph;
}

function align(alignType: AlignmentType1, segment: Segment) {
  switch (alignType) {
    case AlignmentType1.Justify: alignJustify(segment); break;
    case AlignmentType1.Left: alignLeft(segment); break;
    case AlignmentType1.Right: alignRight(segment); break;
    case AlignmentType1.Center: alignCenter(segment); break;
    case AlignmentType1.Distribute: alignDistribute(segment); break;
    case AlignmentType1.DistributeSpace: alignDistributeSpace(segment); break;
    default: alignJustify(segment); break;
  }
}

function alignLeft(segment: Segment) {
  let offsetX = 0;
  for (const word of segment.words) {
    word.x = offsetX;
    offsetX += word.width;
  }
}

function alignRight(segment: Segment) {
  if (segment.words.length === 0) return;
  const words = [...segment.words];
  const lastWord = words[words.length - 1];
  if (lastWord.type === WordType.Whitespace) {
    lastWord.x = segment.width;
    words.pop();
  }
  let offsetX = 0;
  for (const word of words.reverse()) {
    word.x = segment.width - offsetX - word.width;
    offsetX += word.width;
  }
}

function alignCenter(segment: Segment) {
  if (segment.words.length === 0) return;
  alignLeft(segment);
  const firstWord = segment.words[0];
  const lastWord = findRight(segment.words, word => word.type !== WordType.Whitespace) || firstWord;
  const left = firstWord.x;
  const right = lastWord.x + lastWord.width;
  const leftOffset = (segment.width - (right - left)) / 2;
  for (const word of segment.words) word.x += leftOffset;
}

type JistifyInfo = ReturnType<typeof getJustifyInfo>;
function getJustifyInfo(segment: Segment) {
  const lastWord = segment.words[segment.words.length - 1];
  const gaps = segment.words.filter(word => word.type === WordType.Whitespace);
  const things = segment.words.filter(word => word.type !== WordType.Whitespace);
  if (lastWord.type === WordType.Whitespace) gaps.pop();
  const totalGapWidth = sum(gaps.map(word => word.width));
  const totalThingsWidth = sum(things.map(word => word.width));
  return {
    gaps,
    things,
    totalGapWidth,
    totalThingsWidth,
  };
}

function justify(justifyInfo: JistifyInfo, segment: Segment) {
  const {
    totalGapWidth,
    totalThingsWidth,
  } = justifyInfo;
  const gapScale = (segment.width - totalThingsWidth) / totalGapWidth;
  let offsetX = 0;
  for (const word of segment.words) {
    word.x = offsetX;
    if (word.type === WordType.Whitespace) {
      offsetX += word.width * gapScale;
    } else {
      offsetX += word.width;
    }
  }
}

function alignJustify(segment: Segment) {
  if (segment.words.length === 0) return;
  const justifyInfo = getJustifyInfo(segment);
  if (segment.full) {
    justify(justifyInfo, segment);
  } else {
    alignLeft(segment);
  }
}

function alignDistribute(segment: Segment) {
  if (segment.words.length === 0) return;
  const justifyInfo = getJustifyInfo(segment);
  if (segment.full) return justify(justifyInfo, segment);
  const {
    gaps,
    things,
    totalGapWidth,
    totalThingsWidth,
  } = justifyInfo;
  const controlCount = (
    sum(gaps.map(gap => gap.controls.length)) +
    sum(things.map(thing => thing.controls.length))
  );
  if (controlCount < 2) return alignLeft(segment);
  const restWidth = segment.width - totalGapWidth - totalThingsWidth;
  const padding = restWidth / (controlCount - 1);
  let offsetX = 0;
  for (const word of segment.words) {
    word.x = offsetX;
    let controlOffsetX = 0;
    for (const control of word.controls) {
      control.width += padding;
      controlOffsetX += control.width;
    }
    word.width = controlOffsetX;
    offsetX += word.width;
  }
}

function alignDistributeSpace(segment: Segment) {
  if (segment.words.length === 0) return;
  const justifyInfo = getJustifyInfo(segment);
  justify(justifyInfo, segment);
}

function findRight<T>(items: T[], predicate: (item: T) => boolean): T | undefined {
  for (let i = items.length - 1; i >= 0; --i) {
    if (predicate(items[i])) return items[i];
  }
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
  const segmentIsEmpty = segment.words.length === 0;
  if (!segmentIsEmpty) return word;
  const firstControl = word.controls[0];
  const left = firstControl.accWidth - firstControl.width;
  const overflowIndex = bisectRight(i => word.controls[i].accWidth, left + restWidth, 0, word.controls.length);
  const cutHere = segment.atLeastOne ? Math.max(1, overflowIndex) : overflowIndex;
  if (cutHere === 0) return word;
  if (cutHere >= word.controls.length) {
    return word;
  } else {
    const head = wrapControls(word.controls.slice(0, cutHere));
    const tail = wrapControls(word.controls.slice(cutHere));
    segment.words.push(head);
    return tail;
  }
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
function sum(numbers: number[]): number {
  return numbers.reduce((prev, curr) => prev + curr, 0);
}

function scanLineBoundingHeight(inlineControls: Control[], currentOffset: number, maxWidth: number): number {
  let offsetX = 0;
  let maxControlHeight = 0;
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
  columnSizeConstraint: SizeConstraint,
  paperInfo: PaperInfo,
  columnInfo: ColumnInfo,
  _floatingObjects: FloatingObject[]
): Segment[] | undefined {
  const bottom = startOffset.y + lineBoundingHeight;
  if ((bottom - paperInfo.page.y - columnInfo.y) > columnSizeConstraint.maxHeight) return undefined;
  // TODO: floatingObjects를 피해가는 Segment 목록 반환하기
  // floatingObjects와 맞닿은 Segment의 경우 atLeastOne 속성이 false여야 함
  return [
    {
      x: 0,
      y: 0,
      width: columnSizeConstraint.maxWidth,
      height: lineBoundingHeight,
      words: [],
      atLeastOne: true,
      full: false,
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
