import post_client from '../http_post_client'
import get_client from '../http_get_client'
import http_client from '../http_client'

const randomstring = require("randomstring").generate
const expect = require('chai').expect
const Web3 = require('web3')
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
let jwt

function get_a_valid_public_address() {
  const web3 = new Web3()
  const eth_account = web3.eth.accounts.create()
  return eth_account.address
}

describe("API TEST [Brand User]", function () {
  before(async function () {
    // runs before all tests in this block
    const web3 = new Web3()

    eth_account = web3.eth.accounts.create()

    // forge an ADMIN JWT to be used by later test cases
    jwt = await jwt_creation({id: eth_account.address, role: 'ADMIN'})
    //console.log(jwt)
  })

  describe("/v1/admin/brand/create", function () {
    let path = '/v1/admin/brand/create'
    it("Everything should be OK", async function () {
      body = {
        "companyName": `SNK_${randomstring({length: 8})}`,
        "brandName": `SNK_${randomstring({length: 8})}`,
        "publicAddress": eth_account.address
      }

      let url = path
      const response = await post_client(url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(0)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('_id')
    })

    it("mandatory fields must be filled", async function () {
      body = {
        "companyName": `SNK_${randomstring({length: 8})}`,
        "brandName": `SNK_${randomstring({length: 8})}`,
      }

      let url = path
      const response = await post_client(url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(400)
    })

    it("publicAddress Already existing", async function () {
      body = {
        "companyName": `SNK_${randomstring({length: 8})}`,
        "brandName": `SNK_${randomstring({length: 8})}`,
        "publicAddress": eth_account.address
      }

      let url = path
      await post_client(url, body, {
        Authorization: `Bearer ${jwt}`
      })
      const response = await post_client(url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(-1)
    })

    it("No additional keys allowed", async function () {
      body = {
        "companyName": `SNK_${randomstring({length: 8})}`,
        "brandName": `SNK_${randomstring({length: 8})}`,
        tryAttack: "Hahahah",
        "publicAddress": eth_account.address
      }

      let url = path
      const response = await post_client(url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(400)
    })
  })

  describe("/v1/admin/brand/list", function () {
    let path = '/v1/admin/brand/list'
    it("Everything should be OK", async function () {
      body = {

      }

      let url = path
      const response = await get_client(url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(0)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.be.an('array')
    })

    it("No additional keys allowed", async function () {
      body = {}

      let url = `${path}?tryAttack=dkdkdkfe`
      const response = await get_client(url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(400)
    })
  })

  describe("/v1/admin/brand/delete", function () {
    let path = '/v1/admin/brand/delete'
    it("Everything should be OK", async function () {

      const address = get_a_valid_public_address()

      let body = {
        "companyName": `SNK_${randomstring({length: 8})}`,
        "brandName": `SNK_${randomstring({length: 8})}`,
        "publicAddress": address
      }

      let url = '/v1/admin/brand/create'
      let response = await post_client(url, body, {
        Authorization: `Bearer ${jwt}`
      })

      body = {
        id: response.body.payload._id
      }
      url = `${path}/${body.id}`

      response = await http_client('DELETE', url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(0)
    })

    it("No such brand", async function () {
      let body = {
        id: 'kdkaeefk8d33f3fakjfe'
      }
      let url = `${path}/${body.id}`

      let response = await http_client('DELETE', url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(-2)
    })
  })

  describe("/v1/admin/brand/edit", function () {
    let path = '/v1/admin/brand/edit'
    it("Everything should be OK", async function () {

      const address = get_a_valid_public_address()
      let body = {
        "companyName": `SNK_${randomstring({length: 8})}`,
        "publicAddress": address
      }

      let url = '/v1/admin/brand/create'
      let response = await post_client(url, body, {
        Authorization: `Bearer ${jwt}`
      })

      const edit_test_new_company_name = randomstring({length: 10})
      const edit_test_new_contact_name = randomstring({length: 10})
      const edit_test_new_email = `${randomstring({length:3})}@${randomstring({length:3})}.com`

      body = {
        id: response.body.payload._id,
        companyName: edit_test_new_company_name,
        contactName: edit_test_new_contact_name,
        contactEmail: edit_test_new_email
      }
      url = path

      response = await http_client('PUT', url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(0)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('userInfo')
      expect(response.body.payload.userInfo.companyName).to.be.equal(edit_test_new_company_name)
      expect(response.body.payload.contactName).to.be.equal(edit_test_new_contact_name)
      expect(response.body.payload.contactEmail).to.be.equal(edit_test_new_email)
    })

    it("Should be able to empty email", async function () {

      const address = get_a_valid_public_address()
      let body = {
        "companyName": `SNK_${randomstring({length: 8})}`,
        "publicAddress": address
      }

      let url = '/v1/admin/brand/create'
      let response = await post_client(url, body, {
        Authorization: `Bearer ${jwt}`
      })

      const edit_test_new_company_name = randomstring({length: 10})
      const edit_test_new_contact_name = randomstring({length: 10})
      const edit_test_new_contact_email = ''

      body = {
        id: response.body.payload._id,
        companyName: edit_test_new_company_name,
        contactName: edit_test_new_contact_name,
        contactEmail: edit_test_new_contact_email
      }
      url = path

      response = await http_client('PUT', url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(0)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('userInfo')
      expect(response.body.payload.userInfo.companyName).to.be.equal(edit_test_new_company_name)
      expect(response.body.payload.contactName).to.be.equal(edit_test_new_contact_name)
      expect(response.body.payload.contactEmail).to.be.equal(edit_test_new_contact_email)
    })

    it("No arbitary fields modification allowed", async function () {
      const address = get_a_valid_public_address()
      let body = {
        "companyName": `SNK_${randomstring({length: 8})}`,
        "brandName": `SNK_${randomstring({length: 8})}`,
        "publicAddress": address
      }

      let url = '/v1/admin/brand/create'
      let response = await post_client(url, body, {
        Authorization: `Bearer ${jwt}`
      })

      const edit_test_new_company_name = randomstring({length: 10})
      const edit_test_new_brand_name = randomstring({length: 10})
      const edit_test_new_contact_name = randomstring({length: 10})

      body = {
        id: response.body.payload._id,
        companyName: edit_test_new_company_name,
        brandName: edit_test_new_brand_name,
        tryAttack: "ahahaha",
        contactName: edit_test_new_contact_name
      }
      url = path

      response = await http_client('PUT', url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(400)
    })

    it("No such brand", async function () {
      let body = {
        id: 'kdkaeefk8d33f3fakjfe'
      }
      let url = path

      let response = await http_client('PUT', url, body, {
        Authorization: `Bearer ${jwt}`
      })

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('code').to.equal(-3)
    })
  })
})