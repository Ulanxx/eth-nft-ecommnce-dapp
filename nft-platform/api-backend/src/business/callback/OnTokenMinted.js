export default async function OnTokenMint(body) {
  logger.info('OnTokenMinted')
  const payload = body.payload
  payload.to = payload.to.toLowerCase()

  logger.info(payload)
  const ModelMint = global.db.mint
  const t = new ModelMint(payload)
  t.status = 'IDLE'
  await t.save()
}

