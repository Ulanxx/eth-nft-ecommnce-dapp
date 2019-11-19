import constants from "../../../common/constants";

const auto = require('auto-promise')

/**
 * brand user list:
 *
 * @param body:
 * {
 *   conditions:  compliant with mongoose find
 *   options:     compliant with mongoose find
 * }
 * @returns {Promise<model instances>}
 */
async function logic(body) {
  const ModelBrandUser = global.db.user
  const result = await auto({
      brand_users: async () => {
        const condition = {role: constants.USER_ROLE_BRAND, disabled: {$ne: true}}
        const docs = await ModelBrandUser.find(condition, null).sort({_id: -1})
        return docs
      }
    })

  return result.brand_users
}

export default logic