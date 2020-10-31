import { DocumentSetting } from '../../../model/document';
import { Element } from '../../naive-xml-parser';

export function readHwpmlDocumentSetting(hwpmlDocumentSetting: HwpmlDocumentSetting): DocumentSetting {
  const hwpmlBeginNumber = hwpmlDocumentSetting.BEGINNUMBER.attrs as unknown as HwpmlBeginNumber;
  const hwpmlCaretPos = hwpmlDocumentSetting.CARETPOS.attrs as unknown as HwpmlCaretPos;
  return {
    beginNumber: {
      endnote: parseInt(hwpmlBeginNumber.Endnote, 10),
      equation: parseInt(hwpmlBeginNumber.Equation, 10),
      footnote: parseInt(hwpmlBeginNumber.Footnote, 10),
      page: parseInt(hwpmlBeginNumber.Page, 10),
      picture: parseInt(hwpmlBeginNumber.Picture, 10),
      table: parseInt(hwpmlBeginNumber.Table, 10),
    },
    caretPos: {
      list: parseInt(hwpmlCaretPos.List, 10),
      para: parseInt(hwpmlCaretPos.Para, 10),
      pos: parseInt(hwpmlCaretPos.Pos, 10),
    },
  };
}

export interface HwpmlDocumentSetting {
  BEGINNUMBER: Element;
  CARETPOS: Element;
}

export interface HwpmlBeginNumber {
  Endnote: string;
  Equation: string;
  Footnote: string;
  Page: string;
  Picture: string;
  Table: string;
}

export interface HwpmlCaretPos {
  List: string;
  Para: string;
  Pos: string;
}
