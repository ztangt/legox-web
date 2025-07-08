import GlobalModal from '@/components/GlobalModal';
import calcFn from '@/util/calc';
import { formattingMoneyEn } from '@/util/util';
import { Button, Select, Spin, Table } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { afterTaxColumns, laborList } from './config';

const Index = ({ personSalaryBreakdown, dispatch, changeVisible }) => {
    const { formInfo, afterTaxModalLoading } = personSalaryBreakdown;
    const [list, setList] = useState([]);

    const [labor, setLabor] = useState('');
    useEffect(() => {
        dispatch({ type: 'personSalaryBreakdown/updateStates', payload: { afterTaxModalLoading: true } });
        getList();
    }, []);
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const changeLabor = (value) => {
        setLabor(value);
    };
    const getList = () => {
        let { idCard, year } = formInfo;
        let postData = { idCard, year, searchType: labor };
        dispatch({
            type: 'personSalaryBreakdown/getTaxInfoDetail',
            payload: { ...postData },
            callback: (resList) => {
                setList(resList);
            },
        });
    };
    const onSearch = () => {
        getList();
    };

    const onExport = () => {
        let { idCard, year } = formInfo;

        dispatch({
            type: 'personSalaryBreakdown/onExportTaxInfo',
            payload: { idCard, year, searchType: labor },
        });
    };

    return (
        <GlobalModal
            title="劳务费明细"
            open={true}
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            bodyStyle={{ height: 'calc(100vh - 150px)' }}
            footer={null}
            onCancel={() => changeVisible(false)}
            maskClosable={false}
            mask={true}
            modalSize="lager"
        >
            <Spin spinning={afterTaxModalLoading}>
                <div className={'gDanger fb'}>注：只可查询气象部门发放劳务所得</div>
                <div className={'flex flex_align_center mt10 mb10'}>
                    <div>劳务类型：</div>
                    <Select
                        style={{ width: 200 }}
                        onChange={changeLabor}
                        value={labor}
                        showSearch
                        placeholder={'劳务类型'}
                        options={laborList}
                        allowClear={false}
                        filterOption={filterOption}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                    <Button className={'ml20'} onClick={onSearch} type={'primary'}>
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
                        columns={afterTaxColumns}
                        dataSource={list}
                        bordered
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        summary={(pageData) => {
                            let totalOne = 0;
                            let totalTwo = 0;
                            let totalThr = 0;
                            pageData.forEach(({ AMOUNT_BEFORE_TAX, TAX_AMOUNT, AMOUNT_AFTER_TAX }) => {
                                totalOne = calcFn.add(totalOne, AMOUNT_BEFORE_TAX);
                                totalTwo = calcFn.add(totalTwo, TAX_AMOUNT);
                                totalThr = calcFn.add(totalThr, AMOUNT_AFTER_TAX);
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
                                    <Table.Summary.Cell index={8} className={'tc gDanger'}>
                                        {formattingMoneyEn(totalThr)}
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
