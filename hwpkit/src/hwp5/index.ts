import type HWPDocument from 'hwp.js/build/models/document';

import { DocumentModel } from '../model/document';

export function fromHwpjsDocument(hwpjsDocument: HWPDocument): DocumentModel {
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
