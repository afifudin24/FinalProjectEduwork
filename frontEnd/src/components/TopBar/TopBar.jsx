import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sheet, Typography, Button, Badge } from '@mui/joy'
import Box from '@mui/joy/Box'
import List from '@mui/joy/List'
import ListDivider from '@mui/joy/ListDivider'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import Home from '@mui/icons-material/Home'
import Person from '@mui/icons-material/Person'
import { ShoppingCart } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '@fontsource/inter' // This ensures the font is imported
import { hover } from '@testing-library/user-event/dist/hover'
const TopBar = ({totalCartItems, setTotalCartItems, isLogin}) => {
  
  const location = useLocation()
  // const [isLogin, setIsLogin] = useState(false);
  console.log(isLogin);
  return (
    <Sheet
      sx={{
        width: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '100',
        backgroundColor: 'slategray'
      }}
    >
      <Sheet
        sx={{
          display: 'flex',

          width: '90%',
          margin: '0 auto',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'Inter, sans-serif',
          padding: '10px 0',
          backgroundColor: 'slategray', // You can change the color here
          color: 'white'
        }}
      >
        {/* Left section: Brand/Logo */}
        <Link to={'/'} style={{ textDecoration: 'none' }}>
          <Typography
            level='h4'
            sx={{
              textDecoration: 'none',
              fontWeight: 'normal',
              padding: '5px',
              borderRadius: '5px',
              color: location.pathname === '/' ? 'grey' : 'white',
              backgroundColor:
                location.pathname === '/' ? 'white' : 'transparent',
              '&:hover': {
                borderRadius: '5px',
                backgroundColor: 'white',
                color: 'grey', // Change text color on hover
                textDecoration: 'none' // Optional: underline on hover
              }
            }}
          >
            POS
          </Typography>
        </Link>

        <Box
          component='nav'
          aria-label='My site'
          sx={{ flexGrow: 1, color: 'white' }}
        >
          <List role='menubar' orientation='horizontal'>
            {/* <ListItem role='none'>
              <ListItemButton
                role='menuitem'
                component='a'
                href='/'
                aria-label='Home'
                sx={{ color: 'white' }} // Setel warna teks menjadi putih
              >
                <Home />
              </ListItemButton>
            </ListItem> */}

            {isLogin ? (
              <ListItem role='none' sx={{ marginInlineStart: 'auto' }}>
                <Button
                  role='menuitem'
                  component='a'
                  variant='plain'
                  href='/profile'
                  aria-label='Profile'
                  sx={{
                    color: location.pathname === '/profile' ? 'grey' : 'white', // Change text color if active
                    backgroundColor:
                      location.pathname === '/profile'
                        ? 'white'
                        : 'transparent', // Change background if active
                    '&:hover': {
                      backgroundColor: 'neutral', // Change background color on hover
                      color: 'grey' // Change text color on hover
                    },
                    transition: 'background-color 0.3s ease' // Smooth transition effect
                  }}
                >
                  <Person />
                </Button>
                <Button
                  role='menuitem'
                  component='a'
                  variant='plain'
                  href='/cart'
                  aria-label='Profile'
                  sx={{
                    color: location.pathname === '/cart' ? 'grey' : 'white', // Change text color if active
                    backgroundColor:
                      location.pathname === '/cart' ? 'white' : 'transparent', // Change background if active
                    '&:hover': {
                      backgroundColor: 'neutral', // Ubah warna background saat hover
                      color: 'grey'
                    },
                    transition: 'background-color 0.3s ease' // Berikan efek transisi yang smooth
                  }}
                >
                  <Badge color='neutral' badgeContent={totalCartItems}>
                    <ShoppingCart />
                  </Badge>
                </Button>
              </ListItem>
            ) : (
              <ListItem role='none' sx={{ marginInlineStart: 'auto' }}>
                <Link to={'/login'}>
                  <Button
                  sx={{
                    backgroundColor: 'white',
                    color: 'slategrey',
                    '&:hover': {
                      backgroundColor: 'slategrey', // Ganti warna latar belakang saat di-hover
                      color: 'white' // Ganti warna teks saat di-hover
                    }
                  }}
                  >
                  Login
                </Button>
                  </Link>
              </ListItem>
            )}
          </List>
        </Box>
      </Sheet>
    </Sheet>
  )
}

export default TopBar
