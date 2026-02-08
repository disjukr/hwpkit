// AUTO-GENERATED from BDL IR. DO NOT EDIT.
import type { Index } from '../document';
import type { CharShape } from './head/char_shape';
import type { Fonts } from './head/font';
import type { LangType } from './head/lang';
import type { ParaShape } from './head/para_shape';

export interface Head {
  docSetting: DocumentSetting;
  mappingTable: MappingTable;
}

export interface DocumentSetting {
  beginNumber: BeginNumber;
  caretPos: CaretPos;
}

export interface BeginNumber {
  endnote: number;
  equation: number;
  footnote: number;
  page: number;
  picture: number;
  table: number;
}

export interface CaretPos {
  list: number;
  para: number;
  pos: number;
}

export interface MappingTable {
  fontFaces: { [key in LangType]: Fonts };
  charShapes: CharShape[];
  paraShapes: ParaShape[];
  styles: Style[];
}

export interface Style {
  type: StyleType;
  name: string;
  engName: string;
  paraShapeIndex: Index;
  charShapeIndex: Index;
  nextStyleIndex: Index;
}

export const enum StyleType {
  Para,
  Char,
}
