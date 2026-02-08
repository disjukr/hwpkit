import * as crypto from 'crypto';
import * as zlib from 'zlib';

interface DistHeader {
  tagId: number;
  headerSize: number;
  payloadOffset: number;
}

const DIST_DOC_TAG_ID = 28;
const DIST_DOC_PAYLOAD_SIZE = 256;

function parseLeadingRecordHeader(buf: Buffer): DistHeader | null {
  if (buf.length < 4) return null;

  const packed = buf.readUInt32LE(0) >>> 0;
  const tagId = packed & 0x3ff;

  let headerSize = (packed >>> 20) & 0xfff;
  let payloadOffset = 4;

  if (headerSize === 0xfff) {
    if (buf.length < 8) return null;
    headerSize = buf.readUInt32LE(4) >>> 0;
    payloadOffset = 8;
  }

  return { tagId, headerSize, payloadOffset };
}

function msvcSrand(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 214013) + 2531011) >>> 0;
    return (state >>> 16) & 0x7fff;
  };
}

function decodeDistDocHeaderPayload(rawPayload: Buffer): Buffer {
  const out = Buffer.from(rawPayload);

  const seed = ((out[3]! << 24) >>> 0) | (out[2]! << 16) | (out[1]! << 8) | out[0]!;
  const rand = msvcSrand(seed);

  let repeat = 0;
  let byteKey = 0;

  for (let i = 0; i < out.length; i++) {
    if (repeat === 0) {
      byteKey = rand() & 0xff;
      repeat = (rand() & 0x0f) + 1;
    }

    if (i >= 4) out[i] = out[i]! ^ byteKey;
    repeat -= 1;
  }

  return out;
}

function deriveAesKeyFromDecodedHeader(decodedPayload: Buffer): Buffer | null {
  if (decodedPayload.length !== DIST_DOC_PAYLOAD_SIZE) return null;

  const seed = ((decodedPayload[3]! << 24) >>> 0) | (decodedPayload[2]! << 16) | (decodedPayload[1]! << 8) | decodedPayload[0]!;
  const keyStart = 4 + (seed & 0x0f);
  const key = decodedPayload.subarray(keyStart, keyStart + 16);

  return key.length === 16 ? key : null;
}

function decryptTailWithAesEcb(encryptedTail: Buffer, key: Buffer): Buffer | null {
  if (key.length !== 16) return null;
  if (encryptedTail.length < 16) return null;

  const blockLen = encryptedTail.length - (encryptedTail.length % 16);
  if (blockLen <= 0) return null;

  try {
    const cipher = crypto.createDecipheriv('aes-128-ecb', key, null);
    cipher.setAutoPadding(false);
    return Buffer.concat([cipher.update(encryptedTail.subarray(0, blockLen)), cipher.final()]);
  } catch {
    return null;
  }
}

export function decodeDistributeViewText(comp: Buffer): Buffer | null {
  const lead = parseLeadingRecordHeader(comp);
  if (!lead) return null;

  if (lead.tagId !== DIST_DOC_TAG_ID) return null;
  if (lead.headerSize !== DIST_DOC_PAYLOAD_SIZE) return null;
  if (lead.payloadOffset + lead.headerSize > comp.length) return null;

  const encodedHeadPayload = comp.subarray(lead.payloadOffset, lead.payloadOffset + lead.headerSize);
  const encryptedTail = comp.subarray(lead.payloadOffset + lead.headerSize);

  const decodedHeadPayload = decodeDistDocHeaderPayload(encodedHeadPayload);
  const aesKey = deriveAesKeyFromDecodedHeader(decodedHeadPayload);
  if (!aesKey) return null;

  const decryptedTail = decryptTailWithAesEcb(encryptedTail, aesKey);
  if (!decryptedTail) return null;

  try {
    return zlib.inflateRawSync(decryptedTail);
  } catch {
    return null;
  }
}
