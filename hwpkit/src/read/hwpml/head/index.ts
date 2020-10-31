import { Head } from '../../../model/document';
import { Element } from '../../naive-xml-parser';
import { el2obj } from '../misc';
import { readHwpmlDocumentSetting, HwpmlDocumentSetting } from './doc-setting';
import { HwpmlMappingTable, readHwpmlMappingTable } from './mapping-table';

export function readHwpmlHead(hwpmlHead: HwpmlHead): Head {
  const hwpmlDocumentSetting = el2obj<HwpmlDocumentSetting>(hwpmlHead.DOCSETTING);
  const hwpmlMappingTable = el2obj<HwpmlMappingTable>(hwpmlHead.MAPPINGTABLE);
  return {
    docSetting: readHwpmlDocumentSetting(hwpmlDocumentSetting),
    mappingTable: readHwpmlMappingTable(hwpmlMappingTable),
  };
}

export interface HwpmlHead {
  DOCSUMMARY: Element;
  DOCSETTING: Element;
  MAPPINGTABLE: Element;
  COMPATIBLEDOCUMENT: Element;
}
