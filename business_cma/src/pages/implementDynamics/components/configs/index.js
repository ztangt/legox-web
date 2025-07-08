import { DatePicker } from 'antd';
import { config } from '../../../../util/config';
const { RangePicker } = DatePicker;
// 日期范围
const rangePicker = (props) => {
  return <RangePicker {...props} />;
};

const dynamics = {
  tabsItem: [
    {
      label: '执行通报',
      key: 1,
    },
    {
      label: '当年预算',
      key: 2,
    },
    {
      label: '结算资金',
      key: 3,
    },
    {
      label: '全部可用资金',
      key: 4,
    },
  ],
  tabsAllItem: [
    {
      label: '全部',
      key: 5,
    },
    {
      label: '分单位',
      key: 6,
    },
    {
      label: '分科目',
      key: 7,
    },
    {
      label: '分项目',
      key: 8,
    },
  ],
  // tabs1白名单
  tabsWhiteList: [1, 2, 3, 4],
};

export default dynamics;
