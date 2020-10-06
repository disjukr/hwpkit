import { Paper } from '../rendering-model';

export interface RenderPaperConfig {
  ctx: CanvasRenderingContext2D;
  paper: Paper;
}
export function renderPaperTo2dContext({ ctx, paper }: RenderPaperConfig): void {
}
