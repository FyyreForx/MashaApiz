const schema = new (require('./schema'))
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = class Database {
    
    getUser = async id => {
      const json = await (await schema.exec('users')).findOne({
         _id: id
      })
      if (!json) return ({
         status: false,
         msg: 'Pengguna tidak di temukan'
      })
      return ({
         status: true,
         ...json
      })
   }

    genKey = length => {
        var result = ''
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        var charactersLength = characters.length
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }

    register = async (phone) => {
        const json = await this.getUser(phone)
        if (json.status) return ({ status: false, msg: 'Nomormu sudah terdaftar' })

        const newKey = this.genKey(10)
        await (await schema.exec('users')).insertOne({
            _id: phone,
            apikey: newKey,
            limit: global.limit,
            expired_at: 0,
            joined_at: moment().format('dddd, DD MMM Y')
        })

        return {
            creator: global.creator,
            status: true,
            data: {
                msg: 'Pendaftaran berhasil!',
                apikey: newKey,
                limit: global.limit
            }
        }
    }

    authenticate = async (id) => {
        const json = await this.getUser(id)
        if (!json.status) return ({ status: false, msg: 'Pengguna tidak ditemukan' })
        return ({ status: true, ...json, premium: json.expired_at > 0 ? true : false })
    }

    getKey = async apikey => {
        const json = await (await schema.exec('users')).findOne({ apikey })
        if (!json) return ({ status: false, msg: 'Apikey tidak ditemukan' })
        return ({ status: true, ...json, premium: json.expired_at > 0 ? true : false })
    }

    addLimit = async (id, limit, expired) => {
        const json = await this.getUser(id)
        if (!json.status) return ({ status: false, msg: 'Pengguna tidak ditemukan' })
        let now = new Date * 1
        await (await schema.exec('users')).updateOne({ _id: id }, {
            '$set': {
                limit: (parseInt(json.limit) + parseInt(limit)),
                expired_at: json.expired_at > 0 ? expired ? (json.expired_at + parseInt(expired)) : parseInt(json.expired_at) : now + parseInt(expired)
            }
        })
        const notifier = expired ? ({
            status: true,
            msg: `Berhasil upgrade premium untuk @${json._id}`
        }) : ({
            status: true,
            msg: `Berhasil menambah ${limit} limit untuk @${json._id}`
        })
        return notifier
    }

    reset = async id => {
        const json = await this.getUser(id)
        if (!json) return (json)
        await (await schema.exec('users')).updateOne({ _id: id }, {
            '$set': {
                limit: global.limit,
                expired_at: 0
            }
        })
        return ({
            status: true,
            msg: `Data @${json._id} berhasil direset`
        })
    }

    resetAll = async () => {
        const users = await (await schema.exec('users')).find().toArray()
        for (const v of users) {
            await this.reset(v._id)
        }
        return ({
            status: true,
            msg: `Semua data user berhasil di reset`
        })
    }
    
    count = async apikey => {
      const json = await this.getKey(apikey)
      if (!json.status) return (json)
      if (json.limit < 1) {
         await (await schema.exec('users')).updateOne({
            apikey
         }, {
            '$set': {
               limit: 0
            }
         })
         return ({
            status: false,
            msg: `Limit sudah habis`
         })
      } else {
         await (await schema.exec('users')).updateOne({
            apikey
         }, {
            '$set': {
               limit: parseInt(json.limit) - 1
            }
         })
         return ({
            status: true
         })
      }
   }

    changeKey = async (id, apikey) => {
        const json = await this.getUser(id)
        const keys = await this.getKey(apikey)
        if (!json.status) return ({
            status: false,
            msg: 'Pengguna tidak terdaftar'
        })
        if (json.apikey === apikey) return ({
            status: false,
            msg: 'Kamu memasukkan apikey yang saat ini digunakan'
        })
        if (keys.status) return ({
            status: false,
            msg: 'Apikey sudah digunakan'
        })
        const res = await (await schema.exec('users')).updateOne({ _id: id }, {
            '$set': { apikey }
        })
        if (res.matchedCount == 1) return ({
            status: true,
            msg: 'Apikey berhasil diubah'
        })
        return ({
            status: false,
            msg: 'Something went wrong'
        })
    }
}