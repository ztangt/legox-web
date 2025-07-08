import {useEffect,useState} from 'react'
import GlobalModal from "../GlobalModal";
import {connect} from 'umi'
import {Button} from 'antd'
import IPagination from '../public/iPagination';
import ColumnDragTable from '../columnDragTable';
import {historyListColumns}  from './configFile'
import styles from './index.less'

const HistoryModal = ({dispatch,onCancel,onConfirmHistory,targetKey})=>{

    const [allList,setAllList] = useState([])
    const [limitStart,setLimitStart] = useState(1)
    const [limitPage,setLimitPage] = useState(10)
    const [returnCount,setReturnCount] = useState(0)
    const [rowKeysArr,setRowKeysArr] = useState([])    
    
    function getHistoryList(start=1,limit=10){
        dispatch({
            type: 'formShow/getAllWork',
            payload: {
                searchWord: '',
                start,
                limit,
                workRuleId: '',
            },
            callback(value){
                console.log("valuesssddd",value)
                setAllList(value.list)
                setLimitStart(value.currentPage)
                setReturnCount(value.returnCount)
            }
        })
    }
    // 修改页面
    function changePage(cur,page){
        setLimitStart(cur)
        setLimitPage(page)
        getHistoryList(cur,page)
    }

    useEffect(()=>{
        getHistoryList(1,10)
    },[])

    console.log("allList12",allList)
    return (
    <GlobalModal
        title="历史公文"
        visible={true}
        widthType={2}
        onCancel={onCancel}
        maskClosable={false}
        bodyStyle={{padding:'8px 16px'}}
        mask={false}
        centered
        getContainer={() => {
            return document.getElementById(`formShow_container_${targetKey}`)||false
        }}
        footer={[   
            <Button onClick={onCancel}>
                取消
            </Button>,
            <Button onClick={()=>onConfirmHistory(rowKeysArr)}>确定</Button>
        ]}
    >
    <div className={styles.history_box}>
           <ColumnDragTable 
                columns = {historyListColumns().history}
                dataSource={allList}
                tableLayout="fixed"
                rowKey="bizTaskId"
                pagination= {false}
                scroll={{ y: 'calc(100% - 100px)',x:'100%'}}
                rowSelection={
                    {
                        type: 'radio',
                        onChange: (selectedRowKeys, selectedRows) => {
                            console.log(selectedRowKeys,"rowsss",selectedRows)
                            setRowKeysArr(selectedRows)
                            // dispatch({
                            //     type: 'addressBook/updateStates',
                            //     payload: {
                            //     userIds: selectedRowKeys,
                            //     },
                            // });
                            // setUserIds(selectedRowKeys)
                        }
                    }
                    // selectedRowKeys:'',
                  }
                
           />
            <IPagination
                total={Number(returnCount)}
                current={Number(limitStart)}
                pageSize={limitPage}
                onChange={changePage}
                isRefresh={true}
                refreshDataFn={() => {
                    getHistoryList(1,limitPage)
                }}
            />

    </div>  

    </GlobalModal>)
}

export default connect(({formShow})=>({formShow}))(HistoryModal)