const auto = require('auto-promise')

/**
 * Brand user creation:
 * @param body
 *  refers to: brand user fields definition
 * @returns {Promise<model instance>}
 */
async function logic(body) {
  const ModelBrandUser = global.db.user
  body.publicAddress = body.publicAddress.toLowerCase()

  try {
    const result = await auto({
      public_address: () => {
        return body.publicAddress
      },
      check_existing: async (public_address) => {
        const doc = await ModelBrandUser.findOne({ 'userInfo.publicAddress': public_address })
        return !!doc
      },
      new_brand: async (public_address, check_existing) => {
        if (!check_existing) {
          const doc = new ModelBrandUser({
            userInfo: {
              'companyName': body.companyName,
              'brandName': body.brandName,
              'publicAddress': public_address
            },
            role: 'BRAND',
            'contactName': body.contactName,
            'contactEmail': body.contactEmail,
            'contactPhoneNumber': body.contactPhoneNumber,
            disabled: false,
            updatedAt: new Date(),
            balance: 0.0
          })
          await doc.save()
          return doc
        }
      }
    })
    return result.new_brand
  } catch (err) {
    logger.error(err)
  }
}

export default logic
