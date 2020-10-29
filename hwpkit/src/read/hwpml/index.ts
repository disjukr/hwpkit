import { DocumentModel, DocumentSetting, Head } from '../../model/document';
import { parse, NodeType, Element } from '../naive-xml-parser';

export function readHwpml(text: string): DocumentModel {
  const hwpmlDocument = el2obj<HwpmlDocument>(parse(text));
  const hwpmlHead = el2obj<HwpmlHead>(hwpmlDocument.HEAD);
  const result: DocumentModel = {
    head: readHwpmlHead(hwpmlHead),
    body: {} as any, // TODO
  };
  console.log({ result });
  return result;
}

function readHwpmlHead(hwpmlHead: HwpmlHead): Head {
  const hwpmlDocumentSetting = el2obj<HwpmlDocumentSetting>(hwpmlHead.DOCSETTING);
  return {
    docSetting: readHwpmlDocumentSetting(hwpmlDocumentSetting),
    mappingTable: {} as any, // TODO
  };
}

function readHwpmlDocumentSetting(hwpmlDocumentSetting: HwpmlDocumentSetting): DocumentSetting {
  const hwpmlBeginNumber = hwpmlDocumentSetting.BEGINNUMBER.attrs as unknown as HwpmlBeginNumber;
  console.log({ hwpmlBeginNumber });
  return {
    beginNumber: {
      endnote: parseInt(hwpmlBeginNumber.Endnote, 10),
      equation: parseInt(hwpmlBeginNumber.Equation, 10),
      footnote: parseInt(hwpmlBeginNumber.Footnote, 10),
      page: parseInt(hwpmlBeginNumber.Page, 10),
      picture: parseInt(hwpmlBeginNumber.Picture, 10),
      table: parseInt(hwpmlBeginNumber.Table, 10),
    },
    caretPos: {} as any, // TODO
  };
}

interface HwpmlDocument {
  HEAD: Element;
  BODY: Element;
  TAIL: Element;
}

interface HwpmlHead {
  DOCSUMMARY: Element;
  DOCSETTING: Element;
  MAPPINGTABLE: Element;
  COMPATIBLEDOCUMENT: Element;
}

interface HwpmlDocumentSetting {
  BEGINNUMBER: Element;
  CARETPOS: Element;
}

interface HwpmlBeginNumber {
  Endnote: string;
  Equation: string;
  Footnote: string;
  Page: string;
  Picture: string;
  Table: string;
}

function el2obj<T extends {} = any>(element: Element): T {
  const result: any = {
    ...element.attrs,
  };
  for (const child of element.children) {
    if (child.type === NodeType.Text) continue;
    result[child.tagName] = child;
  }
  return result;
}
