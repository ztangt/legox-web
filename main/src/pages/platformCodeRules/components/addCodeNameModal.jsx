import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Modal, Form, Input, message, Button } from 'antd';
import { connect } from 'dva';
// import styles from './addCodeNameModal.less'
import GlobalModal from '../../../componments/GlobalModal';

function AddCodeNameModal({ dispatch, platformCodeRules, layoutG, nodeTreeName }) {
    const {
        pathname,
        isTreeOrTable,
        isAddOrModify,
        iscodeOrClassify,
        codeRuleId,
        nowSelectedRow,
        selectTreeNodeKeys,
        isRoot,
        treeSearchWord
    } = platformCodeRules;
    let selectTreeNode = (selectTreeNodeKeys && selectTreeNodeKeys.length > 0) ? selectTreeNodeKeys[0]: '';
    if(isRoot){
      selectTreeNode = '';
    }
    const [basicForm] = Form.useForm();
    const [res,setRes]=useState([])
    useEffect(() => {
        if (isAddOrModify == 'modify') {
            if (iscodeOrClassify == 'code') {
                basicForm.setFieldsValue({ codeName: nowSelectedRow.codeRuleName })
            } else {
                basicForm.setFieldsValue({ codeName: nodeTreeName })
            }
        }
    }, [1])

    const checkWOrd = (rule, value) => {
        var regx = /[^\w\u4E00-\u9FA5]/g
        if(value){
            if(regx.test(value)){
                return Promise.reject(new Error('请勿输入特殊字符'));
            }else{
                return Promise.resolve();
            }
            // let specialKey = "[`·~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
            // for (let i = 0; i < value.length; i++) {
            //     // if (specialKey.indexOf(value.substr(i, 1)) != -1) {
            //     //         return Promise.reject(new Error('请勿输入特殊字符'));

            //     // }else{
            //     //     return Promise.resolve();
            //     // }
            // }
        }else{
            return Promise.resolve();

        }

        // return false
    }

    const handleOk = () => {
        basicForm.validateFields().then(values=>{
            if (isAddOrModify == 'add') {
            dispatch({
                type: 'platformCodeRules/addCodeRule',
                payload: {
                    codeRuleName: basicForm.getFieldValue('codeName').trim(),
                    parentId: selectTreeNode,
                    type: isTreeOrTable,
                }
            })

            if(isTreeOrTable === 'GROUP') {
              // dispatch({
              //   type: 'platformCodeRules/updateStates',
              //   payload: {
              //     selectTreeNodeKeys: []
              //   }
              // });
            //   dispatch({
            //     type: 'platformCodeRules/selectNewChildId',
            //     payload: {
            //       nodeId: selectTreeNode,
            //     }
            //   })
            } else {
            //   dispatch({
            //     type: 'platformCodeRules/getCodeRuleInfo',
            //     payload: {
            //         codeRuleId: selectTreeNode,
            //         start: 1,
            //         limit: 10,
            //         codeName: ''
            //     }
            //   });
            }

        } else if (isAddOrModify == 'modify') {
            if (iscodeOrClassify == 'code') {
                dispatch({
                    type: 'platformCodeRules/updateCodeRule',
                    payload: {
                        codeRuleName: basicForm.getFieldValue('codeName').trim(),
                        codeRuleId: nowSelectedRow.codeRuleId,
                    },
                    callback:()=>{
                        dispatch({
                            type: 'platformCodeRules/getCodeRule',
                            callback:(data)=>{
                                if(treeSearchWord){
                                    const resultTree=searchTree(data,treeSearchWord)
                                    console.log(resultTree,'resultTree==');
                                    resultTree.forEach((item=>{
                                        item.children=[]
                                    }))
                                    dispatch({
                                        type:'platformCodeRules/updateStates',
                                        payload:{
                                            treeData:resultTree
                                        }
                                    })
                                    setRes([])
                                }
                            }
                        })
                    }
                })
            } else {
                dispatch({
                    type: 'platformCodeRules/updateCodeRule',
                    payload: {
                        codeRuleName: basicForm.getFieldValue('codeName').trim(),
                        codeRuleId: selectTreeNode,
                    },
                    callback:()=>{
                        dispatch({
                            type: 'platformCodeRules/getCodeRule',
                            callback:(data)=>{
                                if(treeSearchWord){
                                    const resultTree=searchTree(data,treeSearchWord)
                                    resultTree.forEach((item=>{
                                        item.children=[]
                                    }))
                                    dispatch({
                                        type:'platformCodeRules/updateStates',
                                        payload:{
                                            treeData:resultTree
                                        }
                                    })
                                    setRes([])
                                }
                            }
                        })
                    }
                })
            }
        }

        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                isShowAddModal: false,
                isRoot: false,
            }
        })
        }).catch((e)=>{
        }).finally(()=>{
        })

        // if (checkWOrd(basicForm.getFieldValue('codeName'))) {
        //     message.error('请勿输入特殊字符');
        //     return;
        // }

    }
    const searchTree = (data, searchWord) => {

        data.forEach((item, index) => {
            if (item.codeRuleName.includes(searchWord)) {
                res.push(item)
            }
            if (item.children) {
                searchTree(item.children, searchWord)
            }
        })

        return res
    }
    const handleCancel = () => {
        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                isShowAddModal: false,
                isRoot: false,
            }
        })
    }


    return (
        <GlobalModal
            title={iscodeOrClassify == 'code' ? isAddOrModify == 'add' ? '新增编码' : '修改编码' : isAddOrModify == 'add' ? '新增分类' : '修改分类'}
            visible={true}
            widthType={1}
            incomingWidth={500}
            incomingHeight={90}
            // onOk={handleOk}
            onCancel={handleCancel}
            // okText="确认"
            // cancelText="关闭"
            maskClosable={false}
            mask={false}
            okType={'submit'}
            centered
            getContainer={() => {
                return document.getElementById('platformCodeRules_container')||false
            }}
            footer={[
                <Button key="cancel"  onClick={handleCancel}>取消</Button>,
                <Button key="submit" onClick={handleOk}>保存</Button>  
            ]}
        >
            <Form
                form={basicForm}
            >
                <Form.Item
                    label={iscodeOrClassify == 'code' ? '编码名称' : '分类名称'}
                    name="codeName"
                    rules={[
                        { required: true, message: `请输入${iscodeOrClassify == 'code' ? '编码名称' : '分类名称'}` },
                        { max: 50, messgae: '最大输入50个字符'},
                        {validator: checkWOrd},
                        {whitespace: true,message: ''}
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </GlobalModal>
    )
}

export default connect(({ platformCodeRules, layoutG }) => ({
    platformCodeRules,
    layoutG,
}))(AddCodeNameModal);
