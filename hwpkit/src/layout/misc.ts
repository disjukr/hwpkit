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

const c_whitespace = ' '.charCodeAt(0);
export function isWhitespaceCharCode(charCode: number): boolean {
  return charCode === c_whitespace;
}

const c_ㄱ = 'ㄱ'.charCodeAt(0);
const c_ㅎ = 'ㅎ'.charCodeAt(0);
const c_가 = '가'.charCodeAt(0);
const c_힣 = '힣'.charCodeAt(0);
export function isHangulCharCode(charCode: number): boolean {
  if (charCode >= c_ㄱ && charCode <= c_ㅎ) return true;
  if (charCode >= c_가 && charCode <= c_힣) return true;
  return false;
}
