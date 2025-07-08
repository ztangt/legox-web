import React, { useEffect ,useState} from 'react'
import { connect } from 'dva'
import { Modal, Button, Input, Form, Col, Row, message } from 'antd'
import ConfigTable from './configTable'
import styles from './configModal.less'
import GlobalModal from '../../../componments/GlobalModal';
function configModal({ dispatch, applyCorrelation }) {
    const layout = { labelCol: { span: 24 }, wrapperCol: { span: 24 } };
    const { lastKey, tableData, groupNum, configData, relationList, totalData,mainName } = applyCorrelation
    console.log(configData);
    console.log(mainName,'mainName==');
    console.log(totalData,'totalData---');
    useEffect(() => {
        // getRelationApply()
        getFormMenu('main')
        getRelationLogicList()
    }, [])
    // useEffect(()=>{
    //     totalData.forEach((item,index)=>{
    //         item.tableData.forEach((val,ind)=>{
    //             val.bizTableScope=mainName.SUB
    //         })
    //     })
    // },[mainName])
    const getFormMenu = (type) => {
        if(configData.bizSolId){
            dispatch({
                type: 'applyCorrelation/getFormMenu',
                payload: {
                    bizSolId: configData.bizSolId,
                    type,
                }
            })
        }
    }
    const getRelationLogicList=()=>{
        dispatch({
            type: 'applyCorrelation/getRelationLogicList',
            payload: {
              searchWord:'',
              limit:1000,
              start:1
            }
          })
    }
    const getRelationApply = () => {
        dispatch({
            type: 'applyCorrelation/getRelationApply',
            payload: {
                // bizSolId: configData.bizSolId
            }
        })
    }
    const onCancel = () => {
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                isShowConfig: false,
                relationName:[],
                relationArray:[],
                mainList:[],
                mainName:[],
                mainAndSub:[],
                totalData:[
                    {   relationBizSolId:'',
                        relationBizSolName: '',
                        relationLogicCode: '',
                        relationLogicName: '',
                        tableData:
                        [
                            {
                                "key": 1,
                                "groupName": 1,
                                "mainBizTable": "",
                                "mainBizField": "",
                                "bizTableScope":'',
                                "mainRelationTable": "",
                                "mainRelationField": null,
                                "incidenceRelation": "",
                                "relationTableScope":"",
                                "bizAttribute": "",
                                "bizInject": "",
                                "bizLabel": null,
                                "conditionNum": 1,
                                "isRowCol": true,
                            },
                        ]
                    },
                ]
            }
        })
    }
    //添加分组
    function onAddGroup(groupName, groupNum, conditionNum, index, isRowCol) {
        console.log(groupName, 'groupName');
        console.log(index, 'index==');
        let key = lastKey
        key = key + 1
        if (isRowCol) {
            totalData.push({
                relationBizSolId:'',
                relationBizSolName: '',
                relationLogicCode: '',
                relationLogicName: '',
                tableData: [{
                    key: key,
                    groupName: groupName,
                    mainBizTable: '',
                    mainBizField: '',
                    bizTableScope:'',
                    mainRelationTable: '',
                    mainRelationField: '',
                    relationTableScope:'',
                    incidenceRelation: '',
                    bizAttribute: '',
                    bizInject: '',
                    bizLabel: '',
                    conditionNum: conditionNum,
                    isRowCol: isRowCol,



                }]
            });
        } else {
            totalData.forEach((item, i) => {
                if(i == groupNum - 1){
                    totalData[i].tableData.forEach((val, ind) => {
                        val.conditionNum = conditionNum
                    })
                    totalData[i].tableData = JSON.parse(JSON.stringify(totalData[i].tableData)) // 数据深拷贝
                    totalData[i].tableData.push({
                        key: key,
                        groupName: groupName,
                        mainBizTable: '',
                        mainBizField: '',
                        bizTableScope:'',
                        mainRelationTable: '',
                        mainRelationField: '',
                        relationTableScope:'',
                        incidenceRelation: '',
                        bizAttribute: '',
                        bizInject: '',
                        bizLabel: '',
                        conditionNum: conditionNum,
                        isRowCol: isRowCol,
                        relationBizSolId:item.relationBizSolId?item.relationBizSolId:'',//增加当前行在有配置的情况下给关联应用赋值
                        relationBizSolName:item.relationBizSolName?item.relationBizSolName:'',
                        relationLogicCode:item.relationLogicCode?item.relationLogicCode:'',
                        relationLogicName:item.relationLogicName?item.relationLogicName:'',
                    });
                }


            })
            console.log(totalData, 'totalData123');
        }
        console.log(totalData,'val==+++');
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                totalData:totalData,
                lastKey: key,
            }
        })
        if (isRowCol) {//如果添加组  更新组数
            dispatch({
                type: 'applyCorrelation/updateStates',
                payload: {
                    groupNum,
                }
            })
        }
    }
    //删除分组
    function onDeleteGroup(groupName) {
        let array = totalData
        let totalGNum = groupNum
        console.log(groupName,'groupName==');
        if (array.length == 1) {
            return message.error('该组不可删除！')
        }
        array.forEach((item, index) => {
            item.tableData.forEach((val, ind) => {
                if (val.groupName == groupName) {
                    array.splice(index, 1)
                }
            })
        })
        totalGNum = totalGNum - 1;
        console.log(totalGNum,'totalGNum==');
        console.log(array, 'array==');
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                totalData: array,
                groupNum: totalGNum,
            }
        })

    }
    const onSave=()=>{
        let res=[]
        console.log(totalData,'onsave');
        totalData.forEach((item,index)=>{
          res=res.concat(item.tableData)
        })
        console.log(res,'onsave==');
        dispatch(({
            type:'applyCorrelation/saveConfig',
            payload:{
                bizRelation:JSON.stringify(res)
            }
        }))
        onCancel()

    }
    return (
        <div>
            <GlobalModal
                title='配置详情'
                widthType={1}
                incomingWidth={1000}
                incomingHeight={490}
                visible={true}
                onCancel={onCancel}
                mask={false}
                maskClosable={false}
                // width={`calc(100% - 40px)`}
                bodyStyle={{ overflow: 'scroll' }}
                className={styles.config_modal}
                getContainer={() => {
                    return document.getElementById('applyCorrelation_container')||false
                }}
                footer={[
                    <Button onClick={onCancel} key='cancel'>取消</Button>, <Button key={'primary'} type='primary' htmlType='submit' onClick={()=>{onSave()}}>确定</Button>,
                ]}
            >
                <Form initialValues={{ logicName: configData.logicName }}>
                    <Row>
                        <Col span={7}>
                            <Form.Item label='应用名称' name='logicName'>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <ConfigTable onAddGroup={onAddGroup.bind(this)} onDeleteGroup={onDeleteGroup.bind(this)} />

                </Form>
            </GlobalModal>
        </div>
    )
}
export default connect(({ applyCorrelation }) => ({ applyCorrelation }))(configModal)
