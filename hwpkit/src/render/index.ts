import { CanvasKit, SkSurface } from 'canvaskit-wasm';

import { Paper } from '../rendering-model';

export interface RenderPaperConfig {
  CanvasKit: CanvasKit;
  surface: SkSurface;
  paper: Paper;
}
export function renderPaper({ CanvasKit, surface }: RenderPaperConfig): void {
  const canvas = surface.getCanvas();
  canvas.clear(CanvasKit.WHITE);
}
