const express = require('express');
const router = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const monk = new (require('../lib/database'));
const moment = require('moment-timezone');
const fs = require ('fs')
const { watchFile, unwatchFile } = require ('fs')
const chalk = require ('chalk')
const { fileURLToPath } = require ('url')
moment.tz.setDefault('Asia/Jakarta').locale('id');

router.use(cookieParser());

const ipFilePath = path.resolve(__dirname, '../scraper/ip.json');

// Membaca file ip.json
let json = JSON.parse(fs.readFileSync(ipFilePath));
let owner = 'keys'; // key owner
const app = express();
app.set("json spaces", 2);
const port = 3000;

router.use(cookieParser());
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/about.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signup.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.get('/otp_verification', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/otp_verification.html'));
});

router.get('/playground', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/endpoint.html'));
});

router.get('/users/register', async (req, res) => {
    const { id } = req.query;
    const result = await monk.register(id);
    res.json(result);
});

router.get('/users/steal', async (req, res) => {
    const { id } = req.query;
    if (!id) return res.json({
        status: false,
        msg: `parameter "id" is required`
    });
    const json = await monk.getUser(id);
    let original = json.expired_at;
    if (original > 0) {
        json.expired_at = moment(parseInt(original)).format('dddd, DD MMM Y');
    }
    if (json.joined_at && !isNaN(json.joined_at)) {
        json.joined_at = moment(parseInt(json.joined_at)).format('dddd, DD MMM Y');
    }
    delete json.status;
    res.json({
        creator: global.creator,
        status: true,
        data: {
            ...json,
            premium: original > 0 ? true : false
        }
    });
});

router.get('/users/check', async (req, res) => {
    const { apikey } = req.query;
    if (!apikey) return res.json({
        status: false,
        msg: `parameter "apikey" is required`
    });
    const json = await monk.getKey(apikey);
    let original = json.expired_at;
    if (original > 0) {
        json.expired_at = moment(parseInt(original)).format('dddd, DD MMM Y');
    }
    if (json.joined_at && !isNaN(json.joined_at)) {
        json.joined_at = moment(parseInt(json.joined_at)).format('dddd, DD MMM Y');
    }
    res.json(json);
});

router.get('/users/add-limit', async (req, res) => {
    const { id, limit } = req.query;
    if (!id) return res.json({
        status: false,
        msg: `parameter "id" is required`
    });
    if (!limit) return res.json({
        status: false,
        msg: `parameter "limit" is required`
    });
    if (isNaN(limit)) return res.json({
        status: false,
        msg: `the "limit" argument must be a number`
    });
    const json = await monk.addLimit(id, limit);
    res.json(json);
});

router.get('/users/add-premium', async (req, res) => {
    const prices = [{
        plan: 'Minimize',
        packname: 'minimize',
        limit: 5000,
        price: 5500,
        duration: 86400000 * 30 * 1,
        duration_f: '30 Days',
        calculation: '1 Month'
    }, {
        plan: 'Minimize V2',
        packname: 'minimize-v2',
        limit: 5000,
        price: 10000,
        duration: 86400000 * 30 * 2,
        duration_f: '60 Days',
        calculation: '2 Month'
    }, {
        plan: 'Minimize V3',
        packname: 'minimize-v3',
        limit: 5000,
        price: 15000,
        duration: 86400000 * 30 * 3,
        duration_f: '90 Days',
        calculation: '3 Month'
    }, {
        plan: 'Marvest',
        packname: 'marvest',
        limit: 10000,
        price: 10000,
        duration: 86400000 * 30 * 1,
        duration_f: '30 Days',
        calculation: '1 Month'
    }, {
        plan: 'Marvest V2',
        packname: 'marvest-v2',
        limit: 1000000,
        price: 10000,
        duration: 86400000 * 365 * 1,
        duration_f: '365 Days',
        calculation: '1 Years'
    }];
    const { id, packname } = req.query;
    if (!id) return res.json({
        status: false,
        msg: `parameter "id" is required`
    });
    if (!packname) return res.json({
        status: false,
        msg: `parameter "packname" is required`
    });
    const fn = prices.find(v => v.packname === packname.toLowerCase());
    if (!fn) return res.json({
        status: false,
        msg: `packname ${packname} tidak ada dalam daftar harga`
    });
    const json = await monk.addLimit(id, fn.limit, fn.duration);
    res.json(json);
});

router.get('/users/reset-users', async (req, res) => {
    const { id } = req.query;
    if (!id) return res.json({
        status: false,
        msg: `parameter "id" is required`
    });
    const json = await monk.reset(id);
    res.json(json);
});

router.get('/users/reset-all-users', async (req, res) => {
    const json = await monk.resetAll();
    res.json(json);
});

router.get('/users/change-key', async (req, res) => {
    const { id, newkey } = req.query;
    if (!id) return res.json({
        status: false,
        msg: `paramter "id" is required`
    });
    if (!newkey) return res.json({
        status: false,
        msg: `paramter "newkey" is required`
    });
    const user = await monk.getUser(id);
    if (!user.status) return res.json(user);
    if (user.expired_at === 0) return res.json({
        status: false,
        msg: `Custom apikey hanya untuk user premium`
    });
    const json = await monk.changeKey(id, newkey);
    res.json(json);
});
router.get("/ip", async (req, res) => {
   let { key } = req.query;
    if (!key) return res.json({
                msg: 'lu siapa ngntd??'
            })
            if (key !== owner) return res.json({
                msg: 'ngpain anj?'
            })
        try {
            
            if (json.length == 0) {
                return res.json({
                    msg: 'daftar ip kosong'
                })
            }
            res.json({
                ip: json
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({
                error: error
            });
        }
    });

    router.get('/myip', (req, res) => {
    try {
  const ip = req.headers['x-forwarded-for']

  res.json({ ip: ip});
  } catch (e) {
  res.json('error')
  }
});

    router.get("/acc", async (req, res) => {
        try {
            let ip = req.query.text;
            let own = req.query.key
                        
            if (!ip) return res.json({
                msg: 'masukan ip nya'
            })
            if (!own) return res.json({
                msg: 'masukan key Owner'
            })
            if (own !== owner) return res.json({
                msg: 'key salah'
            })
            
            if (json.includes(ip)) return res.json({
                msg: 'Ip sudah tersedia'
            });
            json.push(ip);
            fs.writeFileSync('../scraper/ip.json', JSON.stringify(json));
            res.json({
                msg: 'sukses acc ip ' + ip
            });
        } catch (e) {
            res.status(500).json({
                error: e
            });
        }
    })
router.get("/delacc", async (req, res) => {
        try {
            let ip = req.query.text;
            let own = req.query.key
            if (!ip) return res.json({
                msg: 'masukan ip nya'
            })
            if (!own) return res.json({
                msg: 'masukan key Owner'
            })
            if (own !== owner) return res.json({
                msg: 'key salah'
            })
            
            if (!json.includes(ip)) return res.json({
                msg: 'Ip tidak tersedia'
            });
            json.splice(json.indexOf(ip), 1);
            fs.writeFileSync('../scraper/ip.json', JSON.stringify(json));
            res.json({
                msg: 'sukses delete acc ip ' + ip
            });
        } catch (e) {
            res.status(500).json({
                error: e
            });
        }
    })

module.exports = router;
