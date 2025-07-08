import { BASE_WIDTH, ORDER_WIDTH } from '@/util/constant';
import { getLabel } from '@/util/util';
import dayjs from 'dayjs';

export const recordDataTypeArr = [
    { value: 1, label: '人员' },
    { value: 2, label: '单位' },
];
export const recordIsSyncArr = [
    { value: 0, label: '否' },
    { value: 1, label: '是' },
    { value: 3, label: '失败' },
    { value: 4, label: '同步中' },
];

export const dataActionArr = [
    { value: 'add', label: '增加' },
    { value: 'delete', label: '删除' },
    { value: 'modify', label: '修改' },
];

export const titleList = {
    index: '序号',
    entityName: '单位/人员名称',
    dataType: '数据类型',
    isSync: '是否同步',
    syncCount: '同步次数',
    syncTime: '同步时间',
    oprationStatus: '数据操作类',
    createTime: '创建日期',
    errorMessage: '错误信息',
};
export const getColumnsList = (models, colList) => {
    let columnsList = [];
    Object.keys(titleList).map((key, index) => {
        let minWidth = titleList[key].length * 20;
        let width = minWidth < BASE_WIDTH ? BASE_WIDTH : minWidth;
        columnsList.push({
            title: titleList[key],
            dataIndex: key,
            key: key,
            fixed: key === 'index' ? 'left' : null,
            width: key === 'index' ? ORDER_WIDTH : width + 60,
            render: (text, record, index) => {
                if (key === 'index') {
                    return index + 1;
                }
                if (key === 'dataType') {
                    return getLabel(recordDataTypeArr, text);
                }
                if (key === 'isSync') {
                    return getLabel(recordIsSyncArr, text);
                }
                if (key == 'syncTime' || key == 'createTime') {
                    return text ? dayjs(text * 1000).format('YYYY-MM-DD HH:mm:ss') : '';
                }
                if (key === 'oprationStatus') {
                    return getLabel(dataActionArr, text);
                }
                return text;
            },
        });
    });
    if (colList) {
        columnsList = columnsList.concat(colList);
    }
    return columnsList;
};
