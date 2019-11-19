/**
 * created by lujun at 2018-09-25 14:03
 */

const stompit = require('stompit')
const bluebird = require('bluebird')

bluebird.promisifyAll(stompit.Client.prototype)
bluebird.promisifyAll(stompit.Channel.prototype)

const connectionManager = new stompit.ConnectFailover()

const defaults_options = {
  'host': '127.0.0.1',
  'port': 61613
}

module.exports = async function (opts) {
  let _opts = {}
  Object.assign(_opts, defaults_options, opts)

  connectionManager.addServer(_opts)
  const channel = new stompit.Channel(connectionManager)

  global.mq = channel

  if(_opts.subscription instanceof Array){
    for (let s of _opts.subscription){
      await global.mq.subscribe(s.header, s.func)
    }
  }

  return async (ctx, next) => {
    ctx.mq = channel
    return next()
  }
}
// channel.subscribe(h, callback)
// channel.ack(message)
// channel.sendAsync(header, body)

