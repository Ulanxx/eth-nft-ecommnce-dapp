import constants from "../../../common/constants"

const auto = require('auto-promise')
import _ from 'lodash'
import {ErrorStatusCode} from "../../../common/utils"
import moment from 'moment'
import mongoose from 'mongoose'

/**
 * query all symbols associated to some brand:
 * @param body
 *  refers to: token issue request definition
 * @returns {Promise<model_instance>}
 */
async function logic(user_id, role, body) {
  const ModelEndUser = global.db.user
  const ModelSymbolVariant = global.db.symbolVariant
  const ModelMint = global.db.mint

  const result = await auto({
    end_user: async () => {
      const end_user = await ModelEndUser.findById(user_id)
      return end_user
    },
    symbolVariant: async (end_user) => {
      let publicAddress = end_user.userInfo.publicAddress
      publicAddress = publicAddress.toLowerCase()

      const variantIds = await ModelMint.find({to: publicAddress}).distinct('variantId')

      let symbols = await ModelSymbolVariant.find({
        "variants._id": {$in: variantIds},
      })

      return symbols
    },
  })
  return result
}

export default logic