import {connect,history} from 'umi';
import styles from '../../../componments/works/list.less';
import WorkList from '../../../componments/works/list';
import {useState,useEffect} from 'react';
import CateModal from '../../../componments/works/cateModal.jsx';
import {Button,message} from 'antd';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import {useSetState} from 'ahooks';
function Work({dispatch,user,loading,location}){
  const {menuObj} = user;
  const [state,setState] = useSetState({
    limit: 0,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    searchWord:'',
    list:[],
    listTitle:{},
    searchColumnCodes:[],
    workRules:[],
    listColumnCodes:[],
    ctlgTree:[],
    businessList:[],
    selectedBizSolIds:[],
    isShowCateModal:false,
    selectedRowKeys:[],
    categorList:[],
    buttonPos:false
  })
  const {listTitle,selectedRowKeys,isShowCateModal,categorList,currentPage,limit,searchWord,buttonPos} = state;
  //跟踪取消跟踪
  const traceWork=(bizInfoId,isTrace,obj)=>{
    dispatch({
      type:"allWork/traceWork",
      payload:{
        bizInfoIds:bizInfoId,
        traceType:isTrace,
      },
      params:{
        bizSolId:obj.bizSolId,
        mainTableId:obj.mainTableId,
        deployFormId:obj.formDeployId?obj.formDeployId:'',
        bizInfoId:obj.bizInfoId?obj.bizInfoId:'',
      },
      setState,
      state
    })
    getAllWork(searchWord,currentPage,limit,[],'')
  }
  //获取列表
  const getAllWork=(searchWord,start,limit,paramsJson,workRuleId)=>{
    const info = menuObj[location.pathname];
    const extraParams = info&&info.extraParams?queryString.parse(info.extraParams):{};
    const menuId = info?.id;
    const registerId = info?.registerId;
    dispatch({
      type:'allWork/getAllWork',
      payload:{
        searchWord,
        start,
        limit,
        paramsJson:JSON.stringify(paramsJson),
        workRuleId,
        ...extraParams,
        menuId,
        registerId
      },
      setState
    })
  }
  //个人归档
  const showCateModalFn=()=>{
    if(!selectedRowKeys.length){
      message.error('请选择要归档的事项');
      return;
    }
    //获取类型
    dispatch({
      type:"allWork/getWorkCategory",
      callback:()=>{
        setState({
          isShowCateModal:true
        })
      },
      setState,
      state
    })
  }
  //关闭
  const handelCancle=()=>{
    setState({
      isShowCateModal:false
    })
  }
  //提交
  const submitFn=(checkedKeys)=>{
    if(checkedKeys.length){
      dispatch({
        type:"allWork/addCollWork",
        payload:{
          categoryIds:checkedKeys.join(','),
          bizInfoIds:selectedRowKeys.join(',')
        },
        setState
      })
    }else{
      categorList.length?message.error('请选择分类'):message.error('暂无分类')
    }

  }
  console.log('isShowCateModal=',isShowCateModal);
  return (
    <div id="allWork_cate">
      <WorkList
      location={location}
      setParentState={setState}
      getListData={getAllWork}
      stateObj={state}
      rowKey="bizInfoId"
      taskType='ALL'
      oprationRenderHtml={
        <div className={!buttonPos?styles.pos:styles.button_right}>
          <Button type="primary" onClick={showCateModalFn}>事项分类</Button>
        </div>
      }
      placeholder="输入标题/拟稿人/拟稿部门"
      oprationCol={
        {
          title:'操作',
          dataIndex:'bizInfoId',
          width:BASE_WIDTH,
          fixed:'right',
          render:(text,obj)=><div className={styles.table_operation}>
            {obj.isTrace=='1'?
              <a onClick={traceWork.bind(this,text,0,obj)} className={JSON.parse(localStorage.getItem('leavePost'))==1?styles.forbidden:''}>取消跟踪</a>
              :
              <a onClick={traceWork.bind(this,text,1,obj)} className={JSON.parse(localStorage.getItem('leavePost'))==1?styles.forbidden:''}>跟踪</a>
            }
          </div>
        }
      }
    />
    {isShowCateModal&&
      <CateModal
        handelCancle={handelCancle}
        categorList={categorList}
        submitFn={submitFn}
        id="allWork_cate"
      />}
  </div>
  )
}
export default connect(({user,loading})=>{return {user,loading}})(Work);
