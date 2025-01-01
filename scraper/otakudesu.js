const { otakudesu } = require("@xct007/frieren-scraper") 
const { komikuId } = require("@xct007/frieren-scraper")
const axios = require("axios")

exports.otakudesuDetail = async (url) => {
 let result = await otakudesu.detail(url)
return result 
}

exports.otakudesuSearch = async (text) => {
let res = await axios.get(`https://otakudesu-unofficial-api.rzkfyn.xyz/v1/search/${text}`)
return res.data.data
}

exports.otakudesuLatest = async () => {
let res = await axios.get("https://otakudesu-unofficial-api.rzkfyn.xyz/v1/ongoing-anime")
return res.data.data
}

// Komiku
exports.komikuSearch = async (query) => {
    try {
        const response = await axios.get(`https://api.komiku.id/?post_type=manga&s=${query}`);
        const data = response.data;

        const $ = cheerio.load(data);
        const mangas = [];

        $('.bge').each((index, element) => {
            const title = $(element).find('h3').text().trim();
            const relativeLink = $(element).find('a').attr('href');
            const genre = $(element).find('.tpe1_inf b').text().trim();
            const latestChapter = $(element).find('.new1').last().find('span').last().text().trim();
            const fullLink = `https://komiku.id${relativeLink}`;

            mangas.push({
                title,
                link: fullLink,
                genre,
                latestChapter,
            });
        });

        return mangas;
    } catch (error) {
        console.error('Error scraping manga:', error);
        return [];
    }
}

exports.komikuDetail = async (url) => {
 let result = await komikuId.detail(url)
return result 
}

exports.komikuEps = async (url) => {
 let result = await komikuId.detail(url)
return result 
}

exports.komikuLatest = async () => {
 let result = await komikuId.latest()
return result 
}
