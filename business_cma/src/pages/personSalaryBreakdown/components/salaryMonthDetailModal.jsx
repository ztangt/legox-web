import GlobalModal from '@/components/GlobalModal';
import { formattingMoneyEn } from '@/util/util';
import { Spin, Table } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { salaryMonthColumns } from './config';

//二级弹窗月份工资收入明细查询
const Index = ({ personSalaryBreakdown, dispatch, changeVisible, month, year, noTotal }) => {
    const { formInfo, salaryMonthDetailLoading } = personSalaryBreakdown;
    const [grantList, setGrantList] = useState([]); //应发
    const [deductionList, setDeductionList] = useState([]); //应扣
    const [monthText, setMonthText] = useState(month); //月份
    const [info, setInfo] = useState({}); //详细信息

    useEffect(() => {
        dispatch({ type: 'personSalaryBreakdown/updateStates', payload: { salaryMonthDetailLoading: true } });
        dispatch({
            type: 'personSalaryBreakdown/getSalaryListDetail',
            payload: {
                ...formInfo,
                year: year ? year : formInfo.year, //传过来的话就用传过来的年度
                month,
            },
            callback: (data) => {
                let bodies = data.bodies || [];
                let grantList = bodies.filter((item) => item.status == 'Y');
                let deductionList = bodies.filter((item) => item.status == 'N');
                setInfo(data);
                setGrantList(grantList);
                setDeductionList(deductionList);
            },
        });
        setMonthText(month < 10 ? month[1] : month);
    }, []);
    return (
        <>
            <GlobalModal
                title={`${monthText}月工资收入明细查询`}
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
                <Spin spinning={salaryMonthDetailLoading}>
                    <div className={'flex'}>
                        <div style={{ width: '350px' }}>
                            <span>发放单位:</span>
                            <span className={'gPrimary ml5 fb'}>{info.wageOrgName}</span>
                        </div>
                        <div style={{ width: '350px' }}>
                            <span>工资类别:</span>
                            <span className={'gDanger ml5 fb'}>{info.wageClassName}</span>
                        </div>
                    </div>
                    {!noTotal && (
                        <div className={'flex'}>
                            <div style={{ width: '350px' }}>
                                <span>本月应发合计:</span>
                                <span className={'gDanger ml5 fb f20'}>{formattingMoneyEn(info.totalDueAmt)}</span>
                            </div>
                            <div style={{ width: '350px' }}>
                                <span>本月扣款合计:</span>
                                <span className={'gDanger ml5 fb f20'}>
                                    {formattingMoneyEn(info.deductionSubtotalAmt)}
                                </span>
                            </div>
                            <div>
                                <span>本月实发合计:</span>
                                <span className={'gDanger ml5 fb f20'}>{formattingMoneyEn(info.actualTotalAmt)}</span>
                            </div>
                        </div>
                    )}
                    <div className={'flex flex_justify_between pt10 pb20'}>
                        <Table
                            className={'flex_1 mr20'}
                            rowKey={'code'}
                            size="small"
                            columns={salaryMonthColumns}
                            dataSource={grantList}
                            bordered={true}
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                            title={() => (
                                <div className={'gPrimary flex flex_justify_between fb'}>
                                    <div>
                                        <span>应发小计:</span>
                                        <span className={' ml10 f18'}>{formattingMoneyEn(info.totalDueAmt)}</span>
                                    </div>
                                    <div>
                                        <span>实发小计:</span>
                                        <span className={' ml10 f18'}>{formattingMoneyEn(info.actualTotalAmt)}</span>
                                    </div>
                                </div>
                            )}
                        />
                        <Table
                            className={'flex_1'}
                            rowKey={'code'}
                            size="small"
                            columns={salaryMonthColumns}
                            bordered={true}
                            dataSource={deductionList}
                            pagination={false}
                            scroll={{ y: 600 }}
                            title={() => (
                                <div className={'gPrimary fb'}>
                                    <span>扣款小计:</span>
                                    <span className={' ml10 f18'}>{formattingMoneyEn(info.deductionSubtotalAmt)}</span>
                                </div>
                            )}
                        />
                    </div>
                </Spin>
            </GlobalModal>
        </>
    );
};
export default connect(({ personSalaryBreakdown }) => ({ personSalaryBreakdown }))(Index);
