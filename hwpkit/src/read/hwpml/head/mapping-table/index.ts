import { MappingTable } from '../../../../model/document';
import { Element } from '../../../naive-xml-parser';
import { el2obj } from '../../misc';
import { HwpmlCharShape, readHwpmlCharShapeList } from './char-shapes';
import { HwpmlFontFace, readHwpmlFacenameList } from './font-faces';
import { HwpmlParaShape, readHwpmlParaShapeList } from './para-shape';

export function readHwpmlMappingTable(hwpmlMappingTable: HwpmlMappingTable): MappingTable {
  console.log(hwpmlMappingTable);
  const hwpmlFacenameList = hwpmlMappingTable.FACENAMELIST.children as unknown as HwpmlFontFace[];
  const hwpmlCharShapeList = hwpmlMappingTable.CHARSHAPELIST.children.map<HwpmlCharShape>(
    element => el2obj(element as Element)
  );
  const hwpmlParaShapeList = hwpmlMappingTable.PARASHAPELIST.children.map<HwpmlParaShape>(
    element => el2obj(element as Element)
  );
  return {
    fontFaces: readHwpmlFacenameList(hwpmlFacenameList),
    charShapes: readHwpmlCharShapeList(hwpmlCharShapeList),
    paraShapes: readHwpmlParaShapeList(hwpmlParaShapeList),
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
