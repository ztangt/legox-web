
import {connect,history} from 'umi';
import {TASKSTATUS,BIZSTATUS} from '../../../service/constant.js';
import styles from '../../../componments/works/list.less';
import WorkList from '../../../componments/works/list.jsx';
import {useState,useEffect} from 'react';
import {message,Button,Dropdown,Menu,Modal} from 'antd';
import AdviceModal from './adviceModal.jsx'
import {DownOutlined } from '@ant-design/icons';
import {dataFormat} from '../../../util/util.js';
import ActivateNodeModal from './activateNodeModal.jsx';
import TransferModal from './transferModal.jsx'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant.js'
import {useSetState} from 'ahooks';
import {getButtons,getButton} from '../../../util/util.js'
var maxDataruleCodes = JSON.parse(
  localStorage.getItem('maxDataruleCodes') || '{}',
);
function Work({dispatch,loading,location,user}){
  const {menuObj,menus} = user;
  const [state,setState]=useSetState({
    limit: 0,
    allPages: 0,
    returnCount: 0,
    currentPage: 0,
    searchWord:'',
    listTitle:{},
    list:[],
    searchColumnCodes:[],
    ctlgTree:[],
    businessList:[],
    selectedBizSolIds:[],
    workRules:[],
    listColumnCodes:[],
    selectedRowKeys:[],
    selectedNodeId:'',
    selectedDataIds:[],
    treeData:[],
    currentNode:[],
    expandedKeys:[],
    treeSearchWord:[],
    selectedDatas:[],
    originalData:[],
    selectNodeType:'',
    bizSigns: [],//签批意见
    adviceVisible: false,//签批意见
    signs: [],//意见
    activateNodes:[],
    listTitle:{},
    transferId:'',//转办行id
    handleList:{},//办理详情
    isTransfer:false,
    detailData:{},//转办详情
    headerParams:{},
    beforeButton:[],
    afterButton:[],
    maxDataruleCode:maxDataruleCodes[location.pathname]
  })
  const {selectedRowKeys,adviceVisible,isShowActivateNode,transferId,isTransfer,headerParams,beforeButton,afterButton,maxDataruleCode} = state;
  console.log(beforeButton,'beforeButton');
  console.log('adviceVisible',adviceVisible);
  function tree(data, path) {
    for (let i = 0; i < data.length; i++) {
      let item = data[i];

      if (item.path === path) {
        return item;
      } else {
        if (item.children && item.children.length > 0) {
          let res = tree(item.children, path);
          if (res) return res;
        }
      }
    }
  };
  useEffect(()=>{
    const obj=tree(menus,location.pathname)
    if(obj.buttonList&&obj.buttonList.length<=3){
      const buttons=obj.buttonList.slice(0,3)
      console.log(buttons,'buttons');
      setState({
        beforeButton:buttons
      })
    }
    if(obj.buttonList&&obj.buttonList.length>3){
      const button=obj.buttonList.slice(0,3)
      const buttons=obj.buttonList.slice(3,7)
      setState({
        beforeButton:button,
        afterButton:buttons,
      })
    }
  },[])
  console.log(tree(menus,location.pathname),'akshjd');
  const getButtonClick=(item,obj)=>{
    if(item.buttonCode=="emActive"){
      getActivateNodes(obj.bizInfoId,obj)
    }else if(item.buttonCode=="emHangup"){
      hanguP(obj.bizInfoId,obj)
    }else if(item.buttonCode=="emStop"){
      breakUp(obj)
    }else if(item.buttonCode=="emCacel"){
      cancleMonitor(obj.bizInfoId,0,obj)
    }else if(item.buttonCode=="emEditops"){
      onSign(obj.bizInfoId,obj)
    }else if(item.buttonCode=="emTransfer"){
      showChangeDo(obj.bizInfoId,obj)
    }else if(item.buttonCode=="emRestore"){
      recover(obj.bizInfoId,obj)
    }
  }

  const columns = [
    {
      title:'序号',
      dataIndex:'index',
      key:'index',
      width:ORDER_WIDTH,
      render:(value,obj,index)=><span onClick={goFormUrl.bind(this,obj)}>{index+1}</span>,
      fixed:'left'
    },
    {
      title: '标题',
      dataIndex: 'bizTitle',
      key: 'bizTitle',
      width:BASE_WIDTH*2.5,
      render:(text,obj)=><div className={styles.title} onClick={goFormUrl.bind(this,obj)} title={text}>{text}</div>
    },
    {
      title: '业务类型',
      dataIndex: 'bizSolName',
      key: 'bizSolName',
      width:BASE_WIDTH,
    },
    {
      title: '拟稿人',
      dataIndex: 'draftUserName',
      key: 'draftUserName',
      width:BASE_WIDTH,
    },
    {
      title: '拟稿时间',
      dataIndex: 'draftTime',
      key: 'draftTime',
      width:BASE_WIDTH,
      ellipsis:true,
      render:(text)=><span style={{cursor:'pointer'}} title={text?dataFormat(text,'YYYY-MM-DD HH:mm:ss'):''}>{text?dataFormat(text,'YYYY-MM-DD HH:mm:ss'):''}</span>
    },
    {
      title: '办理状态',
      dataIndex: 'bizStatus',
      key: 'bizStatus',
      width:BASE_WIDTH,
      render:(text)=><div>{BIZSTATUS[text]}</div>
    },
    {
      title: '当前节点',
      dataIndex: 'actName',
      key: 'actName',
      width:BASE_WIDTH,
    },
    {
      title:'操作',
      dataIndex:'bizTaskId',
      width:BASE_WIDTH,
      fixed:'right',
      render:(text,obj)=>{
        console.log(obj,'obj==');
        // let newArray = []
        // let newButton=[]
        // if(obj.bizStatus=='3'){
        //   newArray =  beforeButton.filter((item=>item.buttonName!=='挂起'))
        //   newButton=afterButton.filter((item=>item.buttonName!=='挂起'))
        // }else{
        //   newArray = obj.bizStatus=='1'?beforeButton.filter(item=>item.buttonName!=='恢复'):beforeButton
        //   newButton=obj.bizStatus=='1'?afterButton.filter(item=>item.buttonName!=='恢复'):afterButton
        // }
        return <div className={styles.table_operation} style={{width:'150px'}}>
        {
          beforeButton&&beforeButton.map((item,index)=>{
            return <span style={{marginRightL:8}} className={(obj.bizStatus=='1'&&item.buttonName=='恢复')||(obj.bizStatus=='3'&&item.buttonName=='挂起')?styles.monitorWork_button:''} onClick={()=>{getButtonClick(item,obj)}} disabled={(obj.bizStatus=='1'&&item.buttonName=='恢复')||(obj.bizStatus=='3'&&item.buttonName=='挂起')} > {item.buttonName}</span>
          })
        }
            {  afterButton.length?<Dropdown overlay={
                <Menu>
                  {afterButton.map((item,index)=>{
                    return <Menu.Item key={item.id} className={(obj.bizStatus=='1'&&item.buttonName=='恢复')||(obj.bizStatus=='3'&&item.buttonName=='挂起')?styles.monitorWork_button:''} onClick={()=>{getButtonClick(item,obj)}} disabled={(obj.bizStatus=='1'&&item.buttonName=='恢复')||(obj.bizStatus=='3'&&item.buttonName=='挂起')}  >
                        <span >{item.buttonName}</span>
                      </Menu.Item>
                  })}
                </Menu>
              } trigger={['click']}>
                <span className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  <DownOutlined />
                </span>
              </Dropdown>:''}
     </div>
      // return <div className={styles.table_operation} style={{width:'150px'}}>
      //   {getButtons(menus,'emCacel',location.pathname)&&<a onClick={cancleMonitor.bind(this,obj.bizInfoId,0,obj)}>撤销</a>}
      //  { getButtons(menus,'emEditops',location.pathname)&&<a onClick={onSign.bind(this,obj.bizInfoId,obj)}>意见修改</a>}
      //  { getButtons(menus,'emTransfer',location.pathname)&&<a onClick={()=>{showChangeDo(obj.bizInfoId,obj)}}>转办</a>}
      //   <Dropdown overlay={
      //           <Menu>
      //             {getButtons(menus,'emActive',location.pathname)&&<Menu.Item key="0" onClick={getActivateNodes.bind(this,obj.bizInfoId,obj)}>
      //               <span>激活</span>
      //             </Menu.Item>}
      //             {obj.bizStatus=='3'&&getButtons(menus,'emRestore',location.pathname)&&<Menu.Item key="1" >
      //               {<span onClick={()=>{recover(obj.bizInfoId,obj)}}>恢复</span>}
      //             </Menu.Item>
      //             }
      //             {obj.bizStatus!=='3'&&getButtons(menus,'emHangup',location.pathname)&&
      //             <Menu.Item key="1" >
      //             {<span onClick={(e)=>{hanguP(obj.bizInfoId,e,obj)}}>挂起</span>}
      //           </Menu.Item>
      //             }
      //             {getButtons(menus,'emStop',location.pathname)&&<Menu.Item key="2">
      //               <span onClick={()=>{breakUp(obj)}}>终止</span>
      //             </Menu.Item>}
      //           </Menu>
      //         } trigger={['click']}>
      //           <span className="ant-dropdown-link" onClick={e => e.preventDefault()}>
      //             <DownOutlined />
      //           </span>
      //         </Dropdown>
      // </div>
      }
    }
  ];
  //挂起
  const hanguP=(bizInfoId,obj)=>{
    // e.preventDefault()
    Modal.confirm({
      title: '确认挂起吗?',
      content: '',
      mask:false,
      getContainer:()=>{
        return document.getElementById('monitorWork_container')
      },
      onOk:()=>{
        dispatch({
          type:'monitorWork/monitorHangup',
          payload:{
            bizInfoId,
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
      }
    })
  }
  //恢复
  const recover=(bizInfoId,obj)=>{
    Modal.confirm({
      title: '确认恢复吗？',
      content: '',
      mask:false,
      getContainer:()=>{
        return document.getElementById('monitorWork_container')
      },
      onOk:()=>{
        dispatch({
          type:'monitorWork/monitorRecover',
          payload:{
            bizInfoId,
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
      }
    })
  }
  //终止
  const breakUp=(obj)=>{
    if(obj.bizStatus==2){
      message.error('已办结，不可终止')
    }else{
      Modal.confirm({
        title: '确认终止吗?',
        content: '',
        mask:false,
        getContainer:()=>{
          return document.getElementById('monitorWork_container')
        },
        onOk:()=>{
          dispatch({
            type:'monitorWork/completeBiz',
            payload:{
              bizInfoId:obj.bizInfoId,
              bizTaskId:obj.bizTaskId,
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
        }
      })
    }
  }
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
      pathname: `/formShow`,
      query:{
        bizSolId:obj.bizSolId,
        bizInfoId:obj.bizInfoId,
        title:obj.bizTitle,
        id: obj.mainTableId,
        maxDataruleCode
      }
    })
  }
  //获取激活节点
  const getActivateNodes=(bizInfoId,obj)=>{
    dispatch({
      type:"monitorWork/getActivateNodes",
      payload:{
        bizInfoId:bizInfoId,
      },
      params:{
        bizSolId:obj.bizSolId,
        mainTableId:obj.mainTableId,
        deployFormId:obj.formDeployId?obj.formDeployId:'',
        bizInfoId:obj.bizInfoId?obj.bizInfoId:'',
      },
      setState,
      state,
      callback:()=>{
        setState({
          isShowActivateNode:true,
          activateBizInfoId:bizInfoId,
          headerParams:obj
        })
      }
    })
  }
  //意见修改
  const onSign=(bizInfoId,obj)=>{
    dispatch({
      type:'monitorWork/getBizTaskSingns',
      payload:{
        bizInfoId,
      },
      params:{
        bizSolId:obj.bizSolId,
        mainTableId:obj.mainTableId,
        deployFormId:obj.formDeployId?obj.formDeployId:'',
        bizInfoId:obj.bizInfoId?obj.bizInfoId:'',
      },
      setState,
      state,
    })
    setState({
      adviceVisible: true,
      handleList:obj,
      headerParams:obj
    })
  }
  //撤销
  const cancleMonitor=(bizInfoId,isTrace,obj)=>{
    Modal.confirm({
      title: '确认撤销吗?',
      content: '',
      mask:false,
      getContainer:()=>{
        return document.getElementById('monitorWork_container')
      },
      onOk:()=>{
        dispatch({
          type:"monitorWork/cancleMonitor",
          payload:{
            bizInfoId:bizInfoId,
          },
          params:{
            bizSolId:obj.bizSolId,
            mainTableId:obj.mainTableId,
            deployFormId:obj.formDeployId?obj.formDeployId:'',
            bizInfoId:obj.bizInfoId?obj.bizInfoId:'',
          },
          setState,
          state,
        })
      }
    })
  }
  //获取列表
  const getMonitorWork=(searchWord,start,limit,paramsJson)=>{
    const info = menuObj[location.pathname];
    const extraParams = info&&info.extraParams?queryString.parse(info.extraParams):{};
    const menuId = info?.id;
    const registerId = info?.registerId;
    dispatch({
      type:'monitorWork/getMonitorWork',
      payload:{
        searchWord,
        start,
        limit,
        paramsJson:JSON.stringify(paramsJson),
        ...extraParams,
        menuId,
        registerId
      },
      setState,
      state
    })
  }
  // const handelCancel=()=>{
  //   setIsShowRelevance(false)
  //   dispatch({
  //     type:"monitorWork/updateStates",
  //     payload:{
  //       selectedRowKeys:[]
  //     }
  //   })

  // }
  const showChangeDo= async(bizInfoId,obj)=>{
    // dispatch({
    //   type:'monitorWork/updateStates',
    //   payload:{
    //     transferId:text
    //   }
    // })
    // if(selectedRowKeys.length){
      // setIsShowRelevance(true)
    // }else{
    //   message.error('请选择要转办的事项');
    // }
   await dispatch({
      type:'monitorWork/getBpmnDetail',
      payload:{
        bizInfoId,
        hasBpmn:'0',
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
    setState({
      isTransfer: true,
      headerParams:obj
    })
  }
  return (
    <div id="monitorWork_container" style={{height:'100%'}}>
    <WorkList
      location={location}
      id='monitorWork_container'
      defaultColumns={columns}
      setParentState={setState}
      getListData={getMonitorWork}
      stateObj={state}
      taskType='MONITOR'
      isShowWorkRule={false}
      placeholder="输入标题"
      rowKey='bizInfoId'
      // oprationRenderHtml={
      // <div className={styles.button_right}>
      //   <Button type="primary" onClick={()=>{showChangeDo()}}>转办</Button>
      // </div>}
    />
    {/* {isShowRelevance&&
      <ChangeUser
        location={location}
        handelCancel={handelCancel}
        bizTaskIds={transferId}
        spaceInfo={monitorWork}
        nameSpace={'monitorWork'}
        getContainerId={'monitorWork_container'}
      />
    } */}
    {adviceVisible&&<AdviceModal setParentState={setState} parentState={state} loading={loading}/>}
    {isShowActivateNode&&<ActivateNodeModal setParentState={setState} parentState={state} loading={loading}/>}
    {isTransfer&&<TransferModal setParentState={setState} parentState={state}/>}
    </div>
  )
}
export default connect(({user,loading})=>{return {user,loading}})(Work);
