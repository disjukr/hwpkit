// AUTO-GENERATED from BDL IR. DO NOT EDIT.
// Source: model/.bdl
import type { Body } from './document/body';
import type { Head } from './document/head';

export type Index = number;

export type Hwpunit = number;

export type RgbColor = number;

export type Percent = number;

export interface DocumentModel {
  head: Head;
  body: Body;
}
