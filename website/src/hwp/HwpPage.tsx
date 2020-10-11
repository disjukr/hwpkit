import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { pt2px } from 'hwpkit/lib/geom';
import { Paper } from 'hwpkit/lib/model/rendering';
import { renderPaperTo2dContext } from 'hwpkit/lib/render';

interface HwpPageProps {
  paper: Paper;
}
const HwpPage: React.FC<HwpPageProps> = ({ paper }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = paper.width * pt2px;
    canvasRef.current.height = paper.height * pt2px;
    const ctx = canvasRef.current.getContext('2d')!;
    renderPaperTo2dContext({ ctx, paper });
  }, [canvasRef.current, paper]);
  return <Canvas ref={canvasRef}/>;
};
export default HwpPage;

const Canvas = styled.canvas`
  display: block;
  border: 1px solid black;
`;
