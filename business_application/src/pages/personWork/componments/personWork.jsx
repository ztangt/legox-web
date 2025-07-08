
import {connect,history} from 'umi';
import styles from '../../../componments/works/list.less';
import WorkList from '../../../componments/works/list';
import {useState,useEffect} from 'react';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import ITree from '../../../componments/public/iTree.jsx';
import curStyles from './personWork.less';
import {FormOutlined,PlusOutlined,MinusOutlined} from '@ant-design/icons';
import {dataFormat} from '../../../util/util';
import AddModal from './addModal';
import {Modal,Button,message} from 'antd';
import CateModal from '../../../componments/works/cateModal';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import {useSetState} from 'ahooks';
const {confirm} = Modal;
var maxDataruleCodes = JSON.parse(
  localStorage.getItem('maxDataruleCodes') || '{}',
);
function Work({dispatch,loading,location,user}){
  const {menuObj} = user;
  const [state,setState] = useSetState({
    limit: 0,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    searchWord:'',
    list:[],
    searchColumnCodes:[],
    selectCategorId:'all',
    categorList:[],
    selectCategorInfo:{},
    isShowAddModal:false,
    isShowMoveModal:false,
    selectedRowKeys:[],
    noConditionList:[],//用于判断是否能够新增分类
    listTitle:{},
    maxDataruleCode:maxDataruleCodes[location.pathname],
    isShowButton:false
  })
  const {list,categorList,selectCategorId,limit,isShowAddModal,selectedRowKeys,isShowMoveModal,
    noConditionList,selectUpdateCategoryInfo,selectCategorInfo,maxDataruleCode,isShowButton}=state;
   const treeCategorList=[{
    title:'事项分类',
    key:'all',
    children:categorList
  }]
  let columns=[
    {
      title:'序号',
      dataIndex:"index",
      key:'index',
      width:ORDER_WIDTH,
      render:(text,obj,index)=><span>{index+1}</span>
    },
    {
      title:'标题',
      dataIndex:"bizTitle",
      key:'bizTitle',
      width:BASE_WIDTH*2.5,
      render:(text,obj)=><span className={styles.title} onClick={goFormUrl.bind(this,obj)} title={text}>{text}</span>
    },
    {
      title:'业务类型',
      dataIndex:"bizSolName",
      width:BASE_WIDTH,
    },
    {
      title:"办理状态",
      dataIndex:'bizStatus',
      render:(text)=><span>{text=='DONE'?'办结':(text=='TODO'?'在办':'待发')}</span>,
      width:BASE_WIDTH,
    },
    {
      title:'拟稿时间',
      dataIndex:'draftTime',
      render:(text)=><span>{text?dataFormat(text,'YYYY-MM-DD HH:mm:ss'):""}</span>,
      width:BASE_WIDTH,
    },
    {
      title:'拟稿人',
      dataIndex:'draftUserName',
      width:BASE_WIDTH,
    }
  ]
  const goFormUrl=(obj)=>{
    //点击“返回”，需要返回到打开这个表单的页面（注：如果打开表单的页面已经被关闭了，就返回首页）
    const search =
    location.search.includes('?') || !location.search
      ? location.search
      : `?${location.search}`;
    dispatch({
      type: "formShow/updateStatesGlobal",
      payload: {
        urlFrom: location.pathname + search
      }
    })
    historyPush({
      pathname: `/personWork/formShow`,
      query:{
        bizSolId:obj.bizSolId,
        bizInfoId:obj.bizInfoId,
        title:obj.bizTitle,
        id: obj.mainTableId,
        maxDataruleCode
      }
    })
  }
  useEffect(()=>{
    //获取分类
    dispatch({
      type:"personWork/getWorkCategory",
      setState,
      state
    })
  },[])
  useEffect(()=>{
    //查询所有的归档事项
    setState({
      searchWord:'',
      paramsJson:[]
    })
    getCollectionWork('',1,limit,[]);
  },[selectCategorId])
  //获取列表
  const getCollectionWork=(searchWord,start,limit,paramsJson)=>{
    const info = menuObj[location.pathname];
    const extraParams = info&&info.extraParams?queryString.parse(info.extraParams):{};
    const menuId = info?.id;
    const registerId = info?.registerId;
    dispatch({
      type:'personWork/getCollectionWork',
      payload:{
        searchWord,
        start,
        limit,
        categoryId:selectCategorId=='all'?'0':selectCategorId,
        paramsJson:JSON.stringify(paramsJson),
        ...extraParams,
        menuId,
        registerId
      },
      setState,
      state
    })
  }
  //通过分类id获取归档事项
  const selectCategorInfoFn=(selectedKeys,info)=>{
    console.log('info=',info);
    setState({
      selectCategorId:selectedKeys[0],
      selectCategorInfo:info.node,
      selectedRowKeys:[]
    })
  }
  //显示添加（ 点击的时候需要为选中状态）
  const showAddModal=(nodeData,type,e)=>{
    e.stopPropagation();
    //最末级的时候有归档的工作事项则不能添加分类，可以编辑
    if(!nodeData.children.length&&type=='add'&&nodeData.key==selectCategorId&&noConditionList.length){
      message.error('下面有工作事项不能添加分类');
      return false;
    }
    setState({
      selectCategorId:nodeData.key,
      selectCategorInfo:nodeData,
      selectUpdateCategoryInfo:type=='add'?[]:nodeData,
      list:selectCategorId!=nodeData.key?[]:list,
      isShowAddModal:true
    })
  }
  //删除
  const deleteCategory=(nodeData,e)=>{
    e.stopPropagation();
    confirm({
      content:'确认要删除吗？',
      onOk(){
        dispatch({
          type:"personWork/deleteCategory",
          payload:{
            categoryId:nodeData.key
          },
          setState,
          state
        })
      }
    })
  }
  //分类的操作
  const titleRender=(nodeData)=>{
    console.log('nodeData=',nodeData);
    return (
      <div className={curStyles.tree_title}>
        <div style={{display:"inline-block"}}>{nodeData.title}</div>
        <div className={curStyles.hover_opration}>
          <PlusOutlined onClick={showAddModal.bind(this,nodeData,'add')}/>
          {nodeData.key!='all'?<FormOutlined onClick={showAddModal.bind(this,nodeData,'update')}/>:''}
          {nodeData.key!='all'?<MinusOutlined onClick={deleteCategory.bind(this,nodeData)}/>:''}
        </div>
      </div>
    )
  }
  const leftChildren=(
    <ITree
      isSearch={false}
      treeData={treeCategorList}
      onSelect={selectCategorInfoFn}
      field={{titleName:"categoryName",key:"categoryId",children:"children"}}
      selectedKeys={selectCategorId}
      style={{width:'auto'}}
      titleRender={titleRender}
      defaultExpandAll={true}
    />
  )
  //显示移动弹框
  const showMoveModal=()=>{
    if(selectedRowKeys.length){
      setState({
        isShowMoveModal:true
      })
    }else{
      message.error('请选择要移动的事项')
    }
  }
  const submitFn=(selectIds)=>{
    dispatch({
      type:"personWork/updateCollectionWork",
      payload:{
        bizInfoIds:selectedRowKeys.join(','),
        fromCategoryId:selectCategorId,
        toCategoryIds:selectIds.join(',')
      },
      setState,
      state
    })
  }
  const handelCancle=()=>{
    setState({
      isShowMoveModal:false
    })
  }
  //删除
  const deleteCollWork=()=>{
    if(selectedRowKeys.length){
      confirm({
        content:'确认要删除吗？',
        onOk(){
          dispatch({
            type:"personWork/deleteCollWork",
            payload:{
              bizInfoIds:selectedRowKeys.join(','),
              categoryId:selectCategorId
            },
            setState,
            state
          })
        }
      })
    }else{
      message.error('请选择要删除的事项')
    }
  }
  console.log('isShowAddModal=',isShowAddModal);
  console.log('noConditionList=',noConditionList);
  return (
    <div id="add_work_modal">
      <ReSizeLeftRight
        isShowRight={true}
        leftChildren={leftChildren}
        rightChildren={
          <WorkList
          location={location}
            defaultColumns={columns}
            setParentState={setState}
            getListData={getCollectionWork}
            stateObj={state}
            taskType='CATEGORY'
            isShowWorkRule={false}
            rowKey="bizInfoId"
            placeholder="输入标题/业务类型/办理状态"
            oprationRenderHtml={
              Object.keys(selectCategorInfo).length&&!selectCategorInfo.children.length?
              <div className={!isShowButton?styles.pos_person:styles.button_right}>
                <Button type="primary" onClick={showMoveModal} style={{marginRight:!isShowButton?8:0}}>移动</Button>
                <Button type="primary" onClick={deleteCollWork}>删除</Button>
              </div>
              :null
            }
          />
        }
      />
      {isShowAddModal&&(!Object.keys(selectCategorInfo).length||selectCategorInfo.children.length||Object.keys(selectUpdateCategoryInfo).length||!noConditionList.length)?
        <AddModal setParentState={setState} parentState={state}/>
      :""}
      {isShowMoveModal&&<CateModal categorList={categorList} submitFn={submitFn} handelCancle={handelCancle} id="add_work_modal" setParentState={setState} parentState={state}/>}
    </div>
  )
}
export default connect(({user,loading})=>{return {user,loading}})(Work);
