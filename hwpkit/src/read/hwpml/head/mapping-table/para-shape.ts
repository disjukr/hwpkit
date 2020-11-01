import { AlignmentType1, BreakLatinWordType, HeadingType, LineWrapType, ParaShape, VerAlignType } from '../../../../model/document';
import { Element } from '../../../naive-xml-parser';

export function readHwpmlParaShapeList(hwpmlParaShapeList: HwpmlParaShape[]) {
  return hwpmlParaShapeList.map(readHwpmlParaShape);
}

export function readHwpmlParaShape(hwpmlParaShape: HwpmlParaShape): ParaShape {
  return {
    align: hwpmlAlignToAlignmentType1Map[hwpmlParaShape.Align as HwpmlAlign],
    verAlign: hwpmlVerAlignToVerAlignTypeMap[hwpmlParaShape.VerAlign as HwpmlVerAlign],
    headingType: hwpmlHeadingTypeToHeadingTypeMap[hwpmlParaShape.HeadingType as HwpmlHeadingType],
    level: parseInt(hwpmlParaShape.Level, 10) as ParaShape['level'],
    tabDef: parseInt(hwpmlParaShape.TabDef, 10),
    breakLatinWordType: hwpmlBreakLatinWordToBreakLatinWordTypeMap[hwpmlParaShape.BreakLatinWord as HwpmlBreakLatinWord],
    breakNonLatinWord: hwpmlParaShape.BreakNonLatinWord === 'true',
    condense: parseInt(hwpmlParaShape.Condense, 10),
    widowOrphan: hwpmlParaShape.WidowOrphan === 'true',
    keepWithNext: hwpmlParaShape.KeepWithNext === 'true',
    keepLines: hwpmlParaShape.KeepLines === 'true',
    pageBreakBefore: hwpmlParaShape.PageBreakBefore === 'true',
    fontLineHeight: hwpmlParaShape.FontLineHeight === 'true',
    snapToGrid: hwpmlParaShape.SnapToGrid === 'true',
    lineWrapType: hwpmlLineWrapToLineWrapTypeMap[hwpmlParaShape.LineWrap as HwpmlLineWrap],
    autoSpaceEAsianEng: hwpmlParaShape.AutoSpaceEAsianEng === 'true',
    autoSpaceEAsianNum: hwpmlParaShape.AutoSpaceEAsianNum === 'true',
  };
}

export type HwpmlAlign = keyof typeof AlignmentType1;
export type HwpmlAlignToAlignmentType1Map = { [hwpmlAlign in HwpmlAlign]: AlignmentType1 };
export const hwpmlAlignToAlignmentType1Map: HwpmlAlignToAlignmentType1Map = {
  Justify: AlignmentType1.Justify,
  Left: AlignmentType1.Left,
  Right: AlignmentType1.Right,
  Center: AlignmentType1.Center,
  Distribute: AlignmentType1.Distribute,
  DistributeSpace: AlignmentType1.DistributeSpace,
};

export type HwpmlVerAlign = keyof typeof VerAlignType;
export type HwpmlVerAlignToVerAlignTypeMap = { [hwpmlVerAlign in HwpmlVerAlign]: VerAlignType };
export const hwpmlVerAlignToVerAlignTypeMap: HwpmlVerAlignToVerAlignTypeMap = {
  Baseline: VerAlignType.Baseline,
  Top: VerAlignType.Top,
  Center: VerAlignType.Center,
  Bottom: VerAlignType.Bottom,
};

export type HwpmlHeadingType = keyof typeof HeadingType;
export type HwpmlHeadingTypeToHeadingTypeMap = { [hwpmlHeadingType in HwpmlHeadingType]: HeadingType };
export const hwpmlHeadingTypeToHeadingTypeMap: HwpmlHeadingTypeToHeadingTypeMap = {
  None: HeadingType.None,
  Outline: HeadingType.Outline,
  Number: HeadingType.Number,
  Bullet: HeadingType.Bullet,
};

export type HwpmlBreakLatinWord = keyof typeof BreakLatinWordType;
export type HwpmlBreakLatinWordToBreakLatinWordTypeMap = { [hwpmlBreakLatinWord in HwpmlBreakLatinWord]: BreakLatinWordType };
export const hwpmlBreakLatinWordToBreakLatinWordTypeMap: HwpmlBreakLatinWordToBreakLatinWordTypeMap = {
  KeepWord: BreakLatinWordType.KeepWord,
  Hyphenation: BreakLatinWordType.Hyphenation,
  BreakWord: BreakLatinWordType.BreakWord,
};

export type HwpmlLineWrap = keyof typeof LineWrapType;
export type HwpmlLineWrapToLineWrapTypeMap = { [hwpmlLineWrap in HwpmlLineWrap]: LineWrapType };
export const hwpmlLineWrapToLineWrapTypeMap: HwpmlLineWrapToLineWrapTypeMap = {
  Break: LineWrapType.Break,
  Squeeze: LineWrapType.Squeeze,
  Keep: LineWrapType.Keep,
};

export interface HwpmlParaShape {
  Align: string;
  AutoSpaceEAsianEng: string;
  AutoSpaceEAsianNum: string;
  BreakLatinWord: string;
  BreakNonLatinWord: string;
  Condense: string;
  FontLineHeight: string;
  HeadingType: string;
  Id: string;
  KeepLines: string;
  KeepWithNext: string;
  Level: string;
  LineWrap: string;
  PageBreakBefore: string;
  SnapToGrid: string;
  TabDef: string;
  VerAlign: string;
  WidowOrphan: string;
  PARAMARGIN: Element;
  PARABORDER: Element;
}

export interface HwpmlParaMargin {
  Indent: string;
  Left: string;
  LineSpacing: string;
  LineSpacingType: string;
  Next: string;
  Prev: string;
  Right: string;
}

export interface HwpmlParaBorder {
  BorderFill: string;
  Connect: string;
  IgnoreMargin: string;
}
