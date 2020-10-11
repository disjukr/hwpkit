import type HWPDocument from 'hwp.js/build/models/document';

import { Pt } from '../geom';
import { RenderingModel, Paper } from '../model/rendering';
import { layoutSection } from './section';

export interface MeasureText {
  /**
   * TextMetrics 타입은 px 단위를 사용함에 주의.
   * hwpkit에서 레이아웃 코드는 일반적으로 pt 단위를 사용합니다.
  */
  (text: string, fontSize: Pt, font: string): TextMetrics;
}

export interface LayoutConfig {
  readonly document: HWPDocument;
  readonly measureText: MeasureText;
}
export default function layout(config: LayoutConfig): RenderingModel {
  const papers: Paper[] = [];
  const { document } = config;
  for (const docSection of document.sections) {
    papers.push(...layoutSection({ ...config, docSection }));
  }
  return {
    papers,
  };
}
