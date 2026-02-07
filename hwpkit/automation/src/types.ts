export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [k: string]: JsonValue };

export type HwpOp =
  | { op: "call"; method: string; args?: JsonValue[] }
  | { op: "get"; prop: string }
  | { op: "set"; prop: string; value: JsonValue }
  | { op: "runAction"; action: string }
  | { op: "getTextFile"; format: string; option?: string }
  | {
      op: "action";
      action: string;
      parameterSet: {
        runtimeId: string;
        /** key-value pairs that will be assigned onto the parameter set COM object */
        fields?: Record<string, JsonValue>;
      };
    };

export type HwpCommand =
  | { cmd: "meta" }
  | { cmd: "call"; method: string; args?: JsonValue[] }
  | { cmd: "get"; prop: string }
  | { cmd: "set"; prop: string; value: JsonValue }
  | { cmd: "batch"; ops: HwpOp[] };

export type HwpResult = { ok: true; data?: any } | { ok: false; error: string };