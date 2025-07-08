import { DoubleRightOutlined, DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Checkbox, Col, DatePicker, Dropdown, Form, Input, Menu, message, Row, Select } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import { useResizeObserver } from 'react-use-observer';
import { connect } from 'umi';
import new_img from '../../public/assets/new.svg';
import search_black from '../../public/assets/search_black.svg';
import { SEARCHCOLUMN } from '../../service/constant';
import { ALLTASKSTATUS, BIZSTATUS, TASKSTATUS, TODOBIZSTATUS } from '../../service/constant.js';
import { BASE_WIDTH, ORDER_WIDTH } from '../../util/constant';
import { dataFormat, getMenuId, replaceGTPU, toLine } from '../../util/util';
import ColumnDragTable from '../columnDragTable';
import IPagination from '../iPagination/iPagination.jsx';
import { Button } from '../TLAntd';
import styles from './list.less';
import OneKeyApprove from './oneKeyApprove';
import SetCol from './setCol';
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
function List({
    dispatch,
    loading,
    getListData,
    setParentState,
    stateObj,
    taskType,
    isShowWorkRule,
    rowKey,
    oprationRenderHtml,
    placeholder,
    oprationCol,
    showMakeAction,
    goFormUrlProps,
    defaultColumns,
    extraOprationFn,
    location,
    menuObj,
}) {
    const pathname = location.pathname;
    const uuId = location?.query?.uuId || '';
    const allWorkSearchValue = location.query?.searchValue;
    console.log('stateObj', stateObj);

    const {
        limit,
        returnCount,
        currentPage,
        searchWord,
        list,
        searchColumnCodes,
        paramsJson,
        oldSearchColumnCodes,
        workRules,
        listColumnCodes,
        selectedRowKeys,
        listTitle,
        workRuleId,
        groupCode,
        currentHeight,
        selectedRows,
    } = stateObj;
    const [isShowHighSearch, setIsShowHighSearch] = useState(false); //是否显示高级搜索
    const [form] = Form.useForm();
    const [searchCol, setSearchCol] = useState([]); //弹框里面的数据
    const [defaultSearchCol, setDefaultSearchCol] = useState([]);
    const [searchColSelectKey, setSearchColSelectKey] = useState([]); //弹框里面的选中key
    const [indeterminate, setIndeterminate] = useState(false); //全选
    const [checkAll, setCheckAll] = useState(false);
    const [visiblePop, setVisiblePop] = useState(false);
    const [defalutCols, setDefalutCols] = useState([]); //设置列
    const [defalutColumnCode, setDefalutColumnCode] = useState([]);
    const [colVisiblePop, setColVisiblePop] = useState(false); //设置列的设置弹框
    const [ref, resizeObserverEntry] = useResizeObserver();
    const { height = 0 } = resizeObserverEntry.contentRect || {};
    const [reqFlag, setReqFlag] = useState(false);
    // 待办事项一键审批弹窗
    const [oneKeyApprove, setOneKeyApprove] = useState({ show: false, data: {} });
    console.log('pathname=', pathname);
    console.log(list, 'list------------');
    const [columns, setColumns] = useState([
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: ORDER_WIDTH,
            render: (value, obj, index) => <span onClick={goFormUrl.bind(this, obj)}>{index + 1}</span>,
        },
    ]);
    const goFormUrl = (obj) => {
        //跳转前额外的操作
        extraOprationFn && extraOprationFn(obj);
        //点击“返回”，需要返回到打开这个表单的页面（注：如果打开表单的页面已经被关闭了，就返回首页）
        const search = location.search.includes('?') || !location.search ? location.search : `?${location.search}`;
        dispatch({
            type: 'formShow/updateStatesGlobal',
            payload: {
                urlFrom: location.pathname + search,
            },
        });
        var maxDataruleCodes = JSON.parse(localStorage.getItem('maxDataruleCodes') || '{}');
        var maxDataruleCode = maxDataruleCodes[location.pathname];
        let arr = pathname.split('/');
        if (pathname.includes('waitMatter')) {
            historyPush({
                pathname: `/formShow`,
                query: {
                    bizSolId: obj.bizSolId,
                    bizInfoId: obj.bizInfoId,
                    bizTaskId: obj.bizTaskId,
                    title: obj.bizTitle,
                    id: obj.mainTableId,
                    maxDataruleCode,
                },
            });
        } else {
            if (pathname == '/circulateWork') {
                dispatch({
                    type: `circulateWork/setCirculate`,
                    payload: {
                        bizTaskIds: obj.bizTaskId,
                    },
                    setState: setParentState,
                });
            }
            historyPush({
                pathname: `/formShow`,
                query: {
                    bizSolId: obj.bizSolId,
                    bizInfoId: obj.bizInfoId,
                    title: obj.bizTitle,
                    id: obj.mainTableId,
                    maxDataruleCode,
                },
            });
        }
    };
    useEffect(() => {
        if (!isShowWorkRule && taskType == 'MONITOR' && limit) {
            getListData('', 1, limit, []);
        }
    }, [limit]);
    useEffect(() => {
        debugger;
        if (isShowWorkRule) {
            //事项规则查询
            dispatch({
                type: `work/getWorkRule`,
                callback: (workRules, groupCode, workRuleId) => {
                    setParentState({ workRules, groupCode, workRuleId });
                },
            });
        }
        //  else if (taskType == 'MONITOR') {
        //   getListData('', 1, limit, []);
        // }
        let newSearchCol = [];
        //得倒搜索弹框数据
        SEARCHCOLUMN.map((item) => {
            if (item.type.split(',').filter((i) => i == taskType).length) {
                newSearchCol.push(item);
            }
        });
        console.log('newSearchCol=', newSearchCol);
        setDefaultSearchCol(newSearchCol); //用于搜索恢复
        setSearchCol(newSearchCol);
    }, []);
    console.log('oprationCol=', oprationCol);
    useEffect(() => {
        if (workRuleId && limit) {
            //通过workRuleId获取code
            // const info = Object.keys(menuObj).length && menuObj[location.pathname];
            // const menuId = info&&info.id;
            // const registerId = info&&info.registerId;
            let registerId = localStorage.getItem('registerId');
            let menuId = getMenuId();
            if (registerId && menuId) {
                dispatch({
                    type: 'work/getWorkSearch',
                    payload: {
                        taskType,
                        workRuleId: groupCode == 'R0000' ? '' : workRuleId,
                        menuId,
                        registerId,
                    },
                    callback: (searchColumnCodes, listColumnCodes) => {
                        setParentState({
                            searchColumnCodes: searchColumnCodes,
                            oldSearchColumnCodes: searchColumnCodes,
                            listColumnCodes: listColumnCodes,
                        });
                        setSearchColSelectKey(searchColumnCodes);
                        setIndeterminate(
                            !!searchColumnCodes.length && searchColumnCodes.length < defaultSearchCol.length,
                        );
                        setCheckAll(searchColumnCodes.length === defaultSearchCol.length);
                    },
                });
            }
            if (isShowWorkRule) {
                setParentState({
                    paramsJson: [],
                    searchWork: '',
                });
                if (allWorkSearchValue) {
                    getListData(allWorkSearchValue, 1, limit, [], groupCode == 'R0000' ? '' : workRuleId);
                } else {
                    debugger;
                    getListData(searchWord, 1, limit, [], groupCode == 'R0000' ? '' : workRuleId);
                }
            }
        } else if (taskType == 'CATEGORY' || taskType == 'MONITOR') {
            //个人归档没有事项规则
            dispatch({
                type: 'work/getWorkSearch',
                payload: {
                    taskType,
                    workRuleId: '',
                },
                callback: (searchColumnCodes, listColumnCodes) => {
                    setParentState({
                        searchColumnCodes: searchColumnCodes,
                        oldSearchColumnCodes: searchColumnCodes,
                        listColumnCodes: listColumnCodes,
                    });
                    setSearchColSelectKey(searchColumnCodes);
                    setIndeterminate(!!searchColumnCodes.length && searchColumnCodes.length < defaultSearchCol.length);
                    setCheckAll(searchColumnCodes.length === defaultSearchCol.length);
                },
            });
        }
    }, [workRuleId, limit, menuObj]);
    useEffect(() => {
        if (Object.keys(listTitle).length && limit) {
            let newColumns =
                taskType == 'TODO'
                    ? [
                          {
                              title: '序号',
                              dataIndex: 'index',
                              key: 'index',
                              width: ORDER_WIDTH,
                              align: 'left',
                              fixed: true,
                              render: (value, obj, index) => (
                                  <div onClick={goFormUrl.bind(this, obj)} style={{ minWidth: '80px' }}>
                                      {index + 1}
                                  </div>
                              ),
                          },
                          {
                              title: '预警',
                              dataIndex: 'warning',
                              key: 'warning',
                              width: ORDER_WIDTH,
                              render: (text) => {
                                  return (
                                      <span
                                          className={styles.warnColor}
                                          style={{
                                              background:
                                                  text == 'green'
                                                      ? '#50AC50'
                                                      : text == 'red'
                                                      ? '#FA2C19'
                                                      : text == 'grey'
                                                      ? '#AAAFBD'
                                                      : text == 'yellow'
                                                      ? '#EA9743'
                                                      : '',
                                          }}
                                      ></span>
                                  );
                              },
                          },
                      ]
                    : [
                          {
                              title: '序号',
                              dataIndex: 'index',
                              key: 'index',
                              width: ORDER_WIDTH,
                              align: 'left',
                              fixed: true,
                              render: (value, obj, index) => (
                                  <div onClick={goFormUrl.bind(this, obj)} style={{ minWidth: '80px' }}>
                                      {index + 1}
                                  </div>
                              ),
                          },
                      ];
            Object.keys(listTitle).map((key) => {
                console.log(key, 'key');
                let minWidth = `${listTitle[key].length * 20}px`;
                newColumns.push({
                    title: `${listTitle[key]}`,
                    dataIndex: `${key}`,
                    key: `${key}`,
                    ellipsis: true,
                    width: key == 'bizTitle' ? BASE_WIDTH * 2.5 : key == 'draftOrgName' ? BASE_WIDTH * 1.5 : BASE_WIDTH,
                    render: (text, obj) => {
                        if (key == 'bizTitle') {
                            if (pathname == '/waitMatter') {
                                return (
                                    <div
                                        onClick={
                                            typeof goFormUrlProps != 'undefined'
                                                ? goFormUrlProps.bind(this, obj)
                                                : goFormUrl.bind(this, obj)
                                        }
                                        style={{ minWidth: minWidth, display: 'flex' }}
                                    >
                                        {obj.taskStatus == '0' ? (
                                            <div style={{ color: 'red', marginRight: '2px', display: 'inline-block' }}>
                                                {/* <MyIcon type="iconnew" style={{fontSize:'18px'}}/> */}
                                                <img src={new_img} />
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        <a
                                            title={text}
                                            style={{ display: 'inline-block' }}
                                            className={styles.noticeTitle}
                                        >
                                            {text}
                                        </a>
                                        <div style={{ marginLeft: '2px', display: 'flex' }}>
                                            {showMakeAction(obj.makeAction)}
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <a
                                        onClick={goFormUrl.bind(this, obj)}
                                        title={text}
                                        style={{ minWidth: minWidth }}
                                        className={styles.noticeTitle}
                                    >
                                        {text}
                                    </a>
                                );
                            }
                        } else if (key.includes('Time')) {
                            return (
                                <div style={{ minWidth: minWidth }}>
                                    {text ? dataFormat(text, 'YYYY-MM-DD HH:mm:ss') : ''}
                                </div>
                            );
                        } else if (key == 'bizStatus') {
                            return <div style={{ minWidth: minWidth }}>{BIZSTATUS[text]}</div>;
                        } else if (key == 'doneActName') {
                            if (pathname == '/doneWork' && obj.bizStatus == '4') {
                                return <div style={{ minWidth: minWidth }}>作废</div>;
                            } else {
                                return <div style={{ minWidth: minWidth }}>{text}</div>;
                            }
                        } else if (key == 'taskStatus') {
                            if (pathname == '/waitMatter') {
                                return <div style={{ width: '115px' }}>{TODOBIZSTATUS[text]}</div>;
                            } else if (pathname == '/allWork') {
                                return <div style={{ width: '115px' }}>{ALLTASKSTATUS[text]}</div>;
                            } else {
                                return <div style={{ minWidth: minWidth }}>{TASKSTATUS[text]}</div>;
                            }
                        } else if (key == 'draftOrgName') {
                            debugger;
                            return <div style={{ width: '180px' }}>{text ? replaceGTPU(text) : ''}</div>;
                        } else {
                            return <div style={{ minWidth: minWidth }}>{text ? replaceGTPU(text) : ''}</div>;
                        }
                    },
                });
            });
            if (oprationCol) {
                newColumns.push(oprationCol);
            }
            setColumns(newColumns);
        }
    }, [listTitle, limit]); //表格列发生变化column发生变化
    useEffect(() => {
        if (uuId) {
            console.log('sssss===', uuId);
            getListData(searchWord, currentPage, limit, paramsJson, groupCode == 'R0000' ? '' : workRuleId);
        }
    }, [uuId]);
    //分页
    const changePage = (nextPage, size) => {
        setParentState({
            limit: size,
        });
        getListData(searchWord, nextPage, size, paramsJson, groupCode == 'R0000' ? '' : workRuleId);
    };
    const changeSearchWord = (e) => {
        setParentState({
            searchWord: e.target.value,
        });
    };
    //搜索
    const searchWordFn = (value) => {
        setParentState({
            paramsJson: [],
        });
        getListData(value, 1, limit, [], groupCode == 'R0000' ? '' : workRuleId);
    };
    console.log(taskType, 'taskType-------------');
    //显示业务类型
    // const showSolFn=(visibale)=>{
    //   setIsShowSolModal(visibale);
    // }
    //显示高级搜索的组件
    const componentRender = (code, key, width) => {
        let label = defaultSearchCol.filter((col) => col.key == code && col.type.includes(taskType));
        switch (code) {
            case 'BIZ_TITLE':
            case 'DRAFT_DEPT_NAME':
            case 'SUSER_NAME':
            case 'SUSER_DEPT_NAME':
            case 'RUSER_NAME':
            case 'DRAFT_USER_NAME':
            case 'DRAFT_ORG_NAME':
                // case 'ACT_NAME':
                return (
                    <Col span={width} key={key}>
                        <Form.Item
                            name={code}
                            label={label && label.length ? label[0].title : ''}
                            style={{ marginBottom: '8px', marginLeft: '8px' }}
                            initialValue={''}
                            key={key}
                        >
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                );
            case 'DRAFT_TIME':
            case 'START_TIME':
            case 'END_TIME':
            case 'START_TIME':
                return (
                    <Fragment key={key}>
                        <Col span={width} key={key}>
                            <Form.Item
                                name={`${code}.start`}
                                label={label && label.length ? label[0].title : ''}
                                className={styles.date_item}
                                style={{ marginBottom: '8px', marginLeft: '8px' }}
                                //  style={{marginBottom:'10px'}}
                            >
                                <DatePicker
                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={width} key={key}>
                            <Form.Item
                                noStyle
                                shouldUpdate={(preValues, currentValues) =>
                                    preValues[`${code}_start`] != currentValues[`${code}_start`]
                                }
                            >
                                {({ getFieldValue }) => (
                                    <Form.Item
                                        name={`${code}.end`}
                                        label="到"
                                        className={styles.date_item}
                                        style={{ marginBottom: '8px', marginLeft: '8px' }}
                                    >
                                        <DatePicker
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                )}
                            </Form.Item>
                        </Col>
                    </Fragment>
                );
            case 'BIZ_SOL_NAME':
                return (
                    <Col span={width} key={key}>
                        <Form.Item
                            name={code}
                            label={label && label.length ? label[0].title : ''}
                            // style={{ marginBottom: '10px' }}
                            key={key}
                            style={{ marginBottom: '8px', marginLeft: '8px' }}
                        >
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                );
            case 'TASK_STATUS':
                return (
                    <Col span={width} key={key}>
                        <Form.Item
                            name={code}
                            label={label && label.length ? label[0].title : ''}
                            // style={{ marginBottom: '10px' }}
                            style={{ marginBottom: '8px', marginLeft: '8px' }}
                            initialValue={''}
                            key={key}
                        >
                            {taskType == 'CMATODO' ? (
                                <Select style={{ width: '100%' }}>
                                    <Option value="">全部</Option>
                                    <Option value="0">未收未办</Option>
                                    <Option value="1">已收未办</Option>
                                    <Option value="2">已收已办</Option>
                                </Select>
                            ) : taskType == 'ALL' ? (
                                <Select style={{ width: '100%' }}>
                                    <Option value="">全部</Option>
                                    <Option value="0">待办事项</Option>
                                    <Option value="1">已发事项</Option>
                                    <Option value="2">已办事项</Option>
                                </Select>
                            ) : taskType == 'CIRCULATE' ? (
                                <Select style={{ width: '100%' }}>
                                    <Option value="">全部</Option>
                                    <Option value="0">未阅</Option>
                                    <Option value="2">已阅</Option>
                                </Select>
                            ) : (
                                <Select style={{ width: '100%' }}>
                                    <Option value="">全部</Option>
                                    <Option value="0">待发</Option>
                                    <Option value="1">在办</Option>
                                    <Option value="2">办结</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                );
            case 'BIZ_STATUS':
                return (
                    <Col span={width} key={key}>
                        <Form.Item
                            name={code}
                            label={label && label.length ? label[0].title : ''}
                            initialValue={''}
                            key={key}
                            // style={{ marginBottom: '10px' }}
                            style={{ marginBottom: '8px', marginLeft: '8px' }}
                        >
                            {taskType == 'MONITOR' ? (
                                <Select style={{ width: '100%' }}>
                                    <Option value="">全部</Option>
                                    <Option value="1">在办</Option>
                                    <Option value="2">办结</Option>
                                    <Option value="3">挂起</Option>
                                </Select>
                            ) : (
                                <Select style={{ width: '100%' }}>
                                    <Option value="">全部</Option>
                                    <Option value="1">在办</Option>
                                    <Option value="2">办结</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                );
            default:
                break;
        }
    };
    //获取高级搜索的html
    const getSearchFields = (width = 8) => {
        const children = [];
        searchColumnCodes.map((item, key) => {
            // let spanNum = 8;
            // if(item=='DRAFT_TIME'||item=='START_TIME'||item=='END_TIME'||item=='START_TIME'){
            //   spanNum=12
            // }
            children.push(<Fragment key={key}>{componentRender(item, key, width)}</Fragment>);
        });
        console.log('children=', children);
        return children;
    };
    //搜索
    const onFinishSearch = (values) => {
        console.log('values=', values);
        let paramsJson = [];
        Object.keys(values).map((item) => {
            console.log('item=', item);
            if (typeof values[item] != 'undefined' && values[item]) {
                let codes = item.split('.');
                console.log('codes=', codes);
                let code = codes[0];
                if (code == 'DRAFT_TIME' || code == 'START_TIME' || code == 'END_TIME' || code == 'START_TIME') {
                    //时间控件
                    paramsJson.push({
                        columnCode: code,
                        isLike: 0,
                        beginTime: '',
                        endTime: '',
                        columnValue: '',
                    });
                    if (codes[1] == 'start') {
                        //开始时间
                        paramsJson.map((param) => (param.beginTime = values[item] ? values[item].unix() : ''));
                    }
                    if (codes[1] == 'end') {
                        //开始时间
                        paramsJson.map((param) => (param.endTime = values[item] ? values[item].unix() : ''));
                    }
                } else if (
                    code == 'DRAFT_DEPT_NAME' ||
                    code == 'SUSER_NAME' ||
                    code == 'SUSER_DEPT_NAME' ||
                    code == 'RUSER_NAME' ||
                    code == 'BIZ_TITLE' ||
                    code == 'DRAFT_USER_NAME' ||
                    code == 'BIZ_SOL_NAME' ||
                    code == 'ACT_NAME'
                ) {
                    paramsJson.push({
                        columnCode: code,
                        isLike: 1,
                        columnValue: values[item],
                        beginTime: '',
                        endTime: '',
                    });
                } else {
                    paramsJson.push({
                        columnCode: code,
                        isLike: 0,
                        columnValue: values[item],
                        beginTime: '',
                        endTime: '',
                    });
                }
            }
        });
        setParentState({
            paramsJson: paramsJson,
            searchWord: '',
        });
        getListData('', 1, limit, paramsJson, groupCode == 'R0000' ? '' : workRuleId);
    };
    //弹框搜索列
    const searchColFn = (e) => {
        if (e.target.value) {
            let newSearchCol = [];
            defaultSearchCol.map((item) => {
                if (item.title.includes(e.target.value)) {
                    newSearchCol.push(item);
                }
            });
            setSearchCol(newSearchCol);
        } else {
            setSearchCol(defaultSearchCol);
        }
    };
    //选中
    const onChangeCheck = (list) => {
        console.log('list=', list);
        setSearchColSelectKey(list);
        setIndeterminate(!!list.length && list.length < searchCol.length);
        setCheckAll(list.length === searchCol.length);
    };
    //全选
    const onCheckAllChange = (e) => {
        let searchColSelectKey = [];
        searchCol.map((item) => {
            if (item.type.includes(taskType)) {
                searchColSelectKey.push(item.key);
            }
        });
        setSearchColSelectKey(e.target.checked ? searchColSelectKey : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };
    //高级查询-自定义查询条件设置
    const saveSearchCol = () => {
        //进行排序
        let newSearchColSelectKey = [];
        searchCol.map((item) => {
            if (searchColSelectKey.includes(item.key)) {
                newSearchColSelectKey.push(item.key);
            }
        });
        dispatch({
            type: 'work/saveSearchCol',
            payload: {
                taskType,
                workRuleId: groupCode == 'R0000' ? '' : workRuleId,
                searchColumnCodes: newSearchColSelectKey.join(','),
            },
            callback: () => {
                setParentState({
                    searchColumnCodes: newSearchColSelectKey,
                    oldSearchColumnCodes: newSearchColSelectKey,
                });
                setVisiblePop(false);
            },
        });
    };
    //显示搜索列的全部
    const allSearchFileld = () => {
        return (
            <div className={styles.search_col_pop}>
                {/* <Search onChange={searchColFn} className={styles.p_search}/>
        <br/> */}
                <Checkbox onChange={onCheckAllChange} indeterminate={indeterminate} checked={checkAll}>
                    全选
                </Checkbox>
                <Checkbox.Group
                    style={{ width: '100%' }}
                    value={searchColSelectKey}
                    className={styles.col_check}
                    onChange={onChangeCheck}
                >
                    {searchCol
                        .filter((item, index) => item.key !== 'ACT_NAME')
                        .map((item, index) => {
                            if (item.type.includes(taskType)) {
                                return (
                                    <div className={styles.rows}>
                                        <Row key={index} className={styles.ellips}>
                                            <EllipsisOutlined rotate={90} style={{ marginTop: '3px' }} />
                                            <EllipsisOutlined
                                                rotate={90}
                                                style={{ marginTop: '3px', marginLeft: '-8px' }}
                                            />
                                            <Checkbox value={item.key}>{item.title}</Checkbox>
                                        </Row>
                                    </div>
                                );
                            }
                        })}
                </Checkbox.Group>
                <div className={styles.p_opration}>
                    <Button onClick={changeVisiblePop.bind(this, false)}>取消</Button>
                    <Button onClick={saveSearchCol.bind(this)} type="primary">
                        保存
                    </Button>
                </div>
            </div>
        );
    };
    //显示隐藏
    const changeVisiblePop = (visible) => {
        if (visible) {
            setSearchColSelectKey(oldSearchColumnCodes);
            setIndeterminate(!!oldSearchColumnCodes.length && oldSearchColumnCodes.length < defaultSearchCol.length);
            setCheckAll(oldSearchColumnCodes.length === defaultSearchCol.length);
        }
        setVisiblePop(visible);
    };
    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            //setSelectedRowKeys(selectedRowKeys);
            setParentState({
                selectedRowKeys,
                selectedRows,
            });
        },
        getCheckboxProps: (record) => ({
            disabled: taskType == 'ALL' && record.bizStatus != '2',
        }),
    };
    //设为已阅
    const setCirculate = () => {
        if (selectedRowKeys && selectedRowKeys.length) {
            if (selectedRows.every((item) => item.taskStatus == '2')) {
                message.error('当前事项是已阅状态！');
                return;
            }
            dispatch({
                type: `circulateWork/setCirculate`,
                payload: {
                    bizTaskIds: selectedRowKeys.join(','),
                },
                isShowMessge: true,
                setState: setParentState,
            });
        } else {
            message.error('请选择一条事项');
        }
    };

    // 打开一键审批
    const oneKeyApproveOpen = () => {
        console.log(selectedRows, 'selectedRows==');
        if (selectedRows?.length > 0) {
            if (selectedRows.length > 8) {
                return message.error('一键审批最多不能超过8个任务');
            }
            // 截取当前任务前8个，取 bizTaskId
            let data = {
                taskIds: [],
                approveTask: {},
            };
            selectedRows.forEach((item) => {
                data.taskIds.push(item.bizTaskId);
                data.approveTask[item.bizTaskId] = {
                    bizTaskId: item.bizTaskId,
                    bizTitle: item.bizTitle,
                    bizInfoId: item.bizInfoId,
                    bizSolId: item.bizSolId,
                    procDefId: item.procDefId,
                    formDeployId: item.formDeployId,
                    mainTableId: item.mainTableId,
                };
            });
            setOneKeyApprove({ show: true, data });
        } else {
            return message.error('请选择要审批的单据');
        }
    };

    // 关闭一键审批弹窗
    const oneKeyApproveClose = (isReload) => {
        if (isReload) {
            //console.log('oneKeyApproveClose', stateObj);
            //刷新列表
            getListData(searchWord, currentPage, limit, paramsJson, groupCode == 'R0000' ? '' : workRuleId);
        }
        setOneKeyApprove({ show: false, data: {} });
    };

    const changeColVisiblePop = () => {
        let value = colVisiblePop ? false : true;
        if (value) {
            //选中的排在最前面
            let newCols = [];
            let columnCode = [];
            if (listColumnCodes.length) {
                columnCode = listColumnCodes;
            } else {
                //没设置之前获取listTitle的值，为选中状态
                Object.keys(listTitle).map((item) => {
                    columnCode.push(toLine(item).toUpperCase());
                });
            }
            //删除掉不符合类型的
            let byTypeCols = [];
            SEARCHCOLUMN.map((item) => {
                let types = item.type.split(',');
                if (types.filter((i) => i == taskType).length) {
                    byTypeCols.push(item);
                }
            });
            columnCode.map((code) => {
                let col = byTypeCols.filter((item) => code == item.key);
                if (col.length) {
                    newCols.push(col[0]);
                }
            });
            //删除掉已经选中的
            byTypeCols.map((item) => {
                if (!columnCode.includes(item.key)) {
                    newCols.push(item);
                }
            });
            setDefalutCols(newCols);
            setDefalutColumnCode(columnCode);
        }
        setColVisiblePop(value);
    };
    //保存设置列
    const saveCols = (colSelectKey) => {
        // const info = menuObj[location.pathname];
        let menuId = getMenuId();
        let registerId = localStorage.getItem('registerId');
        // const menuId = info.id;
        // const registerId = info.registerId;
        dispatch({
            type: 'work/saveSearchCol',
            payload: {
                taskType,
                workRuleId: groupCode == 'R0000' ? '' : workRuleId,
                listColumnCodes: colSelectKey.join(','),
                menuId,
                registerId,
            },
            callback: () => {
                setParentState({
                    listColumnCodes: colSelectKey,
                });
                setColVisiblePop(false);
                //刷新列表
                getListData(searchWord, currentPage, limit, paramsJson, groupCode == 'R0000' ? '' : workRuleId);
            },
        });
    };
    const setWorkRuleIdFn = (workRuleId, groupCode) => {
        setParentState({
            workRuleId: workRuleId,
            groupCode: groupCode,
        });
    };
    const showAdvancedSearch = () => {
        setIsShowHighSearch(true);
        setReqFlag(true);
        if (pathname == '/allWork') {
            setParentState({ buttonPos: true });
        } else if (pathname == '/personWork') {
            setParentState({ isShowButton: true });
        }
    };
    //收起
    const packUp = () => {
        setIsShowHighSearch(false);
        setReqFlag(true);
        if (pathname == '/allWork') {
            setParentState({ buttonPos: false });
        } else if (pathname == '/personWork') {
            setParentState({ isShowButton: false });
        }
    };
    const workRuleMenu = (
        <Menu>
            {isShowWorkRule &&
                workRules.map((item) => {
                    return (
                        <Menu.Item
                            onClick={() => {
                                setWorkRuleIdFn(item.workRuleId, item.groupCode);
                            }}
                            key={item.workRuleId}
                        >
                            <span>{item.groupName}</span>
                        </Menu.Item>
                    );
                })}
        </Menu>
    );
    //calc(100vh- ${340-parseInt(searchColumnCodes/3)*42}px))
    const y_scroll = (searchColumnCodes) => {
        if (isShowHighSearch) {
            let line_num = searchColumnCodes.length / 3;
            console.log('line_num=', line_num);
            let line_height = Math.ceil(line_num) * 42 + 220 + 50;
            if (taskType == 'CIRCULATE' || oprationRenderHtml != '') {
                line_height = line_height + 42; //有操作列减掉操作列的高度
            }
            return `calc(100% - ${line_height}px)`;
        } else {
            let line_height = 320;
            if (taskType == 'CIRCULATE' || oprationRenderHtml != '') {
                line_height = line_height + 42; //有操作列减掉操作列的高度
            }
            return `calc(100% - ${line_height}px)`;
        }
    };
    return (
        <>
            <div className={styles.work_warp} id={`modal_biz_sol_cma_${taskType}`}>
                <div ref={ref} id={`list_head-${taskType}-${location.pathname}`}>
                    {taskType == 'CIRCULATE' && (
                        <div className={isShowHighSearch ? styles.button_right : styles.pos}>
                            <Button type="primary" onClick={setCirculate}>
                                设为已阅
                            </Button>
                        </div>
                    )}
                    {taskType == 'TODO' && (
                        <div className={isShowHighSearch ? styles.button_right : styles.pos}>
                            <Button type="primary" onClick={oneKeyApproveOpen}>
                                一键审批
                            </Button>
                        </div>
                    )}
                    {oprationRenderHtml}
                    {isShowWorkRule && (
                        <div className={styles.work_rule}>
                            <Dropdown overlay={workRuleMenu}>
                                <div onClick={(e) => e.preventDefault()}>
                                    {/* <span>业务</span> */}
                                    <div>
                                        <span className={styles.select_rule}>
                                            {workRuleId && workRules.length
                                                ? workRules.filter((item) => item.workRuleId == workRuleId)[0].groupName
                                                : ''}
                                        </span>
                                        <DownOutlined style={{ fontSize: '12px' }} className={styles.icon_style} />
                                    </div>
                                </div>
                            </Dropdown>
                        </div>
                    )}
                    <div className={styles.search_div} style={{ background: isShowHighSearch ? '#f7f7f7' : '#ffffff' }}>
                        {isShowHighSearch ? (
                            <>
                                <Form
                                    form={form}
                                    name={`advanced_search_${taskType}`}
                                    onFinish={onFinishSearch}
                                    className={styles.form}
                                    layout="inline"
                                    colon={false}
                                >
                                    {getSearchFields()}
                                </Form>
                                <div className={styles.f_opration} id="set_opration">
                                    {/* {taskType != 'MONITOR' ?
                  <Popover
                    content={allSearchFileld()}
                    title=""
                    placement="bottomRight"
                    visible={visiblePop}
                    trigger="click"
                    onVisibleChange={changeVisiblePop.bind(this, visiblePop ? false : true)}
                    getPopupContainer={() => document.getElementById(`modal_biz_sol_cma_${taskType}`)}
                  >
                    <span className={styles.o_set}>
                      <SettingOutlined />
                    </span>
                  </Popover> :
                  null
                } */}
                                    <Button
                                        className={styles.o_search}
                                        onClick={() => {
                                            form.submit();
                                        }}
                                    >
                                        查询
                                    </Button>
                                    <Button
                                        className={styles.o_roll}
                                        onClick={() => {
                                            form.resetFields();
                                        }}
                                    >
                                        重置
                                    </Button>
                                    <Button
                                        className={styles.o_pack}
                                        onClick={() => {
                                            packUp();
                                        }}
                                    >
                                        收起
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Search
                                    onChange={changeSearchWord}
                                    onSearch={searchWordFn}
                                    value={searchWord}
                                    className={styles.search}
                                    placeholder={placeholder}
                                    allowClear
                                    enterButton={
                                        <img
                                            src={search_black}
                                            style={{ marginRight: 8, marginTop: -3, marginLeft: 4 }}
                                        />
                                    }
                                />
                                <span
                                    onClick={() => {
                                        showAdvancedSearch();
                                    }}
                                >
                                    <span className={styles.high_level}>高级</span>
                                    <DoubleRightOutlined rotate={90} style={{ fontSize: '12px', cursor: 'pointer' }} />
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.workTable} style={{ height: `calc(100% - ${height}px - 32px)` }}>
                    {taskType == 'CIRCULATE' ||
                    taskType == 'CATEGORY' ||
                    taskType == 'ALL' ||
                    taskType == 'MONITOR' ||
                    taskType == 'TODO' ? (
                        <ColumnDragTable
                            // listHead={`list_head`}
                            container={`dom_container`}
                            listHead={`list_head-${taskType}-${location.pathname}`}
                            tableLayout="fixed"
                            saveCols={saveCols}
                            taskType={taskType}
                            modulesName={'setState'}
                            setParentState={setParentState}
                            isShowHighSearch={isShowHighSearch}
                            columns={defaultColumns ? defaultColumns : _.cloneDeep(columns)}
                            dataSource={list}
                            pagination={false}
                            key={isShowHighSearch}
                            rowKey={rowKey}
                            className={styles.table}
                            reqFlag={reqFlag}
                            scroll={{ y: currentHeight + 23 }}
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                            }}
                        />
                    ) : (
                        <ColumnDragTable
                            container={`dom_container`}
                            listHead={`list_head-${taskType}-${location.pathname}`}
                            tableLayout="fixed"
                            saveCols={saveCols}
                            taskType={taskType}
                            columns={defaultColumns ? defaultColumns : _.cloneDeep(columns)}
                            dataSource={list}
                            pagination={false}
                            modulesName={'setState'}
                            setParentState={setParentState}
                            key={isShowHighSearch}
                            rowKey={rowKey}
                            isShowHighSearch={isShowHighSearch}
                            reqFlag={reqFlag}
                            scroll={{ y: currentHeight + 23 }}
                            className={styles.table}
                        />
                    )}
                    {taskType != 'CATEGORY' && taskType != 'MONITOR' ? (
                        <SetCol
                            changeColVisiblePop={changeColVisiblePop}
                            taskType={taskType}
                            colVisiblePop={colVisiblePop}
                            saveCols={saveCols}
                            listColumnCodes={listColumnCodes}
                            listTitle={listTitle}
                            defalutCols={defalutCols}
                            defalutColumnCode={defalutColumnCode}
                            id={`modal_biz_sol_cma_${taskType}`}
                            menuObj={menuObj}
                        />
                    ) : null}
                </div>
                <div className={styles.bottom_content}>
                    <IPagination
                        style={{ width: '70%', right: 0 }}
                        current={currentPage}
                        pageSize={limit}
                        onChange={changePage.bind(this)}
                        total={returnCount}
                        isRefresh={true}
                        refreshDataFn={() => {
                            getListData('', 1, limit, paramsJson, groupCode == 'R0000' ? '' : workRuleId);
                        }}
                    />
                    {taskType == 'TODO' && (
                        <div style={{ width: '30%', position: 'absolute', bottom: 16 }} className={styles.warnMessage}>
                            <span>预警提示</span>
                            <span>
                                <i></i>正常
                            </span>
                            <span>
                                <i></i>即将超期
                            </span>
                            <span>
                                <i></i>已超期
                            </span>
                            <span>
                                <i></i>无预警
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {oneKeyApprove.show ? (
                <OneKeyApprove onClose={oneKeyApproveClose} data={oneKeyApprove.data} modalType={'page'} />
            ) : null}
        </>
    );
}
List.propTypes = {
    /**
     * 表单列
     * @type {Array}
     */
    // columns: PropTypes.array.isRequired,
    /**
     * 获取列表数据
     */
    getListData: PropTypes.func.isRequired,
    /**
     * 数据集合
     */
    stateObj: PropTypes.object.isRequired,
    /**
     * 高级搜索的分类
     */
    taskType: PropTypes.string.isRequired,
    /**
     * 是否显示事项规则
     */
    isShowWorkRule: PropTypes.bool,
    /**
     * 表单的key
     */
    rowKey: PropTypes.string,
    /**
     * 批量操作的按钮
     */
    oprationRenderHtml: PropTypes.object,
    /**
     * 提示文案
     */
    placeholder: PropTypes.string,
    /**
     * 跳转前额外的操作
     */
    extraOprationFn: PropTypes.func,
};
List.defaultProps = {
    isShowWorkRule: true,
    rowKey: 'bizTaskId',
    oprationRenderHtml: '',
    placeholder: '',
};
// export default List;
export default connect(({ loading }) => ({ loading }))(List);

// export default connect(({ user, loading }) => { return { user, loading } })(List);
