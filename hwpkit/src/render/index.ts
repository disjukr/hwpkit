import { pt2px } from '../geom';
import { Paper } from '../rendering-model';

export interface RenderPaperConfig {
  ctx: CanvasRenderingContext2D;
  paper: Paper;
}
export function renderPaperTo2dContext({ ctx, paper }: RenderPaperConfig): void {
  const { page } = paper;
  const { columns } = page;
  ctx.save();
  ctx.scale(pt2px, pt2px);
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#0001';
  ctx.translate(page.x, page.y);
  ctx.beginPath();
  ctx.rect(0, 0, page.width, page.height);
  ctx.closePath();
  ctx.fill();
  for (const column of columns) {
    ctx.save();
    ctx.translate(column.x, column.y);
    ctx.beginPath();
    ctx.rect(0, 0, column.width, column.height);
    ctx.closePath();
    ctx.fill();
    for (const paragraph of column.paragraphs) {
      ctx.save();
      ctx.translate(paragraph.x, paragraph.y);
      for (const line of paragraph.lines) {
        ctx.save();
        ctx.translate(line.x, line.y);
        ctx.beginPath();
        ctx.rect(0, 0, line.width, line.height);
        ctx.closePath();
        ctx.fill();
        for (const segment of line.segments) {
          ctx.save();
          ctx.translate(segment.x, segment.y);
          ctx.beginPath();
          ctx.rect(0, 0, segment.width, segment.height);
          ctx.closePath();
          ctx.fill();
          for (const word of segment.words) {
            ctx.save();
            ctx.translate(word.x, word.y);
            ctx.beginPath();
            ctx.rect(0, 0, word.width, word.height);
            ctx.closePath();
            ctx.fill();
            for (const control of word.controls) {
              ctx.save();
              ctx.translate(control.x, control.y);
              ctx.beginPath();
              ctx.rect(0, 0, control.width, control.height);
              ctx.closePath();
              if (control.type === 1) {
                ctx.fillStyle = '#000';
                ctx.font = control.height + 'px Arial';
                ctx.fillText(control.char, 0, 0);
              } else {
                ctx.stroke();
              }
              ctx.restore();
            }
            ctx.restore();
          }
          ctx.restore();
        }
        ctx.restore();
      }
      ctx.restore();
    }
    ctx.restore();
  }
  ctx.restore();
}
