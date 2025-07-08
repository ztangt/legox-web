import { Button, message } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import calcFn from '../../../util/calc';
import styles from '../index.less';
import { cardColumn, payColumn } from './config';

const Container = ({ dispatch, yqSettlementIframe }) => {
    let formInfo = localStorage.getItem('cma_yqSettlementIframe') || '{}';
    const {
        SOL_ID: bizSolId,
        MAIN_TABLE_ID: mainTableId,
        PAY_ACCOUNT_NAME: bankAccount,
        NUMBER,
        ORG_ID: draftOrgId,
    } = JSON.parse(formInfo);
    useEffect(() => {
        //获取转账汇款支付明细
        dispatch({
            type: 'yqSettlementIframe/getRtcList',
            payload: JSON.parse(formInfo),
        });
        //获取公务卡支付明细
        dispatch({
            type: 'yqSettlementIframe/getCardList',
            payload: JSON.parse(formInfo),
        });
        //判断是否已生成支付结算单
        dispatch({
            type: 'yqSettlementIframe/checkHasCreate',
            payload: { mainTableId },
        });
    }, []);

    const { rtcList, cardList, currentHeight, isMatchList, hasCreate } = yqSettlementIframe;

    let totalMoney = 0;
    rtcList.forEach((item) => {
        totalMoney = calcFn.add(item.MONEY, totalMoney);
    });
    cardList.forEach((item) => {
        totalMoney = calcFn.add(item.MONEY, totalMoney);
    });

    //生成支付结算单
    const goCreate = () => {
        if (hasCreate == '已生成') {
            return message.error('已生成支付结算单，无需重复生成');
        }
        if (isMatchList.includes('未匹配')) {
            return message.error('公务卡存在未匹配记录，不可生成支付结算单,请核实！');
        }
        dispatch({
            type: 'yqSettlementIframe/createStlmt',
            payload: JSON.parse(formInfo),
        });
    };
    return (
        <div>
            <div className="mb20 mt20">
                <Button onClick={goCreate}>确认支付信息</Button>
            </div>
            <div className={styles.topBox}>
                <div className="flex mb10">
                    <div className="flex_1 ml20">
                        业务单据号：<span className={styles.defColor}>{NUMBER}</span>
                    </div>
                    <div className="flex_1">
                        付款总笔数：<span className={styles.defColor}>{cardList.length + rtcList.length}</span>
                    </div>
                </div>
                <div className="flex">
                    <div className="flex_1 ml20">
                        付款总金额：<span className={styles.defColor}>{totalMoney}</span>
                    </div>
                    <div className="flex_1">
                        支付状态：<span className={styles.defColor}>{hasCreate}</span>
                    </div>
                </div>
            </div>
            <div className={styles.titleText}>转账汇款支付明细</div>
            <div className="mb20">
                <ColumnDragTable
                    taskType="MONITOR"
                    tableLayout="fixed"
                    rowKey="ID"
                    dataSource={rtcList}
                    pagination={false}
                    bordered={true}
                    showSorterTooltip={false}
                    columns={[
                        ...payColumn,
                        {
                            title: '主键',
                            width: 240,
                            render: () => mainTableId,
                        },
                    ]}
                    scroll={{ y: rtcList.length > 0 ? currentHeight : 0, x: 1700 }}
                />
            </div>
            <div className="mt10">
                <span className={styles.titleText}>公务卡支付明细</span>
                <span className={styles.redText}>(注：消费记录校验位"不匹配"，则可能是未查询到消费记录或者未签约)</span>
            </div>
            <div>
                <ColumnDragTable
                    taskType="MONITOR"
                    tableLayout="fixed"
                    rowKey="ID"
                    dataSource={cardList}
                    pagination={false}
                    bordered={true}
                    showSorterTooltip={false}
                    columns={[
                        ...cardColumn,
                        {
                            title: '主键',
                            width: 240,
                            render: () => mainTableId,
                        },
                    ]}
                    scroll={{ y: cardList.length > 0 ? currentHeight : 0 }}
                />
            </div>
        </div>
    );
};

export default connect(({ yqSettlementIframe }) => ({
    yqSettlementIframe,
}))(Container);
