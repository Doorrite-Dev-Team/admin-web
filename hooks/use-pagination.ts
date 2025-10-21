import { useState } from 'react';

export const usePagination = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage);
  
  const nextPage = () => setPage(p => p + 1);
  const prevPage = () => setPage(p => Math.max(1, p - 1));
  const goToPage = (pageNum: number) => setPage(pageNum);
  
  return { page, nextPage, prevPage, goToPage, setPage };
};