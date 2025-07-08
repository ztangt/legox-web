import calcFn from '@/util/calc';
import { formattingMoneyEn } from '@/util/util';
import { Button } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import AfterTaxModal from './afterTaxModal';
import SalaryMonthModal from './salaryMonthModal';
import SalaryTotalModal from './salaryTotalModal';
//工资部分信息
const Index = ({ personSalaryBreakdown }) => {
    const { salaryInfo, salaryInfoList, taxInfo, taxInfoList, disabled } = personSalaryBreakdown;
    const [monthVisible, setMonthVisible] = useState(false);
    const [totalVisible, setTotalVisible] = useState(false);
    const [afterTaxVisible, setAfterTaxVisible] = useState(false);

    const changeMonthVisible = (isShow) => {
        setMonthVisible(isShow);
    };
    const changeTotalVisible = (isShow) => {
        setTotalVisible(isShow);
    };

    const changeAfterTaxVisible = (isShow) => {
        setAfterTaxVisible(isShow);
    };

    const [total, setTotal] = useState(0);
    useEffect(() => {
        let total = calcFn.add(salaryInfo.actualTotalAmt, taxInfo.afterAmt);
        setTotal(total);
    }, [salaryInfo, taxInfo]);

    return (
        <>
            <div className={`${styles.boxShadowBox} mt10 mb10 pt5 pb5 pl20 pr20`}>
                <div className="f20 fb">
                    <span>本年度应发收入合计：</span>
                    <span className={'gPrimary'}>{formattingMoneyEn(total)}</span>
                </div>
            </div>

            <div className={'flex'}>
                {/*实发工资*/}
                <div className={`${styles.boxShadowBox} flex_1 mr10 flex`}>
                    <div className={'flex_1 flex flex_direction_column'}>
                        <div className={'flex flex_justify_center flex_direction_column flex_1'}>
                            <div className={'f18 mb10 tc'}>实发工资</div>
                            <div className={'fb gPrimary f18 tc'}>{formattingMoneyEn(salaryInfo.actualTotalAmt)}</div>
                        </div>
                        <div className={`${styles.borderTopItem} width_100 flex  pl20 pr10`}>
                            <Button disabled={disabled} type="link" onClick={() => changeMonthVisible(true)}>
                                点击查询分页明细_
                            </Button>
                        </div>
                    </div>
                    <div className={'flex_1'}>
                        <div className={`${styles.borderLeftItem} pt10`}>
                            <div className={'tc mb10'}>工资收入</div>
                            {salaryInfoList.map((item, index) => {
                                return (
                                    <div key={index} className={'flex f16 pb10'}>
                                        <div className={'flex_1 te mr30'}>{item.title}</div>
                                        <div className={'gPrimary flex_1'}>{formattingMoneyEn(item.content)}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={`${styles.borderTopItem} ${styles.borderLeftItem} width_100 flex  pl20 pr10 `}>
                            <Button disabled={disabled} type="link" onClick={() => changeTotalVisible(true)}>
                                点击查询汇总明细_
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={`${styles.boxShadowBox} flex_1  flex`}>
                    <div className={'flex_1 flex flex_direction_column'}>
                        <div className={'flex flex_justify_center flex_direction_column flex_1'}>
                            <div className={'f18 mb10 tc'}>税后劳务</div>
                            <div className={'fb gPrimary f18 tc'}>{formattingMoneyEn(taxInfo.afterAmt)}</div>
                        </div>
                        <div className={`${styles.borderTopItem} width_100 flex  pl20 pr10`}>
                            <Button disabled={disabled} type={'link'} onClick={() => changeAfterTaxVisible(true)}>
                                点击查询明细_
                            </Button>
                        </div>
                    </div>

                    <div className={'flex_1'}>
                        <div className={`${styles.borderLeftItem} ${styles.borderBottomItem} pt10`}>
                            <div className={'tc mb10'}>工资收入</div>
                            {taxInfoList.map((item, index) => {
                                return (
                                    <div key={index} className={'flex f16 pb10'}>
                                        <div className={'flex_1 te mr30'}>{item.title}</div>
                                        <div className={'gPrimary flex_1'}>{formattingMoneyEn(item.content)}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {monthVisible && <SalaryMonthModal changeVisible={changeMonthVisible} />}
            {totalVisible && <SalaryTotalModal changeVisible={changeTotalVisible} />}
            {afterTaxVisible && <AfterTaxModal changeVisible={changeAfterTaxVisible} />}
        </>
    );
};
export default connect(({ personSalaryBreakdown }) => ({ personSalaryBreakdown }))(Index);
