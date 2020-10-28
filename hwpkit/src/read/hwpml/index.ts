import { DocumentModel } from '../../model/document';
import { parse } from '../naive-xml-parser';

export function readHwpml(text: string): DocumentModel {
  console.log(parse(text));
  throw 'not implemented';
}
