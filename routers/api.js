const fetch = require('node-fetch');
const fs = require('fs');
const axios = require('axios');
const yts = require("yt-search")
const cheerio = require('cheerio')
const multer = require('multer');
const path = require('path');
const express = require('express')
const router = express.Router()
const os = require('os')
const process = require('process');
const monk = new(require('../lib/database'))
const { limited } = require('../lib/limitation')
const { Morphic } = require('../scraper/ai')
const capcutdl = require('../scraper/Capcut-Downloader.js')
const ToolRemoveBg = require('../scraper/RemoveBackground.js')
const { sfiledl, sfileSearch } = require('../scraper/Sfile-Downloader.js')
const { spotifydl, searchSpotify } = require('../scraper/Spotify-Downloader.js')
const GDriveDl = require('../scraper/Drive-Downloader.js')
const twitterdl = require('../scraper/Twitter-Downloader.js')
const { remini } = require('../scraper/remini.js')
const Nekopoi = require('../scraper/nekopoi.js')
const { question, image } = require('../scraper/Bardie.js')
const lk21 = new(require('../scraper/lk21.js'))
const { nsearch, nhgetimg } = require('../scraper/nhentai')
const { searchgore, goredl, randomgore } = require('../scraper/gore')
const { apkdl } = require('../scraper/scraper-apk')
const { play, ytmp4, ytmp3 } = require('../scraper/youtube')
const { nemotron } = require('../scraper/nemotron-ai')
const { krakenfiles } = require('../scraper/krakenfiles')
const { freepik } = require('../scraper/jp-freepik')
const { img2prompt } = require('../scraper/image2prompt')
const { igsearch, igstalk } = require('../scraper/igstalker')
const { searchLyric, getLyrics } = require('../scraper/lyric')
const { ttz } = require ('../scraper/api')
const { G4F } = require("g4f");
const g4f = new G4F()
const tts = require('@google-cloud/text-to-speech')
const client = new tts.TextToSpeechClient({
  keyFilename: './key.json'
})
const { 
   A_genImage,
   A_style,
   A_sampler,
   A_models,
   wait
   } = require('../scraper/text2image.js')
const {
    otakudesuDetail,
    otakudesuLatest,
    otakudesuSearch,
    komikuSearch,
    komikuDetail,
    komikuEps,
    komikuLatest
} = require('../scraper/otakudesu.js');
const {
    rembg,
    Cartoon
} = require('../scraper/rmbg.js');
const {
    sdf,
    cosmix,
    trained,
    animagen,
    mixtral,
    emi,
    wish
} = require('../scraper/imagen.js');
const {
    xnxxsearch,
    xnxxdl,
    wallpaper,
    pin,
    snapsave,
    ttstalk,
    chatbot,
    Gpt4o,
    mediafireDl,
    pindl,
    llama2_ai,
    ttd,
    gpt3,
    gpt4,
    pixiv,
    pixivr18,
    vox,
    spe,
    askImage,
    ask,
    blackbox,
    gptRP,
    toAnime,
    openai,
    text2i
} = require('../scraper/api.js');
const {
    createImage,
    getList,
} = require("../scraper/animeAvatars.js")
const { 
    vits_inference, 
    vits_model,
    vits_emotion
    } = require('../scraper/rvc-vits.js')
const { BingImageCreator } = require('../scraper/bingImage.js')
const { Prodia } = require("prodia.js")
const { transform, upscale } = Prodia("4fe25ce7-f286-43f3-a4f7-315bd7752e72")
const makemeazombie = require('makemeazombie');
const zombie = new makemeazombie()
const { searchDrakor, downloadDrakor } = require('../scraper/drakor')
const stalk = new(require('../scraper/stalker'))

router.use((req, res, next) => {
    if (req.path === '/runtime') {
        return next();
    }
    if (req.path === '/info-os') {
        return next();
    }
    if (req.path === 'info-ip') {
        return next()
    }
    limited(req, res, next);
})

const uploadDirectory = path.join(__dirname, '../public/files');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Create unique filename
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `https://apisku-furina.vercel.app/files/${req.file.filename}`;
    res.json({ message: 'File uploaded successfully', fileUrl: fileUrl });
});
router.get('/synthesize', async (req, res) => {
  try {
    const text = req.query.text;
    const voice = req.query.id || 'id-ID-Wavenet-C';
    const emotion = req.query.emotion || 'default'; // Menambahkan parameter emosi

    let speakingRate = 1.0; // Kecepatan bicara default
    let pitch = 0; // Nada suara default
    let effectsProfileId = 'handset-class-device'; // Profil efek default

    // Mengatur parameter berdasarkan emosi
    switch (emotion) {
      case 'senang':
        speakingRate = 1.3;
        pitch = 5;
        effectsProfileId = 'small-bluetooth-speaker-class-device';
        break;
      case 'sedih':
        speakingRate = 0.9;
        pitch = -2;
        effectsProfileId = 'handset-class-device';
        break;
      case 'marah':
        speakingRate = 1.4;
        pitch = 2;
        effectsProfileId = 'small-bluetooth-speaker-class-device';
        break;
      default:
        speakingRate = 1.0;
        pitch = 0;
        effectsProfileId = 'handset-class-device';
    }

    // Menyiapkan input teks
    const request = {
      input: { text: text },
      voice: { 
        languageCode: 'id-ID', 
        name: voice,
        ssmlGender: 'NEUTRAL' 
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: speakingRate,
        pitch: pitch,
        effectsProfileId: [effectsProfileId]
      },
    };

    // Melakukan permintaan ke API Text-to-Speech
    const [response] = await client.synthesizeSpeech(request);

    // Upload buffer audio ke server menggunakan Func.uploadFile
    const audioBuffer = response.audioContent;
    const url = (await Func.uploadFile(audioBuffer)).data.url;

    // Mengirimkan URL sebagai respons
    res.json({ 
      creator: 'creator',
      status: true,
      data: { url }
    });
  } catch (error) {
    console.error('Error during synthesis:', error);
    res.status(500).send('Error during synthesis');
  }
});

const ua = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    // Tambahkan user agents lainnya sesuai kebutuhan
];

// Random User Agent selection
function gua() {
    return ua[Math.floor(Math.random() * ua.length)];
}

// Result creator function
function createResult(url, title, description) {
    return { url, title, description };
}

// Helper function to make the request to Google
async function makeRequest(
    query,
    num,
    start,
    proxy,
    lang = "id",
    timeout = 5000,
    safe = "active",
    sslVerify = true,
    region = null,
) {
    const response = await axios.get("https://www.google.com/search", {
        headers: {
            "User-Agent": gua(),
        },
        params: {
            q: query,
            num: num + 2, // Fetch extra results
            hl: lang,
            start,
            safe: safe,
            gl: region,
        },
        httpsAgent: proxy
            ? new https.Agent({ rejectUnauthorized: sslVerify })
            : null,
        timeout: timeout,
    });
    return response.data;
}

// Main search function
async function googleSearch(
    query,
    num = 10,
    proxy = null,
    sleepInterval = 0,
    region = null,
    lang = "id",
    timeout = 5000,
    safe = "active",
    sslVerify = true,
) {
    let start = 0;
    let result = [];
    let totalResults = 0;

    while (totalResults < num) {
        const html = await makeRequest(
            query,
            num - totalResults,
            start,
            proxy,
            lang,
            timeout,
            safe,
            sslVerify,
            region,
        );
        const $ = cheerio.load(html);
        const resultBlock = $("div.g");
        let newResults = 0;

        resultBlock.each((_, element) => {
            const link = $(element).find("a").attr("href");
            const title = $(element).find("h3").text();
            const description = $(element)
                .find('div[style="-webkit-line-clamp:2"]')
                .text();

            if (link && title && description) {
                result.push(createResult(link, title, description));
                totalResults++;
                newResults++;

                if (totalResults >= num) {
                    return result;
                }
            }
        });

        if (newResults === 0) {
            break;
        }

        start += 10;
        await new Promise((res) => setTimeout(res, sleepInterval)); // Sleep if interval is set
    }

    return result;
}

// Route for Google Search
router.get('/search/google', async (req, res) => {
    const teks = req.query.q;
    
    if (!teks) {
        return res.status(400).send('Query parameter "q" is required.');
    }

    try {
        const data = await googleSearch(teks);
        let tx = {
            status: true,
            creator: "Masha - Forx Code",
            results: []
        };

        let urutan = 1;
        
        for (const v of data) {
            tx.results.push({
                no: urutan,
                title: v.title,
                url: v.url,
                description: v.description
            });
            urutan++;
        }

        res.json(tx);
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error fetching search results.' });
    }
});
router.get('/download/ttdl', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            status: false,
            message: 'URL TikTok tidak ditemukan. Gunakan parameter url dengan link video TikTok.'
        });
    }

    try {
        // Request ke API TikTok download
        const response = await axios.get(`https://widipe.com/download/v2/ttdl?url=${encodeURIComponent(url)}`);
        const result = response.data;

        if (!result.status) {
            return res.status(500).json({
                status: false,
                message: 'Gagal mengambil data dari API TikTok.'
            });
        }
   
        return res.json({
            status: true,
            code: 200,
            creator: global.creator,
            result: {
                title: result.result.title,
                title_audio: result.result.title_audio,
                thumbnail: result.result.thumbnail,
                video: result.result.video,
                audio: result.result.audio
            }
        });
    } catch (error) {
        console.error('Error fetching TikTok download data:', error);
        return res.status(500).json({
            status: false,
            message: 'Terjadi kesalahan saat memproses permintaan.'
        });
    }
});

router.get('/image/txt-to-cartoon', async (req, res) => {
  const { prompt } = req.query; // Mengambil prompt dari query string

  // Fungsi anime untuk generate image
  async function anime(prompt) {
    try {
      return await new Promise(async (resolve, reject) => {
        if (!prompt) return reject("failed reading undefined prompt!");
        
        axios.post("https://aiimagegenerator.io/api/model/predict-peach", {
          prompt,
          key: "Cartoon",
          width: 512,
          height: 768,
          quantity: 1,
          size: "512x768"
        }).then(res => {
          const data = res.data;
          if (data.code !== 0) return reject(data.message);
          if (data.data.safetyState === "RISKY") return reject("nsfw image was generated, you try create other image again!");
          if (!data.data?.url) return reject("failed generating image!");
          
          return resolve({
            status: true,
            creator: "Masha - Forx Code",
            image: data.data.url
          });
        }).catch(reject);
      });
    } catch (e) {
      return {
        status: false,
        creator: "Masha - Forx Code",
        message: e
      };
    }
  }

  try {
    const result = await anime(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: false, creator: "Masha - Forx Code", message: error.toString() });
  }
});
// cak lontong
router.get('/game/caklontong', async (req, res) => {
    try {
        const caklontongDataPath = path.join(__dirname, 'caklontong.json');
        const caklontongData = JSON.parse(fs.readFileSync(caklontongDataPath, 'utf-8'));
        const randomIndex = Math.floor(Math.random() * 414);
        const result = caklontongData[randomIndex];

        return res.status(200).json({
            status: 200,
            creator: global.creator,
            soal: result.soal,
            jawaban: result.jawaban,
            deskripsi: result.deskripsi
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

router.get('/tools/truecaller', async (req, res) => {
  const phoneNumber = req.query.phone;

  if (!phoneNumber) {
    return res.status(400).json({
      creator: 'Masha - Forx Code',
      status: 400,
      msg: 'Phone number is required'
    });
  }

  async function Truecaller(phoneNumber) {
    try {
      const url = `https://asia-south1-truecaller-web.cloudfunctions.net/webapi/noneu/search/v1?q=${phoneNumber}&countryCode=id&type=40`;

      const headers = {
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mjg5NzEyNzQ5MTIsInRva2VuIjoiYTF3MEItLXBGYjJpRkZORlZHaGVmcUJhUXhfc0NXM0dmWlZ6QmZKNVpfWXA5Ukc3YUxTTXFIY3hTN1FLck03SyIsImVuaGFuY2VkU2VhcmNoIjp0cnVlLCJjb3VudHJ5Q29kZSI6InVzIiwibmFtZSI6IktlbWlpIiwiZW1haWwiOiJrZW1paXNhbHNhYmlsYUBnbWFpbC5jb20iLCJpbWFnZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0wySEc2UDJtd1dkeUE1eG9HU1lEUF85Tld3ZTRVbDRNZFhMNHFNcmtyNnpYOXdfdz1zOTYtYyIsImlhdCI6MTcyNjM3OTI3NH0.1cMTCg4-CJet74dQHwZuXrGApHoIWkxJtTaJCwT0fxc',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      };

      const response = await axios.get(url, { headers });
      return {
        creator: 'Masha - Forx Code',
        status: 200,
        data: response.data // Return the response data as an object
      };
    } catch (error) {
      return {
        creator: 'Masha - Forx Code',
        status: 500,
        msg: error.message || error
      };
    }
  }

  const result = await Truecaller(phoneNumber);
  res.status(result.status).json(result);
});

// tebak gambar 
router.get('/game/tebakgambar', async (req, res) => {
    try {
        const tebakgambarDataPath = path.join(__dirname, 'tebakgambar.json');
        const tebakgambarData = JSON.parse(fs.readFileSync(tebakgambarDataPath, 'utf-8'));
        const randomIndex = Math.floor(Math.random() * 1000);
        const result = tebakgambarData[randomIndex];
	    
        return res.status(200).json({
            status: 200,
            creator: global.creator,
            img: result.img,
            jawaban: result.jawaban,
            deskripsi: result.deskripsi
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});
// Tebak Logo
router.get('/game/tebaklogo', async (req, res) => {
    try {
        const tebaklogoDataPath = path.join(__dirname, 'tebaklogo.json');
        const tebaklogoData = JSON.parse(fs.readFileSync(tebaklogoDataPath, 'utf-8'));
        const randomIndex = Math.floor(Math.random() * 439);
        const result = tebaklogoData[randomIndex];

        return res.status(200).json({
            status: 200,
            creator: global.creator,
            img: result.img,
            deskripsi: result.deskripsi,
            jawaban: result.jawaban
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

router.get('/tools/ssweb', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            status: false,
            msg: 'URL is required.'
        });
    }

    try {
        const response = await axios.get(`https://widipe.com/ssfull?url=${encodeURIComponent(url)}`, {
            responseType: 'arraybuffer'
        });

        res.set('Content-Type', 'image/jpg');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: 'Error retrieving the screenshot: ' + error.message
        });
    }
});

async function fetchImage(url, res) {
    try {
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
        });
        res.setHeader('Content-Type', 'image/jpg');
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send('Error fetching image');
    }
}

// SSHP endpoint
router.get('/tools/sshp', async function (req, res) {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL parameter is required');
    }
    const fullUrl = `https://widipe.com/sshp?url=${encodeURIComponent(url)}`;
    await fetchImage(fullUrl, res);
});

// SSPC endpoint
router.get('/tools/sspc', async function (req, res) {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL parameter is required');
    }
    const fullUrl = `https://widipe.com/sspc?url=${encodeURIComponent(url)}`;
    await fetchImage(fullUrl, res);
});

// SSTAB endpoint
router.get('/tools/sstab', async function (req, res) {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL parameter is required');
    }
    const fullUrl = `https://widipe.com/sstab?url=${encodeURIComponent(url)}`;
    await fetchImage(fullUrl, res);
});

router.get('/search/kodepos', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter "q" is required' });
    }
    // Function to fetch postal codes
    async function kodepos(query) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await axios.get('https://nomorkodepos.com/?s=' + query);
                const $ = cheerio.load(data);
                let _data = [];

            $('table.pure-table.pure-table-horizontal > tbody > tr').each((i, u) => {
                    let _doto = [];
                    $(u).find('td').each((l, p) => {
                        _doto.push($(p).text().trim());
                    });
                    _data.push({
                        province: _doto[0],
                        city: _doto[1],
                        subdistrict: _doto[2],
                        village: _doto[3],
                        postalcode: _doto[4],
                    });
                });
                resolve(_data);
            } catch (err) {
                console.error(err);
                reject(err); // Reject the promise in case of error
            }
        });
    }

    try {
        // Call the kodepos function
        const postalCodes = await kodepos(query);

        // Send the result back as JSON with additional fields
        res.json({
            status: true,
            creator: "Masha - Forx Code",
            data: postalCodes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching postal codes' });
    }
});

router.get('/tools/robloxstalk', async (req, res) => {
    const name = req.query.name;

    if (!name) {
        return res.status(400).json({ status: false, message: "Username is required" });
    }

    const robloxstalk = async (name) => {
        try {
            const fetchJson = async (url, options) => {
                return (await fetch(url, options)).json();
            };

            const getUsernameData = async () => {
                return fetchJson("https://users.roblox.com/v1/usernames/users", {
                    method: "POST",
                    body: JSON.stringify({ "usernames": [name] }),
                    headers: { "Content-Type": "application/json" }
                });
            };

            const getUserData = async (id) => {
                return fetchJson("https://users.roblox.com/v1/users/" + id);
            };
            
            const getProfile = async (id) => {
                return fetchJson("https://thumbnails.roblox.com/v1/users/avatar?userIds=" + id + "&size=720x720&format=Png&isCircular=false");
            };

            const getPresenceData = async (id) => {
                return fetchJson("https://presence.roblox.com/v1/presence/users", {
                    method: "POST",
                    body: JSON.stringify({ "userIds": [parseInt(id)] }),
                    headers: { "Content-Type": "application/json" }
                });
            };

            const { data } = await getUsernameData();

            if (!data || data.length === 0) {
                return { status: false, message: "Username not found" };
            }

            const id = data[0].id;

            const userDetails = await getUserData(id);
            const profileDetails = (await getProfile(id)).data[0].imageUrl;
            const lastOnline = (await getPresenceData(id)).userPresences[0]?.lastOnline || 'N/A';

            return {
                status: true,
                creator: "Masha - Forx Code",
                Indraa: {
                    description: userDetails.description || '',
                    created: userDetails.created,
                    isBanned: userDetails.isBanned,
                    externalAppDisplayName: userDetails.externalAppDisplayName,
                    hasVerifiedBadge: userDetails.hasVerifiedBadge,
                    id: userDetails.id,
                    name: userDetails.name,
                    displayName: userDetails.displayName
                },
                lastOnline: lastOnline,
                profileDetails: profileDetails
            };
        } catch (error) {
            console.error(error);
            return { status: false, message: error.message };
        }
    };

    const result = await robloxstalk(name);
    res.json(result);
});

router.get('/islami/surah', async (req, res) => {
    const surahNumber = req.query.no;

    if (!surahNumber) {
        return res.status(400).send('Query parameter "no" is required.');
    }

    try {
        // Async function for fetching surah data
        const surah = async (no) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const { data } = await axios.get('https://kalam.sindonews.com/surah/' + no);
                    const $ = cheerio.load(data);
                    const result = [];
                    const ar = [];
                    const id = [];
                    const lt = [];
                    let audio = '';

                    // Extracting audio link
                    $('div.breadcrumb-new > ul > li:nth-child(5)').each(function (c, d) {
                        audio = $(d).find('a').attr('href').replace('surah', 'audioframe');
                    });

                    // Extracting Arabic verses
                    $('div.ayat-arab').each(function (a, b) {
                        ar.push($(b).text());
                    });

                    // Extracting Indonesian translation
                    $('li > div.ayat-text').each(function (e, f) {
                        id.push($(f).text().replace(',', '').trim());
                    });

                    // Extracting Latin pronunciation
                    $('div.ayat-latin').each(function (g, h) {
                        lt.push($(h).text().trim());
                    });

                    // Combining the extracted data
                    for (let i = 0; i < ar.length; i++) {
                        result.push({
                            arab: ar[i],
                            indo: id[i],
                            latin: lt[i]
                        });
                    }

                    resolve({
                        creator: "Masha - Forx Code",
                        status: true,
                        audio: audio,
                        data: result
                    });
                } catch (error) {
                    reject({
                        creator: "Masha - Forx Code",
                        status: false,
                        message: "Error fetching surah data"
                    });
                }
            });
        };

        // Fetching surah data
        const result = await surah(surahNumber);
        res.json(result);

    } catch (error) {
        res.status(500).send({
            creator: "Masha - Forx Code",
            status: false,
            message: "Error processing request"
        });
    }
});

router.post('/image/toZombie', async (req, res) => {
    try {
        const { photo } = req.body;
        if (!photo) {
            return res.status(400).json({
                error: 'Masukan parameter "url"'
            });
        }

        console.log('Memulai transformasi gambar...');
        const json = await zombie.transform({ photo });
        console.log('Transformasi berhasil:', json);

        console.log('Mengunggah file...');
        const img = await Func.uploadFile(Buffer.from(json, 'base64'));
        console.log('Pengunggahan berhasil:', img);

        const link = img.data.url
        res.status(200).json({
            creator: creator,
            status: true,
            data: { link }
        });
    } catch (e) {
        console.error('Terjadi kesalahan:', e);
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});

router.get('/tools/igstalk', async (req, res) => {
    try {
        const message = req.query.user;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "user" tidak ditemukan'
                });
        }
        const data = await igstalk(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/islami/kisahnabi', async (req, res) => {
    try {
        const nabiQuery = req.query.nabi;
        if (!nabiQuery) {
            return res.status(400).json({
                error: 'Parameter "nabi" tidak ditemukan'
            });
        }

        // Load nabi.json from the same folder
        const nabiDataPath = path.join(__dirname, 'nabi.json');
        const nabiData = JSON.parse(fs.readFileSync(nabiDataPath, 'utf-8'));

        // Convert query to lowercase and find kisah with partial match
        const kisah = nabiData.find((item) => item.name.toLowerCase().includes(nabiQuery.toLowerCase()));

        if (!kisah) {
            return res.status(404).json({
                status: 404,
                message: `Kisah Nabi ${nabiQuery} tidak ditemukan`
            });
        }

        // If kisah is found, return the data
        return res.status(200).json({
            status: 200,
            creator: global.creator,
            data: kisah
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});


router.get('/islami/hadist', async (req, res) => {
    try {
        const hadistNo = req.query.no;
        if (!hadistNo) {
            return res.status(400).json({
                error: 'Parameter "no" tidak ditemukan'
            });
        }

        // Load hadist.json from the same folder
        const hadistDataPath = path.join(__dirname, 'hadist.json');
        const hadistData = JSON.parse(fs.readFileSync(hadistDataPath, 'utf-8'));

        // Find hadist by "no" field
        const hadist = hadistData.find((item) => item.no === hadistNo);

        if (!hadist) {
            return res.status(404).json({
                status: 404,
                message: `Hadits nomor ${hadistNo} tidak ditemukan`
            });
        }

        // If hadist is found, return the data
        return res.status(200).json({
            status: 200,
            creator: global.creator,
            data: hadist
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

router.get('/tts', async (req, res) => {
    try {
        const { text, character, apikey } = req.query;

        // Validasi parameter
        if (!apikey) {
            return res.status(400).json({
                error: 'Parameter "apikey" tidak ditemukan'
            });
        }

        if (!text) {
            return res.status(400).json({
                error: 'Parameter "text" tidak ditemukan'
            });
        }

        if (!character) {
            return res.status(400).json({
                error: 'Parameter "character" tidak ditemukan'
            });
        }

        // Panggil fungsi ttz dengan parameter yang diberikan
        const data = await ttz(text, character);
        
        res.status(200).json({
            status: 200,
            creator: global.creator,
            data
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get('/downloader/play', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                error: 'Parameter "q" tidak ditemukan'
            });
        }

        // Mencari video di YouTube menggunakan yt-search
        const searchResults = await yts(q);
        if (searchResults.videos.length === 0) {
            return res.status(404).json({
                error: 'Video tidak ditemukan'
            });
        }

        const video = searchResults.videos[0];
        const videoUrl = `https://youtube.com/watch?v=${video.videoId}`;

        const url = `https://widipe.com/download/ytdl?url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.status) {
            return res.status(500).json({
                error: 'Gagal mendapatkan data dari sumber'
            });
        }

        const result = {
            status: data.status,
            creator: 'Masha - Forx Code',
            result: {
                id: video.videoId,
		mp4: data.result.mp4,
	        mp3: data.result.mp3,
                url: videoUrl,
                title: video.title,
                description: video.description,
                image: video.image,
                thumbnail: video.thumbnail,
                duration: video.duration.timestamp,
                timestamp: video.timestamp,
                ago: video.ago,
                views: video.views,
                name: video.author.name,
                channel: video.author.url
            }
        };

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


router.get('/ai/gpt4o', async (req, res) => {
  const userText = req.query.text; // Mengambil teks dari query parameter
  const defaultPrompt = `Kamu berperan sebagai Masha AI. Jawab pertanyaan berikut dengan tetap menjadi Masha AI, namun jangan sebut namamu kecuali jika pengguna bertanya atau menyinggung siapa namamu dan ini kamu harus ingat bahwa seolah olah pencipta mu Forx Senhire. Dan ingat ya kalau kamu ditanya namamu itu Masha AI dan pencipta/pembuat/creator itu Forx Senhire. Pertanyaan: `;

  // Menggunakan teks pengguna untuk melengkapi prompt
  const fullPrompt = `${defaultPrompt}${userText}`;

  const data = {
    query: fullPrompt,
    model: "yanzgpt-legach-72b-v3.0"
  };

  try {
    const response = await axios.post('https://yanzgpt.my.id/chat', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Membentuk respons dengan format yang diinginkan
    const formattedResponse = {
      status: true,
      creator: global.creator,
      message: response.data.message // Mengambil message dari respons API
    };

    res.json(formattedResponse); // Mengirimkan data respons ke klien
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses permintaan.' });
  }
});

// Endpoint untuk mendapatkan respons dari AI dengan prompt khusus
router.get('/ai/gpt4o-prompt', async (req, res) => {
  const userText = req.query.text; // Mengambil teks dari query parameter
  const userPrompt = req.query.prompt; // Mengambil prompt dari query parameter
  const defaultPrompt = `Kamu berperan sebagai Masha AI. Jawab pertanyaan berikut dengan tetap menjadi Masha AI, namun jangan sebut namamu kecuali jika pengguna bertanya atau menyinggung siapa namamu dan ini kamu harus ingat bahwa seolah olah pencipta mu Forx Senhire. Dan ingat ya kalau kamu ditanya namamu itu Masha AI dan pencipta/pembuat/creator itu Forx Senhire. Pertanyaan: `;

  // Menggunakan prompt pengguna jika ada, jika tidak menggunakan prompt default
  const fullPrompt = userPrompt ? `buat seolah olah ${userPrompt} dan jangan menyebut kecuali di tanya ${userText}` : `${defaultPrompt}${userText}`;

  const data = {
    query: fullPrompt,
    model: "yanzgpt-legcy-72b-v3.0"
  };

  try {
    const response = await axios.post('https://yanzgpt.my.id/chat', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Membentuk respons dengan format yang diinginkan
    const formattedResponse = {
      status: true,
      creator: global.creator,
      message: response.data.message // Mengambil message dari respons API
    };

    res.json(formattedResponse); // Mengirimkan data respons ke klien
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses permintaan.' });
  }
});



router.get('/downloader/ytmp3', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                error: 'Parameter "q" tidak ditemukan'
            });
        }

        const url = `https://widipe.com/download/ytdl?url=${encodeURIComponent(q)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.status) {
            return res.status(500).json({
                error: 'Gagal mendapatkan data dari sumber'
            });
        }

        const result = {
            status: data.status,
            creator: 'Masha - Forx Code',
            result: {
                id: data.result.id,
                url: data.result.url,
                title: data.result.title,
                description: data.result.description,
                image: data.result.image,
                thumbnail: data.result.thumbnail,
                duration: data.result.duration,
                timestamp: data.result.timestamp,
                ago: data.result.ago,
                views: data.result.views,
                name: data.result.name,
                channel: data.result.channel,
                mp3: data.result.mp3
            }
        };

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get('/ytmp4', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                error: 'Parameter "url" tidak ditemukan'
            });
        }

        // Fungsi ytmp4 dimasukkan di dalam route handler
        async function ytmp4(url) {
            try {
                const URLS = 'https://api.zeemo.ai/hy-caption-front/api/v1/video-download/yt-dlp-video-info';
                const headers = {
                    accept: "*/*",
                    "Content-Type": "application/json"
                };

                const response = await axios.post(URLS, {
                    url,
                    videoSource: 3
                }, { headers });

                const { status, data } = response;

                // Format data sesuai permintaan
                return {
                    status: status,
                    creator: "Masha - Forx Code",
                    data: {
                        judul: data.data.videoName,
                        mp4: data.data.downloadUrl,
                        durasi: data.data.duration,
                        thumbnail: data.data.thumbnailUrl
                    }
                };
            } catch (e) {
                if (e.response) {
                    return {
                        error: true,
                        message: e.message,
                        statusCode: e.response.status,
                        statusText: e.response.statusText,
                        data: e.response.data,
                        headers: e.response.headers
                    };
                } else if (e.request) {
                    return {
                        error: true,
                        message: "No response received from server",
                        request: e.request
                    };
                } else {
                    return {
                        Creator: "Masha - Forx Code",
                        error: true,
                        message: `Request setup error: ${e.message}`
                    };
                }
            }
        }

        // Memanggil fungsi ytmp4 dan mengembalikan respons
        const data = await ytmp4(url);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get('/islami/jadwal-sholat', async (req, res) => {
    const { kota } = req.query; // Mengambil parameter kota dari request

    if (!kota) {
        return res.status(400).json({
            error: 'Parameter "kota" tidak ditemukan'
        });
    }

    try {
        // Fungsi untuk mengambil jadwal sholat
        const jadwal = (query) => {
            return new Promise((resolve, reject) => {
                axios
                    .get(`https://umrotix.com/jadwal-sholat/${query}`)
                    .then(({ data }) => {
                        const $ = cheerio.load(data);
                        const result = {};

                        result.kota = $("h1.text-center")
                            .first()
                            .text()
                            .replace("Jadwal Sholat ", "")
                            .trim();

                        $("body > div > div.main-wrapper.scrollspy-action > div:nth-child(3)").each(function (a, b) {
                            result.tanggal = $(b).find("> div:nth-child(2)").text();

                            result.jadwal = {
                                imsak: $(b).find("> div.panel.daily > div > div > div > div > div:nth-child(1) > p:nth-child(2)").text(),
                                subuh: $(b).find("> div.panel.daily > div > div > div > div > div:nth-child(2) > p:nth-child(2)").text(),
                                dzuhur: $(b).find("> div.panel.daily > div > div > div > div > div:nth-child(3) > p:nth-child(2)").text(),
                                ashar: $(b).find("> div.panel.daily > div > div > div > div > div:nth-child(4) > p:nth-child(2)").text(),
                                maghrib: $(b).find("> div.panel.daily > div > div > div > div > div:nth-child(5) > p:nth-child(2)").text(),
                                isyak: $(b).find("> div.panel.daily > div > div > div > div > div:nth-child(6) > p:nth-child(2)").text(),
                            };
                        });

                        resolve(result);
                    })
                    .catch(reject);
            });
        };

        // Panggil fungsi jadwal
        const jadwalResult = await jadwal(kota);
        return res.status(200).json({
            status: 'success',
            creator: 'Masha - Forx Code',
            result: jadwalResult
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

router.get('/search/lyric', async (req, res) => {
    try {
        const message = req.query.q;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "q" tidak ditemukan'
                });
        }
        const data = await searchLyric(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/search/lyric-get', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await getLyrics(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/search/jp-freepik', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await freepik(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/tools/carbon', async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) {
            return res.status(400).json({
                status: false,
                msg: 'Parameter "text" hilang'
            });
        }

        const data = await CarbonifyV1(text)
        const json = await Func.uploadFile(data);
        const url = json.data.url
        res.status(200).json({
            creator: creator,
            status: true,
            data: {
                url
            }
        });
    } catch (e) {
        res.status(500).json({
            status: false,
            msg: e.message
        });
    }
});

router.get('/search/chord', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                status: false,
                msg: 'Parameter "q" hilang'
            });
        }

        const json = await chord(q)
        const data = json.chord
        res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            status: false,
            msg: e.message
        });
    }
});

router.get('/tools/ml-stalk', async (req, res) => {
    try {
        const { id, server } = req.query;
        if (!id) {
            return res.status(400).json({
                error: 'Masukan parameter "id"'
            });
        }
       if (!server) {
            return res.status(400).json({
                error: 'Masukan parameter "server"'
            });
        }
   const data = await stalk.mobileLegends(id, server)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});

router.get('/tools/ig-stalk', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({
                error: 'Masukan parameter "username"'
            });
        }
       
   const data = await stalk.instagram(username)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});

router.get('/tools/ff-stalk', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                error: 'Masukan parameter "id"'
            });
        }
       
   const data = await stalk.freeFire(id)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});

router.get('/tools/youtube-stalk', async (req, res) => {
    try {
      
        const { user } = req.query;
        if (!user) {
            return res.status(400).json({
                error: 'Masukan parameter "user"'
            });
        }
       
   const data = await stalk.youtube(user)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});

//krakenfiles
router.get('/download/krakenfiles', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
                error: 'Masukan parameter "q"'
            });
        }
   const data = await krakenfiles(url)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});

// Gore
router.get('/search/gore', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                error: 'Masukan parameter "q"'
            });
        }
   const data = await searchgore(q)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});
router.get('/search/randomgore', async (req, res) => {
    try {
        
      const data = await randomgore()
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});
router.get('/download/gore', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
                error: 'Masukan parameter "url"'
            });
        }
   const data = await goredl(url)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});


router.get('/search/apk', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                error: 'Masukan parameter "q"'
            });
        }
   const data = await apkdl.search(q)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});

router.get('/download/apk', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
                error: 'Masukan parameter "url"'
            });
        }
   const data = await apkdl.download(url)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});

router.get('/nhentai-search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                error: 'Masukan parameter "q"'
            });
        }
   const data = await nsearch(q)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});

router.get('/nhentai-get', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
                error: 'Masukan parameter "q"'
            });
        }
   const data = await nhgetimg(url)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});
//drakor
router.get('/search/drakor', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                error: 'Masukan parameter "q"'
            });
        }
   const data = await searchDrakor(q)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
});

router.get('/download/drakor', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
                error: 'Masukan parameter "url"'
            });
        }
   const data = await downloadDrakor(url)
      res.status(200).json({
            creator: creator,
            status: true,
            data
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: e.message
        });
    }
})

router.post('/image/bing-image', async (req, res) => {
    try {
        const { prompt, cookie } = req.body;
        if (!prompt) {
            return res.status(400).json({
                error: 'Masukan parameter "prompt"'
            });
        }
        if (!cookie) {
            return res.status(400).json({
                error: 'masukan parameter "cookie"'
            });
        }

        const json = await new BingImageCreator({ cookie });
        const img = await json.createImage(prompt);
        res.status(200).json({
            creator: creator,
            status: true,
            data: { 
                prompt: prompt,
                img
            }
        });
    } catch (e) {
        res.status(500).json({
            creator: creator,
            status: false,
            msg: 'Oops cookie telah mencapai limit :('
        });
    }
});


// Searching film
router.get('/search/film', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400)
                .json({
                    error: 'Parameter "q" tidak ditemukan'
                });
        }
        const data = await lk21.search(query)
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/download/film-get', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400)
                .json({
                    error: 'Parameter "URL" tidak ditemukan'
                });
        }
        const data = await lk21.fetch(url)
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

// To PDF
router.get('/tools/pdfhentai', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        if (!Array.isArray(url)) {
            url = [url];
        }
        const json = await (await Func.toPDF(url))
        const jj = await Func.uploadFile(json)
        const link = jj.data.url
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data: {
                   link
                },
            });
    } catch (error) {
        res.status(504)
            .json({
                error: error.message
            });
    }
});
// Characters AI
router.get('/cai/search', async (req, res) => {
    try {
       const { query } = req.query
       if (!query) {
         return res.status(400)
              .json({
                 msg: 'Masukan parameter "query" !'
               })
         }
       const json = await Func.fetchJson(`https://api.neoxr.my.id/api/chat-search?q=${query}`)
      if (!json.status) {
         return res.status(500)
           .json({
              status: false,
              msg: 'Internal server error !'
            })
      }
      delete json.creator
      delete json.status
      data = json.data.map(item => {
  delete item.attributes.createdAt
  delete item.attributes.updatedAt
  delete item.attributes.publishedAt
  delete item.attributes.firebaseBotId
  delete item.attributes.firebaseUserId
  delete item.attributes.firebaseChatId
  delete item.attributes.isDeleted
  delete item.attributes.unlisted
  delete item.attributes.greeting
  delete item.attributes.unlistedForce
  delete item.attributes.growthRate
  delete item.attributes.exploreSort
  delete item.attributes.appearance
  delete item.attributes.bio
  delete item.attributes.heroPicture
  delete item.attributes.likeEndDate
  delete item.attributes.likeEndCount
  delete item.attributes.isDefaultAvatar
  delete item.attributes.isSexual
  delete item.attributes.likeWeekCount
  delete item.attributes.likeMonthCount
  delete item.attributes.likeTotalCount
  delete item.attributes.personaFacts
  delete item.attributes.isOwner
  delete item.attributes.likeEndPeriod
  delete item.attributes.likesCount
  delete item.attributes.userLiked
  return item
})
      res.status(200)
         .json({
            creator: creator,
            status: true,
            data
          })
       } catch (e) {
        res.status(500)
            .json({
                error: e.message
            });
    }
})

router.get('/cai/chat', async (req, res) => {
    try {
       const { charId, chat } = req.query
       if (!charId) {
         return res.status(400)
              .json({
                 msg: 'Masukan parameter "charId" !'
               })
         }
       if (!chat) {
         return res.status(400)
              .json({
                 msg: 'Masukan parameter "chat" !'
               })
         }
       const json = await Func.fetchJson(`https://api.neoxr.my.id/api/chat?id=${charId}&msg=${chat}`)
      if (!json.status) {
         return res.status(500)
           .json({
              status: false,
              msg: 'Internal server error !'
            })
      }
      delete json.creator
      delete json.status
      data = json.data
      res.status(200)
         .json({
            creator: creator,
            status: true,
            data
          })
       } catch (e) {
        res.status(500)
            .json({
                error: e.message
            });
    }
})


//Bard
router.get('/ai/bard', async (req, res) => {
    try {
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        const data = await question({ ask: message });
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/ai/bard-img', async (req, res) => {
    try {
        const url = req.query.url;
	     const message = req.query.text
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
	if (!url) {
            return res.status(400)
                .json({
                    error: 'Parameter "URL" tidak ditemukan'
                });
        }
        const data = await image({ ask: message, image: url });
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//nekopoi 
router.get('/nekopoi-search', async (req, res) => {
    try {
        const query = req.query.query
        const data = await Nekopoi.Search(query);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/nekopoi-latest', async (req, res) => {
    try {
        const data = await Nekopoi.Latest();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.post('/nekopoi-get', async (req, res) => {
	try {
		const url = req.body.url		
		if (!url) {
			return res.status(400)
				.json({
					error: 'Parameter "url" tidak ditemukan pastikan url gambar ada pada endpoint'
				});
		}
		const data = await Nekopoi.Get(url);
		res.status(200)
			.json({
				status: 200,
				creator: global.creator,
				result: {
				    data
				},
			});
	} catch (error) {
		res.status(500)
			.json({
				error: error.message
			});
	}
});


//openai
router.post('/ai/bing-chat', async (req, res) => {
    try {
        // Memeriksa apakah body request sesuai dengan skema yang diharapkan
        const messages = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: 'Field "messages" is required and must be a non-empty array'
            });
        }

        // Lakukan pemrosesan pesan di sini, misalnya dengan memanggil fungsi gptRP
        const data = await openai(messages);

        // Kirim respons dengan data yang diproses
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: {
                reply: data
            }
        });
    } catch (error) {
        // Tangani kesalahan yang mungkin terjadi selama pemrosesan
        res.status(500).json({
            error: error.message
        });
    }
});

//toAnime
router.get('/image/toAnime', async (req, res) => {
    const imageUrl = req.query.image; // Ambil parameter image dari query
    if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required' });
    }

    try {
        // Request ke API neoxr untuk mengonversi gambar
        const response = await axios.get(`https://api.neoxr.eu/api/toanime?image=${encodeURIComponent(imageUrl)}`);
        const result = response.data;

        // Cek apakah API berhasil mengonversi gambar
        if (result.status && result.data && result.data.url) {
            // Mendapatkan gambar hasil dari API
            const animeImageResponse = await fetch(result.data.url);
            const animeImageBuffer = await animeImageResponse.buffer();

            // Set header respons berupa image/jpeg dan kirim hasil
            res.set('Content-Type', 'image/jpeg');
            return res.send(animeImageBuffer);
        } else {
            console.error('Invalid response from API:', result);
            return res.status(500).json({ error: 'Failed to process image' });
        }
    } catch (error) {
        console.error('Error processing image:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

//image2hd
router.get('/image/toAnime', async (req, res) => {
    const imageUrl = req.query.image;
    const apiKey = req.query.apikey;

    if (!imageUrl || !apiKey) {
        return res.status(400).json({ error: 'Image URL and API key are required' });
    }

    try {
        const response = await axios.get(`https://api.neoxr.eu/api/toanime?image=${encodeURIComponent(imageUrl)}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        const result = response.data;

        if (result.status && result.data && result.data.url) {
            const animeImageResponse = await fetch(result.data.url);
            const animeImageBuffer = await animeImageResponse.buffer();

            res.set('Content-Type', 'image/jpeg');
            return res.send(animeImageBuffer);
        } else {
            return res.status(500).json({ error: 'Failed to process image' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});


router.post('/image/transform', async (req, res) => {
    try {
        const { prompt, url } = req.body
        if (!url) {
            return res.status(400)
                .json({
                    error: '"url" tidak ditemukan atau tidak di dukung'
                });
        } 
        
        const data = await transform({
        imageUrl: url,
        prompt: prompt,
        model: "juggernaut_aftermath.safetensors [5e20c455]"
    })
       let link = await wait(data.job)
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data: {
                    link
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

// faceswap
router.get('/image/faceSwap', async (req, res) => {
    try {
        const { sourceUrl, targetUrl } = req.query;
        if (!sourceUrl || !targetUrl) {
            return res.status(400).json({
                error: '"url" tidak ditemukan atau tidak di dukung'
            });
        }

        const options = {
            method: 'POST',
            url: 'https://api.prodia.com/v1/faceswap',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'X-Prodia-Key': '4fe25ce7-f286-43f3-a4f7-315bd7752e72'
            },
            data: {
                targetUrl,
                sourceUrl
            }
        };

        const response = await axios.request(options);
        const data = response.data.job; 
        const url = await wait(data)
        res.status(200).json({
            status: 200,
            creator: global.creator,
            data: {
                url
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// faceswap
router.post('/image/upscale', async (req, res) => {
    try {
        const { imageUrl, resize, model } = req.body;

        // Validasi parameter
        if (!imageUrl) {
            return res.status(400).json({
                error: '"imageUrl" tidak ditemukan atau tidak didukung'
            });
        }

        if (!resize) {
            return res.status(400).json({
                error: '"resize" tidak ditemukan atau tidak didukung'
            });
        }

        if (!model) {
            return res.status(400).json({
                error: '"model" tidak ditemukan atau tidak didukung'
            });
        }

        // Parsing nilai resize agar menjadi angka
        const resizeNumber = Number(resize);
        if (isNaN(resizeNumber)) {
            return res.status(400).json({
                error: '"resize" harus berupa angka'
            });
        }

        // Membuat parameter untuk fungsi upscale
        const params = {
            imageUrl,
            resize: resizeNumber,
            model
        };

        // Memanggil fungsi upscale dengan parameter
        const data = await upscale(params);

        // Menunggu hasil job dan mendapatkan URL
        const url = await wait(data.job);

        // Mengirim response sukses
        res.status(200).json({
            status: 200,
            creator: global.creator,
            data: {
                url
            },
        });
    } catch (error) {
        // Mengirim response error
        res.status(500).json({
            error: error.message
        });
    }
});

//text2image
router.post('/image/txt2img', async (req, res) => {
    try {
       const { model, prompt, negative_prompt, style, steps, cfg_scale, seed, upscale, sampler, width, height } = req.body;
       if (!prompt && !negative_prompt) {
            return res.status(400)
                .json({
                    error: 'request body tidak valid'
                });
        }
        if (!model) {
            return res.status(400)
                .json({
                msg: 'Masukan jenis model text 2 image'
                });
        }
  
        const url = await A_genImage(model, prompt, negative_prompt, style, steps, cfg_scale, seed, upscale, sampler, width, height)
        res.status(200)
            .json({
                creator: creator,
                status: true,
                data: { 
                    prompt: prompt,
                    url
               }
               })
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.post('/image/txt2img-v2', async (req, res) => {
    try {
       const { model, prompt, negative_prompt, sampler } = req.body;
       const mod = await A_models()
       const sam = await A_sampler()
        if (!prompt && !negative_prompt) {
            return res.status(400)
                .json({
                    error: 'request body tidak valid'
                });
        }
        if (!model) {
            return res.status(400)
                .json({
                model: mod
                });
        }
        if (!sam) {
            return res.status(400)
                .json({
                    sampler: sam
                });
        }
  
  
        const json = await g4f.imageGeneration(prompt, { 
        debug: true,
        provider: g4f.providers.Prodia,
        providerOptions: {
            model: model,
            samplingSteps: 15,
            cfgScale: 30,
            negativePrompt: negative_prompt,
           sampler: sampler
            
        }
    })
       const link = await Func.uploadFile(await Buffer.from(json, 'base64'))
       const url = link.data.url
          res.status(200) 
              .json({
                 creator: creator,
                 status: true,
                 data: { 
                    prompt: prompt,
                    url
               }
            })  
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/image/txt2img-model', async (req, res) => {
    try {
        const data = await A_models();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/image/txt2img-style', async (req, res) => {
    try {
        const data = await A_style();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/image/txt2Img-sampler', async (req, res) => {
    try {
        const data = await A_sampler();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//vits
router.get('/audio/vits_inference', async (req, res) => {
    try {
       const { text, model_id } = req.query;
        if (!text) {
            return res.status(400)
                .json({
                    error: '"text" tidak ditemukan'
                });
        }
        if (!model_id) {
            return res.status(400)
                .json({
                    error: '"model_id" tidak ditemukan pastikan susunan endpoint nya sudah benar'
                });
        }
        const data = await vits_inference(text, model_id);
        //const au = await bufferlah(data)
        res.set('Content-Type', "audio/mpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/audio/vits_inference/emotion', async (req, res) => {
    try {
       const { text, model_id, emotion } = req.query;
        if (!text) {
            return res.status(400)
                .json({
                    error: '"text" tidak ditemukan'
                });
        }
        if (!model_id) {
            return res.status(400)
                .json({
                    error: '"model_id" tidak ditemukan pastikan susunan endpoint nya sudah benar'
                });
        }
        if (!emotion) {
            return res.status(400)
                .json({
                    error: '"emotion" tidak ditemukan pastikan susunan endpoint nya sudah benar'
                });
        }
  
        const data = await vits_emotion(text, model_id, emotion);
      //  const aui = await bufferlah(data)
        res.set('Content-Type', "audio/mpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/audio/vits_model', async (req, res) => {
    try {
        const data = await vits_model();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//gdrive 
router.post('/download/gdrive', async (req, res) => {
    try {
        const message = req.body.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const data = await GDriveDl(message);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//Twitterdl
router.get('/download/twitter', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    status: false,
                    msg: ' "url" tidak ditemukan'
                });
        }
        const data = await twitterdl(message);
        res.status(200).json({
            status: true,
            creator: global.creator,
            data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                status: false,
                msg: error.message
            });
    }
});

//Spotifydl
router.get('/search/spotify', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({ 
                    status: false,
                    msg: 'Parameter "query" tidak ditemukan'
                });
        }
        const result = await searchSpotify(message);
        const data = result
        res.status(200)
            .json({
                status: true,
                creator: global.creator,
                data
            });
    } catch (error) {
        res.status(500)
            .json({
                status: false,
                msg: error.message
            });
    }
});
router.get('/download/spotify', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    status: false,
                    msh: 'missing parameter "url"'
                });
        }
        const data = await spotifydl(message);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//sfiledl
router.get('/search/sfile', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const result = await sfileSearch(message);
        const data = result
        res.status(200)
            .json({
                status: true,
                creator: global.creator,
                data
            });
    } catch (error) {
        res.status(500)
            .json({
                status: false,
                msg: error.message
            });
    }
});
router.post('/download/sfile', async (req, res) => {
    try {
        const message = req.body.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const data = await sfiledl(message);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//rmbg2
router.post('/tools/removeBackgroundV2', async (req, res) => {
    try {
        const message = req.body.url;
        
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const data = await ToolRemoveBg(message);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            data: data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//capcut
router.get('/download/capcut', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const data = await capcutdl(message);
        delete data.code
        res.status(200).json({
            status: 200,
            creator: global.creator,
            data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/audio/whisper', async (req, res) => {
    try {
        const message = req.query.url;
        const data = await Func.bufferlah(message)
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const text = await wish(data);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            data: {
                ...text
            },
            model: {
                type: "whisper-large-v3",
                url: message
            }
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

// Endpoint untuk /api/gpt-completions
router.post('/ai/gpt-completions', async (req, res) => {
    try {
        // Memeriksa apakah body request sesuai dengan skema yang diharapkan
        const messages = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: 'Field "messages" is required and must be a non-empty array'
            });
        }

        // Lakukan pemrosesan pesan di sini, misalnya dengan memanggil fungsi gptRP
        const data = await gptRP(messages);

        // Kirim respons dengan data yang diproses
        res.status(200).json({
            status: 200,
            creator: global.creator,
            data: {
                msg: data,
                model: "GPT-4"
            }
        });
    } catch (error) {
        // Tangani kesalahan yang mungkin terjadi selama pemrosesan
        res.status(500).json({
            error: error.message
        });
    }
});

//emi
router.get('/image/emiXL', async (req, res) => {
    try {
        const message = req.query.prompt;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "prompt" tidak ditemukan'
                });
        }
        const data = await emi(message);
        const url = (await Func.uploadFile(data)).data.url
       res.status(200)
          .json({
              creator: creator,
              status: true,
              data: {
                 url
               }
            })
    } catch (error) {
        res.status(500)
            .json({
                status: false,
                msg: error.message
            });
    }
});

//mixtral
router.get('/image/mixtral-8x7B', async (req, res) => {
    try {
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        const data = await mixtral(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    output_text: data
                },
                models: {
                    name: "Mixtral-8x7B-Instruct"
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//animagen
router.get('/image/animagen_v1.0', async (req, res) => {
    try {
        const prompt = req.query.prompt; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: 'Parameter "promot" tidak ditemukan'
                });
        }
        const data = await animagen(`best quality,` + prompt);
        res.set('Content-Type', "image/jpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//hf loader
router.post('/image/hugging_face_model', async (req, res) => {
    try {
        const hfurl = req.body.model;
        const hfkey = req.body.hfkey; 
        const prompt = req.body.prompt// Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    status: false,
                    msg: 'Parameter "promot" tidak ditemukan'
                });
        }
        if (!hfkey && !hfurl) {
            return res.status(400)
                .json({
                    status: false,
                    msg: 'Parameter "apikey or url" tidak ditemukan'
                });
        }
        const data = await trained(prompt, hfkey, hfurl);
        const url = (await Func.uploadFile(data)).data.url
        res.set(200).json({
         creator: creator,
         status: true,
         data: {
             url
         }
         })
    } catch (error) {
        res.status(500)
            .json({
                status: false,
                msg: error.message
            });
    }
});
//cosmix sdxl
router.get('/image/cosmix_SDXL_LoRA', async (req, res) => {
    try {
        const prompt = req.query.prompt; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: 'Parameter "promot" tidak ditemukan'
                });
        }
        const data = await cosmix(`best quality,` + prompt);
       const url = (await Func.uploadFile(data)).data.url;
        res.set(200)
            .json({ 
                creator: creator,
                status: true,
                data: {
                   url
                  }
            })
    } catch (error) {
        res.status(500)
            .json({
                status: false,
                msg: error.message
            });
    }
});

//stable diffusion
router.get('/image/stable_diffusion_xl', async (req, res) => {
    try {
        const prompt = req.query.prompt; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: 'Parameter "promot" tidak ditemukan'
                });
        }
        const data = await sdf(`best quality,` + prompt);
        const json = await Func.uploadFile(data)
        const url = json.data.url
        res.set(200)
          .json({
                status: 200,
                creator: global.creator,
                data: {
                url
               }
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//hentaifox 
router.get('/hentaifox_search', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const result = await Func.fetchJson("https://janda.sinkaroid.org/hentaifox/search?key=" + message);
        const results = result.data
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                results,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/hentaifox_get', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const book = await Func.extractNumber(message)
        const result = await Func.fetchJson("https://janda.sinkaroid.org/hentaifox/get?book=" + book);
        const results = result.data
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                results,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//pinterest download 
router.get('/download/pinterest', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const result = await pindl(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//mediafire
router.get('/download/mediafire', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const result = await mediafireDl(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//chatbot 
router.get('/ai/simsimi', async (req, res) => {
    try {
        const message = req.query.text;
        const lang = req.query.lang;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await chatbot(message, lang);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//ttstalk
router.get('/tools/tiktok_stalk', async (req, res) => {
    try {
        const message = req.query.username;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "username" tidak ditemukan'
                });
        }
        const result = await ttstalk(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//otakudesu 
router.get('/otakudesu_episode', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const result = await otakudesuDetail(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/otakudesu_detail', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const result = await otakudesuDetail(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/otakudesu_search', async (req, res) => {
    try {
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        const result = await otakudesuSearch(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/otakudesu_latest', async (req, res) => {
    try {
        const data = await otakudesuLatest();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

// komiku
router.get('/komiku-search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400)
                .json({
                    error: 'Parameter "quert" tidak ditemukan'
                });
        }
        const data = await komikuSearch(query);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/komiku-detail', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await komikuDetail(url);
        delete data.isManga
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/komiku-latest', async (req, res) => {
    try {
   const data = await komikuLatest();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/komiku-get', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await komikuEps(url);
        delete data.isChapter
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//Avatar anime create 
router.get('/create_animeAvatar', async (req, res) => {
    try {
        const id = req.query.id;
        const signature = req.query.signature;
        const background = req.query.background_text;
        const color = req.query.color;
        if (!id && !signature && !background) {
            return res.status(400)
                .json({
                    error: 'Parameter tidak ditemukan'
                });
        }
        const data = await createImage(id, signature, background, color)
        res.set('Content-Type', "image/png");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/avatarId-get', async (req, res) => {
    try {

        const text = await getList()
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                avatar_id: text.data,

            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//dalle-mini 
router.get('/image/dalle-mini', async (req, res) => {
    try {
        const prompt = req.query.prompt; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: 'Parameter "prmpt" tidak ditemukan'
                });
        }
        const data = await Func.fetchBuffer("https://cute-tan-gorilla-yoke.cyclic.app/imagine?text=" + prompt)
        res.set('Content-Type', "image/jpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//imagine
router.get('/tools/removeBackground', async (req, res) => {
    try {
        const prompt = req.query.url; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await rembg(prompt)
        const url = (await Func.uploadFile(data)).data.url
        res.status(200)
             .json({
                 creator: creator,
                 status: true,
                 data: {
                    url
               }
          })
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//tiktok
router.get('/download/tiktok', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await ttd(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message + "check support lang in https://rentry.co/3qi3wqnr/raw"
            });
    }
});
//translate
router.get('/ai/gpt-translate', async (req, res) => {
    try {
        const message = req.query.text;
        const target = req.query.target

        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        if (!target) {
            return res.status(200)
                .json({
                    error: 'Parameter "target" tidak ditemukan'
                });
        }
        const data = await Func.gptTR(message, target);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message + "check support lang in https://rentry.co/3qi3wqnr/raw"
            });
    }
});
//GPT 3&4
router.get('/ai/gpt-3_5-turbo', async (req, res) => {
    try {
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        const data = await gpt3(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
                input: {
                    text: message
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/ai/gpt-4', async (req, res) => {
    try {
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        const data = await (await gpt4(message))

       res.status(200).json({
            status: 200,
            creator: global.creator,
            data
        });
    } catch (error) {
        // Tangani kesalahan yang mungkin terjadi selama pemrosesan
        res.status(500).json({
            error: error.message
        });
    }
});

router.get('/ai/nemotron', async (req, res) => {
    try {
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        const msg = await (await nemotron(message))
       res.status(200).json({
            creator: global.creator,
            status: true,
            data: {
               model: 'nemotron-4-340b',
               msg
            }
        });
    } catch (error) {
        // Tangani kesalahan yang mungkin terjadi selama pemrosesan
        res.status(500).json({
            status: false,
            msg: error.message
        });
    }
});
//blackbox 
router.get('/ai/blackbox', async (req, res) => {
    try {
        const message = req.query.text;
        const web = req.query.webSearchMode
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        if (!web) {
            return res.status(400)
                .json({
                    error: 'Parameter tidak ditemukan'
                });
        }
        if (web == "false") {
            const data2 = await blackbox(message, false);
            const bburl = "https://www.blackbox.ai/?q=" + encodeURIComponent(message)
            res.status(200)
                .json({
                    status: 200,
                    creator: global.creator,
                    result: {
                        text: data2,
                        webSearch: web,
                        api_url: {
                            url: bburl
                        }
                    },
                });
        } else if (web == "true") {
            const data = await blackbox(message, true);
            const bburl = "https://www.blackbox.ai/?q=" + encodeURIComponent(message)
            res.status(200)
                .json({
                    status: 200,
                    creator: global.creator,
                    result: {
                        text: data,
                        webSearch: web,
                        api_url: {
                            url: bburl
                        }
                    },
                });
        }
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//endpoint gemini
router.get('/ai/gemini', async (req, res) => {
    try {
   const { text } = req.query
   if (!text) return res.json({
      status: false,
      msg: `paramter "text" is required`
   })

   const data = await ask(text)
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
// endpoint gemini-image

//endpoint VOIXEVOX 
router.get('/audio/voicevox-synthesis', async (req, res) => {
    try {
        const speakerr = req.query.speaker
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        if (!speakerr) {
            return res.status(400)
                .json({
                    error: 'Parameter "speaker" tidak ditemukan pastikan susunan endpoint nya sudah benar'
                });
        }
        const data = await vox(message, speakerr);
        res.set('Content-Type', "audio/mpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/audio/voicevox-speaker', async (req, res) => {
    try {
        const data = await spe();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//pixiv 
router.get('/search/pixiv', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await pixiv(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/search/pixiv-r18', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await pixivr18(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//xnxx
router.get('/xnxx-dl', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await xnxxdl(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
router.get('/xnxx-search', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await xnxxsearch(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//Pinterest 
router.get('/search/pinterest', async (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).send('Query parameter "q" is required.');
    }

    try {
        const response = await axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + query, {
            headers: {
                "cookie": "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
            }
        });

        const $ = cheerio.load(response.data);
        const result = [];
        const hasil = [];
        
        $('div > a').get().forEach(b => {
            const link = $(b).find('img').attr('src');
            result.push(link);
        });

        result.forEach(v => {
            if (v) {
                hasil.push(v.replace(/236/g, '736'));
            }
        });

        hasil.shift(); // Remove first item which might not be needed

        res.json({
            creator: "Masha - Forx Code",
            status: true,
            hasil: hasil
        });

    } catch (error) {
        res.status(500).json({
            creator: "Masha - Forx Code",
            status: false,
            message: error.message
        });
    }
});
//wallpaper
router.get('/search/wallpaper', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await wallpaper(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//Facebook & Instagram
router.get('/download/ig', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await snapsave(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                ...data
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

router.get('/download/fb', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await snapsave(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                ...data
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//system
router.get('/info-os', async (req, res) => {
    try {
function getSystemInfo() {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  const systemInfo = {
    "Program information": {
      "Protocol": "https",
      "Hostname": os.hostname(),
      "Path": "/os",
      "Uptime": `${uptime}s`,
      "Running on": `${os.type()}/${os.release()}`,
      "platform": os.platform(),
      "arch": os.arch(),
      "Root": "/home/container/swagger",
      "Framework": `Nodejs (${process.version})`,
      "Language": "JavaScript",
      "Memory": `${(memoryUsage.rss / (1024 * 1024)).toFixed(2)} MB`,
      "CPU Usage": `${(process.cpuUsage().user / 1000).toFixed(2)} ms`,
      "Process ID": process.pid,
      "Folder": "/home/container/swagger",
      "Environment": process.env.NODE_ENV || 'development',
      "Arguments": process.argv,
      "Refresh": "",
      "Node.js Version": process.version,
      "Node.js ": process.argv[0],
      "Node.js PID": process.pid,
      "EOF Code": "none",
      "Is Debugging": process.execArgv.includes('--inspect') ? "Yes" : "No",
      "Signal Received": "none",
      "TTY": process.stdout.isTTY ? "Yes" : "No",
      "User ID": process.getuid ? process.getuid() : null,
      "Group ID": process.getgid ? process.getgid() : null,
      "CPU Arch": os.arch(),
      "HOMEDIR": os.homedir(),
      "TEMP DIR": os.tmpdir(),
      "Node.js Title": process.title,
      "Critical Error": "No",
      "Dtrace": "No",
      "Debug Port": 9229,
      "Executable": process.argv[0]
    }
  };

  return systemInfo;
}
        res.status(200).json({
            creator: global.creator,
            status: true,
            ...getSystemInfo()
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
 
router.get('/info-ip', async (req, res) => {
    try {
      const json = await Func.fetchJson('https://api64.ipify.org?format=json')
      let ip = json.ip
    res.status(200).json({
            creator: global.creator,
            status: true,
            data: ip
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
router.get('/runtime', async (req, res) => {
    try {
        const seconds = process.uptime();

        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        const uptime = `${days}d ${hours}h ${minutes}m ${secs}s`;

        res.status(200).json({
            status: 200,
            creator: global.creator,
            data: uptime
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

async function CarbonifyV1(input) {
  let Blobs = await fetch("https://carbonara.solopov.dev/api/cook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "code": input
    })
  }).then(response => response.blob())
  let arrayBuffer = await Blobs.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);
  return buffer
}

async function chord(query) {
  return new Promise(async(resolve, reject) => {
   const head = {"User-Agent":"Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
	  "Cookie":"__gads=ID=4513c7600f23e1b2-22b06ccbebcc00d1:T=1635371139:RT=1635371139:S=ALNI_MYShBeii6AFkeysWDKiD3RyJ1106Q; _ga=GA1.2.409783375.1635371138; _gid=GA1.2.1157186793.1635371140; _fbp=fb.1.1635371147163.1785445876"};
  let { data } = await axios.get("http://app.chordindonesia.com/?json=get_search_results&exclude=date,modified,attachments,comment_count,comment_status,thumbnail,thumbnail_images,author,excerpt,content,categories,tags,comments,custom_fields&search="+query, {headers: head});
	axios.get("http://app.chordindonesia.com/?json=get_post&id="+data.posts[0].id, {
	  headers: head
	}).then(anu => {
	  let $ = cheerio.load(anu.data.post.content);
	  resolve({
	    title: $("img").attr("alt"),
	    chord: $("pre").text().trim()
	  });
	}).catch(reject);
});
}
module.exports = router
