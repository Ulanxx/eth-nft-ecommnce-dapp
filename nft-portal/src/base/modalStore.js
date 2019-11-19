import store from './store';
import bind from './bind';
import { observable, action } from 'mobx';

export class ModalStore extends store {
  @observable active = false;
  @observable id = null;

  constructor({ afterActive, afterCancel, afterOk, beforeOk, beforeCancel }) {
    super();
    this.afterActive = afterActive;
    this.afterCancel = afterCancel;
    this.afterOk = afterOk;
    this.beforeOk = beforeOk;
    this.beforeCancel = beforeCancel;
  }

  @action setActive(active) {
    this.active = active;
  }

  @action setId(id) {
    this.id = id;
  }

  @bind
  start() {
    this.setActive(true);
  }

  @bind
  startWithId(id) {
    this.setId(id);
    return () => {
      this.setActive(true);
    };
  }

  @bind
  onCancel() {
    this.beforeCancel && this.beforeCancel();
    this.setActive(false);
    this.afterCancel && this.afterCancel();
    this.setId(null);
  }

  @bind
  onOk() {
    this.beforeOk && this.beforeOk();
    this.setActive(false);
  }
}
