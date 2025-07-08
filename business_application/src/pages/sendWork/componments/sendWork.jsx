import {connect,history} from 'umi';
import styles from '../../../componments/works/list.less';
import WorkList from '../../../componments/works/list';
import {dataFormat} from '../../../util/util';
import { useEffect,useState } from 'react';
import {BIZSTATUS,TASKSTATUS} from '../../../service/constant.js';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import {Modal} from 'antd'
import TaskDetails from './taskDetails';
import {useSetState} from 'ahooks';
import QueryString from 'qs';
const {confirm}=Modal
function SendWork({dispatch,loading,user,location}){
  const {menuObj} = user;
    const [state,setState]=useSetState({
      limit: 0,
      allPages: 0,
      returnCount: 0,
      currentPage: 0,
      listTitle:{},
      searchWord:'',
      list:[],
      searchColumnCodes:[],
      ctlgTree:[],
      businessList:[],
      workRules:[],
      listColumnCodes:[],
      headerParams:{},
      rowId:'',
      tableData:[],
      isShowDetail:false,//撤回任务详情
      selectedRowKeys:[],
      isConfirm:false
    })
    const { currentPage,limit,searchWord,headerParams,isShowDetail,isConfirm}=state
    const recoverBizInfo=async(bizInfoId,obj)=>{
      setState({
        rowId:bizInfoId,
        headerParams:obj
      })
      await dispatch({
        type:'sendWork/recallTask',
        payload:{
          bizInfoId
        },
        headerParams:obj,
        callback:(data,tableData,isShowDetail)=>{
          setState({
            isShowDetail,
            tableData
          })
          if(data.length==1&&data[0].simple){
            confirm({
              title:'确认撤回吗？',
              content: '',
              okText: '确定',
              cancelText: '取消',
              mask: false,
              getContainer:() =>{
                return document.getElementById('modal_biz_sol_SEND')
              },
              onOk: async () => {
                const objData={}
                objData[data[0].bizTaskId]=tableData.map(item=>item.id)
                dispatch({
                  type:'sendWork/recoverTask',
                  payload:{
                      bizInfoId:bizInfoId,
                      recoverTask:JSON.stringify(objData)
                  },
                  headerParams:obj,
                  callback:()=>{
                    getSendWork(searchWord,currentPage,limit,[],'')
                  }
              })
              },
              onCancel:async()=>{
                setState({
                  isConfirm:true
                })
              }
            })
          }
        }
      })
    }
  //跟踪取消跟踪
  const traceWork=(bizInfoId,isTrace,obj)=>{
    dispatch({
      type:"sendWork/traceWork",
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
        setState({
          list
        })
      }
    })
    getSendWork(searchWord,currentPage,limit,[],'')
  }
  //获取列表
  const getSendWork=(searchWord,start,limit,paramsJson,workRuleId)=>{
    const info = menuObj[location.pathname];
    const extraParams = info&&info.extraParams?QueryString.parse(info.extraParams):{};
    const menuId = info?.id;
    const registerId = info?.registerId;
    dispatch({
      type:'sendWork/getSendWork',
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
        setState({
          ...data
        })
      }
    })
  }
  return (
    <div>
    <WorkList
      nameSpace="sendWork"
      getListData={getSendWork}
      setParentState={setState}
      stateObj={state}
      location={location}
      taskType='SEND'
      placeholder='输入标题/拟稿人/拟稿部门'
      oprationCol={
        {
          title:'操作',
          dataIndex:'bizInfoId',
          width:BASE_WIDTH,
          fixed: 'right',
          render:(text,obj)=><div className={styles.table_operation}>
            {obj.isTrace&&obj.isTrace!='0'?
              <a onClick={traceWork.bind(this,text,0,obj)} className={JSON.parse(localStorage.getItem('leavePost'))==1?styles.forbidden:''}>取消跟踪</a>
              :
              <a onClick={traceWork.bind(this,text,1,obj)} className={JSON.parse(localStorage.getItem('leavePost'))==1?styles.forbidden:''}>跟踪</a>
            }
            <a onClick={recoverBizInfo.bind(this,obj.bizInfoId,obj)} className={JSON.parse(localStorage.getItem('leavePost'))==1?styles.forbidden:''}>撤回</a>
          </div>
        }
      }
    />
    {(isShowDetail||isConfirm)&&<TaskDetails setParentState={setState} parentState={state}/>}
    </div>
  )
}
export default connect(({user,loading})=>{return {user,loading}})(SendWork);
