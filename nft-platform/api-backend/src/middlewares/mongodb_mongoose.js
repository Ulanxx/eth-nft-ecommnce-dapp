const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const defaults_options = {
  hostname: '127.0.0.1',
}

module.exports = async function (opts) {
  let _opts = {}
  Object.assign(_opts, defaults_options, opts)

  const user = encodeURIComponent(opts.user)
  const password = encodeURIComponent(opts.password)
  const authMechanism = opts.authMechanism

  const url = `mongodb://${user}:${password}@${opts.host}:${opts.port}/${opts.db}?authMechanism=${authMechanism}&authSource=${opts.authSource}`
  mongoose.set('useNewUrlParser', true)
  mongoose.connect(url)
  const db = mongoose.connection
  db.on('error', err => logger.error(`mongodb connection error: ${err}`))
  db.once('open', function () {
    logger.info(`Connected to mongodb with mongoose: ${opts.host}: ${opts.port}`)
  })

  const schemas = {}

  // iterate all src/schemas/*.json
  const files = fs.readdirSync(path.join(__dirname, '..', 'schemas'))

  files.forEach(function (file) {
    const full_path = path.join(__dirname, '../', 'schemas', file)
    const base_name = path.basename(file, '.json')
    if (file.endsWith('.json') && fs.lstatSync(full_path).isFile()) {
      const data = fs.readFileSync(full_path, 'utf8')

      const schema = new mongoose.Schema(JSON.parse(data))
      const model = mongoose.model(base_name, schema)
      schemas[base_name] = model
    }
  })

  global.db = schemas
  return async (ctx, next) => {
    ctx.db = schemas
    return next()
  }
}
