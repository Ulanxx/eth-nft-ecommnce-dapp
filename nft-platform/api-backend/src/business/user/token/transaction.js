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

  const result = await auto({
    end_user: async () => {
      const end_user = await ModelBrandUser.findById(user_id)
      if (end_user.userInfo.publicAddress.toLowerCase() !== body.from_address
        || body.from_address === body.to_address) {
        throw new ErrorStatusCode(200, -10, 'receiver\'s address is the same as the sender\'s')
      }
      return end_user
    },
    token: async (end_user) => {
      let token

      token = await ModelMint.findOne({
        contractAddress: body.contract_address,
        tokenId: body.token_id,
        to: body.from_address,
        status: 'IDLE'
      })

      if (token) {
        return token
      } else {
        throw new ErrorStatusCode(200, -8, 'no enough tokens to transfer')
      }
    },
    transfer: async (token, end_user) => {
      const header = {
        'destination': 'ether_tasks',
        'ack': 'client-individual'
      }
      const now = new Date()
      // TODO: what if mq broker goes wrong?
      const t = new ModelTransaction(
        {
          "from": body.from_address,
          "to": body.to_address,
          "tokenObjectId": token._id,
          createdAt: now,
          "status": "TRANSFERRING"
        })

      await t.save()

      token.status = "TRANSFERRING"
      await token.save()
      await global.mq.sendAsync(header, JSON.stringify({
        command: 'TOKEN_TRANSFER_RAW',
        payload: {
          transaction_id: t._id,
          dataSigned: body.dataSigned,
          tokenId: body.token_id,
          contractAddress: body.contractAddress
        }
      }))
    }
  })
  return result
}

export default logic