import { getLabel, getModalTableHeight } from '@/util/util';
import { Button, Col, InputNumber, message, Row } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import GlobalModal from '../../../components/GlobalModal';
import styles from '../index.less';
import CashExtractCheckModal from './cashExtractCheckModal';
import { getColumnsList } from './config';

const CashExtractModal = ({ dispatch, cashExtract, info, changeVisible, loading }) => {
    const { extractDetailList, accountTypeList, businessDate } = cashExtract;
    const [columns, setColumns] = useState([]);
    const [curHeight, setCurHeight] = useState(0);
    const [chooseIndex, setChooseIndex] = useState(0);
    const [checkNo, setCheckNo] = useState(null);
    const [modalCashCheck, setModalCashCheck] = useState(false);
    let { queryType } = info;

    const [dataSource, setDataSource] = useState([]); // 选中行的all data

    useEffect(() => {
        setCurHeight(getModalTableHeight('cashExtract_modal_container', 'cashExtract_modal_list_head', 40));
        getList(info.BANK_ACCOUNT, queryType);
    }, []);

    //初始化columns
    useEffect(() => {
        let colList = [
            {
                title: '本次提取金额(元)',
                dataIndex: 'extractAmount',
                render(text, record, index) {
                    return (
                        <InputNumber
                            min={0}
                            defaultValue={text}
                            onChange={(e) => onExtractAmount(e, text, record, index)}
                        />
                    );
                },
            },
            {
                title: '现金支票号',
                dataIndex: 'chequeNumber',
                render(text, record, index) {
                    return (
                        <div className="primaryColor" onClick={() => openCheckModal(index, record)}>
                            {text ? text : '选择'}
                        </div>
                    );
                },
            },
        ];

        if (queryType == 0) {
            let otherCol = [
                { title: '小计(元)', dataIndex: 'subTotal' },
                { title: '上一工作日库存现金(元)', dataIndex: 'lastdayVaultAmount' },
            ];
            colList = otherCol.concat(colList);
        }
        setColumns(getColumnsList(cashExtract, colList, 'detail', info.ACCOUNT_TYPE_TLDT_));
    }, [extractDetailList]); //动态更新

    //现金提取登记详情查询
    const getList = (backAccount) => {
        dispatch({
            type: `cashExtract/getExtractDetail`,
            payload: {
                businessDate,
                backAccount,
                querytype: queryType,
            },
            callback: (list) => {
                setDataSource(list);
            },
        });
    };

    //现金提取登记保存
    function saveExtractList() {
        let arrayList = extractDetailList.map((item) => {
            return {
                ...item,
                cashExtOrgId: info.BELONG_ORG_ID,
                cashExtOrgName: info.COMPANY_NAME,
                accountNumber: info.BANK_ACCOUNT,
            };
        });
        dispatch({
            type: `cashExtract/saveExtractList`,
            payload: JSON.stringify({
                extractBookingVoList: arrayList,
                businessDate: businessDate,
            }),
            callback: function (data) {
                message.success('保存成功');
                changeVisible(false);
            },
        });
    }

    //现金提取登记修改
    function updateExtractList() {
        let arrayList = extractDetailList.map((item) => {
            return {
                ...item,
                cashExtOrgId: info.BELONG_ORG_ID,
                cashExtOrgName: info.COMPANY_NAME,
                accountNumber: info.BANK_ACCOUNT,
            };
        });
        dispatch({
            type: `cashExtract/updateExtractList`,
            payload: JSON.stringify({
                extractBookingVoList: arrayList,
                businessDate: businessDate,
            }),
            callback: function (data) {
                message.success('修改成功');
                changeVisible(false);
            },
        });
    }

    // 点击确定保存
    const onSave = () => {
        //至少有一组提取金额不为0并且选择了现金支票号

        //提取填了金额或者支票号的
        let chooseList = extractDetailList.filter((item) => item.extractAmount || item.chequeNumber);
        if (!chooseList.length) {
            return message.error('本次提取金额不能为空且必须大于0');
        }

        let isCashCheck = chooseList.every((item) => item.chequeNumber && item.extractAmount);
        if (!isCashCheck) {
            return message.error('已填数据的现金支票号和金额不能为空');
        }

        queryType == 0 ? saveExtractList() : updateExtractList();
    };

    //修改本次提取金额（元）
    const onExtractAmount = (value, text, record, index) => {
        extractDetailList[index].extractAmount = value || 0;
    };

    //打开选择支票弹窗
    const openCheckModal = (index, record) => {
        setChooseIndex(index);
        setModalCashCheck(true);
        setCheckNo(record.chequeNumber);
    };

    //弹窗回调
    const onOkCheckModal = (record) => {
        setModalCashCheck(false);
        extractDetailList[chooseIndex].chequeNumber = record.checkNo;
        extractDetailList[chooseIndex].chequeInfoId = record.ID;
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
                title={queryType == 0 ? '现金提取登记' : '现金提取修改'}
                open={true}
                footer={[
                    <Button key="back" onClick={() => changeVisible(false)}>
                        取消
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={onSave}
                        loading={
                            queryType == 0
                                ? loading.effects['cashExtract/saveExtractList']
                                : loading.effects['cashExtract/updateExtractList']
                        }
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
                <div id={'cashExtract_modal_container'} className="height_100">
                    <div id={'cashExtract_modal_list_head'}>
                        <div className={styles.cash_title}>现金提取单</div>
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
                {/* 弹窗显隐 */}
                {modalCashCheck && (
                    <CashExtractCheckModal
                        info={info}
                        oldCheckNo={checkNo}
                        changeVisible={(isShow) => setModalCashCheck(isShow)}
                        onOk={onOkCheckModal}
                    />
                )}
            </GlobalModal>
        </div>
    );
};

export default connect(({ cashExtract, loading }) => ({ cashExtract, loading }))(CashExtractModal);
