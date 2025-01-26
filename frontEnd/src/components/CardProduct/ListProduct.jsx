import React from 'react';
import { Box, Card, CardOverflow, Skeleton, Button, CardContent, Typography, AspectRatio } from '@mui/joy';
import CardProduct from './CardProduct';
const ListProduct = ({modalCartOpen, totalCartItems, setTotalCartItems, isLoading, product, setProduct}) => {
  console.log('list', modalCartOpen)
  return (
    <Box
      sx={{
              display: 'grid',
           
        gap: 2,
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',  // 2 columns on extra-small screens (mobile)
          sm: 'repeat(3, 1fr)',  // 3 columns on small screens
          md: 'repeat(4, 1fr)',  // 4 columns on medium screens and up
          lg :'repeat(6, 1fr)'
        },
      }}
      >
       {
      isLoading ? (
          // Skeleton loading untuk Card
          Array(12).fill('').map((_, index) => (
              <Card key={index} sx={{ width: '100%', maxWidth: '100%', boxShadow: 'lg', overflow: 'hidden' }}>
              <CardOverflow>
                <AspectRatio sx={{ minWidth: 100 }}>
                  <Skeleton variant="rectangular" width="100%" height={100} />
                </AspectRatio>
              </CardOverflow>
              <CardContent>
             
                <Typography textAlign="left" level="body-xs" variant="body2">
                  <Box display="flex" flexDirection={'column'} gap={1}>
                    <Skeleton variant="rectangular" width={110} height={30} sx={{ marginRight: 0.5 }} />
                    <Skeleton variant="rectangular" width={105} height={15} sx={{ marginRight: 0.5 }} />
                    <Skeleton variant="rectangular" width={100} height={15} sx={{ marginRight: 0.5 }} />
                    <Skeleton variant="rectangular" width={100} height={20} sx={{ marginRight: 0.5 }} />
                    {/* <Skeleton width="70%" /> */}
                  </Box>
                </Typography>
                <Typography level="title-md" sx={{ mt: 1, fontWeight: 'xl' }}>
                  <Skeleton width="80%" />
                </Typography>
              </CardContent>
              <CardOverflow>
                <Button >
                  <Skeleton width="100%" height={40} />
                </Button>
              </CardOverflow>
            </Card>
          ))
        )  : (
          // Jika data sudah ada, tampilkan produk
          product.length > 0 ? (
            product.map((item, index) => (
              <Box key={index} sx={{ gridColumn: 'span 1', p: 1 }}>
                <CardProduct modalCartOpen={modalCartOpen} totalCartItems={totalCartItems} setTotalCartItems={setTotalCartItems} item={item} />
              </Box>
            ))
          ) :   <p style={{ textAlign: 'center', marginTop: '20px' }}>Tidak ada data</p>
        )
      }
    
     </Box>
  );
};

export default ListProduct;
