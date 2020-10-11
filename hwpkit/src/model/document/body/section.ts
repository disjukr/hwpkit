import type { Hwpunit } from '..';
import type { Paragraph } from './paragraph';

export interface Section {
  def: SecDef;
  paragraphs: Paragraph;
}

export interface SecDef {
  textDirection: TextDirection;
  spaceColumns: Hwpunit;
  tabStop: Hwpunit;
}

export const enum TextDirection {
  Horizontal,
  Vertical,
}
