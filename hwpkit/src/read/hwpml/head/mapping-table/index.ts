import { MappingTable } from '../../../../model/document';
import { Element } from '../../../naive-xml-parser';
import { el2obj } from '../../misc';
import { HwpmlCharShape, readHwpmlCharShapeList } from './char-shapes';
import { HwpmlFontFace, readHwpmlFacenameList } from './font-faces';

export function readHwpmlMappingTable(hwpmlMappingTable: HwpmlMappingTable): MappingTable {
  console.log(hwpmlMappingTable);
  const hwpmlFacenameList = hwpmlMappingTable.FACENAMELIST.children as unknown as HwpmlFontFace[];
  const hwpmlCharShapeList = hwpmlMappingTable.CHARSHAPELIST.children.map<HwpmlCharShape>(
    element => el2obj(element as Element)
  );
  return {
    fontFaces: readHwpmlFacenameList(hwpmlFacenameList),
    charShapes: readHwpmlCharShapeList(hwpmlCharShapeList),
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
