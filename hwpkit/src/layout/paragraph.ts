import DocSection from 'hwp.js/build/models/section';
import DocParagraph from 'hwp.js/build/models/paragraph';

import { LayoutConfig } from '.';
import { ParagraphContainer, FloatingObjectContainer, Line, Offset2d } from '../rendering-model';
import { FloatingObjectEnvironment, SizeConstraint } from './misc';

export interface LayoutParagraphConfig extends LayoutConfig {
  docSection: DocSection;
  docParagraph: DocParagraph;
  startControlOffset: number;
  startOffset: Offset2d;
  containerSizeConstraint: SizeConstraint;
  floatingObjectEnvironment: FloatingObjectEnvironment;
  floatingObjectContainer: FloatingObjectContainer;
  paragraphContainer: ParagraphContainer;
}
export function layoutParagraph(config: LayoutParagraphConfig): void {
}
