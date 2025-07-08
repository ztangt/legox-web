import React, { useState ,useEffect} from 'react';
import { connect } from 'dva';
import _ from "lodash";
import { Input, Button, message, Space, Table, Tree, Dropdown, Menu,Modal } from 'antd';
import { DownOutlined ,FileOutlined} from '@ant-design/icons';
import { dataFormat, getButton } from '../../../util/util.js'
import styles from './businessFormManage.less';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight'
import IPagination from '../../../componments/public/iPagination';
import AddURLModal from './addURLModal'
import AddApplicationCategory from './addApplicationCategory'
import CatVersionInfo from './catVersionInfo'
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import ModalPreview from '../../../componments/formPreview/modalPreview';
import ListPreview from '../../../componments/listMoudlePreview/listMoudlePreview';
import {history} from 'umi'
import searchIcon from '../../../../public/assets/search_black.svg'
import ColumnDragTable from '../../../componments/columnDragTable/index.jsx';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import GlobalModal from "@/componments/GlobalModal";
import RelevanceModal from "@/componments/relevanceModal/relevanceModal";
const { TreeNode ,DirectoryTree} = Tree

function BusinessFormManage({ dispatch, businessFormManage, layoutG, user, location }) {
    const {
        pathname,
        businessFormTable,
        businessFormTree,
        returnCount,
        currentPage,
        limit,
        searchWord,
        isShowAddURLModal,
        isShowCatVersionInfo,
        isShowAddApplicationCategory,
        start,
        treeSearchWord,
        copyBusinessFormTree,
        isShowRelationModal, // 归属单位
        dataIdList, // 列表勾选数据
        selectedNodeId,
        selectedDataIds,
        currentNode,
        expandedKeys,
        selectedDatas,
        originalData,
        selectNodeType,
        leftNum
    } = businessFormManage
    const { menus, menuObj } = user
    const [nodeTreeItem, setNodeTreeItem] = useState(null);
    const [rowRecord, setRowRecord] = useState(null);
    const [selectCtlgInfo, setSelectCtlgInfo] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isAddURLModal, setIsAddURLModal] = useState(true);
    const [isPreview, setIsPreview] = useState(false);
    const [isPreviewFrom, setIsPreviewFrom] = useState(false);
    const [isListMoudlePreview,setIsListMoudlePreview] = useState(false);
    const [isAddApplicationCategory, setIsAddApplicationCategory] = useState(true);
    const [formId, setFormId] = useState('');
    const [version, setVersion] = useState('');
    const [expandedList,setExpandedList] = useState([])
    var viewDetailsModalRef; //查看Modalref
    useEffect(()=>{
        dispatch({
            type: 'businessFormManage/getSysCtlgTree',
            payload: {
                hasPermission: '1',
                type: 'ALL',
                searchWord: '',
            }
        })
    },[])
    const tableProps = {
        rowKey: 'id',
        columns: [
            {
                title:'序号',
                render:(text,record,index)=><span>{index+1}</span>,
                width:ORDER_WIDTH,
            },
            {
                title: '表单名称',
                dataIndex: 'bizFormName',
                render: (text,record) => {return getButton(menus,'preview')?<a className={styles.text} title={text} onClick={()=>{catPreviewFn(record)}}>{text}</a>:<div className={styles.text} title={text}>{text}</div>},
                width:BASE_WIDTH,
            },
            {
                title: '表单编码',
                dataIndex: 'bizFormCode',
                width:BASE_WIDTH,
                ellipsis:true,
                render:(text)=><span title={text} style={{cursor:'pointer'}}>{text}</span>
            },
            {
                title: '类型',
                dataIndex: 'bizFormType',
                width:BASE_WIDTH,
                render: text => {
                    switch (text) {
                        case 1: return '超链接表单';
                        case 2: return '超链接列表';
                        case 3: return '表单建模';
                        case 4: return '列表建模';
                    }
                }
            },
            {
                title: '主版本号',
                dataIndex: 'formVersion',
                render: (text, record) => record.bizFormType==3&&text? text : '无',
                width:BASE_WIDTH,
            },
            {
                title: '创建人',
                dataIndex: 'createUserName',
                width:BASE_WIDTH,
            },
            {
                title: '创建日期',
                dataIndex: 'createTime',
                width:BASE_WIDTH,
                render: text => { return dataFormat(text, 'YYYY-MM-DD') }
            },
            {
                title: '操作',
                width:BASE_WIDTH,
                render: (text, record) => {
                    return <div className='table_operation'>
                        {getButton(menus,'update')&&(record.bizFormType==1||record.bizFormType==2)&&<a  onClick={() => { modifyBusinessForm(record) }}>修改</a>}
                        {getButton(menus,'delete')&&(record.bizFormType==1||record.bizFormType==2)&&<a  onClick={() => { deleteBusinessForm(record) }}>删除</a>}
                        {/* 如果bizFormType是表单建模或者列表建模时才展示更多 */}
                        {record.bizFormType == 3&&
                            <>
                                {getButton(menus,'preview')&&<a onClick={()=>{showFromDetails(record)}}>
                                    预览
                                </a>}
                                {getButton(menus,'versionControl')&&<a onClick={() => { catVersionFn(record) }}>
                                    版本
                                 </a>}
                            </>}


                        {record.bizFormType == 4&&getButton(menus,'preview')&&<a onClick={() => { showListDetails(record) }}>预览</a>}
                    </div>
                }
            },
        ],
        dataSource: businessFormTable,
        pagination: false,
        rowSelection: {
            onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys)
            },
        },
    }
    const showDetails = (record) =>{
        // let type = ''
        // switch (record.bizFormType) {
        //     case 1: type =  '超链接表单';
        //     case 2: type =  '超链接列表';
        //     case 3: type =  '表单建模';
        //     case 4: type =  '列表建模';
        // }
        // viewDetailsModalRef.show([
        //   { key: '业务应用类别', value:  selectCtlgInfo.nodeName},
        //   { key: '类型', value: type },
        //   { key: '表单名称', value: record.bizFormName},
        //   { key: '表单编码', value: record.bizFormCode},
        //   { key: 'URL', value: record.bizFormUrl},
        //   { key: '打印模板', value: record.printTemplate},
        //   { key: '描述·', value: record.bizFormDesc},

        // ]);
      }
    const  showFromDetails = (record) =>{
        // //获取表单详情
        // dispatch({
        //     type:'formPreview/getFormDetail',
        //     payload:{
        //         formId: record.formId,
        //         version: record.mainVersion,
        //     }
        // })
        setIsPreviewFrom(true);
        setFormId(record.formId);
        setVersion(record.formVersion);
    }
    const  showListDetails = (record) =>{
        // //获取表单详情
        dispatch({
            type:'listMoudlePreview/getFormListModelInfo',
            payload:{
                modelId: record.formId,
            }
        })
        setIsListMoudlePreview(true);

    }
    // 版本查看
    const catVersionFn = (record) => {
        //获取表单详情
        dispatch({
            type:'businessFormManage/getVersionList',
            payload:{
                formId: record.formId,
            }
        })
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                isShowCatVersionInfo: true,
            }
        })
    }
    // 信息预览
    const catPreviewFn = (record) => {
        // 所操作的当前行
        // setRowRecord(record)
        // 设置预览
        setIsPreview(true);
        // dispatch({
        //     type: 'businessFormManage/updateStates',
        //     payload: {
        //         isShowAddURLModal: true,
        //     }
        // })
        modifyBusinessForm(record)
    }
    // 列表修改
    const modifyBusinessForm = (record) => {
        // 所操作的当前行
        setRowRecord(record)
        // 修改UrlModal
        setIsAddURLModal(false);
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                isShowAddURLModal: true,
            },
            callback: () => {
                getBusinessForm(selectCtlgInfo.nodeId, '', 1, limit);
            }
        })
    }
    // 列表删除
    const deleteBusinessForm = (record) => {
        if(record.id){
            Modal.confirm({
                title: '确认删除吗?',
                // content: '确认删除该业务表单',
                okText: '删除',
                cancelText: '取消',
                mask:false,
                getContainer:()=>{
                    return document.getElementById('businessFormManage_container')
                },
                onOk() {
                    dispatch({
                        type: 'businessFormManage/delBusinessForm',
                        payload: {
                            bizFormIds: record.id,
                        },
                        callback: () => {
                            setSelectedRowKeys([]);
                            getBusinessForm(selectCtlgInfo.nodeId, '', 1, limit);
                        }
                    })
                },
              });
        }else{
            message.error('请选择需要删除的数据')
        }


    }
    //列表更多操作
    const operationMenu = (record) => {
        return (<Menu>
            {getButton(menus,'preview')&&<Menu.Item onClick={()=>{showFromDetails(record)}}>
                <span>
                    预览
                </span>
            </Menu.Item>}
            {getButton(menus,'versionControl')&&<Menu.Item onClick={() => { catVersionFn(record) }}>
                <span>
                    版本
                </span>
            </Menu.Item>}
        </Menu>)
    }
    const onSelect = (selectedKeys, info) => {
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                searchWord: ''
            }
        })
        // 设置Tree选中
        setSelectedKeys([info.node.dataRef.nodeId]);
        // 关闭右键菜单
        setNodeTreeItem(null);
        // 获取Tree左键节点信息
        setSelectCtlgInfo(info.node.dataRef);
        // 获取列表
        getBusinessForm(info.node.dataRef.nodeId, '', 1, limit);
    }
    // TreeNode节点处理
    // const renderTreeNodes = data => data.map((item) => {


    //     if (item.children) {
    //         return (
    //             <TreeNode title={item.nodeName} key={item.nodeId} dataRef={item}>
    //                 {renderTreeNodes(item.children)}
    //             </TreeNode>
    //         );
    //     }
    //     return <TreeNode title={item.nodeName} key={item.nodeId} dataRef={item} />
    // })

    const renderTreeNodes = data => data.map((item, index) => {
        if(item){
            const flag = item.nodeName.indexOf(treeSearchWord);
            const beforeStr = item.nodeName.substr(0, flag);
            const afterStr = item.nodeName.substr(flag + treeSearchWord.length);
            const title =
            // flag > -1 ? (

            //     <span>
            //        {/* {item.children.length==0? <FileOutlined />:''} */}
            //     {beforeStr}
            //     <span className={styles.siteTreeSearchValue}>{treeSearchWord}</span>
            //     {afterStr}
            //     </span>
            // ) : (
                <span>{item.nodeName}</span>
            // )
            if (item.children) {
                return (
                    <TreeNode title={title} key={item.nodeId} dataRef={item}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={title} key={item.nodeId} dataRef={item} />
        }

    })
     // children为[],则删除children
  const deleteChildren=(data)=> {
    data.forEach(item=>{
      if (item.children&&item.children.length) {
        deleteChildren(item.children)
      }else {
        delete item.children
      }
    })
    return data
  }
  const searchTable=(value,data)=>{
    if(!data){
      return []
    }
    let newData=[]
    data.forEach(item=>{
      if(item.nodeName.indexOf(value)>-1){
        const res=searchTable(value,item.children)
        const obj={
          ...item,
          children:res
        }
        newData.push(obj)
      }
      else{
        if(item.children&&item.children.length>0){
          const res=searchTable(value,item.children)
          const obj={
            ...item,
            children:res
          }
          if(res&&res.length>0){
            newData.push(obj)
          }
        }
      }
    })
    return newData
  }
    let expandedLists = []
    function expandedLoop(array){
      for(let i= 0;i<array.length;i++){
        let item = array[i];
        if(item.children && item.children.length >= 1){
          expandedLists.push(item.nodeId)
        }
        if(item.children&&item.children.length!=0){
          expandedLoop(item.children)
        }
      }
      return expandedLists
    }
    const onSearchTree = (value) => {
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                treeSearchWord: value
            }
        })
        if(value){
            expandedLists = []
            let arr = expandedLoop(copyBusinessFormTree)
            setExpandedList(arr)
            const res=searchTable(value,copyBusinessFormTree)
            const newData=deleteChildren(res)
            console.log(newData);
            dispatch({
                type:'businessFormManage/updateStates',
                payload:{
                    businessFormTree: newData
                }
            })
        }
        else{
            dispatch({
                type: 'businessFormManage/getSysCtlgTree',
                payload: {
                    hasPermission: '1',
                    type: 'ALL',
                    searchWord: '',
                }
            })
        }
        // getBusinessForm(selectCtlgInfo.nodeId, value, start, limit)
    }

    const onSearchTable = (value) => {
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                searchWord: value
            }
        })
        getBusinessForm(selectCtlgInfo.nodeId, value, 1, limit)
    }
    const onRightClick = ({ event, node }) => {
        let x = event.currentTarget.offsetLeft + event.currentTarget.clientWidth;
        let y = event.currentTarget.offsetTop;
        setNodeTreeItem({
            pageX: x,
            pageY: y,
            id: node.eventKey,
            name: node.title,
        })
    }
    const getNodeTreeMenu = () => {
        const { pageX, pageY } = nodeTreeItem;
        const tmpStyle = {
            position: 'absolute',
            textAlign: 'center',
            left: `${pageX - 20}px`,
            top: `${pageY + 50}px`,
        };
        const rightClickMenu = (
            <div
                style={tmpStyle}
                className={styles.right_click_menu}
            >
                <div className={styles.item_menu} onClick={handleAddSub}>
                    <span>新增应用类别</span>
                </div>
                <div className={styles.item_menu} onClick={handleDelSub}>
                    <span>删除应用类别</span>
                </div>
                <div className={styles.item_menu} onClick={handleModifySub}>
                    <span>修改应用类别</span>
                </div>
            </div>
        );
        return (nodeTreeItem == null) ? '' : rightClickMenu;
    }
    // 新增节点;
    const handleAddSub = () => {
        // 应用类别新增
        setIsAddApplicationCategory(true);
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                isShowAddApplicationCategory: true
            }
        })
    }
    // 修改节点;
    const handleModifySub = () => {
        // 应用类别修改
        setIsAddApplicationCategory(false);
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                isShowAddApplicationCategory: true
            }
        })
    }
    // 删除节点;
    const handleDelSub = () => { }
    //搜索词
    const onChangeSearchWord = (e) => {
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                searchWord: e.target.value
            }
        })
    }
    //分页
    const changePage = (nextPage, size) => {
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                start: nextPage,
                limit: size
            }
        })
        getBusinessForm(selectCtlgInfo.nodeId, searchWord, nextPage, size)
    }
    //获取列表
    const getBusinessForm = (ctlgId, searchWord, start, limit) => {
        if(ctlgId){
            dispatch({
                type: 'businessFormManage/getBusinessForm',
                payload: {
                    ctlgId,
                    searchWord,
                    start,
                    limit
                }
            })
        }else{
            message.error('请选择业务分类！')
        }

    }
    const addURLFn = () => {
        // 新增UrlModal;
        setRowRecord(null)
        setIsAddURLModal(true);
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                isShowAddURLModal: true,
            }
        })
    }
    const allDelFn = () => {
        if(selectedRowKeys&&selectedRowKeys.length==0){
            message.error('请选择需要删除的数据')
            return
        }
        Modal.confirm({
            title: '确认删除吗?',
            // content: '确认删除该业务表单',
            okText: '删除',
            cancelText: '取消',
            mask:false,
            getContainer:()=>{
                return document.getElementById('businessFormManage_container')
            },
            onOk() {
                dispatch({
                    type: 'businessFormManage/delBusinessForm',
                    payload: {
                        bizFormIds: selectedRowKeys.join(','),
                    },
                    callback: () => {
                        setSelectedRowKeys([]);
                        getBusinessForm(selectCtlgInfo.nodeId, '', 1, limit);
                    }
                })
            },
        });

    }

    // 归属单位 start
    const saveBelongOrg = () => {
        debugger
        if (selectedRowKeys.length > 0) {
            // 赋值列表选中数据
            dispatch({
                type: 'businessFormManage/updateStates',
                payload: {
                    dataIdList:selectedRowKeys
                },
            });
            // 弹窗中的数据赋值空
            dispatch({
                type: 'businessFormManage/updateStates',
                payload: {
                    selectedDataIds:[],
                    selectedDatas:[]
                },
            });
            if (selectedRowKeys.length === 1) {
                // 查询回显数据
                dispatch({
                    type: 'businessFormManage/queryBelongOrg',
                    payload: {
                        dataId: selectedRowKeys,
                        menuId: menuObj[location.pathname].id
                    },
                    callback: () => {
                        dispatch({
                            type: 'businessFormManage/updateStates',
                            payload: {
                                isShowRelationModal: true
                            }
                        })
                    }
                })
            } else {
                dispatch({
                    type: 'businessFormManage/updateStates',
                    payload: {
                        isShowRelationModal: true
                    }
                })
            }
        } else {
            message.error('请至少选择一条数据');
        }
    }

    // 单位树取消：隐藏弹窗
    const handleCancel = () => {
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                isShowRelationModal: false,
                dataIdList: []
            },
        });
    };
    // 单位树确认：获取到选中id
    const onOk = () => {
        if(menuObj[location.pathname] === undefined) {
            message.error('获取不到菜单ID和菜单编码')
            return;
        }
        let insertStr = [];
        for (i = 0; i < selectedDatas.length; i++) {
            const orgObj = selectedDatas[i];
            let belongObj = {'ORG_ID': orgObj.nodeId, 'ORG_NAME': orgObj.nodeName, 'PARENT_ORG_ID': orgObj.parentId, 'PARENT_ORG_NAME': orgObj.parentName}
            insertStr.push(belongObj);
        }
        dispatch({
            type: 'businessFormManage/saveBelongOrg',
            payload: {
                menuId: menuObj[location.pathname].id,
                menuCode: menuObj[location.pathname].menuCode,
                insertStr: JSON.stringify(insertStr),
                dataIds: dataIdList.toString()
            },
            callback: () => {
                dispatch({
                    type: 'businessFormManage/updateStates',
                    payload: {
                        isShowRelationModal: false,
                        dataIdList: []
                    }
                })
            }
        })
    }
    // 归属单位 end


    const onExpand=(expandedKeys, { expanded, node })=>{
        console.log(expandedKeys,'expandedKeys');
        setExpandedList(expandedKeys)
    }
    return (
        <div className={styles.container}>
            <ReSizeLeftRight
                suffix='businessFormManage'
                vNum={leftNum}
                vLeftNumLimit={210}
                leftChildren={
                    <div className={styles.departmentTree}>
                        <Input.Search
                            className={styles.search}
                            allowClear
                            placeholder={'请输入名称'}
                            // onChange={onChangeTree.bind(this)}
                            onSearch={(value) => { onSearchTree(value) }}
                            enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                        />
                        <Tree
                            showLine={true}
                            autoExpandParent={true}
                            showIcon={true}
                            onSelect={onSelect}
                            onRightClick={onRightClick}
                            selectedKeys={selectedKeys}
                            defaultExpandAll={true}
                            onExpand={onExpand}
                            expandedKeys={expandedList}
                        >
                            {businessFormTree.length>0?renderTreeNodes(businessFormTree):''}
                        </Tree>
                        {/**nodeTreeItem != null ? getNodeTreeMenu() : ""*/}
                    </div>
                }
                rightChildren={
                    <div className={styles.table}>
                        <div className={styles.other} id='list_head'>
                            <Input.Search
                                value={searchWord}
                                className={styles.search}
                                placeholder={'请输入名称'}
                                allowClear
                                onChange={onChangeSearchWord}
                                onSearch={(value) => { onSearchTable(value) }}
                                enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                            />
                            {/* <Space> */}
                                <div className={styles.bt_gp}>
                                    {getButton(menus,'add')&&<Button type='primary' onClick={addURLFn}>新增URL</Button>}
                                    {getButton(menus,'delete')&&<Button onClick={allDelFn}>删除</Button>}
                                    {<Button onClick={saveBelongOrg}>归属单位</Button>}
                                </div>
                            {/* </Space> */}
                        </div>
                        <div style={{height:'calc(100% - 90px)'}}>
                            <ColumnDragTable taskType="MONITOR" modulesName="businessFormManage" {...tableProps} scroll={businessFormTable.length>0?{y:'calc(100% - 45px)'}:{}}/>
                        </div>
                        <IPagination current={currentPage} total={returnCount} onChange={changePage} pageSize={limit} isRefresh={true} refreshDataFn={()=>{getBusinessForm(selectCtlgInfo.nodeId, searchWord, 1, limit);}}/>
                    </div>
                }
            />
            {isShowAddURLModal && <AddURLModal isAddURLModal={isAddURLModal} selectCtlgInfo={selectCtlgInfo} businessFormTree={businessFormTree} rowRecord={rowRecord} isPreview={isPreview} setSelectedKeys={setSelectedKeys} setSelectCtlgInfo={setSelectCtlgInfo} getBusinessForm={getBusinessForm} setIsPreview={setIsPreview}/>}
            {isShowAddApplicationCategory && <AddApplicationCategory isAddApplicationCategory={isAddApplicationCategory} />}
            {isShowCatVersionInfo && <CatVersionInfo />}
            {/* <ViewDetailsModal
                title="信息预览"
                containerId="businessFormManage_container"
                ref={ref => {
                viewDetailsModalRef = ref;
                }}
            ></ViewDetailsModal> */}
            {isPreviewFrom&&<ModalPreview cancelPre={()=>{setIsPreviewFrom(false)}} formId={formId} version={version} containerId={'businessFormManage_container'}/>}
            {isListMoudlePreview&&<ListPreview cancelPre={()=>{setIsListMoudlePreview(false)}} id='businessFormManage_container'/>}

            {isShowRelationModal &&
                <GlobalModal
                    title="关联单位"
                    visible={true}
                    onOk={onOk}
                    onCancel={handleCancel}
                    widthType={3}
                    maskClosable={false}
                    // bodyStyle={{ height: '445px', padding: '0px' }}
                    mask={false}
                    okText="确认"
                    cancelText="关闭"
                    getContainer={() => {
                        return document.getElementById('businessFormManage_container')||false;
                    }}
                >
                    <RelevanceModal nameSpace="businessFormManage" spaceInfo={businessFormManage} orgUserType="ORG" containerId="businessFormManage_container"  />
                    <div style={{color:'red', fontSize: 14, position:"fixed", marginTop: 38 }}>注:多条配置,无法回显,确认覆盖更新,请谨慎!</div>
                </GlobalModal>
            }
        </div>
    )
}
export default connect(({ businessFormManage, layoutG, user }) => ({
    businessFormManage,
    layoutG,
    user
}))(BusinessFormManage);
