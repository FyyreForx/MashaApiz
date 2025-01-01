const axios = require('axios');


async function createImage(id, signature, background_text, color) {
  const createUrl = `https://taoanhdep.kaysil.dev/v1/wibu/create?id_nhanvat=${id}&chu_ky=${signature}&chu_nen=${background_text}&mau_nen=${color}`;

const image = await fetchBuffer(createUrl)
return image
  console.log('Gambar berhasil dibuat');
}

// Fungsi untuk mendapatkan list dari server
async function getList() {
  const listUrl = 'https://taoanhdep.kaysil.dev/v1/wibu/list';

  const response = await axios.get(listUrl, {
    headers: {
      'Accept': 'application/json'
    }
  });

  console.log('List dari server:');
  return response.data
}
async function fetchBuffer(file, options = {}) {
	const bufet = await (await axios.get(file, {
			responseType: "arraybuffer",
			headers: options
		}))
		.data
	return bufet;
}

// Panggil fungsi untuk membuat gambar baru dan mendapatkan list
module.exports = {
createImage,
getList,
}