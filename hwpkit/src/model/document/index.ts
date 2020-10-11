import type { Head } from './head';
import type { Body } from './body';

export * from './head';
export * from './body';

export type Index = number;
export type Hwpunit = number; // 10 pt = 1000 hwpunit
export type RgbColor = number; // 0x00bbggrr
export type Percent = number; // 0 ~ 100

export interface DocumentModel {
  head: Head;
  body: Body;
}
