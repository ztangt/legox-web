import { Button, DatePicker, Form, Input, Select } from 'antd';
import _ from 'loadsh';
import { useCallback, useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import high_search_img from '../../public/assets/high_search.svg';
import ColumnDragTable from '../columnDragTable';
import GlobalModal from '../GlobalModal';
import IPagination from '../iPagination/iPagination';
import styles from './index.less';

//containerId 为容器id必传
function TableModal({ tableModalParams, setIsTableModal, formModelingName, containerId }) {
    // const listId = history.location.query.listId;
    // const bizSolId = history.location.query.bizSolId;
    let { listId = '', bizSolId = '' } = history.location?.query || {};
    formModelingName = formModelingName ? formModelingName : `formModeling${bizSolId}${listId}`;

    const [form] = Form.useForm();
    const [pageSize, setPageSize] = useState(10); //默认请求10条
    const [searchDataSource, setSearchDataSource] = useState({});
    const [dataSource, setDataSource] = useState({});
    const [params, setParams] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState(tableModalParams?.selectedRowKeys || []);
    // console.log(tableModalParams.selectedRowKeys, '---->sssss');

    // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState(tableModalParams?.selectedRows || []);
    // const [selectedRows, setSelectedRows] = useState([]);
    const [isShowHighSearch, setIsShowHighSearch] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]); //展开节点
    const { getDataSource, advancedSearch, tabelProps, onOk, highAdvancedSearch, onExpand, headerButtons } =
        tableModalParams;
    let rowKey = tabelProps?.rowKey || 'ID';
    const fetchOptions = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
        },
    };
    //高级搜索
    const getSearchFields = (advancedSearch) => {
        return (
            <>
                {advancedSearch?.map((item, index) => {
                    return (
                        <Form.Item key={`${item.name}${index}`} name={item.searchParam} label={item.name}>
                            {advancedSearchRender(item, index)}
                        </Form.Item>
                    );
                })}
            </>
        );
    };
    const advancedSearchRender = (info, index) => {
        let strIndex = index.toString();
        switch (info.searchType) {
            case 'input':
                return <Input style={{ width: '200px' }} />;
            case 'select':
                return (
                    <Select
                        options={searchDataSource?.[strIndex] || []}
                        style={{ width: '200px' }}
                        fieldNames={info.fieldNames}
                        defaultValue={info.defaultValue}
                    />
                );
            case 'date':
                return <DatePicker format={info.format} showTime={info.showTime} style={{ width: '200px' }} />;
            default:
                return null;
        }
    };
    const [height, setHeight] = useState(
        formModelingName && document.getElementById(formModelingName)
            ? document.getElementById(formModelingName).offsetHeight * 0.8 - 87
            : 'calc(100vh - 200px)',
    );
    const onResize = useCallback(() => {
        formModelingName &&
            document.getElementById(formModelingName) &&
            setHeight(Number(document.getElementById(formModelingName)?.offsetHeight * 0.8 - 87));
    }, []);

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);
    useEffect(() => {
        // setExpandedRowKeys([])
        //setDataSource([])
        //setExpandedRowKeys([])
        if (getDataSource) {
            getDataSource?.(1, 10, {}, setDataSource);
        }
        // if (field.value) {
        //   selectedRowsFn()
        // }
    }, []); //应为一开始打开获取不到getDataSource
    //获取搜索的数据源
    useEffect(() => {
        advancedSearch?.map((item, index) => {
            if (item.searchType == 'select') {
                if (item.url) {
                    fetch(`${window.localStorage.getItem('env')}/${item.url}`, fetchOptions).then((response) => {
                        response.json().then((returnData) => {
                            let data = returnData.data.list;
                            searchDataSource[index.toString()] = data;
                            setSearchDataSource(searchDataSource);
                        });
                    });
                } else {
                    searchDataSource[index.toString()] = item.option;
                    setSearchDataSource(searchDataSource);
                }
            }
        });
        return () => {
            //清空
            setDataSource({});
            setSelectedRows([]);
            setSelectedRowKeys([]);
            setParams({});
        };
    }, []);
    //分页
    const changePage = (nextPage, size) => {
        setPageSize(size);
        getDataSource?.(nextPage, size, params, setDataSource);
    };
    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onSelect: (record, selected) => {
            if (selected) {
                //选中
                if (tableModalParams?.selectionType == 'radio') {
                    setSelectedRowKeys([record[rowKey]]);
                    setSelectedRows([{ ...record }]);
                } else {
                    //分页也要获得当前的
                    selectedRowKeys.push(record[rowKey]);
                    setSelectedRowKeys(_.cloneDeep(selectedRowKeys));
                    let tmpSelectedRows = _.cloneDeep(selectedRows);
                    tmpSelectedRows.push(record);
                    setSelectedRows(tmpSelectedRows);
                }
            } else {
                //反选
                let tmpSelectedRowKeys = selectedRowKeys.filter((i) => i != record[rowKey]);
                let tmpSelectedRows = selectedRows.filter((item) => item[rowKey] != record[rowKey]);
                setSelectedRowKeys(tmpSelectedRowKeys);
                setSelectedRows(tmpSelectedRows);
            }
        },
        onSelectAll: (selected, tmpSelectedRows, changeRows) => {
            if (selected) {
                //将当前页的数据全部写入
                changeRows.map((item) => {
                    selectedRowKeys.push(item[rowKey]);
                });
                setSelectedRowKeys(_.cloneDeep(selectedRowKeys));
                let tmpRows = selectedRows.concat(changeRows);
                setSelectedRows(tmpRows);
            } else {
                let tmpRows = [];
                let tmpKeys = [];
                selectedRows.map((item) => {
                    let isCancleRows = changeRows.filter((changeItem) => changeItem[rowKey] == item[rowKey]);
                    if (!isCancleRows.length) {
                        tmpKeys.push(item[rowKey]);
                        tmpRows.push(item);
                    }
                });
                setSelectedRowKeys(tmpKeys);
                setSelectedRows(tmpRows);
            }
        },
        getCheckboxProps: (record) => ({
            //disabled: props.checkStrictly && record.isParent == 1,
        }),
    };
    //计算搜索的高度
    const [searchHeight, setSearchHeight] = useState(0);
    const searchRef = useRef(null);
    const measuredRef = useCallback(
        (node) => {
            //let node = searchRef.current;
            if (node !== null) {
                setSearchHeight(node.getBoundingClientRect().height);
            }
        },
        [isShowHighSearch],
    );
    useEffect(() => {
        window.addEventListener('resize', () => {
            measuredRef(document.getElementById('search'));
        });
        return () => {
            window.removeEventListener('resize', () => {
                document.getElementById('search');
            });
        };
    }, []);
    //搜索
    const searchFn = () => {
        let highValues = {};
        if (isShowHighSearch) {
            highValues = formHigh.getFieldsValue(true);
        }
        let values = { ...form.getFieldsValue(true), ...highValues };
        //清空展开
        setExpandedRowKeys([]);
        //advancedSearchUrl
        //拼接参数
        let params = {};
        Object.keys(values).map((key) => {
            params[key] = values[key];
        });
        setParams(params);
        //开始搜索
        getDataSource(1, 10, params, setDataSource);
    };
    const searchRender = () => {
        return (
            <div className={styles.search} ref={measuredRef} id="search">
                <div className={styles.convention}>
                    <div className={`${styles.left}`}>
                        <Form form={form} colon={false} layout="inline">
                            {getSearchFields(advancedSearch)}
                            {advancedSearch ? (
                                <img
                                    className={'mb8'}
                                    src={high_search_img}
                                    style={{ marginLeft: '-8px' }}
                                    onClick={searchFn.bind(this)}
                                />
                            ) : null}
                            {highAdvancedSearch && (
                                <>
                                    <span
                                        className={styles.high_level}
                                        onClick={() => {
                                            setIsShowHighSearch(!isShowHighSearch);
                                        }}
                                    >
                                        高级
                                    </span>
                                    <DoubleRightOutlined
                                        onClick={() => {
                                            setIsShowHighSearch(!isShowHighSearch);
                                        }}
                                        rotate={90}
                                        style={{ fontSize: '8px', marginTop: 12 }}
                                    />
                                </>
                            )}
                        </Form>
                    </div>
                    <div className={styles.right}>
                        {headerButtons?.map((item, index) => {
                            return (
                                <Button
                                    key={`${item.title}${index}`}
                                    type="primary"
                                    onClick={() => {
                                        try {
                                            eval(item.click);
                                        } catch (e) {
                                            console.log('e=', e);
                                        }
                                    }}
                                    title={item.title}
                                >
                                    {item.name}
                                </Button>
                            );
                        })}
                    </div>
                </div>
                {isShowHighSearch && (
                    <div className={styles.high_search}>
                        {highAdvancedSearch && (
                            <>
                                <Form form={formHigh} className={styles.high_form} layout="inline" colon={false}>
                                    {getSearchFields(highAdvancedSearch)}
                                </Form>
                                <div className={styles.f_opration} id="set_opration">
                                    <Button
                                        onClick={() => {
                                            searchFn();
                                        }}
                                    >
                                        查询
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            formHigh.resetFields();
                                            form.resetFields();
                                        }}
                                    >
                                        重置
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            formHigh.resetFields();
                                            setIsShowHighSearch(false);
                                        }}
                                    >
                                        收起
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };
    //树形列表的展开
    //循环数据获取node
    const loopNodeByData = (dataSource, currentKey) => {
        let node = '';
        dataSource.map((item) => {
            if (item[id] == currentKey) {
                node = item;
                return;
            } else if (item.children && item.children.length) {
                loopNodeByData(item.children, currentKey);
            }
        });
        return node;
    };
    //将获取到的数据push到dataSource中
    const loopPushData = (data, childData, targetId) => {
        data &&
            data.map((item) => {
                if (item[rowKey] == targetId) {
                    return (item.children = childData);
                } else if (item.children && item.children.length && item.children[0].key != '1-1') {
                    loopPushData(item.children, childData, targetId);
                }
            });
        return data;
    };
    //isParent包含子节点的时候。增加children
    const loopDataSource = (data) => {
        data &&
            data.map((item, index) => {
                if (item.isParent == 1) {
                    //如果含有子节点增加children
                    item.children = [{ key: '1-1' }];
                }
            });
        return data;
    };
    const onExpandFn = (expanded, record) => {
        const callback = (data) => {
            let newData = loopDataSource(data);
            //将childre写入
            let newDataSource = loopPushData(dataSource.list, newData, record[rowKey]);
            let tmpDataSource = { ...dataSource, list: _.cloneDeep(newDataSource) };
            setDataSource(tmpDataSource);
            if (expanded) {
                const tmp = _.cloneDeep(expandedRowKeys);
                tmp.push(record[rowKey]);
                setExpandedRowKeys(tmp);
            } else {
                //删除本级及下级节点
                let deleteIds = [];
                const loopRecord = (data, deleteIds) => {
                    data &&
                        data.map((item) => {
                            deleteIds.push(item[rowKey]);
                            if (item.children && item.children.length) {
                                deleteIds = loopRecord(item.children, deleteIds);
                            }
                        });
                    return deleteIds;
                };
                deleteIds.push(record[rowKey]);
                deleteIds = loopRecord(record.children, deleteIds);
                const newExpandedRowKeys = expandedRowKeys.filter((i) => !deleteIds.includes(i));
                setExpandedRowKeys(newExpandedRowKeys);
            }
        };
        onExpand?.(expanded, record, callback);
    };

    const onConfirm = () => {
        console.log(selectedRows, '---->selectedRows');
        onOk ? onOk(selectedRows, setIsTableModal) : () => {};
    };
    return (
        <GlobalModal
            open={true}
            title="信息"
            modalSize="lager"
            onOk={onConfirm}
            onCancel={() => {
                setIsTableModal(false);
            }}
            okText="确定"
            cancelText="取消"
            mask={false}
            maskClosable={false}
            getContainer={() => {
                return document.getElementById(containerId) || false;
            }}
        >
            {searchRender()}
            <div style={{ height: `calc(100% - ${searchHeight}px)`, position: 'relative' }}>
                <div style={{ height: 'calc(100% - 52px)', overflow: 'auto' }}>
                    <ColumnDragTable
                        columns={tabelProps?.columns || []}
                        dataSource={_.cloneDeep(dataSource?.list) || []}
                        rowKey={rowKey}
                        rowSelection={{
                            ...rowSelection,
                            checkStrictly: true,
                            hideSelectAll: tableModalParams?.selectionType == 'radio' ? true : false,
                        }}
                        bordered={true}
                        pagination={false}
                        expandable={{ expandedRowKeys, onExpand: onExpandFn.bind(this) }}
                    />
                </div>
                {dataSource?.list?.length ? (
                    <IPagination
                        current={dataSource?.currentPage * 1}
                        total={dataSource?.returnCount * 1}
                        onChange={changePage.bind(this)}
                        pageSize={pageSize * 1}
                        style={{ bottom: '0px' }}
                    />
                ) : (
                    ''
                )}
            </div>
        </GlobalModal>
    );
}

export default TableModal;
