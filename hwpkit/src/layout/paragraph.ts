import DocSection from 'hwp.js/build/models/section';
import DocParagraph from 'hwp.js/build/models/paragraph';

import { LayoutConfig } from '.';
import { Offset2d, Paragraph } from '../rendering-model';
import { FloatingObjectEnvironment, SizeConstraint } from './misc';

export interface LayoutParagraphConfig extends LayoutConfig {
  readonly docSection: DocSection;
  readonly docParagraph: DocParagraph;
  readonly startControlOffset: number;
  readonly startOffset: Offset2d;
  readonly containerSizeConstraint: SizeConstraint;
  readonly floatingObjectEnvironment: FloatingObjectEnvironment;
}
export interface LayoutParagraphResult {
  readonly paragraph: Paragraph;
  readonly endControlOffset: number;
}
export function layoutParagraph(config: LayoutParagraphConfig): LayoutParagraphResult {
  const { docParagraph } = config;
  return {} as LayoutParagraphResult;
}
