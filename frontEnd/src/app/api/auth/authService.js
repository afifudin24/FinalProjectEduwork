import axios from 'axios';
import baseUrl from '../BaseUrl';

const authService = {
  login: async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, data);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  register: async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/register`, data);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  checkMe: async () => {
    try {
      const token = localStorage.getItem('token'); // Ganti 'token' dengan nama kunci yang sesuai jika berbeda
      // Buat header Authorization
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Tambahkan token ke header
        },
      };
      const response = await axios.get(`${baseUrl}/auth/me`, config);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Tambahkan token ke header
        },
      };
      const response = await axios.post(`${baseUrl}/auth/logout`, {}, config);
      return response;
    } catch (err) {
      return err.response;
    }
  },
};

export default authService;
