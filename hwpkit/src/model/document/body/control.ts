export type Control =
  | CharControl
;

export interface CharControl extends ControlBase<ControlType.Char> {
  code: number;
}

interface ControlBase<T extends ControlType> {
  type: T;
}

export const enum ControlType {
  Char,
}
