import React,{useState,useEffect} from 'react'
import { Modal, Radio, Space,Input,message } from 'antd'
import { connect } from 'dva'
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight'
import IPagination from '../../../componments/public/iPagination'
import GlobalModal from '../../../componments/GlobalModal'
import styles from './configReplication.less'
import Table from '../../../componments/columnDragTable';
function configReplication({ dispatch, query ,nodeModalActId,nodeElement,
  setParentState,parentState}) {
      const {bizSolId}=query
    const { taskActs ,mainFormCurrent,mainFormReturnCount,bizFromInfo,formList,bizSolInfo } = parentState
    const [limit,setLimit] = useState(10);
    const [searchWord,setSearchWord]=useState('')
    const [rowRecord, setRowRecord] = useState({});
    const [actId, setActId] = useState('');
    useEffect(()=>{
        getFromList('',10,1)
    },[])
    const getFromList=(searchWord,limit,start)=>{
        dispatch({
            type:'applyModelConfig/getBizSolVersionList',
            payload:{
                bizSolId:bizSolInfo.bizSolId,
                formDeployId:bizFromInfo.formDeployId,
                searchWord,
                limit,
                start
            },
            extraParams:{
              setState:setParentState,
              state:parentState
            }
        })
    }
    const onCancel = () => {
      setParentState({
        isShowConfigModal: false,
        taskActs:[]
      })
    }
    const onOk = () => {
        if(actId){
            dispatch({
                type:'applyModelConfig/saveBizSolNode',
                payload:{
                    bizSolId:bizFromInfo.bizSolId,
                    procDefId:bizFromInfo.procDefId,
                    formDeployId:bizFromInfo.formDeployId,
                    targetActIds:nodeModalActId,
                    sourceBizSolId:rowRecord.bizSolId,
                    sourceProcDefId:rowRecord.procDefId,
                    sourceActId:actId
                },
                extraParams:{
                  setState:setParentState,
                  state:parentState
                }
            })
        }else{
            message.error('请选择节点！')
        }
    }
    const tableProps = {
        rowKey:'bizSolId',
        columns: [
            {
                title: '序号',
                render:(text,record,index)=><span>{index+1}</span>
            },
            {
                title: '名称',
                dataIndex: 'bizSolName',
            },
            {
                title: '标识',
                dataIndex: 'bizSolCode',
            },
        ],
        dataSource: formList,
        pagination:false,
        scroll:{y:'calc(100% - 40px)'}
    }
  //分页
  const changePage=(nextpage,size)=>{
    setLimit(size)
    getFromList(searchWord,size,nextpage)
    setParentState({
      mainFormCurrent: nextpage,
      taskActs:[]
    })
  }
  //选中行
  const getNodes=(record)=>{
    return {
        onClick:()=>{
            setRowRecord(record)
            setParentState({
              taskActs:record.actIds
            })
        }
    }
  }
  const setRowClassName = (record,index) => {
    let className = '';
    if(record.bizSolId === rowRecord.bizSolId){
      className = index % 2 === 0 ? 'oddRow clickRowsStyle' : 'evenRow clickRowsStyle';
    }else{
      className = index % 2 === 0 ? 'oddRow' : 'evenRow';
    }
    return className;
  };
  const onSearchTable=(value)=>{
    setSearchWord(value)
    getFromList(value,limit,mainFormCurrent)
  }
  const changeRadio=(e)=>{
    console.log(e.target.value);
    setActId(e.target.value)
  }

    const leftRender = () => {
        return <div className={styles.leftContent}>
            <div className={styles.search}>
                <Input.Search placeholder='请输入名称' allowClear onSearch={value => {
                  onSearchTable(value);
                }}/>
            </div>
            <div className={styles.leftTable}>
                <Table 
                  {...tableProps} 
                  onRow={getNodes}  
                  scroll={{y:'calc(100% - 40px)'}}
                  rowClassName={setRowClassName}
                />
            </div>
            <div className={styles.leftPagination}>
                <IPagination
                    current={mainFormCurrent}
                    total={mainFormReturnCount}
                    onChange={changePage}
                    pageSize={limit}
                    style={{borderTop:'1px solid rgb(235, 235, 235)',height:'38px',right:'0px',width:'100%',background:'#fff',paddingRight:"8px"}}
                />
            </div>
        </div>
    }
    const rightRender = () => {
        const newData=nodeElement?.filter(item=>item.id==nodeModalActId)
        const multiInstance=newData&&newData[0].multiInstance
        let newList=[]
        if(newData[0].type=="EndEvent"){
            newList=taskActs?.filter(item=>item.actType=='endEvent'&&item.multiInstance==multiInstance)
        }else{
            newList=taskActs?.filter(item=>item.actType=='userTask'&&item.multiInstance==multiInstance)
        }
        
        return <div className={styles.radioGroup}>
            <Radio.Group onChange={changeRadio}>
                <Space direction="vertical">
                    {
                        newList&&newList.map(item => {
                            return <Radio value={item.actId}>{item.actName}</Radio>
                        })
                    }
                </Space>
            </Radio.Group>
        </div>
    }
    return (
        <div>
            <GlobalModal
                visible={true}
                onCancel={onCancel}
                onOk={onOk}
                title='同步环节配置'
                widthType={2}
                getContainer={() => {
                    return document.getElementById(`code_modal_${bizSolId}`) || false
                }}
                mask={false}
                maskClosable={false}
                bodyStyle={{padding:0 }}
                className={styles.configStep}
            >
                <ReSizeLeftRight
                    height={'inherit'}
                    leftChildren={leftRender()}
                    rightChildren={rightRender()}
                    vLeftNumLimit={500}
                    vRigthNumLimit={100}
                    vNum={600}
                    suffix={`configReplication_${bizSolId}`}
                />
            </GlobalModal>
        </div>
    )
}
export default connect(({ applyModelConfig }) => ({ applyModelConfig }))(configReplication)
