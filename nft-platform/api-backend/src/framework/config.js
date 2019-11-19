const path = require('path')
let config, file_name

if (process.env.NODE_ENV === 'development') {
  file_name = 'server.dev.json'
} else if (process.env.NODE_ENV){
  file_name = `server.${process.env.NODE_ENV}.json`
} else{
  // defaults to this config path
  file_name = 'server.json'
}

config = require(path.join(process.cwd(), 'config', file_name))

export default config

