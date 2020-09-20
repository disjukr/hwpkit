import { CanvasKit } from 'canvaskit-wasm';
import HWPDocument from 'hwp.js/build/models/document';

import { RenderingModel, Page } from '../rendering-model';

export interface LayoutConfig {
  CanvasKit: CanvasKit;
  document: HWPDocument;
}
export default function layout({ document }: LayoutConfig): RenderingModel {
  const pages: Page[] = [];
  for (const section of document.sections) {
    pages.push({
      width: section.width / 100,
      height: section.height / 100,
    });
  }
  return {
    pages,
  };
}
