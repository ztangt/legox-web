import { Button, Input, message, Modal, Spin } from 'antd';
import { connect } from 'dva';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import search_img from '../../../public/assets/search_black.svg';
import { BASE_WIDTH, ORDER_WIDTH } from '../../../util/constant';
import styles from '../index.less';
import AccountCardModal from './accountCardModal';
import EditModal from './medicalfeeModal';

const Index = ({ dispatch, medicalfee }) => {
    const [selectRowKey, setSelectRowKey] = useState({}); // 选中行的主键ID集合 arr
    const [selectRows, setSelectRows] = useState([]); // 选中行的all data
    const [loading, setLoading] = useState(false);

    const [height, setHeight] = useState(document.getElementById('dom_container')?.offsetHeight - 230);
    const {
        currentHeight,
        currentPage,
        limit,
        returnCount,
        medicalRegistrationList,
        editMedicalFreeModal,
        searchWord,
        accountCardModal,
    } = medicalfee;

    const { baseIframeModalComponmentsCma: baseIframeModalComponments } = useModel('@@qiankunStateFromMaster'); //不可删除，是为了按钮调用父应用的弹窗

    useEffect(() => {
        limit && limit > 0 && getMedicalRegistrationList(currentPage, limit, searchWord);
    }, [currentPage, limit]);
    const onResize = useCallback(() => {
        setHeight(document.getElementById('dom_container')?.offsetHeight - 230);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    // 获取医药费报销登记-报销-列表
    function getMedicalRegistrationList(currentPage, limit, searchWord) {
        dispatch({
            type: `medicalfee/getMedicalRegistrationList`,
            payload: {
                start: currentPage,
                limit,
                searchWord,
                approvalStatus: 10,
            },
        });
    }

    const tableProps = {
        rowKey: 'id',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: ORDER_WIDTH,
                fixed: 'left',
            },
            {
                title: '单据编号',
                dataIndex: 'reimburseNo',
                width: ORDER_WIDTH * 3,
            },
            {
                title: '医疗编号',
                dataIndex: 'medicalNo',
                width: BASE_WIDTH,
            },
            {
                title: '姓名',
                dataIndex: 'personName',
                width: BASE_WIDTH,
            },
            {
                title: '人员状态',
                dataIndex: 'cmaPersonnelStatusObjName',
                width: BASE_WIDTH,
            },
            {
                title: '单位',
                dataIndex: 'cmaEmployeeOrgObjName',
                width: BASE_WIDTH,
            },
            {
                title: '人员类型',
                dataIndex: 'cmaPersonnelMoldObjName',
                width: BASE_WIDTH,
            },
            {
                title: '附件张数',
                dataIndex: 'annexCount',
                width: BASE_WIDTH,
            },
            {
                title: '就诊金额',
                dataIndex: 'reimbursableAmount',
                width: BASE_WIDTH,
            },
            {
                title: '医事服务费',
                dataIndex: 'medicalServiceFee',
                width: BASE_WIDTH,
            },
            {
                title: '实报金额',
                dataIndex: 'reimburseAmount',
                width: BASE_WIDTH,
            },
            {
                title: '支付方式',
                dataIndex: 'cmaPaymentMethodWayName',
                width: BASE_WIDTH,
            },
            {
                title: '审核会计',
                dataIndex: 'approvalUserName',
                width: BASE_WIDTH,
            },
            {
                title: '报账卡号',
                dataIndex: 'reimbursementCardNo',
                width: BASE_WIDTH,
                fixed: 'right',
                // render: (text, record) => (
                //   <a
                //     onClick={(e) => {
                //       e.stopPropagation();
                //       console.log('money');
                //     }}
                //   >
                //     {formattingMoney(text)}
                //   </a>
                // ),
            },
        ],
        // 数据源
        dataSource:
            medicalRegistrationList &&
            medicalRegistrationList.length > 0 &&
            medicalRegistrationList.map((item, index) => {
                item.number = index + 1;
                return item;
            }),
        pagination: false,
        // 边框
        // bordered: true,
        onRow: (record) => {
            return {
                onClick: (event) => {
                    onEdit(record?.reimburseNo);
                }, // 点击行
                onDoubleClick: (event) => {},
                onContextMenu: (event) => {},
                onMouseEnter: (event) => {}, // 鼠标移入行
                onMouseLeave: (event) => {},
            };
        },
    };
    // 分页改变
    const changePage = (nextPage, size) => {
        dispatch({
            type: `medicalfee/updateStates`,
            payload: {
                currentPage: nextPage,
                limit: size,
            },
        });
        getMedicalRegistrationList(nextPage, size, searchWord);
    };

    const rowSelection = {
        // 选择框勾选 ☑️
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectRows(selectedRows);
            setSelectRowKey(selectedRowKeys);
        },
    };

    const onSearch = (value) => {
        dispatch({
            type: `medicalfee/updateStates`,
            payload: {
                searchWord: value,
            },
        });
        getMedicalRegistrationList(currentPage, limit, value);
    };
    //打印
    const onPrint = () => {
        // dispatch({
        //     type: `medicalfee/printMedicalRegistration`,
        //     payload: JSON.stringify({
        //         approvalFlg: 1,
        //     }),
        // });

        debugger;
        // 定义打印页面
        var jmreportURl = '/jimu?to=%2Fjmreport%2Fview%2F858238095363100672';
        baseIframeModalComponments({
            title: '提示',
            width: 1000,
            height: 900,
            url: jmreportURl,
            renderFooterList: [
                {
                    label: '取消',
                    key: 'cancel',
                    btnProps: {},
                    onClick: () => {},
                },
            ],
        });
    };
    //导出
    const onExport = () => {
        // dispatch({
        //     type: `medicalfee/exportMedicalRegistration`,
        //     payload: JSON.stringify({
        //         approvalFlg: 1,
        //     }),
        // });

        debugger;
        let obj = {};
        obj.excelConfigId = '858238095363100672';
        fetch(`${window.location.origin}/jmreport/exportAllExcel`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(obj),
        }).then((response) => {
            response.json().then((returnData) => {
                if (returnData.success) {
                    //获取base64文件
                    let file = returnData.result.file;
                    let bstr = atob(file),
                        n = bstr.length,
                        u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    let blob = new Blob([u8arr], {
                        type: 'application/vnd.ms-excel',
                    });
                    //创建url
                    let fileURL = URL.createObjectURL(blob);
                    window.open(fileURL);
                }
            });
        });
    };
    //审核

    const handleAudit = async (ids, index = 0, errList) => {
        if (index == 0) {
            setLoading(true);
        }
        if (index < ids.length) {
            let id = ids[index];
            console.log(id, 2222);
            dispatch({
                type: `medicalfee/approvaleMedicalRegistrationFn`,
                payload: { id },
                callback: (data) => {
                    if (data.code !== 200) {
                        //保留错误信息
                        let msg = data.code == 'COMMON__PUSH_NCC_500' ? `${id}-推送NCC失败` : `${id}-${data.msg}`;
                        errList.push(msg);
                    }
                    //最后一个
                    if (index == ids.length - 1) {
                        setLoading(false);
                        if (errList.length > 0) {
                            message.error(errList.join(';'));
                            console.log(errList.join(';'));
                        } else {
                            message.success('审核成功');
                        }
                        getMedicalRegistrationList(currentPage, limit, searchWord);
                    }
                    // 递归调用，处理下一个id
                    handleAudit(ids, index + 1, errList);
                },
            });
        }
    };
    const onCheck = () => {
        // if (selectRowKey?.length != 1) {
        //     message.info('请选择一条单据信息');
        //     return;
        // }
        dispatch({
            type: `medicalfee/updateStates`,
            payload: {
                currentReimburseNo: selectRows?.[0]?.reimburseNo,
            },
        });
        handleAudit(selectRowKey, 0, []);

        // var dealList = selectRowKey.map(async (id) => {
        //     // return await fetch(
        //     //     `${window.localStorage.getItem('env')}/cma-app/medicalfee/medicalRegistration/approval`,
        //     //     {
        //     //         method: 'put',
        //     //         headers: {
        //     //             Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
        //     //         },
        //     //         body: JSON.stringify({ id }),
        //     //     },
        //     // );
        //     return dispatch({
        //         type: `medicalfee/approvaleMedicalRegistrationFn`,
        //         payload: {
        //             id,
        //         },
        //     });
        //     // return dispatch({
        //     //     type: `medicalfee/approvaleMedicalRegistration`,
        //     //     payload: {
        //     //         id,
        //     //     },
        //     // });
        // });
        //
        // Promise.all(dealList).then((res) => {
        //     console.log(res,11111111)
        //
        //     debugger;
        //     let errorStr = '';
        //     for (let i = 0; i < res.length; i++) {
        //         if (res[i]) {
        //             errorStr += res[i] + ';';
        //         }
        //     }
        //     if (errorStr) {
        //         message.error(errorStr);
        //     }
        //     getMedicalRegistrationList(currentPage, limit, searchWord);
        // });

        // // 审核的接口
        // dispatch({
        //     type: `medicalfee/approvaleMedicalRegistration`,
        //     payload: {
        //         id: selectRowKey.toString(),
        //     },
        // });
    };

    //删除
    const onDelete = () => {
        Modal.confirm({
            title: '提示',
            content: `是否确认删除该单据`,
            okText: '确定',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            onOk: () => {
                dispatch({
                    type: `medicalfee/deleteMedicalRegistration`,
                    payload: {
                        ids: selectRowKey.toString(),
                    },
                });
            },
        });
    };
    //编辑
    const onEdit = (reimburseNo) => {
        dispatch({
            type: `medicalfee/updateStates`,
            payload: {
                editMedicalFreeModal: true,
                currentReimburseNo: reimburseNo,
            },
        });
    };
    //报账卡号选择
    const onChoiceCard = () => {
        // if (selectRowKey?.length!=1) {
        //   message.info('请选择一条单据信息')
        //   return
        // }
        dispatch({
            type: `medicalfee/updateStates`,
            payload: {
                accountCardModal: true,
            },
        });
    };
    const onValueChange = (e) => {
        dispatch({
            type: `medicalfee/updateStates`,
            payload: {
                searchWord: e.target.value,
            },
        });
    };
    return (
        <Spin spinning={loading}>
            <div className={styles.dom_container} id="dom_container_cma">
                {accountCardModal && <AccountCardModal reimburseIdList={selectRowKey} />}
                {editMedicalFreeModal && <EditModal />}
                {/* 查询项 */}
                <div id="list_head_cma">
                    <div className={styles.list_header}>
                        <Button onClick={onEdit.bind(this, '')} type="primary">
                            新增
                        </Button>
                        <Button onClick={onCheck.bind(this)} type="primary">
                            审核
                        </Button>
                        <Button onClick={onDelete.bind(this)} type="primary">
                            删除
                        </Button>
                        <Button onClick={onExport.bind(this)} type="primary">
                            导出
                        </Button>
                        <Button onClick={onPrint.bind(this)} type="primary">
                            打印
                        </Button>
                        <Input.Search
                            className={styles.header_search}
                            placeholder="输入姓名、医疗编号、身份证号、单据编号或单位名称"
                            value={searchWord}
                            onSearch={onSearch}
                            onChange={onValueChange}
                            enterButton={
                                <img src={search_img} style={{ marginRight: 8, marginTop: -3, marginLeft: 4 }} />
                            }
                            allowClear
                        />
                    </div>
                    <h1 className={styles.header_title}>中国气象局机关药费报销明细</h1>
                    <div className={styles.card_choice}>
                        <span className={styles.place_text}>报账卡号选择:</span>
                        <Button onClick={onChoiceCard.bind(this)} type="primary">
                            选择
                        </Button>
                    </div>
                </div>

                {/* 列表*/}
                <div className={styles.tableList}>
                    <ColumnDragTable
                        {...tableProps}
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        taskType="medicalfee"
                        tableLayout="fixed"
                        className={styles.table}
                        modulesName="medicalfee"
                        scroll={
                            medicalRegistrationList.length > 0
                                ? {
                                      y: '360px',
                                      x: '1700px',
                                  }
                                : { x: 'auto' }
                        }
                    />
                </div>
                {/* 分页 */}
                <IPagination
                    current={Number(currentPage)}
                    total={Number(returnCount)}
                    onChange={changePage}
                    pageSize={Number(limit)}
                    isRefresh={true}
                    refreshDataFn={() => {
                        getMedicalRegistrationList(currentPage, limit);
                    }}
                />
            </div>
        </Spin>
    );
};
export default connect(({ medicalfee }) => ({
    medicalfee,
}))(Index);
