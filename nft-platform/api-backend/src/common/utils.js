const randomstring = require('randomstring').generate
const auto = require('auto-promise')
const moment = require('moment')
const jwt = require('jsonwebtoken')

class ErrorStatusCode {
  constructor(status, code, message) {
    this.status = status
    this.code = code
    this.message = message
  }
}

// max exclusive
const random = function (min, max) {
  let _min, _max
  if ((min === undefined) && (max === undefined)) {
    return Math.random()
  }
  if (max === undefined) {
    _min = 0
    _max = min
  } else {
    _min = min
    _max = max
  }

  return Math.floor(Math.random() * (max - min) + min)
}

const send_to_mq_queue = async function (mq, queue, json) {
  const connection = await mq
  const ch = await connection.createChannel()
  await ch.assertQueue(queue)
  await ch.sendToQueue(queue, new Buffer(JSON.stringify(json)), {persistent: true})
  await ch.close()
}

const send_to_mq_topic_exchange = async function (mq, ex, key, json) {
  const connection = await mq
  const ch = await connection.createChannel()
  await ch.assertExchange(ex, 'topic')
  await ch.publish(ex, key, new Buffer(JSON.stringify(json)), {persistent: true})
  await ch.close()
}

async function jwt_creation(secret, payload = {}) {
  return await new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      'whateversecret',
      null,
      (err, token) => {
        if (err) {
          return reject(err)
        }
        return resolve(token)
      }
    )
  )
}

export {
  random,
  ErrorStatusCode,
  send_to_mq_queue,
  send_to_mq_topic_exchange,
  auto,
  randomstring,
  moment,
  jwt_creation
}
