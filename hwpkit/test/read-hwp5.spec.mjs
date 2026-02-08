import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { readHwp5 } from '../lib/read/hwp5/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadSample(name) {
  const p = path.resolve(__dirname, '..', '..', 'samples', name);
  return fs.readFileSync(p);
}

describe('readHwp5', () => {
  it('parses base document model and defaults', () => {
    const doc = readHwp5(loadSample('01-plain-text.hwp'));

    expect(doc && typeof doc).toBe('object');
    expect(!!doc.head && !!doc.body).toBe(true);
    expect(Object.keys(doc.head.docSetting.beginNumber).sort()).toEqual(
      ['endnote', 'equation', 'footnote', 'page', 'picture', 'table'].sort()
    );

    expect(doc.head.mappingTable.styles.length > 0).toBe(true);
    expect(doc.head.mappingTable.charShapes.length > 0).toBe(true);
    expect(doc.head.mappingTable.paraShapes.length > 0).toBe(true);

    const pd = doc.body.sections[0].def.pageDef;
    expect(pd.width > 0 && pd.height > 0).toBe(true);
    expect(pd.margin.left >= 0).toBe(true);

    const cs0 = doc.head.mappingTable.charShapes[0];
    expect(cs0.textColor).toBe(0x00000000);
    expect(cs0.shadeColor).toBe(0x00ffffff);

    const p0 = doc.body.sections[0].paragraphs[0];
    expect(Number.isInteger(p0.paraShapeIndex)).toBe(true);
    expect(p0.instId > 0).toBe(true);

    const ps = doc.head.mappingTable.paraShapes[0];
    expect(typeof ps.align).toBe('number');
    expect(ps.align >= 0 && ps.align <= 7).toBe(true);
    expect(ps.condense >= 0 && ps.condense <= 127).toBe(true);
  });

  it('parses char shape style attributes', () => {
    const doc2 = readHwp5(loadSample('03-bold-italic-underline.hwp'));
    expect(doc2.head.mappingTable.charShapes.length >= 2).toBe(true);
    expect(doc2.head.mappingTable.charShapes.some((cs) => cs.bold)).toBe(true);
    expect(doc2.head.mappingTable.charShapes.some((cs) => cs.italic)).toBe(true);
    expect(doc2.head.mappingTable.charShapes.some((cs) => !!cs.underline)).toBe(true);

    const doc3 = readHwp5(loadSample('04-strikeout.hwp'));
    const hasStrike = doc3.head.mappingTable.charShapes.some(
      (cs) => cs.strikeout && cs.strikeout.color === 0x00b5742e
    );
    expect(hasStrike).toBe(true);

    const doc4 = readHwp5(loadSample('05-shadow-outline.hwp'));
    expect(doc4.head.mappingTable.charShapes.some((cs) => !!cs.shadow)).toBe(true);
    expect(doc4.head.mappingTable.charShapes.some((cs) => !!cs.outline)).toBe(true);
  });

  it('parses paragraph char-shape runs and break/column flags', () => {
    const doc6 = readHwp5(loadSample('06-mixed-charshape-runs.hwp'));
    const p0 = doc6.body.sections[0].paragraphs[0];
    expect(p0.texts.length >= 2).toBe(true);
    expect(p0.texts.slice(0, 2).map((t) => t.charShapeIndex)).toEqual([7, 0]);

    const doc7 = readHwp5(loadSample('07-multi-column.hwp'));
    expect(doc7.body.sections[0].paragraphs[0].colDef?.count).toBe(2);
    expect(doc7.body.sections[0].paragraphs.some((p) => p.columnBreak)).toBe(true);

    const doc8 = readHwp5(loadSample('08-multi-column-3.hwp'));
    expect(doc8.body.sections[0].paragraphs[0].colDef?.count).toBe(3);

    const doc9 = readHwp5(loadSample('09-page-break.hwp'));
    expect(doc9.body.sections[0].paragraphs.some((p) => p.pageBreak)).toBe(true);
    const hasFFFC = doc9.body.sections[0].paragraphs
      .flatMap((p) => p.texts)
      .flatMap((t) => t.controls)
      .some((c) => c.code === 0xfffc);
    expect(hasFFFC).toBe(false);

    const doc10 = readHwp5(loadSample('10-mixed-charshape-in-one-paragraph.hwp'));
    expect(doc10.body.sections[0].paragraphs[0].texts.length > 1).toBe(true);
  });

  it('parses charShape flags (super/sub/emboss/engrave/kerning/font-space)', () => {
    expect(readHwp5(loadSample('11-superscript.hwp')).head.mappingTable.charShapes.some((cs) => cs.superscript)).toBe(true);
    expect(readHwp5(loadSample('12-subscript.hwp')).head.mappingTable.charShapes.some((cs) => cs.subscript)).toBe(true);
    expect(readHwp5(loadSample('13-emboss.hwp')).head.mappingTable.charShapes.some((cs) => cs.emboss)).toBe(true);
    expect(readHwp5(loadSample('14-engrave.hwp')).head.mappingTable.charShapes.some((cs) => cs.engrave)).toBe(true);
    expect(readHwp5(loadSample('15-use-kerning.hwp')).head.mappingTable.charShapes.some((cs) => cs.useKerning)).toBe(true);
    expect(readHwp5(loadSample('16-use-font-space.hwp')).head.mappingTable.charShapes.some((cs) => cs.useFontSpace)).toBe(true);
  });

  it('parses charShape ratio/spacing/offset/size overrides', () => {
    const d = readHwp5(loadSample('37-charshape-ratio150.hwp'));
    const cs = d.head.mappingTable.charShapes[d.body.sections[0].paragraphs[0].texts[0].charShapeIndex];
    expect(cs.ratios[1]).toBe(150);

    const d2 = readHwp5(loadSample('38-charshape-spacing20.hwp'));
    const cs1 = d2.head.mappingTable.charShapes[d2.body.sections[0].paragraphs[0].texts[0].charShapeIndex];
    expect(cs1.charSpacings[1]).toBe(20);

    const d3 = readHwp5(loadSample('39-charshape-offset20.hwp'));
    const cs2 = d3.head.mappingTable.charShapes[d3.body.sections[0].paragraphs[0].texts[0].charShapeIndex];
    expect(cs2.charOffsets[1]).toBe(20);

    const d4 = readHwp5(loadSample('40-charshape-size150.hwp'));
    const cs3 = d4.head.mappingTable.charShapes[d4.body.sections[0].paragraphs[0].texts[0].charShapeIndex];
    expect(cs3.relSizes[1]).toBe(150);
  });

  it('decodes distribute ViewText to recover original body text', () => {
    const base = readHwp5(loadSample('50-distribute-base.hwp'));
    const dist = readHwp5(loadSample('51-distribute-viewtext.hwp'));

    const toLines = (doc) =>
      doc.body.sections[0].paragraphs
        .map((p) => (p.texts ?? []).flatMap((t) => t.controls ?? []).map((c) => String.fromCharCode(c.code)).join(''))
        .map((x) => x.trim())
        .filter((x) => x.length > 0);

    expect(toLines(dist)).toEqual(toLines(base));
  });

  it('parses paraShape widow/orphan and keep-with-next flags', () => {
    const d1 = readHwp5(loadSample('28-parashape-widow-orphan-on.hwp'));
    const ps1 = d1.head.mappingTable.paraShapes[d1.body.sections[0].paragraphs[0].paraShapeIndex];
    expect(ps1.widowOrphan).toBe(true);

    const d2 = readHwp5(loadSample('29-parashape-keep-with-next-on.hwp'));
    const ps2 = d2.head.mappingTable.paraShapes[d2.body.sections[0].paragraphs[0].paraShapeIndex];
    expect(ps2.keepWithNext).toBe(true);
  });
});
