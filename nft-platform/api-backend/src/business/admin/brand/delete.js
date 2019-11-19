const auto = require('auto-promise')

/**
 * Brand user deletion:
 * @param id    mongodb document id
 * @returns {Promise<model instance>}
 */
async function logic(id) {
  const ModelBrandUser = global.db.user

  const result = await auto({
    deleted_brand: async () => {
      try {
        const user = await ModelBrandUser.findById(id)
        if (user && !user.disabled) {
          user.disabled = true
          await user.save()
          return user
        }
      } catch (err) {
        logger.error(err)
      }
    }
  })
  return result.deleted_brand
}

export default logic
