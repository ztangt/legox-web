//劳务费弹窗
import GlobalModal from '@/components/GlobalModal';
import calcFn from '@/util/calc';
import { formattingMoneyEn } from '@/util/util';
import { Button, Select, Spin, Table } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { salaryTotalColumns } from './config';
import SalaryMonthDetailModal from './salaryMonthDetailModal';
const Index = ({ personSalaryBreakdown, dispatch, changeVisible }) => {
    const { yearList, formInfo, salaryTotalLoading } = personSalaryBreakdown;
    const [year, setYear] = useState(formInfo.year);
    const [list, setList] = useState([]);
    const [columns, setColumns] = useState([]);
    const [chooseInfo, setChooseInfo] = useState({});
    const [totalFour, setTotalFour] = useState(0);
    const [totalFive, setTotalFive] = useState(0);
    const [totalSix, setTotalSix] = useState(0);
    const [totalSeven, setTotalSeven] = useState(0);
    const [totalEight, setTotalEight] = useState(0);
    const [totalNine, setTotalNine] = useState(0);
    const [totalTen, setTotalTen] = useState(0);
    const [totalEleven, setTotalEleven] = useState(0);
    const [totalTwelve, setTotalTwelve] = useState(0);
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        let optionColumn = {
            title: '操作',
            align: 'center',
            render: (text, record) => {
                return (
                    <div className={'primaryColor'} onClick={() => openModal(record)}>
                        查看详情
                    </div>
                );
            },
        };
        setColumns([...salaryTotalColumns, optionColumn]);
        dispatch({ type: 'personSalaryBreakdown/updateStates', payload: { salaryTotalLoading: true } });
        getList(formInfo);
    }, []);
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const changeYear = (value) => {
        setYear(value);
    };
    const getList = (postData) => {
        dispatch({
            type: 'personSalaryBreakdown/getSalaryListGroup',
            payload: { ...postData },
            callback: (resList) => {
                setList(resList);
                let totalFour = 0;
                let totalFive = 0;
                let totalSix = 0;
                let totalSeven = 0;
                let totalEight = 0;
                let totalNine = 0;
                let totalTen = 0;
                let totalEleven = 0;
                let totalTwelve = 0;
                resList.forEach((item) => {
                    totalFour = calcFn.add(totalFour, item.totalDueAmt);
                    totalFive = calcFn.add(totalFive, item.deductionSubtotalAmt);
                    totalSix = calcFn.add(totalSix, item.unemploymentInsuranceAmt);
                    totalSeven = calcFn.add(totalSeven, item.endowmentInsuranceAmt);
                    totalEight = calcFn.add(totalEight, item.medicalinsuranceAmt);
                    totalNine = calcFn.add(totalNine, item.housingFundAmt);
                    totalTen = calcFn.add(totalTen, item.individualIncomeTax);
                    totalEleven = calcFn.add(totalEleven, item.occupationalAnnuityAmt);
                    totalTwelve = calcFn.add(totalTwelve, item.actualTotalAmt);
                });
                setTotalFour(totalFour);
                setTotalFive(totalFive);
                setTotalSix(totalSix);
                setTotalSeven(totalSeven);
                setTotalEight(totalEight);
                setTotalNine(totalNine);
                setTotalTen(totalTen);
                setTotalEleven(totalEleven);
                setTotalTwelve(totalTwelve);
            },
        });
    };
    const onSearch = () => {
        getList({ ...formInfo, year });
    };

    const onExport = () => {
        dispatch({
            type: 'personSalaryBreakdown/onExportTotal',
            payload: { ...formInfo, year },
        });
    };

    const openModal = (record) => {
        setChooseInfo(record);
        setIsShow(true);
    };

    return (
        <>
            <GlobalModal
                title="气象部门工资发放汇总列表"
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
                <Spin spinning={salaryTotalLoading}>
                    <div className={'flex flex_align_center mb10'}>
                        <div>查询年度：</div>
                        <Select
                            style={{ width: 200 }}
                            onChange={changeYear}
                            value={year}
                            showSearch
                            placeholder={'查询年度'}
                            options={yearList}
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
                            columns={columns}
                            dataSource={list}
                            bordered
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                            summary={(pageData) => {
                                let totalBorrow = 0;
                                let totalRepayment = 0;
                                pageData.forEach(({ borrow, repayment }) => {
                                    totalBorrow += borrow;
                                    totalRepayment += repayment;
                                });
                                return (
                                    <Table.Summary.Row fiex="true">
                                        <Table.Summary.Cell index={0} class={'flex_center'}>
                                            合计
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} />
                                        <Table.Summary.Cell index={2} />
                                        <Table.Summary.Cell index={3} />
                                        <Table.Summary.Cell index={4} className={'tc gDanger'}>
                                            {formattingMoneyEn(totalFour)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={5} className={'tc gDanger'}>
                                            {formattingMoneyEn(totalFive)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={6} className={'tc gDanger'}>
                                            {formattingMoneyEn(totalSix)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={7} className={'tc gDanger'}>
                                            {formattingMoneyEn(totalSeven)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={8} className={'tc gDanger'}>
                                            {formattingMoneyEn(totalEight)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={9} className={'tc gDanger'}>
                                            {formattingMoneyEn(totalNine)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={10} className={'tc gDanger'}>
                                            {formattingMoneyEn(totalTen)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={11} className={'tc gDanger'}>
                                            {formattingMoneyEn(totalEleven)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={12} className={'tc gDanger'}>
                                            {formattingMoneyEn(totalTwelve)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={13} />
                                    </Table.Summary.Row>
                                );
                            }}
                        />
                    </div>
                </Spin>
            </GlobalModal>
            {isShow && (
                <SalaryMonthDetailModal
                    noTotal={true}
                    year={year}
                    changeVisible={(isShow) => setIsShow(isShow)}
                    month={chooseInfo.month}
                />
            )}
        </>
    );
};
export default connect(({ personSalaryBreakdown }) => ({ personSalaryBreakdown }))(Index);
