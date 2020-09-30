import { FloatingObject } from '../rendering-model';

export interface SizeConstraint {
  maxWidth: number;
  maxHeight: number;
}

export interface FloatingObjectEnvironment {
  pageWidth: number;
  pageHeight: number;
  pagePaddingLeft: number;
  pagePaddingTop: number;
  pagePaddingRight: number;
  pagePaddingBottom: number;
  columnX: number;
  columnY: number;
  columnWidth: number;
  columnHeight: number;
  floatingObjects: FloatingObject[];
}
