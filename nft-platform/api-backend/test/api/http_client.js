import config from '../config'

const url = require('url')
const rp = require('request-promise')
const _ = require('lodash')

let uri_prefix = `http://${config.server.ip}:${config.server.port}`

let options_defaults = {
  method: 'GET',
  json: true, // Automatically stringifies the body to JSON
  resolveWithFullResponse: true,
  simple: false,
  headers: {}
}

async function http_client(method, path, body, headers = {}) {
  let options = {}
  Object.assign(options, _.cloneDeep(options_defaults), {uri: url.resolve(uri_prefix, path), body: body})
  options.method = method
  for (let h of Object.keys(headers)) {
    options.headers[h] = headers[h]
  }
  return await rp(options)
}

export default http_client

