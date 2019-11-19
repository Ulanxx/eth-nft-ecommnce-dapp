import { ErrorStatusCode, jwt_creation } from '../common/utils'
import constants from '../common/constants'
import ethUtil from 'ethereumjs-util'
import config from '../framework/config'

function metamask_auth(signature, nonce) {
  const msg = `${nonce}`

  // We now are in possession of msg, publicAddress and signature. We
  // can perform an elliptic curve signature verification with ecrecover
  const msgBuffer = ethUtil.toBuffer(msg)
  const msgHash = ethUtil.hashPersonalMessage(msgBuffer)
  const signatureBuffer = ethUtil.toBuffer(signature)
  const signatureParams = ethUtil.fromRpcSig(signatureBuffer)
  const publicKey = ethUtil.ecrecover(
    msgHash,
    signatureParams.v,
    signatureParams.r,
    signatureParams.s
  )

  const addressBuffer = ethUtil.publicToAddress(publicKey)
  const address = ethUtil.bufferToHex(addressBuffer)
  return address
}

const REDIS_HASH_KEY_METAMASK_NONCE = constants.REDIS_HASH_KEY_METAMASK_NONCE

/**
 * authenticate eth address and issue a JWT
 * @param public_address
 * @param signature
 * @returns {Promise<*>}
 */
async function logic(public_address, signature) {
  public_address = public_address.toLowerCase()
  const nonce = await global.redis.hgetAsync(
    REDIS_HASH_KEY_METAMASK_NONCE,
    public_address
  )
  if (nonce) {
    const sender = await metamask_auth(signature, nonce)
    if (sender && sender.toLowerCase() === public_address) {
      await global.redis.hdelAsync(
        REDIS_HASH_KEY_METAMASK_NONCE,
        public_address
      )
      const ModelUser = global.db.user
      const user = await ModelUser.findOne({
        'userInfo.publicAddress': public_address
      })
      console.log(user, 'user')
      if (user) {
        const secret = config.login.jwt_secret
        return await jwt_creation(secret, { id: user._id, role: user.role })
      } else {
        const doc = new ModelUser({
          userInfo: {
            publicAddress: public_address
          },
          role: constants.USER_ROLE_ENDUSER,
          balance: 0.0
        })
        await doc.save()
        const secret = config.login.jwt_secret
        return await jwt_creation(secret, { id: doc._id, role: doc.role })
      }
    } else {
      logger.warn(
        `metamask_auth failed: fake public address = ${public_address}, calculated sender = ${sender}`
      )
    }
  } else {
    logger.warn(`no valid nonce found for public address: ${public_address}`)
  }
}

export default logic
