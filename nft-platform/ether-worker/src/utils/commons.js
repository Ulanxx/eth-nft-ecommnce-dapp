/**
 * created by lujun at 2018-09-25 14:03
 */
import fs from 'fs-plus'
import path from 'path'
import _ from 'lodash'
const sha3_256 = require('js-sha3').sha3_256

export default class Commons {
  static getConfig(name) {
    let filePath = path.join(
      __dirname,
      `./../../config/${process.env.NODE_ENV}/${name}.json`
    )
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, `./../../config/env/${name}.json`)
    }
    return require(filePath)
  }

  static base64Encode(str) {
    return Buffer.from(str).toString('base64')
  }

  static base64Decode(str) {
    return Buffer.from(str, 'base64').toString()
  }

  static base64EncodeObject(obj) {
    return Commons.base64Encode(JSON.stringify(obj))
  }

  static base64DecodeObject(str) {
    return JSON.parse(Commons.base64Decode(str))
  }

  static calculateHash(obj) {
    return `0x${sha3_256(obj)}`
  }
}
