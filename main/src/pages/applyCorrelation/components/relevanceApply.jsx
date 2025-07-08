import React ,{useEffect}from 'react'
import { connect } from 'dva'
import { Modal, Button, Spin, Table } from 'antd'
import ITree from '../../../componments/public/iTree';
import IPagination from '../../../componments/public/iPagination';
import GlobalModal from '../../../componments/GlobalModal'
import styles from '../index.less'
function relevanceApply({ dispatch, applyCorrelation, }) {
    const { ctlgTree, ctlgId, businessList, applyLimit, applyCurrentPage, applyReturnCount, selectBusiness, selectBusinessRows, detailData} = applyCorrelation
    console.log(businessList, 'businessList');
    const onCancel = () => {
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                isApply: false,
                selectBusinessRows:detailData.logicId?[detailData]:[],
                ctlgId:'',
                businessList:[]
            }
        })
    }
    const onOk=()=>{
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                isApply: false,
                selectBusinessRows,
                ctlgId:'',
                businessList:[]
            }
        })
    }
    function selectCtlgFn(key, e) {
        // setSelectCtlgId(key)
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                ctlgId: key[0]
            }
        })
        getBusinessList(key[0], '', 1, applyLimit)
    }
    function getBusinessList(ctlgId, searchWord, start, limit) {
        dispatch({
            type: 'applyCorrelation/getBusinessList',
            payload: {
                ctlgId,
                searchWord,
                start,
                limit
            }
        })
    }
    const tableProps = {
        rowKey: 'bizSolId',
        scroll: { y: `calc(100% - 85px)`  },
        size: 'small',
        columns: [
            {
                title: '业务应用建模名称',
                dataIndex: 'bizSolName',
                key: 'bizSolName',
            },
            {
                title: '标识',
                dataIndex: 'bizSolCode',
                key: 'bizSolCode',
            },
            {
                title: '有无流程',
                dataIndex: 'bpmFlag',
                key: 'bpmFlag',
                render: (text) => <div>{text ? '有' : '无'}</div>
            }
        ],
        dataSource: businessList,
        pagination: false,
        rowSelection: {
            type: 'radio',
            selectedRowKeys: selectBusiness,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log('selectedRowKeys', selectedRowKeys);
                console.log(selectedRows,'selectedRows');
                dispatch({
                    type: 'applyCorrelation/updateStates',
                    payload: {
                        selectBusiness: selectedRowKeys,
                        selectBusinessRows: selectedRows,
                    }
                })
            },
        },
    }
    const changePage = (page, size) => {
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                applyCurrentPage: page,
                applyLimit: size
            }
        })
        getBusinessList(ctlgId, '', page, size)
    }
    return (
        <div>
            <GlobalModal
                title='关联业务应用建模'
                // width={800}
                widthType={1}
                incomingWidth={800}
                incomingHeight={500}
                visible={true}
                onCancel={onCancel}
                getContainer={() => {
                    return document.getElementById('applyCorrelation_container')||false
                }}
                mask={false}
                maskClosable={false}
                centered
                bodyStyle={{overflow: 'hidden',padding:'0'}}
                className={styles.relation_modal}
                footer={[
                    <Button key="cancel" onClick={onCancel}>取消</Button>,
                    <Button type="primary" key="submit" onClick={onOk}>确定</Button>
                ]}
            >
                <div style={{ display: 'flex',height:'100%' }}>
                    <div style={{ width: '30%', borderRight: '1px solid #ccc' }} className={styles.scrollbarStyle}>
                        <ITree
                            treeData={ctlgTree}
                            onSelect={selectCtlgFn}
                            selectedKeys={ctlgId}
                            isSearch={false}
                            defaultExpandAll={true}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ width: '70%', padding: '10px' ,position:'relative'}} className={styles.scrollbarStyle}>
                        <Table {...tableProps} />
                       { businessList.length>0&&<IPagination
                            current={Number(applyCurrentPage)}
                            pageSize={applyLimit}
                            onChange={changePage.bind(this)}
                            total={Number(applyReturnCount)}
                            style={{ position:'absolute',bottom:8}}
                        />}
                    </div>

                </div>

            </GlobalModal>
        </div>
    )
}
export default connect(({ applyCorrelation }) => ({ applyCorrelation }))(relevanceApply)
