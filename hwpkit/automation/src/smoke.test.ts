import assert from "node:assert/strict";
import { createHwp } from "./hwp.js";

async function testInsertTextRoundtrip() {
  const hwp = createHwp();
  const token = `hello-${Date.now()}`;

  const results = await hwp.batch([
    {
      op: "action",
      action: "InsertText",
      setId: "InsertText",
      fields: { Text: token },
    },
    {
      op: "getTextFile",
      format: "TEXT",
      option: "",
    },
  ] as any);

  const t = results.find((r: any) => r.op === "getTextFile") as any;
  assert.ok(t, "missing getTextFile result");
  assert.equal(typeof t.text, "string");
  assert.ok(t.text.includes(token), `expected exported text to include token: ${token}`);
}

async function testSimpleCall() {
  const hwp = createHwp();
  // should be integer-ish
  const mode = await hwp.method.GetMessageBoxMode();
  assert.ok(typeof mode === "number");
}

(async () => {
  const started = Date.now();
  await testSimpleCall();
  await testInsertTextRoundtrip();
  console.log(JSON.stringify({ ok: true, ms: Date.now() - started }, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
