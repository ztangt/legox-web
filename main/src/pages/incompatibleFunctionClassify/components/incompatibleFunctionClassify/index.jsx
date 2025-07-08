import React,{useState,useEffect} from 'react'
import {Switch,message} from 'antd'
import {connect} from 'dva'
import configs from '../configs'
import HeaderSearch from '../../../../componments/headerSearch'
import ColumnDragTable from '../../../../componments/columnDragTable'
import IPagination from '../../../../componments/public/iPagination'
import AddClassify from '../addClassify'
import BindModal from '../bindModal'
import styles from '../../index.less'
const FunctionClassify = ({dispatch,functionClassifySpace,registerTree})=>{
    const {currentPage,returnCount,curLimit,tableList,currentHeight}= functionClassifySpace
    const [selectedKey,setSelectedKey] = useState([]) // 对应勾选key
    const [isAddClassify,setIsAddClassify] = useState(false)
    const [isShowBindModal,setIsShowBindModal] = useState(false);
    const [bindModalValue,setBindModalValue] = useState('')// 绑定模块行数据
    const [editType,setEditType] = useState('')
    const [refs,setRefs] = useState({})
    const [searchWord,setSearchWord] = useState('')// 搜索
    const [editData,setEditData] = useState({}) // 编辑数据
    const [onlyWatch,setOnlyWatch]= useState(false) // 查看

    // 新增
    const onAdd = (val,type)=>{
        setIsAddClassify(true)
        if(type == 'watch'){
            setOnlyWatch(true)
        }else{
            setOnlyWatch(false)
        }
        if(type== 'edit'||type=='watch'){
            setEditType(type)
            setEditData({
                id: val.id,
                isEnable: val.isEnable?true: false,
                functionTypeCode: val.functionTypeCode,
                functionTypeDesc: val.functionTypeDesc,
                functionTypeName: val.functionTypeName
            })
            return 
        }
        setEditData({})
        setEditType('')
    }
    // 删除
    const onDelete = (val,type)=>{
        if(type !='del'){
            if(!selectedKey||selectedKey.length==0){
                message.error('请选择选项')
                return 
            }
        }
        dispatch({
            type: 'functionClassifySpace/deleteFunctionType',
            payload: {
                ids:type? val.id: selectedKey.join(',')
            },
            callback(){
                getTableList(searchWord,1,curLimit)
            }
        })
        
    }
    
    // 绑带模块
    const bindModel = (val)=>{ 
        setBindModalValue(val) 
        setIsShowBindModal(true)
    }   
    
    // 搜索
    const onSearch = (val)=>{
        setSearchWord(val)
        getTableList(val,1,curLimit)
    }
    // 启用
    const onStart = (val)=>{
        if(!selectedKey||selectedKey.length==0){
            message.error('请选择选项')
            return 
        }
        dispatch({
            type: 'functionClassifySpace/isEnableFunctionType',
            payload: {
                ids: selectedKey.join(','),
                enable: 1
            },
            callback(){
                getTableList(searchWord,1,curLimit)
                message.success('启用成功')
            }
        })
    }
    // 停用
    const onStops = (val)=>{
        if(!selectedKey||selectedKey.length==0){
            message.error('请选择选项')
            return 
        }
        dispatch({
            type: 'functionClassifySpace/isEnableFunctionType',
            payload: {
                ids: selectedKey.join(','),
                enable: 0
            },
            callback(){
                getTableList(searchWord,1,curLimit)
                message.success('停用成功')
            }
        })
    }

    // 搜索配置
    const configObj = {
        list: configs({onAdd,onDelete,onStart,onStops}).searchList,
        inputProps: {
            placeholder: '请输入用户名称',
            onSearch,
            allowClear:true
        }
    }
    useEffect(()=>{
        getTableList()
    },[])
    const getTableList = (searchWord='',start=1,curLimit=10)=>{
        dispatch({
            type: 'functionClassifySpace/getFunctionClassifyList',
            payload: {
                searchWord,
                start,
                limit:curLimit,
                isEnable: false
            }
        })
    }
    // 分页
    const changePage= (next,current)=>{
        getTableList(searchWord,next,current)
        dispatch({
            type:'functionClassifySpace/updateStates',
            payload: {
                curLimit: current
            }
        })
    }
    // 关闭弹窗
    const handleCancel = (bind='',treeData=[])=>{
        setIsAddClassify(false)
        setIsShowBindModal(false)
        // 初始化
        if(bind){
            treeData.forEach(item=>{
                dispatch({
                    type: 'functionClassifySpace/updateStates',
                    payload: {
                        [`selectedKey${item.key}`]: [],
                        [`selectedRows${item.key}`]:[]
                    }
                })
            })   
            // 选中节点初始化
            dispatch({
                type: 'functionClassifySpace/updateStates',
                payload: {
                    currentNode: {},
                    selectedMenuLeft: []
                }
            })
            // 关闭菜单初始化
            dispatch({
                type: 'moduleResourceMg/updateStates',
                payload: {
                    menuList: []
                }
            })
        }
        
    }
    // 新增/编辑确认
    const handleConfirm = ()=>{
        refs.current.submit()
    }
    // 绑定模块确认
    const bindConfirm = ({bindKeys,currentNode,selectedRows,treeData})=>{
        console.log("selectedRows00",selectedRows)
        const arr = [];
        treeData.forEach(element => {
            arr.push(...selectedRows[`selectedRows${element.key}`])
        });
        const selectedArr = arr.length>0&&arr.map(item=>{
            const obj = {
                functionTypeId: bindModalValue.id,
                menuId: item.id,
                menuParentId: item.menuParentId,
                registerId: item.registerId
            }
            return obj
        })||[]
        
        
        // 去重
        const selectSaveArr = selectedArr.filter((item, index) =>
        selectedArr.findIndex(i => i.menuId === item.menuId) === index);
        console.log("selectedArr000",selectedArr,"selectSaveArr",selectSaveArr)
        // 保存什么不传时候
        // 删除对应的
        const deleteArr = [{
            functionTypeId: bindModalValue.id
        }]
        const refMenus = selectSaveArr.length>0?JSON.stringify(selectSaveArr): JSON.stringify(deleteArr)
        dispatch({
            type: 'functionClassifySpace/bindPostFunctionTypeSave',
            payload: {
                refMenus: refMenus
            },
            callback(){
                handleCancel('bind')
            }
        })
    }
    // 获取子组件refs
    const getFormRef = (refs)=>{
        setRefs(refs)
    }
    // finish callback
    const callback = (val)=>{
        if(editType){
            dispatch({
                type: 'functionClassifySpace/putFunctionType',
                payload: {
                    id: editData.id,
                    functionTypeName: val.functionTypeName,
                    functionTypeCode: val.functionTypeCode,
                    functionTypeDesc: val.functionTypeDesc,
                    isEnable: val.isEnable?1: 0    
                },
                callback(){
                    getTableList(searchWord,1,curLimit)
                    handleCancel()
                }
            })
            return
        }
        // 新增
        dispatch({
            type: 'functionClassifySpace/postAddFunctionType',
            payload: {
                functionTypeName: val.functionTypeName,
                functionTypeCode: val.functionTypeCode,
                functionTypeDesc: val.functionTypeDesc,
                isEnable: val.isEnable?1: 0
            },
            callback(){
                getTableList(searchWord,1,curLimit)
                handleCancel()
            }
        })
    }
    // 新增/编辑组件配置
    const constAddConfig = {
        handleCancel,
        handleConfirm,
        getFormRef,
        callback,
        editType,
        editData,
        onlyWatch
    }
    // 绑定模块
    const configBindModal = {
        handleCancel,
        bindConfirm,
        bindModalValue
    }
    const rowSelections = {
        onChange: (selectedRowKey, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKey}`, 'selectedRows: ', selectedRows);
            setSelectedKey(selectedRowKey)
          }
    }

    return (
        <div className={styles.container} id="dom_container">
             <div className={styles.header} id="list_head">
                <HeaderSearch {...configObj}/>
            </div>
            <div style={{height:'calc(100% - 90px)'}}>
                <ColumnDragTable
                    columns= {configs({onAdd,onDelete,bindModel}).functionColumns} 
                    dataSource={tableList}
                    rowKey='id'
                    pagination={false}
                    modulesName={'functionClassifySpace'}
                    scroll={tableList.length>0?{y:currentHeight-15}:{}}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedKey,
                        ...rowSelections,
                      }}
                />
                 <IPagination
                    current={Number(currentPage)}
                    total={Number(returnCount)}
                    onChange={changePage}
                    pageSize={curLimit}
                    isRefresh={true}
                    refreshDataFn={()=> {
                        getTableList(searchWord,1,curLimit)
                    }}
                />
            </div>
            {isAddClassify&&<AddClassify {...constAddConfig}/>}
            {isShowBindModal&&<BindModal {...configBindModal}/>}
        </div>
    )
}
export default connect(({functionClassifySpace,registerTree,moduleResourceMg})=>({functionClassifySpace,registerTree,moduleResourceMg}))(FunctionClassify)