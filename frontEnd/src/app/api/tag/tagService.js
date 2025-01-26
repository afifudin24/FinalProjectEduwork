import baseUrl from '../BaseUrl';
import axios from 'axios';

const tagService = {
  getTags: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/tag`);
      return response;
    } catch (err) {
      return err.response;
    }
  },
};

export default tagService;
