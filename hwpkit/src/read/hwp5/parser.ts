import type { Hwp5ParsedDocument } from './types';

export interface Hwp5Parser {
  parse(buffer: Buffer): Hwp5ParsedDocument;
}

export type Hwp5Backend = 'hwpjs' | 'native';

export function getDefaultHwp5Backend(): Hwp5Backend {
  const env = process.env.HWPKIT_HWP5_BACKEND;
  return env === 'native' ? 'native' : 'hwpjs';
}
