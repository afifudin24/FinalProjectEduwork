import baseUrl from '../BaseUrl';
import axios from 'axios';

const categoryService = {
  getCategory: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/categories`);
      return response;
    } catch (err) {
      console.log(err);
    }
  },
};

export default categoryService;
