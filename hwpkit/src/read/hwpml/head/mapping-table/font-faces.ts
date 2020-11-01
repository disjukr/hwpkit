import { Font, FontType, LangType, MappingTable } from '../../../../model/document';
import { Element } from '../../../naive-xml-parser';
import { el2obj } from '../../misc';
import { hwpmlLangToLangTypeMap, HwpmlLang } from './lang';

export function readHwpmlFacenameList(hwpmlFacenameList: HwpmlFontFace[]) {
  const result: MappingTable['fontFaces'] = {
    [LangType.Hangul]: [],
    [LangType.Latin]: [],
    [LangType.Hanja]: [],
    [LangType.Japanese]: [],
    [LangType.Other]: [],
    [LangType.Symbol]: [],
    [LangType.User]: [],
  };
  for (const hwpmlFontFace of hwpmlFacenameList) {
    const hwpmlFonts = hwpmlFontFace.children.map<HwpmlFont>(el2obj);
    const fonts = hwpmlFonts.map(readHwpmlFont);
    result[hwpmlLangToLangTypeMap[hwpmlFontFace.attrs.Lang]] = fonts;
  }
  return result;
}

export interface HwpmlFontFace {
  attrs: {
    Count: string;
    Lang: HwpmlLang;
  },
  children: Element[];
}

export function readHwpmlFont(hwpmlFont: HwpmlFont): Font {
  return {
    name: hwpmlFont.Name,
    type: hwpmlFontTypeToFontType(hwpmlFont.Type),
  };
}

export interface HwpmlFont {
  Id: string;
  Name: string;
  Type: HwpmlFontType;
  TYPEINFO: Element;
}

export type HwpmlFontType = 'rep' | 'ttf' | 'hft';

function hwpmlFontTypeToFontType(hwpmlFontType: HwpmlFontType): FontType {
  switch (hwpmlFontType) {
    case 'rep': return FontType.Rep;
    case 'ttf': return FontType.Ttf;
    case 'hft': return FontType.Hft;
  }
}
