import React from 'react'
import { observer } from "mobx-react"
import List from 'antd-mobile/lib/list'
import { Link } from 'react-router-dom'
import * as moment from 'moment'
import Tag from 'antd/lib/tag'
import { transferStatusMapColor, transferStatusMapText, transferProgressStatusMapColor, transferProgressStatusMapText } from './constants'
import DEFAULT_ICON from "../../global/assets/default-token-icon.png"
import { stringify } from "../../base/query-string";

const Item = List.Item
const Brief = Item.Brief

export default observer(({ list }) => {
    return (
      <div className="comp-enduser-overview">
        <List
          renderHeader={() => 'Transactions'}
        >
          {
            list.map(
              transaction => {
                return (
                  <Link
                    key={transaction._id}
                    to={`/history/token?${stringify({
                      ...transaction,
                      symbol: transaction.symbol.symbol,
                      name: transaction.symbol.name,
                      url: transaction.symbol.url
                    })}`}>
                    <Item
                      thumb={
                        <img
                          src={transaction.symbol.url || DEFAULT_ICON}
                          style={{ width: 30, height: 30, borderRadius: 15 }}/>
                      }
                      extra={
                        <div>
                          <Tag
                            color={transferProgressStatusMapColor[transaction.status]}
                          >
                            {transferProgressStatusMapText[transaction.status]}
                          </Tag>

                          <Tag
                            color={transferStatusMapColor[transaction.status]}
                          >
                            {transferStatusMapText[transaction.swapStatus]}
                          </Tag>
                          <Brief>
                            <small>{moment(transaction.createdAt).format('YY-MM-DD HH:mm')}</small>
                          </Brief>
                          <div>
                          </div>
                        </div>
                      }
                    >
                      {transaction.symbol.symbol}
                      <Brief>{transaction.symbol.name} (ID: {transaction.tokenId})</Brief>
                    </Item>
                  </Link>
                )
              }
            )
          }
        </List>
      </div>
    )
  }
)
