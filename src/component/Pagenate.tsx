import { Text,Button, Box } from '@chakra-ui/react';
import { link } from 'fs';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface PaginationProps {
    currentPage: string;
    totalItems: number;
  }

  export default function Pagenate({ currentPage, totalItems }:PaginationProps){
  const pageId = Number(currentPage); 
  const navigate = useNavigate();
  const totalPages = Math.ceil(totalItems / 10);

  const goToPage = (pageNumber:number) => {
    navigate(`?page=${pageNumber}`);
  };

  const pageNumbers = [];
  const startPage = Math.max(1, pageId - 2);
  const endPage = Math.min(totalPages, pageId + 2);

for (let i = startPage; i <= endPage; i++) {
  pageNumbers.push(i);
}

  return (
    <Box display="flex" justifyContent="center">
      <Button onClick={() => goToPage(pageId - 1)} disabled={pageId === 1}>Previous</Button>
      {pageNumbers.map((number) => (
        <Button bg={number === pageId ? "lightblue" : ""} key={number} onClick={() => goToPage(number)}>{number}</Button>
      ))}
      <Button onClick={() => goToPage(pageId + 1)} disabled={pageId === totalPages}>Next</Button>
    </Box>
  );
};
