import baseUrl from '../BaseUrl';
import axios from 'axios';

const deliveryAddressService = {
  getDeliveryAddress: async () => {
    const token = localStorage.getItem('token'); // Ganti 'token' dengan nama kunci yang sesuai jika berbeda
    // Buat header Authorization
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}/api/delivery-addresses`,
        config,
      );
      return response.data;
    } catch (err) {
      return err.response;
    }
  },
  insertDeliveryAddress: async (data) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}/api/delivery-addresses`,
        data,
        config,
      );
      return response.data;
    } catch (err) {
      return err.response;
    }
  },
  updateDeliveryAddress: async (id, data) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.put(
        `${baseUrl}/api/delivery-addresses/${id}`,
        data,
        config,
      );
      return response.data;
    } catch (err) {
      return err.response;
    }
  },
  deleteDeliveryAddress: async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.delete(
        `${baseUrl}/api/delivery-addresses/${id}`,
        config,
      );
      return response.data;
    } catch (err) {
      return err.response;
    }
  },
};

export default deliveryAddressService;
