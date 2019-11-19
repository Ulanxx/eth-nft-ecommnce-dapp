import post_client from '../http_post_client'
import get_client from '../http_get_client'
import http_client from '../http_client'
import moment from 'moment'

const randomstring = require("randomstring").generate
const expect = require('chai').expect
const assert = require('chai').assert
const Web3 = require('web3')
import sleep from 'sleep-promise'

const config = require('../../../src/framework/config').default
const JWT = require('jsonwebtoken')

let eth_account
let jwt_admin
let jwt_brand
let jwt_brand_prepared

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

async function brand_mock(admin_jwt, eth_account) {
  const public_address = eth_account.address
  let body = {
    "companyName": `SNK_${randomstring({length: 8})}`,
    "brandName": `SNK_${randomstring({length: 8})}`,
    "publicAddress": public_address
  }

  let url = '/v1/admin/brand/create'
  let response = await post_client(url, body, {
    Authorization: `Bearer ${admin_jwt}`
  })

  expect(response.statusCode).to.equal(200)
  expect(response.body).to.have.property('code').to.equal(0)
  expect(response.body).to.have.property('payload')
  expect(response.body.payload).to.have.property('_id')

  // reauth as new role added
  body = {}
  url = `/v1/metamask_user?publicAddress=${public_address}`
  const response_user = await get_client(url, body)
  const nonce = response_user.body.payload.nonce
  const pa = response_user.body.payload.publicAddress

  const sig = await eth_account.sign(`${nonce}`, eth_account.privateKey)
  body = {
    publicAddress: pa,
    signature: sig.signature
  }
  response = await post_client('/v1/metamask_auth', body)
  jwt_brand = response.body.payload.jwt
  return jwt_brand
}

describe("API TEST [Brand]", async function () {
  before(async function () {
    // runs before all tests in this block
    const web3 = new Web3()
    eth_account = web3.eth.accounts.create()
    jwt_admin = await jwt_creation({id: randomstring({length: 10}), role: 'ADMIN'})

    jwt_brand = await brand_mock(jwt_admin, eth_account)
    jwt_brand_prepared = await jwt_creation({id: '5bb046334b49f81fb21b3c81', role: 'BRAND'})
  })

  describe("POST /v1/brand/token/issue", function () {
    let path = '/v1/brand/token/issue'
    it("Everything should be OK", async function () {
      // now you can issue token as new role
      let body = {
        symbol: "this is symbol",
        name: 'this is name',
        description: "this is description",
        category: "this is category",
        title: 'this is a title',
        url: 'this is a url',
        brand: 'SNK',
        variants: [
          {
            variant: 'this is variant',
            sku: 'this is sku',
            price: 100.50,
            amount: 10,
          },
          {
            variant: 'this is variant2',
            sku: 'this is sku2',
            price: 100.50,
            amount: 1,
          }
        ]
      }
      let url = path
      const response = await post_client(url, body, {
        Authorization: `Bearer ${jwt_brand}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(0)
      expect(response.body).to.have.property('payload')
    })
  })

  describe("GET /v1/brand/token/issue", function () {
    let path = '/v1/brand/token/issue'
    it("Everything should be OK", async function () {
      // mock:mint
      const symbol = 'this is a symbol ' + randomstring({length: 5})
      let body = {
        symbol: symbol,
        name: 'this is name',
        description: "this is description",
        category: "this is category",
        title: 'this is a title',
        url: 'this is a url',
        brand: 'SNK',
        variants: [
          {
            variant: 'this is variant',
            sku: 'this is sku',
            price: 100.50,
            amount: 10,
          },
          {
            variant: 'this is variant2',
            sku: 'this is sku2',
            price: 100.50,
            amount: 1,
          }
        ]
      }
      let url = path
      let response = await post_client(url, body, {
        Authorization: `Bearer ${jwt_brand}`
      })
      // now you can issue token as new role
      body = {}

      url = path
      response = await get_client(url, body, {
        Authorization: `Bearer ${jwt_brand}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(0)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload.symbolVariants).to.be.an('array')
      expect(response.body.payload.batchList).to.be.an('array')
      expect(response.body.payload.symbolVariants[response.body.payload.symbolVariants.length - 1].symbol).to.equal(symbol)
      assert.isAtLeast(response.body.payload.symbolVariants.length, 1)
      assert.isAtLeast(response.body.payload.batchList.length, 1)
      //console.log(JSON.stringify(response.body.payload.batchList))
    })
  })

  describe("/v1/brand/account/profile_get", function () {
    let path = '/v1/brand/account/profile_get'
    it("Everything should be OK", async function () {
      // now you can issue token as new role
      let body = {}
      let url = path
      const response = await get_client(url, body, {
        Authorization: `Bearer ${jwt_brand}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(0)
      expect(response.body).to.have.property('payload')
    })
  })

  describe("/v1/brand/account/profile_edit", function () {
    let path = '/v1/brand/account/profile_edit'
    it("Everything should be OK", async function () {

      const new_company_name = randomstring({length: 15})
      const new_contact_name = randomstring({length: 15})
      const new_contact_email = `${randomstring({length: 3})}@${randomstring({length: 3})}.com`
      const new_contact_phone = randomstring({length: 15})
      const new_wallet_address = randomstring({length: 15})

      // now you can issue token as new role
      let body = {
        companyName: new_company_name,
        contactName: new_contact_name,
        contactEmail: new_contact_email,
        contactPhoneNumber: new_contact_phone,
        walletAddress: new_wallet_address
      }
      let url = path
      const response = await post_client(url, body, {
        Authorization: `Bearer ${jwt_brand}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(0)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload.walletAddress).to.equal(new_wallet_address)
      expect(response.body.payload.contactEmail).to.equal(new_contact_email)
      expect(response.body.payload.contactName).to.equal(new_contact_name)
      expect(response.body.payload.contactPhoneNumber).to.equal(new_contact_phone)
      expect(response.body.payload.userInfo.companyName).to.equal(new_company_name)
    })

    it("Should be able to empty email field", async function () {

      const new_company_name = randomstring({length: 15})
      const new_contact_name = randomstring({length: 15})
      const new_contact_email = ''
      const new_contact_phone = randomstring({length: 15})
      const new_wallet_address = randomstring({length: 15})

      // now you can issue token as new role
      let body = {
        companyName: new_company_name,
        contactName: new_contact_name,
        contactEmail: new_contact_email,
        contactPhoneNumber: new_contact_phone,
        walletAddress: new_wallet_address
      }
      let url = path
      const response = await post_client(url, body, {
        Authorization: `Bearer ${jwt_brand}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(0)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload.walletAddress).to.equal(new_wallet_address)
      expect(response.body.payload.contactEmail).to.equal(new_contact_email)
      expect(response.body.payload.userInfo.companyName).to.equal(new_company_name)
      expect(response.body.payload.contactName).to.equal(new_contact_name)
      expect(response.body.payload.contactPhoneNumber).to.equal(new_contact_phone)
    })
  })

  describe("/v1/brand/account/billing_list", function () {
    let path = '/v1/brand/account/billing_list'

    it("No additional keys allowed", async function () {
      const body = {}

      let url = `${path}?tryAttack=dkdkdkfe`
      const response = await get_client(url, body, {
        Authorization: `Bearer ${jwt_brand}`
      })

      expect(response.statusCode).to.equal(400)
    })
  })

  describe("/v1/brand/token/symbol", function () {
    let path = '/v1/brand/token/symbol'

    it("Everything should be OK", async function () {
      const body = {}

      let url = `${path}`
      const response = await get_client(url, body, {
        Authorization: `Bearer ${jwt_brand}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('symbols')
      expect(response.body.payload.symbols).to.be.an('array')
    })
  })

  describe("/v1/brand/token/inventory", function () {
    let path = '/v1/brand/token/inventory'

    it("Everything should be OK", async function () {
      const body = {
      }

      let url = `${path}?batchId=5bbb10cc80e4ab48b51370f6`
      const response = await get_client(url, body, {
        Authorization: `Bearer ${jwt_brand}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('variants')
      expect(response.body.payload.variants).to.be.an('array')
    })
  })

  describe("/v1/brand/token/transaction", function () {
    let path = '/v1/brand/token/transaction'

    it("Everything should be OK", async function () {
      const body = {}

      let url = `${path}`
      const response = await get_client(url, body, {
           Authorization: `Bearer ${jwt_brand}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('transactions')
      expect(response.body.payload.transactions).to.be.an('array')
      console.log(response.body.payload.transactions)
    })
  })

    describe("/v1/upload_token", function () {
        let path = '/v1/upload_token'

        it("Everything should be OK", async function () {
            const url = path
            const body = {}
            const response = await get_client(url, body, {
                Authorization: `Bearer ${jwt_brand}`
            })
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.have.property('code').to.equal(0)
            expect(response.body).to.have.property('payload')
            expect(response.body).to.have.property('payload').have.property('token');
        })
    })

})