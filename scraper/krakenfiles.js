const axios = require('axios')
const cheerio = require('cheerio')

exports.krakenfiles = (url) => {
    return new Promise(async (resolve, reject) => {
      const {
        data
      } = await axios.get(url);
      const $ = cheerio.load(data);
      const fileHash = $("div.col-xl-4.col-lg-5.general-information").attr("data-file-hash", );
      const tokens = $("input[name='token']").val();
      const result = {};
      const payload = new URLSearchParams(Object.entries({
        token: tokens,
      }), );
      const {
        data: res
      } = await axios.post("https://s5.krakenfiles.com/download/" + fileHash, payload, );
      result.title = $("div.coin-info > .coin-name > h5").text().trim();
      $("div.nk-iv-wg4-sub > .nk-iv-wg4-overview.g-2 > li").each(function() {
        const param = $(this).find("div.sub-text").text().replace(/ /g, "").toLowerCase();
        const value = $(this).find("div.lead-text").text().trim();
        result[param] = value;
      });
      result.views = $("div.views-count").text().trim();
      result.downloads = $("div.lead-text.downloads-count > strong").text().trim();
      result.fileHash = fileHash;
      result.url = res.url;
      resolve(result);
    });
  };