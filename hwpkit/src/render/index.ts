import { CanvasKit, SkSurface } from 'canvaskit-wasm';

import { Page } from '../rendering-model';

export interface RenderPageConfig {
  CanvasKit: CanvasKit;
  surface: SkSurface;
  page: Page;
}
export function renderPage({ CanvasKit, surface }: RenderPageConfig): void {
  const canvas = surface.getCanvas();
  canvas.clear(CanvasKit.WHITE);
}
