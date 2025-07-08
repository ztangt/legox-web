import {connect,history} from 'umi';
import styles from '../../../componments/works/list.less';
import WorkList from '../../../componments/works/list';
import { useEffect,useState } from 'react';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import {useSetState} from 'ahooks';
import queryString from 'query-string';
import RECOVER from '../../../../public/assets/撤.svg'
import BACK from '../../../../public/assets/驳.svg'
import RETURN from '../../../../public/assets/转.svg'
import TRUSTED from '../../../../public/assets/委.svg'
function WaitMatter({dispatch,loading,location,user}){
  const {menuObj} = user;
  const [state,setState] = useSetState({
    columns:[],
    limit: 0,
    allPages: 0,
    currentHeight: 0,
    returnCount: 0,
    currentPage: 0,
    listTitle:{},
    searchWord:'',
    list:[],
    searchColumnCodes:[],
    ctlgTree:[],
    businessList:[],
    workRules:[],
    listColumnCodes:[]
  })
  const {listTitle,currentPage,limit,searchWord,list,columns}=state;
  const goFormUrl=(obj)=>{
    historyPush({
      pathname: `waitMatter/formShow`,
      query:{
        bizSolId:obj.bizSolId,
        bizInfoId:obj.bizInfoId,
        bizTaskId:obj.bizTaskId,
        title:obj.bizTitle
      }
    })
  }

  const showMakeAction=(makeAction)=>{
    switch(makeAction){
      case 'DRAFT':
      case 'SEND':
        return null;
      case 'RECOVER':
        return <img src={RECOVER} width={18} height={18}/>
      case 'BACK':
        return <img src={BACK} width={18} height={18}/>;
      case 'RETURN':
       return <img src={RETURN} width={18} height={18}/>;
      case 'TRUSTED':
        return <img src={TRUSTED} width={18} height={18}/>
      default:
        return null;
    }
  }
  //跟踪取消跟踪
  const traceWork=(bizInfoId,isTrace,obj)=>{
    dispatch({
      type:"waitMatter/traceWork",
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
        setState(list);
      }
    })
    getTodoWork(searchWord,currentPage,limit,[],'')
  }
  //获取列表
  const getTodoWork=(searchWord,start,limit,paramsJson,workRuleId)=>{
    console.log('pathname==',location.pathname);
    const info = menuObj[location.pathname];
    const extraParams = info&&info.extraParams?queryString.parse(info.extraParams):{};
    const menuId = info?.id;
    const registerId = info?.registerId;
    if(registerId&&menuId){
      dispatch({
        type:'waitMatter/getTodoWork',
        payload:{
          searchWord,
          paramsJson:JSON.stringify(paramsJson),
          start,
          limit,
          workRuleId,
          ...extraParams,
          menuId,
          registerId
        },
        callback:(data)=>{
          setState({...data});
        }
      })
    }

  }
  const extraOprationFn=(obj)=>{
    setTimeout(()=>{
      list&&list.map((item)=>{
        if(item.bizTaskId==obj.bizTaskId&&item.taskStatus=='0'){
          item.taskStatus="1";
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
      columns={columns}
      setParentState={setState}
      // nameSpace="waitMatter"
      getListData={getTodoWork}
      stateObj={state}
      extraOprationFn={extraOprationFn}
      taskType='TODO'
      placeholder="输入标题/拟稿人/拟稿部门/送办人"
      showMakeAction={showMakeAction}
      oprationCol={
        {
          title:'操作',
          dataIndex:'bizInfoId',
          width:BASE_WIDTH,
          fixed: 'right',
          render:(text,obj)=><div className={styles.table_operation}>
            {obj.isTrace&&obj.isTrace!='0'?
              <span onClick={traceWork.bind(this,text,0,obj)}>取消跟踪</span>
              :
              <span onClick={traceWork.bind(this,text,1,obj)}>跟踪</span>
            }
          </div>
        }
      }
    />
  )
}
export default connect(({loading,user})=>{return {loading,user}})(WaitMatter);
