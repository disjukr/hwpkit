import type { RgbColor, Percent, Index, Hwpunit } from '..';
import type { Option } from '../../../misc/type';
import type { LangType } from './lang';
import type { LineType2, LineType3 } from './line';

export interface CharShape {
  height: Hwpunit;
  textColor: RgbColor;
  shadeColor: RgbColor;
  useFontSpace: boolean;
  useKerning: boolean;
  fontIds: { [langType in LangType]: Index };
  ratios: { [langType in LangType]: Percent };
  charSpacings: { [langType in LangType]: Percent }; // -50% ~ 50%
  relSizes: { [langType in LangType]: Percent }; // 10% ~ 250%
  charOffsets: { [langType in LangType]: Percent }; // -100% ~ 100%
  italic: boolean;
  bold: boolean;
  underline: Option<{
    type: UnderlineType;
    shape: LineType2;
    color: RgbColor;
  }>;
  strikeout: Option<{
    type: StrikeoutType;
    shape: LineType2;
    color: RgbColor;
  }>;
  outline: Option<{
    type: LineType3;
  }>;
  shadow: Option<{
    type: ShadowType;
    color: RgbColor;
    offsetX: Percent; // -100% - 100%
    offsetY: Percent; // -100% - 100%
  }>;
  emboss: boolean;
  engrave: boolean;
  superscript: boolean;
  subscript: boolean;
}

export const enum UnderlineType {
  Bottom,
  Center,
  Top,
}

export const enum StrikeoutType {
  None,
  Continuous,
}

export const enum ShadowType {
  Drop,
  Cont,
}
