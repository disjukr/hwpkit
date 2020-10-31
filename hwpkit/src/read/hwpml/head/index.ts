import { Head } from '../../../model/document';
import { Element } from '../../naive-xml-parser';
import { el2obj } from '../misc';
import { readHwpmlDocumentSetting, HwpmlDocumentSetting } from './doc-setting';

export function readHwpmlHead(hwpmlHead: HwpmlHead): Head {
  const hwpmlDocumentSetting = el2obj<HwpmlDocumentSetting>(hwpmlHead.DOCSETTING);
  console.log(hwpmlHead.MAPPINGTABLE);
  return {
    docSetting: readHwpmlDocumentSetting(hwpmlDocumentSetting),
    mappingTable: {} as any, // TODO
  };
}

export interface HwpmlHead {
  DOCSUMMARY: Element;
  DOCSETTING: Element;
  MAPPINGTABLE: Element;
  COMPATIBLEDOCUMENT: Element;
}
