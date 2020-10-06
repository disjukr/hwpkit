// import type { default as HWPChar, CharType } from 'hwp.js/build/models/char';
import type HWPChar from 'hwp.js/build/models/char';
import type CharShape from 'hwp.js/build/models/charShape';

import { LayoutConfig } from '..';
import {
  CharControl,
  Control,
  ControlType,
  WhitespaceControl,
} from '../../rendering-model';
import { isWhitespaceCharCode } from '../misc';
import { ExpandedControl } from '../paragraph';

export interface LayoutControlConfig extends LayoutConfig {
  readonly expandedControl: ExpandedControl;
}
export type LayoutControlResult =
  | NoneLayoutControlResult
  | InlineLayoutControlResult
  | FloatingObjectLayoutControlResult
;
export const enum LayoutControlResultType {
  None,
  Inline,
  FloatingObject,
}
interface LayoutControlResultBase<TType extends LayoutControlResultType> {
  readonly type: TType;
}
interface NoneLayoutControlResult extends LayoutControlResultBase<LayoutControlResultType.None> {}
interface InlineLayoutControlResult extends LayoutControlResultBase<LayoutControlResultType.Inline> {
  control: Control;
}
interface FloatingObjectLayoutControlResult extends LayoutControlResultBase<LayoutControlResultType.FloatingObject> {
  /**
   * 떠다니는 객체의 경우 완전히 지금 페이지에서 벗어나 다음 페이지부터 시작될 수 있음.
  */
  control: Control | undefined;
}
export function layoutControl(config: LayoutControlConfig): LayoutControlResult {
  const { expandedControl } = config;
  const { char: docChar, charShape } = expandedControl;
  switch (docChar.type) {
    case 1 /* CharType.Inline */:
    case 2 /* CharType.Extened */:
      // TODO
      return { type: LayoutControlResultType.None };
    case 0 /* CharType.Char */: {
      const char = getStringFromDocChar(docChar);
      if (isWhitespaceCharCode(char.charCodeAt(0))) {
        return {
          type: LayoutControlResultType.Inline,
          control: layoutWhitespaceControl(char, charShape),
        };
      } else {
        return {
          type: LayoutControlResultType.Inline,
          control: layoutCharControl(char, charShape),
        };
      }
    }
  }
  return null as never;
}

function layoutWhitespaceControl(char: string, charShape: CharShape): WhitespaceControl {
  return {
    type: ControlType.Whitespace,
    char,
    x: 0,
    y: 0,
    // '글꼴에 어울리는 빈칸'이 아닌 경우 공백문자의 가로폭은 글자 크기의 절반
    // 참조: https://hancom.com/cs_center/csFaqDetail.do?faq_seq=731
    width: charShape.fontBaseSize / 2,
    height: charShape.fontBaseSize,
  };
}

function layoutCharControl(char: string, charShape: CharShape): CharControl {
  return {
    type: ControlType.Char,
    char,
    x: 0,
    y: 0,
    width: charShape.fontBaseSize, // TODO: 폰트로부터 계산하도록 수정
    height: charShape.fontBaseSize,
  };
}

function getStringFromDocChar(docChar: HWPChar): string {
  if (typeof docChar.value === 'string') return docChar.value;
  return String.fromCharCode(docChar.value);
}
