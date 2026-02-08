import { LayoutConfig } from '..';
import { hwpunit2px, px2hwpunit } from '../../model/geom';
import {
  CharShape,
  Control as DocControl,
  LangType,
} from '../../model/document';
import {
  CharControl,
  Control,
  ControlType,
  WhitespaceControl,
} from '../../model/rendering';
import { isWhitespaceCharCode } from '../misc';

export interface LayoutControlConfig extends LayoutConfig {
  readonly control: DocControl;
  readonly charShape: CharShape;
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
  const { control, charShape } = config;
  switch (control.type) {
    case 'CharControl': {
      const char = String.fromCharCode(control.code);
      if (isWhitespaceCharCode(control.code)) {
        return {
          type: LayoutControlResultType.Inline,
          control: layoutWhitespaceControl(char, charShape),
        };
      } else {
        return {
          type: LayoutControlResultType.Inline,
          control: layoutCharControl(char, charShape, config),
        };
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
    width: charShape.height / 2,
    height: charShape.height,
  };
}

function layoutCharControl(
  char: string,
  charShape: CharShape,
  config: LayoutControlConfig
): CharControl {
  const { document, measureText } = config;
  const font = document.head.mappingTable.fontFaces[LangType.Hangul][charShape.fontIds[0]];
  const metrics = measureText(char, charShape.height * hwpunit2px, font.name);
  return {
    type: ControlType.Char,
    char,
    charShape,
    x: 0,
    y: 0,
    width: metrics.width * px2hwpunit,
    height: charShape.height,
  };
}
