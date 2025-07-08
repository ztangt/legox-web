import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

const BarChart = ({ data, title }) => {
    let length = data?.xnames?.length || 0;
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);

        const option = {
            title: {
                text: title,
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: '#FFFFFF',
                },
            },
            color: ['#27a844', '#db3645'],
            legend: {
                data: ['序时率', '平均率'],
                orient: 'horizontal',
                right: 20,
                textStyle: {
                    fontSize: 14,
                    color: '#FFFFFF',
                },
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#FFFFFF',
                    },
                },
                data: data?.xnames, // 假设数据中每个对象都有一个name属性
            },
            yAxis: {
                type: 'value',
                name: '执行率',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#FFFFFF',
                    },
                },
                splitLine: {
                    show: false,
                },
                nameTextStyle: {
                    fontSize: 14,
                    color: '#329bc6',
                },
            },
            series: data?.ydatas,
            dataZoom: [
                {
                    type: 'slider',
                    realtime: true,
                    // start: 0,
                    // end: 80, // 数据窗口范围的结束百分比。范围是：0 ~ 100。
                    // end: this.setNum(xAxisData.length), // 数据窗口范围的结束百分比。范围是：0 ~ 100。
                    height: 1, // 组件高度
                    // left: 5, // 左边的距离
                    // right: 5, // 右边的距离
                    bottom: 10, // 下边的距离
                    show: true, // 是否展示
                    fillerColor: '#195CC5', // 滚动条颜色
                    borderColor: 'rgba(17, 100, 210, 0.12)',
                    handleSize: 0, // 两边手柄尺寸
                    xAxisIndex: [0],
                    showDetail: false, // 拖拽时是否展示滚动条两侧的文字
                    zoomLock: true, // 是否只平移不缩放
                    moveOnMouseMove: false, // 鼠标移动能触发数据窗口平移
                    zoomOnMouseWheel: true, // 鼠标移动能触发数据窗口缩放

                    startValue: 0, // 数据窗口范围的起始数值。
                    endValue: 10, // 数据窗口范围的结束数值。
                },
                {
                    type: 'inside', // 支持内部鼠标滚动平移
                    start: 0,
                    end: 70,
                    zoomOnMouseWheel: false, // 关闭滚轮缩放
                    moveOnMouseWheel: true, // 开启滚轮平移
                    moveOnMouseMove: true, // 鼠标移动能触发数据窗口平移
                },
            ],
        };
        chart.setOption(option);
        const setIntervalId = setInterval(() => {
            if (length >= 6) {
                if (option.dataZoom[0].endValue >= length) {
                    option.dataZoom[0].endValue = 10;
                    option.dataZoom[0].startValue = 0;
                } else {
                    option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
                    option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
                }
            }
            chart.setOption(option);
        }, 2000);

        return () => {
            chart.dispose(); // 销毁图表实例
            clearInterval(setIntervalId);
        };
    }, [data]);

    return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default BarChart;
