import { BASE_WIDTH, ORDER_WIDTH } from '@/util/constant';

export const titleList = {
    index: '序号',
    projectName: '项目名称',
    projectCode: '项目编码',
    projectLegalEntityName: '法人单位',
    exeProgressState: '执行进度是否正常',
    budgetExeState: '预算执行进度是否正常',
};
const isTrue = ['是', '否'];

export const getColumnsList = (models, operationCol) => {
    const { executeList, progressList } = models;
    let columnsList = [];
    Object.keys(titleList).map((key, index) => {
        let minWidth = titleList[key].length * 20;
        let width = minWidth < BASE_WIDTH ? BASE_WIDTH : minWidth;
        columnsList.push({
            title: titleList[key],
            dataIndex: key,
            key: key,
            fixed: key === 'index' ? 'left' : null,
            width: key === 'projectCode' ? 300 : key === 'index' ? ORDER_WIDTH : width + 60,
            render: (text, record, index) => {
                if (key === 'index') {
                    return index + 1;
                }
                if (key === 'exeProgressState' || key === 'budgetExeState') {
                    return isTrue[text];
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
