const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch');
const got = require('got')
const { JSDOM } = require('jsdom')
const path = require('path');
const jimp = require('jimp');
const FormData = require("form-data");
const { G4F } = require("g4f")
const g4f = new G4F()
const moment = require('moment-timezone')
const googlekey = "AIzaSyDlVL56PsGBi0Re5eZYTc0FWbYe2I5K6fY"



  exports.xnxxdl = async (URL) => {
	return new Promise((resolve, reject) => {
		fetch(`${URL}`, {method: 'get'})
		.then(res => res.text())
		.then(res => {
			let $ = cheerio.load(res, {
				xmlMode: false
			});
			const title = $('meta[property="og:title"]').attr('content');
			const duration = $('meta[property="og:duration"]').attr('content');
			const image = $('meta[property="og:image"]').attr('content');
			const videoType = $('meta[property="og:video:type"]').attr('content');
			const videoWidth = $('meta[property="og:video:width"]').attr('content');
			const videoHeight = $('meta[property="og:video:height"]').attr('content');
			const info = $('span.metadata').text();
			const videoScript = $('#video-player-bg > script:nth-child(6)').html();
			const files = {
				low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
				high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
				HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
				thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
				thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
				thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
				thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1],
			};
			resolve({
				result: {
					title,
					URL,
					duration,
					image,
					videoType,
					videoWidth,
					videoHeight,
					info,
					files
				}
			})
		})
		.catch(err => reject({code: 503, status: false, result: err }))
	})
                        }
/* gemini vision
 * By Forx
*/
exports.askImage = async (inputTextt, inputImage) => {
	const bufer = await bufferlah(inputImage)
	const bup = await Resize(bufer)
	const requestBody = {
		"contents": [

			{
				"parts": [

					{
						"text": inputTextt
					},

					{
						"inline_data": {
							"mime_type": "image/jpeg",
							"data": bup.toString('base64')
						}
					}

				]
			}

		]
	};
	const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googlekey}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});
	const data = await response.json();
	console.log(data);
	return data.candidates[0].content.parts[0].text;
}
   /* XnxxSearch
    * @param {String} query
    */
   exports.xnxxsearch = async (query) => {
	return new Promise((resolve, reject) => {
		const baseurl = 'https://www.xnxx.com'
		fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {method: 'get'})
		.then(res => res.text())
		.then(res => {
			let $ = cheerio.load(res, {
				xmlMode: false
			});
			let title = [];
			let url = [];
			let desc = [];
			let results = [];

			$('div.mozaique').each(function(a, b) {
				$(b).find('div.thumb').each(function(c, d) {
					url.push(baseurl+$(d).find('a').attr('href').replace("/THUMBNUM/", "/"))
				})
			})
			$('div.mozaique').each(function(a, b) {
				$(b).find('div.thumb-under').each(function(c, d) {
					desc.push($(d).find('p.metadata').text())
					$(d).find('a').each(function(e,f) {
					    title.push($(f).attr('title'))
					})
				})
			})
			for (let i = 0; i < title.length; i++) {
				results.push({
					title: title[i],
					info: desc[i],
					link: url[i]
				})
			}
			resolve({
				result: results
			})
		})
		.catch(err => reject({code: 503, status: false, result: err }))
	})
   }

exports.pin = async (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`, {
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "accept-language": "en-US,en;q=0.5"
            }
        }).then(({ data }) => {
            const $ = cheerio.load(data);
            const result = [];
            const images = $('div > a').map((i, elem) => {
                const imgSrc = $(elem).find('img').attr('src');
                if (imgSrc) {
                    return imgSrc.replace(/236/g, '736'); // Mengganti ukuran gambar
                }
            }).get();
            
            result.push(...images);
            resolve(result);
        }).catch(err => {
            reject({ code: 503, status: false, result: err });
        });
    });
};

async function Gpt4o(query) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://yanzgpt.my.id/chat',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.153 Mobile/15E148 Safari/604.1',
                'Referer': 'https://yanzgpt.my.id/chat'
            },
            data: {
                query: `Kamu berperan sebagai Furina Ai. Jawab pertanyaan berikut dengan tetap menjadi Furina Ai, namun jangan sebut namamu kecuali jika pengguna bertanya atau menyinggung siapa namamu. Pertanyaan: ${query}`,
                model: 'GPT-4o'
            }
        });

        return response.data.message.replace(/\\/g, '').replace(/\*\*/g, '*').replace(/###/g, '>');
    } catch (error) {
        console.error('Error fetching', error.message);
        throw error;
    }
}

exports.wallpaper = async (title, page = '1')  => {
	return new Promise((resolve, reject) => {	
		axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`).then(({	
			data	
		}) => {	
			let $ = cheerio.load(data)	
			let hasil = []	
			$('div.grid-item').each(function(a, b) {	
				hasil.push({	
					title: $(b).find('div.info > a > h3').text(),	
					type: $(b).find('div.info > a:nth-child(2)').text(),	
					source: 'https://www.besthdwallpaper.com/' + $(b).find('div > a:nth-child(3)').attr('href'),	
					image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]	
				})	
			})	
			resolve(hasil)	
			
		})	
	})	
}

  exports.snapsave = async (url) =>{
  return new Promise(async (resolve) => {
  try {
  function decodeSnapApp(args) {
  let [h, u, n, t, e, r] = args
  // @ts-ignore
  function decode (d, e, f) {
  const g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('')
  let h = g.slice(0, e)
  let i = g.slice(0, f)
  // @ts-ignore
  let j = d.split('').reverse().reduce(function (a, b, c) {
  if (h.indexOf(b) !== -1)
  return a += h.indexOf(b) * (Math.pow(e, c))
  }, 0)
  let k = ''
  while (j > 0) {
  k = i[j % f] + k
  j = (j - (j % f)) / f
  }
  return k || '0'
  }
  r = ''
  for (let i = 0, len = h.length; i < len; i++) {
  let s = ""
  // @ts-ignore
  while (h[i] !== n[e]) {
  s += h[i]; i++
  }
  for (let j = 0; j < n.length; j++)
  s = s.replace(new RegExp(n[j], "g"), j.toString())
  // @ts-ignore
  r += String.fromCharCode(decode(s, e, 10) - t)
  }
  return decodeURIComponent(encodeURIComponent(r))
  }
  function getEncodedSnapApp(data) {
  return data.split('decodeURIComponent(escape(r))}(')[1]
  .split('))')[0]
  .split(',')
  .map(v => v.replace(/"/g, '').trim())
  }
  function getDecodedSnapSave (data) {
  return data.split('getElementById("download-section").innerHTML = "')[1]
  .split('"; document.getElementById("inputData").remove(); ')[0]
  .replace(/\\(\\)?/g, '')
  }
  function decryptSnapSave(data) {
  return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)))
  }
  const html = await got.post('https://snapsave.app/action.php?lang=id', {
  headers: {
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'content-type': 'application/x-www-form-urlencoded','origin': 'https://snapsave.app',
  'referer': 'https://snapsave.app/id',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
  },
  form: { url }
  }).text()
  const decode = decryptSnapSave(html)
  const $ = cheerio.load(decode)
  const results = []
  if ($('table.table').length || $('article.media > figure').length) {
  const thumbnail = $('article.media > figure').find('img').attr('src')
  $('tbody > tr').each((_, el) => {
  const $el = $(el)
  const $td = $el.find('td')
  const resolution = $td.eq(0).text()
  let _url = $td.eq(2).find('a').attr('href') || $td.eq(2).find('button').attr('onclick')
  const shouldRender = /get_progressApi/ig.test(_url || '')
  if (shouldRender) {
  _url = /get_progressApi\('(.*?)'\)/.exec(_url || '')?.[1] || _url
  }
  results.push({
  resolution,
  thumbnail,
  url: _url,
  shouldRender
  })
  })
  } else {
  $('div.download-items__thumb').each((_, tod) => {
  const thumbnail = $(tod).find('img').attr('src')
  $('div.download-items__btn').each((_, ol) => {
  let _url = $(ol).find('a').attr('href')
  if (!/https?:\/\//.test(_url || '')) _url = `https://snapsave.app${_url}`
  results.push({
  thumbnail,
  url: _url
  })
  })
  })
  }
  if (!results.length) return resolve({ msg: `Blank data` })
  return resolve({ data: results })
  } catch (e) {
  return resolve({ msg: e.message })
  }
  })
}

exports.ttstalk = async (username) => {
	let retryCount = 0;
	while (retryCount < 3) {
		try {
			const response = await axios.get(`https://tiktok.com/@${username}`);
			const $ = cheerio.load(response.data);
			const userData = JSON.parse($('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text()).__DEFAULT_SCOPE__['webapp.user-detail'].userInfo;
			
			const userInfo = {
				data: {
					...userData.user,
					...userData.stats
				}
			};
			
			return userInfo;
		} catch (err) {
			retryCount++;
		}
	}
	return { error: true };
}

  exports.chatbot = async (text, lang = 'id') => {
   return new Promise(async resolve => {
      try {
         let form = new URLSearchParams
         form.append('text', text)
         form.append('lc', lang)
         const json = await (await axios.post('https://api.simsimi.vn/v1/simtalk', form, {
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            }
         })).data
         resolve({
            msg: json.message
         })
      } catch (e) {
         resolve({
            msg: e.message
         })
      }
   })
}

exports.mediafireDl = async (url) => {
const res = await axios.get(url) 
const $ = cheerio.load(res.data)
const hasil = []
const link = $('a#downloadButton').attr('href')
const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '')
const seplit = link.split('/')
const nama = seplit[5]
mime = nama.split('.')
mime = mime[1]
hasil.push({ nama, mime, size, link })
return hasil
}

const pinterestHeaders = {
    "sec-ch-ua": "\"Chromium\";v=\"90\", \"Opera GX\";v=\"76\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "upgrade-insecure-requests": "1",
    "cookie": '_b="AV/K4MPPSOhA85mqWtEGnzzVEavd7ss6OigPSN2qq1c2gIDCN9GIOv88dRkR9X7k1Js="; _auth=1; _pinterest_sess=TWc9PSZndXd6Ylo0emM4VXNwWW9Ua0xNTmIrV3YwenVreXNmS3Bpd04wMUx4VFlDc2xyaXY5a2NqWE9CMWZIUVZBYytmaWpNVElQWkhDQTAycHNVYmFyZ0hrMjJjRVNZZkJGN0tVOXMxazBBMUtpM0ZyOGRFWlQrMm56Y3l3UEkvTjFTWG5uc2ZuSTY5V01GTS9oWmlSaVQvZUwxemhTMG1HK0tlQy82Ni9VM2xzYnpEVzJHWTBYWnM1YXNlQ2NGS29vZ3N4M011eFF1ZmdBR3VDSFlZZWJIVUo5YTd0S205YkVyWlBHNVQvdGRYaHIzOWRzb0czN1JEM2x3aEtLNEVPNHpKMnp0bVVnNVF2WDFRbTJlWDdVMk9HUng0MVpwYitnQjFPU2RBRlY0QURlaVBndTB1TjYyS3phR2RpNWVYZEhkR1paTDBOVUtGOXZJdk15SEJFNTV2a1VVdGd1enRGMUZkRXB1VUVXeEs0S3lTakF4eFFZVFhlSGhGSm5YRThGcTZrRUJEY2wzQkVNNDZnODZnOE1EQ2hUTm5oOHBXaTgvYjA3enlyYlZwVEpaa1B2YjNtSUQ1WVRaK0gwRm9STUlTaS9SSEdhWXh4MWhuaENidk5CY0d2SXZabUpaWTQ4YWlRTWRoclVaVmphdHBrQ3F4YTZ2V0FJclA1UFcwQ0tndFR3ckZYZm1ySkFQbmNWZk15UVpnSW5TS0lzZEhJQWh4eEtpaEZXU3c4UVV0bEtWRUozTFZOV08xNWdicC9VVUpQdHk4b05wd1k5ZWhCSGpwVUxoTUJtYkNpenNvbEFuZUwzVmE0clRybGRRVmloeTNvb2k3R3RXQXlLQUxKNVFtQUZ5ajRDcjlEOEYxbUNGdWxtb3NQWGNBV21vSElzbXZML0tHL3YvemJEeWRQWVdFOUhMQUYzVkhLUTh4d2oyMU1mQkZBSXFHYU80SGRFL1dqVFgzdzBUczdsVHhIbHYxamx2Tm8xT1ZteUloRGtvQUI0NWVjQ2ZVN3RMaXVOaWtJSUprTlJVVUxEMXpZNGlYNktSOU4wdGZJVVg1bGg4NWVSdWZXY3ZYNE5FPSZhZHM5MGUxR1hkd3d2bU5YNG9iV1E5WVNmRFE9; csrftoken=ec0ac84a7ae235f5b8ab7d63bbe380f3; _routing_id="fb765351-a028-4475-80ec-79cb4bc417e2"; sessionFunnelEventLogged=1'
}
exports.pindl = async (url) => {
        try {
            const uri = await axios.get(url).then(res => {
                let nganu = new URL(res.request.res.responseUrl)
                pathname = nganu.pathname
                return nganu.origin + pathname.slice(0, pathname.lastIndexOf('/'));
            })
            const { data } = await axios.get(uri, { headers: pinterestHeaders })
            const dom = new JSDOM(data).window.document
            let re = JSON.parse(dom.getElementById('__PWS_DATA__').innerHTML)
            const json = re.props.initialReduxState.pins[Object.keys(re.props.initialReduxState.pins)]
            let result = {
                title: json.title,
                media: json.videos !== null ? json.videos.video_list[Object.getOwnPropertyNames(json.videos.video_list)[0]] : json.images.orig,
                extension: json.videos !== null ? 'mp4' : 'jpg',
                created_at: json.created_at,
                id: json.id,
                ...json
            }
            return result
        } catch (error) {
            return error
        }
    }
exports.ttd = async (url) => {
    try {
    const apiUrl = 'https://snapdouyin.app/wp-json/aio-dl/video-data/';

    const headers = {
    "content-type": "application/x-www-form-urlencoded",
}

        const params = new URLSearchParams();
        params.append('url', url);

        const response = await fetch(apiUrl, { method: "POST", body: params, headers });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        throw new Error(`An error occurred: ${error.message}`);
    }
}



//function GPT 3
exports.gpt3 = async (text) => {
    const messages = [

        {
            role: "system",
            content: "Saya adalah MashaChat AI yang dikembangkan oleh Forx Senhire dengan basis gpt-3.5-turbo. Saya dirancang untuk membantu Anda dengan pertanyaan dan informasi yang Anda perlukan. Ada yang bisa saya bantu?"
        },

        {
            role: "user",
            content: text
        },

    ];
    const options = {
        provider: g4f.providers.GPT,
        model: "gpt-3.5-turbo",
        debug: true,
        proxy: ""
    }
    const json = await g4f.chatCompletion(messages, options);
    return json
}

exports.gpt4 = async (text) => {
  const currentTime = moment().tz('Asia/Jakarta').format('LLLL');
    
    const messages = [
        {
            role: "system",
            content: `Saya adalah MashaChat AI yang dikembangkan oleh Forx Senhire dengan basis gpt-4 32k. Saya dirancang untuk membantu Anda dengan pertanyaan dan informasi yang Anda perlukan. aku akan menjawab pertanyaan mu dengan rinci dan detail. Saat ini adalah ${currentTime}. Ada yang bisa saya bantu?`
        },
        {
            role: "user",
            content: text
        }
    ];

    const options = {
        provider: g4f.providers.GPT,
        model: "gpt-4-32k-0314",
        debug: true,
    };

    const json = await g4f.chatCompletion(messages, options);
    return json;
}

//function pixiv
exports.pixiv = async (text) => {
    return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=0&num=20&keyword=" + text)
        .then(data => data.data.data);
}

exports.pixivr18 = async (text) => {
    return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=1&num=20&keyword=" + text)
        .then(data => data.data.data);
}

//fungsi VOICEVOX
exports.vox = async (text, speaker) => {
    const keysi = await Func.random(["R_m8Q8e8s2r808k", "U282o-0-04r-x_O"])
    const urlnya =
        `https://deprecatedapis.tts.quest/v2/voicevox/audio/?key=${keysi}&speaker=${speaker}&pitch=0&intonationScale=1&speed=1&text=${encodeURIComponent(text)}`
    let buf = Func.fetchBuffer(urlnya)
    return buf;
}
//fungsi Speaker VOICEVOX
exports.spe = async () => {
    const urlnya = await Func.fetchJson(`https://deprecatedapis.tts.quest/v2/voicevox/speakers/?key=R_m8Q8e8s2r808k`)
    return urlnya;
}
//fungsi gemini
exports.ask = async (inputText) => {
    // For text-only input, use the gemini-pro model
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + googlekey;
    const headers = {
        'Content-Type': 'application/json'
    };
    const data = {
        contents: [{
            parts: [{
                text: inputText
            }]
        }]
    };
    const response = await axios.post(url, data, {
        headers
    })
    console.log(response.data);
    return response.data.candidates[0].content.parts[0].text;
}


const determineMimeType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg'].includes(extension)) {
        return 'image/jpeg';
    } else if (['png'].includes(extension)) {
        return 'image/png';
    } else if (['mp4'].includes(extension)) {
        return 'video/mp4';
    } else if (['mpeg'].includes(extension)) {
        return 'video/mpeg';
    } else if (['avi'].includes(extension)) {
        return 'video/avi';
    } else if (['mov'].includes(extension)) {
        return 'video/quicktime';
    } else if (['wmv'].includes(extension)) {
        return 'video/x-ms-wmv';
    } else if (['flv'].includes(extension)) {
        return 'video/x-flv';
    } else if (['wav'].includes(extension)) {
        return 'audio/wav';
    } else if (['mp3'].includes(extension)) {
        return 'audio/mpeg';
    } else if (['pdf'].includes(extension)) {
        return 'application/pdf';
    } else {
        throw new Error('Unsupported file type');
    }
};


//fungsi black box
exports.blackbox = async (content, web) => {
    const url = "https://www.blackbox.ai/api/chat"
    const headers = {
        "Accept": "*/*",
        "Accept-Language": "id-ID,en;q=0.5",
        "Referer": "https://www.blackbox.ai/",
        "Content-Type": "application/json",
        "Origin": "https://www.blackbox.ai",
        "Alt-Used": "www.blackbox.ai"
    }
    const data = {
        messages: [{
            role: "user",
            content
        }],
        id: "chat-free",
        previewToken: null,
        userId: "",
        codeModelMode: true,
        agentMode: {},
        trendingAgentMode: {},
        isMicMode: false,
        userSystemPrompt: "You are BlacBox Ai, a useful AI Model for millions of developers using Blackbox Code Chat that will answer coding questions and help them when writing code.",
        maxTokens: 1024,
        webSearchMode: web,
        promptUrls: "",
        isChromeExt: false,
        githubToken: null
    }
    try {
        const blackboxResponse = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        })
        const blackboxData = await blackboxResponse.text()
        return blackboxData
    } catch (error) {
        console.error("Error fetching data:", error)
        return null
    }
}
exports.gptRP = async (data) => {
     const messages = data; 
     const options = {
        provider: g4f.providers.GPT,
        model: "gpt-4-32k-0314",
        debug: true,
        }
return g4f.chatCompletion(messages, options)
}

exports.toAnime = async (buffer) => {
    try {
        
        const base64String = buffer.toString('base64');

        const apiResponse = await axios.post('https://www.drawever.com/api/photo-to-anime', {
            data: `data:image/png;base64,${base64String}`,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return 'https://www.drawever.com' + apiResponse.data.urls[1] || 'https://www.drawever.com' + apiResponse.data.urls[0];
    } catch (error) {
        console.log(error)
    }
}
exports.ttz = async (text, character) => {
    const models = {
        miku: { voice_id: "67aee909-5d4b-11ee-a861-00163e2ac61b", voice_name: "Hatsune Miku" },
        nahida: { voice_id: "67ae0979-5d4b-11ee-a861-00163e2ac61b", voice_name: "Nahida (Exclusive)" },
        nami: { voice_id: "67ad95a0-5d4b-11ee-a861-00163e2ac61b", voice_name: "Nami" },
        ana: { voice_id: "f2ec72cc-110c-11ef-811c-00163e0255ec", voice_name: "Ana(Female)" },
        optimus_prime: { voice_id: "67ae0f40-5d4b-11ee-a861-00163e2ac61b", voice_name: "Optimus Prime" },
        goku: { voice_id: "67aed50c-5d4b-11ee-a861-00163e2ac61b", voice_name: "Goku" },
        taylor_swift: { voice_id: "67ae4751-5d4b-11ee-a861-00163e2ac61b", voice_name: "Taylor Swift" },
        elon_musk: { voice_id: "67ada61f-5d4b-11ee-a861-00163e2ac61b", voice_name: "Elon Musk" },
        mickey_mouse: { voice_id: "67ae7d37-5d4b-11ee-a861-00163e2ac61b", voice_name: "Mickey Mouse" },
        kendrick_lamar: { voice_id: "67add638-5d4b-11ee-a861-00163e2ac61b", voice_name: "Kendrick Lamar" },
        angela_adkinsh: { voice_id: "d23f2adb-5d1b-11ee-a861-00163e2ac61b", voice_name: "Angela Adkinsh" },
        eminem: { voice_id: "c82964b9-d093-11ee-bfb7-e86f38d7ec1a", voice_name: "Eminem" }
    };

    if (!models[character]) {
        throw new Error('Invalid character voice specified');
    }

    const voice = models[character];

    const getInspepek = () => `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

    const InsAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.1.2 Safari/602.3.12",
        "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36"
    ];
    const randomInsAgent = InsAgents[Math.floor(Math.random() * InsAgents.length)];

    const ngeloot = {
        raw_text: text,
        url: "https://filme.imyfone.com/text-to-speech/anime-text-to-speech/",
        product_id: "200054",
        convert_data: [
            {
                voice_id: voice.voice_id,
                speed: "1",
                volume: "50",
                text,
                pos: 0
            }
        ]
    };

    const rekuesanu = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'X-Forwarded-For': getInspepek(),
            'User-Agent': randomInsAgent
        }
    };

    try {
        const useanu = await axios.post('https://voxbox-tts-api.imyfone.com/pc/v1/voice/tts', JSON.stringify(ngeloot), rekuesanu);
        const { channel_id, oss_url } = useanu.data.data.convert_result[0];
        return { channel_id, oss_url, voice_id: voice.voice_id, voice_name: voice.voice_name };
    } catch (error) {
        console.error('Error in TTS conversion:', error);
        throw new Error('Failed to convert text to speech');
    }
}
exports.openai = async (messages) => {
    return new Promise(async resolve => {
        const response = await axios.post('https://nexra.aryahcr.cc/api/chat/complements', {
            messages: messages,
            conversation_style: "Balanced",
            markdown: false,
            stream: true,
            model: "Bing"
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: "stream"
        });

        let accumulatedChunks = [];
        let tmp = null;

        response.data.on("data", (chunk) => {
            let chk = chunk.toString().split("");

            chk.forEach((data) => {
                try {
                    let parsedData = JSON.parse(data);
                    if (parsedData.message) {
                        accumulatedChunks.push(parsedData.message);
                    }
                    tmp = null;
                } catch (e) {
                    if (tmp === null) {
                        tmp = data;
                    } else {
                        tmp += data;
                        try {
                            let parsedData = JSON.parse(tmp);
                            if (parsedData.message) {
                                accumulatedChunks.push(parsedData.message);
                            }
                            tmp = null;
                        } catch (e) {
                            // Continue accumulating data
                        }
                    }
                }
            });
        });

        response.data.on("end", () => {
            if (accumulatedChunks.length > 0) {
                let longestMessage = accumulatedChunks
                    .filter(message => message !== null) // Filter out null values
                    .reduce((longest, current) => {
                        return current.length > longest.length ? current : longest;
                    }, "");

                console.log(longestMessage);
                resolve(longestMessage)
            } else {
                console.log({
                    code: 500,
                    status: false,
                    error: "INTERNAL_SERVER_ERROR",
                    message: "No valid message received"
                });
            }
        });

        response.data.on("error", (err) => {
            console.log({
                code: 500,
                status: false,
                error: "INTERNAL_SERVER_ERROR",
                message: "Stream error occurred"
            });
        });
})
};
