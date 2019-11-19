import store from '../../../base/store'
import bind from '../../../base/bind';
import { action, observable } from 'mobx/lib/mobx';

export class HistoryDetailStore extends store {
  @observable.ref detail = {}

  @bind
  @action setHistoryDetail(detail) {
    this.detail = detail;
  };
}
