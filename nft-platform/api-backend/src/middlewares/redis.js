'use strict'
const node_redis = require('redis')
const bluebird = require('bluebird')

const defaults_options = {
  host: '127.0.0.1', // default
  port: 6379, //default
  db: 0, // database number to use
}

module.exports = function (opts) {
  let _opts = {}
  Object.assign(_opts, defaults_options, opts)

  const redis = node_redis.createClient(_opts)

  redis.on('error', function (error) {
    global.logger.error(error)
  })

  bluebird.promisifyAll(node_redis.RedisClient.prototype)
  bluebird.promisifyAll(node_redis.Multi.prototype)

  global.redis = redis

  return async (ctx, next) => {
    ctx.redis = redis
    return next()
  }
}
