import store from '../../../base/store'
import bind from "../../../base/bind";
import { action, observable, computed } from "mobx/lib/mobx"
import { uploadToken } from "./api";

export class UploadStore extends store {

  urlFormForm = null

  @observable token = null  // token
  @observable action = null  // upload url
  @observable upload_prefix = null  // concat image uri
  @observable modalVisible = false

  @computed get url() {
    return this.urlFormForm.value
  }

  @bind
  @action setUploadUrl(url) {
    this.urlFormForm.set(url)
    this.urlFormForm.validate()
  }

  @bind
  @action setUploadToken(token) {
    this.token = token;
  };

  @bind
  @action setUploadPrefix(prefix) {
    this.upload_prefix = prefix;
  };

  @bind
  @action setUploadAction(action) {
    this.action = action;
  };

  @bind
  @action setModalVisible(visible) {
    this.modalVisible = visible;
  }

  @bind
  async uploadToken() {
    const { upload_url, prefix_url, token } = await uploadToken();
    this.setUploadAction(upload_url);
    this.setUploadPrefix(prefix_url);
    this.setUploadToken(token);
  }

  constructor(urlFormForm) {
    super()
    this.urlFormForm = urlFormForm
  }
}
