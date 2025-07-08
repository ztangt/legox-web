import React, { useState } from 'react';
import { connect } from 'dva';
import { Space, Button, Radio, Modal, message } from 'antd';
import styles from '../index.less';
import { parse } from 'query-string';
import { history } from 'umi'
// 业务方案版本配置同步模态框组件
function SyncVersionCfg({ query, dispatch, loading, parentState,setParentState }) {
    const bizSolId = query.bizSolId;
    const { syncVersionCfgData, bizFromInfo } = parentState;
    const [selectId, setSelectId] = useState(null);

    // 同步配置
    function submitClick() {
        if(!selectId) {
            return message.error("请选择版本进行同步");
        }
        dispatch({
            type: "applyModelConfig/syncVersionCfg",
            payload: {
                bizSolId: bizSolId,
                procDefId: bizFromInfo.procDefId,
                formDeployId: bizFromInfo.formDeployId,
                sourceProcDefId: selectId,
            },
            callback: function () {
                // 重新加载版本配置
                dispatch({
                    type: 'applyModelConfig/getBizSolFormConfigProDef',
                    payload: {
                        bizSolId: bizSolId,
                        procDefId: bizFromInfo.procDefId,
                        formDeployId: bizFromInfo.formDeployId
                    },
                    extraParams:{
                        setState:setParentState,
                        state:parentState
                    }
                });
                // 重新加载全局按钮权限配置
                dispatch({
                    type:"applyModelConfig/getButtonAuth",
                    payload:{
                      bizSolId,
                      procDefId: bizFromInfo.procDefId,
                      actId:'0',
                      buttonGroupId:bizFromInfo.buttonGroupId,
                      isRefresh:0,
                      deployFormId:bizFromInfo.formDeployId
                    },
                    callback:(data)=>{
                        setParentState({
                            ...data
                        })
                    }
                  })
                onCancel();
            }
        })
    }

    // 关闭弹窗
    function onCancel() {
        setParentState({
            syncVersionCfgData: {
                showModal: false,
                list: []
            }
        })
    }

    function onChange(e) {
        setSelectId(e.target.value)
    }

    return (
        <Modal
            visible={true}
            width={600}
            title='同步版本配置'
            bodyStyle={{ height: '350px', padding: '0 10px', margin: '10px 0' }}
            onCancel={onCancel}
            mask={false}
            maskClosable={false}
            getContainer={() => {
                return document.getElementById(`form_modal_${bizSolId}`) || false
            }}
            centered
            footer={[
                <Button onClick={onCancel}>
                    取消
                </Button>,
                <Button loading={loading.global} type="primary" onClick={submitClick}>
                    保存
                </Button>
            ]}
        >
            <div className={styles.versionsCutStyle} >
                <Radio.Group
                    onChange={onChange}
                    value={selectId}>
                    <Space direction="vertical">
                        {
                            syncVersionCfgData.list.map((item, index) => <Radio value={item.procDefId} key={index}>版本({item.version})</Radio>)
                        }
                    </Space>
                </Radio.Group>
            </div>
        </Modal>

    )
}
export default connect(({ applyModelConfig, layoutG, loading }) => ({
    applyModelConfig,
    layoutG,
    loading
}))(SyncVersionCfg);

