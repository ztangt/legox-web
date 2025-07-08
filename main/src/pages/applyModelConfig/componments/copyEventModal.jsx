import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight'
import IPagination from '../../../componments/public/iPagination'
import GlobalModal from '../../../componments/GlobalModal'
import { Modal, Radio, Space, Input, message, Row, Checkbox } from 'antd'
import Table from '../../../componments/columnDragTable';
import styles from './configReplication.less'
function CopyEventModal({ dispatch, query, parentState, setParentState }) {
    const { bizSolId } = query;
    const { mainFormCurrent, mainFormReturnCount, bizFromInfo, formList, bizSolInfo, bizEventList, copyEventList } = parentState
    const [limit, setLimit] = useState(10);
    const [searchWord, setSearchWord] = useState('')
    const [rowRecord, setRowRecord] = useState({});
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    useEffect(() => {
        getFromList('', 10, 1)
    }, [])
    const getFromList = (searchWord, limit, start) => {
        dispatch({
            type: 'applyModelConfig/getBizSolVersionList',
            payload: {
                bizSolId: bizSolInfo.bizSolId,
                formDeployId: bizFromInfo.formDeployId,
                searchWord,
                limit,
                start
            },
            extraParams: {
                setState: setParentState,
                state: parentState
            }
        })
    }
    const onCancel = () => {
        setParentState({
            isShowCopyEvent: false,
            copyEventList: []
        })
    }
    const onOk = () => {

        const res = copyEventList.filter(item => checkedList.includes(item.key))
        const updatedList = res.map(item => {
            return { ...item, sort: 999 };
        });
        setParentState({
            bizEventList: [...bizEventList, ...updatedList],
        })
        onCancel()
        }
    const onSearchTable = (value) => {
        setSearchWord(value)
        getFromList(value, limit, mainFormCurrent)
    }
    //分页
    const changePage = (nextpage, size) => {
        setLimit(size)
        getFromList(searchWord, size, nextpage)
        // setParentState({
        //     mainFormCurrent: nextpage,
        //     taskActs: []
        // })
    }
    const getNodes = (record) => {
        return {
            onClick: () => {
                setRowRecord(record)
                dispatch({
                    type: 'applyModelConfig/getBizSolEvent',
                    payload: {
                        procDefId: record.procDefId,
                        formDeployId: record.formDeployId,
                        bizSolId: record.bizSolId,
                        bindSubject: false
                    },
                    extraParams: {
                        setState: setParentState,
                        state: parentState
                    },
                });
                setCheckAll(false)
            }
        }
    }
    const setRowClassName = (record, index) => {
        let className = '';
        if (record.bizSolId === rowRecord.bizSolId) {
            className = index % 2 === 0 ? 'oddRow clickRowsStyle' : 'evenRow clickRowsStyle';
        } else {
            className = index % 2 === 0 ? 'oddRow' : 'evenRow';
        }
        return className;
    };
    const changeCheckBox = (list) => {
        console.log(list, 'list');
        setCheckedList(list)
        setIndeterminate(!!list.length && list.length < copyEventList.length);
        setCheckAll(list.length === copyEventList.length);
    }
    const onCheckAllChange = e => {
        let ids = copyEventList.map((item) => {
            return item.key;
        })
        setCheckedList(e.target.checked ? ids : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };
    const tableProps = {
        rowKey: 'bizSolId',
        columns: [
            {
                title: '序号',
                render: (text, record, index) => <span>{index + 1}</span>
            },
            {
                title: '名称',
                dataIndex: 'bizSolName',
            },
            {
                title: '标识',
                dataIndex: 'bizSolCode',
            },
        ],
        dataSource: formList,
        pagination: false,
        scroll: { y: 'calc(100% - 40px)' }
    }
    const leftRender = () => {
        return <div className={styles.leftContent}>
            <div className={styles.search}>
                <Input.Search placeholder='请输入名称' allowClear onSearch={value => {
                    onSearchTable(value);
                }} />
            </div>
            <div className={styles.leftTable}>
                <Table
                    {...tableProps}
                    onRow={getNodes}
                    scroll={{ y: 'calc(100% - 40px)' }}
                    rowClassName={setRowClassName}
                />
            </div>
            <div className={styles.leftPagination}>
                <IPagination
                    current={mainFormCurrent}
                    total={mainFormReturnCount}
                    onChange={changePage}
                    pageSize={limit}
                    style={{ borderTop: '1px solid rgb(235, 235, 235)', height: '38px', right: '0px', bottom: '0px', width: '100%', background: '#fff', paddingRight: "8px" }}
                />
            </div>
        </div>
    }
    const rightRender = () => {
        return <div style={{ paddingLeft: 8 }}>
            {copyEventList.length ? <>
                <Checkbox style={{ marginBottom: 8 }} indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                    全选
                </Checkbox>
                <Checkbox.Group style={{ width: '100%' }} value={checkedList} onChange={changeCheckBox.bind(this)}>
                    {copyEventList.map((item) => {
                        return (
                            <Row key={item.key} style={{ marginBottom: 8 }}>
                                <Checkbox value={item.key}>{item.eventName}</Checkbox>
                            </Row>
                        )
                    })}
                </Checkbox.Group>
            </> : ''}

        </div>
    }
    return (
        <div>
            <GlobalModal
                visible={true}
                onCancel={onCancel}
                onOk={onOk}
                title='同步事件'
                widthType={2}
                getContainer={() => {
                    return document.getElementById(`code_modal_${bizSolId}`) || false
                }}
                mask={false}
                maskClosable={false}
                bodyStyle={{ padding: 0 }}
                className={styles.configStep}
            >
                <ReSizeLeftRight
                    height={'inherit'}
                    leftChildren={leftRender()}
                    rightChildren={rightRender()}
                    vLeftNumLimit={500}
                    vRigthNumLimit={100}
                    vNum={600}
                    suffix={`copyEventModal${bizSolId}`}
                />
            </GlobalModal>
        </div>
    )
}

export default connect(({ applyModelConfig }) => ({ applyModelConfig }))(CopyEventModal)
