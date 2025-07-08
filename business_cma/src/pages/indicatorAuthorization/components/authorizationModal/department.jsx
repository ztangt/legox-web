import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Button, message, Modal, Table, Tag } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ReSizeLeftRightCss from '../../../../components/resizeLeftRight';
import configs from '../configs';
import ITree from '../treeUser';
import styles from './index.less';

const DepartmentGroup = ({ dispatch, indicatorNamespace, changeTargetKeys, getParams, isDisabled, id, isUnit }) => {
    const { departTreeData, rightSelectedData, allList, departRightChecked } = indicatorNamespace;
    const [checkedKeysValue, setCheckedKeysValue] = useState([]);
    const [checkedList, setCheckedList] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectListType, setSelectListType] = useState('list');
    //右侧卡片的切换显示
    const changeListLayout = (type) => {
        setSelectListType(type);
    };

    const getList = () => {
        dispatch({
            type: 'indicatorNamespace/getOrgTree',
            payload: {
                parentId: '',
                orgKind: 'ORG_',
                searchWord: '',
            },
        });
    };
    useEffect(() => {
        dispatch({
            type: 'indicatorNamespace/getOrgTree',
            payload: {
                parentId: '',
                orgKind: 'ORG_',
                searchWord: '',
            },
        });
    }, []);
    useEffect(() => {
        if (!isDisabled) {
            const checkArr = allList
                .map((item) => {
                    if (checkedKeysValue.includes(item.id)) {
                        return item;
                    }
                })
                .filter((item) => item != undefined);
            setCheckedList(checkArr);
        }
    }, [checkedKeysValue]);
    const onCheck = (checkedKeys, { checked }) => {
        setCheckedKeysValue([...checkedKeys.checked]);
        changeTargetKeys([...checkedKeys.checked]);
    };
    useEffect(() => {
        if (rightSelectedData.length == 0) {
            return;
        }
        setCheckedKeysValue(rightSelectedData);
        setCheckedList(departRightChecked);
    }, [rightSelectedData, departRightChecked]);
    const getData = (node) => {};
    // 删除列表
    const deleteColumn = (props) => {
        const itemArr = checkedList.filter((item) => item.id != props.id);
        const checkArr = checkedKeysValue.filter((item) => item != props.id);
        setCheckedList(itemArr);
        setCheckedKeysValue(checkArr);
        changeTargetKeys(checkArr);
    };
    // 清空
    const clearAll = () => {
        setCheckedList([]);
        setCheckedKeysValue([]);
        changeTargetKeys(checkedKeysValue);
    };
    const columnsAction = {
        delete: deleteColumn,
        isDisabled,
    };
    const closeTag = (e, info) => {
        e.preventDefault();
        if (isDisabled) {
            deleteAuthor(info);
        } else {
            let id = info.id;
            const itemArr = checkedList.filter((item) => item.id != id);
            const checkArr = checkedKeysValue.filter((item) => item != id);
            setCheckedList(itemArr);
            setCheckedKeysValue(checkArr);
            changeTargetKeys(checkArr);
        }
    };

    //授权的查看里面的删除授权操作
    const deleteAuthor = (info) => {
        Modal.confirm({
            title: '提示',
            content: `确认删除此授权？`,
            okText: '确定',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            onOk: () => {
                dispatch({
                    type: 'indicatorNamespace/deleteAuthorization',
                    payload: {
                        deleteId: info.orgId,
                        searchType: getParams.param1,
                        deleteType: 'ONE',
                        authType: 3, //部门的单个删除传3
                        id,
                    },
                    callback() {
                        message.success('删除授权成功！');
                        deleteColumn(info);
                    },
                });
            },
        });
    };

    let delCol = {
        title: '操作',
        render(record) {
            return (
                <a>
                    <span onClick={() => deleteAuthor(record)}>删除授权</span>
                </a>
            );
        },
    };

    const tableProps = {
        rowKey: 'id',
        columns: isDisabled ? [...configs.departColumns(columnsAction), delCol] : configs.departColumns(columnsAction),
        dataSource: checkedList,
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };
    const leftRender = (checkable, checkedKeys, nodeType, plst, checkStrictly) => {
        return (
            <div className={styles.left_org_tree}>
                <span className={styles.theme}>组织机构</span>
                <div className={styles.content}>
                    <ITree
                        plst={plst}
                        getData={getData}
                        nodeType={nodeType}
                        onEditTree={() => {}}
                        onCheck={onCheck}
                        checkable={checkable}
                        currentNode={{}}
                        checkedKeys={checkedKeysValue}
                        checkStrictly={checkStrictly}
                        isDisabled={isDisabled}
                        style={{}}
                        isDisableCheckbox={true}
                    />
                </div>
            </div>
        );
    };
    return (
        <div className={styles.department} style={{ height: `calc(100% - ${isUnit ? 90 : 48}px)` }}>
            <div className={styles.split_line}></div>
            <ReSizeLeftRightCss
                leftChildren={leftRender(true, [], 'DEPT', '请输入单位/部门名称', true)}
                level={1}
                height={'100%'}
                rightChildren={
                    <div className={styles.right_selected}>
                        <div className={styles.theme}>已选择</div>
                        <div className={styles.right_table}>
                            <div className={styles.opration}>
                                <BarsOutlined
                                    onClick={changeListLayout.bind(this, 'list')}
                                    style={selectListType == 'list' ? { color: '#03A4FF' } : {}}
                                />
                                <AppstoreOutlined
                                    onClick={changeListLayout.bind(this, 'card')}
                                    style={
                                        selectListType == 'card'
                                            ? { color: '#03A4FF', margin: '0 10px' }
                                            : { margin: '0 10px' }
                                    }
                                />
                                <Button disabled={isDisabled} onClick={clearAll.bind(this, '', '')}>
                                    清空
                                </Button>
                            </div>
                            <div>
                                {selectListType == 'card' ? (
                                    <>
                                        {checkedList.map((item, index) => {
                                            return (
                                                <Tag
                                                    closable={true}
                                                    className={styles.tag_info}
                                                    key={index}
                                                    onClose={(e) => closeTag(e, item)}
                                                >
                                                    {item.orgName}
                                                </Tag>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <Table
                                        {...tableProps}
                                        pagination={false}
                                        tableLayout={'auto'}
                                        scroll={{ y: 520 }}
                                    ></Table>
                                )}
                            </div>
                        </div>
                    </div>
                }
            ></ReSizeLeftRightCss>
        </div>
    );
};

export default connect(({ indicatorNamespace }) => ({ indicatorNamespace }))(DepartmentGroup);
