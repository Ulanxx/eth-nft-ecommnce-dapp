export default async function OnTokenTransferred(body) {
  logger.info('OnTokenTransferred');
  const payload = body.payload;
  const ModelMint = global.db.mint;
  const ModelTransaction = global.db.transaction;

  logger.info(body);

  const transaction = await ModelTransaction.findById(payload.tranacstion_id);
  if (body.code !== 0) {
    logger.warn(
      `token transfer error, token_id: ${payload.tokenId}, contractAddress: ${payload.contractAddress}`
    );
    transaction.status = 'FAILURE';
    await transaction.save();
    const token = await ModelMint.findById(transaction.tokenObjectId);
    if (token) {
      token.status = 'IDLE';
      await token.save();
      logger.info(`transaction id: ${payload.tranacstion_id} failed.`);
    } else {
      logger.error(
        `No such token_id: ${payload.tokenId}, contractAddress: ${payload.contractAddress}`
      );
    }
  } else {
    logger.info('---------', transaction.status);
    transaction.blockNumber = `${payload.blockNumber}`;
    transaction.blockHash = payload.blockHash;
    transaction.txHash = payload.txHash;
    transaction.status = 'SUCCESS';
    await transaction.save();
    logger.info('---------', transaction.status);
    const token = await ModelMint.findById(transaction.tokenObjectId);
    if (token) {
      token.to = payload.newOwner;
      token.status = 'IDLE';
      await token.save();
      logger.info(`transaction id: ${payload.tranacstion_id} succeeded.`);
    } else {
      logger.error(
        `No such token_id: ${payload.tokenId}, contractAddress: ${payload.contractAddress}`
      );
    }
  }
}
