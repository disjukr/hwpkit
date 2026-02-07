// AUTO-GENERATED. DO NOT EDIT.
// Source: tools/gen-method-sigs.cjs
// Inputs: artifacts/hwp-method-tests-canonical.json

import type { JsonValue } from "../types.js";
import type { HwpMethodName } from "./methods.js";

export type HwpMethodSigMap = {
  // Best-effort signatures learned from canonical method tests.
  // Methods not listed here fall back to unknown args/return.
  "FindCtrl": () => string;
  "GetFontList": () => string;
  "GetHeadingString": () => string;
  "GetMessageBoxMode": () => number;
  "GetPosBySet": () => Record<string, JsonValue>;
  "InitHParameterSet": () => null;
  "Quit": () => null;
};

export type HwpMethodSig<K extends HwpMethodName> =
  K extends keyof HwpMethodSigMap ? HwpMethodSigMap[K] : (...args: JsonValue[]) => unknown;
