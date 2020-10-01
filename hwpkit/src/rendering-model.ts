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
export type FloatingObject = Control;
export interface ParagraphContainer extends Size2d {
  paragraphs: Paragraph[];
}
export interface Paragraph extends Size2d, Offset2d {
  lines: Line[];
}
export interface Line extends Size2d, Offset2d {
  segments: Segment[];
}
export interface Segment extends Size2d, Offset2d {
  words: Word[];
}
export type Word =
  | WhitespaceWord
  | TextWord
;
export const enum WordType {
  Whitespace,
  Text,
}
interface WordBase<TType extends WordType, TControl extends Control> extends Size2d, Offset2d {
  type: TType;
  controls: TControl[];
}
export interface WhitespaceWord extends WordBase<WordType.Whitespace, WhitespaceControl> {}
export interface TextWord extends WordBase<WordType.Text, CharControl> {}
export type Control =
  | WhitespaceControl
  | CharControl
;
export const enum ControlType {
  Whitespace,
  Char,
}
interface ControlBase<TType extends ControlType> extends Size2d, Offset2d {
  type: TType;
}
export interface WhitespaceControl extends ControlBase<ControlType.Whitespace> {
  char: string;
}
export interface CharControl extends ControlBase<ControlType.Char> {
  char: string;
}
