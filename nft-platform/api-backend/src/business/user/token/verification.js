const auto = require('auto-promise')
import {ErrorStatusCode} from "../../../common/utils"
import moment from 'moment'
import mongoose from 'mongoose'
import _ from 'lodash'
/**
 *
 * @param user_id
 * @param role
 * @param body
 * @returns {Promise<void>}
 */
async function logic(user_id, role, body) {
  const ModelUser = global.db.user
  const ModelSymbolVariant = global.db.symbolVariant
  const ModelMint = global.db.mint

  const result = await auto({
    user: async() => {
      const user = await ModelUser.findById(user_id)
      return user
    },
    token: async(user) => {
      const condition = {
        to: user.userInfo.publicAddress.toLowerCase(),
        uniqueSig: body.uniqueSig,
        status: "IDLE"
      }
      if (body.tokenId){
        condition.tokenId = body.tokenId
      }
      const token = await ModelMint.findOne(condition)
      return token
    },
    verification: async (token) => {
      return !!token
    },
    productDetail: async(verification, token) => {
      if (verification){
        const variant_id = new mongoose.Types.ObjectId(token.variantId)
        const symbol = await ModelSymbolVariant.findOne({
          'variants._id': variant_id
        })
        const variant = _.find(symbol.variants, {_id: variant_id })

        return {
          "symbol": symbol.symbol,
          "brand" : symbol.brand,
          "name" : symbol.name,
          "category" : symbol.category,
          "description" : symbol.description,
          "sku": variant.sku,
          "title": symbol.title,
          "url": symbol.url,
          "variant": variant.variant,
          price: variant.price
        }
      }
    }
  })
  return result
}

export default logic