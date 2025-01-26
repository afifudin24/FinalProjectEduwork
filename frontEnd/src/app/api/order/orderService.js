import baseUrl from '../BaseUrl';
import axios from 'axios';

const orderService = {
  postOrder: async (data) => {
    const token = localStorage.getItem('token'); // Ganti 'token' dengan nama kunci yang sesuai jika berbeda
    // Buat header Authorization
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.post(`${baseUrl}/api/orders`, data, config);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  getOrder: async () => {
    const token = localStorage.getItem('token'); // Ganti 'token' dengan nama kunci yang sesuai jika berbeda
    // Buat header Authorization
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.get(`${baseUrl}/api/orders`, config);
      return response;
    } catch (err) {
      return err.response;
    }
  },
};

export default orderService;
