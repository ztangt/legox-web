import { connect } from 'dva';
import React, { useState, useCallback, useRef ,useEffect} from 'react';
import {Input,Space,Button,Table,Popover,message,Modal,Spin} from 'antd';
import styles from './index.less';
import { dataFormat } from '../../util/util.js';
import { history } from 'umi';
import {MenuOutlined} from '@ant-design/icons';
import ADMINMG from './components/adminMgModal'
import ReSizeLeftRight from '../../componments/public/reSizeLeftRight';
import ORGANIZATION from './components/organizationAddModal'; //组织中心新增
function Organization({dispatch,loading,location,layoutG}){
  const pathname='/organization';
  const {organizationLists,addModal,organizationAddModal,organizationId,organizationUg,orgClildrens,expandOrgList,contextMenuId,returnCount,returnCountUse,tenantOrgShare,orgCenterId, selectedOrgRows,orgDeptIds,tenantId} = layoutG.searchObj[pathname];


  const [organizationObj, setOrganizationObj] = useState({});
  const [itemActive, setItemActive] = useState('');
  const [visibleItems, setVisibleItems] = useState(50);
  const listContainerRef = useRef(null);
  useEffect(() => {
    dispatch({
      // 点击请求数据
      type:"organization/getTenants",
      payload:{
        searchValue:'',
        start:1,
        limit:1000,
      }
    }) 
    const container = listContainerRef.current;
    // 当列表容器滚动到底部时加载更多数据
    const handleScroll = () => {
      if (Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight) {
        loadMore();
      }
      if(container.scrollTop == 0){
        setVisibleItems(50)
      }
    };
    container.addEventListener('scroll', handleScroll,true);
    return () => {
      container.removeEventListener('scroll', handleScroll,false);
    };
  }, []);
  function checkWOrd(value){
    let specialKey = "`@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'";
    for (let i = 0; i < value.length; i++) {
      if (specialKey.indexOf(value.substr(i, 1)) != -1) {
        return true
      }
    }
    return false
  }
  function onCancel(){
    dispatch({
        type:"organization/updateStates",
        payload:{
          organizationAddModal:false
        }
    })  
  } 

  const content = (
    <div>
      <p style={{cursor:'pointer'}} onClick={orgAddClick.bind(this,organizationObj)}>修改</p>
      <p style={{cursor:'pointer'}} onClick={deleteClick.bind(this,organizationObj)}>删除</p>
    </div>
  );
  function deleteClick(item,e){
    e.stopPropagation();
    dispatch({
      type:"organization/updateStates",
      payload:{
        contextMenuId:''
      }
    })
    Modal.confirm({
        title: '确认删除',
        content: '确认删除',
        okText: '删除',
        cancelText: '取消',
        onOk() {
          dispatch({
            type:"organization/deleteOrgCenters",
            payload:{
              orgCenterIds:item.id
            }
          })
        }
    });
  }
  function adminMgClick(item,e){
    layoutG.searchObj[pathname]['users'].searchWord = '';
    window.localStorage.setItem('rosNum_cloud', null);
    window.localStorage.setItem('orgIds_cloud', JSON.stringify({orgCenterId: item.orgCenterId,tenantId:item.id}));
    dispatch({
      type:"organization/updateStates",
      payload:{
        organizationId:item.id,
        tenantOrgShare:item.tenantOrgShare,
        orgCenterId: item.orgCenterId,
        orgClildrens:[],
        postLists:[],
        userLists:[],
        orgItemUg:{},
        expandOrgList:[],
        contextMenuId:'',
        tenantId:'',
        selectedOrgRows:[],
        orgDeptIds:[],
        currentUser:item
      }
    })
    dispatch({
      // 点击请求数据
      type:"organization/getTenantOrg",
      payload:{
        // nodeType:'DEPT',
        tenantId:item.id,
        start:1,
        limit:10,
      }
    }) 
   // 切换租户时将当前页数和展示条数设置为初始值
   layoutG.searchObj[pathname]['users'].currentPage = 1;
   layoutG.searchObj[pathname]['users'].limit = 10;
  }
  function orgAddClick(obj,e){ //组织中心新增
    e.stopPropagation();
    dispatch({
      type:"organization/updateStates",
      payload:{
        organizationAddModal:true,
        organizationUg:obj,
        contextMenuId:''
      }
    })  
  }
  
  function onContextMenu(item,e){
    setOrganizationObj(item)
    dispatch({
      type:"organization/updateStates",
      payload:{
        contextMenuId:item.id
      }
    })  
  }
   // 加载更多岗位数据
   const loadMore = useCallback(() => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 50);
  }, []);
  function ulList(list) {
    const listItems = list&&list.slice(0, visibleItems).map((item,i) =>{
        return (<li key={i} style={{width:'200px', lineHeight: '26px',padding:'0 10px', whiteSpace:'nowrap'}} onClick={adminMgClick.bind(this,item)} className={item.id == organizationId ? styles.active : ''}>
            <Popover placement="rightTop" trigger='contextMenu' visible={item.id == contextMenuId ? true : false}>
              <span style={{border:'0',padding:'4px 5px',boxShadow:0,maxWidth:'210px',textAlign:'left'}}>{item.tenantName}</span>
            </Popover>
        </li>)
    });
    return (
        <ul ref={listContainerRef} style={{paddingTop:'8px', overflow: 'auto', position:'absolute', height:'calc(100% - 50px)', width: '100%'}} className="left">{listItems} {visibleItems < list.length && (
          <span onClick={loadMore}><Spin /></span>
        )}</ul>
    );
  }
  function onSearchTree(value){
    if(checkWOrd(value)){
      message.error('查询条件不支持特殊字符，请更换其它关键字！')
      return
    }
    dispatch({
      type: 'organization/getTenants',
      payload:{
        searchWord:value,
        start:1,
        limit:1000
      }
    })
  }
                  
  return (
    <div style={{height: '100%',backgroundColor:'#fff',marginTop:'0px'}} id='organization_container'>
        <div>
            <ReSizeLeftRight
                suffix={'organization'}
                leftChildren={
                  <div style={{paddingTop:'8px'}}>
                    
                    <div style={{display:'flex',width:'200px'}}>
                      <Input.Search
                          className={styles.search}
                          placeholder={'租户名称/账号'}
                          allowClear
                          onSearch={(value)=>{onSearchTree(value)}}
                      />
                      {/* <Space>
                          <Button className={styles.fontSize7} style={{padding:'4px 10px',left:'-3px'}} onClick={orgAddClick.bind(this,{})}>新增</Button>
                      </Space> */}
                    </div>
                    {ulList(organizationLists)}
                  </div>
                }
                rightChildren={
                  <div style={{height:'100%'}}>
                    <ADMINMG location={location}/>
                  </div>
                }
            />
        </div>
         {organizationAddModal && (<ORGANIZATION  //组织中心新增 
                loading={loading.global}
                onAddCancel={onCancel.bind(this)}
                organizationUg={organizationUg}
                // onAssSubmit = {onAssSubmit.bind(this)}
          />)}
    </div>
  )
}
export default connect(({organization,layoutG})=>({
  organization,
  layoutG,
}))(Organization);
