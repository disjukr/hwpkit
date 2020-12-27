import { CharControl, Control, ControlType, Paragraph, Text } from '../../../model/document';
import { Element, Text as TextNode } from '../../naive-xml-parser';
import { el2obj } from '../misc';
import { HwpmlColDef, readHwpmlColDef } from './coldef';

export function readHwpmlParagraph(hwpmlParagraph: HwpmlParagraph): Paragraph {
  const { attrs, children } = hwpmlParagraph;
  const hwpmlColDef = findHwpmlColDef(hwpmlParagraph);
  return {
    paraShapeIndex: parseInt(attrs.ParaShape, 10),
    styleIndex: parseInt(attrs.Style, 10),
    instId: attrs.InstId ? parseInt(attrs.InstId, 10) : 0,
    pageBreak: attrs.PageBreak === 'true',
    columnBreak: attrs.ColumnBreak === 'true',
    texts: children.map(readHwpmlText),
    colDef: hwpmlColDef && readHwpmlColDef(hwpmlColDef),
  };
}

function findHwpmlColDef(hwpmlParagraph: HwpmlParagraph): HwpmlColDef | undefined {
  const { children } = hwpmlParagraph;
  const hwpmlColDefElement = children[0]?.children.find(
    el => (el as Element).tagName === 'COLDEF'
  ) as Element;
  return hwpmlColDefElement && el2obj(hwpmlColDefElement) as HwpmlColDef;
}

export interface HwpmlParagraph {
  attrs: {
    ColumnBreak: string;
    InstId: string;
    PageBreak: string;
    ParaShape: string;
    Style: string;
  };
  children: HwpmlText[];
}

export function readHwpmlText(hwpmlText: HwpmlText): Text {
  return {
    charShapeIndex: parseInt(hwpmlText.attrs.CharShape, 10),
    controls: hwpmlText.children.map(readHwpmlControl).flat(1),
  };
}

export interface HwpmlText {
  attrs: {
    CharShape: string;
  };
  children: Element[];
}

export function readHwpmlControl(hwpmlControl: HwpmlControl): Control[] {
  switch (hwpmlControl.tagName) {
    case 'CHAR': return readHwpmlChar(hwpmlControl);
    default: return [];
  }
}

export type HwpmlControl = Element;

export function readHwpmlChar(hwpmlChar: HwpmlChar): CharControl[] {
  return (hwpmlChar.children as TextNode[]).map(
    ({ text }) => text.split('').map(char => ({
      type: ControlType.Char,
      code: char.charCodeAt(0),
    }))
  ).flat(1);
}

export type HwpmlChar = Element;
