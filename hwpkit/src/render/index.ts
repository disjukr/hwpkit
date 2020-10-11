import { pt2px } from '../geom';
import { ControlType, Paper } from '../model/rendering';

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
  for (const column of columns) {
    ctx.save();
    ctx.translate(column.x, column.y);
    for (const paragraph of column.paragraphs) {
      ctx.save();
      ctx.translate(paragraph.x, paragraph.y);
      for (const line of paragraph.lines) {
        ctx.save();
        ctx.translate(line.x, line.y);
        for (const segment of line.segments) {
          ctx.save();
          ctx.translate(segment.x, segment.y);
          for (const word of segment.words) {
            ctx.save();
            ctx.translate(word.x, word.y);
            for (const control of word.controls) {
              ctx.save();
              ctx.translate(control.x, control.y);
              if (control.type === ControlType.Char) {
                ctx.fillStyle = '#000';
                ctx.font = `${control.height}px ${control.font}`;
                ctx.fillText(control.char, 0, 0);
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
