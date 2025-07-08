import { Button, Input, message, Modal, Space, Switch, Tree } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import BaseForm from '../../../../components/baseFormMix';
import ColumnDragTable from '../../../../components/columnDragTable';
import IPagination from '../../../../components/iPagination/iPagination';
import ReSizeLeftRight from '../../../../components/resizeLeftRight';
// import ITree from '../../../../components/tree';
import RulesModal from '../rulesModal';
import styles from './index.less';

const ControlSetting = ({ dispatch, rulesModelSpaces }) => {
    // base 普通表单
    const [formRef, setFormRef] = useState({});
    const [selectKeys, setSelectKeys] = useState([]);

    const [showRuleModal, setShowRuleModal] = useState(false);
    const [searchWord, setSearchWord] = useState({});
    const [modalStatus, setModalStatus] = useState('');
    const [selectRowKey, setSelectRowKey] = useState('');
    const [selectTreeName, setSelectTreeName] = useState('');
    const [orgCode, setOrgCode] = useState('');
    const [objCode, setObjCode] = useState('');

    const {
        currentHeight,
        limit,
        start,
        currentPage,
        returnCount,
        payList,
        classifyList,
        fundTypeList,
        warningLevelList,
        rulesAndRangeNameList,
        rulesDefinedNameList,
        rulesAndRangeEqualStatusList,
        rulesAndRangeTextList,
        rulesAndRangeAndList,
        rulesAndRangeTotalList,
        monitorTreeList,
        currentNode,
        expandedKeys,
        treeExpandedKeys,
        treeSearchWord,
    } = rulesModelSpaces;
    const monitor =
        monitorTreeList && monitorTreeList.length > 0 && monitorTreeList[0].nodeId && monitorTreeList[0].nodeId;
    const monitorName = monitorTreeList && monitorTreeList.length > 0 && monitorTreeList[0].nodeName;
    // 树选中
    const [selectedKeys, setSelectedKeys] = useState([]);

    useEffect(() => {
        // getListData('', '', 1, limit);
        // 分类名称
        getBaseCode('JKGZ_FLMC');
        // 资金分类
        getBaseCode('JKGZ_SYZJLX');
        // 预警等级
        getBaseCode('JKGZ_YJDJ');
        //数据范围名称
        getBaseCode('JKGZ_ZFSJZD_ZY');
        // 规则定义名称
        // getBaseCode('JKGZ_ZFSJZD_ZY');

        // 规则定义和数据范围大于等于小于等状态list
        getBaseCode('JKGZ_TJGS');
        // 规则定义和数据范围文本list
        getBaseCode('JKGZ_PDLX');
        // 规则定义和数据范围并且list
        getBaseCode('JKGZ_BLTJ');
        // 数据范围list
        getBaseCode('JKGZ_SJFWTJ');
    }, [limit]);
    useEffect(() => {
        //监控规则树
        getTreeData();
    }, [treeSearchWord]);

    const getListData = (searchWord, deptCode, start, limit) => {
        dispatch({
            type: 'rulesModelSpaces/getMonitorRulesPayList',
            payload: {
                searchWord,
                nccOrgCode: deptCode,
                start,
                limit,
            },
        });
    };
    useEffect(() => {
        dispatch({
            type: 'rulesModelSpaces/updateStates',
            payload: {
                treeSearchWord: '',
                currentNode: {},
            },
        });
    }, []);
    const getTreeData = () => {
        const date = new Date();
        dispatch({
            type: 'rulesModelSpaces/getListTreeData',
            payload: {
                listModelId: '1628690869634748418',
                start: 1,
                limit: 100,
                year: JSON.stringify({
                    columnCode: 'USED_YEAR',
                    value: date.getFullYear(),
                }),
                searchWord: treeSearchWord,
                listModel: '',
            },
        });
    };
    // 获取基础码表配置
    const getBaseCode = (dictTypeId) => {
        dispatch({
            type: 'rulesModelSpaces/getBaseDataCode',
            payload: {
                dictTypeId,
                showType: 'ENABLE',
                isTree: '0',
                searchWord: '',
            },
        });
    };
    /**
     * 设置普通表单的ref
     */
    const getFormRef = (formRef) => {
        setFormRef(formRef);
    };

    /**
     * 普通 回调函数
     */
    const callback = (value, list) => {
        console.log('value', value);
        console.log('list', list);
        getListData(value.searchWord, objCode, start, limit);
        setSearchWord(value.searchWord);
    };

    // 编辑、新增
    const onAddEdit = (status) => {
        if (selectedKeys.length <= 0) {
            message.error('请选择左侧树码表');
            return;
        }
        if (status == 'EDIT') {
            if (!selectRowKey) {
                message.error('请选中单选项');
                return;
            }
            // 调取回显内容
            dispatch({
                type: 'rulesModelSpaces/getRulesModalBack',
                payload: {
                    id: selectRowKey,
                },
            });
        }
        setShowRuleModal(true);
        setModalStatus(status);
    };
    const onCancel = () => {
        setShowRuleModal(false);
    };
    // 页面变化
    const changePage = (nextPage, size) => {
        getListData(searchWord.searchWord, objCode, nextPage, size);
    };
    // 删除
    const onDelete = () => {
        if (selectedKeys.length <= 0) {
            message.error('请选择左侧树码表');
            return;
        }
        if (!selectRowKey) {
            message.error('请选中选项进行删除');
            return;
        }
        Modal.confirm({
            title: '提示',
            content: `确认删除？`,
            okText: '确定',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            onOk: () => {
                dispatch({
                    type: 'rulesModelSpaces/deleteRulesList',
                    payload: {
                        ids: Array.isArray(selectRowKey) ? selectRowKey.join(',') : selectRowKey,
                    },
                    callback() {
                        getListData(searchWord.searchWord, objCode, 1, limit);
                    },
                });
            },
        });
    };
    // 启用禁用
    const onSwitchChange = (record, value) => {
        dispatch({
            type: 'rulesModelSpaces/isEnableRulesItem',
            payload: {
                id: record.id,
                enable: value ? 1 : 0,
            },
        });
    };

    const list = [
        {
            fieldtype: 'input',
            key: 'searchWord',
            placeholder: '规则名称/资金类型/规则',
            required: false, // 校验
            showLabel: false, // 是否显示label
            isSearch: true,
        },
    ];
    const config = {
        list: list,
        getFormRef: getFormRef,
        callback: callback,
        initialValues: {
            searchWord: '',
        },
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectRowKey(selectedRowKeys);
        },
    };
    const tableProps = {
        rowKey: 'id',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: 60,
            },
            {
                title: '状态',
                dataIndex: 'enable',
                width: 120,
                render(text, record) {
                    return (
                        <div>
                            <Switch
                                checkedChildren="启用"
                                unCheckedChildren="停用"
                                defaultChecked={text == 1 ? true : false}
                                onChange={onSwitchChange.bind(this, record)}
                            />
                            {/* <span>{text == 1 ? '启用' : '停用'}</span>; */}
                        </div>
                    );
                },
            },
            {
                title: '使用资金类型',
                dataIndex: 'fundType',
                render(text) {
                    return <span>{text}</span>;
                },
            },
            {
                title: '分类名称',
                dataIndex: 'className',
                render(text) {
                    return <span>{text}</span>;
                },
            },
            {
                title: '规则名称',
                dataIndex: 'ruleName',
            },
            {
                title: '预警等级',
                dataIndex: 'warnLevName',
                render(text) {
                    // return <span>{configList.controlSetting.warningLevel[text]}</span>;
                    return <div>{text}</div>;
                },
            },
            {
                title: '规则',
                dataIndex: 'ruleDesc',
                render(text) {
                    return <span className="_table_font_show">{text}</span>;
                },
            },
        ],
        dataSource:
            payList &&
            payList.length > 0 &&
            payList.map((item, index) => {
                item.number = index + 1;
                return item;
            }),
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };
    // 搜索
    const onSearchWord = (value) => {
        dispatch({
            type: 'rulesModelSpaces/updateStates',
            payload: {
                treeSearchWord: value,
            },
        });
    };
    const onExpand = (expandedKeys, { expanded, node }) => {
        dispatch({
            type: 'rulesModelSpaces/getListModelTreeChildData',
            payload: {
                listModelId: '1628690869634748418',
                nodeId: node.nodeId,
                listModel: '',
            },
        });
        dispatch({
            type: 'rulesModelSpaces/updateStates',
            payload: {
                treeExpandedKeys: expandedKeys,
            },
        });
    };
    const onSelect = (selectedKeys, { selected, selectedNodes, node }) => {
        console.log(selectedKeys, '------>selectedKeys');
        if (selected) {
            setSelectedKeys(selectedKeys);
            let { ORG_CODE, OBJ_CODE, OBJ_NAME } = JSON.parse(node.json || '{}');
            setSelectTreeName(OBJ_NAME);
            setOrgCode(ORG_CODE);
            setObjCode(OBJ_CODE);
            console.log(ORG_CODE, '------>ORG_CODE', 111);
            console.log(OBJ_CODE, '------>ORG_CODE', 222);
            getListData(searchWord, OBJ_CODE, 1, limit);
        }
    };
    return (
        <div className={styles.container} id="dom_container_cma">
            <ReSizeLeftRight
                leftChildren={
                    <div className={styles.leftContent}>
                        <Space direction="vertical">
                            <Input.Search
                                style={{ width: 180, height: 32 }}
                                className={styles.search}
                                placeholder="请输入搜索词"
                                onSearch={onSearchWord}
                                allowClear
                            />
                            <Tree
                                height={500}
                                showIcon={true}
                                style={{ marginTop: 0 }}
                                // showLine={{ showLeafIcon: false }}
                                onExpand={onExpand}
                                onSelect={onSelect}
                                expandedKeys={treeExpandedKeys}
                                selectedKeys={selectedKeys != false ? selectedKeys : ['']}
                                treeData={_.cloneDeep(monitorTreeList)}
                            />
                        </Space>
                    </div>
                }
                rightChildren={
                    <div>
                        <div className="_padding_top_8" id="list_head_cma">
                            <div className={styles.header}>
                                <BaseForm inline={true} {...config} />
                                <div className={styles.buttonGroup}>
                                    <Button onClick={() => onAddEdit('ADD')}>新增</Button>
                                    <Button className="_margin_left_8" onClick={() => onAddEdit('EDIT')}>
                                        修改
                                    </Button>
                                    <Button className="_margin_left_8" onClick={onDelete}>
                                        删除
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="_padding_top_8">
                                <ColumnDragTable
                                    rowSelection={{
                                        type: 'radio',
                                        ...rowSelection,
                                    }}
                                    onRow={(record) => {
                                        return {
                                            onClick: () => {
                                                console.log(record, 'record');
                                            },
                                        };
                                    }}
                                    modulesName="rulesModelSpaces"
                                    taskType="MONITOR"
                                    tableLayout="auto"
                                    {...tableProps}
                                    className={styles.table}
                                    scroll={{
                                        y: payList.length > 0 ? currentHeight : null,
                                        x: payList.length > 0 ? '1200px' : 'auto',
                                    }}
                                />
                            </div>
                            <IPagination
                                current={Number(currentPage)}
                                total={Number(returnCount)}
                                onChange={changePage}
                                pageSize={limit}
                                isRefresh={true}
                                refreshDataFn={() => {
                                    // 第二个参数是树列表选中
                                    getListData(searchWord, objCode, currentPage, limit);
                                }}
                            />
                        </div>
                    </div>
                }
            ></ReSizeLeftRight>
            {showRuleModal && (
                <RulesModal
                    classifyList={classifyList}
                    fundTypeList={fundTypeList}
                    warningLevelList={warningLevelList}
                    rulesAndRangeNameList={rulesAndRangeNameList}
                    rulesAndRangeEqualStatusList={rulesAndRangeEqualStatusList}
                    rulesAndRangeTextList={rulesAndRangeTextList}
                    rulesAndRangeAndList={rulesAndRangeAndList}
                    rulesAndRangeTotalList={rulesAndRangeTotalList}
                    rulesDefinedNameList={rulesDefinedNameList}
                    modalStatus={modalStatus}
                    selectRowKey={selectRowKey}
                    onCancel={onCancel}
                    selectedKeys={selectedKeys}
                    monitorName={selectTreeName}
                    searchWord={searchWord}
                    getListData={getListData}
                    orgCode={orgCode}
                    objCode={objCode}
                ></RulesModal>
            )}
        </div>
    );
};

export default connect(({ rulesModelSpaces }) => ({
    rulesModelSpaces,
}))(ControlSetting);
