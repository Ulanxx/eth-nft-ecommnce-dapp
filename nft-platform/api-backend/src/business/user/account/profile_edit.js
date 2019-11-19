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

  body.userInfo = {
    "companyName": body.companyName,
    "brandName": body.brandName,
  }

  delete body.companyName
  delete body.brandName

  const result = await auto({
    old_brand_user: async () => {
      const brand_user = await ModelBrandUser.findById(user_id)
      return brand_user
    },
    new_brand_user: async (old_brand_user) => {
      await old_brand_user.updateOne(body)
      const doc = await ModelBrandUser.findById(user_id).lean()
      return doc
    }
  })
  return result
}

export default logic