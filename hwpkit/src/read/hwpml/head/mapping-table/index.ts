import { MappingTable } from '../../../../model/document';
import { Element } from '../../../naive-xml-parser';

export function readHwpmlMappingTable(hwpmlMappingTable: HwpmlMappingTable): MappingTable {
  console.log(hwpmlMappingTable);
  return {} as any; // TODO
}

export interface HwpmlMappingTable {
  FACENAMELIST: Element;
  BORDERFILLLIST: Element;
  CHARSHAPELIST: Element;
  TABDEFLIST: Element;
  NUMBERINGLIST: Element;
  PARASHAPELIST: Element;
  STYLELIST: Element;
}
