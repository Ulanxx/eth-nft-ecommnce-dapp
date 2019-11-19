const path = require('path')
import config from './config'

const Koa = require('koa')
const cors = require('koa-cors')
const body_parser = require('koa-json-body')
const authentication = require('../middlewares/authentication')
const request_debugging = require('../middlewares/request_debugging')
const response_debugging = require('../middlewares/response_debugging')
const redis = require('../middlewares/redis')
const mq = require('../middlewares/mq')
//const db = require('../middlewares/mongodb')
import mq_config_subcription from '../business/callback/message_broker'
const db = require('../middlewares/mongodb_mongoose')
const route = require('../middlewares/route')
const route_config = require(path.join(process.cwd(), 'config', 'routes.json'))
const app = new Koa()

async function app_routine() {
  // mq, db, redis
  app.use(redis(config.redis))
  app.use(await db(config.database))

  const mq_config = config.mq
  mq_config.subscription = mq_config_subcription
  app.use(await mq(config.mq))

  app.use(body_parser({fallback: true, returnRawBody: true}))
  app.use(request_debugging())
  app.use(cors())
  app.use(authentication({
    token_auto_expire: config.login.token_auto_expire,
    routes: route_config.routes,
    jwt_secret: config.login.jwt_secret
  }))

  // routes
  app.use(route(route_config))
  app.use(response_debugging())
  return app
}

export default app_routine
