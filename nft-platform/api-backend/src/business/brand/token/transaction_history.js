const auto = require('auto-promise')

import constants from "../../../common/constants"
import _ from 'lodash'
import {ErrorStatusCode} from "../../../common/utils"
import moment from 'moment'
import mongoose from 'mongoose'

/**
 * Process brand token issue request:
 * @param body
 *  refers to: token issue request definition
 * @returns {Promise<model_instance>}
 */
async function logic(user_id, role, body) {
  const ModelBrandUser = global.db.user
  const ModelMint = global.db.mint
  const ModelTransaction = global.db.transaction
  const ModelSymbolVariant = global.db.symbolVariant

  const result = await auto({
    symbolVariants: async () => {
      const brand_user = await ModelBrandUser.findById(user_id)
      let symbolIds = []
      if (body.symbolId){
        symbolIds.push(body.symbolId)
      }else{
        symbolIds = brand_user.symbolComplexIds
      }

      const symbolVariants = await ModelSymbolVariant.find({
        _id: {$in: symbolIds}
      }).lean()

      return symbolVariants
    },
    variantIds: async (symbolVariants) => {
      let variants = []

      _.forEach(symbolVariants, (sv) => {
        variants = variants.concat(sv.variants)
      })

      return _.map(variants, (v) => {return v._id})
    },
    tokens: async (variantIds) => {
      const condition = {
        variantId: {$in: variantIds},
      }

      const tokens = await ModelMint.find(condition).lean()
      return tokens
    },
    transactions: async (tokens, symbolVariants) => {
      const tokenIds = _.map(tokens, t => {
        return t._id
      })
      const condition = {
        tokenObjectId: {$in: tokenIds}
      }
      if (body.timeStart){
        condition.createdAt = {$gte: new Date(body.timeStart)}
      }
      if (body.timeEnd){
        condition.createdAt = {$lte: new Date(body.timeEnd)}
      }
      if (body.status){
        condition.status = body.status.toUpperCase()
      }
      if (body.to){
        condition.to = body.to.toLowerCase()
      }

      const transactions = await ModelTransaction.find(condition).sort({createdAt: -1}).lean()
      _.forEach(transactions, t => {
        const token = _.find(tokens, {_id: t.tokenObjectId})
        const sv = _.find(symbolVariants, (sv) => {
          return !!_.find(sv.variants, {_id: token.variantId})
        })
        t.symbol = sv
        t.contractAddress = token.contractAddress
        t.tokenId = token.tokenId
        t.variantId = token.variantId
      })

      return transactions
    }
  })
  return result
}

export default logic