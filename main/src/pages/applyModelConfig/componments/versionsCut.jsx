import React, { useState,useRef,useEffect } from 'react';
import { connect } from 'dva';
import {Space,Button,Table,Checkbox,Radio,Modal,Row,Tree,Spin} from 'antd';
import styles from '../index.less';
import { history } from 'umi';
import { ApartmentOutlined,AppstoreOutlined,BankOutlined,UserOutlined} from '@ant-design/icons';
import { parse } from 'query-string';
import GlobalModal from '../../../componments/GlobalModal';
function VersionsCut ({query,dispatch,loading,layoutG,applyModelConfig,onCancel,setParentState,parentState}){
    const {bizSolId} = query;
    const {historyList,procDefId}=parentState
    const [versionsCutId, setVersionsCutId] = useState(procDefId);

    //初始
    useEffect(() => {


    },[]);




    function submitClick(){
        dispatch({
            type:"applyModelConfig/getProcessNewDiagram",
            payload:{
                procDefId:versionsCutId
            },
            callback:function(){
              setParentState({
                procDefId:versionsCutId,
                versionsCutModal:false,
                saveBussionFromInfoOnOff:true
              })
            },
            extraParams:{
              setState:setParentState,
              state:parentState
            }
        })
    }
    function onChange(e){
        setVersionsCutId(e.target.value)
    }
    function onCancel(){
      setParentState({
        versionsCutModal:false
      })
    }
    return (
        <GlobalModal
            visible={true}
            widthType={1}
            title='版本切换'
            bodyStyle={{padding: '0 10px'}}
            onCancel={onCancel}
            incomingHeight={300}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById(`form_modal_${bizSolId}`)||false
            }}
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
                    // options={historyList}
                    onChange={onChange}
                    value={versionsCutId}
                // optionType="button"
                >
                    <Space direction="vertical">
                        {
                            historyList.map((item,index)=> <Radio value={item.id} key={index}>{decodeURI(item.name)}-版本({item.version}){item.mainVersion&&<span className={styles.mainVersion}> 主版本</span>}</Radio>)
                        }
                    </Space>
                </Radio.Group>
            </div>
        </GlobalModal>

    )
}
export default connect(({applyModelConfig,layoutG,loading})=>({
    applyModelConfig,
    layoutG,
    loading
  }))(VersionsCut);

