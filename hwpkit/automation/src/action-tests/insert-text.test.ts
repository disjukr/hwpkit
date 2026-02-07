import assert from "node:assert/strict";
import { createHwp } from "../hwp.js";

async function testInsertText_batchRoundtrip() {
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

async function testInsertText_rejectsUnknownParamKey() {
  const hwp = createHwp();
  await assert.rejects(
    () => hwp.action("InsertText" as any, { Text: "ok", __extra: 1 } as any),
    (e: any) => {
      assert.ok(String(e?.message ?? e).includes("unknown param key for InsertText"));
      return true;
    }
  );
}

(async () => {
  const started = Date.now();
  await testInsertText_rejectsUnknownParamKey();
  await testInsertText_batchRoundtrip();
  console.log(JSON.stringify({ ok: true, action: "InsertText", ms: Date.now() - started }, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
