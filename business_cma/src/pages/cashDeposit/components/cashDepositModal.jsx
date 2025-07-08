import { getLabel, getModalTableHeight } from '@/util/util';
import { Button, Col, InputNumber, message, Row } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import GlobalModal from '../../../components/GlobalModal';
import styles from '../index.less';
import { getColumnsList } from './config';

const CashDepositModal = ({ dispatch, cashDeposit, info, changeVisible, loading }) => {
    const { detailList, businessDate, accountTypeList } = cashDeposit;

    const [columns, setColumns] = useState([]);
    const [curHeight, setCurHeight] = useState(0);
    const [dataSource, setDataSource] = useState([]); // 选中行的all data
    useEffect(() => {
        setCurHeight(getModalTableHeight('cashDeposit_modal_container', 'cashDeposit_modal_list_head', 50));
        getList();
    }, []);

    //现金送存登记详情查询
    const getList = () => {
        dispatch({
            type: `cashDeposit/getDetailList`,
            payload: {
                businessDate,
                backAccount: info.BANK_ACCOUNT,
                limit: 100,
                start: 1,
            },
            callback: (list) => {
                setDataSource(list);
            },
        });
    };

    //初始化columns
    useEffect(() => {
        let colList = [
            {
                title: '本日送存金额（元）',
                dataIndex: 'dayVaultAmount',
                render(text, record, index) {
                    return (
                        <InputNumber
                            defaultValue={text}
                            min={0}
                            onChange={(e) => changeAmount(e, text, record, index)}
                        />
                    );
                },
            },
        ];
        setColumns(getColumnsList(cashDeposit, colList, 'detail'));
    }, [detailList]); //动态更新

    //修改本次提取金额（元）
    const changeAmount = (value, text, record, index) => {
        detailList[index].dayVaultAmount = value;
    };
    //现金送存登记保存
    const onSave = () => {
        //至少有一个输入送存金额的
        let isAmount = detailList.find((item) => !!item.dayVaultAmount);
        if (!isAmount) {
            return message.error('本日送存金额不能为空');
        }
        let arrayList = detailList.map((item) => {
            return {
                ...item,
                cashExtOrgId: info.BELONG_ORG_ID,
                cashExtOrgName: info.COMPANY_NAME,
                accountNumber: info.BANK_ACCOUNT,
            };
        });
        dispatch({
            type: `cashDeposit/saveDepositList`,
            payload: JSON.stringify({
                depositBookingVoList: arrayList,
                businessDate: businessDate,
                backAccount: info.BANK_ACCOUNT,
            }),
            callback: function (data) {
                message.success('保存成功');
                changeVisible(false);
            },
        });
    };

    let infoList = [
        { title: '业务日期', value: businessDate },
        { title: '开户行', value: info.BANK_NAME },
        { title: '单位', value: info.COMPANY_NAME },
        { title: '银行账户', value: info.BANK_ACCOUNT },
        { title: '账户性质', value: getLabel(accountTypeList, info.ACCOUNT_TYPE_TLDT_) },
    ];

    return (
        <div>
            <GlobalModal
                title="余额送存登记"
                open={true}
                footer={[
                    <Button key="back" onClick={() => changeVisible(false)}>
                        取消
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={onSave}
                        loading={loading.effects['cashDeposit/saveDepositList']}
                    >
                        保存
                    </Button>,
                ]}
                onCancel={() => changeVisible(false)}
                onOk={onSave}
                top={'2%'}
                getContainer={() => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                }}
                maskClosable={false}
                mask={false}
                modalSize="middle"
            >
                <div id={'cashDeposit_modal_container'} className="height_100">
                    <div id={'cashDeposit_modal_list_head'}>
                        <div className={styles.cash_title}>现金送存单</div>
                        <Row>
                            {infoList.map((item, index) => {
                                return (
                                    <Col key={index} className="flex flex_align_center mb8" span={12}>
                                        <div className={styles.cash_info_title}>{item.title}：</div>
                                        <div>{item.value}</div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                    <ColumnDragTable
                        taskType="MONITOR"
                        tableLayout="fixed"
                        rowKey={(record) => JSON.stringify(record)}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        bordered={true}
                        showSorterTooltip={false}
                        scroll={{
                            y: curHeight,
                        }}
                    />
                </div>
            </GlobalModal>
        </div>
    );
};

export default connect(({ cashDeposit, loading }) => ({ cashDeposit, loading }))(CashDepositModal);
