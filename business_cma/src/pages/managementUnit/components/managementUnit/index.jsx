import { Button, Checkbox, Col, Input, message, Row, Select, Space, Tree } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import ColumnDragTable from '../../../../components/columnDragTable';
import ICommon from '../../../../components/iCommon';
import ResizeLeftRight from '../../../../components/resizeLeftRight';
import Tabs from '../../../../components/tabs';
import configs from '../configs';
import styles from './index.less';

const { Option } = Select;
let checkedArrTarget = [];
const ManageMentUnit = ({ dispatch, managementUnitSpace }) => {
    //tab 切换
    const [tabSelect, setTabSelect] = useState('1');
    // 左侧选中
    const [checkKeys, setCheckKeys] = useState([]);
    // center 树选中
    const [selectedKeys, setSelectedKeys] = useState([]);
    // center 树选中
    const [selectTreeData, setSelectTreeData] = useState(null);
    // 右侧树选中
    const [rightSelectedKeys, setRightSelectedKeys] = useState([]);
    // 左侧选中list
    const [checkedList, setCheckedList] = useState([]);
    const [infoSelect, setInfoSelect] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [footerSelectLists, setFooterSelectLists] = useState([]);
    const [indeterminate, setIndeterminate] = useState(true);
    const [registerIdNow, setRegisterIdNow] = useState('');
    const [resizeNumber, setResizeNumber] = useState(500);
    const [offsetCurrent, setOffsetCurrent] = useState(0);
    const [treeCheckedKeys, setTreeCheckedKeys] = useState([]); // 最右侧树选中
    const [checkedNodes, setCheckedNodes] = useState([]); // 最右侧树选中选项

    const {
        sysList,
        treeData,
        expandedKeys,
        currentNode,
        orgCurrentNode,
        orgExpandedKeys,
        orgList,
        userList,
        rightExpandedKeys,
        rightOrgList,
        roleList,
        userAllList,
        roleAllList,
        getSearchUserList,
    } = managementUnitSpace;

    const [checkList, setCheckList] = useState([]);
    useEffect(() => {
        // setTimeout(()=>{
        const documentGet = document.getElementById('dom_container_cma_resize');
        let offsetWidth;
        if (documentGet) {
            offsetWidth = documentGet.offsetWidth - Math.floor(documentGet.offsetWidth / 5);
        }
        // else {
        //   offsetWidth = documentGet?.offsetWidth - 534;
        // }
        setOffsetCurrent(Math.floor(documentGet.offsetWidth / 5));
        setResizeNumber(offsetWidth);
        // },10)
    }, []);
    const onResize = useCallback(() => {
        const documentGet = document.getElementById('dom_container_cma');
        let offsetWidth;
        if (documentGet) {
            offsetWidth = documentGet.offsetWidth - 234;
        }
        // else {
        //   offsetWidth = documentGet?.offsetWidth - 534;
        // }

        setResizeNumber(offsetWidth);
    });
    useEffect(() => {
        getSysList();
        getOrgTreeData();
        // window.addEventListener('resize', onResize);
        // return () => {
        //   window.removeEventListener('resize', onResize);
        // };
    }, []);
    useEffect(() => {
        const sys = sysList && sysList.length > 0 && sysList[1].id;
        if (sys) {
            // 获取左侧系统列表
            getRegisterList(sys);
        }
    }, [sysList]);
    // 获取中间部分列表数据
    const getCenterListData = (orgId, searchWord) => {
        if (tabSelect == 1) {
            dispatch({
                type: 'managementUnitSpace/getUserRoleList',
                payload: {
                    orgId,
                    deptId: orgId,
                    searchWord: searchWord,
                    limit: 10000,
                    start: 1,
                    type: '',
                },
            });
        } else {
            dispatch({
                type: 'managementUnitSpace/getUserList',
                payload: {
                    start: 1,
                    limit: 10000,
                    orgId,
                    searchWord,
                    roleType: 'ORGROLE',
                    orgCode: selectTreeData && selectTreeData.node && selectTreeData.node.orgCode,
                },
            });
        }
    };

    // 获取系统列表
    const getSysList = () => {
        dispatch({
            type: 'managementUnitSpace/getRegisterList',
            payload: {
                start: 1,
                limit: 100,
            },
        });
    };
    // 获取组织机构树
    const getOrgTreeData = () => {
        dispatch({
            type: 'managementUnitSpace/getOrgTree',
            payload: {
                nodeId: orgCurrentNode.nodeId,
                nodeType: 'ORG',
                start: 1,
                limit: 200,
            },
        });
        dispatch({
            type: 'managementUnitSpace/updateStates',
            payload: {
                rightExpandedKeys: [],
                orgExpandedKeys: [],
            },
        });
    };
    // 注册
    const getRegisterList = (registerId) => {
        setRegisterIdNow(registerId);
        dispatch({
            type: 'managementUnitSpace/getMenusList',
            payload: {
                registerId,
            },
        });
    };
    // 注册系统选择
    const selectChange = (value) => {
        getRegisterList(value);
    };
    // tab选中
    const onTabsChange = (value) => {
        setTabSelect(value);
        // 重置
        setSelectedKeys(['']);
        setCheckList([]);
        setFooterSelectLists([]);
        setCheckAll(false);
        checkedArrTarget = [];
        // dispatch({
        //   type: 'managementUnitSpace/updateStates',
        //   payload: {
        //     userList: [],
        //   },
        // });
    };
    // check选中
    const onCheckKeys = (checks, e) => {
        setCheckKeys(checks);
        const checkNodes =
            e.checkedNodes &&
            e.checkedNodes.length > 0 &&
            e.checkedNodes.map((item) => {
                return {
                    menuId: item.id,
                    menuName: item.menuName,
                };
            });
        setCheckedList(checkNodes);
    };
    // 中间树选中
    const onSelect = (selectedKeys, info) => {
        // console.log('info==00code', info);
        if (info.selected) {
            setSelectedKeys(selectedKeys);
            setSelectTreeData(info);
            getCenterListData(selectedKeys[0], '');
            checkedArrTarget = [];
            setFooterSelectLists([]);
            setCheckList([]);
        }
    };
    // 中间树扩张
    const onExpand = (expandedKeys, { expanded, node }) => {
        dispatch({
            type: 'managementUnitSpace/getExpandTreeList',
            payload: {
                nodeId: node.nodeId,
                nodeType: 'DEPT',
                start: 1,
                limit: 200,
            },
        });
        dispatch({
            type: 'managementUnitSpace/updateStates',
            payload: {
                orgExpandedKeys: expandedKeys,
            },
        });
    };
    // 中间树搜索
    const onSearchWord = (value) => {
        checkedArrTarget = [];
        if (value) {
            dispatch({
                type: 'managementUnitSpace/getSearchTree',
                payload: {
                    start: 1,
                    limit: 100,
                    searchWord: value,
                    type: 'DEPT',
                },
            });
        } else {
            getOrgTreeData();
        }
    };
    // 左侧树搜索
    const onSearchSys = (value) => {
        dispatch({
            type: 'managementUnitSpace/getMenusList',
            payload: {
                registerId: registerIdNow,
                searchWord: value,
            },
        });
    };
    // 搜索姓名账号
    const onSearchAccount = (value) => {
        getCenterListData(selectedKeys[0], value);
    };
    // 全选
    const onCheckAllChange = (e) => {
        if (selectedKeys.length == 0) {
            message.error('请选择组织机构');
            return;
        }
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        if (e.target.checked) {
            const options_list =
                userList &&
                userList.length > 0 &&
                userList.map((item) => {
                    return item.id;
                });
            const options_role =
                roleList &&
                roleList.length > 0 &&
                roleList.map((item) => {
                    return item.id;
                });
            if (tabSelect == 1) {
                setCheckList(options_list);
            } else {
                setCheckList(options_role);
            }
            // roleList
            const check_select =
                userList &&
                userList.length > 0 &&
                userList.map((item) => {
                    return {
                        id: item.id,
                        deptName: item.deptName,
                        identityId: item.identityId,
                        userName: item.userName,
                        userId: item.userId,
                        orgName: item.orgName,
                    };
                });

            if (tabSelect == 1) {
                setFooterSelectLists(check_select);
            } else {
                const check_role =
                    roleList &&
                    roleList.length > 0 &&
                    roleList.map((item) => {
                        return {
                            id: item.id,
                            roleName: item.roleName,
                        };
                    });
                setFooterSelectLists(check_role);
            }
        } else {
            setCheckList([]);
            setFooterSelectLists([]);
        }
    };
    // checkbox 选择  组织结构TODO左侧树选中还得清下
    const checkboxChange = (checkedValue) => {
        setCheckList(checkedArrTarget);
        const arr = getSearchUserList
            .map((item) => {
                if (checkedArrTarget.includes(item.id)) {
                    return {
                        id: item.id,
                        deptName: item.deptName,
                        identityId: item.identityId,
                        orgName: item.orgName,
                        userId: item.userId,
                        userName: item.userName,
                    };
                }
            })
            .filter((item) => item != undefined);
        const role_arr =
            roleAllList &&
            roleAllList.length > 0 &&
            roleAllList
                .map((item) => {
                    if (checkedArrTarget.includes(item.id)) {
                        return {
                            id: item.id,
                            roleName: item.roleName,
                        };
                    }
                })
                .filter((item) => item != undefined);
        if (tabSelect == 1) {
            console.log('arr==0', arr);
            setFooterSelectLists(arr);
        } else {
            setFooterSelectLists(role_arr);
        }
    };
    // 系统扩展
    const onExpandSys = (expandedKeys, { expanded, node }) => {
        dispatch({
            type: 'managementUnitSpace/updateStates',
            payload: {
                expandedKeys,
            },
        });
    };
    // 清空选项框
    const clearAllCheck = () => {
        setFooterSelectLists([]);
        setCheckList([]);
        setCheckAll(false);
    };
    // 操作
    const deleteAction = (record, text, index) => {
        footerSelectLists.splice(index, 1);
        setFooterSelectLists([...footerSelectLists]);
        const lst = checkList.filter((item) => item != record.id);
        setCheckList([...lst]);
    };
    // 查询右侧
    const onSearch = (value) => {
        if (value) {
            dispatch({
                type: 'managementUnitSpace/getSearchTree',
                payload: {
                    start: 1,
                    limit: 100,
                    searchWord: value,
                    type: 'ORG',
                    isRight: true,
                },
            });
        } else {
            getOrgTreeData();
        }
    };
    // 右侧扩展
    const onExpandRight = (expandedKeys, { expanded, node }) => {
        dispatch({
            type: 'managementUnitSpace/getExpandTreeList',
            payload: {
                nodeId: node.nodeId,
                nodeType: 'ORG',
                start: 1,
                limit: 200,
            },
        });
        dispatch({
            type: 'managementUnitSpace/updateStates',
            payload: {
                rightExpandedKeys: expandedKeys,
            },
        });
    };
    // 搜索查询最右侧
    const onSelectRight = (selects, info) => {
        if (info.selected) {
            setRightSelectedKeys(selects);
        }
        // console.log('info==00', info);
        const selectInfo = {
            orgId: info.node.id,
            orgCode: info.node.orgCode,
            orgName: info.node.orgName,
            orgKind: info.node.orgKind,
        };
        setInfoSelect([{ ...selectInfo }]);
    };
    // 右侧单位树获取
    const onCheck = (checkedKeys, { checkedNodes }) => {
        const checkedInfo = checkedNodes.map((item) => {
            const dataObj = {
                orgId: item.id,
                orgCode: item.orgCode,
                orgName: item.orgName,
                orgKind: item.orgKind,
            };
            return dataObj;
        });
        setTreeCheckedKeys([...checkedKeys.checked]);
        setCheckedNodes([...checkedInfo]);
    };
    // 监听单独 checked
    const checkItemBox = (e) => {
        if (e.target.checked) {
            checkedArrTarget.push(e.target.value);
        } else {
            checkedArrTarget = checkedArrTarget.filter((item) => item != e.target.value);
        }
    };
    // 保存
    const onClickSave = () => {
        // 最左侧选中
        if (checkKeys.length == 0) {
            message.error('请选择左侧系统单位列表');
            return;
        }
        if (footerSelectLists.length == 0) {
            message.error('请选择待选择用户/角色列表');
            return;
        }
        if (checkedNodes.length == 0) {
            message.error('请选择右侧单位');
            return;
        }
        const checkItList = checkedList.map((item) => {
            return {
                ...item,
                orgList: checkedNodes,
            };
        });
        const registerName = sysList.filter((item) => item.id == registerIdNow);
        if (tabSelect == 1) {
            const userList = footerSelectLists.map((item) => {
                return {
                    userId: item.userId,
                    identityId: item.identityId,
                    userName: item.userName,
                    menuList: checkItList,
                };
            });
            dispatch({
                type: 'managementUnitSpace/addManageUser',
                payload: JSON.stringify({
                    registerId: registerIdNow,
                    registerName: registerName[0].registerName,
                    manageOrgList: userList,
                    manageType: '2',
                }),
                callback(value) {
                    if (value.code == 200) {
                        message.success('保存成功');
                    }
                },
            });
        } else {
            const roleList = footerSelectLists.map((item) => {
                return {
                    roleName: item.roleName,
                    roleId: item.id,
                    menuList: checkItList,
                    manageType: '1',
                };
            });
            dispatch({
                type: 'managementUnitSpace/addManageUser',
                payload: JSON.stringify({
                    registerId: registerIdNow,
                    registerName: registerName[0].registerName,
                    manageOrgList: roleList,
                    manageType: 1,
                }),
                callback(value) {
                    if (value.code == 200) {
                        message.success('保存成功');
                    }
                },
            });
        }
    };
    const selectConfig = {
        Com: Select,
        Child: Option,
        list: sysList,
        value: 'id',
        label: 'registerName',
        props: {
            onChange: selectChange,
            placeholder: '请选择注册系统',
            defaultValue: '1595768748637241347', // 业务前台，todo
        },
    };
    const tabConfigs = {
        items: configs.tabList,
        onChange: onTabsChange,
        defaultActiveKey: tabSelect,
    };
    const tableProps = {
        rowKey: 'id',
        columns: [
            {
                title: '姓名',
                dataIndex: tabSelect == 1 ? 'userName' : 'roleName',
            },
            {
                title: '所属部门',
                dataIndex: 'deptName',
            },
            {
                title: '所属单位',
                dataIndex: 'orgName',
            },
            {
                title: '操作',
                render(record, text, index) {
                    return (
                        <a>
                            <span onClick={() => deleteAction(record, text, index)}>删除</span>
                        </a>
                    );
                },
            },
        ],
        dataSource: footerSelectLists && footerSelectLists.length > 0 && footerSelectLists,
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };
    console.log('resizeNumber', resizeNumber);
    return (
        <div className={styles.box_container} id="dom_container_cma_resize">
            <div className={styles.content}>
                <ResizeLeftRight
                    vNum={offsetCurrent}
                    level={1}
                    height={'100%'}
                    leftChildren={
                        <div className={styles.left_cont}>
                            <div className={styles.header}>
                                <span>注册系统：</span>
                                <ICommon {...selectConfig} />
                            </div>
                            <div>
                                <Space direction="vertical">
                                    <Input.Search
                                        style={{ width: 180, height: 32 }}
                                        className={styles.search}
                                        placeholder="请输入单位/部门名称"
                                        onSearch={onSearchSys}
                                        allowClear
                                    />
                                    <div className={styles.tree_over}>
                                        <Tree
                                            // height={760}
                                            showIcon={true}
                                            showLine={true}
                                            style={{ marginTop: 8 }}
                                            onExpand={onExpandSys}
                                            onCheck={onCheckKeys}
                                            checkable
                                            expandedKeys={expandedKeys}
                                            treeData={_.cloneDeep(treeData)}
                                        />
                                    </div>
                                </Space>
                            </div>
                        </div>
                    }
                    rightChildren={
                        // <div style={{width: '100%'}}>
                        <ResizeLeftRight
                            // level={2}
                            vNum={Math.floor(resizeNumber / 1.5)}
                            vRigthNumLimit={200}
                            height={'100%'}
                            leftChildren={
                                <div className={styles.content_center}>
                                    <div>
                                        <Tabs {...tabConfigs}></Tabs>
                                    </div>
                                    <Row className={styles.content_box}>
                                        <Col span={12} className={styles.cont_tree}>
                                            <span>组织机构</span>
                                            <div className={styles.cont_tree_org}>
                                                {/* <Space  > */}
                                                <Input.Search
                                                    style={{ width: 180, height: 32 }}
                                                    className={styles.search}
                                                    placeholder="请输入单位/部门名称"
                                                    onSearch={onSearchWord}
                                                    allowClear
                                                />
                                                <div className={styles.tree_it}>
                                                    <Tree
                                                        // height={300}
                                                        showIcon={true}
                                                        showLine={true}
                                                        style={{ marginTop: 8 }}
                                                        onExpand={onExpand}
                                                        onSelect={onSelect}
                                                        expandedKeys={orgExpandedKeys}
                                                        selectedKeys={selectedKeys != false ? selectedKeys : ['']}
                                                        treeData={_.cloneDeep(orgList)}
                                                    />
                                                </div>
                                                {/* </Space> */}
                                            </div>
                                        </Col>
                                        <Col span={12} style={{ height: '100%' }}>
                                            <div className={styles.dept_unit}>
                                                <div>待选择</div>
                                                <Input.Search
                                                    style={{ width: 180, height: 32 }}
                                                    className={styles.search}
                                                    placeholder="姓名/账号"
                                                    onSearch={onSearchAccount}
                                                />
                                                <div className={styles.check_all}>
                                                    <Checkbox
                                                        indeterminate={indeterminate}
                                                        onChange={onCheckAllChange}
                                                        checked={checkAll}
                                                    >
                                                        全选
                                                    </Checkbox>
                                                    <div className={styles.check_item}>
                                                        <Checkbox.Group value={checkList} onChange={checkboxChange}>
                                                            {tabSelect == 1
                                                                ? userList.map((item) => {
                                                                      return (
                                                                          <div key={item.id}>
                                                                              <Checkbox
                                                                                  value={item.id}
                                                                                  onChange={checkItemBox}
                                                                              >
                                                                                  {item.userName}
                                                                                  {item.deptName
                                                                                      ? `(${item.deptName})`
                                                                                      : ''}
                                                                                  {item.isLeavePost == 1
                                                                                      ? '(已离岗)'
                                                                                      : ''}
                                                                              </Checkbox>
                                                                          </div>
                                                                      );
                                                                  })
                                                                : roleList.map((item) => {
                                                                      return (
                                                                          <div key={item.id}>
                                                                              <Checkbox
                                                                                  value={item.id}
                                                                                  onChange={checkItemBox}
                                                                              >
                                                                                  {item.roleName}
                                                                              </Checkbox>
                                                                          </div>
                                                                      );
                                                                  })}
                                                        </Checkbox.Group>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className={styles.footer}>
                                        <div className={styles.footer_box}>
                                            <div className={styles.footer_header}>
                                                <span>已选择</span>
                                                <Button onClick={clearAllCheck}>清空</Button>
                                            </div>
                                            <div className={styles.table_column}>
                                                <ColumnDragTable
                                                    taskType="MONITOR"
                                                    tableLayout="fixed"
                                                    {...tableProps}
                                                    scroll={{ y: 170, x: 'auto' }}
                                                ></ColumnDragTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            rightChildren={
                                <div className={styles.right_cont}>
                                    <Input.Search
                                        style={{ width: 180, height: 32, marginTop: 16 }}
                                        className={styles.search}
                                        placeholder="请输入单位名称"
                                        onSearch={onSearch}
                                        allowClear
                                    />
                                    <div className={styles.tree_it}>
                                        <Tree
                                            checkable
                                            showIcon={true}
                                            showLine={true}
                                            style={{ marginTop: 8 }}
                                            onExpand={onExpandRight}
                                            checkedKeys={treeCheckedKeys}
                                            onSelect={onSelectRight}
                                            onCheck={onCheck}
                                            checkStrictly
                                            expandedKeys={rightExpandedKeys}
                                            selectedKeys={rightSelectedKeys != false ? rightSelectedKeys : ['']}
                                            treeData={_.cloneDeep(rightOrgList)}
                                        />
                                    </div>
                                    <div className={styles.save}>
                                        <Button onClick={onClickSave}>保存</Button>
                                    </div>
                                </div>
                            }
                        ></ResizeLeftRight>
                        // </div>
                    }
                ></ResizeLeftRight>
            </div>
        </div>
    );
};

export default connect(({ managementUnitSpace }) => ({ managementUnitSpace }))(ManageMentUnit);
