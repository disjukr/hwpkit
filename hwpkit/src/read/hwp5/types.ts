export type Hwp5Rgb = readonly [number, number, number];

export interface Hwp5FontFace {
  name: string;
}

export interface Hwp5CharShape {
  fontBaseSize: number;
  color: Hwp5Rgb;
  shadeColor: Hwp5Rgb;
  fontId: number[];
  fontRatio: number[];
  fontSpacing: number[];
  fontScale: number[];
  fontLocation: number[];
  strikeColor?: Hwp5Rgb;
}

export interface Hwp5ParagraphShape {
  align: number;
}

export interface Hwp5CaratLocation {
  listId: number;
  paragraphId: number;
  charIndex: number;
}

export interface Hwp5Info {
  startingIndex: number;
  caratLocation: Hwp5CaratLocation;
  fontFaces: Hwp5FontFace[];
  charShapes: Hwp5CharShape[];
  paragraphShapes: Hwp5ParagraphShape[];
}

export interface Hwp5Section {
  width: number;
  height: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  headerPadding: number;
  footerPadding: number;
  content: Hwp5Paragraph[];
}

export type Hwp5CharType = 0 | 2;

export interface Hwp5Char {
  type: Hwp5CharType;
  value: string | number;
}

export interface Hwp5Control {
  [key: string]: unknown;
}

export interface Hwp5ShapePointer {
  pos: number;
  shapeIndex: number;
}

export interface Hwp5Paragraph {
  shapeIndex: number;
  shapeBuffer: Hwp5ShapePointer[];
  content: Hwp5Char[];
  controls: Hwp5Control[];
}

export interface Hwp5ParsedDocument {
  info: Hwp5Info;
  sections: Hwp5Section[];
}
