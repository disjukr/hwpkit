declare module 'cfb' {
  export interface CfbContainer {
    FullPaths?: string[];
    FileIndex?: unknown[];
  }

  export function read(
    data: Buffer | ArrayBuffer | Uint8Array,
    opts: { type: 'buffer' | 'binary' | 'array' }
  ): CfbContainer;

  export function find(container: CfbContainer, path: string): any;
}
