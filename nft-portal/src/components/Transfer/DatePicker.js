import DatePicker from 'antd/lib/date-picker'
import { observer } from 'mobx-react'
import React from 'react'

export const StartDate = observer(({ value, onChange, endDate }) => (
  <DatePicker
    disabledDate={(currentDate) => currentDate.isAfter(endDate)}
    showTime
    format="YYYY-MM-DD HH:mm:ss"
    placeholder="Start"
    value={value}
    onChange={onChange}
  />
))

export const EndDate = observer(({ value, onChange, startDate }) => (
  <DatePicker
    disabledDate={(currentDate) => currentDate.isBefore(startDate)}
    showTime
    value={value}
    format="YYYY-MM-DD HH:mm:ss"
    placeholder="End"
    onChange={onChange}
  />
))
