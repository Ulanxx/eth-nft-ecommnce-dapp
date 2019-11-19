const auto = require('auto-promise')
import {ErrorStatusCode} from "../../../common/utils"
import moment from 'moment'
import mongoose from 'mongoose'

/**
 * get brand user profile info
 * @param user_id
 * @param role
 * @returns {Promise<void>}
 */
async function logic(user_id, role) {
  const ModelBrandUser = global.db.user

  const brand_user = await ModelBrandUser.findById(user_id).lean()
  delete brand_user.bills
  delete brand_user.__v

  return brand_user
}

export default logic