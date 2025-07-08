import { ListTable } from '@visactor/react-vtable';
import { Button } from 'antd';
import { connect } from 'dva';
import { useRef, useState } from 'react';
import { getColumnsList } from './config';

const Index = ({ dispatch, businessCardCheckedNew }) => {
    const { number } = businessCardCheckedNew;
    const columns = getColumnsList();
    let list = [
        {
            cashierInfoId: '1783685501623017476',
            voucherNumber: 'ZD-202404-141041001-0000-000004',
            businessCardType: 1,
            businessCardUserIdNumber: '610302198005052539',
            businessCardUserName: '咸迪',
            businessCardNumber: '6283660100288824',
            businessCardOpenBankName: '中国建设银行北京白石桥支行',
            businessDate: '2024-04-22',
            businessCardPosNumber: '',
            amount: 2070.0,
            mark: null,
            claimantUserName: '田双',
            isCcgpTldt: '0',
        },
        {
            cashierInfoId: '1783685501627211780',
            voucherNumber: 'ZD-202404-141041001-0000-000004',
            businessCardType: 1,
            businessCardUserIdNumber: '610302198005052539',
            businessCardUserName: '咸迪',
            businessCardNumber: '6283660100288824',
            businessCardOpenBankName: '中国建设银行北京白石桥支行',
            businessDate: '2024-04-22',
            businessCardPosNumber: '',
            amount: 1183.0,
            mark: null,
            claimantUserName: '田双',
            isCcgpTldt: '0',
        },
    ];

    const [numberState, setNumberState] = useState(0);

    const onCheckboxStateChange = () => {
        console.log(number, numberState, '获取不到最新的number值');
    };
    const getNumber = () => {
        console.log(number, numberState, '客厅获取到最新的number值');
    };
    const changeNumber = () => {
        setNumberState(numberState + 1);
        dispatch({
            type: 'businessCardCheckedNew/updateStates',
            payload: { number: number + 1 },
        });
    };

    let newList = [
        {
            cashierInfoId: '1783685501',
            voucherNumber: 'ZD-202404-141041001-0000-000004',
            businessCardType: 1,
            businessCardUserIdNumber: '610302198005052539',
            businessCardUserName: '咸迪',
            businessCardNumber: '6283660100288824',
            businessCardOpenBankName: '中国建设银行北京白石桥支行',
            businessDate: '2024-04-22',
            businessCardPosNumber: '',
            amount: 30000.0,
            mark: null,
            claimantUserName: '田双',
            isCcgpTldt: '0',
        },
        {
            cashierInfoId: '178368550162',
            voucherNumber: 'ZD-202404-141041001-0000-000004',
            businessCardType: 1,
            businessCardUserIdNumber: '610302198005052539',
            businessCardUserName: '咸迪',
            businessCardNumber: '6283660100288824',
            businessCardOpenBankName: '中国建设银行北京白石桥支行',
            businessDate: '2024-04-22',
            businessCardPosNumber: '',
            amount: 8999.0,
            mark: null,
            claimantUserName: '田双',
            isCcgpTldt: '0',
        },
    ];

    const vTableRef = useRef(null);
    const getList = (sortInfo) => {
        vTableRef.current.setRecords(newList, { sortState: null });
        vTableRef.current.updateSortState(sortInfo, false);
    };
    const onSortClick = (args) => {
        let { field, order } = args;
        let newOrder = order == 'normal' ? 'desc' : order == 'desc' ? 'asc' : 'normal';
        getList({ field, order: newOrder });
        return false;
    };

    const onTestSort = () => {
        getList({ field: 'voucherNumber', order: 'asc' });
    };
    return (
        <div>
            <Button onClick={() => getList({ field: 'businessCardUserName', order: 'asc' })}>获取更多数据</Button>
            <Button onClick={onTestSort}>测试设置排序图标是否好使</Button>
            <ListTable
                ref={vTableRef}
                onCheckboxStateChange={onCheckboxStateChange}
                height={400}
                onSortClick={onSortClick}
                columns={columns}
                records={list}
            />
        </div>
    );
};

export default connect(({ businessCardCheckedNew }) => ({
    businessCardCheckedNew,
}))(Index);
