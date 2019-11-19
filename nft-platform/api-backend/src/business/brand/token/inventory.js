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
  const ModelBrandUser = global.db.user
  const ModelMint = global.db.mint
  const ModelSymbolVariant = global.db.symbolVariant
  const ModelBatch = global.db.variantIssueHistory

  const result = await auto({
    brand_user: async () => {
      const brand_user = await ModelBrandUser.findById(user_id)
      return brand_user
    },
    variantIds: async (brand_user) => {
      if (!body.batchId){
        const symbols = await ModelSymbolVariant.find({_id: {$in: brand_user.symbolComplexIds}})
        const embeddedVariantIds = _.map(symbols, s => {
          return _.map(s.variants, v =>{
            return v._id
          })
        })

        return _.flattenDeep(embeddedVariantIds)
      }else{
        const batch_id = new mongoose.Types.ObjectId(body.batchId)
        const batch = await ModelBatch.findById(batch_id)
        if (batch){
          return _.map(batch.batch, (b) => {
            return b.variantId
          })
        }else{
          return []
        }
      }
    },
    variants: async (brand_user, variantIds) => {
      let tokens = []

      for (let vid of variantIds){
        const variant = await ModelSymbolVariant.findOne({'variants._id': vid}).lean()
        variant.variants = _.filter(variant.variants, {_id: vid})

        variant.tokens = await ModelMint.find({variantId: vid}).lean()
        tokens.push(variant)
      }
      return tokens
    },
  })
  return result
}

export default logic