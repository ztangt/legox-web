import React, { useEffect } from 'react'
import {connect} from 'dva'
import ColumnDragTable from '../../../../componments/columnDragTable'
import HeaderSearch from '../../../../componments/headerSearch'
import IPagination from '../../../../componments/public/iPagination'
import configs from '../configs'
import styles from '../../index.less'

const IncompatibleRoleComponent = ({dispatch,incompatibleWaring})=>{
    const {warningList,searchWord,currentPage,returnCount,curLimit,currentHeight} = incompatibleWaring
    
    useEffect(()=>{
        getWarningList()
    },[])
    const getWarningList = (searchWord='',start=1,curLimit=10)=>{
         dispatch({
            type: 'incompatibleWaring/getIncompatibleWarnList',
            payload: {
                searchWord,
                start,
                limit:curLimit
            }
         })   
    }   
     // 搜索
     const onSearch = (val)=>{
        dispatch({
            type: 'incompatibleWaring/updateStates',
            payload:{ 
                searchWord: val
            }
        })
        getWarningList(val,1,curLimit)    
    }
    // 更新当前列表
    const onUpdateList = ()=>{
        dispatch({
            type: 'incompatibleWaring/updateCurrentList',
            payload: {},
            callback(){
                getWarningList(searchWord,1,curLimit)
            }
        })
    }
    const searchList = [
        {
            fileType: 'update',
            onClick: onUpdateList,
            fileName: '更新当前列表'
        }
    ]
    // 配置
    const configObj = {
        list: searchList,
        inputProps: {
            placeholder: '请输入用户名称',
            onSearch,
            allowClear:true
        }
    }

    const tableList = warningList.map((item,index)=>{
        item.number = index+1
        return item
    })
    // 分页
    const changePage = (current,next)=>{
        getWarningList(searchWord,current,next)
        dispatch({
            type: 'incompatibleWaring/updateStates',
            payload: {
                curLimit: next
            }
        })
    }
   
    return (
        <div className={styles.container} id="dom_container">
            <div className={styles.header} id="list_head">
                <HeaderSearch {...configObj}/>
            </div>

            <div className={styles.table_list}>
                <ColumnDragTable
                    columns= {configs({tableList}).warningColumns} 
                    dataSource={tableList}
                    rowKey='id'
                    pagination={false}
                    scroll={{y:currentHeight-15}}
                    modulesName="incompatibleWaring"
                    bordered
                    needClassName={false}
                />
                <IPagination
                    current={Number(currentPage)}
                    total={Number(returnCount)}
                    onChange={changePage}
                    pageSize={curLimit}
                    isRefresh={true}
                    refreshDataFn={()=> {
                        getWarningList(searchWord,1,curLimit)
                    }}
                />
            </div>
        </div>
    )
}

export default connect(({incompatibleWaring})=>({incompatibleWaring}))(IncompatibleRoleComponent)