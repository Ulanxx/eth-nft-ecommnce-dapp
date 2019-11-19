/**
 * created by lujun at 2018-09-25 14:03
 */

import log4js from 'log4js'
import Commons from './../utils/commons'
import path from 'path'
import fs from 'fs-plus'
let config,logger
try {
  config = Commons.getConfig('log')
  log4js.configure(config)
  logger = log4js.getLogger()
  global.logger = logger
} catch (e) {
  console.log('日志配置文件错误')
  console.log(e)
  process.exit(0)
}
export { logger , log4js}
