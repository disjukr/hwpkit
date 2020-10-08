import type DocSection from 'hwp.js/build/models/section';

import { LayoutConfig } from '.';
import { Offset2d } from '../geom';
import { Column, Paper } from '../rendering-model';
import { PaperInfo, SizeConstraint } from './misc';
import { blockLayout, expandParagraph, inlineLayout, InlineLayoutResultType } from './paragraph';

export interface LayoutSectionConfig extends LayoutConfig {
  readonly docSection: DocSection;
}
export function layoutSection(config: LayoutSectionConfig): Paper[] {
  const { document, docSection } = config;
  const paperMaker = createPaperMaker(docSection);
  const expandedParagraphs = docSection.content.map(docParagraph => expandParagraph(document, docParagraph));
  for (let i = 0; i < expandedParagraphs.length; ++i) {
    const expandedParagraph = expandedParagraphs[i];
    const blockLayoutResult = blockLayout({
      ...config,
      expandedParagraph,
      columnSizeConstraint: getColumnSizeConstraint(paperMaker.currentColumn),
      paperInfo: paperMaker.paperInfo,
      columnInfo: paperMaker.currentColumn,
      floatingObjects: paperMaker.currentPaper.floatingObjects,
    });
    const { floatingObjects, inlineControls } = blockLayoutResult;
    paperMaker.currentPaper.floatingObjects = floatingObjects;
    let currentInlineControlOffset = 0;
    inline_layout: while (true) {
      const inlineLayoutResult = inlineLayout({
        ...config,
        expandedParagraph,
        inlineControls,
        startInlineControlOffset: currentInlineControlOffset,
        startOffset: paperMaker.currentOffset,
        columnSizeConstraint: getColumnSizeConstraint(paperMaker.currentColumn),
        paperInfo: paperMaker.paperInfo,
        columnInfo: paperMaker.currentColumn,
        floatingObjects,
      });
      const { paragraph, endOffset } = inlineLayoutResult;
      paperMaker.currentOffset = endOffset;
      if (paragraph) paperMaker.currentColumn.paragraphs.push(paragraph);
      switch (inlineLayoutResult.type) {
        case InlineLayoutResultType.Completed:
          break inline_layout;
        case InlineLayoutResultType.Overflowed:
          const { endInlineControlOffset } = inlineLayoutResult;
          currentInlineControlOffset = endInlineControlOffset;
          paperMaker.newPaper();
      }
    }
  }
  return paperMaker.papers;
}

interface PaperMaker {
  paperInfo: PaperInfo;
  papers: Paper[];
  currentPaper: Paper;
  currentColumn: Column;
  currentOffset: Offset2d,
  newPaper: () => void;
  newColumn: () => void;
}
function createPaperMaker(docSection: DocSection): PaperMaker {
  const paperInfo = getPaperInfo(docSection);
  const firstPaper = createPaper(paperInfo);
  const firstColumn = firstPaper.page.columns[0];
  const startOffset = getStartOffset(firstPaper, firstColumn);
  const papers = [firstPaper];
  const paperMaker: PaperMaker = {
    papers,
    paperInfo,
    currentPaper: firstPaper,
    currentColumn: firstColumn,
    currentOffset: startOffset,
    newPaper,
    newColumn: newPaper, // TODO: 다단
  };
  function newPaper() {
    const nextPaper = createPaper(paperInfo);
    const nextColumn = nextPaper.page.columns[0];
    paperMaker.currentPaper = nextPaper;
    paperMaker.currentColumn = nextColumn;
    paperMaker.currentOffset = getStartOffset(nextPaper, nextColumn);
    papers.push(nextPaper);
  }
  return paperMaker;
}

function createPaper(paperInfo: PaperInfo): Paper {
  return {
    width: paperInfo.width,
    height: paperInfo.height,
    page: {
      ...paperInfo.page,
      columns: [createColumn(paperInfo)]
    },
    floatingObjects: [],
  };
}
function createColumn(paperInfo: PaperInfo): Column {
  return {
    x: 0,
    y: 0,
    width: paperInfo.page.width,
    height: paperInfo.page.height,
    paragraphs: [],
  };
}

function getStartOffset(paper: Paper, column: Column): Offset2d {
  return {
    x: paper.page.x + column.x,
    y: paper.page.y + column.y,
  };
}

function getColumnSizeConstraint(column: Column): SizeConstraint {
  return {
    maxWidth: column.width,
    maxHeight: column.height,
  };
}

function getPaperInfo(docSection: DocSection): PaperInfo {
  const pageWidth = docSection.width / 100;
  const pageHeight = docSection.height / 100;
  const paddingLeft = docSection.paddingLeft / 100;
  const paddingTop = docSection.paddingTop / 100;
  const paddingRight = docSection.paddingRight / 100;
  const paddingBottom = docSection.paddingBottom / 100;
  return {
    width: pageWidth,
    height: pageHeight,
    page: {
      x: paddingLeft,
      y: paddingTop,
      width: pageWidth - paddingLeft - paddingRight,
      height: pageHeight - paddingTop - paddingBottom,
    },
  };
}
