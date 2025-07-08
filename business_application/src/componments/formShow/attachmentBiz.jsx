import { Fragment, useState, useRef,useEffect} from 'react';
import { Table,Form,Button,Upload, Modal,Input,message} from 'antd';
import { useDispatch, useSelector, useLocation} from 'umi';
import { DownloadOutlined,ArrowUpOutlined,ArrowDownOutlined,CloseOutlined } from '@ant-design/icons';
import  styles  from './UploadFile.less';
import _ from 'lodash'
import { dataFormat } from '../../util/util';
import AttachmentBizModal from './attachmentBizModal';

const AttachmentBiz = (props)=>{
    const { tableColCode,disabled,relType,isMultiple,placeholder } = props
    console.log('tableColCode',tableColCode);
    const dispatch = useDispatch();
    const { stateObj } = useSelector(({formShow})=>({...formShow}));
    const bizSolId = useLocation().query.bizSolId;
    const bizInfoId = useLocation().query.bizInfoId;
    const currentTab = useLocation().query.currentTab;
    const { bizInfo,formRelBizInfoList,relBizInfoList,workCurrentPage,workReturnCount,workLimit,workList,workSearchWord } = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];
    const [loading,setLoading] = useState({});
    const [relBizInfos,setRelBizInfos] = useState([]);
    const [attachmentBizModal,setAttachmentBizModal] = useState(false);
    const bizList = relType=='FORM'?(tableColCode&&formRelBizInfoList[tableColCode]&&formRelBizInfoList[tableColCode]||[]):relBizInfoList
    const bizListIds = bizList.length!=0?bizList.map((item)=>item.relBizInfoId||item.bizInfoId).toString():'';
    const [relBizInfoIds,setRelBizInfoIds] = useState([]);

    console.log('relBizInfoIds',relBizInfoIds);
    useEffect(()=>{
        if(bizInfoId){
          if(relType=='FORM'){
            dispatch({
                type: 'formShow/getFormRelBizInfoList',
                payload:{
                  bizInfoId: bizInfoId
                }
            })

          }else{
              dispatch({
                  type: 'formShow/getRelBizInfoList',
                  payload:{
                    bizInfoId: bizInfoId
                  }
              })
          }
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
          return document.getElementById('formShow_container')
        },
        onOk: async () => {
            // if(relBizInfoIds){
            //   dispatch({
            //     type: 'formShow/deleteRelBizInfo',
            //     payload:{
            //         bizInfoId: bizInfoId,
            //         columnCode: tableColCode,
            //         relBizInfoIds,
            //         relType,
            //     },
            //   })
            // }else{
                console.log('relType',relType);
                if(relType=='FORM'){
                  formRelBizInfoList[tableColCode].splice(index,1)
                }else{
                  relBizInfoList.splice(index,1)

                }
                dispatch({
                    type: 'formShow/updateStates',
                    payload:{
                      formRelBizInfoList,
                      relBizInfoList,
                      relBizTarget: true,
                    }
                })
            // }

        },
      });

}

function onUPDOWN(currentKey,option){//上移/下移
  let preIndex = option=='UP'?currentKey-2:currentKey+1
  let nextIndex = option=='UP'?currentKey-1:currentKey+2
  let preId = bizList[preIndex]&&bizList[preIndex].id
  let nextId = bizList[nextIndex]&&bizList[nextIndex].id
  let targetId = bizList[currentKey].id
  // if(preId==targetId){//第一个下移时
  //   preId = bizList[currentKey+1]&&bizList[currentKey+1].id
  // }
  // if(nextId==targetId){//最后一个上移时
  //   targetId = bizList[currentKey-1]&&bizList[currentKey-1].id
  // }
  dispatch({
       type: 'formShow/updateAttachment',
       payload:{
           preId,
           nextId,
           targetId,
       },
       relType,
       updateType:'BIZ'
   }) 
}

function arraymove(fromIndex, toIndex){ 
  if(relType=='FORM'){
      var element = formRelBizInfoList[tableColCode][fromIndex];     
      formRelBizInfoList[tableColCode].splice(fromIndex, 1);     
      formRelBizInfoList[tableColCode].splice(toIndex, 0, element);
  }else{
      var element = relBizInfoList[fromIndex];     
      relBizInfoList.splice(fromIndex, 1);     
      relBizInfoList.splice(toIndex, 0, element);
  }
  dispatch({
      type: 'formShow/updateStates',
      payload:{
          relBizInfoList,
          formRelBizInfoList,
          relBizTarget: true,
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
          title: '操作',
          dataIndex: 'operation',
          render: (text,record,index)=><div >
              <CloseOutlined  onClick={onDelete.bind(this,record.relBizInfoId,index)}/>
              {index==0?'':<ArrowUpOutlined onClick={arraymove.bind(this,index,index-1)}/>}
              {(index==0&&index==bizList.length-1)||index==bizList.length-1?'':<ArrowDownOutlined onClick={arraymove.bind(this,index,index+1)}/>}
              </div>
      },
      {
          title: '标题',
          dataIndex: 'bizTitle',
      },
      {
          title: '业务类型',
          dataIndex: 'bizSolName',
      },
      {
          title: '办理状态',
          dataIndex: 'bizStatus',
          render: text=><div >{text == '0' ? '待发' :(text=='1'?'待办':'办结')}</div>
      },
      {
          title: '拟稿人',
          dataIndex: 'draftUserName',
      },
      {
          title: '拟稿时间',
          dataIndex: 'draftTime',
          render: text=><div >{dataFormat(text,'YYYY-MM-DD')}</div>
      }]
    let modalcolumns = columns.filter((item)=>item.dataIndex!='operation')
    let tableProps = {
      columns: isModal?modalcolumns:columns,
      rowKey:isModal?'bizInfoId':'relBizInfoId',
      // loading: loading.global,
      pagination: false,
      locale:{ emptyText: placeholder?placeholder:'暂无数据'},



    }
    return tableProps
  }
  

  const modalTableProps = {
      pagination: {
        total: workReturnCount,
        pageSize: 5,
        showSizeChanger:true,
        showTotal: (total)=>{return `共 ${total} 条` },
        current: workCurrentPage,
        pageSize: workLimit,
        pageSizeOptions: [5,10,15,20,25,30,35,40,45,50],
        onChange: (page,size)=>{
          dispatch({
            type: 'formShow/updateStates',
            payload:{
              workCurrentPage: page,
              workLimit: size
            }
          })
          getWorrkList(page,size,workSearchWord)
        }

      },
      rowSelection: {
        type: isMultiple=='YES'?'checkbox':'radio',
        selectedRowKeys: isMultiple=='YES'?relBizInfoIds:[relBizInfoIds[relBizInfoIds.length-1]],
        onChange: (selectedRowKeys, selectedRows) => {
          console.log('selectedRowKeys',selectedRowKeys)
          var srs = []
          for (let index = 0; index < selectedRows.length; index++) {
            const element = selectedRows[index];
            // selectedRows[index]['relBizInfoId'] = element.bizInfoId
            element.relBizInfoId = element.bizInfoId
            if(!bizListIds.includes(element.bizInfoId)){
              srs.push(element)
            }
          }
          setRelBizInfoIds(selectedRowKeys);
          setRelBizInfos(srs);
        },
        getCheckboxProps: record => ({
          disabled: bizListIds.includes(record.bizInfoId)
        }),
      },
  }
  function getWorrkList(start,limit,searchWord){//获取事项列表
    console.log('bizListIds',bizListIds,relType);
    dispatch({
      type: 'formShow/getAllWork',
      payload: {
        start,
        limit,
        searchWord,
        workRuleId: '',
        // notInInfoIds: bizListIds,
      }
    })
  }

  function onSaveAttachmentBiz(){
    console.log('relType',relType,tableColCode);
    if(relBizInfoIds.length==0){
      message.error('请至少选择一条关联数据！')
      return
    }
    let relBizList = relBizInfoList
    if(relType=='FORM'){
        if(!formRelBizInfoList[tableColCode]){
          formRelBizInfoList[tableColCode] = []
        }
        if(isMultiple=='YES'){
          formRelBizInfoList[tableColCode] = formRelBizInfoList[tableColCode].concat(relBizInfos);
        }else{
          formRelBizInfoList[tableColCode] = relBizInfos;
        }

    }else{
      relBizList = relBizList.concat(relBizInfos)
    }
    dispatch({
      type: 'formShow/updateStates',
      payload:{
          relBizInfoList: relBizList,
          formRelBizInfoList,
          // attachmentBizModal: false,
          relBizTarget: true,
      }
    })  
    setAttachmentBizModal(false)
    // dispatch({
    //   type: 'formShow/saveRelBizInfo',
    //   payload:{
    //     relBizInfoIds: relBizInfoIds.toString(),
    //     bizInfoId: bizInfoId,
    //     relType,
    //     columnCode: tableColCode,
    //     bizSolId
    //   }
    // })

  }

  function onVisible(visible){
    if(visible){
      getWorrkList(1,workLimit,'')
      setRelBizInfoIds(bizListIds.split(','))
      setRelBizInfos([])

    }
    setAttachmentBizModal(visible)

    // dispatch({
    //   type: 'formShow/updateStates',
    //   payload:{
    //     attachmentBizModal: visible
    //   }
    // })
  }

  function onChangeWord(e){
    dispatch({
      type:'formShow/updateStates',
      payload:{
        workSearchWord:e.target.value
      }
    })
  }

  





    return(
        <div className={styles.container} style={{'pointer-events':disabled?'none':'',background:disabled?'#f5f5f5':''}}>
            <div className={styles.bt_container}>
                <Button className={styles.bt} onClick={onVisible.bind(this,true)}>引用</Button>
            </div>
            <Table {...returnTableProps(false)} dataSource={_.cloneDeep(bizList)}/>
            {attachmentBizModal&&<AttachmentBizModal 
              onVisible={onVisible} 
              onSaveAttachmentBiz={onSaveAttachmentBiz} 
              getWorrkList={getWorrkList} 
              modalTableProps={modalTableProps} 
              tableProps={returnTableProps(true)}
              relType={relType}
              />}
            
        </div>
    )
}
export default AttachmentBiz;
