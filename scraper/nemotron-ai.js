const axios = require('axios');
const moment = require('moment-timezone')
const currentTime = moment().tz('Asia/Jakarta').format('LLLL')
exports.nemotron = (text) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'https://integrate.api.nvidia.com/v1/chat/completions',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer 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'
      },
      data: {
        model: 'nvidia/nemotron-4-340b-instruct',
        messages: [
          { 'role': 'user', 'content': `berapa tanggal waktu sekarang?` },
          { 'role': 'assistant', 'content': `Saat ini adalah ${currentTime}. Apakah ada yang bisa saya bantu lagi?` },
          { 'role': 'user', 'content': text }
        ]
      }
    };

    axios.request(options)
      .then(response => {
        resolve(response.data.choices[0].message.content);
      })
      .catch(error => {
        reject(error);
      });
  });
};