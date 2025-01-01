const fs = require("fs")
const fetch = require('node-fetch')
const axios = require('axios')
const headers = {
  Authorization: "Bearer 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",
};

async function bufferlah(hm) {
    const imageUrl = hm;
    const imagePath = 'gambar.jpg';
    const response = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(response.data, 'binary');
    return buffer;
}

async function query(data) {
  const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
    headers,
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.arrayBuffer();
  return result;
}

exports.sdf = async (caption) => {
  try {
    const imageBytes = await query({
      inputs: caption,
    });
    // Generate a file name with the caption and save the image
    const fileName = `${caption.replace(/\s+/g, "-")}.png`;
  return Buffer.from(imageBytes)
  } catch (error) {
    console.error(error);
  }
}

async function query2(data) {
  const response = await fetch("https://api-inference.huggingface.co/models/ZachX/comics_SDXL_lora", {
    headers,
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.arrayBuffer();
  return result;
}

exports.cosmix = async (caption) => {
  try {
    const imageBytes = await query2({
      inputs: caption,
    });
    // Generate a file name with the caption and save the image
    const fileName = `${caption.replace(/\s+/g, "-")}.png`;
  return Buffer.from(imageBytes)
  } catch (error) {
    console.error(error);
  }
}

async function query3(data, hfkey, hfurl) {
const headers2 = {
  Authorization: `Bearer ${hfkey}`,
};

  const response = await fetch(hfurl, {
    headers2,
    method: "POST",
    body: JSON.stringify({
      inputs: data,
    }),
  });
  const result = await response.arrayBuffer();
  return result;
}

exports.trained = async (caption, hfkey, hfurl) => {
  try {
    const imageBytes = await query3(caption, hfkey, hfurl);
    // Generate a file name with the caption and save the image
    const fileName = `${caption.replace(/\s+/g, "-")}.png`;
  return Buffer.from(imageBytes)
  } catch (error) {
    console.error(error);
  }
}


async function query4(data) {
  const response = await fetch("https://api-inference.huggingface.co/models/cagliostrolab/animagine-xl-3.1", {
    headers,
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.arrayBuffer();
  return result;
}

exports.animagen = async (caption) => {
  try {
    const imageBytes = await query4({
      inputs: caption,
    });
    // Generate a file name with the caption and save the image
    const fileName = `${caption.replace(/\s+/g, "-")}.png`;
  return Buffer.from(imageBytes)
  } catch (error) {
    console.error(error);
  }
}

exports.mixtral = async (input) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        inputs: input
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        }
      }
    );
    console.log(response.data);
    return response.data[0].generated_text
  } catch (error) {
    console.error(error);
  }
}


//emi
exports.emi = async (input) => {
   return new Promise(async resolve => {
   
axios.post('https://nexra.aryahcr.cc/api/image/complements', {
    prompt: input,
    model: "emi"
}, {
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => {
    let err = null;
    let result = null;

    if((typeof response.data).toString().toLowerCase() === "Object".toLowerCase()){
        if(response.data.code != undefined && response.data.code != null && response.data.code === 200 && response.data.status != undefined && response.data.status != null && response.data.status === true){
            result = response.data;
            err = null;
        } else {
            result = null;
            err = response.data;
        }
    } else {
        let js = null;
        let count = -1;
        for(let i = 0; i < response.data.length; i++){
            if(count <= -1){
                if(response.data[i] === "{"){
                    count = i;
                }
            } else {
                break;
            }
        }

        if(count <= -1){
            err = {
                "code": 500,
                "status": false,
                "error": "INTERNAL_SERVER_ERROR",
                "message": "general (unknown) error"
            };
            result = null;
        } else {
            try {
                js = response.data.slice(count);
                js = JSON.parse(js);
                if(js != undefined && js != null && js.code != undefined && js.code != null && js.code === 200 && js.status != undefined && js.status != null && js.status === true){
                    result = js;
                    err = null;
                } else {
                    err = js;
                    result = null;
                }
            } catch(e){
                err = {
                    "code": 500,
                    "status": false,
                    "error": "INTERNAL_SERVER_ERROR",
                    "message": "general (unknown) error"
                };
                result = null;
            }
        }
    }

    if(result === null && err != null){
        console.log(err);
        resolve(err)
    } else {
        const image = result.images[0] 
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');
 
        resolve(imageBuffer)
        console.log(imageBuffer)
    }
}).catch(error => {
    console.error('Error:', error);
});

})
}

exports.wish = async (data) => {
  const response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-large-v3", {
    headers,
    method: "POST",
    body: data,
  });
  const result = await response.json();
  return result;
}



