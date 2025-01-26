import * as React from 'react';
import { useEffect } from 'react';
import { useState, useCallback, useRef, useLayoutEffect } from 'react'
import { Sheet, Modal, ModalDialog, Input,    ModalClose } from "@mui/joy";
import baseUrl from '../app/api/BaseUrl';
import {
  Box,
  Typography,
  Table,

  Button,
  Textarea,
  Select,
  Option,
  FormControl,
  FormLabel,
  Snackbar
} from '@mui/joy';
import TopBar from '../components/TopBar/TopBar';
import List from '@mui/joy/List';
import Accordion, { accordionClasses } from '@mui/joy/Accordion'
import AccordionDetails from '@mui/joy/AccordionDetails'
import AccordionGroup from '@mui/joy/AccordionGroup'
import AccordionSummary from '@mui/joy/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ListItemButton from '@mui/joy/ListItemButton'
import IconButton from '@mui/joy/IconButton'
import DialogTitle from '@mui/joy/DialogTitle'
import DialogContent from '@mui/joy/DialogContent'
import DialogActions from '@mui/joy/DialogActions'

import Divider from '@mui/joy/Divider'
import Tooltip from '@mui/joy/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import { EditOutlined } from '@mui/icons-material'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../app/features/Auth/actions';
import authService from '../app/api/auth/authService';
import deliveryAddressService from '../app/api/deliveryAddress/deliveryAddressService';
import ZoneServices from '../app/api/zoneServices/zoneServices';
import orderService from '../app/api/order/orderService';
import InvoiceService from '../app/api/invoiceService/invoiceService';
import cartService from '../app/api/cart/cartService';
import SvgIcon from '@mui/joy/SvgIcon';
import { styled } from '@mui/joy';
const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px; `;
function Profile() {
 const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState();
   const [selectedImage, setSelectedImage] = useState(null);
   const [buktiFile, setBuktiFile] = useState(null);
  const closeModal = () => {
    setSelectedImage(null);
    setBuktiFile(null);
    setModalOpen(false);
    setSelectedOrder(null);
  }
  const updateInvoice = async () => {
    try {
      const formData = new FormData();
      formData.append('image', buktiFile);

       const response = await InvoiceService.updateInvoice(selectedOrder.order._id, formData);
      console.log(response.data.message);
      if (response.status === 200) {
        closeModal();
            setSnackbarMessage(response.data.message);
           setSnackbarOpen(true); // Open Snackbar on success
          setSnackbarColor('success');
          setTimeout(() => {
            setSnackbarOpen(false)
          }, 2000);
        }
    } catch (err) {
      console.log(err)
     }
   }
   const getStatusLabel = (status) => {
  switch (status) {
    case "waiting_payment":
      return "Menunggu Pembayaran";
    case "processing":
      return "Diproses";
    case "in_delivery":
      return "Dalam Pengiriman";
    case "delivered":
      return "Diterima";
    default:
      return "Status Tidak Dikenal";
  }
};
  const handleFileChange = (event) => {
    setBuktiFile(event.target.files[0]);
     const file = event.target.files[0];
    console.log(event.target.files[0]);
      if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Generate image URL
    }
  };

  const handleUpload = () => {
    if (buktiFile) {
      // Simulate upload logic
      // onUpload(buktiFile);
      updateInvoice();

    } else {
      alert("Pilih file terlebih dahulu!");
    }
  };
  const [isLogin, setIsLogin] = useState(true);
  const [provinsi, setProvinsi] = useState([]);
 
  const [totalCartItem, setTotalCartItems] = useState(cartCount);

   const [snackbarMessage, setSnackbarMessage] = useState(''); // State for dynamic Snackbar message
  const [snackbarColor, setSnackbarColor] = useState(''); // State for dynamic Snackbar message
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for dynamic Snackbar message
const getCart = async () => {
    try {
      const response = await cartService.getCart();
      console.log('cart',response);
      setCartCount(response.data.count);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getCart()
  }, [])


  const handleLogout = async () => {
    // dispatch(logout()); // Dispatch loginSuccess action on successful login
    try {
      const response = await authService.logout();
      console.log(response);
      if (response.data.error === 1) {
        setShowSnackBar(true);
        setSnackbarMessage(response.data.message);
        setSnackbarColor('danger');
      } else {
        setShowSnackBar(true);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
         setSnackbarMessage(response.data.message);
        setSnackbarColor('success');
        setTimeout(() => {
          navigate('/');
          }, 1000);
      }
    } catch (err) { 
      console.log(err);
    }
    
    // setTimeout(() => {
    //   navigate('/');
    // }, 1000);
  }
    const handleSnackbarClose = () => {
    setShowSnackBar(false); // Close Snackbar
  };
  
 

 
  const Profil = () => {
     
    return (
      <Box margin={'0 10px'}>
        <Table aria-label='basic table'>
          <tbody>
            <tr>
              <td>Nama</td>
              <td>Afif Waliyudin</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>afifrider507@gmail.com</td>
            </tr>
          </tbody>
        </Table>
      </Box>
    )
  }
  const Pemesanan = () => {
    const [orders, setOrders] = useState([]);
  
     const getOrder = async () => {
     try {
       const response = await orderService.getOrder();
       console.log('ini order', response.data.data);
       setOrders(response.data.data)
     } catch (err) {
       console.log(err)
      }
    }
    const getInvoice =  async (orderId) => {
      try {
        const response = await InvoiceService.getInvoice(orderId);
        console.log(response);
           setSelectedOrder(response.data);
      } catch (err) {
        console.log(err)
      }
    }
    const cekInvoice = (item) => {
   
      console.log('item', item);
      setModalOpen(true);
      getInvoice(item._id);
    }

    function formatAddress(deliveryAddress) {
  const { kabupaten, kecamatan, kelurahan, provinsi } = deliveryAddress;

  // Gabungkan dengan format yang diinginkan
  const address = `${kelurahan}, ${kecamatan}, ${kabupaten}, ${provinsi}`;

  // Kapitalisasi setiap kata
  return address.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}



    useEffect(() => {
      getOrder();
    }, []);
 return (
    <Box margin={'0 10px'} sx={{ backgroundColor: 'neutral.50' }}>
      {/* <Button onClick={() => handleUpdateOrder(0, 'Updated Status')}>
        Update First Order Status
      </Button> */}
      <AccordionGroup
        color='neutral'
        variant='outlined'
        sx={theme => ({
          [`& .${accordionClasses.root}`]: {
            marginTop: '0.5rem',
            transition: '0.2s ease',
            '& button:not([aria-expanded="true"])': {
              transition: '0.2s ease',
              paddingBottom: '0.625rem'
            },
            '& button:hover': {
              background: 'transparent'
            }
          },
          [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
            bgcolor: 'background.level1',
            borderRadius: 'md',
            borderBottom: '1px solid',
            borderColor: 'background.level2'
          },
          '& [aria-expanded="true"]': {
            boxShadow: `inset 0 -1px 0 ${theme.vars.palette.divider}`
          }
        })}
      >
    {orders.length > 0 ? (
  orders.map(order => (
    <Accordion key={order.id}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${order.id}-content`}
        id={`panel-${order.kodeOrder}-header`}
      >
       <Typography level="title-sm">
  Order: {order.order_number} - Status: {getStatusLabel(order.status)}
</Typography>
      </AccordionSummary>
      <AccordionDetails>
      
        <Typography level='body-xs'>Alamat: {formatAddress(order.delivery_address)}</Typography>
        <Typography level='body-xs'>Items:</Typography>
        <Typography level="body-xs">
        <ul className='mx-2' style={{marginLeft : 15}}>
          {order.order_items.map((item, index) => (
            <li key={index}>
              <Typography level='body-xs'>
                {item.name} - Qty: {item.qty} - Harga: Rp.{item.price.toLocaleString()}
              </Typography>
            </li>
          ))}
        </ul>
          </Typography>
        <Box display={'flex'} justifyContent={'end'} alignContent={'flex-end'}>
          <Button variant='outlined' onClick={() => cekInvoice(order)} color='primary'>Invoice</Button>
          <Box>
            <Tooltip title='Delete'>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  ))
) : (
  <Typography level='body-sm' align='center' mt={2}>
    Belum ada pesanan.
  </Typography>
)}

      </AccordionGroup>
    </Box>
  )
   }
  // const [isAdd, setIsAdd] = useState(false);

 
  const Alamat = ({ addresses, setAddresses }) => {
    const [isAddAddress, setIsAddAddress] = useState(false)
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
      const [addressList, setAddressList] = useState([]);
    const [selectAddress, setSelectAddress] = useState({})
    const [provinsi, setProvinsi] = useState([]);
    const [selectedProvinsi, setSelectedProvinsi] = useState(null);
    const [kabupaten, setKabupaten] = useState([]);
    const [selectedKabupaten, setSelectedKabupaten] = useState(null);
    const [kecamatan, setKecamatan] = useState([]);
    const [selectedKecamatan, setSelectedKecamatan] = useState(null);
    const [kelurahan, setkelurahan] = useState([]);
    const [selectedKelurahan, setSelectedKelurahan] = useState(null)
    const [formHeight, setFormHeight] = useState(0)
    const formRef = useRef(null)
    const chooseAddress = (address, action) => {
      console.log(address)
      setSelectAddress(address)
      console.log(action)
      if (action === 'delete') {
        setOpen(true)
      } else {
        setIsEdit(true);
        setIsAddAddress(true);
      }
    }

    const getAddress = async () => {
      try {
        const response = await deliveryAddressService.getDeliveryAddress();
        console.log('address', response);
        setAddressList(response.data);
      } catch (err) { 
        console.log(err);
        }
    }
      const getProvinsi = async () => {
    try {
      const response = await ZoneServices.getProvinces();
      const data = response;
      console.log(data);
      setProvinsi(data);

      // setProvinsi(response);
    } catch (err) {
      console.log(err);
    }
    }
    const getCountry = async () => {
      try {
        const response = await ZoneServices.getCountry(selectedProvinsi);
        console.log('kabupaten', response);
        const data = response;
        setKabupaten(data);
      } catch (err) {
        console.log(err);
      }
    }
    const getDistrict = async () => {
      try {
        const response = await ZoneServices.getDistrict(selectedKabupaten);
        console.log(response);
        const data = response;
        setKecamatan(data);
      } catch (err) {
        console.log(err);
      }
    }
    const getVillages = async () => {
      try {
        const response = await ZoneServices.getVillages(selectedKecamatan);
        console.log(response);
        const data = response;
        setkelurahan(data);
      } catch (err) {
        console.log(err);
      }
    }
 

    const updateAddress = async (updatedAddress) => {
      console.log(updatedAddress);
      try {
          const response = await deliveryAddressService.updateDeliveryAddress(updatedAddress._id, updatedAddress);
        console.log(response);
        if (response.status === 200) {
            setOpen(false);
 setSnackbarMessage(response.message);
           setSnackbarOpen(true); // Open Snackbar on success
          setSnackbarColor('success');
          setTimeout(() => {
            setSnackbarOpen(false)
            getAddress()
          }, 2000);
          setIsEdit(false);
          
          
        }
      } catch (err) {
        console.log(err);
      }
      // setAddresses(updatedAddresses);
  };

    // const delete
    useLayoutEffect(() => {
      if (isAddAddress && formRef.current) {
        setFormHeight(formRef.current.getBoundingClientRect().height)
      } else {
        setFormHeight(0)
      }
    }, [isAddAddress])

    const [newAddress, setNewAddress] = useState({

      nama: '',
      detail: '',
      provinsi: '',
      kabupaten: '',
      kecamatan: '',
      kelurahan : ''
    })
      const insertAddress = async () => {
      try {
        const response = await deliveryAddressService.insertDeliveryAddress(newAddress);
        console.log(response);
        if (response.status === 201) {
            setSnackbarMessage(response.message);
           setSnackbarOpen(true); // Open Snackbar on success
          setSnackbarColor('success');
          setTimeout(() => {
            setSnackbarOpen(false)
          }, 2000);
        }
      } catch (err) {
        console.log(err)
      }
    }
        const deleteAddress = async (id) => {
      try {
        const response = await deliveryAddressService.deleteDeliveryAddress(id);
        console.log(response)
        if (response.status === 200) {
          setOpen(false);
 setSnackbarMessage(response.message);
           setSnackbarOpen(true); // Open Snackbar on success
          setSnackbarColor('success');
          setTimeout(() => {
            setSnackbarOpen(false)
            getAddress()
          }, 2000);
        }
      } catch (err) {
        console.log(err)
      }
    }

 
    const handleInputChange = (e) => {
      const { name, value, id } = e.target
      console.log(value);
      if (name === 'provinsi') {
        setSelectedProvinsi(id? id : '');
      } else if (name === 'kabupaten') {
        setSelectedKabupaten(id ? id : '');
      } else if(name === 'kecamatan') {
        setSelectedKecamatan(id? id : '');
      } else {
        setSelectedKelurahan(id ? id : '');
      }
      if (isEdit) {
        setSelectAddress(prev => ({ ...prev, [name]: value? value : '' }));
      } else {
        setNewAddress(prev => ({ ...prev, [name]: value? value : '' }))
      }
    }

    // Handle form submission
    const handleSubmit = e => {
      e.preventDefault()
      if (isEdit) {
        updateAddress(selectAddress);
      } else {
          console.log('ini address baru', newAddress)
        console.log(addresses)
        insertAddress();
        
      // Update addresses state with new address
      // setAddresses(prev => [...prev, newAddress])

      // Reset form
      setNewAddress({
        nama: '',
        detail: '',
        provinsi: '',
        kabupaten: '',
        kecamatan: ''
        
      })
      // Hide the form after submission
      setIsAddAddress(false)
      }
    
    }

  

    const handleClick = () => {
      setIsAddAddress(true)
      //  console.log(addresses);
    }
  
    useEffect(() => {
      getAddress();
    }, []);
    
    useEffect(() => {
      getProvinsi();
    }, [])

    useEffect(() => {
      if (selectedProvinsi) {
        getCountry();
        console.log(newAddress);
      }
    }, [selectedProvinsi]);

    useEffect(() => {
      if (selectedKabupaten) {
        getDistrict();
      }
    }, [selectedKabupaten]);
    useEffect(() => {
      if (selectedKecamatan) {
        getVillages();
      }
    }, [selectedKecamatan]);
    return (
      <Box
        margin={'0 10px'}
        sx={{ backgroundColor: 'neutral.50' }}
      >
        {!isAddAddress ? (
          <Button
            onClick={handleClick}
            sx={{ marginY: '10px' }}
            variant='solid'
            color='neutral'
          >
            Tambah Alamat
          </Button>
        ) : (
          ''
        )}
      {isAddAddress ? (
  <form
    onSubmit={handleSubmit}
    style={{ margin: '10px 0'}}
  >
    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
      <Box>
        <FormControl>
          <FormLabel>Nama Alamat</FormLabel>
                  <Input
             disabled={isEdit}
            required
            placeholder='Nama'
            name='nama'
            value={isEdit ? selectAddress.nama : newAddress.nama}
            onChange={handleInputChange}
            sx={{ marginBottom: '10px' }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Detail Alamat</FormLabel>
          <Textarea
            required
            placeholder='Detail Alamat'
            minRows={6}
            name='detail'
            value={isEdit ? selectAddress.detail : newAddress.detail}
            onChange={handleInputChange}
            sx={{ marginBottom: '10px' }}
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl sx={{ marginBottom: '10px' }}>
          <FormLabel>Provinsi</FormLabel>
          <Select
            placeholder='Pilih Provinsi'
            value={isEdit ? selectAddress.provinsi : newAddress.provinsi}
            name='provinsi'
           onChange={(e, newValue) => {
      // Misalkan Anda ingin menambahkan id provinsi yang dipilih
      const selectedProvinsi = provinsi.find(prov => prov.name === newValue);
      handleInputChange({
        target: {
          name: 'provinsi',
          value: newValue,
          id: selectedProvinsi ? selectedProvinsi.id : null, // Menambahkan id provinsi
          type: 'provinsi', // Menambahkan tipe
        }
      });
    }}
            required
          >
            {provinsi.map(prov => (
              <Option key={prov.id} value={prov.name}>
                {prov.name}
              </Option>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ marginBottom: '10px' }}>
          <FormLabel>Kabupaten</FormLabel>
          <Select
            placeholder='Pilih Kabupaten'
            value={isEdit ? selectAddress.kabupaten : newAddress.kabupaten}
            name='kabupaten'
           onChange={(e, newValue) => {
      // Misalkan Anda ingin menambahkan id provinsi yang dipilih
      const selectedKabupaten = kabupaten.find(kab => kab.name === newValue);
      handleInputChange({
        target: {
          name: 'kabupaten',
          value: newValue,
          id: selectedKabupaten ? selectedKabupaten.id : null, // Menambahkan id provinsi
          type: 'kabupaten', // Menambahkan tipe
        }
      });
    }}
            required
          >
            {kabupaten.map(kab => (
              <Option key={kab.id} value={kab.name}>
                {kab.name}
              </Option>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ marginBottom: '10px' }}>
          <FormLabel>Kecamatan</FormLabel>
          <Select
            placeholder='Pilih Kecamatan'
                    value={isEdit ? selectAddress.kecamatan : newAddress.kecamatan}
                    
            name='kecamatan'
              onChange={(e, newValue) => {
      // Misalkan Anda ingin menambahkan id provinsi yang dipilih
    const selectedKecamatan = kecamatan?.length > 0 
  ? kecamatan.find(kec => kec.name === newValue) 
  : null;

      handleInputChange({
        target: {
          name: 'kecamatan',
          value: newValue,
          id: selectedKecamatan ? selectedKecamatan.id : null, // Menambahkan id provinsi
          type: 'kecamatan', // Menambahkan tipe
        }
      });
    }}
            required
          >
           { 
  kecamatan.length > 0 ? (
    kecamatan.map((kec) => (
      <Option key={kec.id} value={kec.name}>
        {kec.name}
      </Option>
    ))
  ) : (
    <Option disabled value="">
      Tidak ada data kecamatan
    </Option>
  )
}
          
          </Select>
        </FormControl>
        <FormControl sx={{ marginBottom: '10px' }}>
          <FormLabel>Kelurahan</FormLabel>
          <Select
            placeholder='Pilih Kelurahan'
                    value={isEdit ? selectAddress.kelurahan : newAddress.kelurahan}
                    
            name='kelurahan'
              onChange={(e, newValue) => {
      // Misalkan Anda ingin menambahkan id provinsi yang dipilih
      const selectedKelurahan = kelurahan.find(kel => kel.name === newValue);
      handleInputChange({
        target: {
          name: 'kelurahan',
          value: newValue,
          id: selectedKelurahan ? selectedKelurahan.id : null, // Menambahkan id provinsi
          type: 'kelurahan', // Menambahkan tipe
        }
      });
    }}
            required
          >
            {kelurahan.map(kel => (
              <Option key={kel.id} value={kel.name}>
                {kel.name}
              </Option>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
    <Button type='submit' variant='solid' color='success'>
      Simpan Alamat
    </Button>
    <Button
              onClick={() => {
                setIsAddAddress(false)
                setIsEdit(false)
              }   
              } 
      variant='outlined'
      style={{ marginLeft: '10px' }}
    >
      Batal
    </Button>
  </form>
) : (
          <AccordionGroup
            color='neutral'
            variant='outlined'
            sx={theme => ({
              [`& .${accordionClasses.root}`]: {
                marginTop: '0.5rem',
                transition: '0.2s ease',
                '& button:not([aria-expanded="true"])': {
                  transition: '0.2s ease',
                  paddingBottom: '0.625rem'
                },
                '& button:hover': {
                  background: 'transparent'
                }
              },
              [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
                bgcolor: 'background.level1',
                borderRadius: 'md',
                borderBottom: '1px solid',
                borderColor: 'background.level2'
              },
              '& [aria-expanded="true"]': {
                boxShadow: `inset 0 -1px 0 ${theme.vars.palette.divider}`
              }
            })}
          >
            {addressList.map((address, index) => (
              <Accordion key={index}>
                <AccordionSummary
                  // expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${index}-content`}
                  id={`panel-${index}-header`}
                >
                  <Typography level='title-sm'>
                    {address.nama} 
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography level='body-xs'>
                    Detail Alamat: {address.detail}
                  </Typography>
                  <Typography level='body-xs'>
                    Provinsi: {address.provinsi}
                  </Typography>
                  <Typography level='body-xs'>
                    Kabupaten: {address.kabupaten}
                  </Typography>
                  <Typography level='body-xs'>
                    Kecamatan: {address.kecamatan}
                  </Typography>
                  <Box
                    display={'flex'}
                    justifyContent={'end'}
                    alignContent={'flex-end'}
                  >
                    <Box>
                      <Tooltip title='Delete'>
                        <IconButton
                          onClick={() => chooseAddress(address, 'delete')}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Edit'>
                        <IconButton
                          onClick={() => chooseAddress(address, 'edit')}
                        >
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionGroup>
        )}
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog variant='outlined' role='alertdialog'>
            <DialogTitle>
              <WarningRoundedIcon />
              Confirmation
            </DialogTitle>
            <Divider />
            <DialogContent>Yakin menghapus alamat ini?</DialogContent>
            <DialogActions>
              <Button
                variant='solid'
                color='danger'
                onClick={() => deleteAddress(selectAddress._id)}
              >
                Hapus Alamat
              </Button>
              <Button
                variant='plain'
                color='neutral'
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
            </DialogActions>
          </ModalDialog>
        </Modal>

        {/* SNACKBAR */}
      
      </Box>
    )
  }

  const Logout = () => {
    return (
       <Box
        margin={'0 10px'}
        sx={{ backgroundColor: 'neutral.50' }}
      >
        <Typography level='body-md'>Yakin Mau Logout?</Typography>
        <Button onClick={handleLogout}  variant='solid' color='neutral' sx={{marginY : '10px'}}>Logout</Button>
      </Box>
    )
  }
  const [list, setList] = useState([
    { name: 'Profil', component: <Profil /> },
    { name: 'Pemesanan', component: <Pemesanan /> },
    { name: 'Alamat', component: <Alamat /> },
    { name: 'Logout', component: <Logout /> }
  ]) // Empty dependency array means this will only be created once

  const [activeList, setActiveList] = useState('Profil') // State to track the active item
  const [activeComponent, setActiveComponent] = useState(<Profil />)
  const handleChange = item => {
    setActiveList(item.name)
    setActiveComponent(item.component)
  }

  // Memoize the Menu component
  const Menu = () => {
    switch (activeList) {
      case 'Profil':
        return <Profil />
      case 'Pemesanan':
        return <Pemesanan />
      case 'Alamat':
        return <Alamat />
      case 'Logout':
        return <Logout />
      default:
        return null
    }
  }

  return (
    <div>
        <TopBar
        totalCartItems={totalCartItem}
        setTotalCartItems={setTotalCartItems}
        isLogin={isLogin}
      />
      <Box
        border={1}
        borderColor={'darkgray'}
        borderRadius={'3px'}
        marginTop={'80px'}
        width={'80%'}
        marginX={'auto'}
      >
        <Box
          borderBottom={1}
          borderColor={'darkgray'}
          width={'100%'}
          padding={'5px'}
          sx={{
            backgroundColor: '#eee'
          }}
        >
          <Typography>Account</Typography>
        </Box>
        <Box display={'flex'} width={'100%'} padding={'10px'}>
          <Box
            width={'30%'}
            maxHeight={'auto'}
            display={'flex'}
            flexDirection={'column'}
          >
            <List component='nav' sx={{ padding: 0 }}>
              {list.map((item, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleChange(item)} // Set active item on click
                  sx={{
                    backgroundColor:
                      activeList === item.name ? '#708090' : '#eee', // Change background if active
                    color: activeList === item.name ? 'white' : 'black', // Change text color if active
                    borderBottom: '1px solid #ccc' // Border between items
                  }}
                >
                  <p>{item.name}</p>
                </ListItemButton>
              ))}
            </List>
          </Box>
          <Box width={'70%'}>
            <Menu />
            {/* {
                list.map((item, index) => (
                  <Box key={index} display={activeList === item.name ? 'block' : 'none' }>
                    { item.component}
                            </Box>
                          ))
                        } */}

            {/* {activeComponent} */}
          </Box>
        </Box>
      </Box>
        <Snackbar
        open={showSnackBar}
        onClose={handleSnackbarClose}
        color='success'
        variant='solid'
        autoHideDuration={3000} // Closes automatically after 3 seconds
        message="Logout Sukses!" // Message to display
      > Logout Sukses! </Snackbar>

      <Modal open={modalOpen} onClose={() => {
        setModalOpen(false);
        setSelectedImage(null)
        }}  sx={{ display: 'flex', width : '100%', justifyContent: 'center', alignItems: 'center' }}>
        
       <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: 'md', p: 3, width : '60%', boxShadow: 'lg' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <Table aria-label='basic table'>
          <tbody>
            <tr>
              <td>Status Pembayaran</td>
                 <td>
  {selectedOrder
    ? selectedOrder.payment_status === "waiting_payment"
      ? "Menunggu Pembayaran"
      : "Sudah Dibayar"
    : ""}
</td>
            </tr>
            <tr>
              <td>Total Bayar</td>
                  <td>{ selectedOrder ? selectedOrder.totals : ''}</td>
                </tr>
                <tr>
                  <td>Bukti Bayar</td>
                   <td>
  {selectedOrder ? (
    selectedOrder.uploadBukti === "default" ? (
      <div>
        {/* Jika `selectedOrder.uploadBukti` adalah default */}
        {selectedImage && (
          <div>
            <img
              src={selectedImage}
              alt="Preview"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            />
          </div>
        )}
        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          variant="outlined"
          color="neutral"
          startDecorator={
            <SvgIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
            </SvgIcon>
          }
        >
          Upload Bukti
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        <Button
          variant="solid"
          color="primary"
          onClick={handleUpload}
          style={{ marginTop: "10px" }}
        >
          Kirim Bukti
        </Button>
      </div>
    ) : (
      <div>
        {/* Jika `selectedOrder.uploadBukti` sudah ada */}
        <div>
          <img
            src={
              selectedImage
                ? selectedImage
                : `${baseUrl}/images/invoices/${selectedOrder.uploadBukti}`
            }
            alt="Uploaded Bukti"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          />
        </div>
        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          variant="outlined"
          color="neutral"
          startDecorator={
            <SvgIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
            </SvgIcon>
          }
        >
          Ubah Bukti
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        <Button
          variant="solid"
          color="primary"
          onClick={handleUpload}
          style={{ marginTop: "10px" }}
        >
          Simpan Perubahan
        </Button>
      </div>
    )
  ) : (
    ""
  )}
</td>

                </tr>
          </tbody>
        </Table>
          </Box>
    <ModalClose onClick={() => setSelectedImage(null)} />
      
   
         </Sheet>
        
      </Modal>
         <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        color={snackbarColor}
        variant='solid'
        autoHideDuration={3000} // Closes automatically after 3 seconds
        message={ snackbarMessage} // Message to display
      > { snackbarMessage} </Snackbar>
    </div>
  )
}

export default Profile
