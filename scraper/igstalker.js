const axios = require('axios');
const cheerio = require('cheerio');


exports.igsearch = async (username) => {
return new Promise(async (resolve, reject) => {
axios.get('https://dumpoir.com/search?query=' + username)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    
    const avatars = [];
    
    $('.avatar').each((index, element) => {
      const avatar = {};
      avatar.username = $(element).find('.text-sm').text();
      avatar.Link = `https://dumpoir.com${$(element).find('a').attr('href')}`;
      avatar.imageSrc = $(element).find('img').attr('src');
      avatar.profileLink = `https://www.Instagram.com/${$(element).find('.text-sm').text()}`
      avatars.push(avatar);
    });
    
    console.log(avatars);
    resolve(avatars)
  })
  .catch(error => {
    console.log(error);
  });
  })
  }

exports.igstalk = async (profileLink, cnt) => {
    const hah = await getUsernameFromUrl(profileLink)
    const url = `https://dumpoir.com/v/${hah}`;
    console.log(hah)
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    
    const profileImage = $('div.avatar img').attr('src');
    const username = $('h1').text().trim();
    const name = $('h2').text().trim();
    const bio = $('div.text-sm.font-serif').text().trim();
    const followers = parseInt($('div.stat-value.text-secondary').eq(0).text());
    const following = parseInt($('div.stat-value').eq(1).text());
    const postsCount = parseInt($('div.stat-value').eq(2).text());

    
    const posts = [];
    $('div.card').each((index, element) => {
        if (index < cnt) { //cnt ini buat jumlah result post nya yak syg.
            const postImage = $(element).find('img').attr('src');
            const description = $(element).find('p.font-sans').text().trim();

            posts.push({
                post_image: postImage,
                description: description
            });
        }
    });

   
    return {
        profile_image: profileImage,
        username: username,
        name: name,
        bio: bio,
        followers: followers,
        following: following,
        posts_count: postsCount,
        total_res_posts: cnt,
        posts: posts
    };
}

 function getUsernameFromUrl(url) {
    
    const regex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^/?]+)/i;
    const match = url.match(regex);

    if (match && match[1]) {

        return match[1].split("?")[0]; 
       
    } else {

        return null;
    }
}
