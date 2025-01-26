import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar";
import { Sheet, Box, Modal, ModalDialog, Button, Snackbar, FormControl, Input, FormLabel, Typography, ModalClose } from "@mui/joy";
import TagList from "../components/TagList/TagList";
import Pagination from "../components/Pagination/Pagination";
import ListProduct from "../components/CardProduct/ListProduct";
import authController from "../app/api/auth/authController";
import { useNavigate } from "react-router";
import TopBar from "../components/TopBar/TopBar";
import productService from "../app/api/product/productService";
import tagService from "../app/api/tag/tagService";
import categoryService from "../app/api/category/categoryService";
import cartService from "../app/api/cart/cartService";
import baseUrl from "../app/api/BaseUrl";

const Home = () => {
  const [isLogin, setIsLogin] = useState(false);
 
  const location = useLocation();
   const navigate = useNavigate();
  const [userData, setUser] = useState(null);
  const [error, setError] = useState(null);
   const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State for dynamic Snackbar message
  const [snackbarColor, setSnackbarColor] = useState(''); // State for dynamic Snackbar message
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close Snackbar
  };

  const handleAddToCart = async () => {
    if (quantity > 0 && productSelected) {
      // onAddToCart(productSelected, quantity);
      const dataCart = {
        productId: productSelected._id,
        qty : quantity
      }
      try {
        const response = await cartService.addCart(dataCart);
        console.log('tambahcart', response);
        if (response.data.error === 0) {
          setSnackbarOpen(true);
          setSnackbarMessage('Product added to cart successfully');
          setSnackbarColor('success');
          if (!response.data.qtyUpdate) {
            setCartCount(cartCount + 1);
          }
          setQuantity(1);
          setTotalPrice(0);
          setModalOpen(false);
        } else {
          setSnackbarColor('danger');
          setSnackbarMessage('Failed to add product to cart');
          setSnackbarOpen(true);
        }
      } catch (err) {
        console.log(err)
      }
    }
  };
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
  
  const getProduct = async (query) => {
    try {
      const response = await productService.getAllProduct(query);
      console.log(response)
      if (response) {
        setProduct(response.data.data);
        setTotalProducts(response.data.count);
        setLoading(false);
      }
  
    } catch (err) {
      console.log(err);
    }
  }
  const getTags = async () => {
    try {
      console.log("laa")
      const response = await tagService.getTags();
      console.log('tag', response.data);
      setTags(response.data);
    } catch (err) {
      console.log(err)
    }
  }
  const getCategory = async () => {
    try {
      const response = await categoryService.getCategory();
      console.log('category', response);
      setCategoryList(response.data)
    } catch (err) {
      console.log(err);
    }
  }
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
    getTags();
  const urlParams = window.location.search;
    getProduct(urlParams); 
    getCategory();
    getCart();
  }, [])
  const [currentPage, setCurrentPage] = useState(1);
  const [tags, setTags] = useState([]);
  const [chooseTags, setChooseTags] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [chooseKategori, setChooseKategori] = useState('category');
  const [searchValue, setSearchValue] = useState("");
  const [totalCartItems, setTotalCartItems] = useState(10);
  const [product, setProduct] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productSelected, setProductSelected] = useState(null);

  const itemsPerPage = 10;
   const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const [showProduct, setShowProduct] = useState([]);
  useEffect(() => {
    console.log(product)
    setShowProduct(product);
  }, [product]);


  const handleSearch = () => {
    // search(chooseKategori, searchValue);
    // const urlParams = new URLSearchParams(window.location.search);
    const urlParams = window.location.search;
    getProduct(urlParams);
  };

 const handleEditSearch = (e) => {
   console.log(e);
   setSearchValue(e.value);
// Construct the new query string
   const query = new URLSearchParams(location.search);
   if (e === '') {
    query.delete('q');
  } else {
    query.set('q', e); // Set 'q' jika ada nilai pencarian
  }

    // Update the URL query parameter
    navigate(`${location.pathname}?${query.toString()}`);
  }

  useEffect(() => {
    const query = new URLSearchParams(location.search);

    // Menghapus parameter 'tags[]' sebelumnya, agar tidak ada duplikat
    query.delete('tags[]');

    // Menambahkan parameter 'tags[]' baru (misalnya array dari tags)
    chooseTags.forEach(tag => {
        query.append('tags[]', tag.name); // Menggunakan append untuk menambahkan nilai array
    });

    // Update URL query parameter menggunakan navigate
    navigate(`${location.pathname}?${query.toString()}`);
  }, [chooseTags]);
   useEffect(() => {
        // Ambil semua nilai 'tags[]' dari query string di URL
        const query = new URLSearchParams(location.search);
        const tagsFromQuery = query.getAll('tags[]'); // Mendapatkan array dari query

        // Hapus tag yang tidak ada di query string dari chooseTags
        setChooseTags((prevTags) => {
            return prevTags.filter(tag => tagsFromQuery.includes(tag.name));
        });

    }, [location.search]); // Menjalankan useEffect setiap kali location.search berubah

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    console.log(chooseKategori);
    // Menghapus parameter 'tags[]' sebelumnya, agar tidak ada duplikat
    if (chooseKategori === 'category') {
      query.delete('category');
    } else {
      query.set('category', chooseKategori); // Set 'q' jika ada nilai pencarian
    }
    
    // Update URL query parameter menggunakan navigate
    navigate(`${location.pathname}?${query.toString()}`);
  }, [chooseKategori]);

  useEffect(() => {
     const query = new URLSearchParams(location.search);
     const skip = (currentPage - 1) * itemsPerPage;
    if (currentPage !== 1) {
      query.set('skip', skip);
      query.set('limit', itemsPerPage);
    } else {
        query.delete('skip');
      query.delete('limit');
    }
    navigate(`${location.pathname}?${query.toString()}`);
   const urlParams = window.location.search;
    console.log('url', urlParams);
    getProduct(urlParams);
  }, [currentPage])
  const handleSetCurrentPage = (currentPage) => {
    setCurrentPage(currentPage);
  }
   const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

  const modalCartOpen = (selectProduct) => {
    const productSelect = {
      ...selectProduct,
      totalPrice : selectProduct.price
    }
    setProductSelected(productSelect);
    console.log('ini', selectProduct);
    setModalOpen(true);
  }
  
  const closeModal = () => {
    setProductSelected(null);
    setModalOpen(false);
  }
  
  useEffect(() => {
  if (productSelected) {
    setProductSelected((prev) => ({
      ...prev,
      totalPrice: (prev.price || 0) * (quantity || 1), // Tambahkan fallback untuk mencegah undefined
    }));
  }
}, [quantity]);
 
  return (
    <>    
      <TopBar isLogin={isLogin} totalCartItems={cartCount}/>
    <Sheet sx={{ width: '90%', overflowY: 'hidden', height: '100vh', margin: '0 auto' }}>
      <SearchBar 
          handleSearch={handleSearch} 
          handleEditSearch={handleEditSearch}
        chooseKategori={chooseKategori} 
          setChooseKategori={setChooseKategori} 
          categoryList={categoryList}
        searchValue={searchValue} 
        setSearchValue={setSearchValue} 
      />
      <Box display={'flex'} gap={1} margin={'10px 0'}>
        <h5 style={{ display: 'inline-block' }}>Tags :</h5>
        <TagList tags={tags} setTags={setTags} chooseTags={chooseTags} setChooseTags={setChooseTags} />
      </Box>
      <Box 
        sx={{
          '&::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }} 
        paddingBottom={'20px'} 
        width={'100%'} 
        overflow={'scroll'} 
        height={'80vh'} 
        margin={'10px 0'}
      >
        <ListProduct 
          totalCartItems={totalCartItems} 
          setTotalCartItems={setTotalCartItems} 
          isLoading={loading} 
          product={showProduct} 
            setProduct={setShowProduct} 
            modalCartOpen={modalCartOpen}
        />
      </Box>
      <Box 
        sx={{
          textAlign: 'center',
          width: '100%',
          padding: '10px 0',
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          zIndex: '100',
          margin: '0 auto',
          backgroundColor: 'lightseagreen'
        }} 
      >
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      </Box>
      </Sheet>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}  sx={{ display: 'flex', width : '100%', justifyContent: 'center', alignItems: 'center' }}>
        
       <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: 'md', p: 3, width : '60%', boxShadow: 'lg' }}
        >
    <ModalClose />
          <Typography component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: 'lg', mb: 1 }}>Add To Cart</Typography>
          { 
            productSelected ? (
              <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Responsif
        gap: 4,
        alignItems: 'center',
      }}
    >
      {/* Bagian Kiri: Deskripsi dan Gambar Produk */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{ marginY: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}
          id="modal-desc"
        >
          {productSelected.name}
        </Typography>
        <img
          style={{ width: '200px', height: '200px', objectFit: 'cover' }}
          src={`${baseUrl}/images/products/${productSelected.image_url}`}
          loading="lazy"
          alt={productSelected.name}
        />
      </Box>

      {/* Bagian Kanan: Input Jumlah, Harga, dan Tombol */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
          Harga: Rp {productSelected.price.toLocaleString()}
        </Typography>

        {/* Input Jumlah Beli */}
        <FormControl sx={{ width: '100px' }}>
          <FormLabel htmlFor="jumlah-beli">Jumlah</FormLabel>
          <Input
            id="jumlah-beli"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} // Minimal 1
          />
        </FormControl>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Total : Rp. { productSelected.totalPrice.toLocaleString()}
         </Typography>
        {/* Tombol Add to Cart */}
        <Button
          variant="solid"
          color="success"
          onClick={handleAddToCart}
          sx={{ marginTop: '10px' }}
        >
          Add to Cart
        </Button>
      </Box>
    </Box>
              
            ): (
                <p>OK</p>
            )
          }
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
      </>

  );
};

export default Home;