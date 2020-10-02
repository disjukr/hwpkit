import HWPDocument from 'hwp.js/build/models/document';
import DocParagraph from 'hwp.js/build/models/paragraph';
import HWPChar, { CharType } from 'hwp.js/build/models/char';
import { Control as DocControl } from 'hwp.js/build/models/controls';
import CharShape from 'hwp.js/build/models/charShape';

import { LayoutConfig } from '.';
import { Control, FloatingObject, Offset2d, Paragraph } from '../rendering-model';
import {
  FloatingObjectEnvironment,
  isWhitespaceCharCode,
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
}
export function inlineLayout(config: InlineLayoutConfig): InlineLayoutResult {
  const {
    inlineControls,
    startInlineControlOffset,
    startOffset,
    containerSizeConstraint,
  } = config;
  const maxControlHeight = Math.max.apply(
    null,
    inlineControls.slice(startInlineControlOffset).map(control => control.height)
  );
  if (startOffset.y !== 0) {
    if (maxControlHeight > containerSizeConstraint.maxHeight) {
      return {
        type: InlineLayoutResultType.Overflowed,
        paragraph: undefined,
        endInlineControlOffset: startInlineControlOffset,
      };
    }
  }
  // TODO
  return {} as InlineLayoutResult;
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
