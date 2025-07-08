import { connect } from 'dva';
import React, { useState } from 'react';
import { Modal,Button,Form,Row,Checkbox,Input,Table,Select, message} from 'antd';
import { dataFormat } from '../../../util/util.js';
import {CloseOutlined} from '@ant-design/icons';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi'; 
function addForm ({dispatch,loading,location,searchObj,onCancel}){
    const pathname = '/organization';
    const { tenementLists,returnCountUsers,usersLists,usersIds,orgId,orgItemUg,postLists} = searchObj[pathname];
    const [postName, setPostName] = useState(['请选择']);
    const [postId, setPostId] = useState(['请选择']);
    const [inputValue,setInputValue] = useState('');
    const tableProps = {
        rowKey: 'userId',
        size: 'middle',
        columns: [
            {
                title: '姓名',
                dataIndex: 'userName',
                width: 150,
                ellipsis: {
                    showTitle: false,
                }
            },
            {
                title: '简称',
                dataIndex: 'userShortName',
                width: 150,
                ellipsis: {
                    showTitle: false,
                }
            },
            {
                title: '账号',
                dataIndex: 'userAccount',
                width: 150,
                ellipsis: {
                    showTitle: false,
                }
            },
            {
                title: '启用状态',
                dataIndex: 'isEnable',
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                render:text=>{return text==1?'是':'否'}
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                width: 150,
                ellipsis: {
                    showTitle: false,
                },
                render:text=>{return dataFormat(text,'YYYY-MM-DD')}
            },
            {
                title: '用户类型',
                dataIndex: 'customType',
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                render:text => {return text==1?'用户':text==2?'用户&管理员':'管理员'} 
            }
        ],
        dataSource: usersLists,
        pagination:{
            total: returnCountUsers,
            pageSize: searchObj[pathname]['users'].limit,
            showQuickJumper: true,
            showSizeChanger:true,
            showTotal: (total)=>{return `共 ${total} 条` },
            current: searchObj[pathname]['users'].currentPage,
            onChange: (page,size)=>{
                searchObj[pathname]['users'].currentPage = page;
                searchObj[pathname]['users'].limit = size
                dispatch({
                    type: 'layoutG/updateStates',
                    payload:{
                        searchObj
                    }
                })
                getUsers(page,size,inputValue);
            }
          },
          rowSelection: {
            selectedRowKeys: usersIds,
            onChange: (selectedRowKeys, selectedRows) => {
                dispatch({
                    type: 'organization/updateStates',
                    payload: {
                    usersIds: selectedRowKeys
                    }
                })
            },
          },
       
    }
    function getUsers(start,limit,searchWord){
        dispatch({
            type:"organization/getUsers",
            payload:{
                tenantId:'',
                start:start,
                limit:limit,
                searchWord:searchWord,
                isEnable: 1
            }
        }) 
    }
    function onSearchUsers(value){
        setInputValue(value);
        getUsers(1,10,value)
    }
    function onChangePost(value) {
        setPostName(value);
        postLists.map((item, index) => {
            if(item.postName == value) {
                setPostId(item.id);
            }
        })
    }
    function getByIdJs(arr) {
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            str += arr[i]+ ",";
        }
        if (str.length > 0) {
            str = str.substr(0, str.length - 1);
        }
        return str;
    }
    function submit(){
        let deptIds = orgItemUg.orgKind == 'DEPT' ? orgItemUg.id : '';
        let userIds = getByIdJs(usersIds);
        if(userIds.length < 1) {
            message.error('请选择要加入的用户');
            return;
        }
        dispatch({
            type:"organization/joinUsers",
            payload:{
                orgId:orgItemUg.id,
                userIds,
                postId: postId=='请选择'?'':postId
            },
            callback:function(){
                dispatch({
                    type:"organization/getUser",
                    payload:{
                        start:searchObj[pathname]['user'].currentPage,
                        limit:searchObj[pathname]['user'].limit,
                        searchWord:'',
                        orgId:orgItemUg.id,
                        deptId:deptIds
                    }
                }) 
                dispatch({
                    type:"organization/updateStates",
                    payload:{
                        joinModal:false,
                    }
                }) 
            }
        }) 
    }
    return (
        <Modal
            visible={true}
            width={900}
            title='加入'
            bodyStyle={{padding: '10px'}}
            onCancel={onCancel}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('organization_container')
            }}
            footer={
                [
                    <Button onClick={onCancel}>
                    取消
                </Button>,
                    <Button  type="primary" loading={loading.global} onClick={submit}>
                    保存
                </Button>
                
                ]
            }
        >
            <div>
                <p className={styles.joinTitle}>
                    <Input.Search
                        style={{width:'200px',marginBottom:'10px'}}
                        placeholder={'用户名/手机/邮箱'}
                        allowClear
                        onSearch={(value)=>{onSearchUsers(value)}}
                    />
                    <Form.Item
                        label="岗位选择"
                        style={{width:'250px',marginBottom:'10px'}}
                        className={styles.post}
                    >
                        <Select onChange={onChangePost} value={postName} className={styles.select}
                        >
                            <Select.Option                  
                            >
                                <span>请选择</span>
                            </Select.Option>
                            {
                                postLists.map((item,index) => {
                                
                                    return <Select.Option
                                    key={item+index}
                                    value={item.postName}                          
                                    >
                                        <span>{item.postName}</span>
                                    </Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </p>
                <Table {...tableProps} key={loading} scroll={{ y: 400 }}/>
            </div>
            {/* <Row style={{width: '200px',margin:'10px auto 0'}} >
                <Button  type="primary" loading={loading.global} onClick={submit}>
                    保存
                </Button>
                <Button onClick={onCancel} style={{marginLeft: 8}}>
                    取消
                </Button>
            </Row> */}
            
    </Modal>
    )
  }


  
export default (connect(({organization,layoutG,loading})=>({
    ...organization,
    ...layoutG,
    loading
  }))(addForm));
