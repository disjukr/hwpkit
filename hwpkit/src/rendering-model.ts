export type Pt = number; // 1 / 72 inch
export interface Size2d {
  width: Pt;
  height: Pt;
}
export interface Offset2d {
  x: Pt;
  y: Pt;
}

export interface RenderingModel {
  pages: Page[];
}

export interface Page extends FloatingObjectContainer {
  columns: Column[];
}
export interface Column extends ParagraphContainer, Offset2d {}
export interface FloatingObjectContainer extends Size2d {
  floatingObjects: FloatingObject[];
}
export type FloatingObject = unknown;
export interface ParagraphContainer extends Size2d {
  paragraphs: Paragraph[];
}
export interface Paragraph extends Size2d, Offset2d {
  lines: Line[];
}
export interface Line extends Size2d, Offset2d {}
