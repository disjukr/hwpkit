// AUTO-GENERATED from BDL IR. DO NOT EDIT.
// Source: model/.bdl

export interface Font {
  name: string;
  type?: FontType;
}

export const enum FontType {
  Rep,
  Ttf,
  Hft,
}

export type Fonts = Font[];
