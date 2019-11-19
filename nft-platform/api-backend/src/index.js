import {logger} from './framework/log4js'
import config from './framework/config'
import app_routine from './framework/middleware_scaffold'
const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')

async function main(){
  global.APP_NAME = 'API Portal Server'

  require('./framework/signal')
  logger.info(`------------- ${APP_NAME} starts --------------`)

// SSL options
  let options = {
    key: fs.readFileSync(path.join(process.cwd(), 'config', 'keys', 'domain.key')),
    cert: fs.readFileSync(path.join(process.cwd(), 'config', 'keys', 'domain.crt'))
  };

// start the server
  let app = await app_routine()
  http.createServer(app.callback()).listen(config.server.port);
//https.createServer(options, app.callback()).listen(config.server.port);
  logger.info(`server ip: ${config.server.ip}`)
  logger.info(`server port: ${config.server.port}`)
}

main()

