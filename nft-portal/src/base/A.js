import Tooltip from 'antd/lib/tooltip'
import React from 'react'

export default function A({ shouldForbid, children, onClick, popupContainerDOM }) {
  if (shouldForbid) {
    return (
      <Tooltip title={shouldForbid} getPopupContainer={() => popupContainerDOM}>
        <a style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>{children}</a>
      </Tooltip>
    )
  }
  return (
    <a onClick={onClick}>{children}</a>
  )
}
