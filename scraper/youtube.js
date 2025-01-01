const axios = require('axios');
const yts = require('yt-search');

const getId = (url) => {
    const match = url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|shorts\/|v=)([^#\&\?]*).*/);
    return match ? match[2] : null;
}

const qualityFind = (links, quality) => {
    const qualities = Object.values(links);
    const exactMatch = qualities.find(link => link.q === quality);

    if (exactMatch) {
        return { key: exactMatch.k, size: exactMatch.size };
    }

    const availableQualities = qualities.map(link => ({
        quality: link.q,
        key: link.k,
        size: link.size
    }));

    const closestMatch = availableQualities.reduce((prev, curr) => {
        return Math.abs(parseInt(curr.quality) - parseInt(quality)) < Math.abs(parseInt(prev.quality) - parseInt(quality)) ? curr : prev;
    });

    return { key: closestMatch.key, size: closestMatch.size };
}

async function ytmp3(videoUrl) {
    try {
        const videoID = getId(videoUrl);
        const video = await yts({ videoId: videoID });

        const params = new URLSearchParams();
        params.append('query', video.url);
        params.append('vt', 'downloader');

        const { data: searchData } = await axios.post('https://tomp3.cc/api/ajax/search?hl=en', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (searchData.status !== 'ok') return { creator: 'Luthfi Joestars', status: false, msg: 'Search data failed!' }

        const convertParams = new URLSearchParams();
        convertParams.append('vid', searchData.vid);
        convertParams.append('k', searchData.links.mp3[`mp3128`].k);

        const { data: convertData } = await axios.post('https://tomp3.cc/api/ajax/convert', convertParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (convertData.status !== 'ok') return { creator: 'Luthfi Joestars', status: false, msg: 'Failed to convert!' }

        return {
            creator: 'Luthfi Joestars',
            status: true,
            title: video.title,
            thumbnail: video.thumbnail,
            duration: video.timestamp,
            channel: video.author.name,
            views: video.views,
            publish: video.ago,
            data: {
                filename: `${video.title}.mp3`,
                size: searchData.links.mp3[`mp3128`].size,
                quality: '128kbps',
                extension: 'mp3',
                url: convertData.dlink
            }
        };
    } catch (e) {
       return { creator: 'Luthfi Joestars', 
                status: false, 
                msg: e.message 
         }
    }
}

async function ytmp4(videoUrl, resolution = '480p') {
    try {
        const videoID = getId(videoUrl);
        const video = await yts({ videoId: videoID });

        const params = new URLSearchParams();
        params.append('query', video.url);
        params.append('vt', 'downloader');

        const { data: searchData } = await axios.post('https://tomp3.cc/api/ajax/search?hl=en', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (searchData.status !== 'ok') return { creator: 'Luthfi Joestars', status: false, msg: 'Search data failed!' }
        
        const format = qualityFind(searchData.links.mp4, resolution)
        const convertParams = new URLSearchParams();
        convertParams.append('vid', searchData.vid);
        convertParams.append('k', format.key);

        const { data: convertData } = await axios.post('https://tomp3.cc/api/ajax/convert', convertParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (convertData.status !== 'ok') return { creator: 'Luthfi Joestars', status: false, msg: 'Failed to convert!' }

        return {
            creator: 'Luthfi Joestars',
            status: true,
            title: video.title,
            thumbnail: video.thumbnail,
            duration: video.timestamp,
            channel: video.author.name,
            views: video.views,
            publish: video.ago,
            data: {
                filename: `${video.title}.mp4`,
                size: format.size,
                quality: resolution,
                extension: 'mp4',
                url: convertData.dlink
            }
        };
    } catch (error) {
        return { creator: 'Luthfi Joestars', 
                status: false, 
                msg: error.message 
        }
    }
}

async function play(query) {
    try {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append("lang", 'en');

    const t = await axios.post("https://tomp3.cc/api/ajax/search?hl=en", params, {
      headers: {
        'user-agent': "Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36",
        'origin': "https://tomp3.cc",
        'referer': "https://tomp3.cc/en"
      }
    });
    const url = t.data.items[0].v
    const video = await yts({ videoId: url })
    const paramsCo = new URLSearchParams();
        paramsCo.append('query', video.url);
        paramsCo.append('vt', 'downloader');

        const { data: searchData } = await axios.post('https://tomp3.cc/api/ajax/search?hl=en', paramsCo.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (searchData.status !== 'ok') throw new Error('Search failed.');

        const convertParams = new URLSearchParams();
        convertParams.append('vid', searchData.vid);
        convertParams.append('k', searchData.links.mp3['mp3128'].k);

        const { data: convertData } = await axios.post('https://tomp3.cc/api/ajax/convert', convertParams.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (convertData.status !== 'ok') throw new Error('MP3 conversion failed.');

        return {
            creator: 'Luthfi Joestars',
            status: true,
            title: video.title,
            thumbnail: video.thumbnail,
            duration: video.timestamp,
            channel: video.author.name,
            views: video.views,
            publish: video.ago,
            data: {
                filename: `${video.title}.mp3`,
                size: searchData.links.mp3['mp3128'].size,
                quality: '128kbps',
                extension: 'mp3',
                url: convertData.dlink
            }
        };
    } catch (error) {
        return { creator: 'Luthfi Joestars', 
                status: false, 
                msg: error.message 
        }
    }
}

module.exports = { ytmp3, ytmp4, play };