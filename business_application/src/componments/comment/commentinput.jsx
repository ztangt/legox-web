
import React, { PureComponent } from 'react'
import { Input } from 'antd'
import {Button} from '@/componments/TLAntd';
import dayjs from 'dayjs'

export default class Commentinput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: ""
    }
  }
  render() {
    return (
      <div>
        <Input.TextArea rows={5}
          value={this.state.content}
          onChange={e => this.handlechange(e)} />
        <Button type="primary" style={{ marginTop: "10px" }} onClick={e => this.addcomment()}>添加评论</Button>
      </div>
    )
  }
  handlechange(event) {
    this.setState({
      content: event.target.value
    })
  }
  addcomment() {
    const commentInfo = {
      id: dayjs().valueOf(),
      avatar: "https://tvax3.sinaimg.cn/crop.0.0.512.512.1024/83157fd3ly8fw432kq7u8j20e80e8js3.jpg?KID=imgbed,tva&Expires=1599044684&ssig=99V28dDv6g",
      nickname: "kk",
      datetime: dayjs(),
      content: this.state.content
    }
    this.props.submit(commentInfo);
    this.setState({
      content: ""
    })
  }
}
