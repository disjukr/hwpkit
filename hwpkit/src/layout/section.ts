import { LayoutConfig } from '.';
import { Offset2d } from '../model/geom';
import { Section as DocSection } from '../model/document';
import { Column, Paper } from '../model/rendering';
import { PaperInfo, SizeConstraint } from './misc';
import { blockLayout, inlineLayout, InlineLayoutResultType } from './paragraph';

export interface LayoutSectionConfig extends LayoutConfig {
  readonly docSection: DocSection;
}
export function layoutSection(config: LayoutSectionConfig): Paper[] {
  const { docSection } = config;
  const paperMaker = createPaperMaker(docSection);
  for (const docParagraph of docSection.paragraphs) {
    const blockLayoutResult = blockLayout({
      ...config,
      docParagraph,
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
        docParagraph,
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
  const {
    pageDef: {
      width,
      height,
      margin,
    },
  } = docSection.def;
  return {
    width,
    height,
    page: {
      x: margin.left,
      y: margin.top + margin.header,
      width: width - margin.left - margin.right,
      height: height - margin.top - margin.bottom - margin.header - margin.footer,
    },
  };
}
