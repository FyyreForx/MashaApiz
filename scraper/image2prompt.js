const Replicate = require('replicate');
const replicate = new Replicate({  auth: process.env.REPLICATE })

exports.img2prompt = async(url) => {
     try {
            let input = {
                  image: url
                 }
               const json = await replicate.run("methexis-inc/img2prompt:50adaf2d3ad20a6f911a8a9e3ccf777b263b8596fbd2c8fc26e8888f8a0edbb5", { input });
            return json.trim()
        } catch (e) {
           console.log(e)
        }
 }