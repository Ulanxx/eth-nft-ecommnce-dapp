import Mq from '../src/lib/mq'

const expect = require('chai').expect
const moment = require('moment')

let mq = null

describe("Message sending", function () {
  let path = '/v1/demo'

  before(async function (done) {
    // runs before all tests in this block
    mq = new Mq()
    done()
  })

  describe("sending various messages to ether_tasks queue", async function () {
    const subscribeHeaders = {
      'destination': 'ether_tasks',
      'ack': 'client-individual'
    }

    it("Everything should be OK", async function () {
      const body = {
        command: 'MINT_TOKEN',
        payload: {
          param1: '',
          param2: ''
        }
      }
      await mq.sendAsync(subscribeHeaders, JSON.stringify(body))
    })
  })
})