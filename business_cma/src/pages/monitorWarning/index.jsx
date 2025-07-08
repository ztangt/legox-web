import { connect } from 'dva';
import { useEffect, useState } from 'react';
import BarChart from './components/bar';
import PieChart from './components/pie';
import styles from './index.less';

const Index = ({ dispatch, monitorWarning }) => {
    const [barDataOne, setBarDataOne] = useState({});
    const [barDataTwo, setBarDataTwo] = useState({});
    const [pieData, setPieData] = useState([]);
    const barTitle1 = '全部可用-分单位情况-中国气象局直管单位预算执行情况';
    const barTitle2 = '全部可用-分单位情况-各(区、市)局预算执行情况';
    const [count, setCount] = useState(0);

    const { baseInfo } = monitorWarning;

    const delBarData = (bar_json = []) => {
        let tmp = [];
        tmp = bar_json;
        let average = 0;

        let ydatas = bar_json.ydatas || [];
        if (ydatas.length) {
            let info = ydatas.find((item) => item.yname.includes('平均率'));
            if (info && info.ydata && info.ydata.length) {
                average = info.ydata[0];
            }
        }

        tmp.ydatas?.forEach((item, index) => {
            if (item.yname.includes('序时率')) {
                item.type = 'line';
                item.symbolSize = 0;
                item.endLabel = {
                    show: true,
                    formatter: function (params) {
                        return params.value;
                    },
                };
                item.lineStyle = {
                    color: '#27a844',
                    width: 1,
                    type: 'dashed',
                };
            } else if (item.yname.includes('平均率')) {
                item.type = 'line';
                item.symbolSize = 0;
                item.endLabel = {
                    show: true,
                    formatter: function (params) {
                        return params.value;
                    },
                };
                item.lineStyle = {
                    color: '#db3645',
                    width: 1,
                    type: 'dashed',
                };
            } else {
                let tmp = item.ydata;
                for (let i = 0; i < tmp.length; i++) {
                    //自定义单个柱子的颜色  小于平均值红色  MDZZ 难死我了
                    if (tmp[i] < average) {
                        tmp[i] = {
                            value: tmp[i],
                            itemStyle: {
                                color: '#db3645',
                            },
                        };
                    }
                }
                item.type = 'bar';
            }

            item.barWidth = '20px';
            item.name = item.yname;
            item.data = item.ydata;
            item.itemStyle = {
                borderRadius: 6,
            };
        });
        return tmp;
    };

    const getData = () => {
        //获取基础数据
        dispatch({
            type: 'monitorWarning/getBaseInfo',
        });

        //获取饼图数据
        dispatch({
            type: 'monitorWarning/getPie',
            callback: (pie_json) => {
                setPieData(pie_json);
            },
        });
        //获取第一个柱状图数据
        dispatch({
            type: 'monitorWarning/getBar',
            payload: { queryDimension: 2 },
            callback: (bar_json) => {
                let tmp = delBarData(bar_json);
                setBarDataOne(tmp);
            },
        });
        //获取第二个柱状图数据
        dispatch({
            type: 'monitorWarning/getBar',
            payload: { queryDimension: 1 },
            callback: (bar_json) => {
                let tmp = delBarData(bar_json);
                setBarDataTwo(tmp);
            },
        });
    };

    useEffect(() => {
        getData();
        //每一个小时刷新数据
        const intervalId = setInterval(() => {
            getData();
        }, 3600000); // 30000毫秒等于30秒
        // }, 5000); // 30000毫秒等于30秒
        return () => {
            clearInterval(intervalId); // 清除定时器以防止内存泄漏
        };
    }, []); // 空依赖数组表示只在组件挂载时运行一次

    return (
        <div className={styles.container}>
            <div className={styles.bigTopTitle}>联网监控预警</div>
            <div className={styles.top}>
                <div className={styles.left}>
                    <div className={styles.wrap}>
                        <h3>数据统计</h3>
                        <div className={styles.data}>
                            <div className={styles.d_left}>
                                <p>下发疑点数</p>
                                <span>{baseInfo.mistakeNum}条</span>
                            </div>
                            <div className={styles.d_middle}>
                                <p>确认疑点数</p>
                                <span>{baseInfo.disposeMistakeNum}条</span>
                            </div>
                            <div className={styles.d_right}>
                                <p>确认率</p>
                                <span>{baseInfo.processingRate}%</span>
                            </div>
                        </div>
                        <div className={styles.number}>
                            <div className={styles.n_left}>
                                <div className={styles.title_num}>
                                    <span>当月下发数</span>
                                    <div className={styles.day_num}>{baseInfo.lastMonthMistakeNum}条</div>
                                </div>
                                {/*<div className={styles.title_num}>*/}
                                {/*    <span>当月违规数</span>*/}
                                {/*    <div className={styles.month_num}>0条</div>*/}
                                {/*</div>*/}
                            </div>
                            <div className={styles.n_right}>
                                <div className={styles.title_num}>
                                    <span>当月确认数</span>
                                    <div className={styles.day_num}>{baseInfo.lastMonthDisposeMistakeNum}条</div>
                                </div>
                                {/*<div className={styles.title_num}>*/}
                                {/*    <span>当月处理数</span>*/}
                                {/*    <div className={styles.month_num}>0条</div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className={styles.status}>
                            <span>同比增长{baseInfo.yoYMistakeRate}%</span>
                            <span>同比增长{baseInfo.yoYDisposeRate}%</span>
                        </div>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.wrap}>
                        <h3>预警类别</h3>
                        <PieChart data={pieData} />
                    </div>
                </div>
            </div>
            <div className={styles.bigBotTitle}>预算执行情况</div>
            <div className={styles.middle}>
                <BarChart data={barDataOne} title={barTitle1} />
            </div>
            <div className={styles.bottom}>
                <BarChart data={barDataTwo} title={barTitle2} />
            </div>
        </div>
    );
};

export default connect(({ monitorWarning }) => ({
    monitorWarning,
}))(Index);
