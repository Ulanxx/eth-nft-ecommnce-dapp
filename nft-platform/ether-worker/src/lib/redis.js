/**
 * created by lujun at 2018-09-25 14:03
 */
import bluebird from 'bluebird'
import redis from 'redis'
import Commons from './../utils/commons'
const config = Commons.getConfig('config').redis
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

class Redis {
  static client = redis.createClient(config.port, config.host,{
    auth_pass: config.passwd,
    db: config.db || 0
  })
}

export default Redis.client
