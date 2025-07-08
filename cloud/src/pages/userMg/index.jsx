import { connect } from 'dva';
import React, { useState, useCallback, useRef,useEffect} from 'react';
import {Input,Space,Button,Table,Spin,Tree,Modal,message,Tooltip} from 'antd';
const { TreeNode } = Tree;
import styles from './index.less';
import { dataFormat } from '../../util/util.js';
import { history } from 'umi';
import {MenuOutlined} from '@ant-design/icons';
import BATCH from './components/batchModal';
import ADD from '../../componments/addUser';
import IMPORTUSER from './components/importModal'
import ReSizeLeftRight from '../../componments/public/reSizeLeftRight';
import IPagination from '../../componments/public/iPagination';
   
function UserMg({dispatch,loading,tenementLists,userLists,batchModal,importModal,addModal,currentUg,tenantId,returnCount,searchObj,userIds,importData,acountStatus,addUser,limit}){
    const pathname = '/userMg';
    const [tenementIndex, setTenementIndex] = useState(-1);
    const [isCat,setIsCat] = useState(false);
    const [loadingStatus, setLoading] = useState(false);
    // table自适应滚动
    const [scrollY, setScrollY] = useState(document.documentElement.clientHeight-305);
    const onResize = useCallback(()=>{
      setScrollY(document.documentElement.clientHeight-305);
    },[])
    const {picUrl}=addUser
    useEffect(()=>{
        // 点击用户管理请求数据
        dispatch({
            type: 'userMg/getUsers',
            payload:{
                searchValue:'',
                start:1,
                limit:10
            }
        })
        window.addEventListener('resize',onResize);
        return (()=>{
            window.removeEventListener('resize',onResize)
        })
    },[])
    const tableProps = {
        rowKey: 'userId',
        columns: [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
                render: (text,record,index)=><div>{index+1}</div>
               // render: (text,record,index)=><div>{(10*(currentPage-1))+index+1}</div>
            },
            {
                title: '姓名',
                dataIndex: 'userName',
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                render: address => (
                    <Tooltip placement="topLeft" title={address}>
                        {address}
                    </Tooltip>
                ),
            },
            {
                title: '简称',
                dataIndex: 'userShortName',
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                render: address => (
                    <Tooltip placement="topLeft" title={address}>
                        {address}
                    </Tooltip>
                ),
            },
            {
                title: '账号',
                dataIndex: 'userAccount',
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                render: address => (
                    <Tooltip placement="topLeft" title={address}>
                        {address}
                    </Tooltip>
                ),
            },
            {
                title: '手机',
                dataIndex: 'phone',
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                render: address => (
                    <Tooltip placement="topLeft" title={address}>
                        {address}
                    </Tooltip>
                ),
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                render: address => (
                    <Tooltip placement="topLeft" title={address}>
                        {address}
                    </Tooltip>
                ),
            },
            {
                title: '启用状态',
                dataIndex: 'isEnable',
                render:text=>{return text==1?'是':'否'},
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                render: address => (
                    <Tooltip placement="topLeft" title={address==1?'是':'否'}>
                        {address==1?'是':'否'}
                    </Tooltip>
                ),
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                render: address => (
                    <Tooltip placement="topLeft" title={dataFormat(address,'YYYY-MM-DD')}>
                        {dataFormat(address,'YYYY-MM-DD')}
                    </Tooltip>
                ),
            },
            {
                title: '用户类型',
                dataIndex: 'customType',
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                render: address => (
                    <Tooltip placement="topLeft" title={address==1?'用户':address==2?'用户&管理员':'管理员'}>
                        {
                          address==1?'用户':address==2?'用户&管理员':'管理员'
                        }
                    </Tooltip>
                ),
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 150,
                render: (text,record)=>{return <div>
                    <Space>
                        <a onClick={addClick.bind(this,record)} className={styles.fontSize7}>修改</a>
                        <a onClick={catClick.bind(this,record)} className={styles.fontSize7}>查看</a>
                        <a onClick={deleteClick.bind(this,record.userId)} className={styles.fontSize7}>删除</a>
                    </Space>
                </div>}
            },
        ],
        dataSource: userLists,
        onRow:(record, index) => ({
            index,
            record,
            //  moveRow,
        }),
        pagination: false,
        rowSelection: {
            selectedRowKeys: userIds,
            onChange: (selectedRowKeys, selectedRows) => {
              dispatch({
                type: 'userMg/updateStates',
                payload: {
                  userIds: selectedRowKeys
                }
              })
            },
          },
    }
    // 拖动功能 start 
    const DragableBodyRow = ({ record,index, moveRow, className, ...restProps }) => {
        return (
          <tr
            draggable
            id={record.userId}
            // item-name={record.userName}
            onDragStart = {dragstart}
            className={`${className}`}
            style={{ cursor: 'move'}}
            {...restProps}
          />
        );
    };
    // const components = {
    //     body: {
    //       row: userLists.length > 0 ?  DragableBodyRow : '',
    //     },
    // };
    const dragstart = ev => {
        // let name = ev.target.getAttribute('item-name')
        ev.dataTransfer.setData("Id",ev.target.id);
        // ev.dataTransfer.setData("Name",name);
    };
    const drop = ev => {
        ev.preventDefault();
        let sourceId = ev.dataTransfer.getData("Id"); //来源id
        let targetId = ev.target.getAttribute('id');//目标id
        // let name = ev.dataTransfer.getData("Name");
        // ev.target.appendChild(document.getElementById(data));
        // ev.target.removeChild(document.getElementById(data));
    };
    const dragOver = ev => {
        ev.preventDefault();
    }; 
    function compare(prop,align){
        return function(a,b){
            var value1=a[prop];
            var value2=b[prop];
            if(align=="positive"){//正序
                return new Date(value1)-new Date(value2);
            }else if(align=="inverted"){//倒序
                return new Date(value2)-new Date(value1);
            }
        }
    }
    userLists.sort(compare('createTime','inverted'));
    
    // 拖动功能 end 
    function checkWOrd(value){
        let specialKey = "`《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'";
        for (let i = 0; i < value.length; i++) {
          if (specialKey.indexOf(value.substr(i, 1)) != -1) {
            return true
          }
        }
        return false
    }
    function onSearchTable(value){
        if(checkWOrd(value)){
            message.error('查询条件不支持特殊字符，请更换其它关键字！')
            return
        }
        getUsers(1,searchObj[pathname].limit,value,tenantId);
        searchObj[pathname].searchWord = value;
        searchObj[pathname].currentPage = 1;
        dispatch({
          type: 'layoutG/updateStates',
          payload:{
            searchObj
          }
        })
    }
    function userImport(){
        dispatch({
            type: 'userMg/updateStates',
            payload: {
              importModal:true
            }
        })
    }
    function onSearchTree(value){
        if(checkWOrd(value)){
            message.error('查询条件不支持特殊字符，请更换其它关键字！')
            return
        }
        dispatch({
            type: 'userMg/getTenants',
            payload:{
              searchValue:value,
              start:1,
              limit:1000
            }
        })
    } 
    function getUsers(start,limit,searchWord,tenantId){
        dispatch({
            type:"userMg/getUsers",
            payload:{
                tenantId:tenantId == -1 ? '' : tenantId,
                start:start,
                limit:limit,
                searchWord:searchWord
            }
        }) 
        setTimeout(()=>{
            setLoading(false)
        },200)
    }
    
    function tenementClick(e,index){
        searchObj[pathname].currentPage = 1;
        searchObj[pathname].limit = 10;
            dispatch({
                type: 'layoutG/updateStates',
                payload:{
                    searchObj
                }
            })
        if(index == -1){
            setTenementIndex(-1)
        }else{
            setTenementIndex(index)
        }
        dispatch({
            type:"userMg/updateStates",
            payload:{
                tenantId:index
            }
        })  
        getUsers(1,10,'',index)
    }    
    function onCancel(){
        dispatch({
            type:"userMg/updateStates",
            payload:{
                batchModal:false,
                addModal:false,
                importModal: false
            }
        })  
    }   
    //批量绑定
    function batchClick(){
        if(userIds.length == 0){
            message.error('请最少选择一条数据');
            return
        }
        dispatch({
            type:"userMg/updateStates",
            payload:{
                batchModal:true
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
    function changePage (page,size) {
        console.log(page, size)
        searchObj[pathname].currentPage = page;
        searchObj[pathname].limit = size;
              dispatch({
                type: 'layoutG/updateStates',
                payload:{
                  searchObj
                }
              })
        getUsers(page,size,searchObj[pathname].searchWord,tenantId);
    }
    //删除
    function deleteClick(id){
        let ids = '';
        if(id){
            ids = id;
        }else{
            if(userIds.length == 0){
                message.error('请最少选择一条数据');
                return
            }else{
                ids = getByIdJs(userIds);
            }
        }
        Modal.confirm({
            title: '确认删除',
            content: '确认删除该用户信息',
            okText: '删除',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type:"userMg/userMgDeleteUsers",
                    payload:{
                        userIds:ids
                    }
                }) 
            }
        });
    }
    function refreshDataFn () {
        setLoading(true)
        getUsers(1,searchObj[pathname].limit,searchObj[pathname].searchWord,tenantId);
        searchObj[pathname].currentPage = 1;
        dispatch({
          type: 'layoutG/updateStates',
          payload:{
            searchObj
          }
        })
    }
    function addClick(currentUg){
        setIsCat(false);
        if(currentUg.userId){
            //修改 
            dispatch({
                type:"userMg/getIdUsers",
                payload:{
                    userId:currentUg.userId,
                    orgCenterId:currentUg.orgCenterId
                },
                callback:function(data){
                    dispatch({
                        type:"userMg/updateStates",
                        payload:{
                            addModal:true,
                            userPassword: ''
                        }
                    }) 
                    picUrl.picturePath=data.picturePath
                    picUrl.signaturePath=data.signaturePath
                    picUrl.pictureOriginalPath=data.pictureOriginalPath
                    picUrl.signatureOriginaPath=data.signatureOriginaPath
                    dispatch({
                        type:"addUser/updateStates",
                        payload:{
                            picUrl
                        }
                    }) 
                    
                }
            }) 
        }else{
            currentUg.userPassword = '123456';
            picUrl.picturePath=''
            picUrl.signaturePath=''
            picUrl.pictureOriginalPath=''
            picUrl.signatureOriginaPath=''
            dispatch({
                type:"userMg/updateStates",
                payload:{
                    addModal:true,
                    currentUg,
                    picUrl
                }
            }) 
        }
        
    } 
    function catClick(currentUg){
        setIsCat(true);
        if(currentUg.userId){
            //修改 
            dispatch({
                type:"userMg/getIdUsers",
                payload:{
                    userId:currentUg.userId,
                    orgCenterId:currentUg.orgCenterId

                },
                callback:function(data){
                    dispatch({
                        type:"userMg/updateStates",
                        payload:{
                            addModal:true
                        }
                    }) 
                    picUrl.picturePath=data.picturePath
                    picUrl.signaturePath=data.signaturePath
                    picUrl.pictureOriginalPath=data.pictureOriginalPath
                    picUrl.signatureOriginaPath=data.signatureOriginaPath
                    dispatch({
                        type:"addUser/updateStates",
                        payload:{
                            picUrl
                        }
                    }) 
                }
            }) 
        }else{
            dispatch({
                type:"userMg/updateStates",
                payload:{
                    addModal:true,
                    currentUg
                }
            }) 
        }
    }
    function onAddSubmit(values){
        values.tenantId = tenantId == '-1' ? '' : tenantId;
        if(currentUg.userId){
            values.userId = currentUg.userId;
            dispatch({
                type:"userMg/updateUsers",
                payload:{
                    ...values
                },
                callback:function(){
                    dispatch({
                      type: 'userMg/updateStates',
                      payload:{
                        addModal:false
                      }
                    })
                }
            }) 
        }else{
            dispatch({
                type:"userMg/addUsers",
                payload:{
                    ...values
                },
                callback:function(){
                    dispatch({
                      type: 'userMg/updateStates',
                      payload:{
                        addModal:false
                      }
                    })
                }
            }) 
        }
        
    }
  return (

    <div style={{ height: '100%', background: '#fff', display: 'flex', }} id='userMg_container'>
        <div  className={styles.table_warp}>
            <div className={styles.other}>
                <Input.Search
                    className={styles.search}
                    placeholder={'用户名/手机/邮箱'}
                    allowClear
                    onSearch={(value) => { onSearchTable(value) }}
                />
                <Space>
                    <Button onClick={addClick.bind(this, {})} className={styles.fontSize7}>新增</Button>
                    <Button  className={styles.fontSize7} onClick={userImport.bind(this)}>导入</Button>
                    <Button onClick={deleteClick.bind(this, '')} className={styles.fontSize7}>删除</Button>
                </Space>
            </div>
            {/* <Table {...tableProps} key={loading} components={components}/> */}
            <div id="table" style={{ paddingBottom:'20px'}}>
               <Spin spinning={loadingStatus}><Table {...tableProps} key={loading} className={styles.tables} scroll={{y:scrollY}}/>
              </Spin>
            </div>
            {
                userLists.length>0?
                    <IPagination
                        total={returnCount}
                        current={searchObj[pathname].currentPage}
                        pageSize={searchObj[pathname].limit}
                        onChange={changePage.bind(this)}
                        isRefresh={true}
                        refreshDataFn={refreshDataFn.bind(this)}
                />
                :''
           }
        </div>
       
        {batchModal && (<BATCH  //关联按钮
            loading={loading.global}
            onCancel={onCancel.bind(this)}
            // onAssSubmit = {onAssSubmit.bind(this)}
          />)}
        {importModal && (<IMPORTUSER  //导入
            loading={loading.global}
            onCancel={onCancel.bind(this)}
            importData={importData}
        />)}
        {addModal && (<ADD  //新增
            loading={loading.global}
            onCancel={onCancel.bind(this)}
            currentUg={currentUg}
            acountStatus={acountStatus}
            onAddSubmit = {onAddSubmit.bind(this)}
            isCat={isCat}
          />)}
    </div>
  )
}
export default connect(({loading,userMg,layoutG,addUser})=>({
    loading,
    ...userMg,
    ...layoutG,
    addUser
}))(UserMg);
