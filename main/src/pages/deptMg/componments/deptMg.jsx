import { connect } from 'dva';
import {history} from 'umi';
import { Input,Button,message,Modal,Table,Dropdown,Menu, Tooltip} from 'antd';
import styles from '../../unitInfoManagement/index.less';
import _ from "lodash";
import { checkWOrd, dataFormat,getButton ,getButtonByUrl} from '../../../util/util.js'
import IPagination from '../../../componments/public/iPagination';
import CTM from '../../../componments/commonTreeMg'
import ADD from './addDeptForm'
import ImportDeptModal from './importDeptModal'
import ExportDeptModal from './exportDeptModal'
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import {components} from '../../../componments/sort';
import {DownOutlined} from '@ant-design/icons';
import VIEWORGPIC from '../../../componments/viewOrgPic';
import COMMONSORT from '../../../componments/commonSort'
import React from 'react'
import ColumnDragTable from '../../../componments/columnDragTable'
import {BASE_WIDTH,ORDER_WIDTH} from '../../../util/constant'
import searchIcon from '../../../../public/assets/search_black.svg'
const pathname = '/deptMg'  
var viewDetailsModalRef; //查看Modalref
// function DeptInfo ({dispatch,loading,orgs,expandedKeys,
//                     currentNodeId,currentNodeName,
//                     currentPage,returnCount,modalVisible,dept,deptdeptIds,
//                     currentParentid, currentParentDeptName,hasMore
//                   }){

class DeptInfo extends React.Component {
  state = {
    commonSort:false,
    columns:[],
    // sortData:[],
    isCat: false,
    inputValue: '',
    height:document.documentElement.clientHeight - 300,
    expandRows: false
  }
  componentDidMount() {
    window.addEventListener('resize',this.onResize.bind(this));
  }
  onResize() {
    this.setState({
      height: document.documentElement.clientHeight - 300,
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize',this.onResize.bind(this));
  }
  // componentDidMount(){
  //   const { depts,returnCount } = this.props
  //   this.loadMore(depts,returnCount);
  //   //添加滚动监听
  //   window.addEventListener('scroll', this.bindHandleScroll.bind(this))
  // }
  // componentWillReceiveProps(nextProps){
  //   const {depts } = this.props
  //   if(depts!=nextProps.depts){
  //     this.loadMore(nextProps.depts,nextProps.returnCount)
  //   }
  // }

  // bindHandleScroll(event){
  //   const { currentNodeId,currentPage,depts,returnCount } = this.props

  //   // 滚动的高度
  //   const scrollTop = (event.srcElement ? event.srcElement.documentElement.scrollTop : false)
  //   || window.pageYOffset
  //   || (event.srcElement ? event.srcElement.body.scrollTop : 0);
  //   //窗口可视区域高度
  //   var windowHeight = window.document.body.clientHeight;
  //   if(returnCount<=depts.length){
  //     return
  //   }
  //   if(windowHeight-scrollTop<300){
  //     console.log(scrollTop,windowHeight-scrollTop);
  //     this.getDepts(currentNodeId,currentPage*10)
  //   }

  // }
  // //加载更多
  // loadMore(depts,returnCount){
  //   const { dispatch,currentNodeId,currentPage } = this.props
  //   var el  = document.getElementById('table')
  //   var windowHeight = window.document.body.clientHeight;
  //   var elHeight = el.clientHeight;

  //   if(windowHeight - elHeight < 100){
  //     return
  //   }
  //   if(depts.length==0){
  //     return
  //   }
  //   if(returnCount<=depts.length){
  //     return
  //   }
  //   this.getDepts(currentNodeId,currentPage*10)
  // }
  // 

  // getDepts(nodeId,start,limit) {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'deptMg/getOrgChildren',
  //     payload: {
  //       nodeId,
  //       start,
  //       limit,
  //       nodeType: 'DEPT',
  //       onlySubDept: '1'
  //     },
  //   });
  // }
  getDepts(nodeId,start,limit) {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptMg/getOrgTreeList',
      payload: {
        parentId:nodeId,
        start,
        limit,
        orgKind: 'DEPT',
        searchWord:''
      },
    });
  }
  // getOrgChildren(nodeId,start,limit,type) {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'deptMg/newGetOrgChildren',
  //     payload: {
  //       nodeId,
  //       start:1,
  //       limit,
  //       nodeType: 'DEPT',
  //       onlySubDept: '1'
  //     },
  //     typeName:type
  //   });
  // }
  getOrgChildren(nodeId,start,limit,type) {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptMg/newGetOrgTreeList',
      payload: {
        parentId:nodeId,
        start,
        limit,
        orgKind: 'DEPT',
        searchWord:''
      },
      typeName:type
    });
  }

  onSearchTable(value) {
    if (checkWOrd(value)) {
      message.error('查询条件不支持特殊字符，请更换其它关键字！');
      return;
    }
    const { dispatch, currentNode, currentPage, limit } = this.props;
    const { key, id } = currentNode;
    if (!key) {
      message.error('请先选择单位');
      return;
    }
    dispatch({
      type: 'deptMg/updateStates',
      payload: {
        currentPage: 1,
        // limit: 10,
        searchWord: value,
        depts: []
      },
    });
    this.setState({
      inputValue: value
    })
    if (value) {
      dispatch({
        type: 'deptMg/getOrgTreeList',
        payload: {
          parentId:id,
          start:1,
          limit:limit,
          orgKind: 'DEPT',
          searchWord:value
        },
      });
      // dispatch({
      //   type: 'deptMg/getSearchTree',
      //   payload:{
      //     searchWord: value,
      //     type: 'DEPT',
      //     start:1,
      //     limit: 10,
      //     parentId: id
      //   }
      // })  
    } else {
      this.getDepts(key, 1, limit);
    }
  }


   onAdd(dept,index){

    const { dispatch,currentNode,selectedRows,deptIds, currentPage, limit,expandedKeys} = this.props
    const { key,nodeName } = currentNode;
    // this.setState({
    //   isCat: false,
    // })
    if (!key) {
      message.error('请选择上级单位/部门！');
      return;
    }
    if(JSON.stringify(dept) === '{}'){
      dept.isEnable = true;
      dept.orgName = currentNode.orgName;
      if(selectedRows.length>0) {
        dept.parentName = selectedRows[0].orgName.trim();
      }
    }
    if(dept.id){//修改操作
      dispatch({
        type: 'deptMg/getDept',
        payload:{
          deptId: dept.id
        }
      })
    } else {
      if(selectedRows.length > 1) {
        message.error('新增请选择一个部门');
        return;
      } else {
        // 新增部门
        dispatch({
          type: 'deptMg/updateStates',
          payload: {
            modalVisible: true,
            dept,
          },
        });
      }
    }
  }

  onCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptMg/updateStates',
      payload: {
        modalVisible: false,
        viewDeptPicModel:false,
        sortExpandedRowKeys:[]
      },
    });
    this.setState({commonSort:false,isCat:false})
  }

  onSubmit(values) {
    const { dispatch, currentNode, dept, currentPage, limit,selectedRows, expandedRowKeys} = this.props;
    const { key } = currentNode;
    if (dept.id) {
      dispatch({
        type: 'deptMg/updateDept',
        payload: {
          id: dept.id,
          orgId: dept.orgId,
          parentId: dept.parentId,
          ...values,
        },
      });
    } else {
      dispatch({
        type: 'deptMg/addDept',
        payload: {
          ...values,
          orgId: key,
          parentId: selectedRows && selectedRows[0]?selectedRows[0].id:key,
        },
      });
    }
  }

  onDelete(deptIds, isBatch) {
    const { dispatch, selectedRows } = this.props;
    if (deptIds) {
      Modal.confirm({
        title: '确认删除吗？',
        // content: '确认删除该部门',
        okText: '删除',
        cancelText: '取消',
        mask: false,
        maskClosable:false,
        getContainer:() =>{
          return document.getElementById('deptMg_container');
        },
        onOk() {
          dispatch({
            type: 'deptMg/deleteDept',
            payload: {
              deptIds,
            },
          });
        },
      });
      
    } else {
      message.error('请至少选择一个部门');
    }
  }

  onChangeSearchWord(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptMg/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });
  }

  importDept() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptMg/updateStates',
      payload: {
        isShowImportDeptModel: true,
      },
    });
  }
   loopTree(data){
    const { dispatch } = this.props;
    data.forEach((item,index)=>{
      // item.id = item.nodeId;
      // item.name = item.nodeName;
      if(item.isParent==1){
        // dispatch({
        //   type: 'deptMg/getOrgChildren',
        //   payload:{
        //     nodeId: item.nodeId,
        //     start:1,
        //     limit:200,
        //     nodeType: 'DEPT',
        //     onlySubDept: 1
        //   },
        //   callback:(data,childrenData)=>{
        //    const newData= childrenData.filter(item=>item.isEnable==1)
        //     item.children=newData
        //     this.loopTree(newData)
        //   }
        // })
        dispatch({
          type: 'deptMg/getOrgTreeList',
          payload:{
            parentId:item.id,
            start:1,
            limit:200,
            orgKind: 'DEPT',
            searchWord:''
          },
          typeName:'view',
          callback:(data,childrenData)=>{
           const newData= childrenData.filter(item=>item.isEnable==1)
            item.children=newData
            this.loopTree(newData)
          }
        })
      }
    })
    return data
  }
  //查看结构图  
  structureChart(){
    const { dispatch,currentNode,selectedRows,deptIds } = this.props
    const { key } = currentNode;
    if(key){
      dispatch({
        type: 'deptMg/orgChart',
        payload: {
          type:'DEPT',
          orgId:key
        },
        callback:(data)=>{
          const newData=data
          dispatch({
            type: 'deptMg/updateStates',
            payload: {
              viewDeptPicData:{'orgName':currentNode.orgName,orgKind:"ORG",children:this.loopTree(newData)},
              viewDeptPicModel: true,
            },
          });
        }
      });
    }else{
      message.error('请选择一个单位');
    }
    
  }

  onViewDetail(record) {
    const { dispatch } = this.props
    // this.setState({
    //   isCat: true
    // })
    // dispatch({
    //   type: 'deptMg/getDept',
    //   payload:{
    //     deptId: dept.nodeId
    //   }
    // })
    // const { dispatch } = this.props;
    dispatch({
      type: 'deptMg/getDeptForView',
      payload: {
        deptId: record.id,
      },
      callback: (data) => {
        // const { dept } = this.props;
        this.showViewDetail(data);
      },
    });
    // this.showViewDetail(record);
  }

  showViewDetail(record) {
    this.onAdd(record)
    this.setState({
      isCat:true
    })
    // viewDetailsModalRef.show([
    //   { key: '部门名称', value: record.deptName },
    //   { key: '部门简称', value: record.deptShortName },
    //   { key: '所属单位', value: record.orgName },
    //   { key: '上级部门', value: record.parentName },
    //   { key: '部门编码', value: record.orgNumber },
    //   { key: '是否启用', value: record.isEnable, type: 1 },
    //   { key: '创建时间', value: record.createTime, type: 2 },
    //   { key: '部门描述', value: record.deptDesc, type: 3 },
    // ]);
  }

  onImportModalCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptMg/updateStates',
      payload: {
        isShowImportDeptModel: false,
        isShowExportDeptModel: false,
        importData: {},
        fileName:''
      },
    });
  }
  handleSave(record){
    const { dispatch } = this.props;
    let arr = [];
    arr.push(record)
    dispatch({
      type: 'deptMg/updateStates',
      payload: {
        depts: arr,
      },
    });
  }
  OperatingMoreMenu(){
    const {user} = this.props;
    const { menus ,menusUrlList}= user
    return <Menu onClick={this.onMenuClick.bind(this)}>
              {getButtonByUrl(menusUrlList,'export','','/deptMg')&&<Menu.Item key="export">导出</Menu.Item>}
              {getButtonByUrl(menusUrlList,'import','','/deptMg')&&<Menu.Item key="import">导入</Menu.Item>}
              {getButtonByUrl(menusUrlList,'enable','','/deptMg')&&<Menu.Item key="enable">启用</Menu.Item>}
              {getButtonByUrl(menusUrlList,'disable','','/deptMg')&&<Menu.Item key="disable">停用</Menu.Item>}
              {getButtonByUrl(menusUrlList,'sort','','/deptMg')&&<Menu.Item key="sort">排序</Menu.Item>}
              {/* <Menu.Item key="sort">排序</Menu.Item> */}
    </Menu>
  }
  onMenuClick(event){
    const { key } = event;
    switch(key){
      case 'import' :
        this.importDept()
        break;
      case 'export' :
        this.exportDept()
        break;  
      case 'sort' :
        this.onCommonSort()
        break;  
      case 'enable' :
        this.enableDept('enable')
        break;  
      case 'disable' :
        this.enableDept('disable')
        break;  
    }
  };
  exportDept(){
    const { dispatch, currentNode} = this.props;
    const time=Math.round(new Date().getTime() / 1000)
    const str=dataFormat(time, 'YYYY-MM-DD HH:mm:ss') 
    currentNode.newFileName = `部门信息管理${str.replace(/[-\s:]/g, '')}`;
    dispatch({
      type: 'deptMg/updateStates',
      payload: {
        isShowExportDeptModel: true,
      },
    });
  }
  //排序
  onCommonSort(){
    const { dispatch, currentNode } = this.props;
    const { key} = currentNode;
    if(key){
      this.setState({
        columns:[{
          title: '序号',
          dataIndex: 'index',
          width:'10%',
          render:(value,obj,index)=><span>{index+1}</span>
          },{
          title: '部门名称',
          dataIndex: 'orgName',
          width:'35%'
        },{
          title: '部门编码',
          dataIndex: 'orgNumber',
          width:'35%'
        }]
      })
      // dispatch({
      //   type: 'deptMg/getOrgChildren',
      //   payload: {
      //     nodeId: key,
      //     start:1,
      //     limit:200,
      //     nodeType: 'DEPT',
      //     onlySubDept: 1
      //   },
      //   typeName:'sort',
      //   callback:(list) =>{
      //     this.setState({commonSort:true,})
      //   }
      // })
      dispatch({
        type: 'deptMg/getOrgTreeList',
        payload: {
          parentId:key,
          start:1,
          limit:200,
          orgKind: 'DEPT',
          searchWord:''
        },
        typeName:'sort',
        callback:(list) =>{
          this.setState({commonSort:true,})
        }
      });
      
    }else{
      message.error('请选择所属单位')
    }
  }
  saveCallBack(list){
    const { dispatch,currentNode,limit,currentPage, depts} = this.props;
    const { key, nodeType, id} = currentNode;
    let arr = [];
    var reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
    const flag= list.every(item=>reg.test(item.sort))
    if(!flag){
      message.error('最大支持9位整数，6位小数')
    }else{
      list.forEach(function(item,i){
        let obj = {
          sort:item.sort,
          orgId:item.id
        }
        arr.push(obj)
      })
      dispatch({
        type: 'deptMg/orgSort',
        payload:{
          json:JSON.stringify(arr)
        },
        callback:(data) =>{
          dispatch({
            type: 'deptMg/updateStates',
            payload:{
              depts: [],
              sortExpandedRowKeys:[]
            }
          })
          this.setState({commonSort:false})
          this.getDepts(id, currentPage, limit, 'DEPT');
        }
      })
    }
  }
  changePage(page,size) {
    const { dispatch, currentNode} = this.props;
    const { key,id } = currentNode;
    dispatch({
      type: 'deptMg/updateStates',
      payload:{
        currentPage: page,
        limit: size,
        depts: [],
        expandedRowKeys: []
      }
    })
    if(this.state.inputValue) {
      // dispatch({
      //   type: 'deptMg/getSearchTree',
      //   payload:{
      //     searchWord: this.state.inputValue,
      //     type: 'DEPT',
      //     start: page,
      //     limit: size,
      //     parentId: id
      //   }
      // })
      dispatch({
        type: 'deptMg/getOrgTreeList',
        payload: {
          parentId:id,
          start:page,
          limit:size,
          orgKind: 'DEPT',
          searchWord:this.state.inputValue
        },
      });
    } else {
      this.getDepts(key, page,  size);
    }
    
  }
  enableDept(text){
    const { dispatch,currentNode,deptIds,currentPage, limit,selectedRows } = this.props
    const { key } = currentNode;
    if(deptIds.length >0){
      dispatch({
        type: 'deptMg/orgEnable',
        payload: {
          type:text == 'enable' ? 1 : 0,
          orgIds:deptIds.toString(),
        },
        callback:()=>{
          this.getDepts(key, currentPage, limit);
          // selectedRows.forEach(item=>{
          //   if(item.parentId!==key){
          //     this.getOrgChildren(item.parentId, currentPage, limit);
          //   }
          // })
          dispatch({
            type: 'deptMg/updateStates',
            payload:{
              depts: [],
              deptIds:[],
              expandedRowKeys:[]
            }
          })
        }
      });
    }else{
      message.error('请至少选择一个部门');
    }
  }
  //取出所有id
  getAllIDs(data) {
    let ids = [];
    data.forEach(item => {
      ids.push(item.id);
      if (item.children) {
        ids = ids.concat(this.getAllIDs(item.children));
      }
    });
    return ids;
  }
  onExpand(type,expanded, record){
    const { currentPage, limit,dispatch,expandedRowKeys,sortExpandedRowKeys} = this.props;
    if(expanded) {
      dispatch({
        type: 'deptMg/newGetOrgTreeList',
        payload: {
          parentId:record.id,
          orgKind: 'DEPT',
          searchWord:''
        },
        typeName:type
      });
      if(type=='list'){
        expandedRowKeys.push(record.id)
      }else{
        sortExpandedRowKeys.push(record.id)
      }

        dispatch({
            type:"deptMg/updateStates",
            payload:{
              expandedRowKeys,
              sortExpandedRowKeys
            }
        })
    }else{
      if(type=='list'){
        let index = expandedRowKeys.indexOf(record.id);
        expandedRowKeys.splice(index,1);
              dispatch({
                  type:"deptMg/updateStates",
                  payload:{
                    expandedRowKeys
                  }
              })
        const idArr=this.getAllIDs([record])
        const list = expandedRowKeys.filter(items => {
          if (!idArr.includes(items)) return items;
          })
        dispatch({
          type:'deptMg/updateStates',
          payload:{
            expandedRowKeys:list
          }
        })
      }else{
        let index = sortExpandedRowKeys.indexOf(record.id);
        sortExpandedRowKeys.splice(index,1);
              dispatch({
                  type:"deptMg/updateStates",
                  payload:{
                    sortExpandedRowKeys
                  }
              })
        const idArr=this.getAllIDs([record])
        const list = sortExpandedRowKeys.filter(items => {
          if (!idArr.includes(items)) return items;
          })
        dispatch({
          type:'deptMg/updateStates',
          payload:{
            sortExpandedRowKeys:[...list]
          }
        })
      }
    }
  }
  loopSelectIds(data){
    let ids=[]
    data.forEach(item=>{
      ids.push(item.id)
      if(item.children&&item.children.length){
        ids=ids.concat(this.loopSelectIds(item.children))
      }
    })
    return ids
  }
  onSelectAll(selected, selectedRows, changeRows){
      const {dispatch}=this.props
      if(selected){
        dispatch({
          type: 'deptMg/updateStates',
          payload: {
            deptIds: this.loopSelectIds(selectedRows),
          },
        });
      }else{
        dispatch({
          type: 'deptMg/updateStates',
          payload: {
            deptIds: [],
          },
        });
      }
  }
  onSelect(record, selected, selectedRows, nativeEvent){
    const {dispatch,deptIds}=this.props
    if(selected){
      deptIds.push(record.id)
      
    }else{
      deptIds.splice(deptIds.indexOf(record.id),1)
    }
    dispatch({
      type: 'deptMg/updateStates',
      payload: {
        deptIds:[...deptIds],
        selectedRows,
      },
    });
  }
  render() {
    const {
      dispatch,
      limit,
      searchWord,
      currentPage,
      loading,
      depts,
      returnCount,
      modalVisible,
      dept,
      deptIds,
      expandedRowKeys,
      treeSearchWord,
      treeData,
      currentNode,
      expandedKeys,
      isShowImportDeptModel,
      isShowExportDeptModel,
      importData,
      user,
      viewDeptPicModel,
      viewDeptPicData,
      expandOrgList,
      sortData,
      sortExpandedRowKeys,
      leftNum
    } = this.props;
    const {commonSort,columns} = this.state
    const { key } = currentNode;
    const { menus,menusUrlList }= user
    const tableProps = {
      rowKey: 'id',
      // scroll:{ x: 1100,y: 'calc(100vh - 300px)'},
      columns: [
        {
          title:'序号',
          width: 80,//宽度不够 会导致展开子表格序号列错位
          dataIndex: 'number',
        },
        {
          title: '部门名称',
          dataIndex: 'orgName',
          width: BASE_WIDTH*2.5,
          render: (address, record) => (
            <div  title={address} className={styles.text} style={{ display: 'inline-block',width:(BASE_WIDTH*2.5) -16}}>
              {getButtonByUrl(menusUrlList,'view','','/deptMg')?<a
                onClick={() => {
                  this.showViewDetail(record);
                }}
              >
                {address}
              </a>:address}
            </div>
        ),
        },
        {
          title: '部门code',
          dataIndex: 'orgCode',
          width: BASE_WIDTH,
          render: text => (
            <div className={styles.text} title={text}>
              {text}
            </div>
          ),
        },
        {
          title: '部门编码',
          dataIndex: 'orgNumber',
          width: BASE_WIDTH,
          render: text => (
            <div className={styles.text} title={text}>
              {text}
            </div>
          ),
        },
        {
          title: '部门简称',
          dataIndex: 'orgShortName',
          width: BASE_WIDTH,
          render: text => (
            <div className={styles.text} title={text}>
              {text}
            </div>
          ),
        },
        {
          title: '启用',
          dataIndex: 'isEnable',
          width: ORDER_WIDTH,
          render: text => (
            <div className={styles.text} title={text ? '是' : '否'}>
              {text ? '是' : '否'}
            </div>
          ),
        },
        // {
        //   title: '排序',
        //   dataIndex: 'sort',
        //   onCell: (record) => ({
        //     record,
        //     editable: true,
        //     dataIndex: 'sort',
        //     title: '排序',
        //     handleSave: this.handleSave.bind(this)
        //   }),
        //   render: text => (
        //     <div className={styles.text} title={text}>
        //       {text}
        //     </div>
        //   ),
        // },
        {
          title: '创建日期',
          dataIndex: 'createTime',
          width: BASE_WIDTH,
          render: text => (
            <div className={styles.text} title={dataFormat(text, 'YYYY-MM-DD')}>
              {dataFormat(text, 'YYYY-MM-DD')}
            </div>
          ),
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: BASE_WIDTH,
          render: (text, record, index) => {
            return (
              <div className="table_operation">
                {
                  getButtonByUrl(menusUrlList,'update','','/deptMg')&&<span
                    onClick={this.onAdd.bind(this, record, index)}
                  >
                  修改
                  </span>
                }
                {getButtonByUrl(menusUrlList,'delete','','/deptMg')&&<span onClick={this.onDelete.bind(this, record.id, false)}>删除</span>}
                  
                
              </div>
            );
          },
        },
      ],
      dataSource: depts,
      expandable: {
        // indentSize: 40,
        expandedRowKeys: expandedRowKeys,
        // onExpandedRowsChange: expandedRows => {
        //   dispatch({
        //     type: 'deptMg/updateStates',
        //     payload: {
        //       expandedRowKeys: expandedRows,
        //     },
        //   });
        // },
      },
      pagination: false,
      rowSelection: {
        selectedRowKeys: deptIds,
        // onChange: (selectedRowKeys, selectedRows) => {
        //   console.log(selectedRows,'selectedRowKeys');
        //   dispatch({
        //     type: 'deptMg/updateStates',
        //     payload: {
        //       // deptIds: selectedRowKeys,
        //       // selectedRows,
        //     },
        //   });
        // },
        onSelectAll:this.onSelectAll.bind(this),
        onSelect:this.onSelect.bind(this),
        getCheckboxProps: record => ({
          disabled: record.isSelected == 1,
        }),
      },
    };
    return (
      <CTM
        treeData={treeData}
        expandedKeys={expandedKeys}
        treeSearchWord={treeSearchWord}
        currentNode={currentNode}
        nodeType={'ORG'}
        plst={'输入单位名称、编码'}
        onSearchTable={this.onSearchTable.bind(this)}
        moudleName={'deptMg'}
        leftNum={leftNum}
        getData={node => {
          dispatch({
            type: 'deptMg/updateStates',
            payload: {
              currentPage: 1,
              depts: [],
              deptIds: [],
              selectedRows: [],
              expandedRowKeys: [],
              searchWord: ''
            },
          });
          this.setState({inputValue:''})

          this.getDepts(node.id, 1, limit);
        }}
      >
        {modalVisible && (
          <ADD
            loading={loading.global}
            dept={dept}
            setValues={values => {
              dispatch({
                type: 'deptMg/updateStates',
                payload: {
                  dept: { ...dept, ...values },
                },
              });
            }}
            isCat={this.state.isCat}
            onCancel={this.onCancel.bind(this)}
            onSubmit={this.onSubmit.bind(this)}
          />
        )}
        {viewDeptPicModel && (<VIEWORGPIC onCancel={this.onCancel.bind(this)} list={viewDeptPicData} module='deptMg'/>)}
        {isShowImportDeptModel && (
          <ImportDeptModal
            importData={importData}
            currentNode={currentNode}
            onCancel={this.onImportModalCancel.bind(this)}
          />
        )}
         {isShowExportDeptModel && (
          <ExportDeptModal
            importData={importData}
            currentNode={currentNode}
            deptIds={deptIds}
            onCancel={this.onImportModalCancel.bind(this)}
          />
        )}
        {commonSort && <COMMONSORT loading={loading.global} name='deptMg' onCancel={this.onCancel.bind(this)} tableList={sortData} columns={columns} expandable= {{expandedRowKeys: [...sortExpandedRowKeys]}} saveCallBack={this.saveCallBack.bind(this)} onExpand={this.onExpand.bind(this,'sort')}/>}   
        {/* <ViewDetailsModal
          title="查看部门"
          containerId="deptMg_container"
          ref={ref => {
            viewDetailsModalRef = ref;
          }}
        ></ViewDetailsModal> */}
        <div className={styles.other} id='list_head'>
          <Input.Search
            className={styles.search}
            placeholder={'请输入部门名称、编码'}
            defaultValue={searchWord}
            value={searchWord}
            allowClear
            onChange={this.onChangeSearchWord.bind(this)}
            onSearch={value => {
              this.onSearchTable(value);
            }}
            enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
          />
          <div className={styles.bt_gp}>

            {getButtonByUrl(menusUrlList,'add','','/deptMg')&&<Button type='primary' onClick={this.onAdd.bind(this, {})}>新增</Button>}
            {getButtonByUrl(menusUrlList,'delete','','/deptMg')&&<Button onClick={this.onDelete.bind(this, deptIds.toString(), true)}>删除</Button>}
            {getButtonByUrl(menusUrlList,'viewChart','','/deptMg')&&<Button className={styles.fontSize7} onClick={this.structureChart.bind(this)}>查看结构图</Button>}
            <Dropdown overlay={this.OperatingMoreMenu.bind(this)} trigger={['click']}>
              <Button onClick={e => e.preventDefault()}>更多<DownOutlined /></Button>
            </Dropdown>
          </div>
        </div>
            <div style={{height:'calc(100% - 90px)'}}>
            <ColumnDragTable taskType="MONITOR" modulesName="deptMg" {...tableProps} key={loading} scroll={depts.length?{ y: 'calc(100% - 45px)' }:{}} id="table" components={components} onExpand={this.onExpand.bind(this,'list')} rowKey={record => record.id}/>
            </div>
        <div
            style={{
              marginTop: '40px',
              paddingBottom: '10px',
            }}
          >
            <IPagination
              current={currentPage}
              total={returnCount}
              pageSize={limit}
              isRefresh={true}
              onChange={this.changePage.bind(this)}
              refreshDataFn={() => {this.changePage(1,limit)}}
            />
        </div>
      </CTM>
    );
  }
}
export default connect(({deptMg,loading,user})=>({
  ...deptMg,
  loading,
  user
}))(DeptInfo);
