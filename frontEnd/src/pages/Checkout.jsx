import React, { useState, useEffect } from 'react'
import {
  Button,
  Box,
  Typography,
  Snackbar,
  Checkbox,
  FormControl,
  FormLabel,
  Table
} from '@mui/joy'
import { useNavigate } from "react-router";
import TopBar from '../components/TopBar/TopBar';
import cartService from '../app/api/cart/cartService';
import authController from '../app/api/auth/authController';
import deliveryAddressService from '../app/api/deliveryAddress/deliveryAddressService';
import deliveryPriceService from '../app/api/deliveryPrice/deliveryPriceService';
import orderService from '../app/api/order/orderService';
const Checkout = () => {
  const [step, setStep] = useState(1) // To track the current step in the process
  const [selectedAddresses, setSelectedAddresses] = useState(null) // Track selected addresses
  const [confirmed, setConfirmed] = useState(false)
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [subtotal, setSubtotal] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState([]);
    const [userData, setUser] = useState(null);
  const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
  // Sample list of addresses
   const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State for dynamic Snackbar message
  const [snackbarColor, setSnackbarColor] = useState(''); // State for dynamic Snackbar message
   const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close Snackbar
  };
    useEffect(() => {
    const total = cart.map(item => item.qty * item.price).reduce((acc, curr) => acc + curr, 0);
    setSubtotal(total);
  }, [cart]); 

  // Handle selecting and deselecting addresses
  const handleAddressSelect = (id) => {
    if (selectedAddresses === id) {
      setSelectedAddresses(null);
    } else {
      setSelectedAddresses(id);
    }
  }

  // Proceed to the next step
  const handleNext = () => {
    setStep(prevStep => prevStep + 1)
  }

  // Go back to the previous step
  const handleBack = () => {
    setStep(prevStep => prevStep - 1)
  }

  // Confirm the details
  const handleConfirm = () => {
    confirmOrder();
    // setConfirmed(true)
    // handleNext()
  }

  // Submit payment and show receipt
  const handlePayment = () => {
    // Placeholder for payment logic
    handleNext()
  }
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
  const getDeliveryAddress = async () => {
    try {
      const response = await deliveryAddressService.getDeliveryAddress();
      console.log('alamat', response);
      setDeliveryAddress(response.data);
    } catch (err) {
      console.log(err);
    }
  }
  const getDeliveryPrice = async (kab) => {
    try {
      const response = await deliveryPriceService.getDeliveryPrice(kab);
      console.log('delivery price', response);
      if (response.error === 0) {
     
        console.log(response.data);
        if (!response.data) {
          setDeliveryPrice({
            kabupaten: 'No Data',
            price : 25000
          });
        } else {
          setDeliveryPrice(response.data);
          
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  const confirmOrder = async () => {
    const data = {
      delivery_fee: deliveryPrice.price,
      delivery_address: selectedAddresses,
      totalAmount : deliveryPrice.price + subtotal
    };
    console.log(data);
    try {
      const response = await orderService.postOrder(data);
      console.log('iniresponse', response);
      if (response.status === 200) {
           setSnackbarOpen(true);
          setSnackbarMessage('Berhasil Menambah Pesanan');
          setSnackbarColor('success');
          setTimeout (() => {
            // arahkan ke route /
            navigate("/")
          }, 1000)
      }
    } catch (err) {
      console.log(err);
    }
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
  useEffect(() => {
    getCart();
    getDeliveryAddress();
  }, [])

  useEffect(() => {
    console.log('kocak', selectedAddresses);
  }, [selectedAddresses]);
  useEffect(() => {
    if (selectedAddresses) {
      getDeliveryPrice(selectedAddresses.kabupaten);
    }
  }, [selectedAddresses])
  return (
    <>
      <TopBar isLogin={isLogin} totalCartItems={cartCount}/>
      <div>
        <Box
          border={1}
          borderColor={'darkgray'}
          overflow={'hidden'}
          borderRadius={'5px'}
          marginTop={'80px'}
          width={{ xs: '80%', lg: '60%' }} // 80% untuk ukuran kecil, 60% untuk ukuran besar
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
                      <Typography fontWeight={'bold'}>{ step === 3 ? 'Invoices' : 'Checkout'}</Typography>
          </Box>
          <Box padding={'10px'}>
            <Box padding={'5px'}>
              {step === 1 && (
                <Box>
                  <Typography variant='h5'>Pilih Alamat Pengiriman</Typography>
                  {selectedAddresses ? (
                    <Typography variant='body1'>
                      Alamat Terpilih: {selectedAddresses.nama}
                    </Typography>
                  ) : (
                    ''
                  )}

                  <Box marginTop={'10px'}>
                    <Table>
                      <thead>
                        <tr>
                          <th style={{ width: '10%' }}>#</th>
                          <th>Nama</th>
                          <th>Alamat</th>
                          <th>Detail</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryAddress.map(address => (
                          <tr>
                            {/* <FormControl key={address.id} fullWidth sx={{ marginBottom: 1 }}> */}
                            <td>
                              <Checkbox
                                checked={selectedAddresses == address}
                                onChange={() => handleAddressSelect(address)}
                              />
                            </td>
                            <td>
                              <FormLabel>{address.nama}</FormLabel>
                            </td>
                            <td>
                              <FormLabel>{address.kelurahan}, {address.kecamatan} {address.kabuupaten} { address.provinsi}</FormLabel>
                            </td>
                            <td>
                              <FormLabel>{address.detail}</FormLabel>
                            </td>

                            {/* </FormControl> */}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Box>
                  <Box display={'flex'} justifyContent={'flex-end'}>
                    <Button
                      onClick={handleNext}
                      variant='solid'
                      color='primary'
                      disabled={!selectedAddresses} // Disable if no address is selected
                      sx={{ marginTop: '10px' }}
                    >
                      Selanjutnya
                    </Button>
                  </Box>
                </Box>
              )}

              {step === 2 && (
                <Box>
                  <Typography variant='h5'>Konfirmasi</Typography>
                  <Table aria-label='basic table'>
                    <tr>
                      <td>Alamat</td>
                    <td>
  {selectedAddresses? (
    
      // Mencari alamat berdasarkan ID
     
      <Typography>
        { selectedAddresses.nama}
      </Typography>
    
  ) : (
    <Typography>Alamat tidak ditemukan</Typography>
  )}
</td>
                    </tr>
                    <tr>
                      <td>Sub Total</td>
                      <td> Rp. {subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Ongkir</td>
                      <td>Rp. { deliveryPrice.price.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>Rp. { (deliveryPrice.price + subtotal).toLocaleString()}</td>
                    </tr>
                  </Table>

                  <Box
                    marginTop={'10px'}
                    display={'flex'}
                    justifyContent={'space-between'}
                  >
                    <Button onClick={handleBack} variant='soft' color='neutral'>
                      Sebelumnya
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      variant='solid'
                      color='primary'
                      sx={{ marginLeft: 2 }}
                    >
                      Konfirmasi
                    </Button>
                  </Box>
                </Box>
              )}

              {step === 3 && confirmed && (
                <Box>
                  {/* <Typography variant='h5'>Payment</Typography> */}
                                  <Table>
                                      <tr>
                                          <td>Status</td>
                                          <td>Waiting Payment</td>
                                      </tr>
                                      <tr>
                                          <td>
                                          Order ID
                                          </td>
                                          <td>#4</td>
                                      </tr>
                                      <tr>
                                          <td>
                                          Total Tagihan
                                          </td>
                                          <td>
                                              Rp. 25000
                                          </td>
                                          
                                      </tr>
                                      <tr>
                                          <td>
                                          Tagihan untuk
                                          </td>
                                          <td>
                                              <h3>Afif Waliyudin</h3>
                                              <p>afifrider507@gmail.com</p>
                                             
                                          </td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>
                         <Typography>
                           
                            {selectedAddresses ?  selectedAddresses.nama : ''}
                          </Typography>
                      </td>
                    </tr>
                                      <tr>
                                          <td>Bayar ke</td>
                                          <td>
                                               <p>Afif Waliyudin</p>
                                              <p>afifrider507@gmail.com</p>
                                              <p>BCA</p>
                                              <p>8743659233477584</p>
                                          </td>
                                      </tr>
                                  </Table>
                                      
                  <Box marginTop={'10px'}>
                    <Button onClick={handleBack} variant='soft' color='neutral'>
                      Sebelumnya
                    </Button>
                    <Button
                      onClick={handlePayment}
                      variant='solid'
                      color='neutral'
                      sx={{ marginLeft: 2 }}
                    >
                      Bayar
                    </Button>
                  </Box>
                </Box>
              )}

              {step === 4 && (
                <Box>
                  <Typography variant='h5'>Payment Receipt</Typography>
                  <Typography>
                    Thank you for your purchase! Your payment was successful.
                  </Typography>
                  <Typography>Addresses used for delivery:</Typography>
                  <Box marginTop={'10px'}>
                   
                      <Typography>
                        {selectedAddresses ? selectedAddresses.nama : ''}
                      </Typography>
                  
                  </Box>
                  <Button
                    onClick={() => setStep(1)} // Reset to the first step if needed
                    variant='soft'
                    color='neutral'
                    sx={{ marginTop: 2 }}
                  >
                    Back to Checkout
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </div>
        <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        color={snackbarColor}
        variant='solid'
        autoHideDuration={3000} // Closes automatically after 3 seconds
        message={ snackbarMessage} // Message to display
      > { snackbarMessage} </Snackbar>
    </>
  )
}

export default Checkout
