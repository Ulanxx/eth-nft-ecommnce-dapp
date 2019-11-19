import { observable, action, computed } from 'mobx'
import Store from './store'
import { replaceMethod } from './utils'

export class Loadings extends Store {

  @observable state = observable.map({})
  @computed get names() {
    return this.state.keys()
  }

  constructor(...names) {
    super()

    names.forEach(
      name => this.add(name)
    )
  }

  @action add(name) {
    if (!this.state.has(name)) {
      this.state.set(name, false)
    }
  }

  @action start(name) {
    this.state.set(name, true)
  }

  @action stop(name) {
    this.state.set(name, false)
  }

  isLoading(name) {
    return this.state.get(name)
  }

  isFinished(name) {
    return !this.isLoading(name)
  }

  isAllFinished() {
    return this.names.reduce(
      (finished, name) => finished && this.isFinished(name),
      true
    )
  }

  promise(name, promise) {
    this.start(name)
    const stopLoading = () => this.stop(name)
    promise.then(stopLoading, stopLoading)
    return promise
  }

  handle(name) {
    const loadings = this
    return replaceMethod((origin) => function (...args) {
      const promise = origin.apply(this, args)
      return loadings.promise(name, promise)
    })
  }
}

export default new Loadings()
