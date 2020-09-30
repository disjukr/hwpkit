import DocSection from 'hwp.js/build/models/section';

import { LayoutConfig } from '.';
import { Page, Column } from '../rendering-model';

export interface LayoutSectionConfig extends LayoutConfig {
  readonly docSection: DocSection;
}
export function layoutSection(config: LayoutSectionConfig): Page[] {
  const pages: Page[] = [];
  let currentPage: Page = createPage(config);
  pages.push(currentPage);
  return pages;
}

export interface CreatePageConfig extends LayoutSectionConfig {}
export function createPage(config: CreatePageConfig): Page {
  const { docSection } = config;
  return {
    width: docSection.width / 100,
    height: docSection.height / 100,
    columns: [createColumn(config)],
    floatingObjects: [],
  };
}
export interface CreateColumnConfig extends LayoutSectionConfig {}
export function createColumn(config: CreateColumnConfig): Column {
  const { docSection } = config;
  const pageWidth = docSection.width / 100;
  const pageHeight = docSection.height / 100;
  const paddingLeft = docSection.paddingLeft / 100;
  const paddingTop = docSection.paddingTop / 100;
  const paddingRight = docSection.paddingRight / 100;
  const paddingBottom = docSection.paddingBottom / 100;
  return {
    x: paddingLeft,
    y: paddingTop,
    width: pageWidth - paddingLeft - paddingRight,
    height: pageHeight - paddingTop - paddingBottom,
    paragraphs: [],
  };
}
