import {
  Modal,
  Table,
  Input,
  TreeSelect,
  Button,
  message,
  Select,
  Form,
  DatePicker,
} from 'antd';
import React, {
  Children,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import ColumnDragTable from '../columnDragTable/index';
import IPagination from '../public/iPagination';
import styles from './index.less';
import { history } from 'umi';
import _ from 'loadsh';
// const advancedSearch= [
//   {
//     "searchParam":'year',
//     "searchType": "select",
//     "url": "sys/dictType/ZJLY?showType=ALL&searchWord=&isTree=1",
//     "name": "年度",
//     "ismultiple": true,
//     "fieldNames":{value:'dictInfoCode',label:'dictInfoName'}
//   },{
//     "searchParam":'name',
//       "searchType": "input",
//       "name": "名称",
//   },
//   {
//     "searchParam":'name1',
//       "searchType": "input",
//       "name": "名称1",
//   },
//   {
//     "searchParam":'name2',
//       "searchType": "date",
//       "name": "日期",
//       "showTime":false,//是否显示时间
//       "format":'YYYY-MM-DD'
//   },
//     {
//       "searchParam":'org',
//       "searchType": "select",
//       "url": "",
//       "name": "单位",
//       "ismultiple": true,
//       //"fieldNames":{value:'dictInfoCode',label:'dictInfoName'},
//       "option":[
//         { value: 'jack', label: 'Jack' },
//         { value: 'lucy', label: 'Lucy' },
//         { value: 'Yiminghe', label: 'yiminghe' },
//         { value: 'disabled', label: 'Disabled', disabled: true },
//       ]
//     }
// ]
function TableModal({ tableModalParams, setIsTableModal, formModelingName }) {
  const listId = history.location.query.listId;
  const bizSolId = history.location.query.bizSolId;
  formModelingName = formModelingName
    ? formModelingName
    : `formModeling${bizSolId}${listId}`;

  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10); //默认请求10条
  const [searchDataSource, setSearchDataSource] = useState({});
  const [dataSource, setDataSource] = useState({});
  const [params, setParams] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isShowHighSearch, setIsShowHighSearch] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]); //展开节点
  const {
    getDataSource,
    advancedSearch,
    tabelProps,
    onOk,
    highAdvancedSearch,
    onExpand,
    headerButtons,
  } = tableModalParams;
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
            <Form.Item name={item.searchParam} label={item.name}>
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
        return <Input style={{ width: '200px' }} {...info} />;
      case 'select':
        return (
          <Select
            options={searchDataSource?.[strIndex] || []}
            style={{ width: '200px' }}
            {...info}
            fieldNames={info.fieldNames}
            defaultValue={info.defaultValue}
          />
        );
      case 'date':
        return (
          <DatePicker
            {...info}
            format={info.format}
            showTime={info.showTime}
            style={{ width: '200px' }}
          />
        );
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
      setHeight(
        Number(
          document.getElementById(formModelingName)?.offsetHeight * 0.8 - 87,
        ),
      );
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);
  useEffect(() => {
    console.log('ssss===', getDataSource);
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
          fetch(
            `${window.localStorage.getItem('env')}/${item.url}`,
            fetchOptions,
          ).then((response) => {
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
      console.log('record=', record);
      console.log('selected=', selected);
      console.log('selectedRowKeys=', selectedRowKeys);
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
        let tmpSelectedRowKeys = selectedRowKeys.filter(
          (i) => i != record[rowKey],
        );
        let tmpSelectedRows = selectedRows.filter(
          (item) => item[rowKey] == record[rowKey],
        );
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
          let isCancleRows = changeRows.filter(
            (changeItem) => changeItem[rowKey] == item[rowKey],
          );
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
      console.log('node===', node);
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
    console.log('values===', values);
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
          <div className={styles.left}>
            <Form form={form} colon={false} layout="inline">
              {getSearchFields(advancedSearch)}
              {advancedSearch ? (
                <img
                  src={require('../../../public/assets/high_search.svg')}
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
            {headerButtons?.map((item) => {
              return (
                <Button
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
                <Form
                  form={formHigh}
                  className={styles.high_form}
                  layout="inline"
                  colon={false}
                >
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
        console.log('item=====', item);
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
    console.log('data=', data, targetId, childData);
    data &&
      data.map((item) => {
        if (item[rowKey] == targetId) {
          console.log('sssssss=');
          item.children = childData;
          return;
        } else if (
          item.children &&
          item.children.length &&
          item.children[0].key != '1-1'
        ) {
          console.log('sssss111===', item.children);
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
          item.children = [
            {
              key: '1-1',
            },
          ];
        }
      });
    return data;
  };
  const onExpandFn = (expanded, record) => {
    console.log('expanded=', expanded);
    console.log('record=', record);
    const callback = (data) => {
      let newData = loopDataSource(data);
      console.log('newData=', newData);
      //将childre写入
      let newDataSource = loopPushData(
        dataSource.list,
        newData,
        record[rowKey],
      );
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
        console.log('indexs =', deleteIds);
        const newExpandedRowKeys = expandedRowKeys.filter(
          (i) => !deleteIds.includes(i),
        );
        setExpandedRowKeys(newExpandedRowKeys);
      }
    };
    onExpand?.(expanded, record, callback);
  };
  console.log('dataSource===', dataSource);
  return (
    <Modal
      visible={true}
      width={'95%'}
      title="信息"
      bodyStyle={{ padding: 0, height: height }}
      onOk={
        onOk
          ? () => {
              try {
                tableModalParams.onOk(selectedRows, setIsTableModal);
              } catch (e) {
                console.log('e=', e);
              }
            }
          : () => {}
      }
      wrapClassName={styles.table_modal}
      onCancel={() => {
        setIsTableModal(false);
      }}
      okText="确定"
      cancelText="取消"
      mask={false}
      maskClosable={false}
      getContainer={
        formModelingName
          ? () => {
              return document.getElementById(formModelingName) || false;
            }
          : () => {
              return document.body;
            }
      }
    >
      {searchRender()}
      <div style={{ height: `calc(100% - ${searchHeight + 53}px)` }}>
        <ColumnDragTable
          columns={tabelProps?.columns || []}
          dataSource={_.cloneDeep(dataSource?.list) || []}
          rowKey={rowKey}
          rowSelection={{
            ...rowSelection,
            checkStrictly: true,
            hideSelectAll:
              tableModalParams?.selectionType == 'radio' ? true : false,
          }}
          scroll={{ y: 'calc(100% - 40px)', x: 'auto' }}
          bordered={true}
          pagination={false}
          expandable={{ expandedRowKeys, onExpand: onExpandFn.bind(this) }}
        />
      </div>
      <>
        <div
          style={{
            overflow: 'hidden',
            borderTop: '1px solid #F0F0F0',
            position: 'relative',
            height: '52px',
          }}
        >
          <div
            style={{
              float: 'left',
              width: '35%',
              paddingTop: '10px',
              paddingLeft: '16px',
            }}
          >
            {tableModalParams?.remind}
          </div>
          {dataSource?.list?.length ? (
            <IPagination
              current={dataSource?.currentPage}
              total={dataSource?.returnCount}
              onChange={changePage.bind(this)}
              pageSize={pageSize}
              style={{ bottom: '0px' }}
            />
          ) : (
            ''
          )}
        </div>
      </>
    </Modal>
  );
}
export default TableModal;
