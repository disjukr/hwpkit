import type { Section } from './section';

export * from './column';
export * from './control';
export * from './paragraph';
export * from './section';

export interface Body {
  sections: Section[];
}
