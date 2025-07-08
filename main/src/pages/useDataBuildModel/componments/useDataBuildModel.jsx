import { useState,useCallback,useEffect } from 'react';
import { connect } from 'dva';
import _ from "lodash";
import { Input, Button, message, Space, Table, Tree, Upload,Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight'
import IPagination from '../../../componments/public/iPagination';
import styles from './useDataBuildModel.less';
import AddFieldModal from './addFieldModal'
import CreateIndexModal from './createIndexModal'
import CopyTableModal from './copyTableModal'
import AddImportModal from './addImportModal'
import AddPhysicalTable from './addPhysicalTable'
import AddLinkDataSource from './addLinkDataSource'
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import { getButton } from '../../../util/util'
import { FIELD_TYPE } from '../../../service/constant';
import { DeleteOutlined,FileOutlined, FundViewOutlined, EditOutlined, PlusOutlined, CopyOutlined, NodeIndexOutlined,EyeOutlined } from '@ant-design/icons';
import {BASE_WIDTH,ORDER_WIDTH} from '../../../util/constant'
import ColumnDragTable from '../../../componments/columnDragTable'
import searchIcon from '../../../../public/assets/search_black.svg'

const { TreeNode } = Tree
const {confirm}=Modal
function UseDataBuildModel({ dispatch, useDataBuildModel, layoutG, user }) {
    const {
        currentPage,
        limit,
        returnCount,
        searchWord,
        datasourceTree,
        datasourceTable,
        isShowAddFieldModal,
        isShowCreateIndexModal,
        isShowTableCopyModal,
        isShowImportModal,
        isShowAddPhysicalTableModal,
        isShowAddLinkDataSourceModal,
        leftNum
    } = useDataBuildModel
    const { menus } = user
    const [nodeTreeItem, setNodeTreeItem] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectTableInfo, setSelectTableInfo] = useState('');
    const [rightClickNode, setRightClickNode] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isAddFieldModal, setIsAddFieldModal] = useState(true);
    const [isAddPhysicalTable, setIsAddPhysicalTable] = useState('add');
    const [isAddLinkDataSource, setIsAddLinkDataSource] = useState('add');
    const [colId, setColId] = useState('');
    const [id,setId]=useState('')
    const [key,setKey]=useState('')
    const [expandedList,setExpandedList] = useState([])
    var viewDetailsModalRef; //查看Modalref
    const [height,setHeight] = useState(document.documentElement.clientHeight-290)
    const onResize = useCallback(()=>{
      setHeight(document.documentElement.clientHeight-290)
    },[])
    useEffect(()=>{
        dispatch({
            type: 'useDataBuildModel/getDatasourceTree',
        })
        window.addEventListener('resize',onResize);
        return (()=>{
            window.removeEventListener('resize',onResize)
        })
    },[])
    const getTypeName=(data,type)=>{
        const result = data.reduce((acc, curr) => {
            acc[curr.value] = curr.label;
            return acc;
          }, {});
          return result[type] || null;
    }
    const tableProps = {
        rowKey: 'id',
        scroll:datasourceTable.length>0?{y:'calc(100% - 45px)'}:{},
        columns: [
            {
                title:'序号',
                render:(text,record,index)=><span>{index+1}</span>,
                width:ORDER_WIDTH
            },
            {
                title: '名称',
                dataIndex: 'colName',
                render: (text, record) => (
                    <div>
                        {getButton(menus, 'view') ? <a onClick={() => { showDetails(record); }}>{text}</a> : text}
                    </div>

                ),
                width:BASE_WIDTH
            },
            {
                title: '编码',
                dataIndex: 'colCode',
                width:BASE_WIDTH,
                ellipsis:true,
                render:(text)=><span style={{cursor:'pointer'}}>{text}</span>
            },
            {
                title: '类型',
                dataIndex: 'colType',
                render:(text)=>(
                    <span>{getTypeName(FIELD_TYPE,text)?getTypeName(FIELD_TYPE,text):text}</span>

                ),
                width:BASE_WIDTH
            },
            {
                title: '长度',
                dataIndex: 'colLength',
                width:BASE_WIDTH
            },
            {
                title: '操作',
                render: (text, record) => {
                    return <div className='table_operation'>
                        {getButton(menus, 'update') && <a onClick={() => { modifyFieldFn(record) }} >修改</a>}
                        {getButton(menus, 'delete') && <a onClick={() => { delFieldFn(record) }} >删除</a>}
                    </div>
                },
                width:BASE_WIDTH
            },
        ],
        dataSource: datasourceTable,
        pagination: false,
        rowSelection: {
            onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys);
            },
        },
    }
    // 链接数据源
    const linkDataSourceFn = () => {
        // 新增数据源Modal
        setIsAddLinkDataSource('add');
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddLinkDataSourceModal: true,
            },
        })
    }
    // 新增物理表
    const handleAddSub = (item, e) => {
         e.stopPropagation();
        // 右键节点信息
        setRightClickNode(item);

        // 新增物理表Modal
        setIsAddPhysicalTable('add');
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddPhysicalTableModal: true,
            },
        })
    }
    // 修改数据源
    const handleModifySub = (item,e) => {
        e.stopPropagation();
        // 右键节点信息
        setRightClickNode(item);
        // 修改数据源Modal
        setIsAddLinkDataSource('modify');
        // 根据ID获取数据源
        dispatch({
            type: 'useDataBuildModel/getDatasource',
            payload: {
                id: item.dsId,
            },
        })
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddLinkDataSourceModal: true,
            },
        })
    }
    // 查看数据源;
    const handleCatSub = (node,e) => {
        e.stopPropagation();
        // 修改数据源Modal
        setIsAddLinkDataSource('cat');
        // 根据ID获取数据源
        dispatch({
            type: 'useDataBuildModel/getDatasource',
            payload: {
                id: node.dsId,
            },
            callback: () => {
                dispatch({
                    type: 'useDataBuildModel/updateStates',
                    payload: {
                        isShowAddLinkDataSourceModal: true,
                    },
                })
            }
        })
    }
    // 删除数据源;
    const handleDelSub = (node,e) => {
        e.stopPropagation();
        confirm({
            title: '确认要删除吗?',
            mask: false,
            getContainer:() =>{
              return document.getElementById('useDataBuildModel_container')
            },
            onOk() {
                dispatch({
                    type: 'useDataBuildModel/delDatasource',
                    payload: {
                        id: node.dsId,
                    },
                })
            },
          });
    }
    // 导入物理表
    const props = {
        onChange(info) {
            if (info.file.status !== 'uploading') {
                const importFormData = new FormData();
                importFormData.append('fileType', 'sqlFile');
                importFormData.append('file', info.file.originFileObj);
                dispatch({
                    type: 'useDataBuildModel/uploaderFile',
                    payload: {
                        importFormData,
                    },
                    callback: (fileStorageId) => {
                        dispatch({
                            type: 'useDataBuildModel/updateStates',
                            payload: {
                                isShowImportModal: true,
                                fileStorageId,
                            },
                        })
                    }
                })
            }
        }
    };
    // 导出物理表
    const exportFn = () => {
        if (selectTableInfo == '') {
            message.error('请选中表进行导出')
        } else {
            if (selectTableInfo.dataRef.id) {
                dispatch({
                    type: 'useDataBuildModel/getDatasourceTableExport',
                    payload: {
                        tableId: selectTableInfo.dataRef.id
                    },
                    callback: (getExportUrl) => {
                        window.open(getExportUrl, '_self');
                    }
                })
            } else {
                message.error('请选中表进行导出')
            }
        }
    }
    // 修改物理表
    const tableHandleModifySub = (node,e) => {
        e.stopPropagation();
        // 右键节点信息
        setRightClickNode(node);
        // 修改物理表Modal
        setIsAddPhysicalTable('modify');
        // 根据ID获取物理表
        dispatch({
            type: 'useDataBuildModel/getDatasourceTable',
            payload: {
                id: id
            },
            callback: () => {
                dispatch({
                    type: 'useDataBuildModel/updateStates',
                    payload: {
                        isShowAddPhysicalTableModal: true,
                    },
                })
            }
        })
    }
    // 查看物理表
    const tableHandleCatSub = (node,e) => {
        e.stopPropagation();
        // 右键节点信息
        setRightClickNode(node);
        // 查看物理表Modal
        setIsAddPhysicalTable('cat');
        // 根据ID获取物理表
        dispatch({
            type: 'useDataBuildModel/getDatasourceTable',
            payload: {
                id:id
            },
            callback: () => {
                dispatch({
                    type: 'useDataBuildModel/updateStates',
                    payload: {
                        isShowAddPhysicalTableModal: true,
                    },
                })
            }
        })
    }
    // 删除物理表
    const tableHandleDelSub = (tableId,e) => {
        e.stopPropagation();
        confirm({
            title: '确认要删除吗?',
            mask: false,
            getContainer:() =>{
              return document.getElementById('useDataBuildModel_container')
            },
            onOk() {
                    // 删除物理表
                    dispatch({
                        type: 'useDataBuildModel/delDatasourceTable',
                        payload: {
                            tableId,
                        },
                    })
            },
          });
    }
    // 复制物理表
    const tableHandleCodySub = (node,e) => {
      e.stopPropagation();
      dispatch({
        type: 'useDataBuildModel/addDatasourceTableCopy',
        payload: {
          tableId: nodeTreeItem.node.dataRef.id,
          tableName: nodeTreeItem.node.dataRef.tableName,
          tableCode: nodeTreeItem.node.dataRef.tableCode,
          dsId: nodeTreeItem.node.parentDataRef.dsId,
          dsName: nodeTreeItem.node.parentDataRef.dsName,
        },
        callback: () => {
          dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
              isShowTableCopyModal: true,
            },
          })
        }
      })
    }
    // 创建索引
    const tableCreateIndex = (node, tableId,e) => {
        e.stopPropagation();
        // 右键节点信息
        setRightClickNode(node);
        // 获取索引列表
        dispatch({
            type: 'useDataBuildModel/getDatasourceIndexes',
            payload: {
                tableId,
            },
            callback: () => {
                dispatch({
                    type: 'useDataBuildModel/updateStates',
                    payload: {
                        isShowCreateIndexModal: true,
                    },
                })
            }
        })
    }
    // 新增字段
    const addFieldFn = () => {
        if (selectedKeys.length == 0) {
            message.error('请选择一个表!')
            return
        }
        if (selectTableInfo.dataRef.tables) {
            message.error('请选择一个表!')
            return
        }
        setIsAddFieldModal(true);
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddFieldModal: true,
            },
        })
    }
    // 修改字段
    const modifyFieldFn = (record) => {
        setIsAddFieldModal(false);
        setColId(record.colId);
        dispatch({
            type: 'useDataBuildModel/getDatasourceTableField',
            payload: {
                colId: record.colId,
            },
        })
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowAddFieldModal: true,
            },
        })
        getDatasourceField(selectTableInfo.key, '', currentPage, limit);
    }
    // 删除字段
    const delFieldFn = (record) => {
        confirm({
            title: '确认要删除吗?',
            mask: false,
            getContainer:() =>{
              return document.getElementById('useDataBuildModel_container')
            },
            onOk() {
                dispatch({
                    type: 'useDataBuildModel/delDatasourceTableField',
                    payload: {
                        colId: record.colId,
                    },
                })
                getDatasourceField(selectTableInfo.key, '', currentPage, limit);
            },
          });
    }
    // 字段多选删除
    const delAllFieldFn = () => {
        if (selectedRowKeys.length > 0) {
            confirm({
                title: '确认要删除吗?',
                mask: false,
                getContainer:() =>{
                  return document.getElementById('useDataBuildModel_container')
                },
                onOk() {
                    dispatch({
                        type: 'useDataBuildModel/delDatasourceTableField',
                        payload: {
                            colId: selectedRowKeys.join(','),
                        },
                    })
                },
              });
        } else {
            message.error('请选择一条进行删除');
        }
        getDatasourceField(selectTableInfo.key, '', currentPage, limit);
    }

    // Tree左键选择
    const onSelect = (selectedKeys, info) => {
        // 设置Tree选中
        setSelectedKeys([info.node.key]);
        // 获取Tree左键节点信息
        setSelectTableInfo(info.node);
        // 获取列表
        getDatasourceField(info.node.key, '', 1, limit);
    }
    // Tree右键菜单
    const onMouseEnter = ({ event, node }) => {
        setId(node.dataRef.id)
        setKey(node.key)
        setNodeTreeItem({
            key: node.key,
            name: node.title,
            node: node,
            // 判断层级:数据库|表
            isTables: node.dataRef.tables ? false : true,
        })
    }
    // TreeNode节点处理
    const renderTreeNodes = data => data.map((item) => {
        return <TreeNode  title={<div className={styles.treeNode}>
            <span>    {item.dsName}
                <span
                    className={styles.button_menu}
                >
                    {getButton(menus, 'add') &&
                        <span onClick={(e) => { handleAddSub(item,e) }}><PlusOutlined title='新增物理表' /></span>
                    }
                    {getButton(menus, 'update') &&
                        <span onClick={(e) => { handleModifySub(item,e) }}><EditOutlined title='修改数据源' /></span>
                    }
                    {getButton(menus, 'view') &&
                        <span onClick={(e) => { handleCatSub(item,e) }}><EyeOutlined title='查看数据源' /></span>
                    }
                    {getButton(menus, 'delete') &&
                        <span onClick={(e) => { handleDelSub(item,e) }}><DeleteOutlined title='删除数据源' /></span>
                    }
                </span>
            </span>
        </div>
        } key={item.dsId} dataRef={item}>
            {
                item.tables.map(tableItem => {

                    return <TreeNode  title={<div className={styles.treeNode}>
                         {/* <FileOutlined /> */}
                        <span>  {tableItem.tableName}
                        <span
                            className={styles.button_menu}
                        >
                            {getButton(menus, 'copy') &&
                                <span onClick={(e) => { tableHandleCodySub(item,e) }}><CopyOutlined title='复制' /></span>
                            }
                            {getButton(menus, 'update') &&
                                <span onClick={(e) => { tableHandleModifySub(item,e) }}><EditOutlined title='修改' /></span>
                            }
                            {getButton(menus, 'view') &&
                                <span onClick={(e) => { tableHandleCatSub(item,e) }}><EyeOutlined title='查看' /></span>
                            }
                            {getButton(menus, 'delete') &&
                                <span onClick={(e) => { tableHandleDelSub(key,e) }}><DeleteOutlined title='删除' /></span>
                            }
                            {getButton(menus, 'add') &&
                                <span onClick={(e) => { tableCreateIndex(item, key,e) }}><NodeIndexOutlined title='创建索引' /></span>
                            }
                          {getButton(menus, 'add') &&
                            <span onClick={(e) => { tableHandleCodySub(item,e) }}><CopyOutlined title='复制' /></span>
                          }
                        </span>
                        </span>


                    </div>} key={tableItem.id} dataRef={tableItem} parentDataRef={item} />
                })
            }
        </TreeNode>
    })
    //搜索词
    const onSearchTable = (value) => {
        getDatasourceField(selectTableInfo.key, value, 1, limit)
    }
    //搜索监听输入
    const onChangeSearchWord = (e) => {
        dispatch({
            type:'useDataBuildModel/updateStates',
            payload:{
                searchWord:e.target.value
            }
        })
     }
    //分页
    const changePage = (nextPage, size) => {
        getDatasourceField(selectTableInfo.key, searchWord, nextPage, size)
    }
    //获取列表
    const getDatasourceField = (tableId, searchWord, start, limit) => {
        dispatch({
            type: 'useDataBuildModel/getDatasourceField',
            payload: {
                tableId,
                limit,
                searchWord,
                start,
            },
        })
    }
    const refreshDataFn=async()=>{
        await dispatch({
            type:'useDataBuildModel/updateStates',
            payload:{
                datasourceTable:[]
            }
        })
        getDatasourceField(selectTableInfo.key, searchWord, currentPage, limit)
    }
    function showDetails(record) {
        viewDetailsModalRef.show([
            { key: '字段名称', value: record.colName },
            { key: '字段编码', value: record.colCode },
            { key: '字段类型', value: record.colType },
            { key: '字段长度', value: record.colLength },
            { key: '创建时间', value: record.createTime, type: 2 },
        ]);
    }
    const onChangeTree=(e)=>{
        if(e.type=='click'){
            dispatch({
                type: 'useDataBuildModel/getDatasourceTree',
                payload: {},
            })
        }
    }
    function expandedLoop(array){
        let expandedLists = []
      for(let i= 0;i<array.length;i++){
        let item = array[i];
        if(item.tables && item.tables.length >= 1){
          expandedLists.push(item.dsId)
        }
        if(item.tables&&item.tables.length!=0){
          expandedLoop(item.tables)
        }
      }
      return expandedLists
    }
    const onSearchTree= (value)=>{
        if(value){
            dispatch({
                type: 'useDataBuildModel/getDatasourceTree',
                payload: {},
                callback:(data)=>{
                    data.forEach((item,index)=>{
                        const res= item.tables.filter(val=>val.tableName.includes(value))
                        item.tables=res
                     })
                     let arr = expandedLoop(data)
                     setExpandedList(arr)
                     dispatch({
                         type:'useDataBuildModel/updateStates',
                         payload:{
                             datasourceTree:data
                         }
                     })
                }
            })
        }
        else{
            dispatch({
                type: 'useDataBuildModel/getDatasourceTree',
                payload: {},
            })
            setExpandedList([])
        }
    }
    const onExpand=(expandedKeys, { expanded, node })=>{
        console.log(expandedKeys,'expandedKeys');
        setExpandedList(expandedKeys)
    }
  return (
        <div className={styles.container}>
            <ReSizeLeftRight
                suffix='useDataBuildModel'
                vNum={leftNum}
                vLeftNumLimit={210}
                leftChildren={
                    <div className={styles.departmentTree}>
                        <div className={styles.link_data_src}>
                            <Button type="primary" onClick={linkDataSourceFn}>链接数据源</Button>
                        </div>
                        <Input.Search
                            className={styles.data_src_search}
                            allowClear
                            placeholder={'请输入名称'}
                            onChange={onChangeTree}
                            onSearch={onSearchTree}
                            enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                            />
                        <Tree
                            showLine={false}
                            autoExpandParent={true}
                            showIcon={true}
                            onSelect={onSelect}
                            onMouseEnter={onMouseEnter}
                            selectedKeys={selectedKeys}
                            defaultExpandParent={true}
                            onExpand={onExpand}
                            expandedKeys={expandedList}
                        >
                            {datasourceTree.length>0?renderTreeNodes(datasourceTree):''}
                        </Tree>
                    </div>
                }
                rightChildren={
                    <div className={styles.table}>
                        <div className={styles.other} id='list_head'>
                            <Input.Search
                                className={styles.search}
                                placeholder={'请输入名称/编码'}
                                allowClear
                                onChange={onChangeSearchWord}
                                onSearch={(value) => { onSearchTable(value) }}
                                enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                            />
                            <Space>
                                <div className={styles.bt_gp}>
                                    {getButton(menus, 'import') && <Upload {...props} >
                                        <Button type='primary' icon={<UploadOutlined />}>导入</Button>
                                    </Upload>}
                                    {getButton(menus, 'export') && <Button type='primary' onClick={exportFn}>导出</Button>}
                                    {getButton(menus, 'add') && <Button type='primary' onClick={addFieldFn}>新增</Button>}
                                    {getButton(menus, 'delete') && <Button onClick={delAllFieldFn}>删除</Button>}
                                </div>
                            </Space>
                        </div>
                        <div style={{height:'calc(100% - 90px)'}}>
                            <ColumnDragTable taskType="MONITOR" modulesName="useDataBuildModel" {...tableProps} />
                        </div>
                        <IPagination current={currentPage} total={returnCount} onChange={changePage} pageSize={limit} isRefresh={true}
                                    refreshDataFn={()=>{refreshDataFn() }}/>
                    </div>
                }
            />
            {/* 新增字段Modal */}
            {isShowAddFieldModal && <AddFieldModal
                isAddFieldModal={isAddFieldModal}
                colId={colId}
                dsDynamic={selectTableInfo.parentDataRef && selectTableInfo.parentDataRef.dsDynamic}
                tableId={selectTableInfo.dataRef && selectTableInfo.dataRef.id}
                tableCode={selectTableInfo.dataRef && selectTableInfo.dataRef.tableCode}
            />}
            {/* 创建索引Modal */}
            {isShowCreateIndexModal && <CreateIndexModal
                dsDynamic={rightClickNode.dsDynamic}
                tableId={rightClickNode.id}
                tableCode={rightClickNode.tableCode}
            />}
            {/* 复制表Modal */}
            {isShowTableCopyModal && <CopyTableModal
              dsDynamic={rightClickNode.dsDynamic}
              tableId={rightClickNode.id}
              tableCode={rightClickNode.tableCode}
            />}
            {/* 导入Modal */}
            {isShowImportModal && <AddImportModal />}
            {/* 物理表Modal */}
            {isShowAddPhysicalTableModal && <AddPhysicalTable
                isAddPhysicalTable={isAddPhysicalTable}
                dsName={rightClickNode.dsDynamic}
                createTime={rightClickNode.createTime}
                createUserName={rightClickNode.createUserName}
                dsId={rightClickNode.dsId}
                dsDynamic={rightClickNode.dsDynamic}
                tableId={id}
                tableDesc={rightClickNode.tableDesc}
            />}
            {/* 链接数据源Modal */}
            {isShowAddLinkDataSourceModal && <AddLinkDataSource
                isAddLinkDataSource={isAddLinkDataSource}
                dsId={rightClickNode && rightClickNode.dsId}
            />}
            {/* 查看功能 */}
            <ViewDetailsModal
                title="查看字段"
                containerId="useDataBuildModel_container"
                ref={ref => {
                    viewDetailsModalRef = ref;
                }}
            ></ViewDetailsModal>
        </div>
    )
}
export default connect(({ useDataBuildModel, layoutG, user }) => ({
    useDataBuildModel,
    layoutG,
    user
}))(UseDataBuildModel);
