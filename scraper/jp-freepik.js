const axios = require('axios');
const cheerio = require('cheerio');

exports.freepik = async (q) => {
    try {
        const url = `https://jp.freepik.com/photos/${q}`;
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const scriptJSON = $('script[type="application/ld+json"]').html();
        const json_data = JSON.parse(scriptJSON);

        if (!json_data) {
            console.log("Gagal menemukan data JSON di halaman");
            return null;
        }

      
        const image_info = json_data['@graph'][0]['mainEntity']['itemListElement']
            .filter(item => item['@type'] === 'ImageObject')
            .map(item => ({
                name: item.name,
                imageUrl: item.contentUrl,
                datePublished: new Date(item.datePublished).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                encodingFormat: item.encodingFormat,
                license: item.license
            }));

        return image_info;
    } catch (error) {
        console.log(`Gagal mengakses halaman: ${error}`);
        return null;
    }
}