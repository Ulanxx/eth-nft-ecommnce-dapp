import constants from "../../../common/constants";

const auto = require('auto-promise')
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
  const ModelBill = global.db.bill
  const ModelSymbolVariant = global.db.symbolVariant
  const VariantIssueHistory = global.db.variantIssueHistory

  // TODO: calculate the cost to mint
  const cost = 0
  const result = await auto({
    brand_user: async () => {
      const brand_user = await ModelBrandUser.findById(user_id)
      if (brand_user.balance >= cost) {
        return brand_user
      } else {
        throw new ErrorStatusCode(200, -6, 'no enough balance in your account, please deposit.')
      }
    },
    symbolVariant: async (brand_user) => {
      const user = brand_user

      if (!(user.symbolComplexIds instanceof Array)) {
        user.symbolComplexIds = []
      }
      let symbol = await ModelSymbolVariant.findOne({
        _id: {$in: user.symbolComplexIds},
        symbol: body.symbol
      })

      if (true) {
        body.variants.forEach((v) => {
          v._id = new mongoose.Types.ObjectId
        })
        symbol = new ModelSymbolVariant(body)
        await symbol.save()
      } /*else {
        // body.variants  - symbol.variants
        const new_variants = _.differenceWith(body.variants,
          symbol.variants,
          (a, b) => {
            return a.symbol === b.symbol
          })

        new_variants.forEach((v) => {
          v._id = new mongoose.Types.ObjectId
        })
        symbol.variants.concat(new_variants)
        await symbol.save()
      }*/
      user.symbolComplexIds.push(symbol._id)
      await user.save()
      return symbol
    },
    mint: async (brand_user, symbolVariant) => {
      const now = moment().toDate()
      body.variants.forEach((v) => {
        v.variantId = v._id
        delete v._id
        v.createdAt = now
      })
      const history = new VariantIssueHistory({
        cost: cost,
        batch: body.variants
      })
      await history.save()

      brand_user.balance -= cost
      await brand_user.save()

      const header = {
        'destination': 'ether_tasks',
        'ack': 'client-individual'
      }
      // TODO: what if mq broker goes wrong?
      await global.mq.sendAsync(header, JSON.stringify({
        command: 'TOKEN_ISSUE',
        payload: {
          publicAddress: brand_user.userInfo.publicAddress,
          tokenDetail: body,
        }
      }))
    }
  })
  return result
}

export default logic