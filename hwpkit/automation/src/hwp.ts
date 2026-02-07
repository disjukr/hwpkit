import { runHwp } from "./index.js";
import type { JsonValue } from "./types.js";
import { HWP_METHODS, type HwpMethodName } from "./generated/methods.js";
import type { HwpMethodSig } from "./generated/method-sigs.js";
import { HWP_ACTIONS, type HwpActionName } from "./generated/actions.js";
import {
  PARAMETER_SETS,
  type ParameterSetId,
  validateParamSet,
  type ParamMap,
} from "./generated/psets.js";

export type HwpBatchResult =
  | { op: "call"; method: string; return: any }
  | { op: "get"; prop: string; value: any }
  | { op: "set"; prop: string; ok: true }
  | { op: "runAction"; action: string; ok: true }
  | { op: "getTextFile"; format: string; option: string; text: string }
  | { op: "action"; action: string; runtimeId: string; ok: true };

export class HwpClient {
  /**
   * Dynamic proxy for COM methods.
   *
   * Example:
   *   await hwp.method.GetTextFile('TEXT','');
   */
  readonly method: { [K in HwpMethodName]: (...args: Parameters<HwpMethodSig<K>>) => Promise<ReturnType<HwpMethodSig<K>>> };

  constructor() {
    this.method = new Proxy(
      {} as any,
      {
        get: (_t, prop) => {
          const name = String(prop) as HwpMethodName;
          if (!(HWP_METHODS as readonly string[]).includes(name)) {
            throw new Error(`unknown hwp method: ${name}`);
          }
          return async (...args: JsonValue[]) => {
            const res = await runHwp({ cmd: "call", method: name, args });
            if (!res.ok) throw new Error(res.error);
            return res.data?.return;
          };
        },
      }
    );
  }

  async get(prop: string) {
    const res = await runHwp({ cmd: "get", prop });
    if (!res.ok) throw new Error(res.error);
    return res.data?.value;
  }

  async set(prop: string, value: JsonValue) {
    const res = await runHwp({ cmd: "set", prop, value });
    if (!res.ok) throw new Error(res.error);
  }

  /**
   * Run a HWP action using a known parameter set.
   *
   * - `action` is the HAction name (e.g. "InsertText")
   * - `setId` is our canonical parameter set id (from parametersets.json)
   * - `fields` must match that set (extra keys rejected)
   */
  async action<A extends HwpActionName>(action: A, fields: Record<string, any> = {}) {
    const v = validateParamSet(action as any, fields);
    if (!v.ok) throw new Error(v.error);

    const spec = PARAMETER_SETS[action as any];
    const res = await runHwp({
      cmd: "batch",
      ops: [
        {
          op: "action",
          action,
          parameterSet: { runtimeId: spec.runtimeId, fields: v.params },
        },
      ],
    });
    if (!res.ok) throw new Error(res.error);
    return true;
  }

  /**
   * Run multiple operations in one HWP instance (keeps state within the batch).
   */
  async batch(ops: Array<
    | { op: "call"; method: HwpMethodName; args?: JsonValue[] }
    | { op: "get"; prop: string }
    | { op: "set"; prop: string; value: JsonValue }
    | { op: "runAction"; action: string }
    | { op: "getTextFile"; format: string; option: string }
    | { op: "action"; action: string; setId: ParameterSetId; fields?: ParamMap }
    | { op: "action"; action: string; parameterSet: { runtimeId: string; fields?: ParamMap } }
  >): Promise<HwpBatchResult[]> {
    const mapped = ops.map((op) => {
      if (op.op !== "action") return op;
      if ((op as any).parameterSet) return op;
      const setId = (op as any).setId as ParameterSetId;
      const spec = PARAMETER_SETS[setId];
      const v = validateParamSet(setId, (op as any).fields ?? {});
      if (!v.ok) throw new Error(v.error);
      return {
        op: "action" as const,
        action: (op as any).action,
        parameterSet: { runtimeId: spec.runtimeId, fields: v.params },
      };
    });

    const res = await runHwp({ cmd: "batch", ops: mapped as any });
    if (!res.ok) throw new Error(res.error);
    return res.data?.results ?? [];
  }
}

export function createHwp() {
  return new HwpClient();
}





