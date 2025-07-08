import { connect } from 'dva';
import React, { useState,Component,useCallback,useEffect } from 'react';
import { Modal,Button,Form,Row,Checkbox,Input,Table,Space,Tabs,Tooltip,message,Dropdown,Menu,Switch,Spin} from 'antd';
const { TabPane } = Tabs;
import {CloseOutlined,ReloadOutlined} from '@ant-design/icons';
import _ from "lodash";
import styles from '../index.less';
import { history, createHashHistory } from 'umi';
import DragLeftRight from '../../../componments/public/dragLeftRight';
import ORGADD from './orgAddModal'; //单位新增
import DEPTADD from './deptAddModal';//部门新增
import ADD from '../../../componments/addUser';//用户新增
import IPagination from '../../../componments/public/iPagination'
import SHAREORGMODAL from '../../tenement/componments/shareOrgModal';
import POSTADD from './postAddModal'; //岗位新增
import JOIN from './joinModal';//加入
import IDENTITY from './identityModal'
import IMPORTUSER from './importModal'
import IMPORTORG from './orgImportModal'
import moment from 'moment'; 
import 'moment/locale/zh-cn'; 
moment.locale('zh-cn');
const EditableContext = React.createContext(null); 

class EditableRow extends Component {
    returnForm = React.createRef();
    render() {
      return (
        <Form ref={this.returnForm} component={false}>
          <EditableContext.Provider value={this.returnForm}>
            <tr {...this.props} />
          </EditableContext.Provider>
        </Form>
      );
    }
  }
  
class EditableCell extends Component {
    state = {
        editing: false
    };
  
    toggleEdit = (e) => {
        e.stopPropagation();
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };
  
    save = (e) => {
        e.stopPropagation();
        const { record, handleSave } = this.props;
        let values = this.form.current.getFieldsValue();
        this.toggleEdit(e);
        handleSave({ ...record, ...values });
    };
  
    renderCell = (form) => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        let formParams = {
            one: {
            name: dataIndex,
            rules: [
                {
                required: true,
                message: `${title} is required.`
                }
            ],
            initialValue: record[dataIndex]
            }
      };
      return editing ? (
        <Form.Item {...formParams.one} style={{ margin: 0 }}>
          <Input
            ref={(node) => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
    };
  
    render() {
      const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        children,
        ...restProps
      } = this.props;
      return (
        <td {...restProps}>
          {editable ? (
            <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
          ) : (
            children
          )}
        </td>
      );
    }
}
let orgId = '';// 选中部门节点的上级单位节点
function addForm ({dispatch,location,searchObj,onCancel}){
    const pathname = '/organization';
    const {orgClildrens,userLists,postLists,orgAddModal,userAddModal,postAddModal,organizationId,orgUg,userUg,postUg,orgDeptIds,deptUg,deptAddModal,deptItemUg,selectedOrgRows,deptList,orgItemUg,returnCountPost,returnCountUser,userIds,postIds,joinModal,expandOrgList,identityModal,importModal,orgImportModal,importData,isShowShareOrgModal,returnCount, orgId, orgCenterId,tenantOrgShare,acountStatus } = searchObj[pathname];
    const organizationArea = searchObj[pathname]['users'];
    const userArea = searchObj[pathname]['user'];
    const postArea = searchObj[pathname]['post'];
    const [tabNum, setTabNum] = useState(1);
    const [postOrOrg, setPostOrOrg] = useState(1);
    const [top,setTop] = useState('left');
    const [isCat,setIsCat] = useState(false);
    const [inputValue,setInputValue] = useState('');
    const [parentOrgName, setParentOrgName] = useState('');
    const [parentDeptName, setParentDeptName] = useState('');
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    // table自适应滚动 
    const [scrollY, setScrollY] = useState(document.documentElement.clientHeight-305);
    const onResize = useCallback(()=>{
      setScrollY(document.documentElement.clientHeight-305);
    },[])
  
    useEffect(()=>{
        window.addEventListener('resize',onResize);
        return (()=>{
            window.removeEventListener('resize',onResize)
        })
    },[])
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
    function checkWOrd(value){
        let specialKey = "`@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'()（）";
        for (let i = 0; i < value.length; i++) {
          if (specialKey.indexOf(value.substr(i, 1)) != -1) {
            return true
          }
        }
        return false
    }
    //-----------单位 start
    const tableProps = {
        rowKey:'id',
        loading:loading.global,
        size: 'middle',
        columns: [
            {
                title:'序号',
                width: 70,
                dataIndex: 'number',
            },
            {
                title: '组织',
                dataIndex: 'orgName',
                // width: 150,
                ellipsis: {
                    showTitle: false,
                },
                onCell: (record) => ({
                    record,
                    // editable: true,
                    dataIndex: 'nodeNames',
                    title: '组织',
                    handleSave: handleSave
                }),
                render: (address, record) => (
                    // <div>{address}</div>
                    <Tooltip placement="topLeft" title={address}>
                        <a onClick={catOrg.bind(this,record)}>{address}</a>
                    </Tooltip>
                ),
            },
            {
                title: '组织编码',
                dataIndex: 'orgNumber',
                // width: 150,
                ellipsis: {
                    showTitle: false,
                },
                onCell: (record) => ({
                    record,
                    // editable: true,
                    dataIndex: 'nodeNumber',
                    title: '组织编码',
                    handleSave: handleSave
                }),
                render: address => (
                    // <div>{address}</div>
                    <Tooltip placement="topLeft" title={address}>
                        {address}
                    </Tooltip>
                ),
            },
            {
                title: '类别',
                dataIndex: 'orgKind',
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                render:(text,record) => {
                    return <div>
                      <span>{text == 'ORG' ? '单位' : '部门'}</span>
                  </div>
                }
            },
            {
                title: '启用状态',
                dataIndex: 'isEnable',
                width: 100,
                ellipsis: {
                    showTitle: false,
                },
                // render:text=>{return text==1?'是':'否'}
                render:(text, record)=>{
                    return <span onClick={stopProp.bind(this)}>
                         <Switch checked={text=='1'? true : false } onChange={onEnable.bind(this,record)} style={{color:'red'}} className={styles.switch}/>
                    </span>
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 160,
                ellipsis: {
                    showTitle: false,
                },
                render: (text,record)=>{return <div>
                    <Space>
                        <a className={styles.fontSize7} onClick={updateOrg.bind(this,record)}>修改</a>
                        <a className={styles.fontSize7} onClick={deleteOrgDept.bind(this,record)}>删除</a>
                        {/* <a className={styles.fontSize7} onClick={catOrg.bind(this,record)}>查看</a>
                        <a className={styles.fontSize7} onClick={addDept.bind(this,record)}></a> */}
                    </Space>
                </div>}
            },
        ],
        dataSource: orgClildrens,
        pagination: false,
        onRow:(record, index) => {
            return {
                onClick: event => {
                    // orgId = '';
                    // getParentKey(record.id,orgClildrens)
                    // if(record.orgKind == 'ORG'){
                    //     orgId = record.id;
                    // }
                }
            };
        },
        rowSelection: {
            selectedRowKeys: orgDeptIds,
            columnTitle:' ',
            onChange: (selectedRowKeys, selectedRows) => {
                dispatch({
                    type: 'organization/updateStates',
                    payload: {
                      orgDeptIds: selectedRowKeys,
                      selectedOrgRows:selectedRows,
                    }
                })
            },
            onSelect: (record,selected) => {
                postArea.searchWord = '';
                userArea.searchWord = '';
                if(selected) {
                    if(record.orgKind === 'ORG') {
                       setParentOrgName(record.orgName);
                    }
                    if(record.orgKind === 'DEPT' && record.nodeNames) {
                       setParentDeptName(record.nodeNames);
                    } else {
                       setParentDeptName('');
                    }
                    window.localStorage.setItem('rosNum_cloud',record.id);
                    let orgCenterIds = record.orgKind == 'ORG' ? record.orgCenterId : orgCenterId;
                    // 点击用户/岗位时请求对应api
                    orgClildrens.map((item, index) => {
                        if(record.orgParentId == item.id) {             
                            setParentOrgName(item.orgName)
                        }
                    })
                    getPost(1,10,'',record.id,'');
                    getUser(1,10,'',record.id,record.id,orgCenterIds);
                    userArea.currentPage = 1;
                    userArea.limit = 10;
                    postArea.currentPage = 1;
                    postArea.limit = 10;
                    dispatch({ 
                        type: 'organization/updateStates',
                        payload: {
                            orgItemUg:record,
                            usersIds:[],
                            userIds:[],
                            postIds:[],
                            identityPosts:[],
                        }
                    })
                } else {
                    console.log(userArea, postArea)
                    dispatch({
                        type: 'organization/updateStates',
                        payload: {
                            postLists:[],
                            userLists:[],
                            selectedOrgRows:[],
                            orgItemUg:{},
                            returnCountUser: 0
                        }
                    })
                    userArea.currentPage = 0;
                    postArea.currentPage = 0;
                    // setParentOrgName('');
                    return;
                }
            },
        },
        rowClassName:(record, index) => {
            return record.id == window.localStorage.getItem('rosNum_cloud') ? `${styles['rowClass']}` : `${styles['hoverClass']}`;
            // return record.isEnable == '1' ? `${styles['hoverClass']}` : `${styles['rowClass']}`;
        }
    }
    const selectRow=(record)=>{
        return{
            onClick:()=>{
                const index=orgDeptIds.findIndex(item=>item==record.id)
                if(index<0){
                    orgDeptIds.push(record.id)
                    if(record.orgKind === 'ORG') {
                        setParentOrgName(record.orgName);
                     }
                     if(record.orgKind === 'DEPT' && record.nodeNames) {
                        setParentDeptName(record.nodeNames);
                     } else {
                        setParentDeptName('');
                     }
                     window.localStorage.setItem('rosNum_cloud',record.id);
                     let orgCenterIds = record.orgKind == 'ORG' ? record.orgCenterId : orgCenterId;
                     // 点击用户/岗位时请求对应api
                     orgClildrens.map((item, index) => {
                         if(record.orgParentId == item.id) {             
                             setParentOrgName(item.orgName)
                         }
                     })
                     getPost(1,10,'',record.id,'');
                     getUser(1,10,'',record.id,record.id,orgCenterIds);
                     userArea.currentPage = 1;
                     userArea.limit = 10;
                     postArea.currentPage = 1;
                     postArea.limit = 10;
                     dispatch({ 
                         type: 'organization/updateStates',
                         payload: {
                             orgItemUg:record,
                             usersIds:[],
                             userIds:[],
                             postIds:[],
                             identityPosts:[],
                         }
                     })
                }else{
                    orgDeptIds.splice(index,1)
                    dispatch({
                        type: 'organization/updateStates',
                        payload: {
                            postLists:[],
                            userLists:[],
                            selectedOrgRows:[],
                            orgItemUg:{},
                            returnCountUser: 0
                        }
                    })
                    userArea.currentPage = 0;
                    postArea.currentPage = 0;
                }
                console.log(orgDeptIds,'orgDeptIds');
                dispatch({
                    type: 'organization/updateStates',
                    payload: {
                      orgDeptIds: [...orgDeptIds],
                      selectedOrgRows:[record],
                    }
                })
            }
        }
    }
    function onExpand(expanded, record){
        if(expanded){
            if(record.children && record.children.length == 0){
                // if(record.orgKind == 'DEPT'){
                //     dispatch({
                //         type:"organization/getOrgChildren",
                //         payload:{
                //             nodeType:'DEPT',
                //             orgCenterId:record.orgCenterId,
                //             nodeId:record.id,
                //             onlySubDept:'1',
                //             start:1,
                //             limit:200
                //         }
                //     })
                // }else{
                //     dispatch({
                //         type:"organization/getOrgChildren",
                //         payload:{
                //             nodeType:'DEPT',
                //             orgCenterId:record.orgCenterId,
                //             nodeId:record.id,
                //             start:1,
                //             limit:200
                //         }
                //     })
                // }
                dispatch({
                    type: 'organization/getOrgTreeList',
                    payload: {
                      parentId:record.id,
                      start:1,
                      limit:200,
                      orgKind: 'ORG_',
                      searchWord:''
                    },
                  });
            }
            expandOrgList.push(record.id)
            dispatch({
                type:"organization/updateStates",
                payload:{
                    expandOrgList
                }
            })
        }else{
            let index = expandOrgList.indexOf(record.id);
            expandOrgList.splice(index,1);
            dispatch({
                type:"organization/updateStates",
                payload:{
                    expandOrgList
                }
            })
        }
    }
    function addDept(e){
        // 新增部门
        e.stopPropagation();
        setIsCat(false);
        // getParentKey(orgItemUg,orgClildrens)
        if(selectedOrgRows.length>0){
            if(selectedOrgRows.length>1) {
                message.error('新增请选择一个单位');
                return;
            }
            dispatch({
                type:"organization/updateStates",
                payload:{
                    deptAddModal:true,
                    deptItemUg:orgItemUg,
                    deptUg:{
                        isEnable:true,
                        orgName: parentOrgName,
                        parentName: parentDeptName
                    }
                }
            })
        }else{
            message.error('所属单位不可为空不能为空');
        } 
    }
    function addOrg(e){
        e.stopPropagation();
        setIsCat(false);
        if(organizationId){
            if(orgClildrens.length>0 && orgClildrens[0].isShare==1 && selectedOrgRows<1) {
                // 该单位是否共享其他租户的数据
                // 该租户属于共享其他租户下的数据，只能新增子级单位
                message.error('该租户属于共享其他租户下的数据，只能新增子级单位');
                return;
            }
            if(selectedOrgRows.length>1) {
                message.error('新增请选择一个单位');
                return;
            }
            if(orgItemUg.orgKind == 'DEPT'){
                message.error('部门下不能新增单位');
                return;
            }
            dispatch({
                type:"organization/updateStates",
                payload:{
                    orgAddModal:true,
                    orgUg:{
                        isEnable:true,
                        parentName: selectedOrgRows.length>0?selectedOrgRows[0].orgName:'',
                    }
                }
            })
        }else{
            message.error('请选择一个租户');
        } 
    }
    function updateOrg(obj,e){
        e.stopPropagation();
        setIsCat(false);
        if(obj.orgKind == 'ORG'){
            dispatch({
                type:"organization/getOrg",
                payload:{
                    orgId:obj.id
                },
                callback:function(){
                    dispatch({
                        type:"organization/updateStates",
                        payload:{
                            orgAddModal:true
                        }
                    }) 
                }
            }) 
        }else{
            dispatch({
                type:"organization/getDept",
                payload:{
                    deptId:obj.id
                },
                callback:function(){
                    dispatch({
                        type:"organization/updateStates",
                        payload:{
                            deptItemUg:obj,
                            deptAddModal:true,
                        }
                    }) 
                }
            }) 
        }  
    }
    function catOrg(obj,e){
        e.stopPropagation();
        setIsCat(true);
        if(obj.orgKind == 'ORG'){
            dispatch({
                type:"organization/getOrg",
                payload:{
                    orgId:obj.id
                },
                callback:function(){
                    dispatch({
                        type:"organization/updateStates",
                        payload:{
                            orgAddModal:true
                        }
                    }) 
                }
            }) 
        }else{
            dispatch({
                type:"organization/getDept",
                payload:{
                    deptId:obj.id
                },
                callback:function(){
                    dispatch({
                        type:"organization/updateStates",
                        payload:{
                            deptItemUg:obj,
                            deptAddModal:true
                        }
                    }) 
                }
            }) 
        }  
    }
    function deleteOrgDept(record, e){
        e.stopPropagation();
        setIsCat(false);
        if(!record.id && !orgDeptIds.length){
            message.error('请先选择需要删除的数据');
            return;
        }
        const ids = orgDeptIds.length?orgDeptIds.join(','):"";
        Modal.confirm({
            title: '确认删除',
            content: '确认删除',
            okText: '删除',
            cancelText: '取消',
            mask: false,
            maskClosable:false,
            getContainer:() =>{
               return document.getElementById('organization_container');
            },
            onOk() {
                dispatch({
                    type:"organization/deleteOrgDept",
                    payload:{
                        orgIds:record.id?record.id:ids
                    },
                    callback:function(){                
                       if(record && record.parentId!=0 && selectedOrgRows.length==1) {
                        console.log(record, selectedOrgRows[0],'519------')
                        // dispatch({
                        //     type:"organization/getOrgChildren",
                        //     payload:{
                        //         nodeType:'DEPT',
                        //         orgCenterId:record.orgCenterId || selectedOrgRows[0].orgCenterId,
                        //         nodeId:record.parentId  || selectedOrgRows[0].parentId,
                        //         start:1,
                        //         limit:200
                        //     },
                        // })
                        dispatch({
                            type: 'organization/getOrgTreeList',
                            payload: {
                              parentId:record.parentId  || selectedOrgRows[0].parentId,
                              start:1,
                              limit:1000,
                              orgKind: 'ORG_',
                              searchWord:''
                            },
                        });
                       } else {
                        dispatch({
                            type:"organization/getTenantOrg",
                            payload:{
                                tenantId:organizationId,
                                start:organizationArea.currentPage,
                                limit:organizationArea.limit
                            },
                            callback: function() {
                                dispatch({
                                    type:"organization/updateStates",
                                    payload:{
                                        expandOrgList: [],
                                        selectedOrgRows:[],
                                        orgItemUg: {}
                                    }
                                })
                            }
                        })
                        setParentOrgName('');
                       }   
                    }
                })
            }
        });
    }
    function loop(array,row){
        for(var i=0;i<array.length;i++){
        //   if(nodeId == array[i]['nodeId']){
        //     if(children.length > 0){
        //       array[i]['children'] = children
        //     }else{
        //       array[i]['children'] = null
        //     }
            
        //   }
        //   if(array[i].children&&array[i].children.length!=0){
        //     loop(array[i].children,children,nodeId)
        //   }
            if(row.nodeId == array[i]['nodeId']){ 
                array[i]['nodeName'] = row.nodeNames
                array[i]['nodeNames'] = row.nodeNames
                array[i]['nodeNumber'] = row.nodeNumbers
                array[i]['nodeNumbers'] = row.nodeNumbers
            }
            if(array[i].children&&array[i].children.length!=0){
                loop(array[i].children,row)
            }
        }
        return array
    }
    //表格编辑事件失焦
    function handleSave(row){
        // if(row.nodeName == row.nodeNames && row.nodeNumbers == row.nodeNumber){
        //     return
        // }
        // name = row.nodeNames   id = row.nodeId
        if(row.nodeType == 'DEPT'){
            dispatch({
                type:"organization/updateDept",
                payload:{
                    id:row.nodeId,
                    deptName:row.nodeNames,
                    orgNumber:row.nodeNumber
                },
                callback:function(){
                    // let deptData = loop(orgClildrens,row)
                    // dispatch({
                    //     type: 'updateStates',
                    //     payload:{
                    //         orgClildrens:deptData,
                    //     }
                    // })
                    // dispatch({
                    //     type:"organization/getOrgChildren",
                    //     payload:{
                    //         nodeType:'DEPT',
                    //         orgCenterId:organizationId,
                    //         nodeId:row.parentId
                    //     },
                    //     callback:function(){
                    //         if(row.children && row.children.length > 0){
                    //             let deptData = loop(orgClildrens,row.children,row.nodeId)
                    //             dispatch({
                    //                 type: 'updateStates',
                    //                 payload:{
                    //                   orgClildrens:deptData,
                    //                 }
                    //             })
                    //         }
                    //     }
                    // }) 
                }
            }) 
        }else{
            dispatch({
                type:"organization/updateOrgChildren",
                payload:{
                    id:row.nodeId,
                    orgName:row.nodeNames,
                    orgNumber:row.nodeNumber
                },
                callback:function(){
                    // if(!row.parentId){
                    //     dispatch({
                    //         type:"organization/updateStates",
                    //         payload:{
                    //             orgClildrens:[]
                    //         }
                    //     })
                    // }
                    // dispatch({
                    //     type:"organization/getOrgChildren",
                    //     payload:{
                    //         nodeType:'DEPT',
                    //         orgCenterId:organizationId,
                    //         nodeId:row.parentId ? row.parentId : ''
                    //     },
                    //     callback:function(){
                    //         if(row.children && row.children.length > 0){
                    //             let deptData = loop(orgClildrens,row.children,row.nodeId)
                    //             dispatch({
                    //                 type: 'updateStates',
                    //                 payload:{
                    //                   orgClildrens:deptData,
                    //                 }
                    //             })
                    //         }
                    //     }
                    // }) 
                }
            }) 
        }

        let deptData = loop(orgClildrens,row)
        dispatch({
            type: 'updateStates',
            payload:{
                orgClildrens:deptData,
            }
        })
    };
    const components = {
        body: {
          row: EditableRow,
          cell: EditableCell
        }
    };
    //获取选中节点的单位节点
    // function getParentKey(nodeKey, tree){
    //     for (let i = 0; i < tree.length; i++) {
    //         const node = tree[i];
    //         if (node['children']) {  
    //             if (node['children'].some(item => item['nodeId'] === nodeKey)) {
    //                 if(node['nodeType'] == 'ORG'){
    //                     orgId = node.nodeId
    //                 }else{
    //                     getParentKey(node['nodeId'], orgClildrens);
    //                 }
                    
    //             }else if(node.children && node.children.length > 0){
    //                 getParentKey(nodeKey, node.children)
    //             }
    //         }
    //     }
    // };
    function onSearchOrg(value){
        organizationArea.currentPage = 1;
        // organizationArea.limit = 10;
        organizationArea.searchWord = value;
        setInputValue(value);
        if(checkWOrd(value)){
            message.error('查询条件不支持特殊字符，请更换其它关键字！')
            return
        }

        if(value) {
            dispatch({
                type:'organization/getOrgShare',
                payload:{
                    orgCenterId: orgClildrens && orgClildrens[0]?orgClildrens[0].orgCenterId:orgCenterId,
                },
                callback: function(data) {
                    // 租户共享使用别人的组织中心，进行组织机构查询的时候，要在共享使用的范围下进行查询，不能查询到没有权限的
                    dispatch({
                        type:"organization/getOrgByCenter",
                        payload:{
                            type:'DEPT',
                            orgCenterId:organizationId == data.createTenantId?orgCenterId:"",
                            tenantId:organizationId == data.createTenantId?"":organizationId,
                            searchWord:value,
                            start: 1,
                            limit: organizationArea.limit
                        }
                    }) 
                }
            })
         
        } else {
            dispatch({
                type:"organization/getTenantOrg",
                payload:{
                    tenantId:organizationId,
                    start: 1,
                    limit: organizationArea.limit
                }
            })
        }
    }
    //-----------单位 end

    //-----------用户 start
    const userTableProp = {
        rowKey: 'id',
        size: 'middle',
        columns: [
            {
                title:'序号',
                width: 70,
                dataIndex:'index',
                render:(value,obj,index)=><span>{index+1}</span>
            },
            {
                title: '姓名',
                dataIndex: 'userName',
                ellipsis: {
                    showTitle: false,
                },
                render: (address, record) => (
                    // <div>{address}</div>
                    <Tooltip placement="topLeft" title={address}>
                        <a onClick={userCat.bind(this,record)}>{address}</a>
                    </Tooltip>
                ),
            },
            {
                title: '账号',
                dataIndex: 'userAccount',
                ellipsis: {
                    showTitle: false,
                }
            },
            {
                title: '身份',
                dataIndex: 'identityFullName',
                ellipsis: {
                    showTitle: false,
                }
            },
            {
                title: '启用状态',
                dataIndex: 'isEnable',
                ellipsis: {
                    showTitle: false,
                },
                // render:text=>{return text==1?'是':'否'}
                render:(text, record)=>{
                    return <span onClick={stopProp.bind(this)}>
                         <Switch checked={text=='1'? true : false } onChange={identityEnable.bind(this,record)} style={{color:'red'}} className={styles.switch}/>
                    </span>
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                ellipsis: {
                    showTitle: false,
                },
                render: (text,record)=>{return <div>
                    <Space>
                        <a className={styles.fontSize7} onClick={userAdd.bind(this,record)}>修改</a>
                        {/* <a className={styles.fontSize7} onClick={userCat.bind(this,record)}>查看</a> */}
                        <a className={styles.fontSize7} onClick={userDelete.bind(this,record.id)}>移除</a>
                        {/* <a className={styles.fontSize7} onClick={identityPost.bind(this,record)}>身份</a> */}
                    </Space>
                </div>}
            },
        ],
        dataSource: userLists,
        pagination: false,
        rowSelection: {
          selectedRowKeys: userIds,
          onChange: (selectedRowKeys, selectedRows) => {
            dispatch({
              type: 'organization/updateStates',
              payload: {
                userIds: selectedRowKeys
              }
            })
          },
        },
    }
    function userAdd(obj){
        userUg.userId = obj.userId;
        console.log(obj, '831')
        setIsCat(false);
        // 租户/用户新增功能
        if(!orgItemUg.id){
            message.error('请先选择单位或部门');
            return
        }
        if(obj.userId){
            //修改 
            dispatch({
                type:"organization/getIdUsers",
                payload:{
                    userId:obj.userId,
                    orgCenterId:obj.orgCenterId
                },
                callback:function(){
                    dispatch({
                        type:"organization/updateStates",
                        payload:{
                            userAddModal:true,
                        }
                    })
                }
            }) 
        }else{
            dispatch({
                type:"organization/updateStates",
                payload:{
                    userAddModal:true,
                    userUg:obj
                }
            }) 
        }   
    }
    function userCat(obj){
        setIsCat(true);
        if(!orgItemUg.id){
            message.error('请先选择单位或部门');
            return
        }
        if(obj.userId){
            //修改 
            dispatch({
                type:"organization/getIdUsers",
                payload:{
                    userId:obj.userId,
                    // orgRefUserId:obj.id,
                    orgCenterId:obj.orgCenterId
                },
                callback:function(){
                    dispatch({
                        type:"organization/updateStates",
                        payload:{
                            userAddModal:true,
                        }
                    })
                }
            }) 
        }else{
            dispatch({
                type:"organization/updateStates",
                payload:{
                    userAddModal:true,
                    userUg:obj
                }
            }) 
        }   
    }
    function userDelete(id){
        let ids = '';
        if(id){
            ids = id;
        }else{
            if(userIds.length > 0){
                ids = getByIdJs(userIds)
            }else{
                message.error('请先选择需要移除的数据');
                return
            }
        }
        Modal.confirm({
            title: '确认移除',
            content: '确认移除',
            okText: '移除',
            cancelText: '取消',
            mask: false,
            maskClosable:false,
            getContainer:() =>{
               return document.getElementById('organization_container');
            },
            onOk() {
                dispatch({
                    type:"organization/deleteUsers",
                    payload:{
                        identityIds:ids?ids:id,
                    },
                    callback:function(){
                        // let start = userLists.length > 1? 
                        let orgIds = orgItemUg.orgKind == 'ORG' ? orgItemUg.id : orgItemUg.id;
                        let deptIds = orgItemUg.orgKind == 'DEPT' ? orgItemUg.id : orgItemUg.id;
                        let orgCenterIds = orgItemUg.orgCenterId;
                        getUser(userArea.currentPage,userArea.limit,'',orgIds,deptIds, orgCenterIds)
                    }
                })
            }
        });
    }
    function userRemove(){
        let ids = [];
        if(userIds.length > 0){
            userIds.forEach(function(item,i){
                userLists.some(function(policy,j){
                    if(policy['userId'] === item){
                        ids.push(policy.id)
                    }
                })
            })
            ids = getByIdJs(ids)
        }else{
            message.error('请先选择需要移除的数据');
            return
        }
        Modal.confirm({
            title: '确认移除',
            content: '确认移除',
            okText: '移除',
            cancelText: '取消',
            mask: false,
            maskClosable:false,
            getContainer:() =>{
               return document.getElementById('organization_container');
            },
            onOk() {
                dispatch({
                    type:"organization/removeUsers",
                    payload:{
                        orgRefUserIds:ids
                    },
                    callback:function(){
                        let orgIds = orgItemUg.orgKind == 'ORG' ? orgItemUg.id : orgId;
                        let deptIds = orgItemUg.orgKind == 'DEPT' ? orgItemUg.id : '';
                        getUser(userArea.currentPage,userArea.limit,'',orgIds,deptIds,'')
                    }
                })
            }
        });
        
    }
    function onAddSubmit(values){
        values.orgId = orgId;
        values.deptId = orgItemUg.orgKind == 'DEPT' ? orgItemUg.id : '';
        if(userUg.userId){
            //修改
            values.userId = userUg.userId;
            values.orgCenterId = orgCenterId;
            dispatch({
                type:"organization/updateUsers",
                payload:{
                    ...values
                },
                callback:function(){
                    let orgIds = orgItemUg.id;
                    let deptIds = orgItemUg.id;
                    getUser(userArea.currentPage,userArea.limit,'',orgIds,deptIds, orgCenterId)
                }
            })
        }else{
            //新增
            dispatch({
                type:"organization/addUsers",
                payload:{
                    ...values
                },
                callback:function(dataCode){
                    let orgIds = orgItemUg.orgKind == 'ORG' ? orgItemUg.id : orgId;
                    let deptIds = orgItemUg.orgKind == 'DEPT' ? orgItemUg.id : '';
                    if(dataCode == 'ALERT_DESIGN_PLATFORM_USER_ADD_USER_CONFIRM'){
                        Modal.confirm({
                            title: '确认',
                            content: '该用户已存在，是否保存添加用户与当前组织的关系',
                            okText: '保存',
                            cancelText: '取消',
                            mask: false,
                            maskClosable:false,
                            getContainer:() =>{
                               return document.getElementById('organization_container');
                            },
                            onOk() {
                                dispatch({
                                  type: 'organization/addUsers',
                                  payload:{
                                    ...values,
                                    isConfirm:1
                                  },
                                  callback:function(dataCode){
                                    if(dataCode == '200'){
                                        getUser(userArea.currentPage,userArea.limit,'',orgIds,deptIds,'')
                                    }
                                  }
                                })
                            }
                        });
                    }else{
                        getUser(userArea.currentPage,userArea.limit,'',orgIds,deptIds)
                    }
                    
                    
                }
            }) 
        }
        dispatch({
            type:"organization/updateStates",
            payload:{
                userAddModal:false
            }
        }) 
    }

    function userImport(){
        if(!organizationId){
            message.error('请选择一个租户');
            return;
        }
        dispatch({
            type: 'organization/updateStates',
            payload: {
              importModal:true
            }
        })
    }
    
    
    function getUser(start,limit,searchWord,orgId,deptId, orgCenterId){
        dispatch({
            type:"organization/getUser",
            payload:{
                start:start,
                limit:limit,
                searchWord:searchWord,
                orgId:orgId,
                type: 'SELF',
                deptId:deptId,
                orgCenterId: orgCenterId
            }
        }) 
        setTimeout(()=>{
            setUserLoading(false)
        },200)
    }
    function getUsers(start,limit,searchWord){
        dispatch({
            type:"organization/getUsers",
            payload:{
                // tenantId:tenantId == -1 ? '' : tenantId,
                start:start,
                limit:limit,
                searchWord:searchWord,
                isEnable: 1
            }
        }) 
    }
    function userJoin(){
        if(!orgItemUg.id){
            message.error('请先选择单位或部门');
            return
        }
        getUsers(1,10,'');
        let orgParentIds = orgItemUg.orgKind == 'ORG'?'':orgItemUg.orgParentId;
        getPost(1,10,'',orgItemUg.id,orgParentIds);
        dispatch({
            type: 'organization/updateStates',
            payload: {
              joinModal:true
            }
        })
        organizationArea.currentPage = 1;
    }
    function onSearchUser(value){
        if(checkWOrd(value)){
            message.error('查询条件不支持特殊字符，请更换其它关键字！')
            return
        }
        if(!orgItemUg.id){
            message.error('请先选择单位或部门');
            return
        }
        let orgIds = orgItemUg.id;
        let deptIds = orgItemUg.id;
        userArea.currentPage=1
        getUser(1,userArea.limit,value,orgIds,deptIds,orgCenterId)
        userArea.searchWord = value
        dispatch({
            type: 'layoutG/updateStates',
            payload:{
                searchObj
            }
        })
    }
    function identityPost(obj){
        //orgItemUg.nodeId
        dispatch({
            type:"organization/getIdentity",
            payload:{
                userId:obj.userId,
                orgCenterId:organizationId
            },
            callback:function(){
                dispatch({
                    type:"organization/identityPost",
                    payload:{
                      nodeType:'POST',
                      orgCenterId:organizationId,
                      identityParent:[],
                      start:1,
                      limit:200
                    },
                    callback:function(){
                        dispatch({
                            type:"organization/updateStates",
                            payload:{
                                identityModal:true,
                                userUg:obj
                            }
                        }) 
                    }
                }) 
            }
        })    
        
    }
    function stopProp(e) {
        e.stopPropagation();
    }
    function onEnable(record,text) {
        // 组织中心启用禁用
        dispatch({
            type: 'organization/orgEnable',
            payload:{
              type:text===true?1:0,
              orgIds:record.id
            },
            callback:function(){
                const loopTree=(data,record)=>{
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        if(element.id==record.id){
                            element.isEnable=element.isEnable==1?0:1
                            return data
                        }else if(element.children&&element.children.length){
                            loopTree(element.children,record)
                        }
                    }
                    return data
                }
                dispatch({
                    type: 'updateStates',
                    payload:{
                        orgClildrens:loopTree(orgClildrens,record),
                    }
                })
                // dispatch({
                //     type:"organization/getTenantOrg",
                //     payload:{
                //         tenantId:organizationId,
                //         start:organizationArea.currentPage,
                //         limit:organizationArea.limit
                //     }
                // })
            }
          })
    }
    function identityEnable(record,text) {
        // 用户启用禁用
        dispatch({
            type: 'organization/identityEnable',
            payload:{
              type:text===true?1:0,
              identityIds:record.id
            },
            callback:function(){
                let orgCenterIds = orgItemUg.orgKind == 'ORG' ? orgItemUg.orgCenterId : orgCenterId;
                getUser(1,10,'',orgItemUg.id,orgItemUg.id,orgCenterIds);
            }
          })
    }
    function postEnable(record,text) {
        // 岗位启用禁用
        dispatch({
            type: 'organization/postEnable',
            payload:{
              type:text===true?1:0,
              postIds:record.id
            },
            callback:function(){
                getPost(1,10,'',orgItemUg.id,'')
            }
          })
    }
    //-----------用户 end

    //-----------岗位 start
    const postTableProp = {
        rowKey: 'id',
        size: 'middle',
        columns: [
            {
                title:'序号',
                dataIndex:'index',
                width: 70,
                render:(value,obj,index)=><span>{index+1}</span>
            },
            {
                title: '岗位名称',
                dataIndex: 'postName',
                width: 150,
                ellipsis: {
                    showTitle: false,
                },
                render: (address, record) => (
                    <Tooltip placement="topLeft" title={address}>
                        <a onClick={postCat.bind(this,record)}>{address}</a>
                    </Tooltip>
                ),
            },
            {
                title: '岗位编码',
                dataIndex: 'postNumber',
                width: 150,
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
                width: 150,
                ellipsis: {
                    showTitle: false,
                },
                // render:text=>{return text==1?'是':'否'}
                render:(text, record)=>{
                    return <span onClick={stopProp.bind(this)}>
                         <Switch checked={text=='1'? true : false } onChange={postEnable.bind(this,record)} style={{color:'red'}} className={styles.switch}/>
                    </span>
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 150,
                ellipsis: {
                    showTitle: false,
                },
                render: (text,record)=>{return <div>
                    <Space>
                        <a className={styles.fontSize7} onClick={postUpdate.bind(this,record)}>修改</a>
                        {/* <a className={styles.fontSize7} onClick={postCat.bind(this,record)}>查看</a> */}
                        <a className={styles.fontSize7} onClick={postDelete.bind(this,record.id)}>删除</a>
                    </Space>
                </div>}
            },
        ],
        dataSource: postLists,
        pagination: false,
        rowSelection: {
          selectedRowKeys: postIds,
          onChange: (selectedRowKeys, selectedRows) => {
            dispatch({
              type: 'organization/updateStates',
              payload: {
                postIds: selectedRowKeys
              }
            })
          },
        },
    }
    function getPost(start,limit,searchWord,orgId, orgParentId){
        dispatch({
            type:"organization/getPosts",
            payload:{
                start:start,
                limit:limit,
                searchWord:searchWord,
                orgId:orgId,
                orgParentId: orgParentId
            }
        })  
        setTimeout(()=>{
            setUserLoading(false)
        },200)
    }
    function postAdd(){
        // 岗位新增
        setIsCat(false);
        if(!orgItemUg.id){
            message.error('请先选择单位或部门');
            return
        }
        if(orgItemUg.id){
            dispatch({
                type:"organization/updateStates",
                payload:{
                    postAddModal:true,
                    postUg:orgItemUg.id
                }
            }) 
        }else{
            dispatch({
                type:"organization/updateStates",
                payload:{
                    postAddModal:true,
                    postUg:{
                        isEnable:true
                    }
                }
            }) 
        }
        
    }
    //显示共享组织弹框
  const shareOrgModalFn=()=>{
    if(orgClildrens.length<1) {
        dispatch({
            type:'organization/updateStates',
            payload:{
              isShowShareOrgModal:true,
              checkTenantId:organizationId,
            }
          })
    } else {
        dispatch({
            type:'organization/getOrgShare',
            payload:{
                orgCenterId: orgClildrens && orgClildrens[0]?orgClildrens[0].orgCenterId:orgCenterId,
            },
            callback: function(data) {
                console.log(organizationId, data.createTenantId, '1357--')
                if(organizationId == data.createTenantId) {
                    message.error('当前租户已有属于自身的组织中心，不支持共享使用其它组织中心');
                    return;
                } else {
                    dispatch({
                        type:'organization/updateStates',
                        payload:{
                          isShowShareOrgModal:true,
                          checkTenantId:organizationId,
                        }
                      })
                }
            }
        })
    }
    //获取组织中心
    dispatch({
        type: 'organization/getOrgCenters',
        payload:{
          searchWord:'',
          start:1,
          limit:10000,
          noShare:1,
          onlyShareOrgTenant:1,
          excludeTenantId:organizationId
        }
    })
  }
    function postCat(obj){
        obj.parentOrgName = parentOrgName;
        obj.parentDeptName = parentDeptName;
        setIsCat(true);
        if(!orgItemUg.id){
            message.error('请先选择单位或部门');
            return
        }
        if(obj.id){
            dispatch({
                type:"organization/updateStates",
                payload:{
                    postAddModal:true,
                    postUg:obj
                }
            }) 
        }else{
            dispatch({
                type:"organization/updateStates",
                payload:{
                    postAddModal:true,
                    postUg:{
                        isEnable:true
                    }
                }
            }) 
        }
        
    }
    function postUpdate(obj){
        obj.parentOrgName = parentOrgName;
        obj.parentDeptName = parentDeptName;
        setIsCat(false);
        if(!orgItemUg.id){
            message.error('请先选择单位或部门');
            return
        }
        if(obj.id){
            dispatch({
                type:"organization/updateStates",
                payload:{
                    postAddModal:true,
                    postUg:obj,
                }
            }) 
        }else{
            dispatch({
                type:"organization/updateStates",
                payload:{
                    postAddModal:true,
                    postUg:{
                        isEnable:true,
                        parentOrgName: parentOrgName,
                        parentDeptName: parentDeptName
                    }
                }
            }) 
        }
        
    }
    function onAddPostSubmit(values){
        if(postUg.id){
            //修改
            values.id = postUg.id;
            values.orgCenterId = postUg.orgCenterId;
            dispatch({
                type: 'organization/updatePosts',
                payload: {
                    ...values
                },
                callback:function(){
                    getPost(postArea.currentPage,postArea.limit,'',postUg.orgId,postUg.orgParentId)
                }
            })
        }else{
            //新增
            values.orgId = orgItemUg.id;
            values.deptId = orgItemUg.orgKind == 'DEPT' ? orgItemUg.id : '';
            // 新增添加参数
            values.PostOrgType = orgItemUg.orgKind == 'DEPT' ? 2 : 1;
            values.OrgCode = orgItemUg.orgKind == 'DEPT' ? orgItemUg.nodeCode : orgItemUg.orgCode;
            dispatch({
                type: 'organization/addPosts',
                payload: {
                    ...values
                },
                callback:function(){
                    let orgIds = orgItemUg.orgKind == 'ORG' ? orgItemUg.id : orgItemUg.id;
                    let orgParentIds = orgItemUg.orgKind == 'ORG'?'':'';
                    getPost(postArea.currentPage,postArea.limit,'',orgIds,orgParentIds)
                }
            })
        }
    }
    function postDelete(id){
        let ids = '';
        if(id){
            ids = id;
        }else{
            if(postIds.length > 0){
                ids = getByIdJs(postIds)
            }else{
                message.error('请先选择需要删除的数据');
                return
            }
        }
        Modal.confirm({
            title: '确认删除',
            content: '确认删除',
            okText: '删除',
            cancelText: '取消',
            mask: false,
            maskClosable:false,
            getContainer:() =>{
               return document.getElementById('organization_container');
            },
            onOk() {
                dispatch({
                    type:"organization/deletePosts",
                    payload:{
                        postIds:ids
                    },
                    callback:function(){
                        let orgIds = orgItemUg.orgKind == 'ORG' ? orgItemUg.id : orgItemUg.id;
                        let orgParentIds = orgItemUg.orgKind == 'ORG'?'':'';
                        getPost(postArea.currentPage,postArea.limit,'',orgIds,orgParentIds)
                    }
                })
            }
        });
        
    }
    function updateSearchObj() {
        dispatch({
            type: 'organization/updateStates',
            payload:{
              searchObj
            }
        })
    }
    function onChangeSearchWordTenant(e) {
        organizationArea.searchWord = e.target.value;
        updateSearchObj();
    }
    function onChangeSearchWordUser(e) {
        userArea.searchWord = e.target.value;
        updateSearchObj();
    }
    function onChangeSearchWordPost(e) {
        postArea.searchWord = e.target.value;
        updateSearchObj();
    }
    function getTabNum(key) {
        if(selectedOrgRows.length<1) {
            message.error('请先选择单位或部门');
            return;
        }
        postArea.searchWord = '';
        userArea.searchWord = '';
        getPost(1,10,'',orgItemUg.id,'');
        let orgCenterIds = orgItemUg.orgKind == 'ORG' ? orgItemUg.orgCenterId : orgCenterId;
        getUser(1,10,'', orgItemUg.id, orgItemUg.id,orgCenterIds);
        setTabNum(key);
    }
    function changePage(page,size) {
        organizationArea.currentPage = page;
        organizationArea.limit = size;
        updateSearchObj();
        if(inputValue) {
            dispatch({
                type:"organization/getOrgByCenter",
                payload:{
                    type:'DEPT',
                    orgCenterId:orgCenterId,
                    searchWord:inputValue,
                    start: page,
                    limit: size
                }
            }) 
        } else {
            dispatch({
                type:"organization/getTenantOrg",
                payload:{
                    tenantId:organizationId,
                    start: page,
                    limit: size
                }
            })
        }
    }
    function refreshDataFn(page, size) {
        changePage(page,size);
        setTimeout(()=>{
            setLoading(false)
        },200)
    }
    function changePageUser(page, size) {
        userArea.currentPage = page;
        userArea.limit = size;
        let orgCenterIds = orgItemUg.orgKind == 'ORG' ? orgItemUg.orgCenterId : orgCenterId;
        dispatch({
            type: 'layoutG/updateStates',
            payload:{
              searchObj
            }
        })
        getUser(page,size,userArea.searchWord, orgItemUg.id, orgItemUg.id,orgCenterIds);
    }
    function changePagePost(page, size) {
        postArea.currentPage = page;
        postArea.limit = size;
        dispatch({
            type: 'layoutG/updateStates',
            payload:{
                searchObj
            }
        })
        getPost(page,size,postArea.searchWord,orgItemUg.id,'')
    }
    function onSearchPost(value){
        if(checkWOrd(value)){
            message.error('查询条件不支持特殊字符，请更换其它关键字！')
            return
        }
        if(!orgItemUg.id){
            message.error('请先选择单位或部门');
            return
        }
        let orgIds = orgItemUg.orgKind == 'ORG' ? orgItemUg.id : orgItemUg.id;
        let deptIds = orgItemUg.orgKind == 'DEPT' ? orgItemUg.id : '';
        let orgParentIds = orgItemUg.orgKind == 'ORG'?'':orgItemUg.orgParentId;
        getPost(1,postArea.limit,value,orgIds,orgParentIds)
        postArea.searchWord = value
        postArea.currentPage=1
        dispatch({
            type: 'layoutG/updateStates',
            payload:{
                searchObj
            }
        })
    }
    //-----------岗位 end
    
    function onAddCancel(){
        dispatch({
            type:"organization/updateStates",
            payload:{
                orgAddModal:false,
                userAddModal:false,
                postAddModal:false,
                deptAddModal:false,
                joinModal:false,
                identityModal:false,
                importModal:false,
                orgImportModal:false,
                importData:{}
            }
        })
        dispatch({
            type:"organization/updateStatesSelf",
            payload:{
                fileName:'',
                needfilepath:''
            }
        })
        // organizationArea.currentPage = 1;
    }


    const menu = (
        <Menu onClick={handleMenuClick}>
          <Menu.Item  key="1">
            <a target="_blank" >
              部门信息导入
            </a>
          </Menu.Item>
          <Menu.Item  key="2">
            <a target="_blank">
              单位信息导入
            </a>
          </Menu.Item>
        </Menu>
      );

      function handleMenuClick(e) {
        if(!organizationId) {
            message.error('请选择一个租户');
            return;
        }
        setPostOrOrg(e.key)
        dispatch({
            type: 'organization/updateStates',
            payload: {
               orgImportModal:true
            }
        })
      }


    return (
        <div style={{height:'100%'}}>
            <div className={styles.addMain}>
                <DragLeftRight
                suffix={'organization'}
                leftChildren={
                    <div style={{width:'100%',overflow:'hidden',height:'100%'}}>
                        <div className={styles.other} style={{margin:8}}>
                            <Input.Search 
                                className={styles.search}
                                placeholder={'组织名称/编码'}
                                allowClear
                                value={organizationArea.searchWord}
                                onChange={onChangeSearchWordTenant.bind(this)}
                                onSearch={(value)=>{onSearchOrg(value)}}
                            />
                            <Space>
                                {tenantOrgShare=='YES'?<Button className={styles.fontSize7} onClick={shareOrgModalFn.bind(this)} >选择组织中心</Button>:''}
                                <Button onClick={addOrg} className={styles.fontSize7}>新增单位</Button>
                                <Button onClick={addDept} className={styles.fontSize7}>新增部门</Button>
                                <Button onClick={deleteOrgDept.bind(this,'')} className={styles.fontSize7}>删除</Button>
                                <Dropdown overlay={menu} arrow>
                                    <Button className={styles.fontSize7}>导入</Button>
                                </Dropdown>
                            </Space>
                        </div>
                        <div style={{height:'calc(100% - 45px)'}}>
                            <Spin spinning={loading}>
                                <Table {...tableProps} key={loading} components={components} onExpand={onExpand.bind(this)} expandedRowKeys={expandOrgList} rowKey={record => record.id} scroll={{y:'calc(100% - 130px)'}} onRow={selectRow}/>
                            </Spin>
                        </div>
                        <IPagination
                            total={returnCount}
                            current={organizationArea.currentPage}
                            pageSize={organizationArea.limit}
                            onChange={changePage.bind(this)}
                            isRefresh={true}
                            refreshDataFn={() => {setLoading(true);refreshDataFn(1, organizationArea.limit)}}
                        />
                    </div>
                }
                rightChildren={
                    <div style={{width:'100%',padding:'0px 0 0 10px',overflow:'hidden',height:'100%',position:'relative'}} className='organizationTab'>
                        <div style={{display:'flex'}}>
                            <div>
                                <Tabs defaultActiveKey="1"  onChange={getTabNum}>
                                    <TabPane tab="用户" key="1">
                                    </TabPane>
                                    <TabPane tab="岗位" key="2">
                                    </TabPane>
                                </Tabs>
                            </div>
                            <div style={{width:'100%'}}>
                                {tabNum == '1' ? (<div className={styles.other} style={{margin:8}}>
                                        <Input.Search
                                            style={{width:'220px'}}
                                            placeholder={'姓名/账号/手机号/邮箱'}
                                            allowClear
                                            value={userArea.searchWord}
                                            onChange={onChangeSearchWordUser.bind(this)}
                                            onSearch={(value)=>{onSearchUser(value)}}
                                        />
                                    <Space>
                                        {/* <Button className={styles.fontSize7} onClick={userAdd.bind(this,{})} >新增</Button> */}
                                        <Button className={styles.fontSize7} onClick={userJoin} >加入</Button>
                                        {/* <Button className={styles.fontSize7} onClick={userRemove.bind(this,'')}>移除</Button> */}
                                        <Button className={styles.fontSize7} onClick={userDelete.bind(this,'')}>移除</Button>
                                        {/* <Button className={styles.fontSize7} onClick={userImport.bind(this)}>导入</Button> */}
                                    </Space>
                                </div>) : (<div className={styles.other} style={{margin:8}}>
                                    <Input.Search
                                        style={{width:'220px'}}
                                        placeholder={'岗位名称/编码'}
                                        allowClear
                                        value={postArea.searchWord}
                                        onChange={onChangeSearchWordPost.bind(this)}
                                        onSearch={(value)=>{onSearchPost(value)}}
                                    />
                                    <Space>
                                        <Button onClick={postUpdate.bind(this,{})} className={styles.fontSize7}>新增</Button> 
                                        <Button className={styles.fontSize7} onClick={postDelete.bind(this,'')}>删除</Button>
                                        <Button className={styles.fontSize7} onClick={userImport.bind(this)}>导入</Button>
                                    </Space>
                                </div>)}
                            </div>
                        </div>
                        {tabNum == '1' ? 
                            <div style={{height:'calc(100% - 45px)'}}>
                                <Spin spinning={userLoading}>
                                    <Table {...userTableProp} key={loading} rowKey={record => record.id} scroll={{y:'calc(100% - 130px)'}}/>
                                </Spin>
                            </div>
                            : 
                            <div style={{height:'calc(100% - 45px)'}}>
                                <Spin spinning={userLoading}>
                                    <Table {...postTableProp} key={loading} scroll={{y:'calc(100% - 130px)'}}/>
                                </Spin>
                            </div>
                                }
                        {
                        tabNum == '1' ? 
                         <IPagination
                            total={returnCountUser}
                            current={userArea.currentPage}
                            pageSize={userArea.limit}
                            onChange={changePageUser.bind(this)}
                            isRefresh={true}
                            refreshDataFn={() => {setUserLoading(true); getUser(1,userArea.limit,userArea.searchWord,orgItemUg.id,orgItemUg.id,orgItemUg.orgKind == 'ORG' ? orgItemUg.orgCenterId : orgCenterId)}}
                        />         
                        :<IPagination
                            total={returnCountPost}
                            current={postArea.currentPage}
                            pageSize={postArea.limit}
                            onChange={changePagePost.bind(this)}
                            isRefresh={true}
                            refreshDataFn={() => {setUserLoading(true); getPost(1,postArea.limit,postArea.searchWord,orgItemUg.id,'')}}
                        />} 
                    </div>
                }
            />
            </div>
            {isShowShareOrgModal&&<SHAREORGMODAL location={location} container={'organization_container'}/>}
            {orgAddModal && (<ORGADD  //单位新增 
                loading={loading.global}
                onAddCancel={onAddCancel.bind(this)}
                orgUg={orgUg}
                isCat={isCat}
            />)}
            {deptAddModal && (<DEPTADD  //部门新增 
                loading={loading.global}
                onAddCancel={onAddCancel.bind(this)}
                orgId={orgId}
              //  orgUg={orgUg}
                isCat={isCat}
            />)}
            

            {userAddModal && (<ADD  //用户新增 
                loading={loading.global}
                onCancel={onAddCancel.bind(this)}
                currentUg={userUg}
                acountStatus={acountStatus}
                onAddSubmit = {onAddSubmit.bind(this)}
                isCat={isCat}
            />)}

            {postAddModal && (<POSTADD  //岗位新增 
                loading={loading.global}
                onAddCancel={onAddCancel.bind(this)}
                postUg={postUg}
                onAddSubmit = {onAddPostSubmit.bind(this)}
                isCat={isCat}
                selectedOrgRows={selectedOrgRows}
            />)}

            {joinModal && (<JOIN  //加入
                loading={loading.global}
                onCancel={onAddCancel.bind(this)}
                orgId={orgId}
               // postUg={postUg}
            />)}
            
            {identityModal && (<IDENTITY  //身份
                loading={loading.global}
                onCancel={onAddCancel.bind(this)}
               // postUg={postUg}
            />)}
            {importModal && (<IMPORTUSER  //导入
                loading={loading.global}
                onCancel={onAddCancel.bind(this)}
                importData={importData}
                tabNum={tabNum}
            />)}
            {orgImportModal && (<IMPORTORG  //导入
                loading={loading.global}
                onCancel={onAddCancel.bind(this)}
                importData={importData}
                postOrOrg={postOrOrg}
            />)}
        </div>
    )
}


  
export default (connect(({organization,layoutG,loading})=>({
    ...organization,
    ...layoutG,
    loading
  }))(addForm));
