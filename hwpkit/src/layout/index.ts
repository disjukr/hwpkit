import { CanvasKit } from 'canvaskit-wasm';
import HWPDocument from 'hwp.js/build/models/document';

import { RenderingModel, Page } from '../rendering-model';
import { layoutSection } from './section';

export interface LayoutConfig {
  CanvasKit: CanvasKit;
  document: HWPDocument;
}
export default function layout(config: LayoutConfig): RenderingModel {
  const pages: Page[] = [];
  const { document } = config;
  for (const docSection of document.sections) {
    pages.push(...layoutSection({ ...config, docSection }));
  }
  return {
    pages,
  };
}
