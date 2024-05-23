import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Box, IconButton } from '@chakra-ui/react';
import React from 'react';
import { MdArrowBack, MdArrowForward } from "react-icons/md"


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
    <Box display="flex" justifyContent="center" flexWrap={{ base: "wrap", md: "nowrap" }} mt={4}>
      {totalPages > 1 && (
        <IconButton
        size="sm"
        icon={<MdArrowBack />}
        onClick={() => goToPage(pageId - 1)}
        isDisabled={pageId <= 1}
        mx={1}
        mb={{ base: 2, md: 0 }}
        aria-label="Previous page"
      />
      )}
      {totalPages > 1 && pageNumbers.map((number) => (
        <Button
          size="sm"
          bg={number === pageId ? "lightblue" : ""}
          key={number}
          onClick={() => goToPage(number)}
          mx={1}
          mb={{ base: 2, md: 0 }}
        >
          {number}
        </Button>
      ))}
      {totalPages > 1 && (
        <IconButton
          size="sm"
          icon={<MdArrowForward />}
          onClick={() => goToPage(pageId + 1)}
          isDisabled={totalPages <= pageId}
          mx={1}
          mb={{ base: 2, md: 0 }}
          aria-label="Next page"
        />
      )}
    </Box>
  );
};

export default Pagenate;
