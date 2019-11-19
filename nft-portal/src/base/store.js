export default class Store {

  constructor() {
    this.disposers = []
    setTimeout(() => {
      this.dispose()
    })
  }

  addDisposer(disposer) {
    this.disposers.concat(disposer)
  }

  dispose() {
    this.disposers.forEach(function (disposer) {
      try {
          disposer()
      }
      catch (e) { }
    })
  }
}

