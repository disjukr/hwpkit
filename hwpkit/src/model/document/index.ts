// AUTO-GENERATED from BDL IR. DO NOT EDIT.
// Source: model/document.bdl
import type { Body } from './body/index';
import type { Head } from './head/index';

export * from './body';
export * from './head';

export type Index = number;

export type Hwpunit = number;

export type RgbColor = number;

export type Percent = number;

export interface DocumentModel {
  head: Head;
  body: Body;
}
