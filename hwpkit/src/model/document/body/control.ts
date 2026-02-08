// AUTO-GENERATED from BDL IR. DO NOT EDIT.
// Source: model/document/body/control.bdl
import type { RgbColor } from '../index';

export interface CharControl {
  type: 'CharControl';
  text: string;
}

export interface TabControl {
  type: 'TabControl';
}

export interface LineBreakControl {
  type: 'LineBreakControl';
}

export interface HyphenControl {
  type: 'HyphenControl';
}

export interface NbSpaceControl {
  type: 'NbSpaceControl';
}

export interface FwSpaceControl {
  type: 'FwSpaceControl';
}

export interface TitleMarkControl {
  type: 'TitleMarkControl';
  ignore: boolean;
}

export interface MarkPenBeginControl {
  type: 'MarkPenBeginControl';
  color: RgbColor;
}

export interface MarkPenEndControl {
  type: 'MarkPenEndControl';
}

export type Control =
  | CharControl
  | TabControl
  | LineBreakControl
  | HyphenControl
  | NbSpaceControl
  | FwSpaceControl
  | TitleMarkControl
  | MarkPenBeginControl
  | MarkPenEndControl
;
