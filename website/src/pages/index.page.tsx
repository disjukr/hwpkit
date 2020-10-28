import React, { useEffect, useState } from 'react';
import axios from 'axios';
import read from 'hwpkit/lib/read';
import layout from 'hwpkit/lib/layout';
import { DocumentModel } from 'hwpkit/lib/model/document';
import { RenderingModel } from 'hwpkit/lib/model/rendering';
import { measureText } from 'hwpkit/lib/canvas';

import { getErrorMessage } from '../misc/error';
import HwpPage from '../hwp/HwpPage';

const Page: React.FC = () => {
  const { documentModel, error } = useDocumentModel('/hml/para-align.hml');
  const renderingModel = useRenderingModel(documentModel);
  const {
    paper,
    pageCount,
    currentPage,
    setCurrentPage,
  } = usePaper(renderingModel);
  if (error) return <>{getErrorMessage(error)}</>;
  return <>
    page: {currentPage + 1} / {pageCount}
    <button onClick={() => setCurrentPage(currentPage - 1)}>&lt;</button>
    <button onClick={() => setCurrentPage(currentPage + 1)}>&gt;</button>
    {renderingModel && paper && <HwpPage renderingModel={renderingModel} paper={paper}/>}
  </>;
};
export default Page;

function usePaper(renderingModel?: RenderingModel) {
  const pageCount = renderingModel?.papers.length ?? 0;
  const [currentPage, setCurrentPage] = useState(0);
  const paper = renderingModel?.papers[currentPage];
  useEffect(() => {
    setCurrentPage(Math.max(0, Math.min(currentPage, pageCount - 1)));
  }, [pageCount]);
  return {
    paper,
    pageCount,
    currentPage,
    setCurrentPage,
  };
}

function useRenderingModel(documentModel?: DocumentModel) {
  const [renderingModel, setRenderingModel] = useState<RenderingModel>();
  useEffect(() => {
    if (!documentModel) return;
    setRenderingModel(
      layout({
        document: documentModel,
        measureText,
      }));
  }, [documentModel]);
  return renderingModel;
}

function useDocumentModel(url: string) {
  const [error, setError] = useState<Error>();
  const [documentModel, setDocumentModel] = useState<DocumentModel>();
  useEffect(() => {
    axios({
      url,
      responseType: 'arraybuffer'
    }).then(res => {
      const documentModel = read(Buffer.from(res.data));
      setDocumentModel(documentModel);
    }).catch(err => {
      setError(err);
    });
  }, [url]);
  return { documentModel, error };
}
