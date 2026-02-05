export interface Hwp5Parser {
  // Parse HWP5 file (buffer) into internal intermediate representation.
  // Currently only the native backend is supported.
  parse(buffer: Buffer): import('./types').Hwp5ParsedDocument;
}
