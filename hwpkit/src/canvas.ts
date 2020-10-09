import { MeasureText } from './layout';

export const measureText: MeasureText = (text, fontSize, font) => {
  const ctx = getCtx();
  ctx.font = `${fontSize}pt ${font}`;
  return ctx.measureText(text);
}
function getCtx() {
  if (getCtx.ctx) return getCtx.ctx;
  const canvas = document.createElement('canvas');
  canvas.height = canvas.width = 1;
  const ctx = canvas.getContext('2d')!;
  return getCtx.ctx = ctx;
}
getCtx.ctx = null as (CanvasRenderingContext2D | null);
