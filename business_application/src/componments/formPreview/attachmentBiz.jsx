import { Fragment, useState, useRef,useEffect} from 'react';
import {Form,Upload, Modal,Tooltip,message, Checkbox,Spin} from 'antd';
import Table from '../columnDragTable/index'
import { useDispatch, useSelector, useLocation,history} from 'umi';
import { DownloadOutlined,ArrowUpOutlined,ArrowDownOutlined,CloseOutlined } from '@ant-design/icons';
import  styles  from './UploadFile.less';
import _ from 'lodash'
import { dataFormat } from '../../util/util';
import AttachmentBizModal from './attachmentBizModal';
import {Button} from '@/componments/TLAntd';
import empty_bg from '../../../public/assets/empty_bg.svg'
import InfiniteScroll from 'react-infinite-scroll-component';
import {PullToRefresh, Modal as MobileModal, Toast} from 'antd-mobile/es'
const AttachmentBiz = (props)=>{
    const {disabled,setState,state,targetKey,isAuth} = props
    const dispatch = useDispatch();
    const {bizInfo,relBizInfoList,attShowRequire,workList} = state
    const [relBizInfos,setRelBizInfos] = useState([]);
    const [attachmentBizModal,setAttachmentBizModal] = useState(false);
    const bizList = relBizInfoList
    const [bizListIds,setBizListIds] = useState(bizList.length!=0?bizList.map((item)=>item.relBizInfoId).toString():'');
    const [relBizInfoIds,setRelBizInfoIds] = useState([]);
    const [checkedIds,setCheckedIds] = useState([]);
    function getBizList(){
      //获取关联文档数据
      dispatch({
        type: 'formShow/getRelBizInfoList',
        payload:{
          bizInfoId: bizInfo.bizInfoId
        }
      })
    }
    useEffect(()=>{
      if(bizList.length==0){//为了tab切换数据部消失
        getBizList()
      }
    },[])
    function onDelete(relBizInfoIds,index){//删除事项
      Modal.confirm({
        title: '确认删除此事项?',
        content: '',
        okText: '删除',
        cancelText: '取消',
        mask: false,
        getContainer:() =>{
          return document.getElementById(`formShow_container_${targetKey}`)
        },
        onOk: async () => {
          relBizInfoList.splice(index,1)
          setState({
            relBizInfoList
          })
        },
      });
    }
    function onDeleteBiInfos(){//删除事项
      MobileModal.confirm({
        content: '是否删除',
        onConfirm: async () => {
          let list = relBizInfoList.filter((item)=>!checkedIds.toString().includes(item.relBizInfoId))
          setState({
            relBizInfoList: list
          })
        },
      })
    }
    
  //上移下移
  function arraymove(fromIndex, toIndex){
    var element = relBizInfoList[fromIndex];
    relBizInfoList.splice(fromIndex, 1);
    relBizInfoList.splice(toIndex, 0, element);
    setState({
      relBizInfoList
    })
  }

  //上移下移
  function arraymoveMobile(text){
    if(checkedIds.length!=1){
      Toast.show({
        icon: 'error',
        content: '请选择一条数据移动',
      })
      return
    }
    let fromIndex = bizList.findIndex((item)=>{return item.relBizInfoId == checkedIds[0]})
    if(text=='上移'){
      if(fromIndex==0){
        return
      }
      arraymove(fromIndex,fromIndex-1)
    }
    if(text=='下移'){
      if((fromIndex==0&&fromIndex==bizList.length-1)||fromIndex==bizList.length-1){
        return
      }
      arraymove(fromIndex,fromIndex+1)
    }

  }
  //跳转到form页面
  const goForm=(record,e)=>{
    if(window.location.href.includes('/mobile')){
      e&&e.stopPropagation()
      e&&e.preventDefault()
      setAttachmentBizModal(false)
      historyPush({
        pathname: `/mobile/formOpenDetail`,
        query:{
          bizSolId:record.bizSolId,
          bizInfoId:record.relBizInfoId,
          title:record.bizTitle,
          id:record.relMainTableId,
          formUrl:'atta'
        }
      })
      return
    }
    //点击“返回”，需要返回到打开这个表单的页面（注：如果打开表单的页面已经被关闭了，就返回首页）
    const search =
    history.location.search.includes('?')
      ?history.location.search
      : `?${history.location.search}`;
    dispatch({
      type:"formShow/updateStatesGlobal",
      payload:{
        urlFrom:history.location.pathname+search
      }
    })
    historyPush({
      pathname: `/dynamicPage/formShow`,
      query:{
        bizSolId:record.bizSolId,
        bizInfoId:record.relBizInfoId,
        title:record.bizTitle,
        id:record.relMainTableId,
        formUrl:'atta'
      }
    })
    

  }
  const returnTableProps = (isModal) =>{
    let columns = [
      {
          title: '序号',
          dataIndex: 'key',
          render: (text,record,index)=><div>{index+1}</div>,
          width: '60px',
      },
      {
          title: '标题',
          dataIndex: 'bizTitle',
          render:(text,record)=>{return isModal?<span>{text}</span>:<a onClick={goForm.bind(this,record)}>{text}</a>}
      },
      {
          title: '业务类型',
          dataIndex: 'bizSolName',
          width: 80,
      },
      {
          title: '办理状态',
          dataIndex: 'bizStatus',
          width: '88px',
          render: text=><div >{text == '0' ? '待发' :(text=='1'?'在办':'办结')}</div>
      },
      {
          title: '拟稿人',
          dataIndex: 'draftUserName',
          ellipsis: true,
      },
      {
          title: '拟稿时间',
          dataIndex: 'draftTime',
          ellipsis: true,
          width: '120px',
          render: text=><div >{dataFormat(text,'YYYY-MM-DD')}</div>
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:'80px',
        render: (text,record,index)=>{
          return (
            <>{isAuth&&bizInfo.operation!='view'?<div>
              <CloseOutlined
                onClick={bizInfo.operation=='view'?()=>{}:onDelete.bind(this,record.relBizInfoId,index)}
                style={bizInfo.operation=='view'?{color:'rgb(221 209 209)'}:{}}
              />
              {index==0?'':
                <ArrowUpOutlined
                  onClick={bizInfo.operation=='view'?()=>{}:arraymove.bind(this,index,index-1)}
                  style={bizInfo.operation=='view'?{color:'rgb(221 209 209)'}:{}}
                />
              }
              {(index==0&&index==bizList.length-1)||index==bizList.length-1?'':
                <ArrowDownOutlined
                  onClick={bizInfo.operation=='view'?()=>{}:arraymove.bind(this,index,index+1)}
                  style={bizInfo.operation=='view'?{color:'rgb(221 209 209)'}:{}}
                />
              }
            </div>:null}
            </>
          )
        }
      }
    ]
    let modalcolumns = columns.filter((item)=>item.dataIndex!='operation')
    let tableProps = {
      columns: isModal?modalcolumns:columns,
      rowKey:isModal?'bizInfoId':'relBizInfoId',
      // loading: loading.global,
      pagination: false,
      locale:{ emptyText:'暂无数据'},
    }
    return tableProps
  }


  const modalTableProps = {
      rowSelection: {
        type: 'checkbox',
        selectedRowKeys:relBizInfoIds,
        onChange: (selectedRowKeys, selectedRows) => {
          setRelBizInfoIds(selectedRowKeys);
          setRelBizInfos(selectedRows);
        },
        getCheckboxProps: record => ({
          disabled: bizListIds.includes(record.bizInfoId)
        }),
      },
  }
  function getWorrkList(start,limit,searchWord){//获取事项列表
    dispatch({
      type: 'formShow/getAllWork',
      payload: {
        start,
        limit,
        searchWord,
        workRuleId: '',
        // notInInfoIds: bizListIds,
      },
      callback:(data)=>{

        let list = data.list
        if(window.location.href.includes('/mobile')&&start>1){
          list =[ ...workList, ...data.list]
        }
        setState({
          workReturnCount: data.returnCount,
          workallPage: data.allPage,
          workCurrentPage: data.currentPage,
          workListTitle: data.listTitle,
          workList: list,
        })
      }
    })
  }

  function onSaveAttachmentBiz(){
    debugger
    if(relBizInfoIds.length==0){
      message.error('请至少选择一条关联数据！')
      return
    }
    let relBizList = relBizInfoList
    let tmpRelBizInfos = [];
    relBizInfos.map((element)=>{
      element.relBizInfoId = element.bizInfoId;
      element.relMainTableId = element.mainTableId;
      if(!relBizInfoList.filter(i=>i.relBizInfoId==element.bizInfoId).length){
        tmpRelBizInfos.push(element);
      }
    })
    relBizList = relBizList.concat(tmpRelBizInfos)
    //移除必填项错误显示
    let tmpAttShowRequire = attShowRequire.filter(i=>i!='att');
    setState({
      relBizInfoList: relBizList,
      attShowRequire:tmpAttShowRequire
    })
    setAttachmentBizModal(false)
  }

  function onVisible(visible){
    if(visible){
      getWorrkList(1,window.location.href.includes('/mobile')?6:10,'')
      setRelBizInfoIds(bizListIds.split(','))
      setRelBizInfos([])
    }
    setAttachmentBizModal(visible)
  }
  const clickSelect = (record) => {
    if(bizListIds.includes(record.bizInfoId)){
      return false;
    }
    if (!relBizInfoIds.includes(record.bizInfoId)) {
      relBizInfos.push(record);
      relBizInfoIds.push(record.bizInfoId);
      setRelBizInfos(_.cloneDeep(relBizInfos));
      setRelBizInfoIds(_.cloneDeep(relBizInfoIds));
    } else {
      //移除
      let tmpKeys = relBizInfoIds.filter((i) => i != record.bizInfoId)
      let tmpSelectedRows = relBizInfos.filter((i) => i.bizInfoId != record.bizInfoId)
      setRelBizInfos(tmpSelectedRows);
      setRelBizInfoIds(tmpKeys);
    }
  }

  return(
      <div className={styles.container} style={{'pointer-events':disabled?'none':'',background:disabled?'#f5f5f5':''}}>
          {
            window.location.href.includes('/mobile')?
            <>
              {isAuth&&bizInfo.operation!='view'?<div className={styles.mobile_bt_container}>
              <a
                onClick={bizInfo.operation=='view'?()=>{}:onVisible.bind(this,true)}
                style={bizInfo.operation=='view'?{color:'rgb(221 209 209)'}:{}}
              >
                引用
              </a>
              <a
                onClick={bizInfo.operation=='view'?()=>{}:onDeleteBiInfos.bind(this)}
                style={bizInfo.operation=='view'?{color:'rgb(221 209 209)'}:{}}
              >
                删除
              </a>
              <a
                onClick={bizInfo.operation=='view'?()=>{}:arraymoveMobile.bind(this,'上移')}
                style={bizInfo.operation=='view'?{color:'rgb(221 209 209)'}:{}}
              >
                上移
              </a>
            
              <a
                onClick={bizInfo.operation=='view'?()=>{}:arraymoveMobile.bind(this,'下移')}
                style={bizInfo.operation=='view'?{color:'rgb(221 209 209)'}:{}}
              >
                下移
              </a>
              
          </div>:null}
          <Checkbox.Group
              className={styles.sol_container}
              id="scrollableDiv"
              onChange={(values)=>{setCheckedIds(values)}}
              value={checkedIds}
            >
              {bizList.length == 0 ? (
                <div className={styles.empty}>
                  <img src={empty_bg} />
                  <h4>暂无数据</h4>
                </div>
              ) : (
                <PullToRefresh onRefresh={getBizList}>
                  <InfiniteScroll
                    dataLength={bizList.length}
                    hasMore={false}
                    loader={<Spin className="spin_div" />}
                    // endMessage={
                    //   bizList?.length == 0 ? (
                    //     ''
                    //   ) : (
                    //     <span className="footer_more">没有更多啦</span>
                    //   )
                    // }
                    scrollableTarget="scrollableDiv"
                  >
                    {_.cloneDeep(bizList).length != 0 &&
                      _.cloneDeep(bizList)?.map((l, index) => {
                        return (
                          <div  key={l.relBizInfoId}>
                            <Checkbox value={l.relBizInfoId}>
                              <div className={styles.check_content}>
                                <span onClick={goForm.bind(this,l)} className={styles.fielName}>{l.bizTitle}</span>
                              </div>
                            </Checkbox>
                          </div>
                        );
                      })}
                  </InfiniteScroll>
                </PullToRefresh>
              )}
            </Checkbox.Group>
            </>:
            <>
              <div className={styles.bt_container}>
              {isAuth&&bizInfo.operation!='view'?<Button
                className={styles.bt}
                onClick={bizInfo.operation=='view'?()=>{}:onVisible.bind(this,true)}
                disabled={bizInfo.operation=='view'?true:false}
              >引用</Button>:null}
              </div>
              <Table {...returnTableProps(false)} dataSource={_.cloneDeep(bizList)}/>
            </>
          }
          
          {attachmentBizModal&&<AttachmentBizModal
            onVisible={onVisible}
            onSaveAttachmentBiz={onSaveAttachmentBiz}
            getWorrkList={getWorrkList}
            modalTableProps={modalTableProps}
            tableProps={returnTableProps(true)}
            setState={setState}
            state={state}
            targetKey={targetKey}
            clickSelect={clickSelect}
            relBizInfoIds={relBizInfoIds}
            bizListIds={bizListIds}
            goForm={goForm}
            relBizInfoList={relBizInfoList}
            />}

      </div>
  )
}
export default AttachmentBiz;
