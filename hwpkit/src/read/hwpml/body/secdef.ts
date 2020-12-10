import { SecDef, TextDirection } from '../../../model/document';
import { Element } from '../../naive-xml-parser';
import { el2obj } from '../misc';
import { readHwpmlPageDef } from './pagedef';

export function readHwpmlSecDef(hwpmlSecDef: HwpmlSecDef): SecDef {
  return {
    textDirection: hwpmlTextDirectionToTextDirectionMap[hwpmlSecDef.TextDirection as HwpmlTextDirection],
    spaceColumns: parseInt(hwpmlSecDef.SpaceColumns, 10),
    tabStop: parseInt(hwpmlSecDef.TabStop, 10),
    pageDef: readHwpmlPageDef(el2obj(hwpmlSecDef.PAGEDEF)),
  };
}

export interface HwpmlSecDef {
  CharGrid: string;
  FirstBorder: string;
  FirstFill: string;
  LineGrid: string;
  OutlineShape: string;
  SpaceColumns: string;
  TabStop: string;
  TextDirection: string;
  TextVerticalWidthHead: string;
  STARTNUMBER: Element;
  HIDE: Element;
  PAGEDEF: Element;
  FOOTNOTESHAPE: Element;
  ENDNOTESHAPE: Element;
  PAGEBORDERFILL: Element;
}

export type HwpmlTextDirection = '0' | '1';
export type HwpmlTextDirectionToTextDirectionMap = { [hwpmlTextDirection in HwpmlTextDirection]: TextDirection };
export const hwpmlTextDirectionToTextDirectionMap: HwpmlTextDirectionToTextDirectionMap = {
  '0': TextDirection.Horizontal,
  '1': TextDirection.Vertical,
};
