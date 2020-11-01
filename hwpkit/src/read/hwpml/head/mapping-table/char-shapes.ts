import { CharShape } from '../../../../model/document';
import { Element } from '../../../naive-xml-parser';
import { HwpmlLangTable, readHwpmlLangNumberTable } from './lang';

export function readHwpmlCharShapeList(hwpmlCharShapeList: HwpmlCharShape[]) {
  return hwpmlCharShapeList.map(readHwpmlCharShape);
}

export function readHwpmlCharShape(hwpmlCharShape: HwpmlCharShape): CharShape {
  return {
    height: parseInt(hwpmlCharShape.Height, 10),
    textColor: parseInt(hwpmlCharShape.TextColor, 10),
    shadeColor: parseInt(hwpmlCharShape.ShadeColor, 10),
    useFontSpace: hwpmlCharShape.UseFontSpace === 'true',
    useKerning: hwpmlCharShape.UseKerning === 'true',
    fontIds: readHwpmlLangNumberTable(hwpmlCharShape.FONTID.attrs as HwpmlLangTable<string>),
    ratios: readHwpmlLangNumberTable(hwpmlCharShape.RATIO.attrs as HwpmlLangTable<string>),
    charSpacings: readHwpmlLangNumberTable(hwpmlCharShape.CHARSPACING.attrs as HwpmlLangTable<string>),
    relSizes: readHwpmlLangNumberTable(hwpmlCharShape.RELSIZE.attrs as HwpmlLangTable<string>),
    charOffsets: readHwpmlLangNumberTable(hwpmlCharShape.CHAROFFSET.attrs as HwpmlLangTable<string>),
    italic: false,
    bold: false,
    underline: undefined,
    strikeout: undefined,
    outline: undefined,
    shadow: undefined,
    emboss: false,
    engrave: false,
    superscript: false,
    subscript: false,
  }
}

export interface HwpmlCharShape {
  BorderFillId: string;
  Height: string;
  Id: string;
  ShadeColor: string;
  SymMark: string;
  TextColor: string;
  UseFontSpace: string;
  UseKerning: string;
  FONTID: Element;
  RATIO: Element;
  CHARSPACING: Element;
  RELSIZE: Element;
  CHAROFFSET: Element;
}
