export type Pt = number; // 1 / 72 inch

export interface RenderingModel {
  pages: Page[];
}

export interface Page {
  width: Pt;
  height: Pt;
}
