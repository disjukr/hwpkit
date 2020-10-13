import { parse } from 'hwp.js';

import { Bufferlike } from '../misc/type';
import { DocumentModel } from '../model/document';

export function parseHwp5(bufferlike: Bufferlike): DocumentModel {
  const hwpjsDocument = parseAsHwpjsDocument(bufferlike);
  const { info } = hwpjsDocument;
  const {
    startingIndex: beginNumber,
    caratLocation,
    fontFaces,
    charShapes,
    paragraphShapes,
  } = info;
  return {
    head: {
      docSetting: {
        beginNumber,
        caretPos: {
          list: caratLocation.listId,
          para: caratLocation.paragraphId,
          pos: caratLocation.charIndex,
        }
      },
      mappingTable: {} as any, // TODO
    },
    body: {} as any, // TODO
  }
}

export function parseAsHwpjsDocument(bufferlike: Bufferlike) {
  return parse(Buffer.from(bufferlike), { type: 'buffer' });
}
