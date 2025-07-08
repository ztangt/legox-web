import { Input, Select, InputNumber, DatePicker, Button, Upload, TreeSelect } from 'antd';
import {Fragment} from 'react';


export const components = {
  Text: Input.TextArea,
  Title: Input,
  TextArea: Input.TextArea,
  // Select: <BasicData/>,
  Input: Input,
  Date: DatePicker,
  Upload: Upload,
  Button: Button,
  Fragment: Fragment,
  PersonTree: Input,
  DeptTree: Input,
  OrgTree: Input,
  OptionTextArea: Input.TextArea,
  MoneyInput: Input,
  // OptionTextArea: <WriteSign/>,
  DataPull: 'div',
  // NormalSubForm: <NormalSubForm/>,
}
//drop进去的元素默认设置
export const itemprops = {
  Title: [
    {
      bordered: false,
      placeholder: "请输入标题",
      style:{fontSize: 32, textAlign: 'center', color: 'red'}
    },
    { w: 4, h: 6}//默认宽高
  ],
  Text: [
    {
      bordered: false,
      placeholder: "请输入名称",
    },
    { w: 2, h: 4}//默认宽高
  ],
  Input: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  TextArea: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  Select: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  InputNumber: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  Date: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  Upload: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  Button: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  Fragment: [
    {
    },
    { w: 4, h: 2}//默认宽高
  ],
  PersonTree: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  OrgTree: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  DeptTree: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  OptionTextArea: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  MoneyInput: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  NormalSubForm: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  DataPull: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  OptionTextArea:[
    {
    },
    { w: 4, h: 4}//默认宽高
  ],
  AssociatedBiz: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ]

}

