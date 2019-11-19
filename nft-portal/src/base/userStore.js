import store from './store'
import bind from './bind'
import fetch from './fetch'
import { prefix } from './constants'
import { observable, action, computed } from 'mobx'
import jwt from './jwt';

export class UserStore extends store {

  @observable role = null

  @observable companyName = null

  @observable publicAddress = null

  @computed get isBrand() {
    return this.role === 'BRAND'
  }

  @computed get isEnduser() {
    return this.role === 'ENDUSER'
  }

  @bind
  @action setRole(role) {
    this.role = role
  }

  @bind
  @action setCompanyName(companyName) {
    this.companyName = companyName
  }

  @bind
  @action setPublicAddress(publicAddress) {
    this.publicAddress = publicAddress
  }

  @bind
  signout() {
    this.setRole(null)
    jwt.clear()
    window.location.reload()
  }

  getProfile() {
    if (this.isBrand) {
      return fetch(`${prefix}/brand/account/profile_get`).then(
        profile => {
          this.setCompanyName(profile.userInfo.companyName)
          this.setPublicAddress(profile.userInfo.publicAddress)
        }
      )
    }
    if (this.isEnduser) {
      return fetch(`${prefix}/user/account/profile_get`).then(
        profile => {
          this.setPublicAddress(profile.userInfo.publicAddress)
        }
      )
    }
  }

  @bind
  fetch() {
    if (this.role) {
      return Promise.resolve(this.role)
    }
    return fetch(`${prefix}/role`).then(
      ({role}) => {
        this.setRole(role)

        if (this.isBrand || this.isEnduser) {
          this.getProfile()
        }

        return role
      }
    )
  }
}

export default new UserStore()
