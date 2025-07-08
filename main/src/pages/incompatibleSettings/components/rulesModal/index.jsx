import React,{useState,useEffect} from 'react'
import {Modal} from 'antd'
import {connect} from 'dva'
import ColumnDragTable from '../../../../componments/columnDragTable';
import configs from '../configs'
import CTM from '../../../../componments/commonTreeMg';
import IPagination from '../../../../componments/public/iPagination'
import GlobalModal from '../../../../componments/GlobalModal';
import styles from './index.less'

const RulesModalComponent = ({dispatch,handleCancel,incompatibleSettingsSpace})=>{
    const {treeData,expandedKeys,selectedChoseArr,treeSearchWord,currentNode,ruleLimit,start,returnCount,roleList,rulesCurrentPage,selectedRowKey}=incompatibleSettingsSpace
    let ruleSelectedArr = [] // 角色选中数组
    // 获取列表数据
    const getRoleListData = (nodeId,start,limit)=>{
        dispatch({
            type: 'incompatibleSettingsSpace/getSysRoles',
            payload: {
                start,
                limit,
                searchWord: '',
                roleType: 'ORGROLE',
                orgId:nodeId
            }
        })
    }
    // 分页change
    const changePage = (current,next)=>{
        getRoleListData(currentNode.key,current,next)
        dispatch({
            type: 'incompatibleSettingsSpace/updateStates',
            payload: {
                rulesCurrentPage: current,
                ruleLimit: next
            }
        })
    }
    // 确定
    const handleConfirm = ()=>{
        handleCancel()
    }
    // 是否选中
    const rowSelections ={
        onChange: (selectedRowKey, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKey}`, 'selectedRows: ', selectedRows);
            // dispatch({
            //     type: 'incompatibleSettingsSpace/updateStates',
            //     payload: {
            //         selectedRowKey,
            //         selectedChoseArr: selectedRows
            //     }
            // })
        },
        onSelect: (record, selected)=>{
            if(selected){
                ruleSelectedArr.push(record)
                const selectedArr = [...ruleSelectedArr,...selectedChoseArr]
                let map = new Map()
                for(let item of selectedArr){
                    if(!map.has(item.id)){
                        map.set(item.id,item)
                    }
                }
                const mapArr = [...map.values()]
                const arrId = ruleSelectedArr.map(item=>item.id)
                const filterArrId = [...new Set([...arrId,...selectedRowKey])]
                dispatch({
                    type: 'incompatibleSettingsSpace/updateStates',
                    payload: {
                        selectedRowKey:filterArrId,
                        selectedChoseArr: mapArr
                    }
                })
            }else{
                const unselectedId = selectedRowKey.filter(item=>item != record.id)
                const unselectedRows = selectedChoseArr.filter(item=>item.id !=record.id)
                dispatch({
                    type: 'incompatibleSettingsSpace/updateStates',
                    payload: {
                        selectedRowKey:unselectedId,
                        selectedChoseArr: unselectedRows
                    }
                })
            }
        }
    }
    const roleListArr = roleList.map((item,index)=>{
        item.number = index+1
        return item
    })||[]
    return (
        <GlobalModal 
            title="选择单位角色"
            visible={true} 
            widthType={3}
            mask={false}
            onCancel={handleCancel}
            onOk={handleConfirm}
            bodyStyle={{paddingBottom:0}}
            maskClosable={false}
            getContainer={() =>{
                return  document.getElementById('incompatibleSettings')||false
            }}
        >
            <div style={{height:'100%',overflow:'hidden',position:'relative'}}>
            <CTM
                treeData={treeData}
                expandedKeys={expandedKeys}
                treeSearchWord={treeSearchWord}
                currentNode={currentNode}
                nodeType={'ORG'}
                plst={'输入单位名称、编码'}
                moudleName="incompatibleSettingsSpace"
                getData={(node)=>{
                        getRoleListData(node.key,1,ruleLimit)
                    }
                }
                UserDepartmentFiltering={true}
                >
                <div className={styles.rules_table}>
                    <ColumnDragTable 
                        columns={configs().rulesColumns}
                        dataSource={roleListArr}
                        rowKey="id"
                        pagination={false}
                        scroll={roleListArr.length?{y:'calc(100% - 90px)'}:{}}
                        rowSelection={
                            {
                                type: 'checkbox',
                                selectedRowKeys: selectedRowKey,
                                ...rowSelections,
                            }
                        }
                    />
                    <IPagination
                        current={Number(rulesCurrentPage)}
                        total={Number(returnCount)}
                        onChange={changePage}
                        pageSize={ruleLimit}
                        isRefresh={true}
                        refreshDataFn={()=> {
                            getRoleListData(currentNode.key,1,ruleLimit)
                        }}
                    />
                </div>
            </CTM>

            </div>
        </GlobalModal>
    )
}


export default connect(({incompatibleSettingsSpace,role})=>({incompatibleSettingsSpace,role}))(RulesModalComponent)