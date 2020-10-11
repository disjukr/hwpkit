import type { Index } from '..';
import type { Control } from './control';

export interface Paragraph {
  paraShapeIndex: Index;
  styleIndex: Index;
  instId: number;
  pageBreak: boolean;
  columnBreak: boolean;
  texts: Text[];
}

export interface Text {
  charShapeIndex: Index;
  controls: Control[];
}
