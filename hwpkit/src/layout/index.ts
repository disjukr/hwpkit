import { DocumentModel } from '../model/document';
import { RenderingModel, Paper } from '../model/rendering';
import { layoutSection } from './section';

export type Px = number;
export interface MeasureText {
  /**
   * MeasureText 인터페이스는 px 단위를 사용함에 주의.
   * hwpkit에서 레이아웃 코드는 일반적으로 Hwpunit 단위를 사용합니다.
  */
  (text: string, fontSize: Px, font: string): TextMetrics;
}

export interface LayoutConfig {
  readonly document: DocumentModel;
  readonly measureText: MeasureText;
}
export default function layout(config: LayoutConfig): RenderingModel {
  const papers: Paper[] = [];
  const { document } = config;
  for (const docSection of document.body.sections) {
    papers.push(...layoutSection({ ...config, docSection }));
  }
  return {
    head: document.head,
    papers,
  };
}
