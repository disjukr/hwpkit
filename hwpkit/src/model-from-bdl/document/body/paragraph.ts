// AUTO-GENERATED from BDL IR. DO NOT EDIT.
// Source: model/document/body/paragraph.bdl
import type { Index } from '../../document';
import type { ColDef } from './column';
import type { Control } from './control';

export interface Paragraph {
  paraShapeIndex: Index;
  styleIndex: Index;
  instId: number;
  pageBreak: boolean;
  columnBreak: boolean;
  texts: Text[];
  colDef?: ColDef;
}

export interface Text {
  charShapeIndex: Index;
  controls: Control[];
}
