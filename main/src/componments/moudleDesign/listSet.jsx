import React, { useState, useEffect } from 'react';
import {
  Input,
  Select,
  Form,
  Switch,
  Row,
  Col,
  Tree,
  TreeSelect,
  Button,
  Popover,
  message,
} from 'antd';
import Editor from './editor';
import Sort from './sortAble';
import styles from './index.less';
import FormModal from './formModal';
import { useLocation, useDispatch, history } from 'umi';
import AddButtonModal from './addButtonModal';
import { parse } from 'query-string';
const { TreeNode } = Tree;
const xwyShuoDe = ['DICTCODE', 'MONEY', 'DATE'];
const xwyArr = [
  'MONEY',
  'DATE',
  'ASSOCIADTEDDOC',
  'YEAR',
  'OPINION',
  'QRCODE',
  'BARCODE',
  'BILL',
  'NUMBER',
  'ANNEX',
];

function listSet({ form, stateInfo, namespace, dataName, tableColumnName }) {
  const query = parse(history.location.search);
  const {
    sortVisible,
    sortList,
    editorState,
    selectedKeys,
    selectedIndex,
    formlistModels,
    dictData,
    yearCutData,
    isShowModal,
    fromCols,
    dictTreeData,
    apiTreeCols,
    listMoudleInfo,
    isShowWarnModal,
    funList,
  } = stateInfo;

  const [mergeFlag, setMergeFlag] = useState(false);
  const [showTitleFlag, setShowTitleFlag] = useState(false);
  const [seniorSearchFlag, setSeniorSearchFlag] = useState(false);
  const [dataSort, setDataSort] = useState('');
  const [prevSortList, setPrevSortList] = useState([]);
  const dispatch = useDispatch();
  const newLineName = namespace == 'dataDriven' ? 'newLineFlag' : 'newlineFlag';
  const publicProps = {
    stateInfo,
    namespace,
    dataName,
    tableColumnName,
    dispatch: useDispatch(),
  };
  const layouts = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
  stateInfo[dataName]['multiFlag'] =
    stateInfo[dataName].multiFlag == null
      ? 1
      : stateInfo[dataName].multiFlag == 1
        ? 1
        : 0;
  stateInfo[dataName]['listPage'] =
    stateInfo[dataName].listPage == null
      ? ''
      : stateInfo[dataName].listPage;

  stateInfo[dataName]['showTitleFlag'] =
    stateInfo[dataName].showTitleFlag && stateInfo[dataName].showTitleFlag == 1
      ? true
      : false;
  stateInfo[dataName]['mergeFlag'] =
    stateInfo[dataName].mergeFlag && stateInfo[dataName].mergeFlag == 1
      ? true
      : false;
  stateInfo[dataName]['seniorSearchFlag'] =
    stateInfo[dataName].seniorSearchFlag &&
      stateInfo[dataName].seniorSearchFlag == 1
      ? true
      : false;
  stateInfo[dataName][newLineName] =
    stateInfo[dataName][newLineName] == null
      ? true
      : stateInfo[dataName][newLineName] == 1
        ? true
        : false;
  stateInfo[dataName]['pageFlag'] =
    stateInfo[dataName].pageFlag == null
      ? true
      : stateInfo[dataName].pageFlag == 1
        ? true
        : false;
  stateInfo[dataName]['serialFlag'] =
    stateInfo[dataName].serialFlag == null
      ? true
      : stateInfo[dataName].serialFlag == 1
        ? true
        : false;
  stateInfo[dataName]['mergeFlag'] =
    stateInfo[dataName].mergeFlag == null
      ? false
      : stateInfo[dataName].mergeFlag == 1
        ? true
        : false;
  stateInfo[dataName]['fixedMeterFlag'] =
    stateInfo[dataName].fixedMeterFlag &&
      stateInfo[dataName].fixedMeterFlag == 1
      ? true
      : false;
  stateInfo[dataName]['cacheFlag'] =
    stateInfo[dataName].cacheFlag && stateInfo[dataName].cacheFlag == 1
      ? true
      : false;
  stateInfo[dataName]['designFlag'] =
    stateInfo[dataName].designFlag && stateInfo[dataName].designFlag == 1
      ? true
      : false;
  stateInfo[dataName]['normalSearch'] =
    stateInfo[dataName].normalSearch == ''
      ? []
      : stateInfo[dataName].normalSearch;
  (stateInfo[dataName]['tableStyle'] = stateInfo[dataName].tableStyle
    ? stateInfo[dataName].tableStyle
    : 'TABLE'),
    (stateInfo[dataName]['dataSort'] = stateInfo[dataName].dataSort
      ? stateInfo[dataName].dataSort
      : 'DATE_DESC');

  useEffect(() => {
    if (namespace !== 'dataDriven' && !dictTreeData.length) {
      dispatch({
        type: `${namespace}/getDictTypeTree`,
      });
    }
  }, []);

  useEffect(() => {
    if (stateInfo[dataName]?.buttonId && stateInfo[dataName]?.buttonId != '0') {
      dispatch({
        type: `${namespace}/getFuncLibById`,
        payload: {
          funcLibId: stateInfo[dataName].buttonId,
        },
        callback: buttonName => {
          if (buttonName) {
            form.setFieldsValue({ buttonName });
          } else {
            dispatch({
              type: `${namespace}/getBtnDetailById`,
              payload: {
                buttonId: stateInfo[dataName].buttonId,
              },
              callback: buttonName => {
                form.setFieldsValue({ buttonName });
              },
            });
          }
        },
      });
    }
  }, [stateInfo[dataName]?.buttonId]);

  function findName(code) {
    let arr = [];
    for (let i = 0; i < fromCols?.length; i++) {
      const el1 = fromCols[i];
      for (let j = 0; j < code.length; j++) {
        const el2 = code[j];
        if (el1.columnCode === el2) {
          arr.push(el1.columnName);
        }
      }
    }
    return arr;
  }

  useEffect(() => {
    form.setFieldsValue(stateInfo[dataName]);
    setDataSort(stateInfo[dataName]['dataSort']);
    setPrevSortList(sortList);
  }, [query.moudleId, sortVisible]);

  // useEffect(() => {
  //   if (listMoudleInfo?.sourceType === 'API') {
  //     stateInfo[dataName]['yearCutColumn'] = 'year';
  //     dispatch({
  //       type: `${namespace}/updateStates`,
  //       payload: {
  //         [dataName]: {
  //           ...stateInfo[dataName],
  //         },
  //       },
  //     });
  //     form.setFieldsValue(stateInfo[dataName]);
  //   }
  // }, []);

  function onValuesChange(changedValues, allValues) {
    setShowTitleFlag(allValues['showTitleFlag']);
    setMergeFlag(allValues['mergeFlag']);
    setSeniorSearchFlag(allValues['seniorSearchFlag']);
    setDataSort(allValues['dataSort']);
    // allValues['yearCutColumn'] = allValues['yearCutFlag'] ? 'CREATE_TIME' : '',
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: {
          ...stateInfo[dataName],
          ...allValues,
        },
        editorState: !allValues['showTitleFlag']
          ? ''
          : editorState,
      },
    });
  }

  function handleClear(e) {
    if (!e.target.value) {
      form.setFieldsValue({ [`deployFormId`]: '' });
      form.setFieldsValue({ [`deployFormName`]: '' });
      stateInfo[dataName]['deployFormId'] = '';
      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          [dataName]: stateInfo[dataName],
        },
      });
    }
  }

  function handleWarnClear(e) {
    if (!e.target.value) {
      form.setFieldsValue({ [`buttonName`]: '' });
      stateInfo[dataName]['buttonId'] = null;
      stateInfo[dataName]['minioUrl'] = null;
      stateInfo[dataName]['buttonName'] = '';
      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          [dataName]: stateInfo[dataName],
        },
      });
    }
  }

  function onSetTitle() {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        titleModal: true,
      },
    });
  }

  function onSetMergeJson() {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        isShowTableMerge: true,
      },
    });
  }

  function onSetSenior() {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        seniorModal: true,
      },
    });
  }

  function oncancel() {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        sortVisible: false,
        sortList: prevSortList,
      },
    });
  }
  function onSelectChange(deployFormId) {
    dispatch({
      type: `${namespace}/getFormColumns`,
      payload: {
        deployFormId,
      },
      callback: function (data) {
        stateInfo[dataName].columnList.map(item => {
          for (let i = 0; i < data.length; i++) {
            if (
              item.columnCode == data[i].formColumnCode &&
              !item.showStyle &&
              xwyShuoDe.includes(data[i].colType)
            ) {
              item.showStyle = data[i].colType;
            }
          }
        });
        stateInfo[dataName]['deployFormId'] = deployFormId;
        dispatch({
          type: `${namespace}/updateStates`,
          payload: {
            [dataName]: stateInfo[dataName],
          },
        });
      },
    });
  }

  function handleVisibleChange(visible) {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        sortVisible: visible,
      },
    });
  }

  function onSaveSort() {
    var newIndex =
      selectedKeys[0] &&
      _.findIndex(sortList, {
        columnCode: selectedKeys[0],
      });
    stateInfo[dataName][tableColumnName] = sortList;
    setPrevSortList(sortList);
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: stateInfo[dataName],
        selectedIndex: newIndex && newIndex != -1 ? newIndex : selectedIndex,
        sortVisible: false,
      },
    });
    // oncancel();
  }

  function changeValues(value) {
    let newArr;
    let limit = namespace == 'dataDriven' ? 5 : 3;
    if (value.length > limit) {
      message.error(`最多选择${limit}个字段`);
      newArr = [].concat(value.slice(0, limit));
    } else {
      newArr = value;
    }
    form.setFieldsValue({
      normalSearch: newArr,
    });
    let arr = findName(newArr);
    let text = '';
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      text += i + 1 === arr.length ? el : el + '/';
    }
    form.setFieldsValue({
      normalSearch: newArr,
      normalPromp: `请输入${text || '关键字'}查询`
    });
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: {
          ...stateInfo[dataName],
          normalSearch: newArr,
          normalPromp: `请输入${text || '关键字'}查询`
        },
      },
    });
  }

  // TreeNode节点处理
  const renderTreeNodes = data =>
    data.map(item => {
      if (item.id) {
        const title = item.dictTypeName;
        if (item.children) {
          return (
            <TreeNode
              title={title}
              key={item.dictTypeCode}
              value={item.dictTypeCode}
            >
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={title}
            key={item.dictTypeCode}
            value={item.dictTypeCode}
          />
        );
      }
    });

  const onSwitchChange = (checked) => {
    console.log(`switch to ${checked}`);
    if (!checked) {
      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          outputHTML: ''
        }
      })
    }
  };

  return (
    <Form
      initialValues={stateInfo[dataName]}
      labelAlign={'right'}
      form={form}
      onValuesChange={onValuesChange.bind(globalThis)}
      {...layouts}
      style={
        namespace == 'dataDriven' ? { height: 400, overflowY: 'scroll' } : { height: 'calc(100vh - 330px)', overflowY: 'scroll' }
      }
    >
      {/* {namespace=='dataDriven'&&<Form.Item 
            label="应用类别过滤"
            name="ctlgType" 
            className={styles.form}
            valuePropName="checked"
            >
            <Switch  />
        </Form.Item>} */}
      {namespace != 'dataDriven' && (
        <Form.Item label="标题" className={styles.form} style={{height: 28}}>
          <Input.Group compact>
            <Form.Item
              name="showTitleFlag"
              valuePropName="checked"
            >
              <Switch onChange={onSwitchChange} />
            </Form.Item>
            <Form.Item noStyle>
              {stateInfo[dataName].showTitleFlag || showTitleFlag ? (
                <a className={styles.setting} onClick={onSetTitle.bind(this)}>设置</a>
              ) : (
                ''
              )}
            </Form.Item>
          </Input.Group>
        </Form.Item>
      )}
      {listMoudleInfo?.sourceType !== 'API' && (
        <Form.Item
          label="常规查询"
          name="normalSearch"
          className={styles.form}
          rules={[{ required: true, message: '请选择常规查询项' }]}
        >
          <Select
            style={{ width: 163 }}
            placeholder="请选择常规查询项"
            mode="tags"
            onChange={changeValues}
          >
            {namespace == 'dataDriven'
              ? stateInfo[dataName][tableColumnName]
                ?.filter(i => !xwyArr.includes(i.formColumnControlCode))
                .filter(i => i.columnCode != 'CREATE_TIME')
                .map((item, index) => (
                  <Select.Option value={item.columnCode} key={index}>
                    {item.columnName}
                  </Select.Option>
                ))
              : fromCols
                ?.filter(i => !xwyArr.includes(i.colType))
                .map((item, index) => (
                  <Select.Option value={item.columnCode} key={index}>
                    {item.columnName}
                  </Select.Option>
                ))}
          </Select>
        </Form.Item>
      )}
      {namespace != 'dataDriven' && (
        <Form.Item
          label="空文本提醒"
          name="normalPromp"
          className={styles.form}
          rules={[
            { max: 50, message: '最多输入50个字符' },
          ]}
        >
          <Input.TextArea
            style={{ width: 163 }}
          // placeholder="请输入关键字查询"
          />
        </Form.Item>
      )}
      {namespace != 'dataDriven' && (
        // <Row style={{ position: 'relative' }}>
        //   <Col span={8}>
        <Form.Item label="高级查询" className={styles.form} style={{height: 28}}>
          <Input.Group compact>
            <Form.Item
              name="seniorSearchFlag"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item noStyle>
              {(seniorSearchFlag || stateInfo[dataName].seniorSearchFlag) ? (
                <a className={styles.setting} onClick={onSetSenior.bind(this)}>
                  设置
                </a>
              ) : (
                ''
              )}
            </Form.Item>
          </Input.Group>
        </Form.Item>
        //   </Col>
        // </Row>
      )}
      {namespace != 'dataDriven' && listMoudleInfo?.sourceType !== 'API' && (
        <Form.Item
          label="参照表单"
          name="deployFormName"
          className={styles.form}
        >
          <Input
            allowClear
            onChange={handleClear}
            style={{ width: 163 }}
            onClick={() =>
              dispatch({
                type: `${namespace}/updateStates`,
                payload: {
                  isShowModal: true,
                },
              })
            }
          />
          {/* <Select
            style={{ width: 163 }}
            placeholder="请选择表单"
            onChange={onSelectChange.bind(this)}
          >
            {formlistModels.map((item, index) => {
              return (
                <Select.Option key={index} value={item.deployId}>
                  {item.bizFormName}
                </Select.Option>
              );
            })}
          </Select> */}
        </Form.Item>
      )}
      <Form.Item
        label="自动换行"
        name={newLineName}
        className={styles.form}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label="分页"
        name="pageFlag"
        className={styles.form}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item label="列表样式" name="tableStyle" className={styles.form}>
        <Select style={{ width: 163 }} placeholder="请选择列表样式">
          <Select.Option value="TABLE">显示表格</Select.Option>
          <Select.Option value="NONE">无</Select.Option>
        </Select>
      </Form.Item>
      {/**<Form.Item 
            label="固定表头"
            name="fixedMeterFlag" 
            className={styles.form}
            valuePropName="checked"
        >
            <Switch  />
        </Form.Item>*/}
      <Form.Item
        label="缓存"
        name="cacheFlag"
        className={styles.form}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      {namespace != 'dataDriven' && (
        <Form.Item
          label="数据过滤条件"
          name="diySearchSql"
          className={styles.form}
        >
          <Input.TextArea
            style={{ width: 163 }}
            placeholder="例： AND XXX = '123'"
          />
        </Form.Item>
      )}
      <Form.Item label="列表数据排序" name="dataSort" className={styles.form}>
        <Select style={{ width: 163 }} placeholder="请选择常规查询项">
          <Select.Option value="DATE_ASC">拟稿时间正序</Select.Option>
          <Select.Option value="DATE_DESC">拟稿时间倒序</Select.Option>
          <Select.Option value="CUSTOMIZE">自定义</Select.Option>
        </Select>
      </Form.Item>
      {dataSort == 'CUSTOMIZE' ? (
        <Form.Item label="sql" name="dataSortSql" className={styles.form}>
          <Input.TextArea style={{ width: 163 }} />
        </Form.Item>
      ) : (
        ''
      )}

      <Form.Item
        label="年度分割"
        name="yearCutFlag"
        className={styles.form}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      {stateInfo[dataName].yearCutFlag ? (
        <Form.Item
          label="年度分割字段"
          name="yearCutColumn"
          className={styles.form}
          rules={[{ required: true, message: '请选择字段' }]}
        >
          {listMoudleInfo?.sourceType !== 'API' ? (
            <Select style={{ width: 163 }} placeholder="请选择字段">
              {yearCutData?.map(item => {
                return (
                  <Select.Option key={item.code} value={item.code}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          ) : (
            // <Input value="year" disabled style={{ width: 163 }} />
            <Select style={{ width: 163 }} placeholder="请选择字段">
              {apiTreeCols?.map(item => {
                return (
                  <Select.Option key={item.paramCode} value={item.paramCode}>
                    {item.paramName}
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
      ) : null}
      {namespace != 'dataDriven' && (
        <Form.Item label="页签设置" name="listPage" className={styles.form}>
          <Select style={{ width: 163 }} placeholder="请选择">
            <Select.Option value="" key="-1">
              无页签
            </Select.Option>
            {dictData?.map((item, index) => {
              return (
                <Select.Option value={item.code} key={index}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      )}
      {listMoudleInfo?.sourceType == 'API' && stateInfo[dataName].listPage && (
        <Form.Item label="码表关联" name="listPageDictTypeCode" className={styles.form}>
          <TreeSelect
            showSearch
            treeNodeFilterProp="title"
            style={{
              width: 163,
            }}
            dropdownStyle={{
              maxHeight: 400,
              overflow: 'auto',
              minWidth: 300,
            }}
            placeholder="请选择"
            dropdownMatchSelectWidth={false}
            placement="topLeft"
            allowClear
            treeDefaultExpandAll
          >
            {dictTreeData.length > 0 ? renderTreeNodes(dictTreeData) : ''}
          </TreeSelect>
        </Form.Item>
      )}
      {namespace != 'dataDriven' && (
        <Form.Item label="选中逻辑" name="multiFlag" className={styles.form}>
          <Select style={{ width: 163 }} placeholder="请选择">
            <Select.Option value={1} key="1">
              多选
            </Select.Option>
            <Select.Option value={0} key="0">
              单选
            </Select.Option>
          </Select>
        </Form.Item>
      )}
      <Form.Item label="列排序" name="columnSort" className={styles.form}>
        <Popover
          className={styles.sort_pover}
          visible={sortVisible}
          placement="bottom"
          onVisibleChange={handleVisibleChange.bind(this)}
          content={
            <div>
              <Sort isCheck={false} {...publicProps} />
              <div className={styles.sort_bt_group}>
                <Button onClick={oncancel.bind(this)}>取消</Button>
                <Button onClick={onSaveSort.bind(this)}>保存</Button>
              </div>
            </div>
          }
          trigger="click"
        >
          <a className={styles.setting}>设置</a>
        </Popover>
      </Form.Item>
      {namespace != 'dataDriven' && (
        <>
          <Form.Item
            label="展示预警"
            name="warning"
            className={styles.form}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </>
      )}
      {stateInfo[dataName].warning ? (
        <Form.Item
          label="函数引用"
          name="buttonName"
          className={styles.form}
          rules={[{ required: true, message: '请选择函数引用' }]}
        >
          <Input
            style={{ width: 163 }}
            allowClear
            onChange={handleWarnClear}
            onClick={() => {
              dispatch({
                type: `${namespace}/getFuncLibList`,
                payload: {
                  limit: 10,
                  start: 1,
                  searchValue: '',
                  funcRefType: '2,5'
                },
                callback: () => {
                  dispatch({
                    type: `${namespace}/updateStates`,
                    payload: {
                      isShowWarnModal: true,
                    },
                  });
                },
              });
            }}
          />
        </Form.Item>
      ) : null}
      {namespace != 'dataDriven' && (
        <>
          <Form.Item
            label="展示序号列"
            name="serialFlag"
            className={styles.form}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item label="表头合并" className={styles.form} style={{height: 28}}>
            <Input.Group compact>
              <Form.Item
                name="mergeFlag"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item noStyle>
                {stateInfo[dataName].mergeFlag || mergeFlag ? (
                  <a className={styles.setting} onClick={onSetMergeJson.bind(this)}>设置</a>
                ) : (
                  ''
                )}
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </>
      )}
      {isShowWarnModal && (
        <AddButtonModal
          form={form}
          {...publicProps}
          type="warning"
        ></AddButtonModal>
      )}
      {isShowModal && (
        <FormModal
          form={form}
          formlistModels={formlistModels}
          {...publicProps}
        ></FormModal>
      )}
    </Form>
  );
}
export default listSet;
