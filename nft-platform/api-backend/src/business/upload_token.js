import qn from 'qiniu'
import config from '../framework/config'

/**
 * Generate a upload token
 * @returns {Promise<*>}
 */
async function logic() {
  const {upload: {qiniu}} = config
  let mac = new qn.auth.digest.Mac(qiniu.access_key, qiniu.secret_key)
  let options = {
    scope: qiniu.scope,
    expires: qiniu.expires
  }
  let putPolicy = new qn.rs.PutPolicy(options)
  return {
    prefix_url: qiniu.prefix_url,
    upload_url: qiniu.upload_url,
    token: putPolicy.uploadToken(mac)
  }
}

export default logic