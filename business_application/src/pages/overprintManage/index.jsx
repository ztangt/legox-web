import {useEffect,useRef,useState} from 'react'
import {connect} from 'umi'
import {Input,Button,Modal,message} from 'antd'
import ColumnDragTable from '../../componments/columnDragTable'
import {dataFormat} from '../../util/util'
import IPagination from '../../componments/public/iPagination'
import OnAddPrint from './components/onAddPrint'
import styles from './index.less'
// 套红管理
const OverPrintManage = ({dispatch,overprintTemplate})=>{
    const inputRefs = useRef('')
    const [isShowAdd,setIsShowAdd] = useState(false)
    const [state,setState] = useState({})
    const [addRefs,setAddRefs] = useState(null)

    const {start,limit,redList,returnCount,selectedRowsKeys,selectedDataPrintKeys} = overprintTemplate

    const tableColumns = [
        {
            title: '序号',
            dataIndex: 'listNumber',
            key: 'listNumber',
            width: 60,
        },
        {
            title: '套红类型',
            dataIndex: 'templateTypeName',
            key: 'templateTypeName',
        },
        {
            title: '创建人',
            dataIndex: 'createUserName',
            key: 'createUserName'
        },
        {
            title: '创建部门',
            dataIndex: 'createDeptName',
            key: 'createDeptName'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text)=>{
                return <div>{dataFormat(text)}</div>
            }
        },
        {
            title: '启用状态',
            dataIndex: 'isEnable',
            key: 'isEnable',
            width: 90,
            render(text){
                return text==1?'是':'否'
            }
        },
        {
            title: '操作',
            render: (record)=>{
                return (
                    <div>
                        <a className={styles.left_print} onClick={()=>onDesign(record)}>设计</a>
                        <a className={styles.left_print} onClick={()=>onEdit(record)}>修改</a>
                        <a className={styles.left_print} onClick={()=>onDeleteItem(record)}>删除</a>
                    </div>
                )
            }
        }
    ]

    // 跳转设计
    function onDesign(record){
        historyPush({
            pathname:'/overprintManage/wpsPintDesign',
            query: {
              title: `${record.templateTypeName}-设计`,
              id: record.id
            }
        });
    }
    // 编辑
    function onEdit(record){
        setIsShowAdd(true)
        setState(record)
        dispatch({
            type: 'overprintTemplate/getTemplateOrgIds',
            payload: {
                id: record.id
            },
            callback:(value)=>{
                dispatch({
                    type: 'overprintTemplate/updateStates',
                    payload: {
                        selectedDataIds: value
                    }
                })
            }
        })
    }

    // 搜索input框
    function onInputSearch(e){
        inputRefs.current = e.target.value
    }
    // 查询
    function onSearch(){
        getRedList(1,limit,inputRefs.current)
    }

    function getRedList(start,limit,searchWord=''){
        dispatch({
            type: 'overprintTemplate/getRedTemplate',
            payload: {
                start,
                limit,
                searchWord
            }
        })
    }
    // 选中
    const rowSelection = {
        selectedRowKeys: selectedRowsKeys,
        onChange: (rowKeys, rows) => {
          dispatch({
            type: 'overprintTemplate/updateStates',
            payload: {
              selectedRows: rows,
              selectedRowsKeys: rowKeys
            },
          });
        },
    };
    // 分页
    function pageChange(current,pageSize){
        dispatch({
            type: 'overprintTemplate/updateStates',
            payload: {
                start:current,
                limit:pageSize,
            }
        })
        getRedList(current,pageSize,inputRefs.current)
    }
    // 删除item
    function onDeleteItem(record){
        Modal.confirm({
            title: '确定要删除吗',
            onOk: ()=>{
                dispatch({
                    type:'overprintTemplate/deleteRedTemplate',
                    payload: {
                        ids:record.id
                    },
                    callback(){
                        getRedList(1,limit,inputRefs.current)
                    }
                })
            }
        })
    }
    // 删除多个
    function onDelete(){
        if(selectedRowsKeys.length==0){
            message.error('请选择删除项')
            return false
        }
        Modal.confirm({
            title: '确定要删除吗',
            onOk:()=>{
                dispatch({
                    type:'overprintTemplate/deleteRedTemplate',
                    payload: {
                        ids:selectedRowsKeys.join(',')
                    },
                    callback(){
                        getRedList(1,limit,inputRefs.current)
                    }
                })
            }
        })
    }
    // 启用
    function enableAction(){
        if(selectedRowsKeys.length==0){
            message.error('请选择启用项')
            return false
        }
        dispatch({
            type: 'overprintTemplate/enableTemplate',
            payload: {
                ids: selectedRowsKeys.join(',')
            },
            callback:()=>{
                getRedList(1,limit,inputRefs.current)
            }
        })
    }
    // 禁用
    function disableAction(){
        if(selectedRowsKeys.length==0){
            message.error('请选择禁用项')
            return false
        }
        dispatch({
            type: 'overprintTemplate/disableTemplate',
            payload: {
                ids: selectedRowsKeys.join(',')
            },
            callback:()=>{
                getRedList(1,limit,inputRefs.current)
            }
        })
    }

    // 新增
    function onAddFun(){
        setIsShowAdd(true)
        setState(null)
        dispatch({
            type: 'overprintTemplate/updateStates',
            payload: {
                selectedDatas: [],
                selectedDataIds:[],
                selectedDataPrint: ''
            }
        })
        addRefs&&addRefs.current&&addRefs.current.setFieldsValue({
            templateTypeName: '',
            useCompany:''
        })
    }
    function onCancel(){
        setIsShowAdd(false)
    }
    function getRefsCallback(refs){
        setAddRefs(refs)
    }

    //新增or编辑 finish callback
    function finishCallback(values){
        if(state&&state.id){
            dispatch({
                type: 'overprintTemplate/editTemplate',
                payload: {
                    templateTypeName: values.templateTypeName,
                    orgIds: values.ids||selectedDataPrintKeys,
                    id: state.id
                },
                callback:()=>{
                    getRedList(1,limit,inputRefs.current)
                    onCancel()
                }
            })

        }else{
            dispatch({
                type: 'overprintTemplate/addTemplate',
                payload: {
                    templateTypeName: values.templateTypeName,
                    orgIds: values.ids
                },
                callback:()=>{
                    getRedList(1,limit,inputRefs.current)
                    setIsShowAdd(false)
                    addRefs.current.setFieldsValue({
                        templateTypeName: '',
                        useCompany:''
                    })
                    dispatch({
                        type: 'overprintTemplate/updateStates',
                        payload: {
                            selectedDataPrintKeys: '',
                            selectedDataPrint: ''
                        }
                    })
                }
            })
        }
    }


    useEffect(()=>{
        getRedList(1,10,'')
    },[])

     return (
        <div className={styles.overPrint} id="overPrint">
            <div className={styles.header}>
                <div className={styles.header_search}>
                    <Input style={{width: 226}} size="middle" placeholder='请输入套红' onChange={onInputSearch}/>
                    <Button className={styles.search_btn} onClick={onSearch}>查询</Button>
                </div>
                <div className={styles.action_button}>
                    <Button className={styles.action_btn} onClick={onAddFun}>新增</Button>
                    <Button className={styles.action_btn} onClick={onDelete}>删除</Button>
                    <Button className={styles.action_btn} onClick={enableAction}>启用</Button>
                    <Button className={styles.action_btn} onClick={disableAction}>禁用</Button>
                </div>
            </div>
            <div className={styles.content}>
                <ColumnDragTable
                     rowKey="id"
                     columns={tableColumns}
                     rowSelection={{ ...rowSelection }}
                     dataSource={redList}
                     pagination={false}
                     scroll={{ y: 'calc(100% - 90px)' }}
                />

                <IPagination
                  current={Number(start)}
                  total={Number(returnCount)}
                  onChange={pageChange}
                  pageSize={limit}
                  isRefresh={true}
                  style={{ bottom: 8 }}
                  refreshDataFn={() => {
                    getRedList(1,limit,inputRefs.current)
                  }}
                />
            </div>
           {isShowAdd&&<OnAddPrint onCancel={onCancel} state={state} callback={finishCallback} getRefsCallback={getRefsCallback}/>}
        </div>
     )   
}


export default connect(({overprintTemplate})=>({overprintTemplate}))(OverPrintManage)