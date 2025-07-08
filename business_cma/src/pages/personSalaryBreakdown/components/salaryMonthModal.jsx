import GlobalModal from '@/components/GlobalModal';
import { formattingMoneyEn } from '@/util/util';
import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import SalaryMonthDetailModal from './salaryMonthDetailModal.jsx';

//一级弹窗-实发工资的查询分页明细
const Index = ({ personSalaryBreakdown, dispatch, changeVisible }) => {
    const { formInfo, salaryMonthLoading, salaryMonthList, orgInfo } = personSalaryBreakdown;
    useEffect(() => {
        dispatch({
            type: 'personSalaryBreakdown/updateStates',
            payload: { salaryMonthLoading: true, salaryMonthList: [] },
        });
        dispatch({ type: 'personSalaryBreakdown/getSalaryListGroup', payload: formInfo });
    }, []);
    const [month, setMonth] = useState('');
    const [isShow, setIsShow] = useState(false);
    const getDetail = (item) => {
        setMonth(item.month);
        changeShow(true);
    };
    const changeShow = (isShow) => {
        setIsShow(isShow);
    };

    return (
        <>
            <GlobalModal
                title={`气象部门${formInfo.year || ''}年度个人收入信息查询`}
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
                <Spin spinning={salaryMonthLoading}>
                    <div className={'flex'}>
                        <div className={'mr50'}>
                            <span>查询年度单位:</span>
                            <span className={'gPrimary ml5 fb'}>{formInfo.year}</span>
                        </div>
                        <div>
                            <span>发放单位:</span>
                            <span className={'gPrimary ml5 fb'}>{orgInfo.name}</span>
                        </div>
                    </div>
                    <div
                        className={`flex  flex_wrap pt10 pb10 ${
                            salaryMonthList.length >= 3 ? 'flex_justify_between' : ''
                        }`}
                    >
                        {salaryMonthList.map((item, index) => (
                            <div key={index} className={`mr20 mb10  ${styles.card_box}`}>
                                <div className={styles.card_box_top}>
                                    <div className={'fb gDanger f16'}>
                                        <span>{Number(item.month)}月</span>
                                        <span className={'ml10'}>{item.actualTotalAmt}</span>
                                    </div>
                                    <div className={'primaryColor'} onClick={() => getDetail(item)}>
                                        查询明细
                                    </div>
                                </div>
                                <div className={styles.card_box_bottom}>
                                    <div className={'flex flex_justify_between mt5 mb5'}>
                                        <span>应发合计</span>
                                        <span className={'gPrimary'}>{formattingMoneyEn(item.totalDueAmt)}</span>
                                    </div>
                                    <div className={'flex flex_justify_between mt5 mb5'}>
                                        <span>扣款合计</span>
                                        <span className={'gPrimary'}>
                                            {formattingMoneyEn(item.deductionSubtotalAmt)}
                                        </span>
                                    </div>
                                    <div className={'flex flex_justify_between mt5 mb5'}>
                                        <span>实发合计</span>
                                        <span className={'gPrimary'}>{formattingMoneyEn(item.actualTotalAmt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Spin>
            </GlobalModal>
            {isShow && <SalaryMonthDetailModal month={month} changeVisible={changeShow} />}
        </>
    );
};
export default connect(({ personSalaryBreakdown }) => ({ personSalaryBreakdown }))(Index);
