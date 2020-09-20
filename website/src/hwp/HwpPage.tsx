import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Page } from 'hwpkit/lib/rendering-model';
import { renderPage } from 'hwpkit/lib/render';

import { useCanvasKit } from '../canvaskit';

interface HwpPageProps {
  page: Page;
}
const HwpPage: React.FC<HwpPageProps> = ({ page }) => {
  const CanvasKit = useCanvasKit();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = page.width;
    canvasRef.current.height = page.height;
    const surface = CanvasKit.MakeCanvasSurface(canvasRef.current);
    renderPage({ CanvasKit, surface, page });
  }, [CanvasKit, canvasRef.current, page]);
  return <Canvas ref={canvasRef}/>;
};
export default HwpPage;

const Canvas = styled.canvas`
  display: block;
  border: 1px solid black;
`;
