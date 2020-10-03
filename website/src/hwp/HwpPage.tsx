import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Paper } from 'hwpkit/lib/rendering-model';
import { renderPaper } from 'hwpkit/lib/render';

import { useCanvasKit } from '../canvaskit';

interface HwpPageProps {
  paper: Paper;
}
const HwpPage: React.FC<HwpPageProps> = ({ paper }) => {
  const CanvasKit = useCanvasKit();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = paper.width;
    canvasRef.current.height = paper.height;
    const surface = CanvasKit.MakeCanvasSurface(canvasRef.current);
    renderPage({ CanvasKit, surface, paper });
  }, [CanvasKit, canvasRef.current, paper]);
  return <Canvas ref={canvasRef}/>;
};
export default HwpPage;

const Canvas = styled.canvas`
  display: block;
  border: 1px solid black;
`;
