import bluebird from 'bluebird'
import OnTokenMint from './OnTokenMinted'
import OnTokenTransferred from './OnTokenTransferred'
import OnTokenTransferredRaw from './OnTokenTransferredRaw'

const EventFuncs = {
  'TOKEN_ISSUE': OnTokenMint,
  'TOKEN_TRANSFER': OnTokenTransferred,
  'TOKEN_TRANSFER_RAW': OnTokenTransferredRaw
}

export default [
  { header: { 'destination': 'tasks_callback', 'ack': 'client-individual' }, func: OnTasksCallbackMessage }
]

async function OnTasksCallbackMessage(err, message) {
  if (err) {
    logger.error(err)
  } else {
    const readStringAsync = bluebird.promisify(message.readString, { context: message })
    const body = await readStringAsync('utf-8')
    const body_json = JSON.parse(body)

    const func = EventFuncs[body_json['command']]
    if (func) {
      await func(body_json)
    }
  }
  global.mq.ack(message)
}
