import { ErrorStatusCode, random } from '../common/utils'
import constants from '../common/constants'

const REDIS_HASH_KEY_METAMASK_NONCE = constants.REDIS_HASH_KEY_METAMASK_NONCE

/**
 * generate a nonce for a potential metamask login user
 * @param public_address
 * @returns {Promise<*>}
 */
async function logic(public_address) {
  public_address = public_address.toLowerCase()
  const nonce = random(100000, 900000)
  await global.redis.hsetAsync(REDIS_HASH_KEY_METAMASK_NONCE, public_address, nonce)

  return nonce
}

export default logic
