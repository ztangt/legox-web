
import {connect,history} from 'umi';
import {TASKSTATUS,BIZSTATUS} from '../../../service/constant.js';
import styles from '../../../componments/works/list.less';
import WorkList from '../../../componments/works/list.jsx';
import {useState,useEffect} from 'react'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant.js'
import {useSetState} from 'ahooks';
function Work({dispatch,user,loading,location}){
  const {menuObj} = user;
  const [state,setState]=useSetState({
    limit: 0,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    searchWord:'',
    list:[],
    listTitle:{},
    searchColumnCodes:[],
    ctlgTree:[],
    businessList:[],
    selectedBizSolIds:[],
    workRules:[],
    listColumnCodes:[]
  })
  const {limit , currentPage,searchWord}=state
  //跟踪取消跟踪
  const traceWorkFn=(bizInfoId,isTrace,obj)=>{
    dispatch({
      type:"traceWork/traceWork",
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
    // getTraceWork(searchWord,currentPage,limit,[])
  }
  //获取列表
  const getTraceWork=(searchWord,start,limit,paramsJson,workRuleId)=>{
    const info = menuObj[location.pathname];
    const extraParams = info&&info.extraParams?queryString.parse(info.extraParams):{};
    const menuId = info?.id;
    const registerId = info?.registerId;
    dispatch({
      type:'traceWork/getTraceWork',
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
      setState,
      state,
      callback:(listTitle)=>{
        //showColumnsFn(listTitle)
      }
    })
  }
  return (
    <WorkList
    location={location}
    setParentState={setState}
    getListData={getTraceWork}
    stateObj={state}
    taskType='TRACE'
    placeholder="输入标题"
    oprationCol={
      {
        title:'操作',
        dataIndex:'bizInfoId',
        width:BASE_WIDTH,
        fixed: 'right',
        render:(text,obj)=><div className={styles.table_operation}>
          {obj.isTrace&&obj.isTrace!='0'?
            <a onClick={traceWorkFn.bind(this,text,0,obj)} className={JSON.parse(localStorage.getItem('leavePost'))==1?styles.forbidden:''}>取消跟踪</a>
            :
            <a onClick={traceWorkFn.bind(this,text,1,obj)} className={JSON.parse(localStorage.getItem('leavePost'))==1?styles.forbidden:''}>跟踪</a>
          }
        </div>
      }
    }
  />
  )
}
export default connect(({user,loading})=>{return {user,loading}})(Work);
