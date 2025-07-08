import { DatePicker, Radio, Select } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import ICommon from '../../../components/iCommon';
import { timeStampFormat } from '../../../util/util';
import styles from '../index.less';

dayjs.locale('zh-cn');
const { Option } = Select;
const { Group } = Radio;
// 数据类型
const oDivComponent = (obj, label) => {
    return (
        <div className={styles.days}>
            {label == '数据时间' ? null : <span>{label}：</span>}
            <ICommon {...obj}></ICommon>
        </div>
    );
};
// 当前年份
export const currentYear = (year) => {
    const day = year || new Date().getFullYear();
    const get_first_day = new Date(day, 0, 1);
    const first_day = timeStampFormat(get_first_day);
    const current_day = new Date().getTime();
    const now_day = timeStampFormat(current_day);
    return {
        startTime: JSON.parse(JSON.stringify(first_day)),
        endTime: JSON.parse(JSON.stringify(now_day)),
    };
};
const disabledDate = (current) => {
    // const day = new Date().getFullYear();
    // const get_first_day = new Date(day, 0, 1);
    // const getCurrentDay = new Date().getTime();
    const first_day = currentYear().startTime;
    return (current && current > dayjs().endOf('day')) || (dayjs(first_day) > current && current);
};

const selectObj = (data, onSelectChange, defaultValue) => {
    const obj = {
        Com: Select,
        list: data,
        Child: Option,
        value: 'dictInfoCode',
        label: 'dictInfoName',
        width: 200,
        props: {
            onChange: onSelectChange,
            defaultValue: defaultValue,
            placeholder: '请选择',
        },
    };
    return obj;
};
const config = {
    chartsOptions: {
        // 背景颜色
        // 提示浮窗样式
        // tooltip: {
        //   show: true,
        //   trigger: 'item',
        //   // triggerOn: 'mousemove',
        //   // trigger: 'item',
        //   // alwaysShowContent: false,
        //   // backgroundColor: '#0C121C',
        //   // borderColor: 'rgba(0, 0, 0, 0.16);',
        //   hideDelay: 100,
        //   // triggerOn: 'mousemove',
        //   enterable: true,
        //   // textStyle: {
        //   //   color: '#DADADA',
        //   //   fontSize: '8',
        //   //   width: 20,
        //   //   height: 30,
        //   //   overflow: 'break',
        //   // },
        //   showDelay: 100,
        // },
        // 地图配置
        geo: {
            map: 'china',
            label: {
                color: '#fff',
            },
        },
        series: [
            {
                type: 'map',
                map: 'china',
                // 地图区域的样式设置
                itemStyle: {
                    borderColor: 'rgba(147, 235, 248, 1)',
                    borderWidth: 1,
                    areaColor: '#0c274b',
                    // areaColor: {
                    //   type: 'radial',
                    //   x: 0.5,
                    //   y: 0.5,
                    //   r: 0.8,
                    //   colorStops: [
                    //     {
                    //       offset: 0,
                    //       color: 'rgba(147, 235, 248, 0)', // 0% 处的颜色
                    //     },
                    //     {
                    //       offset: 1,
                    //       color: 'rgba(147, 235, 248, .2)', // 100% 处的颜色
                    //     },
                    //   ],
                    //   globalCoord: false, // 缺省为 false
                    // },
                    shadowColor: 'rgba(128, 217, 248, 1)',
                    shadowOffsetX: -2,
                    shadowOffsetY: 2,
                    shadowBlur: 10,
                    color: '#fff',
                },
                // 鼠标放上去高亮的样式
                emphasis: {
                    itemStyle: {
                        areaColor: '#389BB7',
                        borderWidth: 0,
                    },
                    label: {
                        color: '#fff',
                    },
                },
            },
        ],
    },
    tagsList: [
        {
            id: 1,
            name: '数据时间',
        },
        {
            id: 2,
            name: '数据类型',
        },
        {
            id: 3,
            name: '数据类别',
        },
        {
            id: 4,
            name: '预警级别',
        },
        // {
        //   id: 5,
        //   name: '地图/热力图',
        // },
        // {
        //     id: 6,
        //     name: '公示',
        // },
        // {
        //   id: 7,
        //   name: '单位级次',
        // },
    ],
    tagsObj: {
        1: (timerChange, label) => {
            const obj = {
                Com: DatePicker,
                props: {
                    onChange: timerChange,
                    // disabledDate,
                    // defaultValue: dayjs(timeStampFormat(new Date().getTime())),
                },
                width: 260,
            };
            return oDivComponent(obj, label);
        },
        2: (onSelectChange, label, data, defaultValue) => {
            const obj = selectObj(data.type, onSelectChange, defaultValue.dataTypes || '1');
            return oDivComponent(obj, label);
        },
        3: (onSelectChange, label, data, defaultValue) => {
            const obj = selectObj(data.cate, onSelectChange, defaultValue.dataCates || '1');
            return oDivComponent(obj, label);
        },
        4: (onSelectChange, label, data, defaultValue) => {
            const obj = selectObj(data.level, onSelectChange, defaultValue.dataLevels || '1');
            return oDivComponent(obj, label);
        },
        // 6: (onSelectChange, label, data) => {
        //     const obj = {
        //         Com: Group,
        //         Child: Radio,
        //         list: data.public,
        //         value: 'dictInfoCode',
        //         label: 'dictInfoName',
        //         props: {
        //             onChange: onSelectChange,
        //             defaultValue: '1',
        //         },
        //     };
        //     return oDivComponent(obj, label);
        // },
    },
    ringCharts: (props) => {
        return {
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderWidth: 1,
                    },
                    label: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 12,
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    color: config.color,
                    data: props,
                },
            ],
        };
    },
    ringList: [
        {
            id: 1,
            name: '会计规范类',
        },
        {
            id: 2,
            name: '财务管理类',
        },
        {
            id: 3,
            name: '政府采购管理类',
        },
        {
            id: 4,
            name: '项目管理类',
        },
    ],
    color: [
        '#45C2E0',
        '#FF0066',
        '#00FF00',
        '#FF00FF',
        '#FFC851',
        '#9900FF',
        '#990000',
        '#5A5476',
        '#1869A0',
        '#FF99FF',
        '#000099',
        '#CC00CC',
    ],
    headNameList: [
        {
            id: 1,
            name: '疑点单位',
        },
        {
            id: 2,
            name: '预警级别',
        },
        {
            id: 3,
            name: '预警条数',
        },
        // {
        //     id: 4,
        //     name: '公示条数',
        // },
    ],
};

export default config;
