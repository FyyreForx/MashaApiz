const NekoBocc = require('nekobocc').default;
const nekobocc = new NekoBocc();

class Nekopoi {

  static async Search(query) {
    try {
      const response = await nekobocc.search(query);
      return response;
    } catch (error) {
      console.error(`Error in Search: ${error}`);
      throw error;
    }
  }
  
  static async Latest() {
    const page = "1";
    try {
      const response = await nekobocc.release(page);
      return response;
    } catch (error) {
      console.error(`Error in Latest: ${error}`);
      throw error;
    }
  }
  
  static async Get(url) {
    try {
      const response = await nekobocc.get(url);
      return response;
    } catch (error) {
      console.error(`Error in Get: ${error}`);
      throw error;
    }
  }
}


module.exports = Nekopoi;