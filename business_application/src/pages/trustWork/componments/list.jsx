
import {connect,history} from 'umi';
import {TASKSTATUS,BIZSTATUS} from '../../../service/constant.js';
import styles from '../../../componments/works/list.less';
import WorkList from '../../../componments/works/list.jsx';
import {dataFormat} from '../../../util/util.js';
import {useState,useEffect} from 'react';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant.js'
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
    selectedBizSolIds:[]
  })
  const {currentPage,limit,searchWord}=state
  //跟踪取消跟踪
  const traceWork=(bizInfoId,isTrace,obj)=>{
    dispatch({
      type:"trustWork/traceWork",
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
    getTrustWork(searchWord,currentPage,limit,[],'')

  }
  //获取列表
  const getTrustWork=(searchWord,start,limit,paramsJson,workRuleId)=>{
    const info = menuObj[location.pathname];
    const extraParams = info&&info.extraParams?queryString.parse(info.extraParams):{};
    const menuId = info?.id;
    const registerId = info?.registerId;
    dispatch({
      type:'trustWork/getTrustWork',
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
    getListData={getTrustWork}
    stateObj={state}
    taskType='TRUST'
    placeholder="输入标题"
    oprationCol={
      {
        title:'操作',
        dataIndex:'bizInfoId',
        width:BASE_WIDTH,
        fixed: 'right',
        render:(text,obj)=><div className={styles.table_operation}>
          {
          obj.isTrace&&obj.isTrace!='0'?
            <a onClick={traceWork.bind(this,text,0,obj)} className={JSON.parse(localStorage.getItem('leavePost'))==1?styles.forbidden:''}>取消跟踪</a>
            :
            <a onClick={traceWork.bind(this,text,1,obj)} className={JSON.parse(localStorage.getItem('leavePost'))==1?styles.forbidden:''}>跟踪</a>
          }
        </div>
      }
    }
  />
  )
}
export default connect(({user,loading})=>{return {user,loading}})(Work);
