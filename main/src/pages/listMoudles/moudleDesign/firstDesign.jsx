import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Radio,
  Select,
  Form,
  TreeSelect,
  Spin,
  Card,
  message,
} from 'antd';
import styles from './index.less';
import { getDvaApp, useLocation, history } from 'umi';
import { parse } from 'query-string';
function firstDesign({
  dispatch,
  dsTree,
  listMoudleInfo,
  loading,
  stateInfo,
  dataName,
  apiList,
}) {
const query = parse(history.location.search);
  const {
    modelType,
    treeSourceType,
    excuteAuth,
    treeExcuteAuth,
    modelId,
    // TODO
    sourceType,
    tableApiId,
    treeApiId,
  } = listMoudleInfo;
  const namespace = `moudleDesign_${query.moudleId}`;
  const [form] = Form.useForm();

  // //设置表单默认值
  useEffect(() => {
    form.resetFields();
    if (!excuteAuth) {
      form.setFieldsValue({ excuteAuth: 'A0001' });
    }
    if (!modelType) {
      form.setFieldsValue({ modelType: 'MODEL' });
    }
    if (!treeExcuteAuth) {
      form.setFieldsValue({ treeExcuteAuth: 'A0001' });
    }
    if (!treeSourceType) {
      form.setFieldsValue({ treeSourceType: 'ORGANIZATION' });
    }
    // TODO
    if (!sourceType) {
      form.setFieldsValue({ sourceType: 'TABLE' });
    }
  }, [modelId]);

  useEffect(() => {
    if (!dsTree.length) {
      dispatch({
        type: `${namespace}/getButtonGroups`,
        payload: {
          start: 1,
          limit: 1000,
          groupType: 'TABLE',
        },
      });
      dispatch({
        type: `${namespace}/getDataSourceTree`,
        callback: () => {
          dispatch({
            type: `${namespace}/getFormListModelInfo`,
            payload: {
              modelId: query.moudleId,
            },
          });
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!apiList.length) {
      dispatch({
        type: `${namespace}/getApiManageList`,
        payload: {
          start: 1,
          limit: 1000,
          search: '',
        },
      });
    }
  }, []);

  function onFinish(values) {
    const { tableApiId, treeApiId } = values;

    // if (sourceType == 'API' || treeSourceType == 'API') {
    //   // TODO
    //   if (tableApiId) {
    //     dispatch({
    //       type: `${namespace}/getDetailApiManage`,
    //       payload: {
    //         apiId: tableApiId,
    //         type: 'TABLE',
    //       },
    //     });
    //   }
    //   if (treeApiId) {
    //     dispatch({
    //       type: `${namespace}/getDetailApiManage`,
    //       payload: {
    //         apiId: treeApiId,
    //         type: 'TREE',
    //       },
    //     });
    //   }
    //   dispatch({
    //     type: `${namespace}/updateStates`,
    //     payload: {
    //       step: 2,
    //       listMoudleInfo: {
    //         ...listMoudleInfo,
    //         ...values,
    //       },
    //     },
    //   });
    // } else {

    if (tableApiId) {
      dispatch({
        type: `${namespace}/getDetailApiManage`,
        payload: {
          apiId: tableApiId,
          type: 'TABLE',
        },
      });
    }
    if (treeApiId) {
      dispatch({
        type: `${namespace}/getDetailApiManage`,
        payload: {
          apiId: treeApiId,
          type: 'TREE',
        },
      });
    }

    let source = {};

    if (values['sourceId']) {
      let array = values['sourceId'].split('-');
      source['tableId'] = array[3].trim();
      source['dsId'] = array[0].trim();
      source['dsDynamic'] = array[1].trim();
      source['dsName'] = array[2].trim();
      source['tableCode'] = array[4].trim();

      // 获取字段列表
      dispatch({
        type: `${namespace}/getDataSourceField`,
        payload: {
          tableId: array[3],
          start: 1,
          limit: 10000,
          searchWord: '',
        },
      });

      // 查询表绑定的业务表单
      dispatch({
        type: `${namespace}/getBusinessFormTable`,
        payload: {
          tableId: array[3],
        },
      });
    }

    if (values['sourceIdTreeList']) {
      let arraytl = values['sourceIdTreeList'].split('-');
      source['treeSourceTableId'] = arraytl[3].trim();
      source['treeSourceDsId'] = arraytl[0].trim();
      source['treeSourceDsDynamic'] = arraytl[1].trim();
      source['treeSourceDsName'] = arraytl[2].trim();
      source['treeSourceTableCode'] = arraytl[4].trim();

      // 列表建模树获取表字段
      dispatch({
        type: `${namespace}/getListModelCols`,
        payload: {
          tableId: arraytl[3],
        },
      });
    }
    if (source['tableId'] == listMoudleInfo.tableId) {
      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          step: 2,
          listMoudleInfo: {
            ...listMoudleInfo,
            ...source,
            ...values,
          },
        },
      });
    } else {
      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          step: 2,
          listMoudleInfo: {
            ...source,
            ...values,
            modelId: listMoudleInfo.modelId,
            columnList: [],
          },
        },
      });
    }

    // // 获取字段列表
    // dispatch({
    //   type: `${namespace}/getDataSourceField`,
    //   payload: {
    //     tableId: array[3],
    //     start: 1,
    //     limit: 10000,
    //     searchWord: '',
    //   },
    // });

    // // 查询表绑定的业务表单
    // dispatch({
    //   type: `${namespace}/getBusinessFormTable`,
    //   payload: {
    //     tableId: array[3],
    //   },
    // });

    // 获取枚举类型的详细信息
    dispatch({
      type: `${namespace}/getDictType`,
      payload: {
        dictTypeCode: 'SYS_YEAR',
        showType: 'ALL',
        isTree: '1',
        searchWord: '',
      },
    });

    // }
  }

  function onValuesChange(changedValues, allValues) {
    console.log('allValuesallValues', allValues);
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        listMoudleInfo: {
          ...listMoudleInfo,
          ...allValues,
        },
      },
    });
  }

  function onChangeTree(value, label, extra) {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        buttons: [],
        buttonGroupId: '',
      },
    });
  }

  function onTreeSourceTypeSelect(v) {
    stateInfo[dataName]['treeSourceType'] = v;
    onModelTypeChange()
  }

  function onSourceTypeSelect(v) {
    stateInfo[dataName]['sourceType'] = v;
    onModelTypeChange()
  }

  function onModelTypeChange(val) {
    stateInfo[dataName]['treeColumn'] = '';
    stateInfo[dataName]['treeShowTitle'] = '';
    stateInfo[dataName]['tableColumn'] = '';
    stateInfo[dataName]['treeImg'] = '';
    stateInfo[dataName]['treeLastImg'] = '';
    stateInfo[dataName]['treeSort'] = '';
    stateInfo[dataName]['logicRelation'] = '';
    stateInfo[dataName]['treeSortSql'] = '';
    // stateInfo[dataName]['buttonGroupName'] = '';
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: {
          ...stateInfo[dataName],
        },
      },
    });
  }
  function onSelectType(val) {
    if (val !== 'TREELIST') {
      form.setFieldsValue({ treeSourceType: 'ORGANIZATION' });
    }
  }
  function onSelectSourceId() {}

  function onSelect(value, node, extra) {
    dispatch({
      type: `${namespace}/verifyModel`,
      payload: {
        tableId: node.id,
      },
      callback: verify => {
        if (verify == 0) {
          message.warning('该表不具备创建成树的规则，请重新选择');
          form.setFieldsValue({ sourceIdTreeList: '' });
        } else {
          onModelTypeChange();
        }
      },
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1 className={styles.title_text}>数据源设计</h1>
      </div>
      <div className={styles.form_container}>
        {/* <Spin spinning={loading.global} style={{height:'100%'}}> */}
        <Form
          form={form}
          initialValues={listMoudleInfo}
          onFinish={onFinish.bind(this)}
          onValuesChange={onValuesChange.bind(this)}
          requiredMark={false}
        >
          <div style={{ display: 'flex' }}>
            <Form.Item
              label="&nbsp;&nbsp;&nbsp;&nbsp;类型"
              name="modelType"
              rules={[{ required: true, message: '请选择数据源类型' }]}
              className={styles.form}
            >
              <Select style={{ width: 240 }} onSelect={onSelectType.bind(this)}>
                <Select.Option value="MODEL">列表建模设计</Select.Option>
                <Select.Option value="TREELIST">
                  左树右列表建模设计
                </Select.Option>
                <Select.Option value="DIY">自定义</Select.Option>
              </Select>
            </Form.Item>
          </div>
          {modelType !== 'TREELIST' && (
            <div style={{ display: 'flex' }}>
              <Form.Item
                label="数据源"
                name="sourceType"
                rules={[{ required: true, message: '请选择来源' }]}
                className={styles.form}
              >
                <Select style={{ width: 240 }}>
                  <Select.Option value="TABLE">数据表</Select.Option>
                  <Select.Option value="API">API接口</Select.Option>
                </Select>
              </Form.Item>
              {sourceType == 'API' ? (
                <Form.Item
                  className={styles.form}
                  label=""
                  name="tableApiId"
                  rules={[{ required: true, message: '请选择接口' }]}
                >
                  <Select style={{ width: 240 }} placeholder="请选择接口">
                    {apiList.map(item => {
                      return (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  className={styles.form}
                  label=""
                  name="sourceId"
                  rules={[{ required: true, message: '请选择数据源' }]}
                >
                  <TreeSelect
                    treeNodeFilterProp="title"
                    placeholder={'请选择数据源'}
                    style={{ width: 240 }}
                    treeData={dsTree}
                    onChange={onChangeTree.bind(this)}
                    showSearch={true}
                  />
                </Form.Item>
              )}
            </div>
          )}
          {modelType === 'DIY' && (
            <Form.Item className={styles.form} label="" name="excuteType">
              <Select style={{ width: 296 }}>
                <Select.Option value="SQL">注入sql</Select.Option>
                <Select.Option value="STORED ">存储过程</Select.Option>
              </Select>
            </Form.Item>
          )}
          {modelType === 'DIY' && (
            <Form.Item className={styles.form} label="" name="sql">
              <Input.TextArea />
            </Form.Item>
          )}
          {modelType !== 'TREELIST' && (
            <Form.Item className={styles.form} label="" name="excuteAuth">
              <Radio.Group style={{ marginLeft: 8 }}>
                <Radio value={'A0001'}>本人</Radio>
                <Radio value={'A0002'}>本部门 </Radio>
                <Radio value={'A0003'}>本部门含下级</Radio>
                <Radio value={'A0004'}>本单位</Radio>
                <Radio value={'A0005'}>本单位含下级</Radio>
                <Radio value={'A0006'}>全部</Radio>
                {/* <Radio value={"A0007"}>流程参与人</Radio> */}
              </Radio.Group>
            </Form.Item>
          )}
          {/* TODO */}
          {modelType === 'TREELIST' && (
            <>
              <Card style={{ width: '90%', margin: '0 50px' }}>
                <p style={{ marginBottom: 15 }}>树形结构数据源选择</p>
                <div style={{ display: 'flex' }}>
                  <Form.Item
                    style={{ marginLeft: -34 }}
                    label="数据源"
                    name="treeSourceType"
                  >
                    {/* onChange={onModelTypeChange} */}
                    <Select style={{ width: 240 }} onSelect={onTreeSourceTypeSelect}>
                      <Select.Option value="ORGANIZATION">
                        组织架构树
                      </Select.Option>
                      <Select.Option value="MODEL">
                        应用数据建模选择
                      </Select.Option>
                      <Select.Option value="API">API接口</Select.Option>
                    </Select>
                  </Form.Item>
                  {treeSourceType == 'MODEL' && (
                    <Form.Item
                      style={{ marginLeft: 10 }}
                      label=""
                      name="sourceIdTreeList"
                      rules={[{ required: true, message: '请选择数据源' }]}
                    >
                      <TreeSelect
                        treeNodeFilterProp="title"
                        placeholder={'请选择数据源'}
                        style={{ width: 240 }}
                        treeData={dsTree}
                        showSearch={true}
                        onSelect={onSelect.bind(this)}
                      />
                    </Form.Item>
                  )}
                  {/* TODO */}
                  {/* form.getFieldsValue()['treeSourceType'] */}
                  {treeSourceType == 'API' && (
                    <Form.Item
                      style={{ marginLeft: 10 }}
                      label=""
                      name="treeApiId"
                      rules={[{ required: true, message: '请选择接口' }]}
                    >
                      <Select style={{ width: 240 }} placeholder="请选择接口">
                        {apiList.map(item => {
                          return (
                            <Select.Option value={item.id} key={item.id}>
                              {item.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  )}
                </div>
                <Form.Item
                  style={{ marginLeft: -8 }}
                  label=""
                  name="treeExcuteAuth"
                >
                  <Radio.Group style={{ marginLeft: 8 }}>
                    <Radio value={'A0001'}>本人</Radio>
                    <Radio value={'A0002'}>本部门 </Radio>
                    <Radio value={'A0003'}>本部门含下级</Radio>
                    <Radio value={'A0004'}>本单位</Radio>
                    <Radio value={'A0005'}>本单位含下级</Radio>
                    <Radio value={'A0006'}>全部</Radio>
                    {/* <Radio value={"A0007"}>流程参与人</Radio> */}
                  </Radio.Group>
                </Form.Item>
              </Card>
              <Card style={{ width: '90%', margin: '15px 50px' }}>
                <p style={{ marginBottom: 15 }}>列表数据源选择</p>
                <div style={{ display: 'flex' }}>
                  <Form.Item
                    style={{ marginLeft: -54 }}
                    label="数据源"
                    name="sourceType"
                    rules={[{ required: true, message: '请选择来源' }]}
                    className={styles.form}
                  >
                    <Select style={{ width: 240 }} onSelect={onSourceTypeSelect}>
                      <Select.Option value="TABLE">数据表</Select.Option>
                      <Select.Option value="API">API接口</Select.Option>
                    </Select>
                  </Form.Item>
                  {sourceType == 'API' ? (
                    <Form.Item
                      style={{ marginLeft: -30 }}
                      className={styles.form}
                      label=""
                      name="tableApiId"
                      rules={[{ required: true, message: '请选择接口' }]}
                    >
                      <Select style={{ width: 240 }} placeholder="请选择接口">
                        {apiList.map(item => {
                          return (
                            <Select.Option value={item.id} key={item.id}>
                              {item.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      style={{ marginLeft: -30 }}
                      className={styles.form}
                      label=""
                      name="sourceId"
                      rules={[{ required: true, message: '请选择数据源' }]}
                    >
                      <TreeSelect
                        treeNodeFilterProp="title"
                        placeholder={'请选择数据源'}
                        style={{ width: 240 }}
                        treeData={dsTree}
                        onChange={onChangeTree.bind(this)}
                        showSearch={true}
                      />
                    </Form.Item>
                  )}
                </div>

                <Form.Item
                  style={{ marginLeft: -8 }}
                  label=""
                  name="excuteAuth"
                >
                  <Radio.Group style={{ marginLeft: 8 }}>
                    <Radio value={'A0001'}>本人</Radio>
                    <Radio value={'A0002'}>本部门 </Radio>
                    <Radio value={'A0003'}>本部门含下级</Radio>
                    <Radio value={'A0004'}>本单位</Radio>
                    <Radio value={'A0005'}>本单位含下级</Radio>
                    <Radio value={'A0006'}>全部</Radio>
                    {/* <Radio value={"A0007"}>流程参与人</Radio> */}
                  </Radio.Group>
                </Form.Item>
              </Card>
            </>
          )}
          <div className={styles.form_footer}>
            <div className={styles.bt_group}>
              <Button htmlType="submit">下一步</Button>
            </div>
          </div>
        </Form>
        {/* </Spin> */}
      </div>
    </div>
  );
}
export default connect(state => ({
  ...state[`moudleDesign_${parse(history.location.search).moudleId}`],
  // loading: state.loading,
}))(firstDesign);
