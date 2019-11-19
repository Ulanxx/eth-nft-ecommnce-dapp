import { flatten, toLower } from 'lodash'
import userStore from '../../base/userStore'
import { status } from './constants'

export function tokensForDispaly(variants) {
  const list = variants.map(
    v => {
      const { brand, category, description, name, symbol, title, url } = v
      const { price, sku, variant } = v.variants[0]
      return v.tokens.map(
        token => ({
          ...token,
          title,
          url,
          price,
          sku,
          variant,
          brand,
          category,
          description,
          name,
          symbol,
          status: toLower(userStore.publicAddress) !== toLower(token.to) ? 'TRANSFERRED' : token.status
        })
      )
    }
  )
  return flatten(list)
}


export function shouldForbid(token) {
  if (token.status === status.TRANSFERRING) {
    return 'The token is transferring'
  }
  if (token.status === status.TRANSFERRED) {
    return 'The token has been transferred'
  }
  return null
}
