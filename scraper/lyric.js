const fetch = require('node-fetch')
const cheerio = require('cheerio')
const BASE_URL = "https://api.genius.com";
const ACCESS_TOKEN = "5A3jmNtHiCmWSmKZYfoM_T5seFaHnZiTwzIxCsHJqF7JXauBIDLocGmo9wFFzLNX";


async function searchLyric(query) {
  try {
    const response = await fetch(`${BASE_URL}/search?access_token=${ACCESS_TOKEN}&q=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let result = await response.json();
    if (result.response.hits.length > 0) {
      return result.response.hits.map(hit => ({
        title: hit.result.title,
        url: hit.result.url,
        artist: hit.result.artist_names
      }));
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error during search:', error);
    return [];
  }
}

async function getLyrics(url) {
  const response = await fetch("https://files.xianqiao.wang/" + url)
  const html = await response.text()
  const $ = cheerio.load(html);
  let lyrics = '';
  $('div[class^="Lyrics__Container"]').each((i, elem) => {
    if ($(elem).text().length !== 0) {
      const snippet = $(elem).html().replace(/<br>/g, '\n').replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
      lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
    }
  });
  return lyrics;
}

module.exports = { searchLyric, getLyrics }