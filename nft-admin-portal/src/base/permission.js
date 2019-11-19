import React, { Component }  from 'react'
import toasterStore from '../stores/toaster'

export function validate(permisions) {
  return Promise.all(
    permisions.map(
      permision => {
        console.log('[PERMISSION]', permision.name)
        return permision()
      }
    )
  )
}

export default function registerPermission(...permissions) {
  return function decorate(Component) {
    return class PermissionWrapper extends Component {
      constructor(props) {
        super(props)
        this.state = { valid: false }
      }
      componentDidMount() {
        validate(permissions).then(
          () => this.setState({ valid: true }),
          (result) => {
            if (result.reason) toasterStore.exception(result.reason)
            if (result.redirect) {
              // todo
              return
            }
            console.warn(
              `[PERMISSION] Invalid validate result:`,
              result
            )
          }
        )
      }
      render() {
        if (!this.state.valid) {
          return null
        }
        return (
          <Component {...this.props} />
        )
      }
    }
  }
}
