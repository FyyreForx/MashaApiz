const axios = require('axios');
const jimp = require('jimp')
const fetch = require('node-fetch');
const { translate } = require('bing-translate-api')
const { fromBuffer } = require('file-type')
const FormData = require('form-data')
const PDFDocument = require('pdfkit');
const sharp = require('sharp');

class Function {
   
   toDate = async(ms) => {
    const date = new Date(ms);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
    formatSize = (size) => {
        const i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }
   
    ucword = (str) => {
      str.charAt(0).toUpperCase() + str.slice(1)
      }
   
   
    toTime = (ms) => {
        const seconds = ms / 1000;
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    }

    random = (list) => {
    return list[Math.floor(Math.random() * list.length)]
}
     extractNumber = async(url) => {
    const match = url.match(/\/(\d+)/);
    return match ? match[1] : null;
}

    fetchBuffer = async(file, options = {}) => {
    const bufet = await (await axios.get(file, {
            responseType: "arraybuffer",
            headers: options
        }))
        .data
    return bufet;
}
   bufferlah = async(hm) => {
    const imageUrl = hm;
    const imagePath = 'gambar.jpg';
    const response = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(response.data, 'binary');
    return buffer;
}
     reSize = async(buffer) => {
    var oyy = await jimp.read(buffer);
    var kiyomasa = await oyy.resize(512, 512).getBufferAsync(jimp.MIME_JPEG)
    return kiyomasa
}
    
    fetchJson = async(url, options = {}) => {
    const result = await (await fetch(url, {
            headers: options
        }))
        .json()
    return result;
}

     gptTR = async(text, tar) => {
    return translate(text, null, tar)
    }
   
     toPDF = async (imageUrls) => {
    const pdfDoc = new PDFDocument({ margin: 0, autoFirstPage: false });
    const buffers = [];

    return new Promise((resolve, reject) => {
        pdfDoc.on('data', (chunk) => buffers.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(buffers)));
        pdfDoc.on('error', (err) => reject(err));

        (async () => {
            try {
                const processImage = async (imageUrl) => {
                    const response = await axios({
                        method: 'get',
                        url: imageUrl,
                        responseType: 'arraybuffer',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/91.0.4472.124 Safari/537.36',
                            'Referer': 'https://nhentai.to/',
                        }
                    });

                    const imageBuffer = Buffer.from(response.data, 'binary');
                    const jpgBuffer = await sharp(imageBuffer).jpeg().toBuffer();
                    const imageMetadata = await sharp(jpgBuffer).metadata();

                    pdfDoc.addPage({ size: [imageMetadata.width, imageMetadata.height] });
                    pdfDoc.image(jpgBuffer, 0, 0, { width: imageMetadata.width, height: imageMetadata.height });
                };

                await Promise.all(imageUrls.map(processImage));
                pdfDoc.end();
            } catch (error) {
                console.error(`Error processing images: ${error.message}`);
                pdfDoc.emit('error', error);
            }
        })();
    });
};
   
   uploadFile = async(img) => {
    const { ext } = await fromBuffer(img)
    const form = new FormData();
    try {
    form.append('file', img, {
      filename: `file.${ext}`,
      contentType: 'image/jpeg',
    });

    const response = await axios.post('https://s4.kenshinaru.my.id/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    return response.data
  } catch (error) {
    console.error('Error uploading file:', error);
  }
 }
}

module.exports = Function