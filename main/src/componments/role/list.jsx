import React,{useEffect,useState,useCallback} from 'react';
import {connect} from 'dva';
import {Input,Button,Dropdown,Menu,Modal,message} from 'antd';
import IPagination from '../../componments/public/iPagination';
import ViewDetailsModal from '../../componments/public/viewDetailsModal';
import styles from './list.less';
import {dataFormat,getButton} from '../../util/util';
import { DownOutlined } from '@ant-design/icons';
import AddUpdateModal from './addUpdateModal';
import RoleSet from './roleSet';
import {ORDER_WIDTH,BASE_WIDTH} from '../../util/constant'
import { history } from 'umi'
import Table from '../columnDragTable';
import searchIcon from '../../../public/assets/search_black.svg'
const { Search } = Input;
const {confirm}=Modal;
function List({location,dispatch,role,layoutG,user}){
  const pathname=location.pathname;
  const [isView,setIsView]=useState(false)
  const {searchObj}=role;
  const { menus } =  user
  if(!searchObj[pathname]){
    return null
  }
  const {list,currentPage,returnCount,limit,roleType,searchWord,selectedRowKeys,
  selectOrgId,isShowAddModal,isShowSetModal,moudleName} = searchObj[pathname];
  const [isShow,setIsShow] = useState(false)
useEffect(()=>{
  if(isShowSetModal&&moudleName=='userRoleManage'){
    dispatch({
      type:'role/updateStates',
      payload:{
        isShowSetModal:false,

      }
    })
  }
},[moudleName])
  //清空搜索框
  useEffect(()=>{
    // dispatch({
    //   type:"role/updateStates",
    //   payload:{
    //     searchWord:''
    //   }
    // })
    if((pathname=='/sysRole' || pathname=='/allRole' || pathname=='/unitRole')&&list.length==0){
      const roleType=pathname=='/sysRole'?'SYSROLE':(pathname=='/allRole'?'ALLROLE':'ORGROLE');
      dispatch({
        type:'role/updateStatesSelf',
        payload:{
          pathname:pathname
        }
      })
      dispatch({
        type:'role/updateStates',
        payload:{
          roleType:roleType,
          limit:limit
        }
      })
    }
  },[pathname])
  useEffect(()=>{
    if((pathname=='/sysRole' || pathname=='/allRole')&&list.length==0){
      const roleType=pathname=='/sysRole'?'SYSROLE':(pathname=='/allRole'?'ALLROLE':'ORGROLE');
      //获取列表
      dispatch({
        type:"role/getSysRoles",
        payload:{
          start:1,
          limit:limit,
          searchWord:'',
          roleType:roleType
        }
      })
    }
  },[])
  var viewDetailsModalRef; //查看Modalref
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width:ORDER_WIDTH,
      render:(value,obj,index)=><span>{index+1}</span>
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      ellipsis: true,
      width:BASE_WIDTH,
      render: (text, record) => (
        <div className={styles.col_four_width} title={text}>
          {getButton(menus,'view')?<a onClick={()=>{
            showDetails(record);
          }}>{text}</a>:text}
        </div>
      ),
    },
    {
      title: '角色简称',
      dataIndex: 'roleTag',
      key: 'roleTag',
      ellipsis: true,
      width:BASE_WIDTH,
      render: text => <div className={styles.col_four_width}>{text}</div>,
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      key: 'roleCode',
      width:BASE_WIDTH,
      render: text => <div className={styles.col_four_width}>{text}</div>,
    },

    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      key: 'roleDesc',
      ellipsis: true,
      width:BASE_WIDTH*2.5,
      render: text => <div className={styles.col_four_width}>{text}</div>,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width:BASE_WIDTH,
      render: text => <span>{dataFormat(text, 'YYYY-MM-DD')}</span>,
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      fixed: 'right',
      width:BASE_WIDTH,
      render: (text, obj) => (
        <div className="table_operation">
         <span
            onClick={(!obj.orgRoleType&&pathname=='/unitRole')?'':addRoleUser.bind(this, obj)}
            className={(!obj.orgRoleType&&pathname=='/unitRole')||obj.isAllowChange == 0||!(getButton(menus,'update')&&listButton(obj,'update'))||(obj.isPreset==1&&pathname=='/sysRole') ? 'disabled' : ''}
          >
            修改
          </span>
          <span
            onClick={(!obj.orgRoleType&&pathname=='/unitRole')?'':delRoles.bind(this, obj.id)}
            className={(!obj.orgRoleType&&pathname=='/unitRole') || obj.isAllowChange == 0||!(getButton(menus,'delete')&&listButton(obj,'delete'))||(obj.isPreset==1&&pathname=='/sysRole') ? 'disabled' : ''}
          >
            删除
          </span>
          <Dropdown overlay={operationMenu(obj)}>
            <span onClick={e => e.preventDefault()}>
              更多
              <DownOutlined />
            </span>
          </Dropdown>
        </div>
      ),
    },
  ];
  if(pathname=='/unitRole'){//单位角色增加角色类型展示
    columns.splice(4,0,
      {title: '角色类型',
        dataIndex: 'orgRoleType',
        key: 'orgRoleType',
        width:BASE_WIDTH,
        render:(text)=><div>{text?(text==1?'自有':'公共'):'全局'}</div>
      }
    )
  }
  //根据角色类型获取单位的列表按钮权限
  const listButton=(obj,oprationType)=>{
    if(pathname=='/unitRole'){
      if(obj.orgId==selectOrgId){
        return true//显示全部授权按钮
      }else if(oprationType!='relevanceButton'){
        return false
      }else{
        return true
      }
    }else{
      return true
    }
  }
  //操作按钮的更多
  const operationMenu=(obj)=>{
    return (
    <Menu>
      <Menu.Item
        onClick={(!obj.orgRoleType&&pathname=='/unitRole')?'':showCopyModal.bind(this,obj.id)}
        disabled={(!obj.orgRoleType&&pathname=='/unitRole') || !(getButton(menus,'auth')&&listButton(obj,'auth'))}
      >
        <span>
          复制权限
        </span>
      </Menu.Item>
      <Menu.Item
        onClick={(!obj.orgRoleType&&pathname=='/unitRole')?'':showSetModal.bind(this,'functionSet',obj)}
        disabled={(!obj.orgRoleType&&pathname=='/unitRole')|| !(getButton(menus,'auth')&&listButton(obj,'auth'))}
        className={(!obj.orgRoleType&&pathname=='/unitRole') || obj.isAllowChange == 0||!(getButton(menus,'delete')&&listButton(obj,'delete'))||(obj.isPreset==1&&pathname=='/sysRole') ? 'disabled' : ''}
      >
        <span>
        功能授权
        </span>
      </Menu.Item>
      <Menu.Item
        onClick={(!obj.orgRoleType&&pathname=='/unitRole')?'':showSetModal.bind(this,'dataSet',obj)}
        disabled={(!obj.orgRoleType&&pathname=='/unitRole')||!(getButton(menus,'auth')&&listButton(obj,'auth'))}
        className={(!obj.orgRoleType&&pathname=='/unitRole') || obj.isAllowChange == 0||!(getButton(menus,'delete')&&listButton(obj,'delete'))||(obj.isPreset==1&&pathname=='/sysRole') ? 'disabled' : ''}
      >
        <span>
        数据授权
        </span>
      </Menu.Item>
      <Menu.Item
        onClick={showSetModal.bind(this,'userSet',obj)}
        disabled={!(getButton(menus,'relevanceButton')&&listButton(obj,'relevanceButton'))}
      >
        <span>
        关联用户
        </span>
      </Menu.Item>
    </Menu>
    )
  }
  //显示甚至弹框
  const showSetModal=(tabValue,obj)=>{
    setIsShow(((!obj.orgRoleType&&pathname=='/unitRole')|| !(getButton(menus,'auth')&&listButton(obj,'auth')))?true:false);
    dispatch({
      type:'role/updateStates',
      payload:{
        tabValue:tabValue,
        isShowSetModal:true,
        roleId:obj.id,
        unitAllRole: !obj.orgRoleType&&pathname=='/unitRole'?true:false

      }
    })
  }
  //获取列表
  const getSysRoles=(start,limit,searchWord)=>{
    dispatch({
      type:"role/getSysRoles",
      payload:{
        start:start,
        limit:limit,
        searchWord:searchWord,
        roleType:roleType,
        orgId:selectOrgId
      }
    })
  }
  //分页
  const changePage=(nextPage,size)=>{
    dispatch({
      type:"role/updateStates",
      payload:{
        limit:size,
        currentPage:nextPage
      }
    })
    //获取列表
    getSysRoles(nextPage,size,searchWord)
  }
  const onSearch=(value)=>{
    //获取列表
    getSysRoles(1,limit,value)
  }
  const changeInput=(e)=>{
    dispatch({
      type:"role/updateStates",
      payload:{
        searchWord:e.target.value
      }
    })
  }
  //添加修改角色显示
  const addRoleUser=(obj)=>{
    if(roleType=='ORGROLE'&&!selectOrgId){
      message.error('请选择一个单位');
      return;
    }
    if(obj){
      dispatch({
        type:'role/updateStates',
        payload:{
          roleInfo:obj,
          isShowAddModal:true
        }
      })
    }else{
      dispatch({
        type:'role/updateStates',
        payload:{
          roleInfo:[],
          isShowAddModal:true
        }
      })
    }
  }
  //复制角色显示弹框
  const showCopyModal = (roleId)=>{
    dispatch({
      type:'role/updateStates',
      payload:{
        isShowAddModal:true,
        copyRoleId:roleId,
        roleInfo:[],
      }
    })
  }
  //选择
  const onSelectChange=(selectedRowKeys)=>{
    dispatch({
      type:'role/updateStates',
      payload:{
        selectedRowKeys:selectedRowKeys
      }
    })
  }
  //删除
  const delRoles=(roleId)=>{
    console.log('roleId=',roleId);
    if(!roleId&&!selectedRowKeys.length){
      message.error('请选择要删除的角色');
      return;
    }
    const roleIds = selectedRowKeys.length?selectedRowKeys.join(','):"";
    confirm({
      // title: '确认要删除角色?',
      content: '删除后不可恢复，确认删除吗？',
      getContainer:()=>{
        return document.getElementById(`${pathname.split("/")[1]}_container`)||false
      },
      mask:false,
      maskClosable:false,
      onOk() {
        dispatch({
          type:"role/delRoles",
          payload:{
            roleIds:roleIds?roleIds:roleId
          },
          pathname:pathname
        })
      }
    });
  }

  function showDetails(record) {
    addRoleUser(record)
    setIsView(true)
    // viewDetailsModalRef.show([
    //   { key: '角色名称', value: record.roleName },
    //   { key: '角色简称', value: record.roleTag },
    //   { key: '角色编码', value: record.roleCode },
    //   { key: '创建时间', value: record.createTime, type: 2 },
    //   { key: '角色描述', value: record.roleDesc, type: 3 },
    // ]);
  }

  return (
    <div className={styles.list_wrap} style={pathname=='/unitRole'?{paddingTop:'0px'}:{position:'relative'}}>
      <div className={styles.hearder}>
        <div className={styles.h_left}>
          <Search
            onChange={changeInput}
            onSearch={onSearch}
            value={searchWord}
            allowClear
            placeholder="请输入角色名称"
            enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
          />
        </div>
        <div className={styles.h_right}>
          {getButton(menus,'add')&&<Button type="primary" onClick={addRoleUser.bind(this, 0)}>
            新增
          </Button>}
          {getButton(menus,'delete')&&<Button onClick={delRoles.bind(this, '')}>删除</Button>}
        </div>
      </div>
      <div style={{height:'calc(100% - 100px)'}}>
        <Table
          dataSource={list}
          columns={columns}
          pagination={false}
          rowKey="id"
          scroll={list.length?{x:1100,y:'calc(100% - 40px)'}:{}}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps:(obj)=>({
              disabled:(!obj.orgRoleType&&pathname=='/unitRole') || obj.isAllowChange == 0||!(getButton(menus,'delete')&&listButton(obj,'delete'))
            })
          }}
        />
      </div>
      <IPagination
        current={currentPage}
        total={returnCount}
        onChange={changePage.bind(this)}
        pageSize={limit}
        isRefresh={true}
        refreshDataFn={()=> {getSysRoles(1,limit,searchWord)}}
      />
      {isShowAddModal && <AddUpdateModal location={location}  pathname={pathname} isView={isView} setIsView={setIsView}/>}
      {isShowSetModal && <RoleSet location={location} isShow={isShow} pathname={pathname}/>}
      {/* <ViewDetailsModal
        title="查看角色"
        containerId={`${pathname.split('/')[1]}_container`}
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      ></ViewDetailsModal> */}
    </div>
  );
}
export default connect(({role,loading,layoutG,user})=>{return {role,loading,layoutG,user}})(List);
