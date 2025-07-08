import dayjs from 'dayjs';
import { BASE_WIDTH, ORDER_WIDTH } from '../../../util/constant';
import { getLabel } from '../../../util/util';

export const titleList = {
    index: '序号',
    numberNo: '单据编号',
    reimbCardNum: '报账卡号',
    totalReimbursementAmt: '申请报销总金额',
    payType: '支付方式',
    numberOrgName: '单位名称',
    draftTime: '拟稿时间',
    processingStatus: '办理状态',
};

export const getColumnsList = (models, operationCol) => {
    const { processingStatusList, payList } = models;
    let columnsList = [];
    Object.keys(titleList).map((key, index) => {
        let minWidth = titleList[key].length * 20;
        let width = minWidth < BASE_WIDTH ? BASE_WIDTH : minWidth;
        columnsList.push({
            title: titleList[key],
            dataIndex: key,
            key: key,
            fixed: key === 'index' ? 'left' : null,
            width: key === 'numberNo' ? 360 : key === 'index' ? ORDER_WIDTH : width + 60,
            render: (text, record, index) => {
                if (key === 'index') {
                    return index + 1;
                }
                if (key === 'processingStatus') {
                    return processingStatusList[text];
                }
                if (key === 'payType') {
                    let arrText = text.split(',');
                    let arr = arrText.map((item) => getLabel(payList, item));
                    return arr.toString();
                }
                if (key == 'draftTime') {
                    return text ? dayjs.unix(text).format('YYYY-MM-DD') : '';
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
