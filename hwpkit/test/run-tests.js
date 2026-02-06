const assert = require('assert');
const fs = require('fs');
const path = require('path');

function loadSample(name) {
  const p = path.resolve(__dirname, '..', '..', 'samples', name);
  return fs.readFileSync(p);
}

function run() {
  const { readHwp5 } = require('../lib/read/hwp5');

  const doc = readHwp5(loadSample('01-plain-text.hwp'));

  // DocumentModel shape
  assert(doc && typeof doc === 'object');
  assert(doc.head && doc.body);

  // beginNumber must be fully populated
  assert.deepStrictEqual(
    Object.keys(doc.head.docSetting.beginNumber).sort(),
    ['endnote', 'equation', 'footnote', 'page', 'picture', 'table'].sort()
  );

  // mapping tables non-empty
  assert(doc.head.mappingTable.styles.length > 0);
  assert(doc.head.mappingTable.charShapes.length > 0);
  assert(doc.head.mappingTable.paraShapes.length > 0);

  // pageDef derived
  const pd = doc.body.sections[0].def.pageDef;
  assert(pd.width > 0 && pd.height > 0);
  assert(pd.margin.left >= 0);

  // baseline colors
  const cs0 = doc.head.mappingTable.charShapes[0];
  assert.strictEqual(cs0.textColor, 0x00000000);
  assert.strictEqual(cs0.shadeColor, 0x00ffffff);

  // Sample: bold/italic/underline
  {
    const doc2 = readHwp5(loadSample('03-bold-italic-underline.hwp'));
    assert(doc2.head.mappingTable.charShapes.length >= 2);
    assert.strictEqual(doc2.head.mappingTable.charShapes.some((cs) => cs.bold), true);
    assert.strictEqual(doc2.head.mappingTable.charShapes.some((cs) => cs.italic), true);
    assert.strictEqual(doc2.head.mappingTable.charShapes.some((cs) => !!cs.underline), true);
  }

  // Sample: strikeout
  {
    const doc3 = readHwp5(loadSample('04-strikeout.hwp'));
    const hasStrike = doc3.head.mappingTable.charShapes.some(
      (cs) => cs.strikeout && cs.strikeout.color === 0x00b5742e
    );
    assert.strictEqual(hasStrike, true);
  }

  // Sample: shadow/outline
  {
    const doc4 = readHwp5(loadSample('05-shadow-outline.hwp'));
    assert.strictEqual(doc4.head.mappingTable.charShapes.some((cs) => !!cs.shadow), true);
    assert.strictEqual(doc4.head.mappingTable.charShapes.some((cs) => !!cs.outline), true);
  }

  // Sample: mixed charShape runs (PARA_CHAR_SHAPE)
  {
    const doc6 = readHwp5(loadSample('06-mixed-charshape-runs.hwp'));
    const p0 = doc6.body.sections[0].paragraphs[0];
    // After filtering U+FFFC placeholders, the first visible run may start as bold.
    assert.strictEqual(p0.texts.length >= 2, true);
    assert.deepStrictEqual(p0.texts.slice(0, 2).map((t) => t.charShapeIndex), [7, 0]);
  }

  // Sample: multi-column (ColDef via tag69)
  {
    const doc7 = readHwp5(loadSample('07-multi-column.hwp'));
    const p0 = doc7.body.sections[0].paragraphs[0];
    assert(p0.colDef && p0.colDef.count === 2);
  }

  {
    const doc8 = readHwp5(loadSample('08-multi-column-3.hwp'));
    const p0 = doc8.body.sections[0].paragraphs[0];
    assert(p0.colDef && p0.colDef.count === 3);
  }

  // Sample: pageBreak/columnBreak (empirical from PARA_HEADER flags)
  {
    const doc9 = readHwp5(loadSample('09-page-break.hwp'));
    assert.strictEqual(doc9.body.sections[0].paragraphs.some((p) => p.pageBreak), true);
    const hasFFFC = doc9.body.sections[0].paragraphs
      .flatMap((p) => p.texts)
      .flatMap((t) => t.controls)
      .some((c) => c.code === 0xfffc);
    assert.strictEqual(hasFFFC, false);
  }

  {
    const doc7 = readHwp5(loadSample('07-multi-column.hwp'));
    // second paragraph starts in next column in this sample
    assert.strictEqual(doc7.body.sections[0].paragraphs.some((p) => p.columnBreak), true);
  }

  // Sample: mixed charShape in a single paragraph
  {
    const doc10 = readHwp5(loadSample('10-mixed-charshape-in-one-paragraph.hwp'));
    const p0 = doc10.body.sections[0].paragraphs[0];
    assert.strictEqual(p0.texts.length > 1, true);
  }

  // Sample: charShape flags (emboss/engrave/super/sub + kerning/fontSpace)
  {
    const d = readHwp5(loadSample('11-superscript.hwp'));
    assert.strictEqual(d.head.mappingTable.charShapes.some((cs) => cs.superscript), true);
  }

  {
    const d = readHwp5(loadSample('12-subscript.hwp'));
    assert.strictEqual(d.head.mappingTable.charShapes.some((cs) => cs.subscript), true);
  }

  {
    const d = readHwp5(loadSample('13-emboss.hwp'));
    assert.strictEqual(d.head.mappingTable.charShapes.some((cs) => cs.emboss), true);
  }

  {
    const d = readHwp5(loadSample('14-engrave.hwp'));
    assert.strictEqual(d.head.mappingTable.charShapes.some((cs) => cs.engrave), true);
  }

  {
    const d = readHwp5(loadSample('15-use-kerning.hwp'));
    assert.strictEqual(d.head.mappingTable.charShapes.some((cs) => cs.useKerning), true);
  }

  {
    const d = readHwp5(loadSample('16-use-font-space.hwp'));
    assert.strictEqual(d.head.mappingTable.charShapes.some((cs) => cs.useFontSpace), true);
  }

  console.log('OK');
}

try {
  run();
} catch (e) {
  console.error('TEST_FAILED');
  console.error(e && e.stack ? e.stack : e);
  process.exit(1);
}
