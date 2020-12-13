import { Body, Section } from '../../../model/document';
import { Element } from '../../naive-xml-parser';
import { el2obj } from '../misc';
import { HwpmlParagraph, readHwpmlParagraph } from './paragraph';
import { HwpmlSecDef, readHwpmlSecDef } from './secdef';

export function readHwpmlBody(hwpmlBody: HwpmlBody): Body {
  return {
    sections: hwpmlBody.children.map(readHwpmlSection),
  };
}

export interface HwpmlBody {
  children: HwpmlSection[];
}

export function readHwpmlSection(hwpmlSection: HwpmlSection): Section {
  const firstParagraph = hwpmlSection.children[0] as Element;
  const firstText = firstParagraph.children[0] as Element;
  const secDef = firstText.children.find(
    el => (el as Element).tagName === 'SECDEF'
  ) as Element;
  return {
    def: readHwpmlSecDef(el2obj(secDef) as HwpmlSecDef),
    paragraphs: (hwpmlSection.children as unknown as HwpmlParagraph[]).map(readHwpmlParagraph),
  };
}

export type HwpmlSection = Element;
