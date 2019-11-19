const auto = require('auto-promise')

import constants from "../../../common/constants"
import _ from 'lodash'
import {ErrorStatusCode} from "../../../common/utils"
import moment from 'moment'
import mongoose from 'mongoose'
import ethlib from 'eth-lib'

const Web3 = require('web3')
const web3 = new Web3()

/**
 * Process brand token issue request:
 * @param body
 *  refers to: token issue request definition
 * @returns {Promise<model_instance>}
 */
async function logic(user_id, role, body) {
  const ModelUser = global.db.user
  const ModelMint = global.db.mint
  const ModelTransaction = global.db.transaction
  body.toAddress = body.toAddress.toLowerCase()
  body.contractAddress = body.contractAddress.toLowerCase()

  const result = await auto({
    end_user: async () => {
      const end_user = await ModelUser.findById(user_id)
      return end_user
    },
    token: async (end_user) => {
      let token

      token = await ModelMint.findOne({
        contractAddress: body.contractAddress,
        tokenId: body.tokenId,
        to: end_user.userInfo.publicAddress.toLowerCase(),
        status: 'IDLE'
      })

      if (token) {
        return token
      } else {
        throw new ErrorStatusCode(200, -8, 'no enough tokens to transfer')
      }
    },
    transfer: async (token, end_user) => {
      const now = new Date()
      // TODO: what if mq broker goes wrong?
      const t = new ModelTransaction(
        {
          "from": end_user.userInfo.publicAddress.toLowerCase(),
          "to": body.toAddress,
          "tokenObjectId": token._id,
          "txHash": body.txHash,
          createdAt: now,
          "status": "TRANSFERRING"
        })
      await t.save()
      token.status = "TRANSFERRING"
      await token.save()
    }
  })
  return result
}

export default logic