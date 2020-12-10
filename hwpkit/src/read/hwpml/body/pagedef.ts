import { GutterType, PageDef, PageMargin } from '../../../model/document';
import { Element } from '../../naive-xml-parser';
import { el2obj } from '../misc';

export function readHwpmlPageDef(hwpmlPageDef: HwpmlPageDef): PageDef {
  return {
    gutterType: hwpmlGutterTypeToGutterTypeMap[hwpmlPageDef.GutterType as HwpmlGutterType],
    height: parseInt(hwpmlPageDef.Height, 10),
    landscape: !!parseInt(hwpmlPageDef.Landscape, 10),
    width: parseInt(hwpmlPageDef.Width, 10),
    margin: readHwpmlPageMargin(el2obj(hwpmlPageDef.PAGEMARGIN)),
  };
}

export interface HwpmlPageDef {
  GutterType: string;
  Height: string;
  Landscape: string;
  Width: string;
  PAGEMARGIN: Element;
}

export type HwpmlGutterType = keyof typeof GutterType;
export type HwpmlGutterTypeToGutterTypeMap = { [hwpmlGutterType in HwpmlGutterType]: GutterType };
export const hwpmlGutterTypeToGutterTypeMap: HwpmlGutterTypeToGutterTypeMap = {
  LeftOnly: GutterType.LeftOnly,
  LeftRight: GutterType.LeftRight,
  TopBottom: GutterType.TopBottom,
};

export function readHwpmlPageMargin(hwpmlPageMargin: HwpmlPageMargin): PageMargin {
  return {
    bottom: parseInt(hwpmlPageMargin.Bottom, 10),
    footer: parseInt(hwpmlPageMargin.Footer, 10),
    gutter: parseInt(hwpmlPageMargin.Gutter, 10),
    header: parseInt(hwpmlPageMargin.Header, 10),
    left: parseInt(hwpmlPageMargin.Left, 10),
    right: parseInt(hwpmlPageMargin.Right, 10),
    top: parseInt(hwpmlPageMargin.Top, 10),
  };
}

export interface HwpmlPageMargin {
  Bottom: string;
  Footer: string;
  Gutter: string;
  Header: string;
  Left: string;
  Right: string;
  Top: string;
}
