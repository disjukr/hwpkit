import { LangType } from '../../../../model/document';

export type HwpmlLang = keyof typeof LangType;
export type HwpmlLangTable<T> = { [lang in HwpmlLang]: T };

export type HwpmlLangToLangTypeMap = { [lang in HwpmlLang]: LangType };
export const hwpmlLangToLangTypeMap: HwpmlLangToLangTypeMap = {
  Hangul: LangType.Hangul,
  Latin: LangType.Latin,
  Hanja: LangType.Hanja,
  Japanese: LangType.Japanese,
  Other: LangType.Other,
  Symbol: LangType.Symbol,
  User: LangType.User,
};

export function readHwpmlLangNumberTable(hwpmlLangNumberTable: HwpmlLangTable<string>) {
  const result: { [langType in LangType]: number } = {
    [LangType.Hangul]: 0,
    [LangType.Latin]: 0,
    [LangType.Hanja]: 0,
    [LangType.Japanese]: 0,
    [LangType.Other]: 0,
    [LangType.Symbol]: 0,
    [LangType.User]: 0,
  };
  for (const key in hwpmlLangNumberTable) {
    const lang = key as HwpmlLang;
    const langType = hwpmlLangToLangTypeMap[lang];
    if (langType == null) continue;
    result[langType] = parseInt(hwpmlLangNumberTable[lang], 10);
  }
  return result;
}
