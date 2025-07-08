import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
//仪表盘
const GaugeChart = ({ data }) => {
    const chartRef = useRef(null);
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        const option = {
            tooltip: {
                formatter: '{a} <br/>{b} : {c}%',
            },
            series: [
                {
                    name: 'Pressure',
                    type: 'gauge',
                    progress: {
                        show: true,
                        width: 10,
                    },
                    itemStyle: {
                        color: '#1890ff',
                    },
                    detail: {
                        fontSize: 20,
                        offsetCenter: [0, '80%'],
                        valueAnimation: true,
                        formatter: function (value) {
                            return value + '%';
                        },
                    },
                    //小的标点的
                    axisTick: {
                        show: false,
                    },
                    data: data,
                    //占比率
                    title: {
                        offsetCenter: [0, '50%'],
                        fontSize: 12,
                        color: '#666',
                    },
                    //主标点的
                    splitLine: {
                        show: false,
                    },
                    //圆圈的
                    axisLine: {
                        lineStyle: {
                            width: 10,
                            color: [[1, '#ececec']],
                        },
                    },
                    axisLabel: {
                        distance: 0,
                        color: '#999',
                        fontSize: 12,
                    },
                },
            ],
        };
        chart.setOption(option);
        return () => {
            chart.dispose(); // 销毁图表实例
        };
    }, [data]);

    return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default GaugeChart;
