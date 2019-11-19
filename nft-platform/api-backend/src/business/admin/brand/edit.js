const auto = require('auto-promise')

/**
 * Brand user info edit:
 * @param body
 * {
 *   conditions:  compliant with mongoose find
 *   options:     compliant with mongoose find
 * }
 * @returns {Promise<model instance>}
 */
async function logic(body) {
  if (body.publicAddress){
    body.publicAddress = body.publicAddress.toLowerCase()
  }

  const ModelBrandUser = global.db.user

  body.userInfo = {
    "companyName":  body.companyName,
    "brandName": body.brandName,
    "publicAddress": body.publicAddress
  }

  body.updatedAt = new Date()

  delete body.companyName
  delete body.brandName
  delete body.publicAddress

  try{
    const result = await auto({
      brand_user: async () => {
        let doc = await ModelBrandUser.findById(body.id)
        await doc.updateOne(body)
        doc = await ModelBrandUser.findById(body.id)
        return doc
      }
    })
    return result.brand_user
  }catch(err){
    logger.error(err)
  }
}

export default logic