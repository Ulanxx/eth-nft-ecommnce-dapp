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
  const ModelSymbolVariant = global.db.symbolVariant

  const result = await auto({
    brand_user: async () => {
      const brand_user = await ModelBrandUser.findById(user_id)
      return brand_user
    },
    symbolVariant: async (brand_user) => {
      const user = brand_user

      if (!(user.symbolComplexIds instanceof Array)) {
        user.symbolComplexIds = []
      }

      let symbols = await ModelSymbolVariant.find({
        _id: {$in: user.symbolComplexIds},
      })

      return symbols
    },
  })
  return result
}

export default logic