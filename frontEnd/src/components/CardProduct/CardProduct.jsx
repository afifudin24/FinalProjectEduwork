import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import { Box } from '@mui/joy';
import { Label } from '@mui/icons-material';
import baseUrl from '../../app/api/BaseUrl';

const CardProduct = ({ totalCartItems, modalCartOpen, setTotalCartItems, item }) => {
  console.log(modalCartOpen);
  const handleAddToCart = () => {
    setTotalCartItems((prev) => prev + 1);
    // console.log(setTotalCartItems);
  }
    return (
<Card sx={{ width: '100%', maxWidth: '100%', boxShadow: 'lg' }}>
      <CardOverflow>
        <AspectRatio sx={{ minWidth: 100 }}>
          <img
              src={`${baseUrl}/images/products/${item.image_url}`}
            srcSet="https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286&dpr=2 2x"
            loading="lazy"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
            <CardContent>
                <Typography textAlign={'left'} level="body-md">{item.name}</Typography>
                <Typography textAlign={'left'} level="body-xs">{item.category.name}</Typography>
               <Typography textAlign="left" level="body-xs" variant="body2">
            <Box display="flex" sx={{fontSize : '10px'}} alignItems="center">
                <Label sx={{ fontSize : 12, marginRight: 0.5 }} />
           <div>
      {item.tags.map((tag, index) => (
        <span key={tag._id}>
          {tag.name}
          {index < item.tags.length - 1 && ', '} {/* Add a comma except for the last item */}
        </span>
      ))}
    </div>
      
            </Box>
        </Typography>

        <Typography
          level="title-sm"
          sx={{ mt: 1, fontWeight: 'xl' }}
        >
                   Rp. {item.price}
        </Typography>
      
      </CardContent>
      <CardOverflow>
        <Button onClick={() => modalCartOpen(item)} variant="solid" color="neutral" size="lg">
          Add to cart
        </Button>
      </CardOverflow>
    </Card>
    )
}

export default CardProduct;