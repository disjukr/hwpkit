// AUTO-GENERATED from BDL IR. DO NOT EDIT.
// Source: model/document/head.bdl
import type { Index } from '../index';
import type { CharShape } from './char_shape';
import type { Fonts } from './font';
import type { LangType } from './lang';
import type { ParaShape } from './para_shape';

export * from './alignment';
export * from './char_shape';
export * from './font';
export * from './lang';
export * from './line';
export * from './para_shape';

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
  fontFaces: Record<LangType, Fonts>;
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
