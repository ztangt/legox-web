import { BASE_WIDTH, ORDER_WIDTH } from '@/util/constant';
export const titleList = {
    index: '序号',
    receiveUserName: '领用人',
    dayReceiveTotal: '当日领用总额',
    dayReceiveNumber: '当日领用次数',
};

const detailTitleList = {
    index: '序号',
    receiveUserName: '领用人',
    receiveAmount: '领用金额',
};

export const getColumnsList = (models, colList, type) => {
    let list = type == 2 ? detailTitleList : titleList;
    let columnsList = [];
    Object.keys(list).map((key, index) => {
        let minWidth = list[key].length * 20;
        let width = minWidth < BASE_WIDTH ? BASE_WIDTH : minWidth;
        columnsList.push({
            title: list[key],
            dataIndex: key,
            key: key,
            width: key === 'index' ? ORDER_WIDTH : width + 60,
            render: (text, record, index) => {
                if (key === 'index') {
                    return index + 1;
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
