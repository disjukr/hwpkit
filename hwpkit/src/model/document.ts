import { Option } from '../misc/type';

export type Index = number;
export type Hwpunit = number; // 10 pt = 1000 hwpunit
export type RgbColor = number; // 0x00bbggrr
export type Percent = number; // 0 ~ 100

export interface DocumentModel {
  head: Head;
}

export interface Head {
  docSetting: DocumentSetting;
  mappingTable: MappingTable;
}

export interface DocumentSetting {
  beginNumber: BeginNumber;
  caretPos: CaretPos;
}

export interface BeginNumber {
  endnote: number;
  equation: number;
  footnote: number;
  page: number;
  picture: number;
  table: number;
}

export interface CaretPos {
  list: number;
  para: number;
  pos: number;
}

export interface MappingTable {
  fontFaces: FontFace[];
  charShapes: CharShape[];
  paraShapes: ParaShape[];
}

export interface FontFace {
  lang: LangType;
  fonts: Font[];
}

export const enum LangType {
  Hangul,
  Latin,
  Hanja,
  Japanese,
  Other,
  Symbol,
  User,
}

export interface Font {
  name: string;
  type: FontType;
}

export const enum FontType {
  Rep,
  Ttf,
  Htf,
}

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

export const enum LineType1 {
  Solid,
  Dash,
  Dot,
  DashDot,
  Circle,
  DoubleSlim,
  SlimThick,
  ThickSlim,
  SlimThickSlim,
  None,
}

export const enum LineType2 {
  Solid,
  Dash,
  Dot,
  DashDot,
  Circle,
  DoubleSlim,
  SlimThick,
  ThickSlim,
  SlimThickSlim,
}

export const enum LineType3 {
  Solid,
  Dot,
  Thick,
  Dash,
  DashDot,
}

export interface ParaShape {
  align: AlignmentType1;
  vertAlign: VertAlignType;
  headingType: HeadingType;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  tabDef: Index;
  breakLatinWordType: BreakLatinWordType;
  breakNonLatinWord: boolean;
  condense: Percent; // 0% ~ 75%
  widowOrphan: boolean;
  keepWithNext: boolean;
  keepLines: boolean;
  pageBreakBefore: boolean;
  fontLineHeight: boolean;
  snapToGrid: boolean;
  lineWrapType: LineWrapType;
  autoSpaceEAsianEng: boolean;
  autoSpaceEAsianNum: boolean;
}

export const enum AlignmentType1 {
  Justify,
  Left,
  Right,
  Center,
  Distribute,
  DistributeSpace,
}

export const enum AlignmentType2 {
  Left,
  Center,
  Right,
}

export const enum VertAlignType {
  Baseline,
  Top,
  Center,
  Bottom,
}

export const enum HeadingType {
  None,
  Outline,
  Number,
  Bullet,
}

export const enum BreakLatinWordType {
  KeepWord,
  Hyphenation,
  BreakWord,
}

export const enum LineWrapType {
  Break,
  Squeeze,
  Keep,
}
