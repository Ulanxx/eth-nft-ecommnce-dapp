import Form from 'antd/lib/form'
import React from 'react'
import { observer } from 'mobx-react'

const Item = Form.Item

export default observer(({ labelCol, wrapperCol, field, children }) => {
  return  (
    <Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      label={field.label}
      validateStatus={field.error ? 'error' : null}
      help={field.error}
    >
      { children }
    </Item>
  )
})
