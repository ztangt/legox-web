import {Table,Input,Modal} from 'antd';
import {connect,history} from 'umi';
import styles from '../../../componments/works/list.less';
import WorkList from '../../../componments/works/list';
import TaskDetails from './taskDetails';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import {useSetState} from 'ahooks';
import queryString from 'query-string';
const {Search}=Input;
const {confirm}=Modal
function DoneWork({dispatch,doneWork,loading,location,user}){
  const {menuObj} = user;
  const [state,setState] = useSetState({
    limit: 0,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    listTitle:{},
    searchWord:'',
    list:[],
    searchColumnCodes:[],
    workRules:[],
    listColumnCodes:[],
    workRuleId:'',
    isShowDetail:false,//撤回任务详情
    selectedRowKeys:[],
    tableData:[],
    rowId:'',
    headerParams:{},
    isConfirm:false
  })
  const {listTitle,currentPage,limit,searchWord,isShowDetail,isConfirm} = state;
  //撤销
  const recoverBizInfo= async(bizInfoId,obj)=>{
    setState({
      rowId:bizInfoId,
      headerParams:obj
    })
    await dispatch({
      type:'doneWork/recallTask',
      payload:{
        bizInfoId
      },
      headerParams:obj,
      callback:(data,tableData,isShowDetail)=>{
        setState({
          isShowDetail:isShowDetail,
          tableData:tableData,
        })
        if(data.length==1&&data[0].simple){
          confirm({
            title:'确认撤回吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            mask: false,
            getContainer:() =>{
              return document.getElementById('modal_biz_sol_DONE')
            },
            onOk: async () => {
              const newObj={}
              newObj[data[0].bizTaskId]=tableData.map(item=>item.id)
              dispatch({
                type:'doneWork/recoverTask',
                payload:{
                    bizInfoId:bizInfoId,
                    recoverTask:JSON.stringify(newObj),
                },
                headerParams:obj,
                callback:()=>{
                  getDoneWork(searchWord,currentPage,limit,[],'')
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
    // confirm({
    //   title: '是否确认撤回此文件？',
    //   icon: <ExclamationCircleOutlined />,
    //   okText: '确定',
    //   okType: 'danger',
    //   cancelText: '取消',
    //   mask:false,
    //   getContainer:(()=>{
    //     return document.getElementById('modal_biz_sol_DONE')
    //   }),
    //   onOk() {
    //     dispatch({
    //       type:"doneWork/recoverBizInfo",
    //       payload:{
    //         bizTaskId:bizTaskId
    //       }
    //     })
    //   },
    // });
  }
  //跟踪取消跟踪
  const traceWork=(bizInfoId,isTrace,obj)=>{
    dispatch({
      type:"doneWork/traceWork",
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
          list:list
        })
      }
    })
    getDoneWork(searchWord,currentPage,limit,[],'')
  }
  //获取列表
  const getDoneWork=(searchWord,start,limit,paramsJson,workRuleId)=>{
    const info = menuObj[location.pathname];
    const extraParams = info&&info.extraParams?queryString.parse(info.extraParams):{};
    const menuId = info?.id;
    const registerId = info?.registerId;
    if(registerId&&menuId){
      dispatch({
        type:'doneWork/getDoneWork',
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
  }

  return (
  <div>
    <WorkList
      location={location}
      setParentState={setState}
      getListData={getDoneWork}
      stateObj={state}
      taskType='DONE'
      placeholder='输入标题/拟稿人/拟稿部门'
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
            <a onClick={recoverBizInfo.bind(this,obj.bizInfoId,obj)} className={JSON.parse(localStorage.getItem('leavePost'))==1?styles.forbidden:''}>撤回</a>
          </div>
        }
      }
    />
    {(isShowDetail||isConfirm)&&<TaskDetails setParentState={setState} parentState={state}/>}
  </div>
  )
}
export default connect(({doneWork,user,loading})=>{return {doneWork,user,loading}})(DoneWork);
