import { get, map, sum } from 'lodash'
import * as moment from 'moment'

export function listToBatchs(list) {
  const batchs = get(list, 'batchList')
  return batchs && batchs.map(
    (batch, index) => ({
      ...batchForDisplay(batch.batch[0], batch._id),
      amountSupply: sum(map(batch.batch, 'amount')),
      amountTransferred: sum(map(batch.batch, 'amountTransferred')),
      amountTransferring: sum(map(batch.batch, 'amountTransferring')),
      amountMinting: sum(map(batch.batch, 'amountMinting')),
      available: sum(map(batch.batch, 'amountIdle')),
      variants: batch.batch
    })
  )
}

function batchForDisplay(batch, id) {

  return {
    id,
    ...batch,
    mintedDate: batch.createdAt,
    mintedDateValue: moment(batch.createdAt).valueOf()
  }
}

export function shouldForbid(batch) {
  if (batch.available === 0) {
    return 'token not available'
  }
  return null
}
