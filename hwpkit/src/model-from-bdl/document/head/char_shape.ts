// AUTO-GENERATED from BDL IR. DO NOT EDIT.
// Source: model/document/head/char_shape.bdl
import type { Hwpunit, Index, Percent, RgbColor } from '../../document';
import type { LangType } from './lang';
import type { LineType2, LineType3 } from './line';

export interface CharShape {
  height: Hwpunit;
  textColor: RgbColor;
  shadeColor: RgbColor;
  useFontSpace: boolean;
  useKerning: boolean;
  fontIds: Record<LangType, Index>;
  ratios: Record<LangType, Percent>;
  charSpacings: Record<LangType, Percent>;
  relSizes: Record<LangType, Percent>;
  charOffsets: Record<LangType, Percent>;
  italic: boolean;
  bold: boolean;
  underline?: Underline;
  strikeout?: Strikeout;
  outline?: Outline;
  shadow?: Shadow;
  emboss: boolean;
  engrave: boolean;
  superscript: boolean;
  subscript: boolean;
}

export interface Underline {
  type: UnderlineType;
  shape: LineType2;
  color: RgbColor;
}

export const enum UnderlineType {
  Bottom,
  Center,
  Top,
}

export interface Strikeout {
  type: StrikeoutType;
  shape: LineType2;
  color: RgbColor;
}

export const enum StrikeoutType {
  None,
  Continuous,
}

export interface Outline {
  type: LineType3;
}

export interface Shadow {
  type: ShadowType;
  color: RgbColor;
  offsetX: Percent;
  offsetY: Percent;
}

export const enum ShadowType {
  Drop,
  Cont,
}
