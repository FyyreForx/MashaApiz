const monk = new (require('./database'));

const limited = async (req, res, next) => {
   const apikey = req.query.apikey || req.body.apikey;
   const authHeader = req.header('Authorization');

   if (!apikey && !authHeader) {
      return res.json(global.status.noapikey);
   }

   //*** cek & mengurangi limit apikey ***//
   const checkey = apikey || authHeader.replace('Bearer ', '');
   const count = await monk.count(checkey);
   if (!count.status) return res.json(count);
   next();
};

// Middleware untuk memeriksa apikey dan memastikan pengguna adalah VIP
const limitvip = async (req, res, next) => {
   const apikey = req.query.apikey || req.body.apikey;
   const authHeader = req.header('Authorization');

   if (!apikey && !authHeader) {
      return res.json(global.status.noapikey);
   }

   //*** cek & mengurangi limit apikey ***//
   const checkey = apikey || authHeader.replace('Bearer ', '');
   const count = await monk.count(checkey);
   if (!count.status) return res.json(count);

   const isVip = await monk.getKey(checkey);
   if (!isVip.premium) {
      return res.json({
         status: false,
         msg: 'Maaf fitur ini hanya untuk user premium!'
      });
   }

   next();
};

module.exports = {
   limited,
   limitvip
};