import { Style, StyleType } from '../../../../model/document';

export function readHwpmlStyleList(hwpmlStyleList: HwpmlStyle[]) {
  return hwpmlStyleList.map(readHwpmlStyle);
}

export function readHwpmlStyle(hwpmlStyle: HwpmlStyle): Style {
  return {
    type: hwpmlStyleTypeToStyleTypeMap[hwpmlStyle.Type as HwpmlStyleType],
    name: hwpmlStyle.Name,
    engName: hwpmlStyle.EngName,
    paraShapeIndex: parseInt(hwpmlStyle.ParaShape, 10),
    charShapeIndex: parseInt(hwpmlStyle.CharShape, 10),
    nextStyleIndex: parseInt(hwpmlStyle.NextStyle, 10),
  };
}

export interface HwpmlStyle {
  CharShape: string;
  EngName: string;
  Id: string;
  LangId: string;
  LockForm: string;
  Name: string;
  NextStyle: string;
  ParaShape: string;
  Type: string;
}

export type HwpmlStyleType = keyof typeof StyleType;
export type HwpmlStyleTypeToStyleTypeMap = { [hwpmlStyleType in HwpmlStyleType]: StyleType };
export const hwpmlStyleTypeToStyleTypeMap: HwpmlStyleTypeToStyleTypeMap = {
  Para: StyleType.Para,
  Char: StyleType.Char,
};
