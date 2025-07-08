import { Button, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'umi';
import ColumnDragTable from '../../../components/columnDragTable';
import GlobalModal from '../../../components/GlobalModal';
import IPagination from '../../../components/iPagination/iPagination';
import search_img from '../../../public/assets/search_black.svg';
import styles from '../index.less';
function Index({ dispatch, medicalfee, reimburseIdList }) {
    const {
        currentHeight,
        juisdictionControlList,
        controlLimit,
        controlCurrentPage,
        controlAllPage,
        controlSearchWord,
        controlReturnCount,
        reimbursementCard,
        currentReimburseNo,
    } = medicalfee;
    const [selectRowKey, setSelectRowKey] = useState({}); // 选中行的主键ID集合 arr
    const [selectRows, setSelectRows] = useState([]); // 选中行的all data

    // useEffect(() => {
    //   getJuisdictionControlList(
    //     controlCurrentPage,
    //     controlLimit,
    //     controlSearchWord,
    //   );
    // }, [controlLimit]);
    useEffect(() => {
        dispatch({
            type: 'medicalfee/getReimbursementCard',
            payload: {},
        });
    }, []);

    const getJuisdictionControlList = (start, limit, searchWord, projectCode, isProjectFilter) => {
        if (reimbursementCard?.bizSolId && reimbursementCard?.usedYear) {
            dispatch({
                type: 'medicalfee/getJuisdictionControlList',
                payload: {
                    bizSolId: reimbursementCard?.bizSolId,
                    usedYear: reimbursementCard?.usedYear,
                    searchWord,
                    projectCode,
                    isProjectFilter,
                    start,
                    limit,
                    searchType: 2,
                },
            });
        }
    };

    const handelCanel = () => {
        dispatch({
            type: 'medicalfee/updateStates',
            payload: {
                accountCardModal: false,
            },
        });
    };
    const onOk = () => {
        if (selectRowKey?.length != 1) {
            message.info('请选择一条单据信息');
            return;
        }
        //保存报账卡号
        dispatch({
            type: 'medicalfee/updateReimbursementCard',
            payload: JSON.stringify({
                reimburseIdList,
                normId: selectRows[0]?.NORM_ID,
                reimbursementCardNo: selectRows[0]?.REIMB_CARD_NUM,
            }),
            callback: () => {
                dispatch({
                    type: 'medicalfee/updateStates',
                    payload: {
                        accountCardModal: false,
                    },
                });
            },
        });
    };

    const tableProps = {
        rowKey: 'ID',
        columns: [
            {
                title: '报账卡号',
                dataIndex: 'REIMB_CARD_NUM',
            },
            {
                title: '核算项目名称',
                dataIndex: 'PROJECT_NAME',
            },
            {
                title: '政府经济分类',
                dataIndex: 'GOV_ECONOMIC_CLASS',
            },
            {
                title: '部门经济分类',
                dataIndex: 'ECONOMIC_SUBJECT_NAME ',
                fixed: 'right',
            },
        ],
        dataSource: juisdictionControlList,
        pagination: false,
        bordered: true,
    };

    // 分页改变
    const changePage = (nextPage, size) => {
        dispatch({
            type: `medicalfee/updateStates`,
            payload: {
                controlCurrentPage: nextPage,
                controlLimit: size,
            },
        });
        getJuisdictionControlList(nextPage, size, controlSearchWord);
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
                controlSearchWord: value,
            },
        });
        getJuisdictionControlList(controlCurrentPage, controlLimit, value);
    };
    const onValueChange = (e) => {
        dispatch({
            type: `medicalfee/updateStates`,
            payload: {
                controlSearchWord: e.target.value,
            },
        });
    };

    return (
        <GlobalModal
            open={true}
            title={'信息'}
            onCancel={handelCanel}
            maskClosable={false}
            mask={false}
            centered
            modalSize="middle"
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            footer={[
                <Button key="cancel" onClick={handelCanel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={onOk}>
                    保存
                </Button>,
            ]}
        >
            <Input.Search
                className={styles.header_search_card}
                placeholder="请输入查询项"
                value={controlSearchWord}
                onSearch={onSearch}
                onChange={onValueChange}
                enterButton={<img src={search_img} style={{ marginRight: 8, marginTop: -3, marginLeft: 4 }} />}
                allowClear
            />
            <div className={styles.tablelist}>
                <ColumnDragTable
                    {...tableProps}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    taskType="MONITOR"
                    tableLayout="fixed"
                    className={styles.table}
                    modulesName="medicalfee"
                    scroll={
                        juisdictionControlList?.length
                            ? {
                                  y: 240,
                                  x: 'auto',
                              }
                            : {}
                    }
                />
                {/* 分页 */}
                <IPagination
                    current={Number(controlCurrentPage)}
                    total={controlReturnCount || 1}
                    onChange={changePage}
                    pageSize={controlLimit}
                    isRefresh={true}
                    refreshDataFn={() => {
                        getJuisdictionControlList(controlCurrentPage, controlLimit, controlSearchWord);
                    }}
                />
            </div>
        </GlobalModal>
    );
}
export default connect(({ medicalfee }) => {
    return { medicalfee };
})(Index);
