import calcFn from '@/util/calc';
import { formattingMoneyEn } from '@/util/util';
import { Button } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import BusinessModal from './businessModal';
import PersonalModal from './personalModal';
//报销部分信息

const Index = ({ personSalaryBreakdown, dispatch }) => {
    const { businessCardInfo, businessList, personalCardInfo, personalList, disabled } = personSalaryBreakdown;
    const [total, setTotal] = useState(0);
    useEffect(() => {
        setTotal(calcFn.add(businessCardInfo.allAmt, personalCardInfo.allAmt));
    }, [businessCardInfo, personalCardInfo]);

    const [businessIsShow, setBusinessIsShow] = useState(false);
    const [personalIsShow, setPersonalIsShow] = useState(false);

    const changeBusinessIsShow = (isShow) => {
        setBusinessIsShow(isShow);
    };
    const changePersonalIsShow = (isShow) => {
        setPersonalIsShow(isShow);
    };

    return (
        <>
            <div className={`${styles.boxShadowBox} mt10 mb10 pt5 pb5 pl20 pr20`}>
                <div className="f20 fb">
                    <span>本年度报销合计：</span>
                    <span className={'gPrimary'}>{formattingMoneyEn(total)}</span>
                </div>
            </div>

            <div className={'flex'}>
                {/*    公务卡报销*/}
                <div className={`${styles.boxShadowBox} flex_1 mr10 `}>
                    <div className={'flex'}>
                        <div className={'flex_1 flex flex_direction_column'} style={{ height: 'auto' }}>
                            <div className={'flex flex_justify_center flex_direction_column flex_1'}>
                                <div className={'f18 mb10 tc'}>公务卡报销</div>
                                <div className={'fb gPrimary f18 tc'}>{formattingMoneyEn(businessCardInfo.allAmt)}</div>
                            </div>
                        </div>
                        <div className={'flex_1'}>
                            <div className={`${styles.borderLeftItem} pt10`}>
                                <div className={'tc mb10'}>报销收入</div>
                                {businessList.map((item, index) => {
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
                    <div className={`${styles.borderTopItem} width_100 flex  pl20 pr10`}>
                        <Button disabled={disabled} type={'link'} onClick={() => setBusinessIsShow(true)}>
                            点击查询明细_
                        </Button>
                    </div>
                </div>

                {/*    个人储蓄卡报销*/}
                <div className={`${styles.boxShadowBox} flex_1 `}>
                    <div className={'flex'}>
                        <div className={'flex_1 flex flex_direction_column'} style={{ height: 'auto' }}>
                            <div className={'flex flex_justify_center flex_direction_column flex_1'}>
                                <div className={'f18 mb10 tc'}>个人储蓄卡报销</div>
                                <div className={'fb gPrimary f18 tc'}>{formattingMoneyEn(personalCardInfo.allAmt)}</div>
                            </div>
                        </div>
                        <div className={'flex_1'}>
                            <div className={`${styles.borderLeftItem}  pt10`}>
                                <div className={'tc mb10'}>报销收入</div>
                                {personalList.map((item, index) => {
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
                    <div className={`${styles.borderTopItem} width_100 flex  pl20 pr10`}>
                        <Button disabled={disabled} type={'link'} onClick={() => setPersonalIsShow(true)}>
                            点击查询明细_
                        </Button>
                    </div>
                </div>
            </div>
            {businessIsShow && <BusinessModal changeVisible={changeBusinessIsShow} />}
            {personalIsShow && <PersonalModal changeVisible={changePersonalIsShow} />}
        </>
    );
};
export default connect(({ personSalaryBreakdown }) => ({ personSalaryBreakdown }))(Index);
