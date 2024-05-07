import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Box } from '@chakra-ui/react';
import React from 'react';

interface PaginationProps {
  currentPage: string;
  totalItems: number;
}

const Pagenate: React.FC<PaginationProps> = ({ currentPage, totalItems }) => {
  const pageId = Number(currentPage); 
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const totalPages = Math.ceil(totalItems / 10);

  const goToPage = (pageNumber: number) => {
    query.set('page', String(pageNumber));
    navigate(`?${query.toString()}`);
  };

  const pageNumbers = [];
  const startPage = Math.max(1, pageId - 2);
  const endPage = Math.min(totalPages, pageId + 2);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box display="flex" justifyContent="center">
      { totalPages > 1 &&
        <Button onClick={() => goToPage(pageId - 1)} isDisabled={pageId <= 1}>Previous</Button>
      }
      {totalPages > 1 && pageNumbers.map((number) => (
        <Button bg={number === pageId ? "lightblue" : ""} key={number} onClick={() => goToPage(number)}>{number}</Button>
      ))}
      { totalPages > 1 && 
        <Button onClick={() => goToPage(pageId + 1)} isDisabled={totalPages <= pageId}>Next</Button>
      }
    </Box>
  );
};

export default Pagenate;
