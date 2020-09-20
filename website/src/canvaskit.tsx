import { createContext, useState, useEffect, useContext } from 'react';
import { CanvasKit } from 'canvaskit-wasm';

interface InitCanvasKit {
  (config?: { locateFile: (path: string, scriptDirectory: string) => string }): Promise<CanvasKit>;
}
const initCanvasKit: InitCanvasKit = require('canvaskit-wasm');

export const canvaskitContext = createContext<CanvasKit>(null as any);

export function useCanvasKitState() {
  const [CanvasKit, setCanvasKit] = useState<CanvasKit>();
  useEffect(() => {
    initCanvasKit({ locateFile: path => path }).then(setCanvasKit);
  }, []);
  return CanvasKit;
}

export function useCanvasKit() {
  return useContext(canvaskitContext);
}
