const { MongoClient, ObjectId } = require('mongodb')

module.exports = class MongoDB {
   constructor(db, collection, options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
   }) {
      this.db = db || 'finea'
      this.options = options
   }

   client = new MongoClient(process.env.DATABASE_URL, this.options)

   exec = async (collect) => {
      await this.client.connect()
      const db = await this.client.db(this.db).collection(collect)
      return db
   }

   create = async () => {
      await this.client.connect()
      const db = await this.client.db(this.db)
      const users = await (await db.listCollections().toArray()).some(v => v.name == 'users')
      if (!users) {
         db.createCollection('users')
      }
   }
}
