import { observable, action, computed, reaction } from 'mobx';
import store from '../../base/store';
import { listTokens, listTransferHistory } from './api';
import bind from '../../base/bind';
import userStore from '../../base/userStore';
import { tokensForDispaly } from '../Detail/transforms';
import { status, transferStatus } from './constants';
import { tabKeys } from './constants';
import { Loadings } from '../../base/loadings';

const loadings = new Loadings();

export class DetailStore extends store {
  loadings = loadings;
  clearCode = null;

  constructor() {
    super();
    reaction(
      () => this.page === tabKeys.history,
      isHistoryPage => {
        if (isHistoryPage) {
          this.clearCode = setInterval(
            () => this.listTransferHistory(),
            5 * 1000
          );
        } else {
          clearInterval(this.clearCode);
        }
      },
      { fireImmediately: true }
    );

    reaction(
      () => this.page,
      page => {
        if (page === tabKeys.overview || page === tabKeys.transfer) {
          this.listTokens();
        }
      },
      { fireImmediately: true }
    );
  }

  // 0, 1, 2
  @observable.ref page = tabKeys.overview;

  @observable.ref tokens = [];

  @observable.ref transferHistorys = [];

  @computed get tokensForDisplay() {
    return tokensForDispaly(this.tokens) || [];
  }

  @computed get transferHistorysForTransStatus() {
    return this.transferHistorys.map(transferHistory => ({
      ...transferHistory,
      swapStatus:
        userStore.publicAddress === transferHistory.from
          ? transferStatus.TRANSFEROUT
          : transferStatus.TRANSFERIN
    }));
  }

  @computed get tokensForSelector() {
    return this.tokensForDisplay
      .filter(token => token.status === status.IDLE)
      .map(token => ({
        label: `${token.symbol}(ID: ${token.tokenId})`,
        value: `${token.tokenId}--${token.contractAddress}`,
        tokenId: token.tokenId,
        contractAddress: token.contractAddress
      }));
  }

  @bind
  @action
  setTokens(tokens) {
    this.tokens = tokens;
  }

  @bind
  @action
  setPage({ key }) {
    this.page = key;
  }

  @bind
  @action
  setTransferHistorys(transferHistorys) {
    this.transferHistorys = transferHistorys;
  }

  @bind
  @loadings.handle('tokens')
  listTokens() {
    return listTokens().then(({ variants }) => this.setTokens(variants));
  }

  @bind
  handleTransferSuccess() {
    this.setPage({ key: tabKeys.history });
  }

  @bind
  @loadings.handle('transactions')
  listTransferHistory() {
    return listTransferHistory().then(({ transactions }) =>
      this.setTransferHistorys(transactions)
    );
  }
}
