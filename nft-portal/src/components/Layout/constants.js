const tokens = { name: 'Tokens', path: '/tokens' }
const mint = { name: 'Mint', path: '/tokens/mint' }
const transfers = { name: 'Transactions', path: '/transactions' }
const detail = { name: 'Detail', path: '/'}

export const pathNameMapBreadcrumb = {
  '/tokens': [tokens],
  '/tokens/mint': [tokens, mint],
  '/transactions': [transfers],
  '/tokens/:id': [tokens, detail],
}


