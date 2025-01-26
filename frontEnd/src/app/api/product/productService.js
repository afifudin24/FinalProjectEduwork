import baseUrl from '../BaseUrl';
import axios from 'axios';
const productService = {
  getAllProduct: async (query) => {
    console.log('kueri', query);
    try {
      const response = await axios.get(`${baseUrl}/api/products${query}`);
      console.log(response);
      return response;
    } catch (err) {}
  },
  
};

export default productService;
