import React, { useState } from 'react';
import { Sheet, Input, Button, Typography, Box } from '@mui/joy';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
const SearchBar = ({handleSearch, handleEditSearch, chooseKategori, setChooseKategori, categoryList, searchValue, setSearchValue}) => {
  // const [searchTerm, setSearchTerm] = useState('');

  // const handleSearch = () => {
  //   // Handle the search logic here
  //   console.log('Searching for:', searchTerm);
  // };

  return (
    <Sheet
      sx={{
        display: 'flex',
              alignItems: 'center',
             
              gap: 2,
        marginTop : '80px',
        marginX : ' 0',
        width : '100%',
        borderRadius: '8px',
      }}
      >
          <Box width={'20%'}>
        <Select value={chooseKategori} defaultValue="category" onChange={(e, newValue) => {
          setChooseKategori(newValue)
          // console.log(newValue);
       }} >
        
      <Option value="category">Category</Option>
      {
            categoryList.map(item => (
              <Option value={item.name}>{item.name}</Option>

            ))
          }
          </Select>  
          </Box>
       
          <Box display={'flex'} width={'80%'} >
              <Input
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => handleEditSearch(e.target.value)}
        sx={{ flex: 1, marginRight: '10px' }}
      />
      <Button onClick={handleSearch} variant="solid" color="neutral">
        Search
      </Button>
          </Box>
      
    </Sheet>
  );
};

export default SearchBar;
