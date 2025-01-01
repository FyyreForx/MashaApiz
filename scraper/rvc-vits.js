const fetch = require('node-fetch');
const axios = require('axios');
const util = require('util');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const baseURL = "https://artrajz-vits-simple-api.hf.space/voice/";

//========= fungsi vits inference
exports.vits_inference = async (text, model_id) => {
  const response = baseURL + `vits?text=${text}&id=${model_id}&streaming=true`
  const audioBuffer = fetchBuffer(response)
//  const bupp = convertVideoToMP3(audioBuffer)
  return audioBuffer;
};

//========= fungsi vits model 
exports.vits_model = async () => {
  const response = await fetch(baseURL + "speakers");
  const data = await response.json();
  return data;
};

//=========== fungsi vits emotion 
exports.vits_emotion = async (text, model_id, emotion) => {
  const response = baseURL + `w2v2-vits?text=${text}&id=${model_id}&emotion=${emotion}`
  const audioBuffer = fetchBuffer(response)
 // const bup = convertVideoToMP3(audioBuffer)
  return audioBuffer;
};

async function tomp3(url) {
const outputPath = 'audio.mp3';

axios({
  method: 'get',
  url: url,
  responseType: 'stream'
})
.then(response => {
  response.data.pipe(fs.createWriteStream('audio.wav'))
    .on('finish', () => {
      // Convert WAV to MP3 using ffmpeg
      exec(`ffmpeg -i audio.wav ${outputPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error converting file: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`ffmpeg error: ${stderr}`);
          return;
        }
        console.log('Conversion complete');
      });
    });
})
.catch(error => {
  console.error(`Error downloading file: ${error.message}`);
});
return fs.readFileSync(outputPath)
}

async function fetchBuffer(file, options = {}) {
    const bufet = await (await axios.get(file, {
            responseType: "arraybuffer",
            headers: options
        }))
        .data
    return bufet;
}
