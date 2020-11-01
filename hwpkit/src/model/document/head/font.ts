import { Option } from '../../../misc/type';

export interface Font {
  name: string;
  type: Option<FontType>;
}

export const enum FontType {
  Rep,
  Ttf,
  Hft,
}
