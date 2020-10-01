import DocParagraph from 'hwp.js/build/models/paragraph';

import { LayoutConfig } from '.';
import { Word } from '../rendering-model';
import { CharShapeBuffer } from './paragraph';

export interface LayoutWordConfig extends LayoutConfig {
  readonly docParagraph: DocParagraph;
  readonly charShapeBuffer: CharShapeBuffer;
  readonly startControlIndex: number;
  readonly endControlIndex: number;
}
export interface LayoutWordResult {
  word: Word;
}
/**
 * 단어를 레이아웃 합니다.
 * 단어와 컨트롤의 x, y 속성은 layoutParagraph 메서드에서 결정됩니다.
 * @see paragraph:layoutParagraph
*/
export function layoutWord(config: LayoutWordConfig): LayoutWordResult {
  const { charShapeBuffer } = config;
  return {} as LayoutWordResult;
}
