import { Font, FontType, LangType, MappingTable } from '../../../../model/document';
import { Element } from '../../../naive-xml-parser';
import { el2obj } from '../../misc';

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
    result[hwpmlLangToLangType(hwpmlFontFace.attrs.Lang)] = fonts;
  }
  return result;
}

export interface HwpmlFontFace {
  attrs: {
    Count: string;
    Lang: keyof typeof LangType;
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

function hwpmlLangToLangType(lang: keyof typeof LangType): LangType {
  switch (lang) {
    case 'Hangul': return LangType.Hangul;
    case 'Latin': return LangType.Latin;
    case 'Hanja': return LangType.Hanja;
    case 'Japanese': return LangType.Japanese;
    case 'Other': return LangType.Other;
    case 'Symbol': return LangType.Symbol;
    case 'User': return LangType.User;
  }
}

function hwpmlFontTypeToFontType(hwpmlFontType: HwpmlFontType): FontType {
  switch (hwpmlFontType) {
    case 'rep': return FontType.Rep;
    case 'ttf': return FontType.Ttf;
    case 'hft': return FontType.Hft;
  }
}
