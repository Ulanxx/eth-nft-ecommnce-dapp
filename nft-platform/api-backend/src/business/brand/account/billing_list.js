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

  const result = await auto({
    user: async() => {
      const user = await ModelBrandUser.findById(user_id)
      return user
    },
    bills: async (user) => {
      if (user){
        const query_condition = {}
        query_condition._id = user_id
        if (body.startTime || body.endTime){
          query_condition['bills.createdAt'] = {}
          if (body.startTime) {
            query_condition['bills.createdAt']['$gte'] = moment(body.startTime).toDate()
          }
          if (body.endTime) {
            query_condition['bills.createdAt']['$lte'] = moment(body.endTime).toDate()
          }
        }

        const users = await ModelBrandUser.find(query_condition, {bills: 1}).sort({'bills.createdAt': -1})

        if (users.length >=1){
          return users[0].bills
        }else{
          return []
        }
      }
    }
  })
  return result
}

export default logic