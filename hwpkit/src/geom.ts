export type Pt = number; // 1 / 72 inch
export interface Size2d {
  width: Pt;
  height: Pt;
}
export interface Offset2d {
  x: Pt;
  y: Pt;
}
export interface Rect extends Size2d, Offset2d {}

/**
 * @example
 * const pt = 10;
 * const px = pt * pt2px;
*/
export const pt2px = 4 / 3;

export function subOffset2d(a: Offset2d, b: Offset2d): Offset2d {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}
