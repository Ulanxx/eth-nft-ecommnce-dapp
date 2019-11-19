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
  const ModelUser = global.db.user
  const ModelMint = global.db.mint
  const ModelSymbolVariant = global.db.symbolVariant
  const ModelBatch = global.db.variantIssueHistory

  const result = await auto({
    end_user: async () => {
      const end_user = await ModelUser.findById(user_id)
      return end_user
    },
    variantIds: async (end_user) => {
      const publicAddress = end_user.userInfo.publicAddress.toLowerCase()
      const variantIds = await ModelMint.find({to: publicAddress}).distinct('variantId')
      return variantIds
    },
    variants: async (end_user, variantIds) => {
      const publicAddress = end_user.userInfo.publicAddress.toLowerCase()
      let tokens = []

      for (let vid of variantIds){
        const variant = await ModelSymbolVariant.findOne({'variants._id': vid}).lean()
        variant.variants = _.filter(variant.variants, {_id: vid})

        variant.tokens = await ModelMint.find({variantId: vid, to:publicAddress}).lean()
        tokens.push(variant)
      }
      return tokens
    },
  })
  return result
}

export default logic