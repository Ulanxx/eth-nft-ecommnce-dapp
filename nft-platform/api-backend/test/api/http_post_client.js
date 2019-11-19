import config from '../config'

const url = require('url')
const rp = require('request-promise')
const _ = require('lodash')

let uri_prefix = `http://${config.server.ip}:${config.server.port}`

let options_defaults = {
  method: 'POST',
  json: true, // Automatically stringifies the body to JSON
  resolveWithFullResponse: true,
  simple: false,
  headers: {}
}

async function http_post_client(path, body, headers = {}) {
  let options = {}
  Object.assign(options,
    _.cloneDeep(options_defaults),
    {uri: url.resolve(uri_prefix, path), body: body})
  for (let h of Object.keys(headers)) {
    options.headers[h] = headers[h]
  }
  return await rp(options)
}

export default http_post_client

