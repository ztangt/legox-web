import React,{useState,useEffect} from 'react'
import {Input,message} from 'antd'
import {connect} from 'dva'
import HeaderSearch from '../../../../componments/headerSearch'
import ColumnDragTable from '../../../../componments/columnDragTable'
import IPagination from '../../../../componments/public/iPagination'
import SettingModal from '../settingsModal'
import RulesModal from '../rulesModal'
import JobModal from '../jobModal'
import configs from '../configs'
import styles from '../../index.less'

const IncompatibleComponent = ({dispatch,incompatibleSettingsSpace})=>{
    const {currentPage,returnCountList,curLimit,tableIncompatibleList,selectedChoseArr,selectedChoseJobArr,selectedModalType,currentHeight} =incompatibleSettingsSpace
    const [selectedRowKeys,setSelectedRowKeys] = useState([])
    // 设置弹窗
    const [settingModalShow,setSettingModalShow] = useState(false)
    // 选择角色
    const [rulesModalShow,setRulesModalShow] = useState(false)
    // 职能分类
    const [jobTypeShow,setJobTypeShow] = useState(false)
    const [searchWords,setSearchWords] = useState('') // 搜索内容
    const [refs,setRefs] = useState({})
    const [addType,setAddType] = useState('') // '' 代表新增
    const [editData,setEditData] = useState(null);
    const [recordValue,setRecordValue] = useState(null);
    const [disAbled,setDisAbled] = useState(false)

    useEffect(()=>{
        getListData('',1,curLimit)
    },[])

    // 新增+修改
    const onAdd = (val,type='')=>{
        // console.log("val",val,"add",type)
        setSettingModalShow(true)
        setRecordValue(val)
        setAddType(type)
        if(type == 'is_disable'){
            setDisAbled(true)
        }else{
            setDisAbled(false)
        }
        // 编辑
        if(type){
            setEditData({
                rulesName: val.ruleName,
                rulesCode: val.ruleCode,
                rulesMsg: val.ruleDesc,
                incompatibleTypes: val.incompatible
            })

            // 非职能分类
                dispatch({
                    type: 'incompatibleSettingsSpace/getIncompatibleRefList',
                    payload: {
                        incompatibleId: val.id,
                        selectedModalType:val.incompatible
                    }
                })
                dispatch({
                    type: 'incompatibleSettingsSpace/updateStates',
                    payload: {
                        selectedModalType: val.incompatible
                    }
                })
            return 
        }
        setEditData({
            rulesName: '',
            rulesCode: '',
            rulesMsg: '',
            incompatibleTypes: 0 // 单选 0 业务角色 1 职能分类
        })
        dispatch({
            type: 'incompatibleSettingsSpace/updateStates',
            payload: {
                selectedChoseArr: [],
                selectedRowKey: [],
                selectedChoseJobArr: [],
                selectedRowKeyArr: []
            }
        })
    }
 

    // 点击完成
    const finishCallback = (value)=>{
        const arrList =selectedModalType ==1?selectedChoseJobArr.map(item=>{
            return {
                incompatibleId: 0,
                incompatibleType:1,
                roleName: item.functionTypeName,
                roleId: item.id,
                roleCode: item.functionTypeCode
            }
        }): selectedChoseArr.map(item=>{
            return {
                incompatibleId: 0,
                incompatibleType: 0,
                roleName: item.roleName,
                roleId: item.id,
                roleCode: item.roleCode
            }
        })
        // console.log("arrList",arrList,"selectedModalType",selectedModalType)
        const data = {
            ruleName: value.rulesName,
            ruleCode: value.rulesCode,
            ruleDesc: value.rulesMsg,
            incompatible: selectedModalType==0?0:selectedModalType,
            refObjList: JSON.stringify(arrList)
        }
        if(!addType){
            dispatch({
                type: 'incompatibleSettingsSpace/addIncompatible',
                    payload: {
                       ...data 
                },
                callback(){
                    settingClose()
                    getListData('',1,curLimit)
                }
            })
        }
        // 编辑
        if(addType){
            const arrList = selectedModalType ==1? selectedChoseJobArr.map(item=>{
                return {
                    incompatibleId: recordValue.id,
                    incompatibleType:1,
                    roleName: item.functionTypeName,
                    roleId: item.id,
                    roleCode: item.functionTypeCode
                }
            }): selectedChoseArr.map(item=>{
                return {
                    incompatibleId: recordValue.id,
                    incompatibleType: selectedModalType==0?0:selectedModalType,
                    roleName: item.roleName,
                    roleId: item.id,
                    roleCode: item.roleCode
                }
            })
            const data = {
                id: recordValue.id,
                ruleName: value.rulesName,
                ruleCode: value.rulesCode,
                ruleDesc: value.rulesMsg,
                incompatible: selectedModalType==0?0:selectedModalType,
                refObjList: JSON.stringify(arrList)
            }
            dispatch({
                type: 'incompatibleSettingsSpace/editSave',
                payload: {
                    ...data
                },
                callback(val){
                    settingClose()
                    getListData('',1,curLimit)
                }
            })
        }
    }
    // 删除
    const onDelete = (val,type)=>{
        if(!type&&selectedRowKeys.length==0){
            message.error('请选择列表项')
            return 
        }
        const ids = selectedRowKeys.length>0?selectedRowKeys.join(','): val.id
        dispatch({
            type: 'incompatibleSettingsSpace/deleteIncompatible',
            payload: {
                ids
            },
            callback(){
                getListData(searchWords,1,curLimit)
            }
        })
    }
    // 搜索
    const onSearch = (value)=>{
        setSearchWords(value)
        getListData(value,1,curLimit)
    }
    // 获取ref
    const getFormRef = (ref)=>{
        setRefs(ref)
    }
    //关闭弹窗
    const handleCancel = ()=>{
        
        if(selectedModalType == 0){
            setRulesModalShow(false)
            return 
        }
        if(selectedModalType == 1){
            setJobTypeShow(false)
            return 
        }
    }
    // 关闭设置弹窗
    const settingClose = ()=>{
        setSettingModalShow(false)
        if(!addType){
            dispatch({
                type: 'incompatibleSettingsSpace/updateStates',
                payload: {
                    selectedModalType: 0
                }
            })
        }
    }
    // 点击设置弹窗
    const handleConfirm = ()=>{
        // 提交
        refs.current.submit()
    }
    // 点击选择设置类型
    const selectedTypesFn = (value)=>{
        
          // 角色弹窗
        if(value==0){
            setRulesModalShow(true)
            setJobTypeShow(false)
        }
        // 职能分类弹窗
        if(value==1){
            setRulesModalShow(false)
            setJobTypeShow(true)
        }   
    }
    // 获取list列表
    const getListData = (searchWord='',start=1,curLimit=10)=>{
        dispatch({
            type: 'incompatibleSettingsSpace/getIncompatibleList',
            payload: {
                searchWord,
                start,
                limit:curLimit
            }
        })
    }
    // button 按钮配置
    const searchList = [
        {   
            fileType: 'add',
            onClick: onAdd,
            fileName: '新增',
        },
        {
            fileType: 'delete',
            onClick: onDelete,
            fileName: '删除',
        }
    ]    

    const configObj = {
        list: searchList,
        inputProps: {
            placeholder: '请输入规则名称',
            onSearch,
            allowClear:true
        }
    }
    const tableList = tableIncompatibleList.map((item,index)=>{
        item.number = index+1
        return item
    })
    // 列表选择
    const rowSelections = {
        onChange: (selectedRowKey, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKey}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKey)
          }
    }
    // 分页
    const changePage = (current,next)=>{
        getListData(searchWords,current,next)
        dispatch({
            type:'incompatibleSettingsSpace/updateStates',
            payload: {
                curLimit: next
            }
        })
    }
    //setting 参数配置
    const settingConfig = {
        handleCancel:settingClose,
        handleConfirm:handleConfirm,
        selectedTypesFn:selectedTypesFn,
        getFormRef:getFormRef,
        callback: finishCallback,
        editData:editData,
        addType,
        selectedModalType,
        disAbled,
    }

    return (
        <div className={styles.container} id="dom_container">
            <div id="list_head">
                <HeaderSearch {...configObj}/>
            </div>
            <div className={styles.table_container} >
                <ColumnDragTable 
                    columns={configs({onAdd,onDelete}).columns}
                    dataSource={tableList}
                    rowKey='id'
                    pagination={false}
                    scroll={tableList.length?{y:currentHeight-15}:{}}
                    modulesName="incompatibleSettingsSpace"
                    rowSelection={{
                      type: 'checkbox',
                      selectedRowKeys: selectedRowKeys,
                      ...rowSelections,
                    }}
                    
                />
             <IPagination
                current={Number(currentPage)}
                total={Number(returnCountList)}
                onChange={changePage}
                pageSize={curLimit}
                isRefresh={true}
                refreshDataFn={()=> {
                    getListData(searchWords,1,curLimit)
                }}
            /> 
            </div>
            {settingModalShow&&<SettingModal {...settingConfig}/>}
            {rulesModalShow&&<RulesModal handleCancel={handleCancel}/>}
            {jobTypeShow&&<JobModal handleCancel={handleCancel}/>}    
        </div>
    )
}


export default connect (({incompatibleSettingsSpace,role})=>({incompatibleSettingsSpace,role}))(IncompatibleComponent)