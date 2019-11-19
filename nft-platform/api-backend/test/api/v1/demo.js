let body

import post_client from '../http_post_client'
const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const moment = require('moment')

function jwt_creation(payload = {}) {
  return new Promise((resolve, reject) =>
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

describe("API TEST [DEMO]", function(){
  let path = '/v1/demo'
  describe("/v1/demo", function(){
    it("Everything should be OK",async function(){
      body = {
        param1: 'kdki',
        param2: '555-1212'
      }
      const response = await post_client(path, body)

      expect(response.statusCode).to.equal(200)
      expect(response.body).to.have.property('result').equal('This is a demo')
    })

    it("Bad request: param1 is not string",async function(){
      body = {
        param1: 3,
        param2: '555-1212'
      }
      const response = await post_client(path, body)

      expect(response.statusCode).to.equal(400)
    })

    it("Bad request: param1 longer than 5",async function(){
      body = {
        param1: '33fffdfdf33',
        param2: '555-1212'
      }
      const response = await post_client(path, body)

      expect(response.statusCode).to.equal(400)
    })

    it("Bad request: param2 NOT phone number",async function(){
      body = {
        param1: 'kdki',
        param2: 'dddfdfee'
      }
      const response = await post_client(path, body)

      expect(response.statusCode).to.equal(400)
    })

    it("Bad request: explicitly trigger an error",async function(){
      body = {
        param1: 'Error',
        param2: '555-1212'
      }
      const response = await post_client(path, body)

      expect(response.statusCode).to.equal(400)
      expect(response.body).to.have.property('message')
      expect(response.body).to.have.property('code')
    })

    it("Bad request: unexpected disaster",async function(){
      body = {
        param1: 'Disas',
        param2: '555-1212'
      }
      const response = await post_client(path, body)

      expect(response.statusCode).to.equal(500)
    })
  })

  describe("/v1/demo_auth", function() {
    let path = '/v1/demo_auth'
    it("always get HTTP 401, NOT Authorized", async function () {
      body = {}
      const response = await post_client('/v1/demo_auth', body)

      expect(response.statusCode).to.equal(401)
    })

    it("Authentication passed by JWT", async function () {
      body = {

      }
      const token = await jwt_creation({id: 'userid'})

      let headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await post_client(path, body, headers)

      expect(response.statusCode).to.equal(200)
    })

    it("JWT expiration", async function () {
      body = {

      }
      const token = await jwt_creation({id:'user_id', iat: moment().valueOf()/1000/2})

      let headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await post_client(path, body, headers)

      expect(response.statusCode).to.equal(401)
    })
  })
})