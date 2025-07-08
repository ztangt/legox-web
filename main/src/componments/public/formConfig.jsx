import { Input, Select, InputNumber, DatePicker, Button, Upload, TreeSelect } from 'antd';
import {Fragment} from 'react';
import WriteSing from '../adviceControl/writeSing'
export const components = {
  Text: Input.TextArea,
  Title: Input,
  Input: Input,
  TextArea: Input.TextArea,
  Select: Select,
  InputNumber: InputNumber,
  Date: DatePicker,
  Upload: Upload,
  Button: Button,
  Fragment: Fragment,
  PersonTree: TreeSelect,
  DeptTree: TreeSelect,
  OrgTree: TreeSelect,
  OptionTextArea: WriteSing,
  MoneyInput: Input,
  DataPull: Input,
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
    { w: 3, h: 4}//默认宽高
  ],
  TextArea: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  Select: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  InputNumber: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  Date: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  Upload: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  Button: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  Fragment: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  PersonTree: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  OrgTree: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  DeptTree: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  OptionTextArea: [
    {
    },
    { w: 8, h: 4}//默认宽高
  ],
  MoneyInput: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  NormalSubForm: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  DataPull: [
    {
    },
    { w: 3, h: 4}//默认宽高
  ],
  AssociatedBiz: [
    {
    },
    { w: 4, h: 4}//默认宽高
  ]
}


