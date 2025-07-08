import React, { useEffect } from 'react'
import { connect } from 'dva'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import GlobalModal from '../../../componments/GlobalModal';
import styles from './elutionOrderModal.less'
import Table from '../../../componments/columnDragTable';
function elutionOrderModal({ dispatch, applyModelConfig, query,parentState,setParentState }) {
    const { actId, procDefId, nodeList } =parentState
    const {bizSolId} = query;
    const getGatewayOutFlows = () => {
        dispatch({
            type: 'applyModelConfig/getGatewayOutFlows',
            payload: {
                procDefId: procDefId,
                gatewayId: actId
            },
            extraParams:{
              setState:setParentState
            }
        })
    }
    useEffect(() => {
        getGatewayOutFlows()
    }, [])
    const handelCancle = () => {
      setParentState({
        isShowElution: false,
      })
    }
    const tableProps = {
        columns: [
            {
                title: '序号',
                dataIndex: 'num',
                render: (text, record, index) => <span>{index + 1}</span>
            },
            {
                title: '节点名称',
                dataIndex: 'targetElementName',
            },
            {
                title: '操作',
                dataIndex: 'sequenceFlowId',
                render: (text, record, index) => <div className={styles.action} ><span onClick={() => { moveUp(record) }}>{index != 0 && <ArrowUpOutlined />}</span><span onClick={() => { moveDown(record) }}>{index !== nodeList.length - 1 && <ArrowDownOutlined />}</span></div>
            }
        ],
        dataSource: nodeList,
        pagination: false
    }
    //上移
    const moveUp = (record) => {
        let i = nodeList.findIndex((v) => record === v);
        let i_ = i - 1;
        nodeList.splice(i, 1);
        nodeList.splice(i_, 0, record);
        console.log(nodeList, 'list');
        setParentState({
          nodeList: [...nodeList],
        })
    }
    //下移
    const moveDown = (record) => {
        let i = nodeList.findIndex((v) => record === v);
        let i_ = i + 1;
        nodeList.splice(i, 1);
        nodeList.splice(i_, 0, record);
        setParentState({
          nodeList: [...nodeList],
        })
    };
    const onOk = () => {
        dispatch({
            type: 'applyModelConfig/updateGatewayOutFlowsOrder',
            payload: {
                procDefId: procDefId,
                gatewayId: actId,
                sequenceFlowIds: nodeList.map((item => {
                    return item.sequenceFlowId
                })).join(',')
            },
            extraParams:{
              setState:setParentState,
              state:parentState
            }
        })
        handelCancle()
    }
    return (
        <GlobalModal
            title='流出节点顺序详情'
            visible={true}
            onCancel={handelCancle}
            onOk={onOk}
            widthType={1}
            maskClosable={false}
            mask={false}
            getContainer={() => {
                return document.getElementById(`code_modal_${bizSolId}`)||false
            }}
            bodyStyle={{padding:'0px'}}
        >
            <Table {...tableProps} />
        </GlobalModal>
    )
}
export default connect(({ applyModelConfig }) => ({ applyModelConfig }))(elutionOrderModal)
