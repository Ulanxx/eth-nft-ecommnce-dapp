const MongoClient = require('mongodb').MongoClient
const generic_pool = require('generic-pool')

const defaults_options = {
  hostname: '127.0.0.1',
}

module.exports = async function (opts) {
  let _opts = {}
  Object.assign(_opts, defaults_options, opts)

  const user = encodeURIComponent(opts.user)
  const password = encodeURIComponent(opts.password)
  const authMechanism = opts.authMechanism

  const url = `mongodb://${user}:${password}@${opts.host}:${opts.port}/${opts.db}?authMechanism=${authMechanism}&authSource=${opts.authSource}`

  logger_debug.debug(`Connecting to mongodb: ${opts.host}: ${opts.port}`)
  const factory = {
    create: async function() {
      try{
        const db_connection = await MongoClient.connect(url, {useNewUrlParser: true})
        return db_connection
      }catch(err){
        global.logger.error(err)
      }
    },
    destroy: function(client) {
      client.close()
    }
  }

  const pool_opts = {
    max: 50, // maximum size of the pool
    min: 1 // minimum size of the pool
  }

  const db_pool = generic_pool.createPool(factory, pool_opts)

  global.db_pool = db_pool

  return async (ctx, next) => {
    ctx.db_pool = db_pool
    return next()
  }
}
