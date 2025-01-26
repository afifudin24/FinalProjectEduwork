// authController.js
import authService from './authService';

const authController = {
  login: async (data) => {
    try {
      const response = await authService.login(data);
      if (response.status === 200) {
        // Jika login berhasil, Anda bisa mengembalikan data pengguna atau token
        return response.data; // Misalnya, ini bisa berisi token dan informasi pengguna
      } else {
        // Jika ada kesalahan, kembalikan response error
        return null; // Atau bisa juga mengembalikan response.data
      }
    } catch (err) {
      console.error(err); // Log kesalahan untuk debugging
      return null; // Atau bisa juga mengembalikan err.response.data
    }
  },
  register: async (data) => {
    try {
      const response = await authService.register(data);
      if (response.status === 200) {
        // Jika registrasi berhasil, Anda bisa mengembalikan data pengguna atau token
        return response.data; // Misalnya, ini bisa berisi token dan informasi pengguna
      } else {
        return null;
      }
    } catch (err) {
      console.error(err); // Log kesalahan untuk debugging
      return null; // Atau bisa juga mengembalikan err.response.data
    }
  },
  checkMe: async () => {
    try {
      const response = await authService.checkMe();
      return response;
    } catch (err) {
      return null;
    }
  },
};

export default authController;
