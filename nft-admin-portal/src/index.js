import React from 'react'
import ReactDOM from 'react-dom'
import './global/polyfill'
import App from './components/App/App'
import boot from './global/boot'
import { BrowserRouter } from 'react-router-dom'
import 'antd/dist/antd.less'
import './global/style.less'

boot()

ReactDOM.render(
   <div style={{height: '100%'}}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </div>,
  document.getElementById('root')
)
