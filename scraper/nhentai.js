const axios = require('axios')
const cheerio = require('cheerio')
let no = '1'


exports.nsearch = async(query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://nhentai.to/search?q=${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const hasil = [];
                $('body > div.container.index-container > div').each(function(a, b) {
                    result = {
                        index: `${no++}`,
                        link: 'https://nhentai.to' + $(b).find('> a').attr('href'),
                        thumb: $(b).find('> a > img:nth-child(2)').attr('src'),
                        title: $(b).find('> a > div').text()
                    }
                    hasil.push(result)
                })
                resolve(hasil)
            })
            .catch(reject)
    })
}

exports.nhgetimg = async(url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const Result = [];
    const id = $('#gallery_id > span').text()
    const title = $('#info > h1').text()
    const alternative_title = $('#info > h2').text()
    const language = $('#tags > div:nth-child(5) > span > a > span.name').text()
    const Categories = $('#tags > div:nth-child(6) > span > a > span.name').text()
    const total_page = $('#tags > div:nth-child(7) > span > a > span').text()
    const upload = $('#tags > div:nth-child(8) > span > time').text()
    $('#thumbnail-container > div').each((i, e) => {
      const Link = $(e).find('a > img').attr('data-src')
      Result.push(Link);
    });
    return ({
      title: title,
      alternative_title: alternative_title,
      language: language,
      Categories: Categories,
      total_page: total_page,
      upload: upload,
      image: Result
    })
  } catch (error) {
    console.log(error)
    return (error.message)
  }
}