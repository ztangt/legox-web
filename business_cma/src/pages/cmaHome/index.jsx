import { connect } from 'dva';
import * as echarts from 'echarts';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { accMul } from '../../util/util';
import configs, { currentYear } from './configs';
import mapJson from './configs/map.json';
import HomeModal from './homModal';
import styles from './index.less';

const HomePage = ({ dispatch, cmaHomeSpace, rulesModelSpaces }) => {
    const [modalShow, setModalShow] = useState(false);
    const [tags, setTags] = useState({});
    const [animate, setAnimate] = useState(false);
    const [iterList, setInterList] = useState([]);
    const { cmaHomeDataTypeArr, cmaHomeDateCateArr, cmaHomeWarningLevelArr, cmaHomePublicArr } = rulesModelSpaces;
    const {
        orgList,
        warningList,
        rateData,
        dataStatistic,
        warningTypeData,
        startTimes,
        endTimes,
        dataTypes,
        dataCates,
        dataLevels,
        datePublics,
    } = cmaHomeSpace;
    const { location } = useModel('@@qiankunStateFromMaster');
    const [isClickIndex, setIsClickIndex] = useState(0);
    let timer = null;
    const charts_data = warningTypeData;
    // [
    //   { value: 10, name: '会计规范类' },
    //   { value: 20, name: '会计管理类' },
    //   { value: 50, name: '财务采购管理类' },
    //   { value: 40, name: '项目管理类' },
    // ];
    // 渲染地图
    const renderCharts = () => {
        const chartStance = echarts.init(document.getElementById('map'));
        echarts.registerMap('china', mapJson);
        chartStance.setOption(configs.chartsOptions);
    };
    // 渲染圆环数据
    const renderRing = () => {
        const ringStance = echarts.init(document.getElementById('main'));
        ringStance.setOption(configs.ringCharts(charts_data));
    };
    // 右侧占比
    const levelRate = [
        {
            id: 1,
            rate: rateData ? rateData.one : 0,
            label: '一级占比',
        },
        {
            id: 2,
            rate: rateData ? rateData.two : 0,
            label: '二级占比',
        },
        {
            id: 3,
            rate: rateData ? rateData.three : 0,
            label: '三级占比',
        },
    ];
    // 关闭弹窗
    const onCancel = () => {
        setModalShow(false);
    };
    // 获取配置码表
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
    useEffect(() => {
        // 处理dom未加载高度没有
        setTimeout(() => {
            renderCharts();
            if (charts_data && charts_data.length > 0) {
                renderRing();
            }
        }, 400);
    }, [warningTypeData]);
    // 获取码表信息/获取首页加载信息
    useEffect(() => {
        getBaseCode('DATATYPE');
        getBaseCode('DATACATEGORY');
        getBaseCode('WARNINGLEVEL');
        getBaseCode('PUBLICITY');
        getHomeOrgData();
    }, []);
    useEffect(() => {
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(() => {
            if (warningList.length > 0) {
                setIntervalList();
            }
        }, 1500);
        return () => {
            clearInterval(timer);
        };
    }, [warningList]);
    // 获取左侧列表数据/首页数据
    const getHomeOrgData = () => {
        dispatch({
            type: 'cmaHomeSpace/getHomePageOrgData',
            payload: {},
            callback(list) {
                if (list && list.length > 0) {
                    getHomeData(list[0].nccOrgCode);
                    dispatch({
                        type: 'cmaHomeSpace/updateStates',
                        payload: {
                            nccOrgCode: list[0].nccOrgCode,
                        },
                    });
                }
            },
        });
    };
    const getHomeData = (nccOrgCode, startTime, endTime, dataType, dataCate, warningLevel) => {
        dispatch({
            type: 'cmaHomeSpace/getHomePageData',
            payload: {
                nccOrgCode,
                startTime: startTime || currentYear().startTime,
                endTime: endTime || currentYear().endTime,
                dataType: dataType || '1',
                dataSource: dataCate || '1',
                warningLevel: warningLevel || '1',
            },
        });
    };
    // 循环列表
    const setIntervalList = () => {
        setAnimate(true);
        setTimeout(() => {
            warningList.push(warningList[0]);
            warningList.shift();
            setAnimate(false);
            setInterList(warningList);
        }, 1000);
    };
    // 计算饼图 百分比
    const total_arr =
        charts_data &&
        charts_data.length > 0 &&
        charts_data.map((item) => {
            return item.value;
        });
    const total =
        total_arr &&
        total_arr.reduce((cur, next) => {
            return cur + next;
        }, 0);
    const ring_list =
        charts_data &&
        charts_data.length > 0 &&
        charts_data.map((item, index) => {
            item.color = configs.color[index];
            item.total = total;
            return item;
        });

    // 返回平台
    const enterPlatform = () => {
        historyPush({
            pathname: '/',
        });
    };
    // 点击标签
    const tagsClick = (item) => {
        setModalShow(true);
        setTags(item);
    };
    // 登出
    const loginOut = () => {
        dispatch({
            type: 'user/loginOut',
            payload: {
                location,
            },
        });
    };

    // 点击选中左侧org组织列表
    const onClickOrgList = (nccOrgCode, index) => {
        getHomeData(nccOrgCode, startTimes, endTimes, dataTypes, dataCates, dataLevels);
        setIsClickIndex(index);
        dispatch({
            type: 'cmaHomeSpace/updateStates',
            payload: {
                nccOrgCode,
            },
        });
    };

    return (
        <div className={styles.cma_home_box} id="cma_home_box">
            <div className={styles.content_box}>
                <div className={styles.header}>
                    <div className={styles.name_position}>
                        <span className={styles.name_user}>
                            {JSON.parse(localStorage.getItem('userInfo')).userName}
                        </span>
                        <div className={styles.btn_name} onClick={loginOut}>
                            <span></span>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.content_left}>
                        {orgList &&
                            orgList.length > 0 &&
                            orgList.map((item, index) => {
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => onClickOrgList(item.nccOrgCode, index)}
                                        className={isClickIndex == index ? styles.active : styles.left_item}
                                    >
                                        {item.orgName}
                                    </div>
                                );
                            })}
                    </div>
                    <div className={styles.tags}>
                        <div className={styles.tags_content}>
                            {configs.tagsList.map((item) => (
                                <div key={item.id} onClick={() => tagsClick(item)} className={styles.tags_label}>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.map}>
                        <span>在线预警</span>
                        <div id="map" className={styles.map_box}></div>
                    </div>
                    <div className={styles.level_rate}>
                        {levelRate.map((item) => (
                            <div key={item.id} className={styles.level_item}>
                                <span>{item.label}</span>
                                <div className={styles.rate_box}>{item.rate}</div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.inter_btn} onClick={enterPlatform}>
                        进入监控业务平台
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.footer_left}>
                        <div className={styles.warning_type}>预警类别</div>
                        <div className={styles.ring_box}>
                            {warningTypeData && warningTypeData.length > 0 && (
                                <div id="main" className={styles.ring_chart}></div>
                            )}
                            <div className={styles.ring_right}>
                                {ring_list &&
                                    ring_list.length > 0 &&
                                    ring_list.map((item, index) => (
                                        <div key={index} className={styles.ring_line}>
                                            <span style={{ background: item.color }}></span>
                                            <div className={styles.ring_value}>
                                                {item.name}:{' '}
                                                {Math.round(accMul(item.value / item.total, 100)).toFixed(0)}%
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.footer_center}>
                        <div className={styles.warning_type}>预警展示</div>
                        <div className={styles.warning_list}>
                            <div className={styles.list_header}>
                                {configs.headNameList.map((item) => {
                                    return <div key={item.id}>{item.name}</div>;
                                })}
                            </div>
                            {/* className={animate?'animate':''} className={animate?styles.warning_animate:''}*/}
                            <div style={{ height: 'calc(100% - 30px)' }}>
                                <div className={`${styles.warning_cont}`}>
                                    {iterList &&
                                        iterList.length > 0 &&
                                        iterList.map((item, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className={`${styles.warning_bg_item} ${
                                                        animate ? styles.warning_animate : ''
                                                    }`}
                                                >
                                                    <div>{item.orgName}</div>
                                                    <div>{item.warningLevel}</div>
                                                    <div className={styles.warning_bg_number}>{item.warningCount}</div>
                                                    {/* <div className={styles.show_number}>{item.publicityCount}</div> */}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.footer_right}>
                        <div className={styles.warning_type}>数据统计</div>
                        <div className={styles.right_warning}>
                            <div className={styles.data_top}>
                                <div className={styles.right_item_box}>
                                    <div className={styles.reglas_number}>下发疑点数</div>
                                    <div className={styles.number_it}>
                                        <span>{dataStatistic ? dataStatistic.yearIssue : 0}</span> 条
                                    </div>
                                </div>
                                <div className={styles.right_item_box}>
                                    <div className={styles.reglas_number}>确认疑点数</div>
                                    <div className={styles.number_it}>
                                        <span>{dataStatistic ? dataStatistic.yearConfirm : 0}</span> 条
                                    </div>
                                </div>
                                <div className={styles.right_item_box}>
                                    <div className={styles.reglas_number}>确认率</div>
                                    <div className={styles.number_it}>
                                        <span>{dataStatistic ? dataStatistic.confirmPercentage : 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.data_bottom}>
                                <div className={styles.data_bottom_left}>
                                    <div className={styles.number_box}>
                                        <div className={styles.days_number}>
                                            <div className={styles.cur_days}>当天下发数</div>
                                            <div className={styles.cur_days_bg}>
                                                <div>
                                                    <span className={styles.number_}>
                                                        {dataStatistic ? dataStatistic.dayViolateCount : 0}
                                                    </span>
                                                    条
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.month_number}>
                                            <div className={styles.cur_month}>当月下发数</div>
                                            <div className={styles.cur_days_bg}>
                                                <div>
                                                    <span>{dataStatistic ? dataStatistic.monthIssue : 0}</span>条
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.rate}>
                                        同比增长/降低
                                        {dataStatistic ? dataStatistic.issuePercentageGrowth : 0}
                                    </div>
                                </div>
                                <div className={styles.data_bottom_right}>
                                    <div className={styles.number_box}>
                                        <div className={styles.days_number}>
                                            <div className={styles.cur_days}>当天确认数</div>
                                            <div className={styles.cur_days_bg}>
                                                <div>
                                                    <span className={styles.number_}>
                                                        {dataStatistic ? dataStatistic.dayProcessCount : 0}
                                                    </span>
                                                    条
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.month_number}>
                                            <div className={styles.cur_month}>当月确认数</div>
                                            <div className={styles.cur_days_bg}>
                                                <div>
                                                    <span className={styles.number_}>
                                                        {dataStatistic ? dataStatistic.monthProcessCount : 0}
                                                    </span>
                                                    条
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.rate}>
                                        同比增长/降低
                                        {dataStatistic ? dataStatistic.confirmPercentageGrowth : 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modalShow && (
                <HomeModal
                    tagsItem={tags}
                    onCancel={onCancel}
                    cmaHomeDataTypeArr={cmaHomeDataTypeArr}
                    cmaHomeDateCateArr={cmaHomeDateCateArr}
                    cmaHomeWarningLevelArr={cmaHomeWarningLevelArr}
                    cmaHomePublicArr={cmaHomePublicArr}
                    getHomeData={getHomeData}
                ></HomeModal>
            )}
        </div>
    );
};

export default connect(({ cmaHomeSpace, rulesModelSpaces, user }) => ({
    cmaHomeSpace,
    rulesModelSpaces,
    user,
}))(HomePage);
