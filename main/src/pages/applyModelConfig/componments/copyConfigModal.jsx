import React, { useState } from 'react'
import { connect } from 'dva'
import { Modal, Button, Checkbox,message } from 'antd'
import styles from './copyConfigModal.less'
import GlobalModal from '../../../componments/GlobalModal'

function copyConfigModal({ dispatch, query, nodeModalActId,setParentState,parentState }) {
    const { bizSolId, bizSolName } = query;
    const { copyConfigData, actId, procDefId, bizFromInfo } = parentState
    console.log(copyConfigData, 'copyConfigData');
    const [checkoutValue, setCheckoutValue] = useState([])
    const onCancel = () => {
      setParentState({
        isShowCopyConfig: false
      })
    }
    const onOk = () => {
        if (checkoutValue.length) {
            dispatch({
                type: 'applyModelConfig/copyNodeConfig',
                payload: {
                    bizSolId,
                    procDefId,
                    formDeployId: bizFromInfo.formDeployId,
                    sourceActId: nodeModalActId,
                    targetActIds: checkoutValue.join(',')
                }
            })
            onCancel()
        }else{
            message.error('请选择节点')
        }

    }
    const changeValue = (value) => {
        setCheckoutValue(value)
    }
    return (
        <div>
            <GlobalModal
                visible={true}
                onCancel={onCancel}
                onOk={onOk}
                title='同步环节配置'
                widthType={1}
                getContainer={() => {
                    return document.getElementById(`code_modal_${bizSolId}`) || false
                }}
                mask={false}
                maskClosable={false}
                // bodyStyle={{ height: 380 }}
            >
                <div className={styles.copyConfig}>
                    <div>可同步环节</div>
                    <div>
                        <Checkbox.Group
                            onChange={(e) => { changeValue(e) }}
                            value={checkoutValue}
                            style={{ marginLeft: 22 }}
                        >{
                            copyConfigData.map((item, index) => {
                                    return <Checkbox value={item.id} key={item.id}>{item.name}</Checkbox>
                                })
                            }
                        </Checkbox.Group>
                    </div>
                </div>
            </GlobalModal>
        </div>
    )
}
export default connect(({ applyModelConfig }) => ({ applyModelConfig }))(copyConfigModal)
