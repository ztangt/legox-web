import { connect } from 'dva';
import React, { useState,Component,useCallback,useEffect} from 'react';
import { Input,Button,message,Modal,Table,Dropdown,Menu,Form, Tooltip} from 'antd';
import styles from '../index.less';
import _ from "lodash";
import { checkWOrd, dataFormat,getButton,getButtonByUrl} from '../../../util/util.js'
import {components} from '../../../componments/sort';
import IPagination from '../../../componments/public/iPagination';
import CTM from '../../../componments/commonTreeMg'
import ADD from './addOrgForm'
import EditTree from './editTree'
import ImportUnitModal from './importUnitModal'
import ExportUnitModal from './exportModal'
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import {DownOutlined} from '@ant-design/icons';
import VIEWORGPIC from '../../../componments/viewOrgPic';
import { parse } from 'query-string';
import COMMONSORT from '../../../componments/commonSort';
import { sm2 } from 'sm-crypto';
import {history} from 'umi'
import {BASE_WIDTH,ORDER_WIDTH} from '../../../util/constant'
import ColumnDragTable from '../../../componments/columnDragTable'
import searchIcon from '../../../../public/assets/search_black.svg'
const servicePublicKey =
  '0416e39a2a5023e90a4f8d0c663b7f9e21bcd430c122e767150b201dd5935d8953a08227be68de4a04c46d46c6b2644d3042889404a7dcda92c7f211ee29f20c8e';
function UnitInfo({
  dispatch,
  loading,
  orgs,
  expandedKeys,
  searchObj,
  returnCount,
  modalVisible,
  org,
  orgIds,
  editTreeVisible,
  treeSearchWord,
  treeData,
  currentNode,
  limit,
  currentPage,
  searchWord,
  isShowImportUnitModel,
  isShowExportUnitModel,
  importData,
  user,
  viewOrgPicModel,
  viewOrgPicData,
  initTreeList,
  oldInitTreeList,
  leftNum
}) {
  const pathname = '/unitInfoManagement';
  var viewDetailsModalRef; //查看Modalref
  const { key, title, nodeName, orgName} = currentNode;
  const timeStamp = Date.parse(new Date());
  const query = parse(history.location.search);
  const maxDataruleCode=query.maxDataruleCode

  const { menus,menusUrlList } = user;
  const [commonSort,setCommonSort] = useState(false)
  const [columns,setColumns] = useState([])
  const [sortData,setSortData] = useState([])
  const [selectedOrgRows,setSelectedOrgRows] = useState([])
  const [inputValue,setInputValue] = useState('');
  const [visibleItems, setVisibleItems] = useState(50);
  const [height,setHeight] = useState(document.documentElement.clientHeight-300)
  const [isView,setIsView]=useState(false)
  const onResize = useCallback(()=>{
    setHeight(document.documentElement.clientHeight-300)
  },[])
useEffect(()=>{
  if(!treeSearchWord){
    const newData=treeData&&treeData.map(({children,...item})=>item)
    const result=newData&&newData.filter(item=>item.isTopLevel==1)
    dispatch({
      type: "unitInfoManagement/updateStates",
      payload: {
          initTreeList: result,
          oldInitTreeList:result,
      }
    })
  }
},[treeData])
  useEffect(()=>{
      window.addEventListener('resize',onResize);
      return (()=>{
          window.removeEventListener('resize',onResize)
      })
  },[])
  useEffect(()=>{
    document.getElementById('scrollRef').addEventListener('scroll',onScroll,true)
  },[])
  const onScroll=(e)=>{
      const clientHeight=document.getElementById('scrollRef').clientHeight
      const scrollTop=e.target.scrollTop
      const scrollHeight=e.target.scrollHeight
      if (Math.ceil(clientHeight+scrollTop)>scrollHeight) {
        loadMore();
      }
      if(scrollTop == 0){
        setVisibleItems(50)
      }
  }
   // 加载更多数据
   const loadMore = useCallback(() => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 50);
  }, []);
  const tableProps = {
    rowKey: 'id',
    scroll:{ x: 1100,y: 'calc(100% - 45px)'},
    columns: [
      {
        title:'序号',
        dataIndex:'index',
        width: 80,
        render:(value,obj,index)=><span>{index+1}</span>
      },
      {
        title: '单位名称',
        dataIndex: 'orgName',
        width: BASE_WIDTH*2.5,
        render: (address, record) => (
          <div  title={address} className={styles.text} style={{width:(BASE_WIDTH*2.5)-16}}>
            {getButtonByUrl(menusUrlList,'view','','/unitInfoManagement')?<a
              onClick={() => {
                showDetails(record);
              }}
            >
              {address}
            </a>:address}
          </div>
        ),
      },
      {
        title: '单位code',
        dataIndex: 'orgCode',
        width: BASE_WIDTH,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '单位编码',
        dataIndex: 'orgNumber',
        width: BASE_WIDTH,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '单位简称',
        dataIndex: 'orgShortName',
        width: BASE_WIDTH,
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '单位描述',
        dataIndex: 'orgDesc',
        width: BASE_WIDTH*2.5,
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '启用',
        dataIndex: 'isEnable',
        width: BASE_WIDTH,
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
      //     handleSave: handleSave
      //   }),
      //   // render: text => (
      //   //   <input className={styles.text} title={text}  value={text} style={{border:'1px solid #ccc'}} onChange={ceshi}/>
      //   // ),
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
        render: (text, record) => {
          return (
            <div  className="table_operation">
              {getButtonByUrl(menusUrlList,'update','','/unitInfoManagement')&&<span onClick={onAdd.bind(this, record)} style={{ marginRight: 4 }}>修改</span>}
              {getButtonByUrl(menusUrlList,'delete','','/unitInfoManagement')&&<span onClick={onDelete.bind(this, record)}>删除</span>}
            </div>
          );
        },
      },
    ],
    dataSource: currentNode.id?orgs:initTreeList.slice(0, visibleItems),
    pagination: false,
    rowSelection: {
      selectedRowKeys: orgIds,
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedOrgRows(selectedRows);
        // currentNode.nodeName = selectedRows[0] && selectedRows[0].nodeName;
        dispatch({
          type: 'unitInfoManagement/updateStates',
          payload: {
            orgIds: selectedRowKeys,
          },
        });
      },
      getCheckboxProps: record => ({
        disabled: record.isSelected == 1,
      }),
    },
  };
  console.log(orgs,'orgs');
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
  function handleSave(record){
    let arr = [];
    arr.push(record)
    dispatch({
      type: 'unitInfoManagement/updateStates',
      payload: {
        orgs: arr,
      },
    });
  }
  function showDetails(record) {
    onAdd(record)
    setIsView(true)
    // record.parentName = orgName;
    // viewDetailsModalRef.show([
    //   { key: '单位名称', value: record.orgName },
    //   { key: '单位简称', value: record.orgShortName },
    //   { key: '单位编码', value: record.orgNumber },
    //   {
    //     key: '单位类型',
    //     value: record.orgType==''?'':record.orgType == 'SCIENTIFIC_ORG' ? '科研单位' : '行政单位',
    //   },
    //   { key: '上级单位', value: record.parentName },
    //   {
    //     key: '行业类型',
    //     value: record.orgGroup==''?'': record.orgGroup== 'PUBLIC_ORG' ? '事业单位' : '政府机构',
    //   },
    //   { key: '是否启用', value: record.isEnable, type: 1 },
    //   { key: '创建时间', value: record.createTime, type: 2 },
    //   { key: '单位描述', value: record.orgDesc, type: 3 },
    // ]);
  }

  // function getOrgs(nodeId, start,limit) {
  //   dispatch({
  //     type: 'unitInfoManagement/getOrgChildren',
  //     payload: {
  //       nodeId,
  //       start,
  //       limit,
  //       nodeType: 'ORG'
  //     },
  //   });
  // }
  function getOrgs(id, start,limit) {
    dispatch({
      type: 'unitInfoManagement/getOrgTreeList',
      payload: {
        parentId:id,
        start,
        limit,
        orgKind: 'ORG',
        searchWord:''
      },
    });
  }

  function onSearchTable(value) {
    if(!key){
        if(value){
        const searchList=initTreeList.filter(item=>item.orgName.includes(value))
        dispatch({
          type:'unitInfoManagement/updateStates',
          payload:{
            initTreeList:searchList
          }
        })
      }else{
        dispatch({
          type:'unitInfoManagement/updateStates',
          payload:{
            initTreeList:oldInitTreeList
          }
        })
      }
      
      return
    }
    if (checkWOrd(value)) {
      message.error('查询条件不支持特殊字符，请更换其它关键字！');
      return;
    }
    const { id } = currentNode;
    dispatch({
      type: 'unitInfoManagement/updateStates',
      payload:{
        currentPage: 1,
        // limit: 10,
        orgs: [],
      }
    })
    setInputValue(value);
    if (value) {
      // dispatch({
      //   type: 'unitInfoManagement/getSearchTree',
      //   payload:{
      //     searchWord: value,
      //     type: 'ORG',
      //     start:1,
      //     limit: 10,
      //     parentId: id
      //   }
      // })
      dispatch({
        type: 'unitInfoManagement/getOrgTreeList',
        payload: {
          parentId:id,
          start:1,
          limit,
          orgKind: 'ORG',
          searchWord:value
        },
      });
    } else {
      getOrgs(key, 1, limit);
    }
  }

  function onChangeSearchWord(e) {
    dispatch({
      type: 'unitInfoManagement/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });

  }

  function onAdd(org,isAddRoot) {
    // if (!key) {
    //   message.error('请选择上级单位/部门！');
    //   return;
    // }
    const onAddCallback = () =>{
      if (org.id) {
        // 修改单位信息
        dispatch({
          type: 'unitInfoManagement/getOrg',
          payload: {
            orgId: org.id,
          },
        });
      } else {
        // 新增单位信息
        if(selectedOrgRows.length > 1) {
          message.error('新增请选择一个单位');
          return;
        } else {
          org.isEnable = true;
          if(currentNode.id){
              org.parentName = currentNode.orgName;
              org.parentId = currentNode.id;
          }
          // if(selectedOrgRows.length < 1) {
          //   org.parentName = nodeName;
          //   org.parentId = key;
          // } else {
          //   org.parentName = selectedOrgRows && selectedOrgRows[0]?selectedOrgRows[0].nodeName:'';
          //   org.parentId = selectedOrgRows && selectedOrgRows[0]?selectedOrgRows[0].id:'';
          // }

          // org.isEnable = true;
          // if(!isAddRoot){
          //   org.parentName = nodeName;
          //   org.parentId = key;
          // }else{
          //   org.parentName = '';
          //   org.parentId = '';
          // }
          dispatch({
            type: 'unitInfoManagement/updateStates',
            payload: {
              modalVisible: true,
              org,
            },
          });
        }
      }
    }
    onAddCallback();

  }

  function onCancel() {
    dispatch({
      type: 'unitInfoManagement/updateStates',
      payload: {
        modalVisible: false,
        viewOrgPicModel:false
      },
    });
    setCommonSort(false)
    setIsView(false)
  }

  function onSubmit(values) {
    if(org.adminPwd){
      org.adminPwd = '04'+sm2.doEncrypt(org.adminPwd,servicePublicKey)
    }
    if (org.id) {
      dispatch({
        type: 'unitInfoManagement/updateOrg',
        payload: {
          id: org.id,
          parentId: org.parentId,
          ...values,
          parentName:org.parentName
        },
      });
    } else {
      dispatch({
        type: 'unitInfoManagement/addOrg',
        payload: {
          // 新增时上级单位为可编辑状态，为空时新增到根目录中
          ...values,
          // parentId: selectedOrgRows.length<1 && values.parentName!==''?key:selectedOrgRows && selectedOrgRows[0] && values.parentName!==''?selectedOrgRows[0].id:'',
          parentId:org.parentId,
          parentName:org.parentName
        },
      });
    }
  }

  function onDelete(org) {
    let ids = '';
    if(org.id){
        ids = org.id;
    } else {
        if(orgIds.length > 0){
            ids = getByIdJs(orgIds)
        }else{
            message.error('请先选择需要删除的数据');
            return
        }
    }
    dispatch({
      type: 'unitInfoManagement/updateStates',
      payload: {
        editTreeVisible: false,
      },
    });
    Modal.confirm({
      title: '确认删除吗？',
      // content: '确认删除该单位',
      okText: '删除',
      cancelText: '取消',
      mask: false,
      maskClosable:false,
      getContainer:() =>{
        return document.getElementById('uintInfo_container');
      },
      onOk() {
          dispatch({
              type:"unitInfoManagement/deleteOrg",
              payload:{
                orgIds: ids?ids:org.id,
              }
          })
      }
    });
  }
  function onImportModalCancel() {
    dispatch({
      type: 'unitInfoManagement/updateStates',
      payload: {
        isShowImportUnitModel: false,
        isShowExportUnitModel: false,
        importData: {},
        fileName:''
      },
    });
  }

  function importOrg() {
    dispatch({
      type: 'unitInfoManagement/updateStates',
      payload: {
        isShowImportUnitModel: true,
      },
    });
  }
  function exportOrg(){
    const time=Math.round(new Date().getTime() / 1000)
    const str=dataFormat(time, 'YYYY-MM-DD HH:mm:ss') 
    currentNode.newFileName = `单位信息管理${str.replace(/[-\s:]/g, '')}`;
    dispatch({
      type: 'unitInfoManagement/updateStates',
      payload: {
        isShowExportUnitModel: true,
      },
    });
  }
  const loop=(data)=>{
    data.forEach(item=>{
      if(item.children){
        delete item.children
      }
    })
    return data
  }
  //排序
  function onCommonSort(){
    setColumns([
      {
        title: '序号',
        dataIndex: 'index',
        width:'6%',
        render:(value,obj,index)=><span>{index+1}</span>
      },
      {
        title: '单位名称',
        dataIndex: 'orgName',
        width:'24%'
      },{
        title: '单位编码',
        dataIndex: 'orgNumber',
        width:'24%'
      },{
        title: '单位code',
        dataIndex: 'orgCode',
        width:'24%'
      }])
    if(key){
      dispatch({
        type: 'unitInfoManagement/getSortOrgs',
        payload: {
          // nodeId:key,
          // start: 1,
          // limit: 100000,
          // nodeType: 'ORG',
          // // isEnable:1

          parentId:key ,
          start:1,
          limit: 100000,
          orgKind: 'ORG',
          searchWord:''
        },
        callback:function(list){
          setSortData(list)
          setCommonSort(true)
        }
      });
    }else{
      const newData=JSON.parse(JSON.stringify(treeData))
      setSortData(loop(newData))
      setCommonSort(true)
      // message.error('请选择所属单位')
    }
  }
  function saveCallBack(list){
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
      type: 'unitInfoManagement/orgSort',
      payload:{
        json:JSON.stringify(arr)
      },
      callback:function(){
        dispatch({
          type: 'unitInfoManagement/updateStates',
          payload: {
            currentPage: 1,
            orgs: [],
          },
        });
        if(key){
           getOrgs(key, currentPage, limit);
        }else{
          // dispatch({
          //   type: 'tree/getOrgChildren',
          //   payload:{
          //     nodeType:'ORG',
          //     start:1,
          //     limit:200
          //   },
          //   pathname: history.location.pathname,//当前路由路径
          //   moudleName: '',
          // })
          dispatch({
            type: 'tree/getOrgTree',
            payload:{
              parentId:'',
              orgKind:'ORG',
              searchWord:'',
              isEnable:'1'
            },
            pathname: history.location.pathname?.split('/support')[1],//当前路由路径
            moudleName: '',
          })
        }
        setCommonSort(false)
      }
    })
   }
  }
  //启用停用
  function orgEnable(text){
    const { id } = currentNode;
    if(orgIds.length >0){
      dispatch({
        type: 'unitInfoManagement/orgEnable',
        payload:{
          type:text == 'enable' ? 1 : 0,
          orgIds:orgIds.toString()
        },
        callback:function(){
          dispatch({
            type: 'unitInfoManagement/updateStates',
            payload: {
              currentPage: 1,
              orgs: [],
            },
          });
          if(inputValue) {
            // dispatch({
            //   type: 'unitInfoManagement/getSearchTree',
            //   payload:{
            //     searchWord: inputValue,
            //     type: 'ORG',
            //     start:1,
            //     limit: 10,
            //     parentId: id
            //   }
            // })
            dispatch({
              type: 'unitInfoManagement/getOrgTreeList',
              payload: {
                parentId:id,
                start:1,
                limit:10,
                orgKind: 'ORG',
                searchWord:inputValue
              },
            });
          } else {
            getOrgs(key, currentPage, limit);
          }
        }
      })
    }else{
      message.error('请至少选择一个单位');
    }
  }
  const OperatingMoreMenu = ()=>{
    return <Menu onClick={onMenuClick}>
              {getButtonByUrl(menusUrlList,'export','','/unitInfoManagement')&&<Menu.Item key="export">导出</Menu.Item>}
              {getButtonByUrl(menusUrlList,'import','','/unitInfoManagement')&&<Menu.Item key="import">导入</Menu.Item>}
              {getButtonByUrl(menusUrlList,'enable','','/unitInfoManagement')&&<Menu.Item key="enable">启用</Menu.Item>}
              {getButtonByUrl(menusUrlList,'disable','','/unitInfoManagement')&&<Menu.Item key="disable">停用</Menu.Item>}
              {getButtonByUrl(menusUrlList,'sort','','/unitInfoManagement')&&<Menu.Item key="sort">排序</Menu.Item>}
    </Menu>
  }

  const onMenuClick = (event) => {
    const { key } = event;
    switch(key){
      case 'import':
        importOrg()
        break;
      case 'export':
        exportOrg()
        break;
      case 'sort':
        onCommonSort()
        break;
      case 'enable':
        orgEnable('enable')
        break;
      case 'disable':
        orgEnable('disable')
        break;
    }

  };
  function changePage(page,size) {
    const { id } = currentNode;
    dispatch({
      type: 'unitInfoManagement/updateStates',
      payload:{
        currentPage: page,
        limit: size,
        orgs: [],
      }
    })
    if(inputValue) {
      // dispatch({
      //   type: 'unitInfoManagement/getSearchTree',
      //   payload:{
      //     searchWord: inputValue,
      //     type: 'ORG',
      //     start: page,
      //     limit: size,
      //     parentId: id
      //   }
      // })
      dispatch({
        type: 'unitInfoManagement/getOrgTreeList',
        payload: {
          parentId:id,
          start:page,
          limit:size,
          orgKind: 'ORG',
          searchWord:inputValue
        },
      });
    } else {
      getOrgs(key, page,  size);
    }

  }
  function onExpand(expanded, record){
    // dispatch({
    //   type: 'unitInfoManagement/getOrgChildren',
    //   payload: {
    //     nodeId:record.id,
    //     start: currentPage,
    //     limit: limit,
    //   },
    // });
    dispatch({
      type: 'unitInfoManagement/getOrgTreeList',
      payload: {
        parentId:record.id ,
        // start:1,
        // limit:10,
        orgKind: 'ORG',
        searchWord:''
      },
    });
  }
  const loopTree=(data)=>{
    data.forEach((item,index)=>{
      item.id = item.nodeId;
      item.name = item.nodeName;
      if(item.isParent==1){
        // dispatch({
        //   type: 'unitInfoManagement/getOrgChildren',
        //   payload:{
        //     nodeId:item.nodeId,
        //     nodeType:'ORG',
        //     start:1,
        //     limit:200
        //   },
        //   callback:(childrenData)=>{
        //    const newData= childrenData.filter(item=>item.isEnable==1)
        //     item.children=newData
        //     loopTree(newData)
        //   }
        // })
        dispatch({
          type: 'unitInfoManagement/getOrgTreeList',
          payload:{
            parentId:item.id ,
            start:1,
            limit:200,
            orgKind: 'ORG',
            searchWord:''
          },
          callback:(childrenData)=>{
           const newData= childrenData.filter(item=>item.isEnable==1)
            item.children=newData
            loopTree(newData)
          }
        })
      }
    })
    return data
  }
  //查看结构图
  function structureChart(){
    if(key){
      dispatch({
        type: 'unitInfoManagement/orgChart',
        payload: {
          type:'ORG',
          orgId:key
        },
        callback:function(data){
          dispatch({
            type: 'unitInfoManagement/updateStates',
            payload: {
              viewOrgPicData:{'orgName':currentNode.orgName,orgKind:"ORG",children:loopTree(data)},
              viewOrgPicModel: true,
            },
          });
        }
      });
    }else{
      message.error('请选择一个单位');
    }

  }

  return (
    <CTM
      className={styles.orgTree}
      isShowAdd={getButtonByUrl(menusUrlList,'add','','/unitInfoManagement')}
      onAdd={onAdd.bind(this, {}, true)}
      treeData={treeData}
      expandedKeys={expandedKeys}
      treeSearchWord={treeSearchWord}
      currentNode={currentNode}
      moudleName={'unitInfoManagement'}
      plst={'输入单位名称、编码'}
      leftNum={leftNum}
      // onSearchTable={onSearchTable.bind(this)}
      getData={node => {
        dispatch({
          type: 'unitInfoManagement/updateStates',
          payload: {
            currentPage: 1,
            searchWord: '',
            orgs: [],
          },
        });
        setInputValue('')
        getOrgs(node.id, 1, limit);
        setSelectedOrgRows([]);
      }}
      onEditTree={node => {
        onAdd({ id: node.id });
      }}
      onDeleteTree={node => {
        console.log(node, '681')
        onDelete(node);
        dispatch({
          type: 'unitInfoManagement/updateStates',
          payload: {
            currentNode:{}
          },
        });
      }}
    >
      {modalVisible && (
        <ADD
          org={org}
          setValues={values => {
            dispatch({
              type: 'unitInfoManagement/updateStates',
              payload: {
                org: { ...values,...org, },
              },
            });
          }}
          loading={loading.global}
          onCancel={onCancel.bind(this)}
          onSubmit={onSubmit.bind(this)}
          treeData={treeData}
          isView={isView}
        />
      )}
      {isShowImportUnitModel && (
        <ImportUnitModal
          currentNode={currentNode}
          importData={importData}
          onCancel={onImportModalCancel.bind(this)}
        />
      )}
      {isShowExportUnitModel && (
        <ExportUnitModal
          currentNode={currentNode}
          importData={importData}
          orgs={orgs}
          orgIds={orgIds}
          selectedOrgRows={selectedOrgRows}
          onCancel={onImportModalCancel.bind(this)}
        />
      )}
      {viewOrgPicModel && (<VIEWORGPIC onCancel={onCancel.bind(this)} list={viewOrgPicData} module='uintInfo'/>)}
      {commonSort && <COMMONSORT loading={loading.global} name='uintInfo' onCancel={onCancel.bind(this)} tableList={sortData} columns={columns} saveCallBack={saveCallBack}/>}
      {/* <ViewDetailsModal
        title="查看单位"
        containerId="uintInfo_container"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      ></ViewDetailsModal> */}
      <div className={styles.other} id='list_head'>
        <Input.Search
          className={styles.search}
          placeholder={'请输入单位名称、编码'}
          allowClear
          value={searchWord}
          defaultValue={searchWord}
          onChange={onChangeSearchWord.bind(this)}
          onSearch={value => {
            onSearchTable(value);
          }}
          enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
        />
        <div className={styles.bt_gp}>
          {getButtonByUrl(menusUrlList,'add','','/unitInfoManagement')&&<Button type='primary' onClick={onAdd.bind(this, {}, false)}>新增</Button>}
          {getButtonByUrl(menusUrlList,'delete','','/unitInfoManagement')&&<Button onClick={onDelete.bind(this,'')}>删除</Button>}
          {getButtonByUrl(menusUrlList,'viewChart','','/unitInfoManagement')&&<Button className={styles.fontSize7} onClick={structureChart.bind(this)}>查看结构图</Button>}
          <Dropdown overlay={OperatingMoreMenu.bind(this)} trigger={['click']}>
            <Button onClick={e => e.preventDefault()}>更多<DownOutlined /></Button>
          </Dropdown>
        </div>
      </div>
      <div className={styles.unitInfo_table} id='scrollRef'  onScroll={onScroll}>
        <ColumnDragTable taskType="MONITOR" modulesName="unitInfoManagement" {...tableProps} key={loading} components={components} onExpand={onExpand.bind(this)} rowKey={record => record.id}/>
      </div>
      <div
        style={{
          marginTop: '40px',
          paddingBottom: '10px',
        }}
      >
         {/* <IPagination current={currentPage} total={returnCount} onChange={changePage} pageSize={limit} /> */}
        {currentNode.id&&<IPagination
          current={currentPage}
          total={returnCount}
          pageSize={limit}
          isRefresh={true}
          onChange={changePage}
          refreshDataFn={() => {changePage(1,limit)}}
        />}
      </div>
    </CTM>
  );
}
export default connect(({unitInfoManagement,loading,user})=>({
  ...unitInfoManagement,
  loading,
  user
}))(UnitInfo);
