import HWPChar, { CharType } from 'hwp.js/build/models/char';
import CharShape from 'hwp.js/build/models/charShape';
import { Control as DocControl } from 'hwp.js/build/models/controls';

import { LayoutConfig } from '..';
import {
  CharControl,
  Control,
  ControlType,
  WhitespaceControl,
} from '../../rendering-model';
import { isWhitespaceCharCode } from '../misc';

export interface LayoutControlConfig extends LayoutConfig {
  readonly docChar: HWPChar;
  readonly charShape: CharShape;
  readonly docControl?: DocControl;
}
export interface LayoutControlResult {
  control: Control;
}
export function layoutControl(config: LayoutControlConfig): LayoutControlResult {
  const { docChar, charShape } = config;
  switch (docChar.type) {
    case CharType.Inline:
    case CharType.Extened:
      // TODO
      return { control: layoutCharControl('?', charShape) };
    case CharType.Char: {
      const char = getStringFromDocChar(docChar);
      if (isWhitespaceCharCode(char.charCodeAt(0))) {
        return { control: layoutWhitespaceControl(char, charShape) };
      } else {
        return { control: layoutCharControl(char, charShape) };
      }
    }
  }
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
