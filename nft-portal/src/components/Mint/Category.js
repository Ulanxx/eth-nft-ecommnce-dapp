import React,{ Component } from 'react'
import Select from 'antd/lib/select'
import { observer } from 'mobx-react'
import { observable, action, computed,reaction } from 'mobx'
import { category } from './constants'
import bind from '../../base/bind'

const Option = Select.Option

@observer
export default class Category extends Component{

  @observable level1 = category[0].name

  @computed get level2(){
    return this.props.value
  }

  @bind
  @action setLevel1(level1){
    this.level1 = level1
  }

  @bind
  @action setLevel2(level2){
    this.level2 = level2
  }

  @computed get level2s(){
    return this.level1
      ? category.find(item => item.name === this.level1).children
      : []
  }

  componentDidMount(){

    reaction(
      () => this.level2s,
      level2s => level2s.length && this.props.onChange(this.level2s[0].name),
      { fireImmediately:true }
    )
  }

  render(){
    return <div>
      <Select value={this.level1} onChange={this.setLevel1}>
        {
          category.map(
            item => <Option key={item.name} value={item.name}>{item.name}</Option>
          )
        }
      </Select>
      <Select value={this.level2} onChange={this.props.onChange} style={{ marginLeft:6 }}>
        {
          this.level2s.map(
            item => <Option key={item.name} value={item.name}>{item.name}</Option>
          )
        }
      </Select>
    </div>
  }
}
