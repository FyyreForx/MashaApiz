const axios = require('axios');
const cheerio = require('cheerio');

module.exports = class LK21 {
   baseUrl = 'https://tv.lk21official.mom'; // Updated to match the URL from the screenshot
   header = {
      headers: {
         'Accept': '*/*',
         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
         'Referer': this.baseUrl,
         'Referrer-Policy': 'strict-origin-when-cross-origin',
         'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.51 Mobile/15E148 Safari/604.1',
         'Cookie': '_clsk=16wfq8p|1719215314504|1|0|d.clarity.ms/collect; _clck=11dy5hq|2|fmw|0|1636; _ga=GA1.1.171921530412.1719215312; _ga_9R4J526=GS1.1.1719215312.1.0.1719215312.0.0.0'
      }
   };

   search = query => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get(this.baseUrl + '/search.php?s=' + query.replace(new RegExp('\s', 'g'), '+') + '#gsc.tab=0&gsc.q=marvel&gsc.page=1', this.header)).data;
            let $ = cheerio.load(html);
            let data = [];
            $('div.search-item').each((i, e) => {
               let p = [];
               $(e).find('p').each((x, y) => p.push($(y).text()));
               data.push({
                  thumbnail: `https://123.lk21official.mom${$(e).find('img').attr('src')}`,
                  title: $(e).find('h3').text().trim(),
                  tags: p[0],
                  directors: p.some(v => /Sutradara/i.test(v)) ? p.find(v => /Sutradara/i.test(v)).split('Sutradara:')[1].trim() : 'Unknown',
                  actors: p.some(v => /Bintang/i.test(v)) ? p.find(v => /Bintang/i.test(v)).split('Bintang:')[1].trim() : 'Unknown',
                  url: 'https://tv.lk21official.mom' + $(e).find('h3 > a').attr('href'),
               });
            });
            if (data.length == 0) return resolve({ creator: global.creator, status: false });
            resolve({ creator: global.creator, status: true, data });
         } catch (e) {
            console.log(e);
            resolve({ creator: global.creator, status: false });
         }
      });
   }

   setCookie = (cname, cvalue, exdays = 1) => {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 60 * 1000));
      let expires = "expires=" + d.toISOString();
      return cname + "=" + cvalue + ";" + expires + ";path=/";
   }

   extract = url => {
      return new Promise(async (resolve) => {
         try {
            const target = url.replace(new RegExp('.xyz', 'i'), '.xyz/get');
            const slug = url.split('/')[3];
            let html = await (await axios.get(target)).data;
            const cookie = this.setCookie('validate', (html.match(/validate['][,](.*?)[)]/)[1]).trim().replace(new RegExp('\'', 'g'), ''));
            let result = await (await axios.post('https://dl.lk21static.xyz/verifying.php?slug=' + slug, {
               slug
            }, { headers: { cookie }})).data;
            let data = [];
            let $ = cheerio.load(result);
            $('tr').each((i, e) => {
               data.push({ 
                  provider: $($(e).find('td')[0]).text(),
                  url: $(e).find('a').attr('href')
               });
            });
            data.shift();
            return resolve(data);     
         } catch (e) {
            console.log(e);
            resolve({
               creator: global.creator,
               status: false
            });
         }
      });
   }

   replacer = str => {
      return str
         .replace(new RegExp('Kualitas', 'g'), 'quality')
         .replace(new RegExp('Negara', 'g'), 'country')
         .replace(new RegExp('Bintang film', 'g'), 'actors')
         .replace(new RegExp('Sutradara', 'g'), 'director')
         .replace(new RegExp('Genre', 'g'), 'genre')
         .replace(new RegExp('IMDb', 'g'), 'imdb')
         .replace(new RegExp('Diterbitkan', 'g'), 'release')
         .replace(new RegExp('Penerjemah', 'g'), 'translator')
         .replace(new RegExp('Oleh', 'g'), 'author')
         .replace(new RegExp('Diunggah', 'g'), 'uploaded')
         .replace(new RegExp('Durasi', 'g'), 'duration')
         .replace(new RegExp('jam', 'g'), 'hours')
         .replace(new RegExp('menit', 'g'), 'minutes')
         .replace(new RegExp('detik', 'g'), 'seconds');
   }

   fetch = url => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get(url, this.header)).data;
            console.log(html);
            let $ = cheerio.load(html);
            let div = [],
               stream = [],
               data = [],
               object = {};
            $('div[class="col-xs-9 content"]').find('div').each((i, e) => div.push($(e).html()));
            let thumbnail = 'https:' + $('div.col-xs-3.content-poster img').attr('src');
            div.map(v => {
               let $ = cheerio.load(v);
               if (/IMDb/i.test(v)) {
                  let h3 = [];
                  $('h3').each((i, e) => h3.push($(e).text()));
                  object[this.replacer($('h2').text())] = h3[0];
               } else if (/Bintang/i.test(v)) {
                  let a = [];
                  $('h3').each((i, e) => a.push($(e).find('a').text()));
                  object[this.replacer($('h2').text())] = a.join(', ');
               } else {
                  object[this.replacer($('h2').text())] = this.replacer($('h3').text());
               }
            });
            $('ul#loadProviders').find('li').each((i, e) => stream.push({
               server: $(e).find('a').text(),
               quality: $(e).find('a').attr('rel') + 'p',
               url: $(e).find('a').attr('href')
            }));
            var onclickValue = $('div#download-movie a').attr('onclick');
            var urlExtract = onclickValue.match(/'(.*?)'/)[1];
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  thumbnail,
                  ...object
               },
               stream,
               download: await this.extract(urlExtract)
            });
         } catch (e) {
            console.log(e);
            resolve({
               creator: global.creator,
               status: false
            });
         }
      });
   }
}