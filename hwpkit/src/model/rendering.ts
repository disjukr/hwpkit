import { Size2d, Offset2d, Rect } from '../geom';

export interface RenderingModel {
  papers: Paper[];
}

export interface Paper extends FloatingObjectContainer {
  page: Page;
}
export interface Page extends Rect {
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
export interface Paragraph extends Rect {
  lines: Line[];
}
export interface Line extends Rect {
  segments: Segment[];
}
export interface Segment extends Rect {
  words: Word[];
  /**
   * 레이아웃 무한루프를 방지하기 위해 적어도 하나의 컨트롤이 들어와야 하는지 여부.
  */
  atLeastOne: boolean;
  /**
   * 이 세그먼트에 컨트롤이 꽉 차서 더이상 새로운 컨트롤이 들어올 수 없는지 여부.
   */
  full: boolean;
}
export type Word =
  | WhitespaceWord
  | TextWord
;
export const enum WordType {
  Whitespace,
  Text,
}
interface WordBase<TType extends WordType, TControl extends Control> extends Rect {
  type: TType;
  controls: InlineControl<TControl>[];
}
export interface WhitespaceWord extends WordBase<WordType.Whitespace, WhitespaceControl> {}
export interface TextWord extends WordBase<WordType.Text, CharControl> {}
export type InlineControl<TControl extends Control = Control> = TControl & {
  /**
   * 문단내 누적 인라인 가로폭
  */
  accWidth: number;
};
export type Control =
  | WhitespaceControl
  | CharControl
;
export const enum ControlType {
  Whitespace,
  Char,
}
interface ControlBase<TType extends ControlType> extends Rect {
  type: TType;
}
export interface WhitespaceControl extends ControlBase<ControlType.Whitespace> {
  char: string;
}
export interface CharControl extends ControlBase<ControlType.Char> {
  font: string;
  char: string;
}
