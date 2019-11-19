import { extend } from 'lodash'
import { action, observable, computed } from 'mobx'
import Store from '../store'

import { replaceMethod, isCancelled, getMessageOfException } from '../utils'
import globalExceptionStore from './exception'


function makeItem(item, type) {
  if (typeof item === 'string') {
    return {
      type,
      title: item
    }
  }
  return extend(item, { type })
}

export class Toaster extends Store {

  constructor() {
    super()
    this.exceptionStore = globalExceptionStore
  }

  @observable queue = []

  @computed get current() {
    const all = this.queue
    return all[all.length - 1]
  }

  @action add(item) {
    this.queue.push(item)
    return Promise.resolve(null)
  }

  @action remove(item) {
    const index = this.queue.indexOf(item)
    if (index >= 0) {
      this.queue.splice(index, 1)
    }
    return Promise.resolve(null)
  }

  info(item) {
    return this.add(makeItem(item, 'info'))
  }

  success(item) {
    return this.add(makeItem(item, 'success'))
  }

  warning(item) {
    return this.add(makeItem(item, 'warning'))
  }

  error(item) {
    return this.add(makeItem(item, 'error'))
  }

  wait(item) {
    return this.add(makeItem(item, 'wait'))
  }

  getLevels(levels) {
    return extend({
      resolve: 'success',
      reject: 'error'
    }, levels)
  }

  exception(exception, failureText, levels) {
    levels = this.getLevels(levels)

    if (isCancelled(exception)) {
      console.warn('[CANCELLED]')
      return
    }

    const message = getMessageOfException(failureText || exception, this.exceptionStore.apiErrorCodeMessageMap)
    console.warn('[EXCEPTION]', `${message}:`, exception)
    this[levels['reject']](message)
  }

  promise(
    promise,
    successText,
    failureText,
    levels
  ) {
    levels = this.getLevels(levels)
    promise.then(
      () => successText && this[levels['resolve']](successText),
      exception => this.exception(exception, failureText, levels)
    )
    return promise
  }

  handle(successText, failureText, levels) {
    levels = this.getLevels(levels)

    const me = this

    return replaceMethod(origin => function (...args) {
      const promise = origin.apply(this, args)
      return me.promise(promise, successText, failureText, levels)
    })
  }

  handleInfo(successText, failureText) {
    return this.handle(successText, failureText, { resolve: 'info' })
  }
}

export default new Toaster()
