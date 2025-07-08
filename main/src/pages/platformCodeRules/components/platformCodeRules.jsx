import React, { useState, useEffect, Component } from 'react';
import { Input, Button, Tree, Table, Space, Tooltip, message, Modal } from 'antd';
import { CarryOutOutlined, FormOutlined, PlusCircleOutlined, CloseCircleOutlined,FileOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { dataFormat, getButton } from '../../../util/util.js'
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight'
import AddCodeNameModal from '../components/addCodeNameModal'
import BindCodeRuleModal from '../components/bindCodeRuleModal'
import Itree from '../../../componments/public/iTree'
import IPagination from '../../../componments/public/iPagination';
import styles from '../index.less'
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import ColumnDragTable from '../../../componments/columnDragTable'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import searchIcon from '../../../../public/assets/search_black.svg'
import RelevanceModal from "@/componments/relevanceModal/relevanceModal";
import GlobalModal from "@/componments/GlobalModal";

const { TreeNode } = Tree;
function PlatformCodeRules({ dispatch, platformCodeRules, layoutG, user, location}) {

    const {
        isShowAddModal,
        isShowBindModal,
        treeData,
        tableData,
        returnCount,
        currentPage,
        limit,
        codeChildren,
        treeSearchWord,
        searchWord,
        selectTreeNodeKeys,
        isShowRelationModal,
        selectedDataIds,
        isRoot,
        ruleId,
        dataIdList,
        selectedNodeId,
        currentNode,
        expandedKeys,
        selectedDatas,
        originalData,
        selectNodeType,
        leftNum
    } = platformCodeRules
    const { menus, menuObj } = user
    const [nodeTreeName, setNodeTreeName] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [res,setRes]=useState([])
    const re = {
        'DAY': '每日',
        'MONTH': '每月',
        'YEAR': '每年',
        'NULL': '无',
    }
    useEffect(()=>{
        dispatch({
            type: 'platformCodeRules/getCodeRule',
            payload: {}
        })
    },[])
    const columns = [
        {
            title:'序号',
            dataIndex:'number',
            key:'number',
            width:ORDER_WIDTH,
            render:(text,record,index)=><span>{index+1}</span>
        },
        {
            title: '编码名称',
            dataIndex: 'codeRuleName',
            key: 'codeRuleName',
            width:BASE_WIDTH,
            ellipsis:true
        },
        {
            title: '编码预览',
            dataIndex: 'codeRuleView',
            key: 'codeRuleView',
            width:BASE_WIDTH,
            ellipsis:true
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width:BASE_WIDTH,
            render: (text, record, index) => dataFormat(text, 'YYYY-MM-DD')
        },
        {
            title: '当前最大流水',
            dataIndex: 'flowMaxNum',
            key: 'flowMaxNum',
            width:BASE_WIDTH,
        },
        {
            title: '流水重置规则',
            dataIndex: 'flowReset',
            key: 'flowReset',
            width:BASE_WIDTH,
            render: (text, record, index) => re[text]

        },
        {
            title: '操作',
            dataIndex: 'actions',
            key: 'actions',
            width:BASE_WIDTH,
            render: (text, record, index) => (<div className='table_operation'>
                {getButton(menus, 'update') && <a onClick={() => modifyCodeRuleII(record)} type="primary">修改</a>}
                &ensp;
                {getButton(menus, 'bindRule') && <a onClick={() => bindCodeRuleII(record)} type="primary">绑定规则</a>}
                &ensp;
                {getButton(menus,'delete')&&<a onClick={delCodeRule.bind(this,[record.codeRuleId])}>删除</a>}
            </div>)
        }
    ];

    const onSelect = (selectedKeys, info) => {
        dispatch({
            type: 'platformCodeRules/getCodeRuleInfo',
            payload: {
                codeRuleId: info.node.key,
                start: 1,
                limit: limit,
                codeName: '',
            }
        })
        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                codeRuleId: info.node.key,
                selectTreeNodeKeys: [info.node.key],
                searchWord: ''
            }
        })
    };
    const onMouseEnter = ({ event, node }) => {
        setNodeTreeName(node.dataRef.codeRuleName);
        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                codeRuleId: node.dataRef.codeRuleId,
                codeChildren: node.dataRef.children,
            //    selectTreeNodeKeys: [node.dataRef.codeRuleId],
            ruleId: node.dataRef.codeRuleId,
            }
        })
    }
    function checkWOrd(value) {
        let specialKey = "`_@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'";
        for (let i = 0; i < value.length; i++) {
            if (specialKey.indexOf(value.substr(i, 1)) != -1) {
                return true
            }
        }
        return false
    }
    // 添加编码分类;
    const handleAddSub = () => {
        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                isShowAddModal: true,
                isTreeOrTable: 'GROUP',
                isAddOrModify: 'add',
                iscodeOrClassify: 'classify'
            }
        })
    }
    // 修改编码分类;
    const handleModifySub = () => {
        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                isShowAddModal: true,
                isAddOrModify: 'modify',
                iscodeOrClassify: 'classify'
            }
        })
    }
    // 删除编码分类;
    const handleDelSub = () => {
        let selectedId = selectTreeNodeKeys[0];
        console.log(selectTreeNodeKeys, 'selectTreeNodeKeys');
        if (selectedId) {
            if (codeChildren.length != 0) {
                message.error('该分类下有子集!');
                return
            } else {
                Modal.confirm({
                    title: '确认删除吗？',
                    content: '',
                    okText: '删除',
                    cancelText: '取消',
                    maskClosable:false,
                    mask:false,
                    getContainer:()=>{
                        return  document.getElementById('platformCodeRules_container')
                    },
                    onOk() {
                        dispatch({
                            type: 'platformCodeRules/deleteCodeRule',
                            payload: {
                                codeRuleIds: ruleId,
                                type: 'GROUP',
                            }
                        })
                    }
                });
            }


        } else {
            message.success('请选中删除的编码');
        }
    }


    // TreeNode节点处理
    const renderTreeNodes = data => data.map((item) => {
        console.log(data, 'data');
        if (item) {
            const flag = item.codeRuleName.indexOf(treeSearchWord);
            const beforeStr = item.codeRuleName.substr(0, flag);
            const afterStr = item.codeRuleName.substr(flag + treeSearchWord.length);
            // const title = flag > -1 ? (
                const title=<div className={styles.group_tree_title}>
                    {/* {item.children.length==0?<FileOutlined />:''} */}
                    {/* {beforeStr} */}
                    {/* <span className={styles.siteTreeSearchValue}>{treeSearchWord}
                    </span> */}
                     <span>{item.codeRuleName}</span>
                    {/* <span>{afterStr}</span> */}
                    <span className={styles.hover_opration}>
                        {getButton(menus, 'add') &&
                            <span onClick={handleAddSub}><PlusOutlined title='新增'/></span>
                        }
                        {getButton(menus, 'update') &&
                            <span onClick={handleModifySub}><EditOutlined title='修改'/></span>
                        }
                        {getButton(menus, 'delete') &&
                            <span onClick={handleDelSub}><DeleteOutlined title='删除'/></span>
                        }
                    </span>
                </div>

            // ) : (
            //     <span>{item.codeRuleName}</span>
            // )
            if (item.children) {
                return (
                    <TreeNode title={title} key={item.codeRuleId} dataRef={item}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={title} key={item.codeRuleId} dataRef={item} />
        }

    })

    // 新增根节点
    const addRootNode = () => {
        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                isShowAddModal: true,
                isTreeOrTable: 'GROUP',
                isAddOrModify: 'add',
                iscodeOrClassify: 'classify',
                isRoot: true,
            }
        })
        dispatch({
            type: 'platformCodeRules/getCodeRule',
            payload: {}
        })

    }

    // 新建规则
    const addCodeRule = () => {
        if (selectTreeNodeKeys && selectTreeNodeKeys.length > 0) {
            dispatch({
                type: 'platformCodeRules/updateStates',
                payload: {
                    isShowAddModal: true,
                    isTreeOrTable: 'NUMBER',
                    isAddOrModify: 'add',
                    iscodeOrClassify: 'code',
                }
            })
        } else {
            message.error('请选择编码分类进行操作')
        }
    }

    //修改单项
    const modifyCodeRuleII = (record) => {
        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                isShowAddModal: true,
                isAddOrModify: 'modify',
                iscodeOrClassify: 'code',
                nowSelectedRow: Object.assign(record),
            }
        })
    }


    const delCodeRule = (ids) => {
        if (ids.length > 0) {
            Modal.confirm({
                title: '确认删除吗？',
                content: '',
                okText: '删除',
                cancelText: '取消',
                getContainer:()=>{
                    return  document.getElementById('platformCodeRules_container')
                },
                maskClosable:false,
                mask:false,
                onOk: () => {
                    dispatch({
                        type: 'platformCodeRules/deleteCodeRule',
                        payload: {
                            codeRuleIds: ids.join(','),
                            type: 'NUMBER',
                        }
                    })
                    dispatch({
                        type: 'platformCodeRules/getCodeRuleInfo',
                        payload: {
                            codeRuleId: selectTreeNodeKeys[0],
                            start: 1,
                            limit: limit,
                            codeName: searchWord,
                        }
                    })
                    setSelectedRowKeys([])
                },
            });
        } else {
            message.error('请选择一条进行删除');
        }
    }

    // 归属单位 start
    const saveBelongOrg = (ids) => {
        if (ids.length > 0) {
            // 赋值列表选中数据
            dispatch({
                type: 'platformCodeRules/updateStates',
                payload: {
                    dataIdList:ids
                },
            });
            // 弹窗中的数据赋值空
            dispatch({
                type: 'platformCodeRules/updateStates',
                payload: {
                    selectedDataIds:[],
                    selectedDatas:[]
                },
            });
            if (ids.length === 1) {
                // 查询回显数据
                dispatch({
                    type: 'platformCodeRules/queryBelongOrg',
                    payload: {
                        dataId: ids,
                        menuId: menuObj[location.pathname].id
                    },
                    callback: () => {
                        dispatch({
                            type: 'platformCodeRules/updateStates',
                            payload: {
                                isShowRelationModal: true
                            }
                        })
                    }
                })
            } else {
                dispatch({
                    type: 'platformCodeRules/updateStates',
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
            type: 'platformCodeRules/updateStates',
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
            type: 'platformCodeRules/saveBelongOrg',
            payload: {
                menuId: menuObj[location.pathname].id,
                menuCode: menuObj[location.pathname].menuCode,
                insertStr: JSON.stringify(insertStr),
                dataIds: dataIdList.toString()
            },
            callback: () => {
                dispatch({
                    type: 'platformCodeRules/updateStates',
                    payload: {
                        isShowRelationModal: false,
                        dataIdList: []
                    }
                })
            }
        })
    }
	  // 归属单位 end


    //绑定单项
    const bindCodeRuleII = (record) => {
        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                isShowBindModal: true,
                codeRuleId: record.codeRuleId,
            }
        })
        dispatch({
            type: 'platformCodeRules/getCodeRuleInfos',
            payload: {
                codeRuleId: record.codeRuleId,
            }
        })
    }

    const onSearchTree = (value) => {
        if (checkWOrd(value)) {
            message.error('搜索词中包含特殊字符！')
            return
        }

        dispatch({
            type: `platformCodeRules/updateStates`,
            payload: {
                treeSearchWord: value
            }
        })
        if(value){
            dispatch({
                type: 'platformCodeRules/getCodeRule',
                callback:(data)=>{
                    const resultTree=searchTree(data,value)
                    console.log(resultTree,'resultTree==');
                    resultTree.forEach((item=>{
                        item.children=[]
                    }))
                    dispatch({
                        type:'platformCodeRules/updateStates',
                        payload:{
                            treeData:resultTree
                        }
                    })
                    setRes([])
                }
            })
        }
        else{
            dispatch({
                type: 'platformCodeRules/getCodeRule',
                payload: {},
            })
            dispatch({
                type:'platformCodeRules/updateStates',
                payload:{
                    selectTreeNodeKeys:[],
                    tableData:[]
                }
            })
        }
    }
    const searchTree = (data, searchWord) => {

        data.forEach((item, index) => {
            if (item.codeRuleName.includes(searchWord)) {
                res.push(item)
            }
            if (item.children) {
                searchTree(item.children, searchWord)
            }
        })

        return res
    }


    const onChangeValue = (e) => {
        dispatch({
            type: `platformCodeRules/updateStates`,
            payload: {
                treeSearchWord: e.target.value
            }
        })
        // setRes([])
        // if(e.type=='click'){
        //     dispatch({
        //         type: 'platformCodeRules/getCodeRule',
        //         payload: {},
        //     })
        // }
    }
    const onChangeTableValue = (e) => {
        dispatch({
            type: `platformCodeRules/updateStates`,
            payload: {
                searchWord: e.target.value
            }
        })
    }


    const onSearchTable = (value) => {
        if (checkWOrd(value)) {
            message.error('搜索词中包含特殊字符！')
            return
        }
        dispatch({
            type: 'platformCodeRules/updateStates',
            payload: {
                searchWord: value,
            }
        })
        dispatch({
            type: 'platformCodeRules/getCodeRuleInfo',
            payload: {
                codeRuleId: selectTreeNodeKeys[0],
                start: 1,
                limit: limit,
                codeName: value,
            }
        })
    }
    //分页
  const changePage=(nextPage,size)=>{
    dispatch({
        type: 'platformCodeRules/updateStates',
        payload: {
            currentPage: nextPage,
            limit: size,
        }
    })
    dispatch({
        type: 'platformCodeRules/getCodeRuleInfo',
        payload: {
            codeRuleId: selectTreeNodeKeys[0],
            start: nextPage,
            limit: size,
            codeName: searchWord,
        }
    })
  }
    return (
        <div className={styles.container} id="platformCodeRules_container">
            <ReSizeLeftRight
                suffix='platformCodeRules'
                vNum={leftNum}
                vLeftNumLimit={210}
                leftChildren={
                    <>
                        <Input.Search
                            className={styles.search}
                            placeholder={'请输入分类名称'}
                            allowClear
                            onChange={onChangeValue.bind(this)}
                            onSearch={(value) => { onSearchTree(value) }}
                            enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                        />
                        {/* <Space size={8} > */}
                            {getButton(menus, 'add') && <Button className={styles.space_tree_ele} onClick={addRootNode} type="primary">添加根节点</Button>}
                        {/* </Space> */}

                        <Tree
                            defaultExpandAll
                            showLine={true}
                            showIcon={true}
                            selectedKeys={selectTreeNodeKeys}
                            onSelect={onSelect}
                            onMouseEnter={onMouseEnter}
                        >
                            {renderTreeNodes(treeData)}
                        </Tree>
                    </>
                }
                rightChildren={
                    <div style={{height:'100%'}}>
                        <div id='list_head'>
                             <Input.Search
                                value={searchWord}
                                className={styles.table_search}
                                placeholder={'请输入编码名称'}
                                allowClear
                                onChange={onChangeTableValue.bind(this)}
                                onSearch={(value) => { onSearchTable(value) }}
                                enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                            />
                            <Space size={8} className={styles.space_ele}>

                                {getButton(menus, 'add') && <Button onClick={addCodeRule} type="primary">新建</Button>}
                                {getButton(menus, 'delete') && <Button onClick={delCodeRule.bind(this,selectedRowKeys)}>删除</Button>}
                                {<Button onClick={saveBelongOrg.bind(this,selectedRowKeys)}>归属单位</Button>}
                            </Space>
                        </div>


                        <div style={{height:'calc(100% - 90px)'}}>
                        <ColumnDragTable
                            taskType="MONITOR"
                            modulesName="platformCodeRules"
                            columns={columns}
                            dataSource={tableData}
                            rowKey="codeRuleId"
                            pagination={false}
                            rowSelection={{
                                selectedRowKeys: selectedRowKeys,
                                onChange: (selectedRowKeys, selectedRows) => {
                                    setSelectedRows(selectedRows);
                                    setSelectedRowKeys(selectedRowKeys)
                                }
                            }}
                            scroll={{y:tableData&&tableData.length?'calc(100% - 50px)':null}}
                        />
                        </div>
                        <IPagination
                            current={currentPage}
                            total={returnCount}
                            onChange={changePage}
                            pageSize={limit}
                            isRefresh={true}
                            refreshDataFn={()=>{
                                dispatch({
                                    type: 'platformCodeRules/getCodeRuleInfo',
                                    payload: {
                                        codeRuleId: selectTreeNodeKeys[0],
                                        start: currentPage,
                                        limit: limit,
                                        codeName: searchWord,
                                    }
                                })
                            }}
                        />
                    </div>
                }
            />
            {isShowAddModal &&
                <AddCodeNameModal
                    nodeTreeName={nodeTreeName}
                />}
            {isShowBindModal &&
                <BindCodeRuleModal
                    listSelectedRowKey={selectedRowKeys[0]}
                />}


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
                        return document.getElementById('platformCodeRules_container')||false;
                    }}
                >
                    <RelevanceModal nameSpace="platformCodeRules" spaceInfo={platformCodeRules} orgUserType="ORG" containerId="platformCodeRules_container"  />
                  <div style={{color:'red', fontSize: 14, position:"fixed", marginTop: 38 }}>注:多条配置,无法回显,确认覆盖更新,请谨慎!</div>
                </GlobalModal>
            }

        </div>
    )
}
export default connect(({ platformCodeRules, layoutG, user }) => ({
    platformCodeRules,
    layoutG,
    user
}))(PlatformCodeRules);
