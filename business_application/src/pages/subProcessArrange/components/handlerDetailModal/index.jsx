import React,{useEffect,useRef,useState} from 'react'
import { connect } from 'dva';
import _ from "lodash";
import {Button,Table} from 'antd'
import ColumnDragTable from '../../../../componments/columnDragTable'
import OrgTree from '../orgTree'
import {detailProcess} from '../configs'
import styles from '../../index.less'

const HandlerDetailModal = ({dispatch,actives,getSubProcessHandleList,getSubProcessReaderList,
    pearsonActionType,nodeUser,emptyVisible,setEmptyVisible,bizSolId,subProcessArrangeSpace})=>{
    const {flowTreeModal} = subProcessArrangeSpace 
    console.log("subProcessArrangeSpace",subProcessArrangeSpace)  
    const [orgListId, setOrgListId] = useState([]);
    const [clickIndex,setClickIndex] = useState(0);
    
    console.log("actives99",actives)

    // 排序
    const changeSort = (index,value)=>{
        let newArr = JSON.parse(JSON.stringify(nodeUser))
      if(actives == 1){
          newArr.handler.forEach(function(item,i){
              if(i == index){
                item.sort = value;
              }
          })
      }else{
          newArr.reader.forEach(function(item,i){
              if(i == index){
                item.sort = value;
              }
          })
      }
      dispatch({
        type: 'subProcessArrangeSpace/updateStates',
        payload: {
            nodeUser: newArr,
            getSubProcessHandleList: newArr.handler,
            getSubProcessReaderList: newArr.reader,
            changeStatus: true
        }
    })

    }

    // 选中分类
    const selectChange = (obj,index,value)=>{
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(actives == 1){
            newArr.handler.forEach((item,i)=>{
                if(i == index){
                    item.valueType = value;
                    if(value == 'GROUP'){
                        item.orgType = 'CURRENT_ORG';
                        item.orgValue = '';
                        item.orgValueName = '';
                    }else{
                        item.orgType = 'USER';
                        item.orgValue = '';
                        item.orgValueName = '';
                    }
                }
            })
        }else{
            newArr.reader.forEach(function(item,i){
                if(i == index){
                    item.valueType = value;
                    if(value == 'GROUP'){
                        item.orgType = 'CURRENT_ORG';
                    }else{
                        item.orgType = 'USER'
                    }
                }
            })
        }
        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                nodeUser: newArr,
                getSubProcessHandleList: newArr.handler,
                getSubProcessReaderList: newArr.reader,
                changeStatus: true
            }
        })
    }
    
    // 类型切换
    const orgChange = (obj,index,value)=>{
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(actives == 1){
            newArr.handler.forEach(function(item,i){
                if(i == index){
                    item.orgType = value;
                    item.orgValueName = '';
                    item.orgValue = '';
                }
            })
        }else{
            newArr.reader.forEach(function(item,i){
                if(i == index){
                    item.orgType = value;
                    item.orgValueName = '';
                    item.orgValue = '';
                }
            })
        }

        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                nodeUser: newArr,
                getSubProcessHandleList: newArr.handler,
                getSubProcessReaderList: newArr.reader,
                selectedDataIds: [],
                changeStatus: true
            }
        })
    }

    //为数组添加key
    function addKeyFn(data){
        let newData = _.cloneDeep(data);
        newData.map((item,index)=>{
          item.key=index
        })
        return newData;
      }

    // 添加行
    const addLine = ()=>{
        let newArr = JSON.parse(JSON.stringify(nodeUser))    
        //获取排序的最大值
        let sortMax = 0;
        let newOrg = [];
       
        if(actives == 1){
          if(newArr.handler.length){
            newOrg = _.sortBy(newArr.handler, ['sort']);
          }
        }else{
          if(newArr.reader.length){
            newOrg = _.sortBy(newArr.reader, ['sort']);
          }
        }
        let orgMax = newOrg.length?newOrg[newOrg.length-1]:'';
        let orgSortMax = orgMax?orgMax.sort:0;
        sortMax = Math.max(orgSortMax);
        let arr = {
            valueType: 'USER',
            orgType: 'USER',
            orgValue: '',
            subordinate: false,
            sort:sortMax+1
        }
        if(actives == 1){
            newArr.handler.push(arr)
        }else{
            newArr.reader.push(arr)
        }
        console.log("newArr",newArr)
        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                nodeUser: newArr,
                getSubProcessHandleList: newArr.handler,
                getSubProcessReaderList: newArr.reader,
                changeStatus: true
            }
        })

        
    }
    // 含下级
    const subordinateChange = (obj,index,e)=>{
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(actives == 1){
            newArr.handler.forEach(function(item,i){
                if(i == index){
                    item.subordinate = e.target.checked;
                }
            })
        }else{
            newArr.reader.forEach(function(item,i){
                if(i == index){
                    item.subordinate = e.target.checked;
                }
            })
        }
        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                nodeUser: newArr,
                getSubProcessHandleList: newArr.handler,
                getSubProcessReaderList: newArr.reader,
                changeStatus: true
            }
        })
    }

    // 删除行
    const deleteLine = ()=>{
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(actives == 1){
            let newOrg = [];
            newArr.handler.forEach(function(item,i){
                if(!orgListId.includes(i)){
                newOrg.push(item)
                }
            })
            newArr.handler = newOrg;
        }else{
            let newOrg = [];
            newArr.reader.forEach(function(item,i){
            if(!orgListId.includes(i)){
                newOrg.push(item)
            }
            })
            newArr.reader = newOrg;
        }
        setOrgListId([])

        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                nodeUser: newArr,
                getSubProcessHandleList: newArr.handler,
                getSubProcessReaderList: newArr.reader,
                changeStatus: true
            }
        })
    }
    // 值域选择
    //单位部门岗位用户选人树
    function orgTreeClick(obj,index){
        // setChangeStatus(true)
        setClickIndex(index)
        let arr = [];
        let nameArr = [];
        let userName = [];
        let orgType = '';
        if(actives == 1){
            nodeUser.handler.forEach(function(item,i){
                if(item.sort == obj.sort){
                    arr = item.orgValue ? item.orgValue.split(',') : [];
                    nameArr = item.orgValueName ? item.orgValueName.split(',') : [];
                    orgType=item.orgType
                }
            })
        }else{
            nodeUser.reader.forEach(function(item,i){
                if(item.sort == obj.sort){
                    arr = item.orgValue ? item.orgValue.split(',') : [];
                    nameArr = item.orgValueName ? item.orgValueName.split(',') : [];
                    orgType=item.orgType
                }
            })
        }
        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                selectedDataIds: arr,
                orgUserType:orgType=='ROLE'?'RULE':(orgType=='USER_GROUP'?'USERGROUP':orgType),
                flowTreeModal: true,
                changeStatus: true
            }
        })
    }
    // 关闭组织弹窗
    const onCancel = ()=>{
        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                flowTreeModal: false,
                treeSearchWord: ''
            }
        })
    }
    const orgTableProp = {
        rowKey:'key',
        size: 'small',
        columns: detailProcess({changeSort,selectChange,orgChange,subordinateChange,emptyVisible,orgTreeClick}).columns,
        dataSource: actives == 1 ? addKeyFn(getSubProcessHandleList) : addKeyFn(getSubProcessReaderList),
        pagination: false,
        rowSelection: {
            selectedRowKeys: orgListId,
            onChange: (selectedRowKeys, selectedRows) => {
                setOrgListId(selectedRowKeys)
            },
        },
    }

    return (
        <div className={styles.detail_modal}>
            <div className={styles.detail_header}>
                <Button className={styles.line} onClick={addLine}>添加行</Button>
                <Button onClick={deleteLine}>删除</Button>
            </div>
            <div className={styles.detail_table}>
                <ColumnDragTable
                    {...orgTableProp}
                    scroll={{y:'calc(100% - 60px)'}}
                >
                
                </ColumnDragTable>
            </div>


            {flowTreeModal && (<OrgTree //单位组织选人
                onCancel={onCancel.bind(this)}
                query={bizSolId}
                clickIndex={clickIndex}
                actives={actives}
                emptyVisible={emptyVisible}
                pearsonActionType={pearsonActionType} // 多人/单人1为单人
                setEmptyVisible={setEmptyVisible}
            />)}
        </div>
    )
}   


export default connect(({subProcessArrangeSpace})=>({subProcessArrangeSpace}))(HandlerDetailModal)