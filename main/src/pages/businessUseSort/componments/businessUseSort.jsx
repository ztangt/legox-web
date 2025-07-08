import { connect } from 'dva';
import { Input, Button, message, Modal, Table, Space, Menu, Dropdown, Switch, Tooltip } from 'antd';
import styles from '../index.less';
import _ from "lodash";
import { dataFormat, getButton } from '../../../util/util.js';
import { useState, useCallback, useEffect } from 'react';
import { history } from 'umi';
import {
  DownOutlined, ArrowUpOutlined, ArrowDownOutlined

} from '@ant-design/icons';
import SETUP from './setUp';
import PERMISSION from './permission';
import ADD from './addForm'
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import COMMONSORT from '../../../componments/commonSort';
import { parse } from 'query-string';
import ColumnDragTable from '../../../componments/columnDragTable';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import searchIcon from '../../../../public/assets/search_black.svg'
function BusinessUseSort({ dispatch, loading, currentNodeId, user, businessUseSort }) {
  const { addModal, businessDatas, parentStrCtlgId, addObj, parentStrCtlgName,treeData } = businessUseSort
  const [setUpModal, setSetUpModalt] = useState(false);  //授权设置modal状态
  const [permissionModal, setPermissionModalt] = useState(false);  //权限查看modal状态
  // const [checkStrictly, setCheckStrictly] = React.useState(false);
  var viewDetailsModalRef; //查看Modalref
  const [expandRows, setExpandRows] = useState(false);
  const [SearchValue, setSearchValue] = useState('');
  const [commonSort, setCommonSort] = useState(false)
  const [columns, setColumns] = useState([])
  const { menus } = user
  const [expandedList,setExpandedList] = useState([])

  
  const [height, setHeight] = useState(document.documentElement.clientHeight - 305)
  const onResize = useCallback(() => {
    setHeight(document.documentElement.clientHeight - 305)
  }, [])

  useEffect(() => {      
      dispatch({
        type: 'businessUseSort/getCtlgTree',
        payload:{
          type:'ALL',
          hasPermission:'0'
        }
      })
    window.addEventListener('resize', onResize);
    return (() => {
      window.removeEventListener('resize', onResize)
    })
  }, [])
  const tableProps = {
    //rowKey: 'ugId',
    columns: [
      {
        title: '分类名称',
        dataIndex: 'nodeName',
        ellipsis: {
          showTitle: false,
        },
        width:BASE_WIDTH,
        render: (address, record) => {
          let index = -1;
          let beforeStr = '';
          let afterStr = '';
          if (SearchValue) {
            index = address.indexOf(SearchValue);
            beforeStr = address.substr(0, index);
            afterStr = address.substr(index + SearchValue.length);
          } else {
            index = -1;
          }
          // if(index > -1){
          return (
            // <Tooltip placement="topLeft" title={address}>
            //   {getButton(menus, 'view') ? <a onClick={() => { showDetails(record); }}>
            //     {index > -1 ? <span>{beforeStr}<span style={{ color: "#000", backgroundColor: '#ffee80' }}>{SearchValue}</span>{afterStr}</span> : <span>{address}</span>}
            //   </a> : index > -1 ? <span>{beforeStr}<span style={{ color: "#000", backgroundColor: '#ffee80' }}>{SearchValue}</span>{afterStr}</span> : <span>{address}</span>}
            // </Tooltip>
            <span><a onClick={() => { showDetails(record); }}>{address}</a></span>
          )
          // }else{
          //   return (
          //     <Tooltip placement="topLeft" title={address}>
          //       <a onClick={()=>{showDetails(record);}}>

          //       </a>
          //     </Tooltip>
          //   )
          // }
        },
      },
      {
        title: '分类code',
        dataIndex: 'nodeCode',
        width:BASE_WIDTH,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: '业务编码',
        dataIndex: 'nodeServiceNum',
        width:BASE_WIDTH,
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
        title: '创建人',
        dataIndex: 'createUserName',
        width:BASE_WIDTH,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        width:BASE_WIDTH,
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return dataFormat(text, 'YYYY-MM-DD');
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:BASE_WIDTH,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <div className='table_operation'>
                {getButton(menus, 'update') && <a onClick={onAdd.bind(this, record)}>修改</a>}
                {getButton(menus, 'delete') && <a onClick={onDelete.bind(this, record)}>删除</a>}
                {getButton(menus, 'upMove') && <a onClick={onEnumeInfoMoveUp.bind(this, record.id)}><ArrowUpOutlined /></a>}
                {getButton(menus, 'downMove') && <a onClick={onEnumeInfoMoveDown.bind(this, record.id)}><ArrowDownOutlined /></a>}
                {/* <Dropdown overlay={OperatingMoreMenu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  更多 <DownOutlined />
                </a>
              </Dropdown> */}
            </div>
          );
        },
      },
    ],
    dataSource: businessDatas,
    expandedRowKeys:expandedList,
    onExpand:onExpand,
    rowSelection: {
      selectedRowKeys: parentStrCtlgId,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'businessUseSort/updateStates',
          payload: {
            parentStrCtlgId: selectedRowKeys,
            parentStrCtlgName:
              selectedRows.length > 0 ? selectedRows[0].title : '',
          },
        });
      },
    },
    loading: loading.global,
    pagination: false,
  };
  function onExpand(expanded, {key}){
    let newList = expandedList
    if(expanded){
      newList.push(key)
    }else{
      newList = newList.filter(x => x != key)
    }
    setExpandedList(newList)
  }
  function getUgs(searchWord) {
    dispatch({
      type: 'businessUseSort/getCtlgTree',
      payload: {
        searchWord,
        type: 'ALL',
        hasPermission: '0'
      }
    })
  }

  // const onOperatingMoreClick = ({ key }) => {
  //   message.info(`Click on item ${key}`);
  // };
  // const OperatingMoreMenu = (
  //   <Menu onClick={onOperatingMoreClick}>
  //     <Menu.Item key="1">1st menu item</Menu.Item>
  //     <Menu.Item key="2">2nd menu item</Menu.Item>
  //     <Menu.Item key="3">3rd menu item</Menu.Item>
  //   </Menu>
  // );
  function filter(data, value) {
    var newData = data.filter(x => x.nodeName == value)
    newData.forEach(x => x.children && x.children.length > 0 && (x.children = filter(x.children, value)))
    return newData
  }

  function onSearchTable(value) {
    if(value){
      setSearchValue(value)
      expandedLists = []
      // getUgs(value)
      let arr = expandedLoop(treeData)
      setExpandedList(arr)
      const res=searchTable(value,treeData)
      const newData=deleteChildren(res)
      dispatch({
        type:'businessUseSort/updateStates',
        payload:{
          businessDatas:newData
        }
      })
    }else{
      dispatch({
        type: 'businessUseSort/getCtlgTree',
        payload: {
          type: 'ALL',
          hasPermission: '0'
        }
      })
    }
  }
  const searchTable=(value,data)=>{
    if(!data){
      return []
    }
    let newData=[]
    data.forEach(item=>{
      if(item.nodeName.indexOf(value)>-1){
        const res=searchTable(value,item.children)
        const obj={
          ...item,
          children:res
        }
        newData.push(obj)
      }
      else{
        if(item.children&&item.children.length>0){
          const res=searchTable(value,item.children)
          const obj={
            ...item,
            children:res
          }
          if(res&&res.length>0){
            newData.push(obj)
          }
        }
      }
    })
    return newData
  }
  // children为[],则删除children
  const deleteChildren=(data)=> {
    data.forEach(item=>{
      if (item.children&&item.children.length) {
        deleteChildren(item.children)
      }else {
        delete item.children
      }
    })
    return data
  }

  let expandedLists = []
  function expandedLoop(array){
    for(let i= 0;i<array.length;i++){
      let item = array[i];
      if(item.children && item.children.length >= 1){
        expandedLists.push(item.id)
      }
      if(item.children&&item.children.length!=0){
        expandedLoop(item.children)
      }
    }
    return expandedLists
  }
  const changeValue=(row)=>{
    console.log(row.type,'row==');
    if(row.type=='click'){
      getUgs('')
      setExpandedList([])
    }
  }
  function loopTree(arr, id) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (item.nodeId === id) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const result = loopTree(item.children, id);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }
  //新增 编辑
  function onAdd(obj) {
    if (!obj.nodeId) {
      // if(parentStrCtlgId.length > 0 && parentStrCtlgId.length ==1){
      if (parentStrCtlgId && parentStrCtlgId.length == 1 || parentStrCtlgId && parentStrCtlgId.length == 0) {
        if(parentStrCtlgId.length == 1){
          const newObj=loopTree(businessDatas,parentStrCtlgId[0])
          dispatch({
            type: 'businessUseSort/updateStates',
            payload: {
              parentStrCtlgName: newObj?.nodeName,
            }
          })
        }

        dispatch({
          type: 'businessUseSort/updateStates',
          payload: {
            addModal: true,
          }
        })
      } else {
        message.error('只能选择一个父单位')
      }
    } else {
      const newObj=loopTree(businessDatas,obj.parentNodeId)
      let arr = [];
      arr.push(obj.key)
      obj['ctlgName'] = obj.nodeName;
      obj['ctlgServiceNum'] = obj.nodeServiceNum
      dispatch({
        type: 'businessUseSort/updateStates',
        payload: {
          parentStrCtlgId: arr,
          parentStrCtlgName: newObj?.nodeName,
          addModal: true
        }
      })
    }

    dispatch({
      type: 'businessUseSort/updateStates',
      payload: {
        addObj: obj
      }
    })
  }
  // 新增点击保存
  function onAddSubmit(value, text) {
    function loopSort(array, sortArray) {
      array?.map(function (o) {
        sortArray.push(o.sort)
        if (o.children && o.children.length != 0) {
          loopSort(o.children, sortArray);
        }
      })
      return sortArray
    }

    if (text == '新增') {
      let sortArray = loopSort(businessDatas, [])
      var maxSort = Math.max.apply(Math, sortArray.map(function (o) { return o; }))
      dispatch({
        type: 'businessUseSort/addCtlg',
        payload: {
          ...value,
          sort: businessDatas.length?maxSort + 1:1,
        }
      })
    } else if (text == '修改') {
      value['ctlgId'] = addObj.nodeId;
      dispatch({
        type: 'businessUseSort/updateCtlg',
        payload: {
          ...value
        }
      })
    }
    dispatch({
      type: 'businessUseSort/updateStates',
      payload: {
        addModal: false
      }
    })

  }

  function getTextByJs(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
      str += arr[i] + ",";
    }
    if (str.length > 0) {
      str = str.substr(0, str.length - 1);
    }
    return str;
  }
  function loop(arr, idArr) {
    console.log(arr, idArr, "arr")
   
    let aa = ''
    idArr.forEach(function (item, i) {
      arr.forEach(function (policy, j) {
        if (item == policy.key) {
            if (policy.children && policy.children.length > 0) {
              aa = '不可删除'
                if (policy.children && policy.children.length != 0) {
                  loop(policy.children, idArr)
                }
            }
        }
      });
    });
     return aa
  }
  //删除
  function onDelete(value) {

    console.log(value, 'value==');
    if (value && value.key) {
      if (value.children && value.children.length > 0) {
        message.error('不能删除有子节点的分类')
        return
      }
      Modal.confirm({
        title: '确认删除吗?',
        // content: '确认删除该分类',
        okText: '删除',
        cancelText: '取消',
        getContainer:() =>{
          return document.getElementById(`${history.location.pathname.split("/")[2]}_container`)
        },
        mask:false,
        maskClosable:false,
        onOk() {
          dispatch({
            type: 'businessUseSort/deleteCtlg',
            payload: {
              ctlgIds: value.key
            },
            callback: function () {
              dispatch({
                type: 'businessUseSort/updateStates',
                payload: {
                  parentStrCtlgId: [],
                  parentStrCtlgName: ''
                }
              })
            }
          })
        }
      });
    } else if (parentStrCtlgId && parentStrCtlgId.length > 0) {
      let isTrue = loop(businessDatas, parentStrCtlgId);
      console.log(isTrue, 'isTrue==');
      if (isTrue == '不可删除') {
        return  message.error('不能删除有子节点的分类')
      }
      let ctlgIds = getTextByJs(JSON.parse(JSON.stringify(parentStrCtlgId)))
      console.log(ctlgIds, 'ctlgIds==');
      Modal.confirm({
        title: '确认删除吗?',
        // content: '确认删除所有选中的分类吗',
        okText: '删除',
        cancelText: '取消',
        getContainer:() =>{
          return document.getElementById(`${history.location.pathname.split("/")[2]}_container`)
        },
        mask:false,
        maskClosable:false,
        onOk() {
          dispatch({
            type: 'businessUseSort/deleteCtlg',
            payload: {
              ctlgIds: ctlgIds
            },
            callback: function () {
              dispatch({
                type: 'businessUseSort/updateStates',
                payload: {
                  parentStrCtlgId: [],
                  parentStrCtlgName: ''
                }
              })
            }
          })
        }
      });
    } else {
      message.error('请选择要删除的节点')
    }
  }

  //权限查看
  function permission() {
    setPermissionModalt(true)
    dispatch({
      type: 'businessUseSort/getCtlgTree',
      payload: {
        type: 'ALL',
        hasPermission: '1'
      }
    })
  }

  //权限查看modal点击保存
  function onPermissionSubmit() {

  }
  //授权设置
  function onSetUp() {
    if (parentStrCtlgId.length > 0) {
      setSetUpModalt(true)
    } else {
      message.error('请选择要授权的节点')
    }

  }
  //modal点击取消
  function onCancel() {
    setSetUpModalt(false)
    dispatch({
      type: 'businessUseSort/updateStates',
      payload: {
        addModal: false
      }
    })
    setPermissionModalt(false)
    setCommonSort(false)
  }
  //授权设置modal点击保存
  function onSetUpSubmit(values) {
    let orgs = JSON.stringify(values.orgs);
    let permissionTypes = getTextByJs(values.permissionTypes)
    let parentStrCtlgIds = getTextByJs(parentStrCtlgId)
    dispatch({
      type: 'businessUseSort/updatePermission',
      payload: {
        orgs: JSON.stringify(orgs),
        permissionTypes,
        ctlgIds: parentStrCtlgIds
      },
      callback: function () {
        setSetUpModalt(false)
      }
    })
  }
  function showDetails(record) {
    viewDetailsModalRef.show([
      { key: '分类名称', value: record.title },
      { key: '分类code', value: record.nodeCode },
      { key: '业务编码', value: record.nodeServiceNum },
      { key: '创建人', value: record.createUserName },
      { key: '分类描述', value: record.ctlgDesc, type: 3 },
      { key: '创建时间', value: record.createTime, type: 2 },
    ]);
  }

  //排序
  function onCommonSort() {
    setColumns([{
      title: '分类名称',
      dataIndex: 'nodeName',
      width:'40%'
    },
    {
      title: '分类code',
      dataIndex: 'nodeCode',
      width:'40%'
    }])
    setCommonSort(true)
  }
  function saveCallBack(list) {
    let arr = [];
    var reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
    const flag= list.every(item=>reg.test(item.sort))
    if(!flag){
      message.error('最大支持9位整数，6位小数')
    }else{
      list.forEach(function (item, i) {
        let obj = {
          sort: item.sort,
          id: item.id
        }
        arr.push(obj)
      })
      dispatch({
        type: 'businessUseSort/ctlgBatchsort',
        payload: {
          sortList: JSON.stringify(arr)
        },
        callback: function () {
          getUgs('')
          setCommonSort(false)
        }
      })
    }
  }
  //上移时获取当前选中 是否是 最后一条或第一条 和 相邻item
  let isStatus = null;
  let adjacentMenuInfo = [];
  let currentMenuInfo = [];
  function moveLoop(array, moduleId, ele) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].id == moduleId) {
        if (ele == 'shiftUp') {
          if (i != 0) {
            adjacentMenuInfo.push(array[i - 1])
            currentMenuInfo.push(array[i])
            isStatus = true;
          } else {
            isStatus = false;
          }
        } else {
          if (i + 1 != array.length) {
            adjacentMenuInfo.push(array[i + 1])
            currentMenuInfo.push(array[i])
            isStatus = true;
          } else {
            isStatus = false;
          }
        }
      }
      if (array[i].children && array[i].children.length > 0) {
        moveLoop(array[i].children, moduleId, ele)
      }
    }
  }
  //模块上移
  function onEnumeInfoMoveUp(moduleId) {
    adjacentMenuInfo = [];
    currentMenuInfo = [];
    isStatus = null;
    moveLoop(businessDatas, moduleId, 'shiftUp')
    if (isStatus) {
      if (currentMenuInfo[0].sort == adjacentMenuInfo[0].sort) {
        message.info('当前sort值一样，请先手动修改sort值')
      } else {
        menuMoveFn(adjacentMenuInfo, currentMenuInfo)
      }
    } else {
      message.info('已经是第一条了')
    }
  }
  //模块下移
  function onEnumeInfoMoveDown(moduleId) {
    adjacentMenuInfo = [];
    currentMenuInfo = [];
    isStatus = null;
    moveLoop(businessDatas, moduleId, 'shiftDown')
    if (isStatus) {
      if (currentMenuInfo[0].sort == adjacentMenuInfo[0].sort) {
        message.info('当前sort值一样，请先手动修改sort值')
      } else {
        menuMoveFn(adjacentMenuInfo, currentMenuInfo)
      }
    } else {
      message.info('已经是最后一条了')
    }
  }
  function menuMoveFn(adjacentMenuInfo, currentMenuInfo) {
    dispatch({
      type: 'businessUseSort/getCtlgMove',
      payload: {
        currentMenuId: currentMenuInfo[0].id,
        currentSort: currentMenuInfo[0].sort,
        adjacentMenuId: adjacentMenuInfo[0].id,
        adjacentSort: adjacentMenuInfo[0].sort
      },
      callback: function () {
        getUgs('')
      }
    })
  }
  return (
    <div style={{ height: '100%', background: '#fff', padding: '8px' }}>
      <div className={styles.other}>
        <Input.Search
          className={styles.search}
          placeholder={'请输入分类名称'}
          allowClear
          onChange={changeValue}
          onSearch={value => {
            onSearchTable(value);
          }}
          enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
        />
        <Space>
          {getButton(menus, 'add') && <Button type='primary' onClick={onAdd.bind(this, {})} className={styles.fontSize7}>
            新增
          </Button>}
          {getButton(menus, 'delete') && <Button
            onClick={onDelete.bind(this, '')}
            className={styles.fontSize7}
          >
            删除
          </Button>}
          {/* <Button onClick={onSetUp.bind(this,{})} className={styles.fontSize7}>授权设置</Button>
                <Button onClick={permission.bind(this,{})} className={styles.fontSize7}>权限查看</Button> */}
          {getButton(menus, 'sort') && <Button className={styles.fontSize7} onClick={onCommonSort}>排序</Button>}
        </Space>
      </div>
      <ColumnDragTable {...tableProps} key={loading} defaultExpandAllRows={expandRows} scroll={businessDatas ? { y: 'calc(100vh - 230px)' } : {}} />
      {setUpModal && <SETUP
        nodeType={'ORG'}
        onCancel={onCancel.bind(this)}
        onSetUpSubmit={onSetUpSubmit.bind(this)}
      />}

      {permissionModal && <PERMISSION
        onCancel={onCancel.bind(this)}
        onPermissionSubmit={onPermissionSubmit.bind(this)}
      />}

      <ViewDetailsModal
        title="查看业务应用类别"
        containerId="businessUseSort_container"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      ></ViewDetailsModal>

      {addModal && (
        <ADD
          addObj={addObj}
          setValues={values => {
            dispatch({
              type: 'businessUseSort/updateStates',
              payload: {
                addObj: { ...addObj, ...values },
              },
            });
          }}
          // loading={loading.global}
          onCancel={onCancel.bind(this)}
          parentStrCtlgName={parentStrCtlgName}
          parentStrCtlgId={parentStrCtlgId}
          onAddSubmit={onAddSubmit.bind(this)}
        />
      )}
      {commonSort && <COMMONSORT loading={loading.global} name='businessUseSort' onCancel={onCancel.bind(this)} tableList={businessDatas} columns={columns} saveCallBack={saveCallBack} />}
    </div>
  );
}
export default connect(({ businessUseSort, tree, loading, user }) => ({
  businessUseSort,
  tree,
  loading,
  user
}))(BusinessUseSort);
