import type { Index } from '..';
import type { Font } from './font';
import type { LangType } from './lang';
import type { CharShape } from './char-shape';
import type { ParaShape } from './para-shape';

export * from './alignment';
export * from './char-shape';
export * from './font';
export * from './lang';
export * from './line';
export * from './para-shape';

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
  fontFaces: { [langType in LangType]: Font[] };
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
