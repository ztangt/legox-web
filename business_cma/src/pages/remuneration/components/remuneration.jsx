import { Button, message } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import GlobalModal from '../../../components/GlobalModal';
import IPagination from '../../../components/iPagination/iPagination';
import styles from '../index.less';
import { recordConfigData } from './config';
import SearchLine from './searchLine';

const RemunerationData = ({ dispatch, remuneration }) => {
    const [modalShow, setModalShow] = useState(false);

    const [selectRowKey, setSelectRowKey] = useState([]);
    const [selectSyncKeys, setSelectSyncKeys] = useState([]);
    const [selectRows, setSelectRows] = useState([]); // 选中行的all data
    // 支付状态
    const [payStatus, setPayStatus] = useState({});
    const {
        list,
        currentHeight,
        currentPage,
        returnCount,
        limit,
        start,
        selectList,
        dataList,
        paymentAmount,
        mainTableId,
        searchWord,
    } = remuneration;

    useEffect(() => {
        // limit有值再请求接口
        // getRemunerationList('', '', '', '', start, limit);
        getRemunerationNoPay();
    }, [currentPage, limit]);

    // 获取稿酬列表数据
    function getRemunerationList(mainTableId, searchWord, start = 1, limit) {
        dispatch({
            type: `remuneration/getRemunerationList`,
            payload: {
                start,
                limit,
                mainTableId,
                searchWord,
            },
        });
    }
    // 获取下拉框
    const getRemunerationNoPay = () => {
        dispatch({
            type: 'remuneration/getRemunerationNoPay',
            payload: {},
        });
    };
    //获取列表数据

    //复选框
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log('selectedRowKeys', selectedRowKeys);
            console.log('setSelectRows', selectedRows);
            setSelectRowKey(selectedRows);
            setSelectSyncKeys(selectedRowKeys);
            setSelectRows(selectedRows);
        },
    };

    //更改支付状态
    const onPay = (record) => {
        setModalShow(true);
        setPayStatus(record);
    };

    const tableProps = {
        rowKey: 'ID',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: 60,
            },
            {
                title: '是否支付',
                render: (record) => {
                    return (
                        <div>
                            {record.IS_THE_PAYMENT_SUCCESSFUL_TLDT_ == 1 ? (
                                <a>
                                    <span className={styles.regiter} onClick={() => onPay(record)}>
                                        支付成功
                                    </span>
                                </a>
                            ) : (
                                <a>
                                    <span className={styles.regiter} onClick={() => onPay(record)}>
                                        支付失败
                                    </span>
                                </a>
                            )}

                            {/* <a>
                <span onClick={() => onEdite(record)}>修改</span>
              </a> */}
                        </div>
                    );
                },
            },
            {
                title: '证件类型',
                dataIndex: 'TYPE_OF_CERTIFICATE_TLDT_',
                render(text) {
                    return <div>{recordConfigData.cardType[text]}</div>;
                },
            },
            {
                title: '证件号码',
                dataIndex: 'ID_NUMBER',
                width: 180,
            },
            {
                title: '姓名',
                dataIndex: 'COMPELLATION',
            },
            {
                title: '手机号',
                dataIndex: 'MOBILE_PHONE_NUMBER',
            },
            {
                title: '个税负担方式',
                dataIndex: 'INDIVIDUAL_TAX_TYPE_TLDT_',
                render(text) {
                    return <div>{recordConfigData.incomeTax[text]}</div>;
                },
            },
            {
                title: '税前金额',
                dataIndex: 'AMOUNT_BEFORE_TAX',
            },
            {
                title: '税额',
                dataIndex: 'TAX_AMOUNT',
            },
            {
                title: '税后金额',
                dataIndex: 'AMOUNT_AFTER_TAX',
            },
            {
                title: '卡号',
                dataIndex: 'CARD_NUM',
                width: 140,
            },
            {
                title: '开户行',
                dataIndex: 'DUE_BANK_NAME',
                width: 240,
            },
            {
                title: '开户行号',
                dataIndex: 'ACCOUNT_OPEN_BANK_NUM',
                width: 180,
            },
            {
                title: '经济分类',
                dataIndex: 'ECONOMIC_SUBJECT_NAME',
            },
            {
                title: '往来',
                dataIndex: 'TRANSACTION_ACCOUNTING_NAME',
            },
        ],
        dataSource:
            list &&
            list.length > 0 &&
            list.map((item, index) => {
                item.number = index + 1;
                return item;
            }),
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };
    const changePage = (nextPage, size) => {
        getRemunerationList(mainTableId, searchWord, nextPage, size);
    };
    // 支付关闭
    const onCancelPay = () => {
        setModalShow(false);
        dispatch({
            type: 'remuneration/payment',
            payload: {
                id: payStatus.ID,
                status: 0,
            },
            callback(data) {
                if (data.code == 200) {
                    message.success('修改成功');
                } else {
                    message.error('修改失败');
                }
                getRemunerationList(payStatus.MAIN_TABLE_ID, searchWord, currentPage, limit);
            },
        });
    };
    // 确定支付
    const confirmPay = () => {
        setModalShow(false);
        dispatch({
            type: 'remuneration/payment',
            payload: {
                id: payStatus.ID,
                status: 1,
            },
            callback(data) {
                if (data.code == 200) {
                    message.success('修改成功');
                } else {
                    message.error('修改失败');
                }
                getRemunerationList(payStatus.MAIN_TABLE_ID, searchWord, currentPage, limit);
            },
        });
    };
    return (
        <div className="common_container" id="dom_container_cma">
            <div>
                <SearchLine selectList={selectList} dataList={list} paymentAmount={paymentAmount}></SearchLine>
            </div>
            <div className="_margin_top_5">
                <ColumnDragTable
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    taskType="MONITOR"
                    tableLayout="fixed"
                    modulesName="remuneration"
                    {...tableProps}
                    scroll={{
                        y: list.length > 0 ? currentHeight : 200,
                    }}
                ></ColumnDragTable>
            </div>

            <IPagination
                current={Number(currentPage)}
                total={Number(returnCount)}
                onChange={changePage}
                pageSize={Number(limit)}
                isRefresh={true}
                refreshDataFn={() => {
                    getRemunerationList(mainTableId, searchWord, currentPage, limit);
                }}
            />
            {modalShow && (
                <GlobalModal
                    title="信息"
                    open={true}
                    onCancel={() => setModalShow(false)}
                    footer={
                        <div>
                            <Button onClick={onCancelPay} className={styles.pay_fail}>
                                支付失败
                            </Button>
                            <Button onClick={confirmPay} className={styles.pay_success}>
                                支付成功
                            </Button>
                        </div>
                    }
                    getContainer={() => {
                        return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                    }}
                    maskClosable={false}
                    mask={false}
                    modalSize="small"
                >
                    <div className={styles.content_top}>
                        <div>请确认一下信息支付状态:</div>
                        <div className={styles.content_top}>
                            <span>姓名：</span>
                            <span>{payStatus.COMPELLATION}</span>
                        </div>
                        <div>
                            <span>证件号：</span>
                            <span>{payStatus.ID_NUMBER}</span>
                        </div>
                        <div>
                            <span>卡号：</span>
                            <span>{payStatus.CARD_NUM}</span>
                        </div>
                        <div>
                            <span>支付金额：</span>
                            <span>{payStatus.AMOUNT_AFTER_TAX}</span>
                        </div>
                    </div>
                </GlobalModal>
            )}
        </div>
    );
};

export default connect(({ remuneration, layoutG }) => ({
    remuneration,
    layoutG,
}))(RemunerationData);
