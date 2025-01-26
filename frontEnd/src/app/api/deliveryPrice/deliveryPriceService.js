import baseUrl from '../BaseUrl';
import axios from 'axios';

const deliveryPriceService = {
  getDeliveryPrice: async (kabupaten) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/delivery-price/${kabupaten}`,
      );
      return response.data;
    } catch (err) {
      return err.response;
    }
  },
};

export default deliveryPriceService;
