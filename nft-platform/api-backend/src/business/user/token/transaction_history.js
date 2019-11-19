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
    variantIds: async () => {
      if (body.symbolId) {
        const symbol = await ModelSymbolVariant.findById(body.symbolId)
        if (symbol) {
          return _.map(symbol.variants, (v) => {
            return v._id
          })
        }
      }
    },
    _distinctTokenObjectIds: async () => {
      const end_user = await ModelBrandUser.findById(user_id)
      const publicAddress = end_user.userInfo.publicAddress.toLowerCase()

      const condition = {
        $or: [{from: publicAddress}, {to: publicAddress}]
      }
      if (body.timeStart) {
        condition.createdAt = {$gte: new Date(body.timeStart)}
      }
      if (body.timeEnd) {
        condition.createdAt = {$lte: new Date(body.timeEnd)}
      }
      if (body.status) {
        condition.status = body.status.toUpperCase()
      }

      return await ModelTransaction.find(condition).distinct('tokenObjectId')
    },
    _transactions: async () => {
      const end_user = await ModelBrandUser.findById(user_id)
      const publicAddress = end_user.userInfo.publicAddress.toLowerCase()

      const condition = {
        $or: [{from: publicAddress}, {to: publicAddress}]
      }
      if (body.timeStart) {
        condition.createdAt = {$gte: new Date(body.timeStart)}
      }
      if (body.timeEnd) {
        condition.createdAt = {$lte: new Date(body.timeEnd)}
      }
      if (body.status) {
        condition.status = body.status.toUpperCase()
      }

      const transactions = await ModelTransaction.find(condition).sort({createdAt: -1}).lean()

      return transactions
    },
    transactions: async (_transactions, variantIds, _distinctTokenObjectIds) => {
      const condition = {
        _id: {$in: _distinctTokenObjectIds}
      }
      if (variantIds) {
        condition.variantId = {$in: variantIds}
      }

      const tokens = await ModelMint.find(condition)

      const tokenVariantIds = _.map(tokens, t=>{
        return t.variantId
      })

      const symbolVariants = await ModelSymbolVariant.find({'variants._id': {$in: tokenVariantIds}})

      _.forEach(_transactions, t => {
        const token = _.find(tokens, {_id: t.tokenObjectId})
        const sv = _.find(symbolVariants, (sv) => {
          return !!_.find(sv.variants, {_id: token.variantId})
        })
        t.symbol = sv
        t.contractAddress = token.contractAddress
        t.tokenId = token.tokenId
        t.variantId = token.variantId
      })

      return _transactions
    }
  })
  return result
}

export default logic