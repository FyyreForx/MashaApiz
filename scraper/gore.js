const cheerio = require('cheerio')
const axios = require('axios')


async function searchgore(query) {
  return new Promise(async (resolve, reject) => {
    axios.get('https://seegore.com/?s=' + query).then(dataa => {
      const $$$ = cheerio.load(dataa)
      let pagina = $$$(
        '#main > div.container.main-container > div > div.bb-col.col-content > div > div > div > div > nav > ul > li:nth-child(4) > a'
        ).text();
      let slink = 'https://seegore.com/?s=' + query
      axios.get(slink).then(({
        data
      }) => {
        const $ = cheerio.load(data)
        const link = [];
        const judul = [];
        const uploader = [];
        const format = [];
        const thumb = [];
        $('#post-items > li > article > div.content > header > h2 > a').each(function(a, b) {
          link.push($(b).attr('href'))
        })
        $('#post-items > li > article > div.content > header > h2 > a').each(function(c, d) {
          let jud = $(d).text();
          judul.push(jud)
        })
        $('#post-items > li > article > div.content > header > div > div.bb-cat-links > a').each(
          function(e, f) {
            let upl = $(f).text();
            uploader.push(upl)
          })
        $('#post-items > li > article > div.post-thumbnail > a > div > img').each(function(g, h) {
          thumb.push($(h).attr('src'))
        })
        for (let i = 0; i < link.length; i++) {
          format.push({
            judul: judul[i],
            uploader: uploader[i],
            thumb: thumb[i],
            link: link[i]
          })
        }
        resolve(format)
      }).catch(reject)
    })
  })
}
/* New Line */
async function randomgore() {
  return new Promise(async (resolve, reject) => {
    let randvid = Math.floor(Math.random() * 218) + 1
    let slink = 'https://seegore.com/gore/'
    axios.get(slink).then(({
      data
    }) => {
      const $ = cheerio.load(data)
      const link = [];
      const result = [];
      const username = [];
      const linkp = $(`#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a`).attr(
        'href')
      const thumbb = $(
        `#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a > div > img`).attr(
        'src')
      axios.get(linkp).then(({
        data
      }) => {
        const $$ = cheerio.load(data)
        const format = {
          judul: $$(
            'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1'
            ).text(),
          views: $$(
            'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count'
            ).text(),
          comment: $$(
            'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count'
            ).text() === '' ? 'Tidak ada komentar' : $$(
            'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count'
            ).text(),
          thumb: thumbb,
          link: $$('video > source').attr('src')
        }
        resolve(format)
      }).catch(reject)
    })
  })
}

async function goredl(link) {
  return new Promise(async (resolve, reject) => {
    axios.get(link).then(({
      data
    }) => {
      const $$ = cheerio.load(data)
      const format = {
        judul: $$(
          'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1'
          ).text(),
        views: $$(
          'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count'
          ).text(),
        comment: $$(
          'div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count'
          ).text(),
        link: $$('video > source').attr('src')
      }
      resolve(format)
    }).catch(reject)
  })
}

module.exports = { searchgore, goredl, randomgore }