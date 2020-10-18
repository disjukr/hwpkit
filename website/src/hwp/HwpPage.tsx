import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { hwpunit2px } from 'hwpkit/lib/model/geom';
import { Paper, RenderingModel } from 'hwpkit/lib/model/rendering';
import { renderPaperTo2dContext } from 'hwpkit/lib/render';

interface HwpPageProps {
  renderingModel: RenderingModel;
  paper: Paper;
}
const HwpPage: React.FC<HwpPageProps> = ({ renderingModel, paper }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = paper.width * hwpunit2px;
    canvasRef.current.height = paper.height * hwpunit2px;
    const ctx = canvasRef.current.getContext('2d')!;
    renderPaperTo2dContext({ ctx, head: renderingModel.head, paper });
  }, [canvasRef.current, paper]);
  return <Canvas ref={canvasRef}/>;
};
export default HwpPage;

const Canvas = styled.canvas`
  display: block;
  border: 1px solid black;
`;
