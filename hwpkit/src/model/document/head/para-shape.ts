import type { Percent, Index } from '..';
import type { AlignmentType1, VerAlignType } from './alignment';

export interface ParaShape {
  align: AlignmentType1;
  verAlign: VerAlignType;
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
