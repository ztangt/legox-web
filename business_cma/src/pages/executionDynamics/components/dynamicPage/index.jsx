import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { connect } from 'dva';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ReSizeLeftRight from '../../../../components/resizeLeftRight';
import { timeStampFormat } from '../../../../util/util';
import configs from '../configs';
import Header from '../header';
import Report from '../report';
import styles from './index.less';
import LeftTreeComponent from './leftTree';
dayjs.locale('zh-cn');

const ExecutionDynamics = ({ dispatch, executionDynamics, rulesModelSpaces }) => {
    const { location } = useModel('@@qiankunStateFromMaster');
    const { treeData, expandedKeys, currentNode, baseCode, baseName, getOrgCode } = executionDynamics;
    const { capitalStockData } = rulesModelSpaces;
    const [curHeight, setCurHeight] = useState(0); // 基础高度
    const [pickerTime, setPickerTime] = useState(''); // 事件点击修改url链接
    const [pickerValue, setPickerValue] = useState(null);
    const [capitalSelect, setCapitalSelect] = useState('');
    const [nodeId, setNodeId] = useState(''); // 树选中 nodeId
    const [orgName, setOrgName] = useState(''); // 树选中单位名称
    const [orgCode, setOrgCode] = useState(''); // orgCode
    const url_params = GETURLPARAMS(window.localStorage.getItem('currentHash'));
    const params = url_params.pageId ? url_params.pageId : location.query.pageId;
    let url = configs[params] ? configs[params].link : '';
    let superReportArr = [];
    if (params == 'supervisionReport') {
        const nowTime = (pickerTime && pickerTime.split('-')[0]) || new Date().getFullYear();
        superReportArr = configs[params].tabsSubject.map((item) => {
            item.label = `${nowTime}${item.labels}`;
            return item;
        });
    }

    useEffect(() => {
        const height = window.outerHeight;
        setCurHeight(height);
        window.addEventListener('resize', onResize.bind(this));
        return () => {
            window.removeEventListener('resize', onResize.bind(this));
        };
    }, []);
    const onResize = () => {
        const resizeHeight = document.documentElement.clientHeight;
        const height = resizeHeight > 460 ? resizeHeight : 460;
        setCurHeight(height);
    };
    // 获取基础数据码表 科目关系 配置
    useEffect(() => {
        getBaseCode('ACCOUNT_SYSTEM');
        return () => false;
    }, []);
    // 时间日期选择
    const onPickerChange = (value, dateString) => {
        setPickerTime(dateString);
    };

    //------- 执行通报----
    const [tabsKey, setTabsKey] = useState(0);
    const [levelTwoTabKey, setLevelTwoTabKey] = useState(0);
    // 修改tabs
    const onChangeTabs = (value) => {
        setTabsKey(value);
        if (params == 'supervisionReport') {
            setLevelTwoTabKey(0);
        }
    };
    // 2级菜单切换
    const changTabLevelTwo = (value) => {
        setLevelTwoTabKey(value);
    };

    // tabs
    const baseTabs = {
        type: 'card',
        onChange: onChangeTabs,
    };
    // 一级
    const propsTabs = {
        ...baseTabs,
        items: configs[params].tabsItem,
        defaultActiveKey: tabsKey,
    };
    // 2级
    const propsTabsAll = {
        type: 'card',
        onChange: changTabLevelTwo,
        items: configs[params].tabsAllItem,
        defaultActiveKey: levelTwoTabKey,
    };
    // datePicker
    const datePicker = {
        format: 'YYYY-MM-DD',
        onChange: onPickerChange,
        defaultValue: moment(timeStampFormat(new Date().getTime()), 'YYYY-MM-DD'),
    };
    // 执行动态配置
    const configProps = {
        tabs: propsTabs,
        datePicker,
        pickerTime,
    };
    // ----督办快报
    const reportConfig = {
        tabs: propsTabs,
        tabsAll: tabsKey == 0 ? propsTabsAll : Object.assign(propsTabsAll, { items: superReportArr }),
        params,
        pickerTime,
        tabsKey,
        levelTwoTabKey,
    };

    // 选中相应
    const onSelectChange = (value) => {
        setCapitalSelect(value);
    };

    // 年份禁用
    const disabledDate = (current) => {
        switch (params) {
            // case 'institution':
            //     return current && current > dayjs().endOf('year');
            case 'budget':
                return current && current > dayjs().endOf('year');
            case 'keyExpense':
                if (!pickerValue) {
                    return false;
                }
                // 超过一年不可选择
                const tooLate = pickerValue[0] && current && current.diff(pickerValue[0], 'days') > 365;
                const tooEarly = pickerValue[1] && pickerValue[1].diff(current, 'days') > 365;
                return !!tooEarly || !!tooLate;
            default:
                return null;
        }
    };
    // 待选日期发生变化 仅在重点费用
    const onCalendarChange = (value) => {
        setPickerValue(value);
    };
    // 弹出日历和关闭日历 仅在重点费用中
    const onOpenChange = (open) => {
        if (open) {
            setPickerValue([null, null]);
        } else {
            setPickerValue(null);
        }
    };

    /***
     * 之下是配置相关
     * **/
    // 单个年时间日期配置
    const leftDatePicker = {
        onChange: onPickerChange,
        picker: 'year',
        disabledDate: disabledDate,
        defaultValue: moment(String(new Date().getFullYear()), 'YYYY'),
    };

    //单个日期年月日
    const leftDateYearMonthDay = {
        onChange: onPickerChange,
        defaultValue: moment(timeStampFormat(new Date().getTime()), 'YYYY-MM-DD'),
    };

    // 收入范围日期配置
    const momentLocal = {
        format: 'YYYY-MM-DD',
        onChange: onPickerChange,
        disabledDate: disabledDate,
        onCalendarChange,
        onOpenChange,
        defaultValue: [
            moment(timeStampFormat(new Date().getTime()), 'YYYY-MM-DD'),
            moment(timeStampFormat(new Date().getTime()), 'YYYY-MM-DD'),
        ],
    };

    // switch 分配
    const switchChange = (params) => {
        switch (params) {
            // 机构情况
            // case 'institution':
            //     return configs[params].com(leftDatePicker);
            case 'budget':
                return configs[params].com(leftDatePicker);
            case 'income':
                return configs[params].com(momentLocal);
            case 'outcome':
                return configs[params].com(momentLocal);
            case 'capitalStock':
                return configs[params].com(leftDateYearMonthDay);
            case 'keyExpense':
                return configs[params].com(momentLocal);
            case 'implementation':
                return configs[params].com(leftDateYearMonthDay);
            case 'supervisionReport':
                return configs[params].com(
                    Object.assign(leftDatePicker, {
                        picker: 'date',
                        defaultValue: moment(timeStampFormat(new Date().getTime()), 'YYYY-MM-DD'),
                    }),
                );
            default:
                return null;
        }
    };
    // 获取基础码表配置
    const getBaseCode = (dictTypeId) => {
        dispatch({
            type: 'rulesModelSpaces/getBaseDataCode',
            payload: {
                dictTypeId,
                showType: 'ENABLE',
                isTree: '0',
                searchWord: '',
            },
        });
    };
    // pickerTimer 处理时间范围
    const getPickerTimer = (pickerTime) => {
        const currentTime = new Date().getTime();
        const startTime = pickerTime[0] || timeStampFormat(currentTime);
        const endTime = pickerTime[1] || timeStampFormat(currentTime);
        return {
            startTime,
            endTime,
        };
    };
    console.log('nodeId', nodeId, 'baseCode', baseCode, 'pickerTime', pickerTime);
    // console.log('tabsKey', tabsKey, 'levelTwoTabKey', levelTwoTabKey, 'pickerTime', pickerTime);
    // 配置url
    const configUrl = (params) => {
        switch (params) {
            case 'institution':
                return `${url}?objCode=${nodeId || baseCode}&token=Bearer ${localStorage.userToken}`;
            case 'budget':
                return `${url}?orgCode=${orgCode || getOrgCode}&objCode=${nodeId || baseCode}&objName=${
                    orgName || baseName
                }&queryYear=${pickerTime || String(new Date().getFullYear())}&token=Bearer ${localStorage.userToken}`;
            case 'income':
                return `${url}?orgCode=${nodeId || baseCode}&orgName=${orgName || baseName}&startTime=${
                    getPickerTimer(pickerTime).startTime
                }&endTime=${getPickerTimer(pickerTime).endTime}&token=Bearer ${localStorage.userToken}`;
            case 'outcome':
                return `${url}?orgCode=${nodeId || baseCode}&orgName=${orgName || baseName}&startTime=${
                    getPickerTimer(pickerTime).startTime
                }&endTime=${getPickerTimer(pickerTime).endTime}&token=Bearer ${localStorage.userToken}`;
            case 'capitalStock':
                return `${url}?orgCode=${orgCode || getOrgCode}&objCode=${nodeId || baseCode}&objName=${
                    orgName || baseName
                }&queryDate=${pickerTime || timeStampFormat(new Date().getTime())}&token=Bearer ${
                    localStorage.userToken
                }`;
            case 'keyExpense':
                return `${url}?orgCode=${nodeId || baseCode}&orgName=${orgName || baseName}&startTime=${
                    getPickerTimer(pickerTime).startTime
                }&endTime=${getPickerTimer(pickerTime).endTime}&token=Bearer ${localStorage.userToken}`;
            case 'implementation':
                return `${url}?nccOrgCode=${nodeId || baseCode}&execDate=${
                    pickerTime || timeStampFormat(new Date().getTime())
                }&token=Bearer ${localStorage.userToken}`;
            case 'executiveNotification':
                const obj = {
                    0: '859362721816072192',
                    1: '887138288212856832',
                    2: '887139828331663360',
                };
                return `${url}${obj[tabsKey]}?execDate=${
                    pickerTime || timeStampFormat(new Date().getTime())
                }&token=Bearer ${localStorage.userToken}`;

            case 'supervisionReport':
                const superObj = {
                    0: () => {
                        const nowTab = {
                            0: '848798148079865856',
                            1: '848803230863282176',
                            2: '848804201777549312',
                        };
                        return nowTab[levelTwoTabKey];
                    },
                    1: () => {
                        const nowTab = {
                            0: '848805593607000064',
                            1: '848806575623589888',
                        };
                        return nowTab[levelTwoTabKey];
                    },
                };
                return `${url}${superObj[tabsKey]()}?orgCode=${nodeId || baseCode}&supervisionTime=${
                    pickerTime || timeStampFormat(new Date().getTime())
                }&token=Bearer ${localStorage.userToken}`;
            default:
                return url;
        }
    };
    url = configUrl(params);
    // console.log('url0000', url);
    // 左侧树相关
    const loadTreeData = (treeSearch = '') => {
        const date = new Date(); // 默认当前年份树 不和筛选挂钩
        dispatch({
            type: 'executionDynamics/getLeftNccTreeData',
            payload: {
                listModelId: '1633418434601619457',
                start: 1,
                limit: 100,
                year: JSON.stringify({
                    columnCode: 'USED_YEAR',
                    value: date.getFullYear(),
                }),
                searchWord: treeSearch,
                listModel: '',
            },
        });
    };
    // 获取树子集
    const loadTreeChildren = (node, expandedKeys) => {
        dispatch({
            type: 'executionDynamics/getLeftNccTreeChildren',
            payload: {
                listModelId: '1633418434601619457',
                nodeId: node.nodeId,
                listModel: '',
            },
        });
    };
    // updateStates
    const getInit = (payload) => {
        // 获取选中的参数
        if (payload.currentNode) {
            const { currentNode } = payload;
            // console.log('currentNode', currentNode);
            const obj = JSON.parse(currentNode.json);
            console.log('objCode0000', obj);
            // objCode
            setNodeId(obj.OBJ_CODE);
            setOrgCode(obj.ORG_CODE);
            setOrgName(obj.OBJ_NAME);
        }
        dispatch({
            type: 'executionDynamics/updateStates',
            payload: {
                ...payload,
            },
        });
    };
    console.log('executiveNotification', params);
    return (
        <div className={styles.container} id="dom_container_cma">
            <ReSizeLeftRight
                vNum={300}
                leftChildren={
                    <div className={styles.leftContent}>
                        {/* 通过config配置左侧显示哪些 */}
                        {switchChange(params)}
                        {/* 资金存量选择框单独处理 */}
                        {/* <div className={styles.header_timer}>
                          <div className="_margin_right_8">
                            {params == 'capitalStock' && configs[params].sel(selectConfig)}
                          </div>
                        </div> */}
                        <LeftTreeComponent
                            getLoadTreeData={loadTreeData}
                            getTreeChildren={loadTreeChildren}
                            getInit={getInit}
                        />
                    </div>
                }
                rightChildren={
                    // 原始数据-支付数据管理
                    <div
                        style={{
                            width: '100%',
                            position: 'relative',
                            height: curHeight,
                            paddingBottom: 10,
                        }}
                    >
                        {/* 执行通报单独处理 */}
                        {params == 'executiveNotification' && (
                            <div>
                                <Header {...configProps}></Header>
                            </div>
                        )}
                        {params == 'supervisionReport' && (
                            <div>
                                <Report {...reportConfig}></Report>
                            </div>
                        )}

                        <iframe
                            id="frame"
                            src={url}
                            title="iframe"
                            width="100%"
                            height="100%"
                            scrolling="auto"
                            frameBorder={0}
                        ></iframe>
                    </div>
                }
            ></ReSizeLeftRight>
        </div>
    );
};

export default connect(({ executionDynamics, rulesModelSpaces }) => ({
    executionDynamics,
    rulesModelSpaces,
}))(ExecutionDynamics);
