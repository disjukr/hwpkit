// AUTO-GENERATED from BDL IR. DO NOT EDIT.
// Source: model/document/head/para_shape.bdl
import type { Index, Percent } from '../../document';
import type { AlignmentType1, VerAlignType } from './alignment';

export interface ParaShape {
  align: AlignmentType1;
  verAlign: VerAlignType;
  headingType: HeadingType;
  level: number;
  tabDef: Index;
  breakLatinWordType: BreakLatinWordType;
  breakNonLatinWord: boolean;
  condense: Percent;
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
