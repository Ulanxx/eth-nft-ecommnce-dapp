import React from 'react'
import { observer } from "mobx-react"
import List from 'antd-mobile/lib/list'
import DEFAULT_ICON from "../../global/assets/default-token-icon.png"
import { Link } from 'react-router-dom'
import userStore from '../../base/userStore'
import { stringify } from "../../base/query-string";
import Tag from 'antd/lib/tag'
import { statusMapColor, statusMapText } from './OverviewDetail/constants'

const Item = List.Item
const Brief = Item.Brief

export default observer(({ tokens }) => (
    <div className="comp-enduser-overview">
      <List
        renderHeader={() => <div className="comp-enduser-header">
          <div>Address</div>
          <span>{userStore.publicAddress}</span>
          <div/>
        </div>
        }
      >
        {
          tokens.map(
            token => {
              return (
                <Link
                  key={token._id}
                  to={`/overview/token?${stringify(token)}`}>
                  <Item
                    thumb={<img src={token.url || DEFAULT_ICON} style={{ width: 30, height: 30, borderRadius: 15 }}/>}
                    extra={<div><Brief>{token.category}</Brief><Tag color={statusMapColor[token.status]}>{statusMapText[token.status]}</Tag></div>}
                  >
                    {token.symbol}
                    <Brief>{token.name} (ID: {token.tokenId})</Brief>
                  </Item>
                </Link>
              )
            }
          )
        }
      </List>
    </div>
  )
)

