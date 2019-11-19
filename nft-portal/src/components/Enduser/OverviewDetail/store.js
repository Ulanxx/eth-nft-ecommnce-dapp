import store from '../../../base/store'
import bind from "../../../base/bind";
import { action, observable } from "mobx/lib/mobx";

export class OverviewDetailStore extends store {
  @observable.ref detail = {}

  @bind
  @action setTokenDetail(detail) {
    this.detail = detail;
  };
}
