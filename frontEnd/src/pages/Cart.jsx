import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import baseUrl from "../app/api/BaseUrl";
import {
    Box,
    Typography,
    Table,
    Input,
    Button,
    Textarea,
    Select,
    Option,
    FormControl,
    FormLabel
} from '@mui/joy';
import authController from "../app/api/auth/authController";
import TopBar from "../components/TopBar/TopBar";
import cartService from "../app/api/cart/cartService";
const Cart = () => {
     const [keranjang, setKeranjang] = useState([
    { id : 1, namaBarang: 'namabarang1', qty: 3, hargaPerItem: 4000 },
    { id : 2, namaBarang: 'namabarang2', qty: 2, hargaPerItem: 5000 },
    { id : 3,  namaBarang: 'namabarang3', qty: 1, hargaPerItem: 3000 },
     ]);
  const [cart, setCart] = useState([]);

  const [cartCount, setCartCount] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
   const [userData, setUser] = useState(null);
  const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
 // useEffect untuk menghitung subtotal setiap kali keranjang berubah
  useEffect(() => {
    const total = cart.map(item => item.qty * item.price).reduce((acc, curr) => acc + curr, 0);
    setSubtotal(total);
  }, [cart]); // Dependensi keranjang

  // State untuk subtotal
    const [subtotal, setSubtotal] = useState(0);
  const decOrIncQty = (action, item) => {
  
    console.log(item);
  // Cari item dalam keranjang berdasarkan ID atau nama
  const foundItem = cart.find((cartItem) => cartItem._id === item._id);

  if (foundItem) {
    if (action === "dec") {
      // Kurangi kuantitas jika kuantitas lebih dari 1
 
        foundItem.qty -= 1;
          
  
    } else if (action === "inc") {
      // Tambah kuantitas
      foundItem.qty += 1;
    }
     const data = {
      productId: item.product._id,
      qty : foundItem.qty
    }
    updateCart(data);
  

  } else {
    console.log("Item tidak ditemukan dalam keranjang");
    }
     
  // Update state dengan data baru
  setCart([...cart]);
};

  const deleteItemCart = (item) => {
    const filteredCart = keranjang.filter(itm => itm !== item);
    console.log(filteredCart);
    setKeranjang(filteredCart);
  }
    useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authController.checkMe();
        console.log(response);
        if (response.data.error === 1) {
          setError(new Error('Failed to fetch user data'));
          setIsLogin(false);
        } else {
          setUser(response.data);
          setIsLogin(true);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    }, []);
  const getCart = async () => {
    try {
      const response = await cartService.getCart();
      console.log(response);
      if (!response.data.error) {
        setCart(response.data.data);
          setCartCount(response.data.count);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const updateCart = async (data) => {
    try {
      const response = await cartService.updateCart(data);
      console.log(response);
      if (response.data.qty === 0) {
        setCart([]);
        getCart([]);
      }
    } catch (err) {
      console.log(err)
    }
  }
  const deleteCart = async (item) => {
   
    try {
      const response = await cartService.deleteCart(item.product._id);
      console.log(response);
    }catch(err){
      console.log(err);
    }
  }
  useEffect(() => {
    getCart();
  }, []);
    return (
      <div>
        <TopBar isLogin={isLogin} totalCartItems={cartCount}/>
      <Box
        border={1}
                borderColor={'darkgray'}
                overflow={'hidden'}
        borderRadius={'5px'}
        marginTop={'80px'}
         width={{
        xs: '80%',  // untuk ukuran extra-small
        sm: '80%',   // untuk ukuran small
        md: '80%',   // untuk ukuran medium
        lg: '60%',   // untuk ukuran large
        xl: '60%'    // untuk ukuran extra-large
    }}
        marginX={'auto'}
      >
        <Box
          borderBottom={1}
          borderColor={'darkgray'}
          width={'100%'}
          padding={'8px'}
          sx={{
            backgroundColor: '#eee'
          }}
        >
          <Typography fontWeight={'bold'}>Cart</Typography>
                </Box>
                <Box padding={'10px'}>
                    <Typography>Sub Total : Rp. {subtotal.toLocaleString()}</Typography>
                     <Table aria-label="basic table">
      <thead>
        <tr>
          <th style={{width: '10%'}}>#</th>
          <th>Image</th>
          <th>Product</th>
          <th>Price Per Item</th>
          <th>QTY</th>
         
        </tr>
      </thead>
                        <tbody>
                         {
    cart.length > 0 ? (
        cart.map((item, index) => (
            <tr key={index}>
                <td><Button onClick={() => deleteCart(item)} color="danger">-</Button></td>
            <td><img style={{width : '100px'}} src={`${baseUrl}/images/products/${item.image_url}`} alt="" /></td>
                <td>{item.name}</td>
                <td>Rp. {item.price.toLocaleString()}</td>
                <td>
                    <Button sx={{marginX : '5px'}} onClick={() => decOrIncQty("dec", item)} variant="outlined" color="neutral">-</Button>
                    {item.qty}
                    <Button sx={{marginX : '5px'}} variant="outlined" color="neutral" onClick={() => decOrIncQty("inc", item)}>+</Button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="5" style={{ textAlign: 'center' }}>Tidak Ada Data</td>
        </tr>
    )
}
      
      </tbody>
            </Table>
            <Link to={'/checkout'}>
            <Button style={{margin : '10px 0'}} variant="solid" color="neutral" fullWidth>Checkout</Button>
            </Link>
            </Box>
            </Box>
           
            </div>
    )
}

export default Cart;