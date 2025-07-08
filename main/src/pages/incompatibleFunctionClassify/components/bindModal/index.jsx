import React,{useState,useEffect,useCallback} from 'react'
import {connect} from 'dva'
import {Modal} from 'antd'
import TreeTable from '../treeTable'
import configs from '../configs'
import ColumnDragTable from '../../../../componments/columnDragTable'
import GlobalModal from '../../../../componments/GlobalModal' 

// 绑定模块
let currentSelected = []
const BindModalComponent = ({dispatch,bindConfirm,handleCancel,moduleResourceMg,functionClassifySpace,registerTree,bindModalValue})=>{
    const {currentNode,selectedKey,selectedRows,selectedMenuLeft,currentMenuList} = functionClassifySpace
    // 注册Tree
    const { treeData } = registerTree;
    // 展开列表
    const [expandedList,setExpandedList] = useState([])
    const {menuList} = moduleResourceMg
    // 查询已绑定资源
      const findAlBind=(treeData=[])=>{
        dispatch({
            type: 'functionClassifySpace/findBindResource',
            payload: {
              functionTypeId:bindModalValue.id
            },
            callback(menu,currentMenu){
              // 当前
              // if(menu&&menu.length>0){
                  getMenuIds(menu)
              // }
              // if(currentMenu&&currentMenu.length>0){
                getMenuArr(currentMenu,treeData)
              // }
            }
        })
    }
    // 获取menu菜单
    const getMenuArr = (currentMenu,treeData)=>{ 
      treeData.forEach(item=>{
        const curMenuArr = currentMenu.map(element=>{
          if(item.key == element.registerId){
            return {
              id: element.menuId,
              functionTypeId: element.functionTypeId,
              menuParentId: element.menuParentId,
              registerId: element.registerId
            }
          }
        }).filter(item=>item!=undefined)
        console.log("curMenuArr",curMenuArr)
        const obj = {
          [`selectedRows${item.key}`]: curMenuArr
        }
        dispatch({
          type: 'functionClassifySpace/updateStates',
          payload: obj
        })
      })
    } 

    // 大保存回显分类
       function getMenuIds(menuList){
        treeData.forEach(item=>{
          const arr = menuList.map(element=>{
            if(item.key== element.registerId){
              return element.menuId
            }
          }).filter(item=>item !=undefined)
          const obj = {
            [`selectedKey${item.key}`]: [...new Set(arr)]
          }
          console.log("obj0009",obj)
          dispatch({
            type: 'functionClassifySpace/updateStates',
            payload: obj
          })
        })
    }

    useEffect(()=>{
      getFunctionUpdate()
      if(treeData&&treeData.length>0){
        findAlBind(treeData)
      }
      return ()=>false
    },[treeData])
 
    // 更新创建state
    const getFunctionUpdate = ()=>{
      treeData.forEach(item=>{
        dispatch({
          type: 'functionClassifySpace/updateStates',
          payload: {
            [`selectedKey${item.key}`]: [],
            [`selectedRows${item.key}`]:[]
          }
        })
      })
    }

    // 绑定列表回显
      const rowSelections ={
        onChange:(selectedRowKey, selectedRows)=>{
          console.log("selectedRowKey",selectedRowKey,'selectedRows',selectedRows)
          
        const nowArr = selectedRows.filter(item=>{
           return !selectedMenuLeft.some(element=>{
            return element ==item.id
           })
          })
          // currentSelected.push(...nowArr)
          console.log("nowArr",nowArr)
          dispatch({
            type: 'functionClassifySpace/updateStates',
            payload: {
              [`selectedKey${currentNode.key}`]: selectedRowKey,
              [`selectedRows${currentNode.key}`]: nowArr
            }
          })
        },
        getCheckboxProps: (record) => {
          // 选中后回显剩余部分，非当前部门不能操作
          if(selectedMenuLeft.length>0){
            if (record.children) {
              return {
                disabled: true,
              };
            } else {
              return {
                disabled:selectedMenuLeft.includes(record.id)?true: false,
              };
            }
          }else{
            if (record.children) {
              return {
                disabled: true,
              };
            } else {
              return {
                disabled: false,
              };
            }
          }
            
          },
      }
      // 获取列表
      function getMenu(registerId,searchWord,callback){
        dispatch({
          type: 'moduleResourceMg/getMenu',
          payload:{
            searchWord,
            registerId
          },
          callback:function(list){
            callback(registerId,list)
            dispatch({
              type: 'functionClassifySpace/findBindResource',
              payload: {}
            })
          }
        })
      }
      // 扩展
      const onExpand = (expanded,record)=>{
        let newList = expandedList
        if(expanded){
          newList.push(record.key)
        }else{
          newList = newList.filter(x => x != record.key)
        }
        setExpandedList(newList)
      } 
      console.log("functionClassify",functionClassifySpace[`selectedKey${currentNode.key}`],"functionClassifySpace",functionClassifySpace)
    return (
        <GlobalModal 
            title="绑定模块"
            widthType={3}
            visible={true}
            mask={false}
            onCancel={()=>handleCancel('bind',treeData)}
            onOk={()=>bindConfirm({bindKeys:functionClassifySpace[`selectedKey${currentNode.key}`],currentNode,selectedRows:functionClassifySpace,treeData})}
            maskClosable={false}
            getContainer={() =>{
                return  document.getElementById('incompatibleFunction')||false
            }}
        >
            <div style={{height:'100%',position:'relative'}}>
              <TreeTable
                getData={(node)=>{
                    getMenu(node.key,'')
                  }
                }
              >
                  <div style={{height:'100%'}}>
                      <ColumnDragTable 
                          columns={configs({}).bindColumns} 
                          dataSource={menuList}
                          expandedRowKeys={expandedList}
                          onExpand={onExpand}
                          rowKey='id'
                          pagination={false}
                          scroll = {{y:'calc(100% - 50px)'}}
                          rowSelection={{
                              type: 'checkbox',
                              hideSelectAll: true,
                              selectedRowKeys: functionClassifySpace[`selectedKey${currentNode.key}`],
                              ...rowSelections,
                          }}
                      />

                  </div>
              </TreeTable>
            </div>
        </GlobalModal>
    )
}


export default connect(({functionClassifySpace,moduleResourceMg,registerTree})=>({functionClassifySpace,moduleResourceMg,registerTree}))(BindModalComponent)