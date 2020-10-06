import type HWPDocument from 'hwp.js/build/models/document';

import { RenderingModel, Paper } from '../rendering-model';
import { layoutSection } from './section';

export interface LayoutConfig {
  readonly document: HWPDocument;
}
export default function layout(config: LayoutConfig): RenderingModel {
  const papers: Paper[] = [];
  const { document } = config;
  for (const docSection of document.sections) {
    papers.push(...layoutSection({ ...config, docSection }));
  }
  return {
    papers,
  };
}
