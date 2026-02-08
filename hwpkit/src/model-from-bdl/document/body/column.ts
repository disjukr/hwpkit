// AUTO-GENERATED from BDL IR. DO NOT EDIT.
import type { Hwpunit } from '../../document';

export interface ColDef {
  type: ColType;
  count: number;
  layoutType: ColLayoutType;
  sameSize: boolean;
  sameGap: Hwpunit;
  columns: Column[];
}

export const enum ColType {
  Newspaper,
  BalancedNewspaper,
  Parallel,
}

export const enum ColLayoutType {
  Left,
  Right,
  Mirror,
}

export interface Column {
  width: Hwpunit;
  gap: Hwpunit;
}
