import baseUrl from '../BaseUrl';
import axios from 'axios';

const cartService = {
  getCart: async () => {
    const token = localStorage.getItem('token'); // Ganti 'token' dengan nama kunci yang sesuai jika berbeda
    // Buat header Authorization
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.get(`${baseUrl}/api/carts`, config);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  addCart: async (data) => {
    const token = localStorage.getItem('token'); // Ganti 'token' dengan nama kunci yang sesuai jika berbeda
    // Buat header Authorization
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.post(`${baseUrl}/api/carts`, data, config);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  updateCart: async (data) => {
    const token = localStorage.getItem('token'); // Ganti 'token' dengan nama kunci yang sesuai jika berbeda
    // Buat header Authorization
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.put(`${baseUrl}/api/carts`, data, config);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  deleteCart: async (productId) => {
    console.log(productId);
    const token = localStorage.getItem('token'); // Ganti 'token' dengan nama kunci yang sesuai jika berbeda
    // Buat header Authorization
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.delete(
        `${baseUrl}/api/carts/${productId}`,
        config,
      );
      return response;
    } catch (err) {
      return err.response;
    }
  },
};

export default cartService;
