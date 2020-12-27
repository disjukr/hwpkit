import { ColDef, ColLayoutType, ColType, Column } from '../../../model/document';
import { Element } from '../../naive-xml-parser';

export function readHwpmlColDef(hwpmlColDef: HwpmlColDef): ColDef {
  return {
    type: hwpmlColTypeToColTypeMap[hwpmlColDef.Type as HwpmlColType],
    count: parseInt(hwpmlColDef.Count, 10),
    layoutType: hwpmlColLayoutTypeToColLayoutTypeMap[hwpmlColDef.Layout as HwpmlColLayoutType],
    sameSize: hwpmlColDef.SameSize === 'true',
    sameGap: hwpmlColDef.SameGap ? parseInt(hwpmlColDef.SameGap, 10) : 0,
    columns: hwpmlColDef.COLUMNTABLE ? readHwpmlColumnTable(hwpmlColDef.COLUMNTABLE) : [],
  };
}

export function readHwpmlColumnTable(
  hwpmlColumnTable: HwpmlColumnTable
): Column[] {
  return hwpmlColumnTable.children.map(hwpmlColumn => {
    const { attrs } = hwpmlColumn as Element;
    return {
      gap: attrs.Gap ? parseInt(attrs.Gap, 10) : 0,
      width: parseInt(attrs.Width, 10),
    };
  });
}

export interface HwpmlColDef {
  Count: string;
  Layout: string;
  SameSize: string;
  SameGap?: string;
  Type: string;
  COLUMNTABLE?: Element;
}

export type HwpmlColType =
  | 'Newspaper'
  | 'BalancedNewspaper'
  | 'Parallel'
;
export type HwpmlColTypeToColTypeMap = { [hwpmlColType in HwpmlColType]: ColType };
export const hwpmlColTypeToColTypeMap: HwpmlColTypeToColTypeMap = {
  'Newspaper': ColType.Newspaper,
  'BalancedNewspaper': ColType.BalancedNewspaper,
  'Parallel': ColType.Parallel,
};

export type HwpmlColLayoutType =
  | 'Left'
  | 'Right'
  | 'Mirror'
;
export type HwpmlColLayoutTypeToColLayoutTypeMap = { [hwpmlColLayoutType in HwpmlColLayoutType]: ColLayoutType };
export const hwpmlColLayoutTypeToColLayoutTypeMap: HwpmlColLayoutTypeToColLayoutTypeMap = {
  'Left': ColLayoutType.Left,
  'Right': ColLayoutType.Right,
  'Mirror': ColLayoutType.Mirror,
};

export type HwpmlColumnTable = Element;
