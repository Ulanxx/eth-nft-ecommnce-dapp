import post_client from '../http_post_client'
import get_client from '../http_get_client'
const expect = require('chai').expect
const Web3 = require('web3')
const randomstring = require("randomstring").generate
const config = require('../../../src/framework/config').default
const JWT = require('jsonwebtoken')
function jwt_creation(payload = {}) {
  return new Promise((resolve, reject) =>
    JWT.sign(
      payload,
      config.login.jwt_secret,
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

let body
let eth_account

describe("API TEST [Metamask]", function(){
  before(async function() {
    // runs before all tests in this block
    const web3 = new Web3()

    eth_account = web3.eth.accounts.create()
  })

  describe("/v1/metamask_user", function(){
    let path = '/v1/metamask_user'
    it("Everything should be OK",async function(){
      body = {

      }

      let url = `${path}?publicAddress=0x38832923834`
      const response = await get_client(url, body)

      expect(response.statusCode).to.equal(200)
      expect(response.body.payload).to.have.property('nonce').to.satisfy(Number.isInteger)
      expect(response.body.payload).to.have.property('publicAddress')
    })

    it("Bad request: no publicAddress in querystring",async function(){
      body = {

      }
      let url = `${path}?publicAddrss=0x38832923834`
      const response = await get_client(url, body)

      expect(response.statusCode).to.equal(400)
    })

    it("Bad method: POST",async function(){
      body = {

      }
      let url = `${path}?publicAddrss=0x38832923834`
      const response = await post_client(url, body)

      expect(response.statusCode).to.equal(404)
    })
  })

  describe("/v1/metamask_auth", function() {
    let path = '/v1/metamask_auth'
    it("Everything should be OK(brand user)", async function () {
      // mock: forge an ADMIN jwt and insert this eth public address into the server
      let pre_token = await jwt_creation({id: eth_account.address, role: 'ADMIN'})
      let body = {
        "companyName": `SNK_${randomstring({length: 8})}`,
        "brandName": `SNK_${randomstring({length: 8})}`,
        "publicAddress": eth_account.address
      }

      let url = '/v1/admin/brand/create'
      let response = await post_client(url, body, {
        Authorization: `Bearer ${pre_token}`
      })
      expect(response.statusCode).to.equal(200)
      expect(response.body.code).to.equal(0)

      body = {}
      url = `/v1/metamask_user?publicAddress=${eth_account.address}`
      const response_user = await get_client(url, body)
      const nonce = response_user.body.payload.nonce

      const sig = await eth_account.sign(`${nonce}`, eth_account.privateKey)
      body = {
        publicAddress: eth_account.address,
        signature: sig.signature
      }
      response = await post_client(path, body)

      expect(response.statusCode).to.equal(200)
      expect(response.body.payload).to.have.property('jwt')
    })

    it("Everything should be OK(arbitary end user)", async function () {
      const web3 = new Web3()

      const eth_account = web3.eth.accounts.create()

      body = {}
      let url = `/v1/metamask_user?publicAddress=${eth_account.address}`
      const response_user = await get_client(url, body)
      const nonce = response_user.body.payload.nonce

      const sig = await eth_account.sign(`${nonce}`, eth_account.privateKey)
      body = {
        publicAddress: eth_account.address,
        signature: sig.signature
      }
      let response = await post_client(path, body)

      expect(response.statusCode).to.equal(200)
      expect(response.body.payload).to.have.property('jwt')
    })

    it("Wrong metamask auth request content", async function () {
      let body = {
        publicAddress: '0x38832923834',
        signature: '11111'
      }
      const response = await post_client(path, body)

      expect(response.statusCode).to.equal(422)
    })
  })

  describe("/v1/role", function() {
    let path = '/v1/role'
    it("Everything should be OK", async function () {
      // mock: forge an ADMIN jwt and insert this eth public address into the server
      const whateverrole = randomstring({length: 8})
      let pre_token = await jwt_creation({id: eth_account.address, role: whateverrole})
      let body = { }

      const response = await get_client(path, body, {
        Authorization: `Bearer ${pre_token}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body.code).to.equal(0)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload.role).to.equal(whateverrole)
    })

  })
})