/* eslint-disable prettier/prettier */
import axios from 'axios';
const baseUrl = `http://127.0.0.1:8000`;

const apiServices = {
  login: async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/adminlogin`, data);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  register: async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/api/register`, data);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  checkMe: async () => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);

      // Access the token from the parsed object
      const token = parsedData.token;

      const response = await axios.get(`${baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  getCategories: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/categories`);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  countCategories: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/countCategories`);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  postCategory: async (data) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.post(`${baseUrl}/api/categories`, data, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  updateCategory: async (id, data) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);

      // Access the token from the parsed object
      const token = parsedData.token;
      const response = await axios.put(`${baseUrl}/api/categories/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  deleteCategory: async (id) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.delete(`${baseUrl}/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  getTags: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/tag`);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  updateTags: async (id, data) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.put(`${baseUrl}/api/tag/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  getProducts: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/products`);
      return response;
    } catch (err) {
      return err.response;
    }
  },

  postProduct: async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/api/products`, data);
      return response;
    } catch (err) {
      return err.response;
    }
  },

  updateProduct: async (id, data) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.put(`${baseUrl}/api/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },

  deleteProduct: async (id) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.delete(`${baseUrl}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  getOrders: async () => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.get(`${baseUrl}/api/getAllOrder`, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },

  postOrder: async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/api/order`, data);
      return response;
    } catch (err) {
      return err.response;
    }
  },

  updateOrder: async (id, data) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.put(`${baseUrl}/api/order/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },

  updateInvoice: async (id, data) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.put(`${baseUrl}/api/invoices/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/api/order/${id}`);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  getCountAll: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/countAll`);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  getDeliveryPrice: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/delivery-price`);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  postDeliveryPrice: async (data) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.post(`${baseUrl}/api/delivery-price`, data, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  updateDeliveryPrice: async (id, data) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.put(`${baseUrl}/api/delivery-price/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  deleteDeliveryPrice: async (id) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.delete(`${baseUrl}/api/delivery-price/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  getUsers: async () => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.get(`${baseUrl}/api/getUsers`, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  postUser: async (data) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.post(`${baseUrl}/api/adduser`, data, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  deleteUser: async (id) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Adjust the key if necessary
      // Parse the JSON string to an object
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const response = await axios.delete(`${baseUrl}/api/deleteUser/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header
        }
      });
      return response;
    } catch (err) {
      return err.response;
    }
  },
  getReport: async (query) => {
    try {
      const storedData = localStorage.getItem('dataLogin'); // Ambil data login dari localStorage
      // Parse JSON string menjadi objek
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;

      // Buat URL dasar
      const url = `${baseUrl}/api/getReportOrder`;

      // Kirim permintaan GET dengan query jika ada
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}` // Set header Authorization
        },
        params: query || '' // Jika query ada, Axios akan menambahkannya ke URL
      });

      return response;
    } catch (err) {
      return err.response;
    }
  }
};

export default apiServices;
