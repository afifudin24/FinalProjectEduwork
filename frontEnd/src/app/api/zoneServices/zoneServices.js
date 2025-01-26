const url = `https://www.emsifa.com/api-wilayah-indonesia/api/`;

const ZoneServices = {
  getProvinces: async () => {
    try {
      const response = await fetch(`${url}/provinces.json`);
      // const data = await response.json();
      return response.json();
    } catch (err) {
      return err;
    }
  },
  getCountry: async (id) => {
    try {
      const response = await fetch(`${url}/regencies/${id}.json`);
      const data = await response.json();
      return data;
    } catch (err) {
      return err;
    }
  },
  getDistrict: async (id) => {
    try {
      const response = await fetch(`${url}/districts/${id}.json`);
      const data = await response.json();
      return data;
    } catch (err) {
      return err;
    }
  },
  getVillages: async (id) => {
    try {
      const response = await fetch(`${url}/villages/${id}.json`);
      const data = await response.json();
      return data;
    } catch (err) {
      return err;
    }
  },
};

export default ZoneServices;
