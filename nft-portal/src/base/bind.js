export default function bind(target, properykey, decscriptor) {
  const method = decscriptor.value
  return {
    configurable: true,
    get() {
      const bound = method.bind(this)
      Object.defineProperty(this, properykey, {
        value: bound,
        configurable: true,
        writable: true
      })
      return bound
    }
  }
}
