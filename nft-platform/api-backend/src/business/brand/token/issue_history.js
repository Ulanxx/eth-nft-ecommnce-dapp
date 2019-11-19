const auto = require('auto-promise')
import {ErrorStatusCode} from "../../../common/utils"
import moment from 'moment'
import mongoose from 'mongoose'

/**
 *
 * @param user_id
 * @param role
 * @param body
 * @returns {Promise<void>}
 */
async function logic(user_id, role, body) {
  const ModelBrandUser = global.db.user
  const ModelBill = global.db.bill
  const ModelMint = global.db.mint
  const ModelSymbolVariant = global.db.symbolVariant
  const ModelVariantIssueHistory = global.db.variantIssueHistory
  let batch_list = []

  const result = await auto({
    user: async () => {
      const user = await ModelBrandUser.findById(user_id)
      if (!user) {
        throw new ErrorStatusCode(200, -3, 'no such brand user existing')
      }
      return user
    },
    symbolVariants: async (user) => {
      const symbolIds = user.symbolComplexIds || []
      const symbol_variant = await ModelSymbolVariant.find({
        _id: {$in: symbolIds}
      }).lean()
      return symbol_variant
    },
    history: async (user, symbolVariants) => {
      for (let symbol of symbolVariants) {
        const all = []
        for (let v of symbol.variants) {
          all.push(new mongoose.Types.ObjectId(v._id))
        }

        const batches = await ModelVariantIssueHistory.find({
          "batch.variantId": {$all: all}
          //"batch.variantId": v._id
        }, {batch: 1}).lean()

        for (let b of batches) {
          for (let v of b.batch) {
            /*
            const aggregation = await ModelMint.aggregate([
              {
                $match:
                  {variantId: v.variantId, to: user.userInfo.publicAddress, status: 'IDLE'}
              },
              {
                $count: "amountIdle"
              }
            ])
            */
            const aggregation = await ModelMint.aggregate([
              {
                $match:
                  {variantId: v.variantId}
              },
              {
                $group: {
                  _id: {status: "$status", to: "$to"},
                  count: {$sum: 1}
                }
              }
            ])
            v.amountIdle = 0
            v.amountTransferring = 0
            v.amountTransferred = 0

            if (aggregation.length > 0) {
              for (let a of aggregation) {
                if (a._id.status === 'IDLE') {
                  if (a._id.to === user.userInfo.publicAddress) {
                    v.amountIdle = a.count
                  } else {
                    v.amountTransferred += a.count
                  }
                }
                if (a._id.status === 'TRANSFERRING') {
                  if (a._id.to === user.userInfo.publicAddress) {
                    v.amountTransferring = a.count
                  } else {
                    v.amountTransferred += a.count
                  }
                }
              }
            }

            v.amountMinting = v.amount - v.amountIdle - v.amountTransferring - v.amountTransferred
          }
        }

        //logger.info('batches')
        //logger.info(JSON.stringify(batches))

        batch_list = batch_list.concat(batches)
      }

      return {
        symbolVariants,
        batchList: batch_list
      }
    }
  })
  return result
}

export default logic