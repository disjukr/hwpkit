import { Hwpunit } from './document';

export interface Size2d {
  width: Hwpunit;
  height: Hwpunit;
}
export interface Offset2d {
  x: Hwpunit;
  y: Hwpunit;
}
export interface Rect extends Size2d, Offset2d {}

/**
 * @example
 * const pt = 10;
 * const px = pt * pt2px;
*/
export const pt2px = 4 / 3;
export const px2pt = 3 / 4;
export const hwpunit2pt = 1 / 1000;
export const pt2hwpunit = 1000 / 1;
export const hwpunit2px = 4 / 3000;
export const px2hwpunit = 3000 / 4;

export function subOffset2d(a: Offset2d, b: Offset2d): Offset2d {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}
