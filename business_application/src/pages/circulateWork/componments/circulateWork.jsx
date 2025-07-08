
import {connect,history} from 'umi';
import {TASKSTATUS,BIZSTATUS} from '../../../service/constant.js';
import styles from '../../../componments/works/list.less';
import WorkList from '../../../componments/works/list.jsx';
import {dataFormat} from '../../../util/util.js';
import {useState,useEffect} from 'react';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant.js'
import {useSetState} from 'ahooks';
function Work({dispatch,loading,location,user}){
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
  const {limit,currentPage,searchWord,list }=state
  const goFormUrl=(obj)=>{
    if(obj.taskStatus!='2'){
      dispatch({
        type:`circulateWork/setCirculate`,
        payload:{
          bizTaskIds:obj.bizTaskId,
        },
        setState:setState,
        isShowMessge:false
      })
    }
    historyPush({
      pathname: `/circulateWork/formShow`,
      query:{
        bizSolId:obj.bizSolId,
        bizInfoId:obj.bizInfoId
      }
    })
  }
  //跟踪取消跟踪
  const traceWork=(bizInfoId,isTrace,obj)=>{
    dispatch({
      type:"circulateWork/traceWork",
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
      callback:(list)=>{
        setState(list)

      }
    })
    getCirculateWork(searchWord,currentPage,limit,[],'')
  }
  //获取列表
  const getCirculateWork=(searchWord,start,limit,paramsJson,workRuleId)=>{
    const info = menuObj[location.pathname];
    const extraParams = info&&info.extraParams?queryString.parse(info.extraParams):{};
    const menuId = info?.id;
    const registerId = info?.registerId;
    dispatch({
      type:'circulateWork/getCirculateWork',
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
      callback:(listTitle)=>{
        //showColumnsFn(listTitle)
      },
      setState
    })
  }
  const extraOprationFn=(obj)=>{
    setTimeout(()=>{
      list.map((item)=>{
        if(item.bizTaskId==obj.bizTaskId&&(item.taskStatus=='0'||item.taskStatus=='1')){
          item.taskStatus="2";
        }
      })
      setState({
        list:JSON.parse(JSON.stringify(list))
      })
    },500)
  }
  return (
    <WorkList
    location={location}
    goFormUrlProps={goFormUrl}
    getListData={getCirculateWork}
    setParentState={setState}
    stateObj={state}
    taskType='CIRCULATE'
    placeholder='输入标题'
    extraOprationFn={extraOprationFn}
    oprationCol = {
      {
        title:'操作',
        dataIndex:'bizInfoId',
        width:BASE_WIDTH,
        fixed: 'right',
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
  )
}
export default connect(({user,loading})=>{return {user,loading}})(Work);
