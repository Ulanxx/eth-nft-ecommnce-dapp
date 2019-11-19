import { observable, action, computed } from 'mobx';
import Web3 from 'web3';
import { toLower } from 'lodash';
import { getUserByPublicAddress, authenticate } from './api';
import Store from '../../base/store';
import bind from '../../base/bind';
import { Loadings } from '../../base/loadings';
import jwtStore from '../../base/jwt';

const loadings = new Loadings();

export class SigninStore extends Store {
  web3 = null;
  loadings = loadings;

  @observable coinbase = null;

  @computed get publicAddress() {
    return toLower(this.coinbase);
  }

  @action setCoinbase(coinbase) {
    this.coinbase = coinbase;
  }

  @loadings.handle('auth')
  auth() {
    if (!window.web3 && !window.ethereum) {
      return Promise.reject({ code: 10001 });
    }
    const provider = window.web3.currentProvider;
    this.web3 = new Web3();
    this.web3.setProvider(provider);
    window.ethereum.enable();
    return this.web3.eth.getCoinbase().then(coinbase => {
      if (!coinbase) {
        return Promise.reject({ code: 10002 });
      }
      this.setCoinbase(coinbase);
      return getUserByPublicAddress(this.publicAddress)
        .then(this.signMessage)
        .then(authenticate)
        .then(this.saveJWT);
    });
  }

  @bind
  saveJWT({ jwt }) {
    console.log(jwt);
    jwtStore.setValue(jwt);
  }

  @bind
  signMessage({ publicAddress, nonce }) {
    return new Promise((resolve, reject) =>
      this.web3.eth.personal.sign(
        this.web3.utils.fromUtf8(`${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) return reject({ code: -32603 });
          return resolve({ publicAddress, signature });
        }
      )
    );
  }
}
