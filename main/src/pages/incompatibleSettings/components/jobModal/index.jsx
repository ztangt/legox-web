import React,{useState,useEffect} from 'react'
import {Modal} from 'antd'
import {connect} from 'dva'
import ColumnDragTable from '../../../../componments/columnDragTable';
import IPagination from '../../../../componments/public/iPagination';
import GlobalModal from '../../../../componments/GlobalModal';
import configs from '../configs'
import styles from '../rulesModal/index.less'

const JobModalComponent = ({dispatch,handleCancel,incompatibleSettingsSpace})=>{
    let selectedArr = [];
    const {selectedRowKeyArr,selectedChoseJobArr,functionList,functionStart,functionReturnCount,jobLimit} = incompatibleSettingsSpace
    //confirm 选中确定
    const handleConfirm = ()=>{
        handleCancel()
    }
    const rowSelections = {
        onChange: (selectedRowKey, selectedRows) => {
            // dispatch({
            //     type: 'incompatibleSettingsSpace/updateStates',
            //     payload: {
            //         selectedRowKeyArr:selectedRowKey,
            //         selectedChoseJobArr: selectedRows
            //     }
            // })
        },
        onSelect:(record, selected, selectedRows)=>{
           if(selected){
            selectedArr.push(record)
            const arrRows = [...selectedArr,...selectedChoseJobArr]
            // console.log("arrRows",arrRows)
            let map = new Map()
            for(let item of arrRows){
                if(!map.has(item.id)){
                    map.set(item.id,item)
                }
            }
            const mapArr = [...map.values()]
            const arrId = selectedArr.map(item=>item.id)
            const filterArrId = [...new Set([...arrId,...selectedRowKeyArr])]
            dispatch({
                type: 'incompatibleSettingsSpace/updateStates',
                payload: {
                    selectedRowKeyArr:filterArrId,
                    selectedChoseJobArr: mapArr
                }
            })
           }else{
            const unselectedId = selectedRowKeyArr.filter(item=>item != record.id)
            const unselectedRows = selectedChoseJobArr.filter(item=>item.id !=record.id)
            dispatch({
                type: 'incompatibleSettingsSpace/updateStates',
                payload: {
                    selectedRowKeyArr:unselectedId,
                    selectedChoseJobArr: unselectedRows
                }
            })
           }
        }
    }
    // 获取table列表
    const getTableList = (start=1,jobLimit=10)=>{
        dispatch({
            type: 'incompatibleSettingsSpace/getFunctionClassifyList',
            payload: {
                searchWord: '',
                start,
                limit:jobLimit,
                isEnable: true
            }
        })
    }
    useEffect(()=>{
        getTableList()
    },[])
    // 分页
    const changePage = (next,pageSize)=>{
        getTableList(next,pageSize)
        dispatch({
            type:'incompatibleSettingsSpace/updateStates',
            payload: {
                jobLimit: pageSize
            }
        })
    }
    console.log("selectedRowKeyArr",selectedRowKeyArr)
    return (
        <GlobalModal 
            title="选择职能分类"
            visible={true} 
            widthType={3}
            bodyStyle={{overflow:'hidden',paddingTop:8,paddingBottom:8}}
            mask={false}
            onCancel={handleCancel}
            onOk={handleConfirm}
            maskClosable={false}
            getContainer={() =>{
                return  document.getElementById('incompatibleSettings')||false
            }}
        >
            <div className={styles.job_table}>
                <ColumnDragTable 
                    columns={configs().jobsColumns}
                    dataSource={functionList}
                    rowKey="id"
                    pagination={false}
                    scroll={{y:'calc(100% - 90px)'}}
                    rowSelection={
                        {
                            type: 'checkbox',
                            selectedRowKeys: selectedRowKeyArr,
                            ...rowSelections,
                        }
                    }
                />
                <IPagination
                    current={Number(functionStart)}
                    total={Number(functionReturnCount)}
                    onChange={changePage}
                    pageSize={jobLimit}
                    isRefresh={true}
                    style={{bottom:0}}
                    refreshDataFn={()=> {
                        getTableList(1,jobLimit)
                    }}
                />
            </div>

        </GlobalModal>
    )
}


export default connect(({incompatibleSettingsSpace})=>({incompatibleSettingsSpace}))(JobModalComponent)
