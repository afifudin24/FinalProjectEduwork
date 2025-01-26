import React, { useState } from 'react';
import { Button, IconButton, Typography, Box } from '@mui/joy';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      console.log(`Current Page: ${newPage}`);
      // You can add additional logic here to fetch data based on the page
    }
  };

  return (
      <Box sx={{
          justifyContent : 'center',
          display: 'flex', alignItems: 'center', margin: '0 auto', width: '90%', gap: '10px'
      }}>
          {/* Previous Button */}
        
      <IconButton
        variant="outlined"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </IconButton>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => (
        <Button
              key={index + 1}
              color={'neutral'}
          variant={currentPage === index + 1 ? 'solid' : 'outlined'}
          onClick={() => handlePageChange(index + 1)}
          
        >
          {index + 1}
        </Button>
      ))}

      {/* Next Button */}
      <IconButton
        variant="outlined"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || currentPage > totalPages}
      >
        ›
      </IconButton>
    </Box>
  );
};

export default Pagination;
