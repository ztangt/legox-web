import { DatePicker, Select } from 'antd';
import { config } from '../../../../util/config';
const { Option } = Select;
const { RangePicker } = DatePicker;
// 基础日期
const datePickerFn = (props) => {
    return <DatePicker {...props} />;
};
// 日期范围
const rangePicker = (props) => {
    return <RangePicker {...props} />;
};
// 选中 可定义select
const selectItem = (config) => {
    return (
        config.list &&
        config.list.length > 0 && (
            <Select {...config.props} style={{ width: config.width || 160 }}>
                {config.list.map((item) => (
                    <Option key={item.id} value={item.dictInfoCode}>
                        {item.dictInfoName}
                    </Option>
                ))}
            </Select>
        )
    );
};
// 类型相似都在左侧 走配置化，如果在右侧类型不相同，想使用配置，例如sel配置
const dynamics = {
    //机构情况 链接配置+组件返回
    institution: {
        com: (props) => {
            return datePickerFn(props);
        },
        link: config.link + '846911323446923264',
    },
    // 预算情况
    budget: {
        com: (props) => {
            return datePickerFn(props);
        },
        link: config.link + '846966439428444160',
    },
    // 收入情况
    income: {
        com: (props) => {
            return rangePicker(props);
        },
        link: config.link + '846991607165046784',
    },
    // 支出情况
    outcome: {
        com: (props) => {
            return rangePicker(props);
        },
        link: config.link + '847259458849427456',
    },
    // 资金存量
    capitalStock: {
        com: (props) => {
            return (
                <>
                    {datePickerFn(props)}
                    {/* <div className="_padding_top_8">{selectItem(props)}</div> */}
                </>
            );
        },
        link: config.link + '847274234853937152',
        // sel: (props) => {
        //   return selectItem(props);
        // },
    },
    // 重点费用
    keyExpense: {
        com: (props) => {
            return rangePicker(props);
        },
        link: config.link + '847284789916422144',
    },
    // 执行情况
    implementation: {
        com: (props) => {
            return datePickerFn(props);
        },
        // todo
        link: config.link + '886832731522289664',
    },
    // 执行通报
    executiveNotification: {
        tabsItem: [
            {
                label: '当年预算',
                key: 0,
            },
            {
                label: '结算资金',
                key: 1,
            },
            {
                label: '全部可用资金',
                key: 2,
            },
        ],
        com: (props) => {
            return datePickerFn(props);
        },
        // 暂不设置 链接key，页面中根据tab选择处理
        link: config.link,
    },
    // 督办快报
    supervisionReport: {
        tabsItem: [
            {
                label: '单位',
                key: 0,
            },
            {
                label: '科室',
                key: 1,
            },
        ],
        // 单位
        tabsAllItem: [
            {
                label: '分单位数据汇总',
                key: 0,
            },
            {
                label: '基本支出执行情况汇总',
                key: 1,
            },
            {
                label: '分项目支出执行情况',
                key: 2,
            },
        ],
        // 科室
        tabsSubject: [
            {
                labels: '年核算处室基本支出预算执行进度情况表',
                key: 0,
            },
            {
                labels: '年核算处室项目支出预算执行进度情况表',
                key: 1,
            },
        ],
        com: (props) => {
            return datePickerFn(props);
        },
        link: config.link,
    },

    // 左侧白名单配置显示 todo暂时不使用
    positionLeft: (isPositionLeft) => {
        return ['institution', 'budget'].includes(isPositionLeft);
    },
};

export default dynamics;
