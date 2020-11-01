import { MappingTable } from '../../../../model/document';
import { Element } from '../../../naive-xml-parser';
import { HwpmlFontFace, readHwpmlFacenameList } from './font-faces';

export function readHwpmlMappingTable(hwpmlMappingTable: HwpmlMappingTable): MappingTable {
  console.log(hwpmlMappingTable);
  const hwpmlFacenameList = hwpmlMappingTable.FACENAMELIST.children as unknown as HwpmlFontFace[];
  return {
    fontFaces: readHwpmlFacenameList(hwpmlFacenameList),
    charShapes: [], // TODO
    paraShapes: [], // TODO
    styles: [], // TODO
  };
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
