const axios = require('axios')
const fetch = require('node-fetch')
const { Prodia } = require("prodia.js");
const { generateImage, transform, generateImageSDXL, faceSwap } = Prodia("4fe25ce7-f286-43f3-a4f7-315bd7752e72");


exports.controlNet = async (model, module, url, prompt, scale) => {
    try {
const json = await prodia.controlNet({
        controlnet_model: model,
        controlnet_module: module,
        imageUrl: url,
        prompt: prompt,
        cfg_scale: scale
    });
    
    const result = getData_id(json.job)
    } catch (e) {
        console.log(e)
      }
    }

exports.A_genImage = async (models, prompt, negative_prompt, style, steps, cfg_scale, seed, upscale, sampler, width, height) => {
return new Promise(async resolve => {
let link;
if (/3Guofeng3_v34/.test(models)) link = '3Guofeng3_v34.safetensors [50f420de]';
if (/absolutereality_V16/.test(models)) link = 'absolutereality_V16.safetensors [37db0fc3]';
if (/absolutereality_v181/.test(models)) link = 'absolutereality_v181.safetensors [3d9d4d2b]';
if (/amIReal_V41/.test(models)) link = 'amIReal_V41.safetensors [0a8a2e61]';
if (/analog-diffusion-1.0/.test(models)) link = 'analog-diffusion-1.0.ckpt [9ca13f02]';
if (/anythingv3_0-pruned/.test(models)) link = 'anythingv3_0-pruned.ckpt [2700c435]';
if (/anything-v4.5-pruned/.test(models)) link = 'anything-v4.5-pruned.ckpt [65745d25]';
if (/anythingV5_PrtRE/.test(models)) link = 'anythingV5_PrtRE.safetensors [893e49b9]';
if (/AOM3A3_orangemixs/.test(models)) link = 'AOM3A3_orangemixs.safetensors [9600da17]';
if (/blazing_drive_v10g/.test(models)) link = 'blazing_drive_v10g.safetensors [ca1c1eab]';
if (/breakdomain_I2428/.test(models)) link = 'breakdomain_I2428.safetensors [43cc7d2f]';
if (/breakdomain_M2150/.test(models)) link = 'breakdomain_M2150.safetensors [15f7afca]';
if (/cetusMix_Version35/.test(models)) link = 'cetusMix_Version35.safetensors [de2f2560]';
if (/childrensStories_v13D/.test(models)) link = 'childrensStories_v13D.safetensors [9dfaabcb]';
if (/childrensStories_v1SemiReal/.test(models)) link = 'childrensStories_v1SemiReal.safetensors [a1c56dbb]';
if (/childrensStories_v1ToonAnime/.test(models)) link = 'childrensStories_v1ToonAnime.safetensors [2ec7b88b]';
if (/Counterfeit_v30/.test(models)) link = 'Counterfeit_v30.safetensors [9e2a8f19]';
if (/cuteyukimixAdorable_midchapter3/.test(models)) link = 'cuteyukimixAdorable_midchapter3.safetensors [04bdffe6]';
if (/cyberrealistic_v33/.test(models)) link = 'cyberrealistic_v33.safetensors [82b0d085]';
if (/dalcefo_v4/.test(models)) link = 'dalcefo_v4.safetensors [425952fe]';
if (/deliberate_v2/.test(models)) link = 'deliberate_v2.safetensors [10ec4b29]';
if (/deliberate_v3/.test(models)) link = 'deliberate_v3.safetensors [afd9d2d4]';
if (/dreamlike-anime-1.0/.test(models)) link = 'dreamlike-anime-1.0.safetensors [4520e090]';
if (/dreamlike-diffusion-1.0/.test(models)) link = 'dreamlike-diffusion-1.0.safetensors [5c9fd6e0]';
if (/dreamlike-photoreal-2.0/.test(models)) link = 'dreamlike-photoreal-2.0.safetensors [fdcf65e7]';
if (/dreamshaper_6BakedVae/.test(models)) link = 'dreamshaper_6BakedVae.safetensors [114c8abb]';
if (/dreamshaper_7/.test(models)) link = 'dreamshaper_7.safetensors [5cf5ae06]';
if (/dreamshaper_8/.test(models)) link = 'dreamshaper_8.safetensors [9d40847d]';
if (/edgeOfRealism_eorV20/.test(models)) link = 'edgeOfRealism_eorV20.safetensors [3ed5de15]';
if (/EimisAnimeDiffusion_V1/.test(models)) link = 'EimisAnimeDiffusion_V1.ckpt [4f828a15]';
if (/elldreths-vivid-mix/.test(models)) link = 'elldreths-vivid-mix.safetensors [342d9d26]';
if (/epicphotogasm_xPlusPlus/.test(models)) link = 'epicphotogasm_xPlusPlus.safetensors [1a8f6d35]';
if (/epicrealism_naturalSinRC1VAE/.test(models)) link = 'epicrealism_naturalSinRC1VAE.safetensors [90a4c676]';
if (/epicrealism_pureEvolutionV3/.test(models)) link = 'epicrealism_pureEvolutionV3.safetensors [42c8440c]';
if (/ICantBelieveItsNotPhotography_seco/.test(models)) link = 'ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]';
if (/indigoFurryMix_v75Hybrid/.test(models)) link = 'indigoFurryMix_v75Hybrid.safetensors [91208cbb]';
if (/juggernaut_aftermath/.test(models)) link = 'juggernaut_aftermath.safetensors [5e20c455]';
if (/lofi_v4/.test(models)) link = 'lofi_v4.safetensors [ccc204d6]';
if (/lyriel_v16/.test(models)) link = 'lyriel_v16.safetensors [68fceea2]';
if (/majicmixRealistic_v4/.test(models)) link = 'majicmixRealistic_v4.safetensors [29d0de58]';
if (/mechamix_v10/.test(models)) link = 'mechamix_v10.safetensors [ee685731]';
if (/meinamix_meinaV9/.test(models)) link = 'meinamix_meinaV9.safetensors [2ec66ab0]';
if (/meinamix_meinaV11/.test(models)) link = 'meinamix_meinaV11.safetensors [b56ce717]';
if (/neverendingDream_v122/.test(models)) link = 'neverendingDream_v122.safetensors [f964ceeb]';
if (/openjourney_V4/.test(models)) link = 'openjourney_V4.ckpt [ca2f377f]';
if (/pastelMixStylizedAnime_pruned_fp16/.test(models)) link = 'pastelMixStylizedAnime_pruned_fp16.safetensors [793a26e8]';
if (/portraitplus_V1.0/.test(models)) link = 'portraitplus_V1.0.safetensors [1400e684]';
if (/protogenx34/.test(models)) link = 'protogenx34.safetensors [5896f8d5]';
if (/Realistic_Vision_V1.4-pruned-fp16/.test(models)) link = 'Realistic_Vision_V1.4-pruned-fp16.safetensors [8d21810b]';
if (/Realistic_Vision_V2.0/.test(models)) link = 'Realistic_Vision_V2.0.safetensors [79587710]';
if (/Realistic_Vision_V4.0/.test(models)) link = 'Realistic_Vision_V4.0.safetensors [29a7afaa]';
if (/Realistic_Vision_V5.0/.test(models)) link = 'Realistic_Vision_V5.0.safetensors [614d1063]';
if (/redshift_diffusion-V10/.test(models)) link = 'redshift_diffusion-V10.safetensors [1400e684]';
if (/revAnimated_v122/.test(models)) link = 'revAnimated_v122.safetensors [3f4fefd9]';
if (/rundiffusionFX25D_v10/.test(models)) link = 'rundiffusionFX25D_v10.safetensors [cd12b0ee]';
if (/rundiffusionFX_v10/.test(models)) link = 'rundiffusionFX_v10.safetensors [cd4e694d]';
if (/sdv1_4/.test(models)) link = 'sdv1_4.ckpt [7460a6fa]';
if (/v1-5-pruned-emaonly/.test(models)) link = 'v1-5-pruned-emaonly.safetensors [d7049739]';
if (/v1-5-inpainting/.test(models)) link = 'v1-5-inpainting.safetensors [21c7ab71]';
if (/shoninsBeautiful_v10/.test(models)) link = 'shoninsBeautiful_v10.safetensors [25d8c546]';
if (/theallys-mix-ii-churned/.test(models)) link = 'theallys-mix-ii-churned.safetensors [5d9225a4]';
if (/timeless-1.0/.test(models)) link = 'timeless-1.0.ckpt [7c4971d4]';
if (/toonyou_beta6/.test(models)) link = 'toonyou_beta6.safetensors [980f6b15]';
    
    try {
        const response = await generateImage({
        model: link,
        prompt,
        negative_prompt,
        style_preset: style,
        steps,
        cfg_scale,
        seed,
        upscale,
        sampler,
        width,
        height
    })
         const result = response;
         console.log(result);
        // setTimeout(async () => {
         const genimg = await getData_id(result.job)
         console.log(genimg)
         resolve(genimg)
      //   }, 12000);
    } catch (error) {
        console.error('Error:', error);
    }
})
}




const sty = {
styles: [
    "3d-model",
    "analog-film",
    "anime",
    "cinematic",
    "comic-book",
    "digital-art",
    "enhance",
    "fantasy-art",
    "isometric",
    "line-art",
    "low-poly",
    "neon-punk",
    "origami",
    "photographic",
    "pixel-art",
    "texture",
    "craft-clay"
]}
const modelsss = {
models: [
    "3Guofeng3_v34",
    "absolutereality_V16",
    "absolutereality_v181",
    "amIReal_V41",
    "analog-diffusion-1.0",
    "anythingv3_0-pruned",
    "anything-v4.5-pruned",
    "anythingV5_PrtRE",
    "AOM3A3_orangemixs",
    "blazing_drive_v10g",
    "breakdomain_I2428",
    "breakdomain_M2150",
    "cetusMix_Version35",
    "childrensStories_v13D",
    "childrensStories_v1SemiReal",
    "childrensStories_v1ToonAnime",
    "Counterfeit_v30",
    "cuteyukimixAdorable_midchapter3",
    "cyberrealistic_v33",
    "dalcefo_v4",
    "deliberate_v2",
    "deliberate_v3",
    "dreamlike-anime-1.0",
    "dreamlike-diffusion-1.0",
    "dreamlike-photoreal-2.0",
    "dreamshaper_6BakedVae",
    "dreamshaper_7",
    "dreamshaper_8",
    "edgeOfRealism_eorV20",
    "EimisAnimeDiffusion_V1",
    "elldreths-vivid-mix",
    "epicphotogasm_xPlusPlus",
    "epicrealism_naturalSinRC1VAE",
    "epicrealism_pureEvolutionV3",
    "ICantBelieveItsNotPhotography_seco",
    "indigoFurryMix_v75Hybrid",
    "juggernaut_aftermath",
    "lofi_v4",
    "lyriel_v16",
    "majicmixRealistic_v4",
    "mechamix_v10",
    "meinamix_meinaV9",
    "meinamix_meinaV11",
    "neverendingDream_v122",
    "openjourney_V4",
    "pastelMixStylizedAnime_pruned_fp16",
    "portraitplus_V1.0",
    "protogenx34",
    "Realistic_Vision_V1.4-pruned-fp16",
    "Realistic_Vision_V2.0",
    "Realistic_Vision_V4.0",
    "Realistic_Vision_V5.0",
    "redshift_diffusion-V10",
    "revAnimated_v122",
    "rundiffusionFX25D_v10",
    "rundiffusionFX_v10",
    "sdv1_4",
    "v1-5-pruned-emaonly",
    "v1-5-inpainting",
    "shoninsBeautiful_v10",
    "theallys-mix-ii-churned",
    "timeless-1.0",
    "toonyou_beta6"
]}


async function getData_id(id_data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const da = `https://images.prodia.xyz/${id_data}.png`;
            resolve(da); // resolve with the URL
        }, 12000);
    }).then(async (da) => {
        try {
            const buffer = await Func.fetchBuffer(da);
            const newUrl = await Func.uploadFile(buffer);
            return newUrl.data.url; // return the new URL
        } catch (error) {
            throw error;
        }
    });
}

exports.A_sampler = async () => {
 return new Promise(async resolve => {
axios({
  method: 'get',
  url: 'https://api.prodia.com/v1/sd/samplers',
  headers: {
    'X-Prodia-Key': '7f6d4a3d-f3e3-4abf-ab8d-a21bb64a5ee7',
    'Accept': 'application/json',
  },
})
.then(response => {
  console.log(response.data);
  resolve(response.data)
})
.catch(error => {
  console.error(error);
})
} )
}


exports.A_models = async () => {

const mod = JSON.stringify(modelsss)

return mod
}

exports.A_style = async () => {

const st = JSON.stringify(sty)

return st
}

exports.wait = async(id_data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const da = `https://images.prodia.xyz/${id_data}.png`;
            resolve(da); // resolve with the URL
        }, 12000);
    }).then(async (da) => {
        try {
            const buffer = await Func.fetchBuffer(da);
            const newUrl = await Func.uploadFile(buffer);
            return newUrl.data.url; // return the new URL
        } catch (error) {
            throw error;
        }
    });
}