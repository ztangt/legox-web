import GlobalModal from '@/components/GlobalModal';
import calcFn from '@/util/calc';
import { formattingMoneyEn } from '@/util/util';
import { Button, Select, Spin, Table } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { businessColumns, expenseList } from './config';

//一级弹窗-公务卡报销明细
const Index = ({ personSalaryBreakdown, dispatch, changeVisible }) => {
    const { formInfo, businessModalLoading } = personSalaryBreakdown;
    const [list, setList] = useState([]);
    const [searchType, setSearchType] = useState('');

    let { nccOrgCode, ...otherData } = formInfo;

    useEffect(() => {
        dispatch({ type: 'personSalaryBreakdown/updateStates', payload: { businessModalLoading: true } });
        getList();
    }, []);
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const changeSearchType = (value) => {
        setSearchType(value);
    };
    const getList = () => {
        dispatch({
            type: 'personSalaryBreakdown/getReimbursementDetail',
            payload: { ...otherData, payState: 1, searchType },
            callback: (resList) => {
                setList(resList);
            },
        });
    };
    //导出
    const onExport = () => {
        dispatch({
            type: 'personSalaryBreakdown/onBusinessExport',
            payload: { ...otherData, searchType, payState: 1 },
        });
    };

    return (
        <GlobalModal
            title="公务卡报销明细"
            open={true}
            footer={null}
            onCancel={() => changeVisible(false)}
            maskClosable={false}
            mask={true}
            modalSize="lager"
            bodyStyle={{ height: 'calc(100vh - 150px)' }}
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
        >
            <Spin spinning={businessModalLoading}>
                <div className={'gDanger fb'}>注：只可查询气象部门发放的报销数据</div>
                <div className={'flex flex_align_center mt10 mb10'}>
                    <div>报销类型：</div>
                    <Select
                        style={{ width: 200 }}
                        onChange={changeSearchType}
                        value={searchType}
                        showSearch
                        placeholder={'请选择劳务类型'}
                        options={expenseList}
                        allowClear={false}
                        filterOption={filterOption}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                    <Button className={'ml20'} onClick={getList} type={'primary'}>
                        查询
                    </Button>
                    <Button className={'ml20'} onClick={onExport} type={'primary'}>
                        导出
                    </Button>
                </div>
                <div className={'pb20'}>
                    <Table
                        size={'middle'}
                        rowKey={'month'}
                        columns={businessColumns}
                        dataSource={list}
                        bordered
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        summary={(pageData) => {
                            let totalOne = 0;
                            let totalTwo = 0;
                            pageData.forEach(({ swipecardAmount, amount }) => {
                                totalOne = calcFn.add(totalOne, swipecardAmount);
                                totalTwo = calcFn.add(totalTwo, amount);
                            });
                            return (
                                <Table.Summary.Row fiex="true">
                                    <Table.Summary.Cell index={0}>
                                        <div className={'flex_center'}>合计</div>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} />
                                    <Table.Summary.Cell index={2} />
                                    <Table.Summary.Cell index={3} />
                                    <Table.Summary.Cell index={4} />
                                    <Table.Summary.Cell index={5} />
                                    <Table.Summary.Cell index={6} className={'tc gDanger'}>
                                        {formattingMoneyEn(totalOne)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={7} className={'tc gDanger'}>
                                        {formattingMoneyEn(totalTwo)}
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }}
                    />
                </div>
            </Spin>
        </GlobalModal>
    );
};
export default connect(({ personSalaryBreakdown }) => ({ personSalaryBreakdown }))(Index);
