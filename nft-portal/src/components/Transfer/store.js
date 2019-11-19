import { observable, action, computed } from 'mobx'
import * as moment from 'moment'
import bind from '../../base/bind'
import { listSymbols, listTransferHistory } from './api'
import Store from '../../base/store'
import { Loadings } from '../../base/loadings'

const loadings = new Loadings()

export class TransferStore extends Store {

  @observable.ref symbols = []

  @observable.ref selectedSymbol = null

  @observable.ref startDate = moment().subtract(7, 'days')

  @observable.ref endDate = moment().endOf('day')

  @observable.ref list = []

  loadings = loadings

  @computed get listForDisplay() {
    return this.list.map(
      transaction => ({
        ...transaction,
        symbol: transaction.symbol.symbol,
        tokenName: transaction.symbol.name,
        timestamp: transaction.createdAt ? moment(transaction.createdAt).format('MM-DD-YY HH:mm:SS') : '-'
      })
    )
  }

  @computed get symbolsForSelector() {
    return [
      {
        value: null,
        symbol: 'ALL'
      },
      ...this.symbols.map(
        symbol => ({symbol: symbol.symbol, value: symbol._id})
      )
    ]
  }

  @computed get query() {
    return {
      symbolId: this.selectedSymbol,
      timeStart: this.startDate.format(),
      timeEnd: this.endDate.format(),
    }
  }

  @bind
  @action setSymbols(symbols) {
    this.symbols = symbols
  }

  @bind
  @action setStartDate(startDate) {
    this.startDate = startDate
  }

  @bind
  @action setEndDate(endDate) {
    this.endDate = endDate
  }

  @bind
  @action setSelectedSymbol(selectedSymbol) {
    this.selectedSymbol = selectedSymbol
  }

  @bind
  listSymbols() {
    return listSymbols().then(
      ({symbols}) => this.setSymbols(symbols)
    )
  }


  @bind
  @action setList(list) {
    this.list = list
  }

  @bind
  @loadings.handle('list')
  listTransferHistory() {
    return listTransferHistory(this.query).then(
      ({ transactions }) => this.setList(transactions)
    )
  }
}

