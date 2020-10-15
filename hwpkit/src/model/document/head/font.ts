import { Option } from '../../../misc/type';
import type { LangType } from './lang';

export interface FontFace {
  lang: LangType;
  fonts: Font[];
}

export interface Font {
  name: string;
  type: Option<FontType>;
}

export const enum FontType {
  Rep,
  Ttf,
  Htf,
}
