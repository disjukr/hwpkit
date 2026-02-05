const assert = require('assert');
const fs = require('fs');
const path = require('path');

function loadSample(name) {
  const p = path.resolve(__dirname, '..', '..', 'samples', name);
  return fs.readFileSync(p);
}

function run() {
  // Ensure lib is built
  const { readHwp5 } = require('../lib/read/hwp5');

  const buf = loadSample('01-plain-text.hwp');
  const doc = readHwp5(buf);

  // DocumentModel shape
  assert(doc && typeof doc === 'object');
  assert(doc.head && doc.body);

  // beginNumber must be fully populated
  assert.deepStrictEqual(Object.keys(doc.head.docSetting.beginNumber).sort(),
    ['endnote', 'equation', 'footnote', 'page', 'picture', 'table'].sort());

  // mapping tables non-empty
  assert(doc.head.mappingTable.styles.length > 0);
  assert(doc.head.mappingTable.charShapes.length > 0);
  assert(doc.head.mappingTable.paraShapes.length > 0);

  // pageDef derived
  const pd = doc.body.sections[0].def.pageDef;
  assert(pd.width > 0 && pd.height > 0);
  assert(pd.margin.left >= 0);

  // charShape colors parsed from DocInfo (tag 21)
  const cs0 = doc.head.mappingTable.charShapes[0];
  assert.strictEqual(cs0.textColor, 0x00ffffff);
  assert.strictEqual(cs0.shadeColor, 0x00b2b2b2);

  // strike color exists in at least one charShape
  const hasStrike = doc.head.mappingTable.charShapes.some((cs) => cs.strikeout && cs.strikeout.color === 0x00b5742e);
  assert.strictEqual(hasStrike, true);



  // Sample: bold/italic/underline
  {
    const buf2 = loadSample('03-bold-italic-underline.hwp');
    const doc2 = readHwp5(buf2);
    assert(doc2.head.mappingTable.charShapes.length > 0);
    // At minimum, styled samples should create multiple charShapes.
    assert(doc2.head.mappingTable.charShapes.length >= 2);
  }

  // Sample: strikeout
  {
    const buf3 = loadSample('04-strikeout.hwp');
    const doc3 = readHwp5(buf3);
    const hasStrike2 = doc3.head.mappingTable.charShapes.some((cs) => cs.strikeout && cs.strikeout.color === 0x00b5742e);
    assert.strictEqual(hasStrike2, true);
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
