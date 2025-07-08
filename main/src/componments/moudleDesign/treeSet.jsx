import React, { useState, useEffect } from 'react';
import {
  Input,
  Select,
  Form,
  Tree,
  TreeSelect,
  Switch,
  Row,
  Col,
  Button,
  Radio,
  InputNumber,
} from 'antd';
import styles from './index.less';
import TitleModal from './titleModal';
import { history, useDispatch } from 'umi';

import IconFont from '../../../Icon_manage';
import iconData from '../../../public/icon_manage/iconfont.json';

const { Option } = Select;
const { TreeNode } = Tree;
const ORG_CODE = 'ORG_CODE';
const ORG_ID = 'ORG_ID';
const ORG_NUMBER = 'ORG_NUMBER';
function TreeSet({ stateInfo, namespace, dataName, containerId, setupIcon }) {
  const {
    configModal,
    fromCols,
    treeCols,
    treeData,
    titleList,
    apiTreeCols,
    listMoudleInfo,
  } = stateInfo;

  const publicProps = {
    namespace,
    stateInfo,
    containerId,
    dataName,
  };

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [treeSort, setTreeSort] = useState('');
  const [treeColumn, setTreeColumn] = useState(
    stateInfo[dataName]['treeColumn'] || ORG_CODE,
  );

  stateInfo[dataName]['treeSort'] = stateInfo[dataName].treeSort
    ? stateInfo[dataName].treeSort
    : 'DATE_DESC';

  useEffect(() => {
    // if (listMoudleInfo.titleList.length === 0 ) {
    // stateInfo[dataName]['treeShowTitle'] = `[${listMoudleInfo['tableCode']}]`;
    // dispatch({
    //   type: `${namespace}/updateStates`,
    //   payload: {
    //     [dataName]: {
    //       ...stateInfo[dataName]
    //     },
    //     titleList: [
    //       {
    //         id: 0,
    //         value: listMoudleInfo['tableCode'],
    //         valueType: "INPUT",
    //       }
    //     ]
    //   }
    // })
    // }
    // if (listMoudleInfo.sourceType === 'API') {
    //   stateInfo[dataName]['tableColumn'] = 'nodeValue';
    //   dispatch({
    //     type: `${namespace}/updateStates`,
    //     payload: {
    //       [dataName]: {
    //         ...stateInfo[dataName],
    //       },
    //     },
    //   });
    // }
    form.setFieldsValue(stateInfo[dataName]);
    setTreeSort(stateInfo[dataName]['treeSort']);
  }, []);

  function onValuesChange(changedValues, allValues) {
    setTreeSort(allValues['treeSort']);
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: {
          ...stateInfo[dataName],
          ...allValues,
        },
      },
    });
  }

  function onShowTitleModal() {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        configModal: true,
      },
    });
  }

  function onHanleInfo(info) {
    form.setFieldsValue({
      treeShowTitle: info,
    });
    stateInfo[dataName]['treeShowTitle'] = info;
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: {
          ...stateInfo[dataName],
        },
      },
    });
  }

  function onChangeIcon(value) {
    setupIcon(value);
  }
  function onChangeColumn(value) {
    setTreeColumn(value);
    if (value === treeColumn) {
      return;
    }
    form.setFieldsValue({
      tableColumn: '',
    });
    stateInfo[dataName]['tableColumn'] = '';
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: {
          ...stateInfo[dataName],
        },
      },
    });
  }

  return (
    <div style={{ margin: 20 }}>
      <Form
        initialValues={stateInfo[dataName]}
        onValuesChange={onValuesChange.bind(this)}
        form={form}
      >
        {listMoudleInfo.treeSourceType != 'ORGANIZATION' && (
          <>
            <h2>树形配置</h2>
            {listMoudleInfo.treeSourceType !== 'API' && (
              <Form.Item
                label="展示设置"
                name="treeShowTitle"
                rules={[{ required: true, message: '请选择展示设置' }]}
              >
                <Input style={{ width: 160 }} onFocus={onShowTitleModal} />
              </Form.Item>
            )}
            <Form.Item label="目录图标" name="treeImg">
              <Select
                style={{ width: 160 }}
                onChange={onChangeIcon}
                showSearch
                allowClear
              >
                {iconData.glyphs.map((item, index) => {
                  return (
                    <Option key={item + index} value={item.font_class}>
                      {<IconFont type={`icon-${item.font_class}`} />}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="末级图标" name="treeLastImg">
              <Select style={{ width: 160 }} showSearch allowClear>
                {iconData.glyphs.map((item, index) => {
                  return (
                    <Option key={item + index} value={item.font_class}>
                      {<IconFont type={`icon-${item.font_class}`} />}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {listMoudleInfo.treeSourceType !== 'API' && (
              <Form.Item label="树形数据排序" name="treeSort">
                <Select style={{ width: 163 }} placeholder="请选择常规查询项">
                  <Select.Option value="DATE_ASC">拟稿时间正序</Select.Option>
                  <Select.Option value="DATE_DESC">拟稿时间倒序</Select.Option>
                  <Select.Option value="CUSTOMIZE">自定义</Select.Option>
                </Select>
              </Form.Item>
            )}

            {treeSort == 'CUSTOMIZE' ? (
              <Form.Item label="sql" name="treeSortSql">
                <Input.TextArea style={{ width: 163 }} />
              </Form.Item>
            ) : (
              ''
            )}
          </>
        )}
        <h2>联动条件</h2>
        {listMoudleInfo.sourceType !== 'API' ? (
          <Form.Item
            label="列表字段"
            name="tableColumn"
            // className={styles.form}
            rules={[{ required: true, message: '请选择列表字段' }]}
          >
            <Select style={{ width: 163 }} placeholder="请选择列表字段">
              {listMoudleInfo.treeSourceType === 'ORGANIZATION' ? (
                <Option key="treeColumn" value={treeColumn}>
                  {treeColumn}
                </Option>
              ) : null}
              {fromCols.map(item => {
                return (
                  <Option value={item.columnCode} key={item.columnCode}>
                    {item.columnName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        ) : (
          <Form.Item
            label="列表字段"
            name="tableColumn"
            rules={[{ required: true, message: '请选择列表字段' }]}
          >
            <Select style={{ width: 163 }} placeholder="请选择列表字段">
              {apiTreeCols.map(item => {
                return (
                  <Option value={item.paramCode} key={item.paramCode}>
                    {item.paramName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        )}
        
          <Form.Item
            label="逻辑关系"
            name="logicRelation"
            // className={styles.form}
            rules={[{ required: true, message: '请选择逻辑关系' }]}
          >
            <Select style={{ width: 163 }} placeholder="请选择逻辑关系">
            {listMoudleInfo.sourceType !== 'API' ? 
            <>
              <Option value="EQUAL">等于</Option>
              <Option value="INCLUDE">包含</Option>
              </> : <Option value="EQUAL">等于</Option>}
            </Select>
          </Form.Item>
        

        <Form.Item
          label="树形字段"
          name="treeColumn"
          // className={styles.form}
          rules={[{ required: true, message: '请选择树形字段' }]}
        >
          {listMoudleInfo.treeSourceType !== 'ORGANIZATION' ? (
            <Select style={{ width: 163 }} placeholder="请选择树形字段">
              {treeCols.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          ) : (
            <Select
              style={{ width: 163 }}
              defaultValue={ORG_CODE}
              value={ORG_CODE}
              onChange={onChangeColumn}
            >
              <Option value={ORG_CODE}>{ORG_CODE}</Option>
              <Option value={ORG_ID}>{ORG_ID}</Option>
              <Option value={ORG_NUMBER}>{ORG_NUMBER}</Option>
            </Select>
          )}
        </Form.Item>
        {/* <Form.Item 
          label="年度分割"
          name="yearCutFlag" 
          valuePropName="checked"
        >
          <Switch  />
        </Form.Item> */}
      </Form>
      {configModal && <TitleModal onHanleInfo={onHanleInfo} {...publicProps} />}
    </div>
  );
}
export default TreeSet;
