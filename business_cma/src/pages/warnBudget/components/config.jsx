import { BASE_WIDTH, ORDER_WIDTH } from '@/util/constant';
import styles from '../index.less';
export const titleList = {
    index: '序号',
    warn: '预警',
    cashierOrgName: '项目名称',
    voucherNumber: '项目编码',
    reimbCardNum: '项目类型',
    isProgress: '法人单位',
    isExecute: '项目总金额（万元）',
    isExecute1: '累计预算批复总数（万元）',
    isExecute2: '本年预算下达数',
    isExecute3: '预算冻结总金额',
    isExecute4: '预算执行总金额',
    isExecute5: '合同执行总金额',
    isExecute6: '采购执行总金额',
};

export const colorList = [
    { color: '#FA2C19', label: '预算超支', value: 1 },
    { color: '#8ee5ee', label: '预算超出最高限制', value: 3 },
    { color: '#cd69c9', label: '超出预算执行计划', value: 2 },
];

export const getColumnsList = (models, operationCol) => {
    let columnsList = [];
    Object.keys(titleList).map((key, index) => {
        let minWidth = titleList[key].length * 20;
        let width = minWidth < BASE_WIDTH ? BASE_WIDTH : minWidth;
        columnsList.push({
            title: titleList[key],
            dataIndex: key,
            key: key,
            fixed: key === 'index' || key === 'warn' ? 'left' : null,
            width: key === 'voucherNumber' ? 300 : key === 'index' || key == 'warn' ? ORDER_WIDTH : width + 60,
            render: (text, record, index) => {
                if (key === 'index') {
                    return index + 1;
                }
                if (key === 'warn') {
                    let color = colorList.find((item) => item.value == text)?.color;
                    return <div className={styles.warnColor} style={{ backgroundColor: color }} />;
                }
                return text;
            },
        });
    });
    if (operationCol) {
        columnsList.push(operationCol);
    }
    return columnsList;
};
