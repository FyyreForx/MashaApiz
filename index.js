require('dotenv').config()
require('./lib/config')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 8080
const schema = new(require('./lib/schema'))
const monk = new(require('./lib/database'))
const cron = require('node-cron')

// export router
const endpoint = require('./routers/endpoint')
const api = require('./routers/api')

const runServer = async () => {
   await schema.create()
   const delay = time => new Promise(res => setTimeout(res, time))
   cron.schedule('00 00 * * *', async () => {
     const users = await (await schema.exec('users')).find().toArray()
     const notPrem = users.filter(v => v.limit < 15)
     if (notPrem.length < 1) return
     for (const v of notPrem) {
        await monk.reset(v._id)
        await delay(1200)
     }
   }, {
      scheduled: true,
      timezone: 'Asia/Jakarta'
   })
   
   const app = express()
   app.set('json spaces', 2)
      .use(cors())
      .use(express.json())
      .use('/', endpoint)
      .use('/api', api)
      .use(bodyParser.urlencoded({ extended: true }))
      .use(bodyParser.json())
      .disable('x-powered-by')
      .listen(PORT, () => console.log('Server running in port =>', PORT))
}

runServer().catch(() => runServer())