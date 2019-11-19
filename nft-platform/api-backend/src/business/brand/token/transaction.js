import constants from '../../../common/constants';

const auto = require('auto-promise');
import _ from 'lodash';
import { ErrorStatusCode } from '../../../common/utils';
import moment from 'moment';
import mongoose from 'mongoose';

/**
 * Process brand token issue request:
 * @param body
 *  refers to: token issue request definition
 * @returns {Promise<model_instance>}
 */
async function logic(user_id, role, body) {
  const ModelBrandUser = global.db.user;
  const ModelBill = global.db.bill;
  const ModelMint = global.db.mint;
  const ModelTransaction = global.db.transaction;
  const ModelSymbolVariant = global.db.symbolVariant;
  const VariantIssueHistory = global.db.variantIssueHistory;

  body.to = body.to.toLowerCase();

  // TODO: calculate the cost to mint
  const cost = 0;
  const result = await auto({
    brand_user: async () => {
      const brand_user = await ModelBrandUser.findById(user_id);
      if (brand_user.userInfo.publicAddress === body.to) {
        throw new ErrorStatusCode(
          200,
          -10,
          "receiver's address is the same as the sender's"
        );
      }
      return brand_user;
    },
    tokens: async brand_user => {
      let tokens;
      if (body.amount > 0 && !body.tokenId) {
        tokens = await ModelMint.find({
          variantId: body.variantId,
          to: brand_user.userInfo.publicAddress,
          status: 'IDLE'
        });
      } else if (body.tokenId && body.contractAddress) {
        body.amount = 1;
        tokens = await ModelMint.find({
          to: brand_user.userInfo.publicAddress,
          status: 'IDLE',
          tokenId: body.tokenId,
          contractAddress: body.contractAddress
        });
      } else {
        logger.error('Should NOT go into here');
        throw Error('WTF?');
      }

      if (tokens.length >= body.amount) {
        return tokens;
      } else {
        throw new ErrorStatusCode(200, -8, 'no enough tokens to transfer');
      }
    },
    transfer: async (tokens, brand_user) => {
      const header = {
        destination: 'ether_tasks',
        ack: 'client-individual'
      };
      const now = new Date();
      // TODO: if token = null return no more token to transfer
      // TODO: what if mq broker goes wrong?
      for (let i = 0; i < body.amount; i++) {
        const token = tokens[i];
        const t = new ModelTransaction({
          from: brand_user.userInfo.publicAddress,
          to: body.to,
          tokenObjectId: token._id,
          createdAt: now,
          status: 'TRANSFERRING'
        });

        await t.save();

        token.status = 'TRANSFERRING';
        await token.save();
        await global.mq.sendAsync(
          header,
          JSON.stringify({
            command: 'TOKEN_TRANSFER',
            payload: {
              transaction_id: t._id,
              from: brand_user.userInfo.publicAddress,
              to: body.to,
              tokenId: token.tokenId,
              contractAddress: token.contractAddress
            }
          })
        );
      }
    }
  });
  return result;
}

export default logic;
