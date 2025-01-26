import baseUrl from '../BaseUrl';
import axios from 'axios';
const url = `${baseUrl}/api/invoices`;
const InvoiceService = {
  getInvoice: async (orderId) => {
    const token = localStorage.getItem('token'); // Ganti 'token' dengan nama kunci yang sesuai jika berbeda
    // Buat header Authorization
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.get(`${url}/${orderId}`, config);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  updateInvoice: async (orderId, data) => {
    const token = localStorage.getItem('token'); // Ganti 'token' dengan nama kunci yang sesuai jika berbeda
    // Buat header Authorization
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Tambahkan token ke header
      },
    };
    try {
      const response = await axios.put(`${url}/${orderId}`, data, config);
      return response;
    } catch (err) {
      return err.response;
    }
  },
};

export default InvoiceService;
