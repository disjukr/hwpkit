import { parse } from 'hwp.js';
import type { RGB } from 'hwp.js/build/types/color';

import { Bufferlike } from '../misc/type';
import { AlignmentType1, BreakLatinWordType, DocumentModel, HeadingType, LangType, LineType2, LineWrapType, RgbColor, StrikeoutType, VerAlignType } from '../model/document';

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
      mappingTable: {
        fontFaces: [{
          // TODO: 국가별 글꼴 정보는 HWPTAG_ID_MAPPINGS 정보가 있어야 제대로 처리할 수 있음
          lang: LangType.Hangul,
          fonts: fontFaces.map(fontFace => ({
            name: fontFace.name,
            type: undefined,
          })),
        }],
        charShapes: charShapes.map(charShape => ({
          height: charShape.fontBaseSize * 1000,
          textColor: rgb(charShape.color),
          shadeColor: rgb(charShape.shadeColor),
          useFontSpace: false,
          useKerning: false,
          fontIds: charShape.fontId,
          ratios: charShape.fontRatio,
          charSpacings: charShape.fontSpacing,
          relSizes: charShape.fontScale,
          charOffsets: charShape.fontLocation,
          italic: false,
          bold: false,
          underline: undefined,
          strikeout: charShape.strikeColor ? {
            type: StrikeoutType.Continuous,
            shape: LineType2.Solid,
            color: rgb(charShape.strikeColor),
          } : undefined,
          outline: undefined,
          shadow: undefined,
          emboss: false,
          engrave: false,
          superscript: false,
          subscript: false,
        })),
        paraShapes: paragraphShapes.map(paragraphShape => ({
          align: paragraphShape.align as AlignmentType1,
          verAlign: VerAlignType.Baseline,
          headingType: HeadingType.None,
          level: 0,
          tabDef: 0,
          breakLatinWordType: BreakLatinWordType.KeepWord,
          breakNonLatinWord: true,
          condense: 0,
          widowOrphan: false,
          keepWithNext: false,
          keepLines: false,
          pageBreakBefore: false,
          fontLineHeight: false,
          snapToGrid: true,
          lineWrapType: LineWrapType.Break,
          autoSpaceEAsianEng: true,
          autoSpaceEAsianNum: true,
        })),
      },
    },
    body: {} as any, // TODO
  }
}

function rgb(rgb: RGB): RgbColor {
  const [r, g, b] = rgb;
  return (b << 16) & (g << 8) & r;
}

export function parseAsHwpjsDocument(bufferlike: Bufferlike) {
  return parse(Buffer.from(bufferlike), { type: 'buffer' });
}
