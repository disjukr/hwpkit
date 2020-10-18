import { DocumentModel } from '../model/document';
import { readHwp5 } from './hwp5';

export const enum HwpType {
  Unknown,
  Hwp3,
  Hwp5,
  Hwpml,
}

export default function read(buffer: Buffer, as: HwpType = detect(buffer)): DocumentModel {
  switch (as) {
    case HwpType.Unknown:
    case HwpType.Hwpml:
    case HwpType.Hwp3: throw new Error('unsupported');
    case HwpType.Hwp5: return readHwp5(buffer);
  }
}

export function detect(buffer: Buffer): HwpType {
  if (buffer.slice(0, 30).toString() === 'HWP Document File V3.00 \x1A\x01\x02\x03\x04\x05') {
    return HwpType.Hwp3;
  }
  if (buffer.slice(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))) {
    return HwpType.Hwp5;
  }
  if (buffer.slice(buffer.length - '</HWPML>'.length).toString() === '</HWPML>') {
    return HwpType.Hwpml;
  }
  return HwpType.Unknown;
}
