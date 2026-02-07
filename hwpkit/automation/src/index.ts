import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";
import type { HwpCommand, HwpResult } from "./types.js";

const require = createRequire(import.meta.url);

let _dotnet: any | null = null;
let _loaded = false;

function getDotnet() {
  if (_dotnet) return _dotnet;
  _dotnet = require("node-api-dotnet/net8.0");
  return _dotnet;
}

function ensureLoaded() {
  if (_loaded) return;
  const dotnet = getDotnet();

  const here = path.dirname(fileURLToPath(import.meta.url));
  const dll = path.resolve(
    here,
    "..",
    "dotnet",
    "HwpDotNetHost",
    "bin",
    "Release",
    "net8.0-windows",
    "HwpDotNetHost.dll"
  );

  dotnet.load(dll);
  _loaded = true;
}

export async function runHwp(cmd: HwpCommand): Promise<HwpResult> {
  try {
    ensureLoaded();
    const dotnet = getDotnet();
    const outJson = dotnet.HwpDotNetHost.Exports.run(JSON.stringify(cmd));
    return JSON.parse(outJson);
  } catch (e: any) {
    return { ok: false, error: String(e?.message ?? e) };
  }
}

export * from "./hwp.js";
