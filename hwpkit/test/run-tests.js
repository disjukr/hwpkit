const assert = require('assert');
const fs = require('fs');
const path = require('path');

function loadSample(name) {
  const p = path.resolve(__dirname, '..', '..', 'samples', name);
  return fs.readFileSync(p);
}

function run() {
  const { readHwp5 } = require('../lib/read/hwp5');

  const buf = loadSample('01-plain-text.hwp');
  const doc = readHwp5(buf);

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

  console.log('OK');
}

try {
  run();
} catch (e) {
  console.error('TEST_FAILED');
  console.error(e && e.stack ? e.stack : e);
  process.exit(1);
}
