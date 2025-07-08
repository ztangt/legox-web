import { connect } from 'dva';
import { useEffect, useState, useRef } from 'react';
import {
  Modal,
  Input,
  Button,
  message,
  Form,
  Row,
  Col,
  Select,
  Tabs,
  TreeSelect,
  Spin,
} from 'antd';
import _ from 'lodash';
import styles from '../index.less';
import FieldSet from './fieldSet';
import ListDesign from '../../../componments/moudleDesign/secondDesign';
import { Item } from 'rc-menu';
import GlobalModal from '../../../componments/GlobalModal';
const FormItem = Form.Item;
const { TabPane } = Tabs;

function addListMoudles({ dispatch, dataDriven, onCancel, onSubmit, loading }) {
  const {
    dataDrive,
    dataDriveOther,
    driveType,
    treeData,
    sourceTableList,
    targetTableList,
    pushTargetColList,
    pushSourceColList,
    sourceDsDynamic,
    targetDsDynamic,
    refreshkey,
    sourceTableListA,
    targetTableListA,
    checkedKeys,
    isFinished,
  } = dataDriven;
  const [infoKey, setInfoKey] = useState('PULL');
  const [pushSourceColListD, setPushSourceColListD] = useState([]);
  const [pushTargetColListD, setPushTargetColListD] = useState([]);
  const [form] = Form.useForm();
  const formRef = useRef();

  useEffect(() => {
    form.resetFields();
    if (dataDrive.targetModelId) {
      dispatch({
        type: 'dataDriven/getBpmflagAndBasicflag',
        payload: {
          id: dataDrive.targetModelId,
        },
      });
    }
  }, [dataDrive.id]);

  useEffect(() => {
    if (form.getFieldValue(`splitType`) === 'AVG') {
      setPushSourceColListD(
        pushSourceColList.filter(
          item => item.formColumnControlCode == 'NUMBER',
        ),
      );
      // setPushTargetColListD(pushTargetColList.filter((item) => item.formColumnControlCode == 'NUMBER'))
    } else if (form.getFieldValue(`splitType`) === 'SPLIT') {
      setPushSourceColListD(
        pushSourceColList.filter(
          item =>
            item.formColumnControlCode == 'SINGLETEXT' ||
            item.formColumnControlCode == 'DICTCODE',
        ),
      );
      // setPushTargetColListD(pushTargetColList.filter((item) => item.formColumnControlCode == 'INPUT' || item.formColumnControlCode == 'DICTCODE'))
    } else {
      setPushSourceColListD(pushSourceColList);
    }
    setPushTargetColListD(pushTargetColList);
  }, [form.getFieldValue(`splitType`), pushSourceColList, pushTargetColList]);

  function onCancel() {
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        addModal: false,
      },
    });
  }
  function isRepeat(arr) {
    let tmp = [];
    arr.map((item, i) => {
      tmp.push({
        targetTableCode: item.targetTableCode,
        targetTableColCode: item.targetTableColCode,
      });
    });
    const map = _.groupBy(
      tmp,
      ({ targetTableCode, targetTableColCode }) =>
        targetTableCode + targetTableColCode,
    );
    let array = Object.keys(map);
    for (let i = 0; i < array.length; i++) {
      console.log(map[array[i]]);
      if (map[array[i]].length > 1) {
        return true;
      }
    }
    return false;
  }

  function onFinish(values) {
    if (
      (!dataDrive.normalSearch || dataDrive.normalSearch.length == 0) &&
      driveType == 'PULL'
    ) {
      message.error('请选择常规查询项');
      return;
    }

    Object.keys(values).forEach(function(key) {
      if (
        key != 'planType' &&
        key != 'getState' &&
        key != 'getType' &&
        key != 'updateType' &&
        key != 'splitType' &&
        key != 'isSplit' &&
        values[key]
      ) {
        values[key] = values[key].trim();
      }
    });
    dataDrive['newLineFlag'] = dataDrive.newLineFlag ? 1 : 0;
    dataDrive['pageFlag'] = dataDrive.pageFlag ? 1 : 0;
    dataDrive['fixedMeterFlag'] = dataDrive.fixedMeterFlag ? 1 : 0;
    dataDrive['cacheFlag'] = dataDrive.cacheFlag ? 1 : 0;
    dataDrive['designFlag'] = dataDrive.designFlag ? 1 : 0;
    dataDrive['ctlgType'] = dataDrive.ctlgType ? 1 : 0;
    dataDrive['yearCutFlag'] = dataDrive.yearCutFlag ? 1 : 0;
    dataDrive['normalSearch'] = dataDrive.normalSearch
      ? dataDrive.normalSearch.toString()
      : '';
    // dataDrive['columnJson'] = JSON.stringify(dataDrive.tableColumnList)
    let flagrequired = false;
    let flagLength = false;
    let columnJson =
      dataDrive.tableColumnList &&
      dataDrive.tableColumnList.map(item => {
        item['sortFlag'] = item.sortFlag ? 1 : 0;
        item['sumFlag'] = item.sumFlag ? 1 : 0;
        item['fixedFlag'] = item.fixedFlag ? 1 : 0;
        item['alignStyle'] = item.colAlignStyle;
        if (!item.columnName) {
          flagrequired = true;
        }
        item['columnName'] = item.columnName.trim();
        if (item.columnName.length > 30) {
          flagLength = true;
        }
        return item;
      });
    if (flagrequired) {
      message.error('列表名称为必填项!');
      return;
    }
    if (flagLength) {
      message.error('列表名称最多输入30个字符!');
      return;
    }

    let pushColumnList = _.cloneDeep(dataDrive.pushColumnList);
    let isEmptyPush = false;
    pushColumnList = pushColumnList.map(item => {
      delete item['key'];
      if (
        !item.sourceTableCode ||
        !item.sourceTableColCode ||
        !item.targetTableCode ||
        !item.targetTableColCode
      ) {
        isEmptyPush = true;
      }
      return item;
    });
    if (isEmptyPush) {
      message.error('字段配置尚未填写完整!');
      return;
    }
    if (
      (dataDrive.pushTargetTableColCode || dataDrive.pushSourceTableColCode) &&
      driveType == 'PUSH' &&
      dataDrive.isSplit
    ) {
      if (pushColumnList.length === 0) {
        message.error('推送拆分必须配置下面列表的信息，不能单独配置拆分推送!');
        return;
      }
      for (let i = 0; i < pushColumnList.length; i++) {
        if (
          dataDrive.pushTargetTableColCode ==
            pushColumnList[i].targetTableColCode ||
          dataDrive.pushSourceTableColCode ==
            pushColumnList[i].sourceTableColCode
        ) {
          message.error('推送拆分设置字段不能与下面字段重复!');
          return;
        }
      }
    }
    // 8180
    if (driveType == 'PUSH' && dataDrive.getType == 3) {
      let hasMain = false;
      for (let i = 0; i < pushColumnList.length; i++) {
        if (pushColumnList[i].targetTableMain) {
          hasMain = true;
          break;
        }
      }
      if (!hasMain) {
        message.error('下面配置中目标表必须要有一条主表的配置信息!');
        return;
      }
    }

    if (isRepeat(pushColumnList)) {
      message.error('推送至的字段不能重复!');
      return;
    }
    let isEmptyUpdate = false;
    let updateColumnList = _.cloneDeep(dataDrive.updateColumnList);
    updateColumnList = updateColumnList.map(item => {
      delete item['key'];
      if (
        !item.sourceTableCode ||
        !item.sourceTableColCode ||
        !item.targetTableCode ||
        !item.targetTableColCode
      ) {
        isEmptyUpdate = true;
      }
      return item;
    });
    if (isEmptyUpdate) {
      message.error('字段配置尚未填写完整!');
      return;
    }
    let columnSortTmp = [];
    for (let i = 0; i < columnJson?.length; i++) {
      columnSortTmp.push(columnJson[i].columnCode);
    }
    dataDrive['columnSort'] = columnSortTmp.toString();
    dataDrive['pushColJson'] = JSON.stringify(pushColumnList);
    dataDrive['columnJson'] = JSON.stringify(columnJson);
    dataDrive['writeColJson'] = JSON.stringify(updateColumnList);
    delete dataDrive['columnList'];
    delete dataDrive['pushColumnList'];
    if (dataDrive.id) {
      values['id'] = dataDrive.id;
      values['ctlgId'] = dataDrive.ctlgId;
      dispatch({
        type: 'dataDriven/updateDataDrive',
        payload: {
          ...dataDrive,
          ...values,
          driveType,
          sourceDsDynamic,
          targetDsDynamic,
        },
      });
    } else {
      values['ctlgId'] = dataDrive.ctlgId;
      dispatch({
        type: 'dataDriven/addDataDriver',
        payload: {
          ...values,
          ...dataDrive,
          driveType,
          sourceDsDynamic,
          targetDsDynamic,
        },
      });
    }
  }
  function onSelectTree(dynamicName, name, fieldName, value, node) {
    if (node.nodeType != 'bizSol') {
      form.setFieldsValue({ [fieldName]: '' });
      message.error('请选择业务应用!');
      return;
    }
    if (driveType == 'PUSH') {
      form.setFieldsValue({ pushTargetTableCode: '' });
      form.setFieldsValue({ pushTargetTableColCode: '' });
      form.setFieldsValue({ pushTargetTableColName: '' });
      form.setFieldsValue({ pushTargetTableColName: '' });

      dataDrive['pushTargetTableCode'] = '';
      dataDrive['pushTargetTableColCode'] = '';
      dataDrive['pushTargetTableColName'] = '';
      dispatch({
        type: 'dataDriven/updateStates',
        payload: {
          pushTargetColList: [],
        },
      });
    } else {
      form.setFieldsValue({ getType: 1 });
      dataDrive['getType'] = 1; //将状态重置
      dispatch({
        type: 'dataDriven/updateStates',
        payload: {
          checkedKeys: [],
        },
      });
    }
    // let sourceArray = []
    // let targetArray = []
    form.setFieldsValue({ updateType: 1 });
    dataDrive['updateType'] = 1; //将状态重置
    if (name == 'sourceTableList') {
      dataDrive['sourceModeId'] = value;
      dataDrive['sourceModeName'] = node.nodeName;
      dataDrive['pushFormId'] = node.deployFormId;
      dataDrive['pushFormVersion'] = node.deployFormVersion;
      // dataDrive['tableColumnList'] = [//初始化列表设计
      //     {key:'CREATE_TIME',columnCode:'CREATE_TIME',formColumnCode:'CREATE_TIME',columnName:'拟稿时间',formColumnName:'拟稿时间',formColumnName:'拟稿时间',title: '拟稿时间',fieldName: '拟稿时间',formColumnType:'VARCHAR',},
      //     {key:'TITLE',columnCode:'TITLE',formColumnCode:'TITLE',columnName:'标题',formColumnName:'标题',title: '标题',formColumnName:'标题',fieldName:'标题',formColumnType:'VARCHAR'},
      //     {key:'BIZ_STATUS',columnCode:'BIZ_STATUS',formColumnCode:'BIZ_STATUS',columnName:'办理状态',formColumnName:'办理状态',formColumnName:'办理状态',fieldName:'办理状态',title: '办理状态',formColumnType:'VARCHAR'}
      // ]
    } else {
      dataDrive['targetModelId'] = value;
      dataDrive['targetModelName'] = node.nodeName;
      dataDrive['targetFormId'] = node.deployFormId;
      dataDrive['targetFormVersion'] = node.deployFormVersion;
      dataDriveOther['bpmFlag'] = node.bpmFlag;
      dataDriveOther['basicDataFlag'] = node.basicDataFlag;
    }
    dataDrive['pushColumnList'] = [];
    dataDrive['updateColumnList'] = [];
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        dataDrive,
        dataDriveOther,
        // sourceTableList: sourceArray,
        // targetTableList: targetArray,
      },
    });
    if (node.deployFormId) {
      dispatch({
        type: 'dataDriven/getFormTableColumns',
        payload: {
          deployFormId: node.deployFormId,
        },
        name: name,
        dynamicName: dynamicName,
      });
    }
  }

  //新增 编辑保存回调
  function onAddSubmit(values, text) {}
  function onValuesChange(changedValues, allValues) {
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        dataDrive: {
          ...dataDrive,
          ...allValues,
          refreshkey: refreshkey + 1,
        },
      },
    });
  }

  function onChangeTable(valueName, fieldName, name, array, value, option) {
    console.log(
      'dataDrivedataDrive:',
      valueName,
      fieldName,
      name,
      array,
      value,
      option,
    );
    // form.setFieldsValue({[valueName]: value});
    form.setFieldsValue({ [fieldName]: '' });
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        [name]: array[option.key].columnList,
      },
    });
  }

  function onChangeCol(fieldName, name, value, option) {
    // console.log('onChangeCol----',fieldName,name,value,option);
    dataDrive[fieldName] = value;
    dataDrive[name] = option.children;
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        dataDrive,
      },
    });
  }

  function sourceDisabled() {
    switch (driveType) {
      case 'PULL':
        return false;
        break;
      case 'PUSH':
        return true;
        break;
      default:
        break;
    }
  }
  function onChangeTab(key) {
    setInfoKey(key);
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        selectedRowKeys: [],
      },
    });

    if (key != 'LIST') {
      return;
    }
    dispatch({
      type: `dataDriven/getDictType`,
      payload: {
        dictTypeCode: 'SYS_YEAR',
        showType: 'ALL',
        isTree: '1',
        searchWord: '',
      },
    });
    let newList = [
      {
        //固定主表
        key: '业务主表',
        title: '业务主表',
        disabled: true,
        children: [
          {
            key: 'CREATE_TIME',
            columnCode: 'CREATE_TIME',
            formColumnCode: 'CREATE_TIME',
            columnName: '拟稿时间',
            formColumnName: '拟稿时间',
            formColumnName: '拟稿时间',
            title: '拟稿时间',
            fieldName: '拟稿时间',
            formColumnType: 'VARCHAR',
          },
          {
            key: 'TITLE',
            columnCode: 'TITLE',
            formColumnCode: 'TITLE',
            columnName: '标题',
            formColumnName: '标题',
            title: '标题',
            formColumnName: '标题',
            fieldName: '标题',
            formColumnType: 'VARCHAR',
          },
          {
            key: 'BIZ_STATUS',
            columnCode: 'BIZ_STATUS',
            formColumnCode: 'BIZ_STATUS',
            columnName: '办理状态',
            formColumnName: '办理状态',
            formColumnName: '办理状态',
            fieldName: '办理状态',
            title: '办理状态',
            formColumnType: 'VARCHAR',
          },
          {
            key: 'SOL_ID',
            columnCode: 'SOL_ID',
            formColumnCode: 'SOL_ID',
            columnName: 'SOL_ID',
            formColumnName: 'SOL_ID',
            formColumnName: 'SOL_ID',
            fieldName: 'SOL_ID',
            title: 'SOL_ID',
            formColumnType: 'VARCHAR',
          },
          {
            key: 'BIZ_SOL_NAME',
            columnCode: 'BIZ_SOL_NAME',
            formColumnCode: 'BIZ_SOL_NAME',
            columnName: 'BIZ_SOL_NAME',
            formColumnName: 'BIZ_SOL_NAME',
            formColumnName: 'BIZ_SOL_NAME',
            fieldName: 'BIZ_SOL_NAME',
            title: 'BIZ_SOL_NAME',
            formColumnType: 'VARCHAR',
          },
          {
            key: 'BIZ_ID',
            columnCode: 'BIZ_ID',
            formColumnCode: 'BIZ_ID',
            columnName: 'BIZ_ID',
            formColumnName: 'BIZ_ID',
            formColumnName: 'BIZ_ID',
            fieldName: 'BIZ_ID',
            title: 'BIZ_ID',
            formColumnType: 'VARCHAR',
          },
        ],
      },
    ];
    let mainSelectedData = [];
    let mainSelectedIds = [];
    let yearCutData = [{ code: 'CREATE_TIME', name: '创建时间' }];
    var list = newList.concat(
      sourceTableListA.map((table, i) => {
        if (table.tableScope == 'MAIN') {
          for (let i = 0; i < table.columnList.length; i++) {
            if (table.columnList[i].formColumnControlCode === 'YEAR') {
              yearCutData.push({
                code: table.columnList[i].formColumnCode,
                name: table.columnList[i].formColumnName,
              });
            }
          }
        }
        table['title'] = `${table['formTableName']}-${
          table.tableScope == 'MAIN' ? '主表' : '从表'
        }`;
        table['key'] = table['formTableCode'];
        table['value'] = table['formTableCode'];
        table['disabled'] = true;
        let children =
          table.columnList &&
          table.columnList &&
          table.columnList.map((col, f) => {
            col['title'] = col['formColumnName'];
            col['key'] = col['formColumnCode'];
            col['value'] = col['formColumnCode'];
            col['columnName'] = col['formColumnName'];
            col['columnCode'] = col['formColumnCode'];
            col['tableCode'] = table['formTableCode'];
            col['dsName'] = table['dsName'];
            if (
              table.tableScope == 'MAIN' &&
              _.find(dataDrive.pushColumnList, {
                sourceTableMain: 1,
                sourceTableColCode: col.formColumnCode,
              })
            ) {
              //已选择过的主表推送字段
              mainSelectedData.push(col);
              mainSelectedIds.push(col.formColumnCode);
            }
            return col;
          });
        table['children'] = children;
        return table;
      }),
    );
    if (checkedKeys.length == 0) {
      dispatch({
        type: 'dataDriven/updateStates',
        payload: {
          checkedKeys: _.concat(
            [
              'CREATE_TIME',
              'TITLE',
              'BIZ_STATUS',
              'SOL_ID',
              'BIZ_SOL_NAME',
              'BIZ_ID',
            ],
            mainSelectedIds,
          ),
          sortList: newList[0].children,
          dataDrive: {
            ...dataDrive,
            tableColumnList: _.concat(newList[0].children, mainSelectedData),
          },
        },
      });
    }
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        yearCutData,
        fieldTree: list,
        activeKey: 'LIST',
        selectedKeys: [],
        selectedIndex: -1,
      },
    });
  }
  return (
    <GlobalModal
      visible={true}
      // width={'95%'}
      title={dataDrive.id ? '修改方案' : '新增方案'}
      widthType={1}
      incomingWidth={document?.getElementById('dataDriven_container')?.offsetWidth || 1400}
      incomingHeight={610}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      centered
      bodyStyle={{overflow: 'auto', overflowY: 'hidden' }}
      getContainer={() => {
        return document.getElementById('dataDriven_container') || false;
      }}
      footer={
        [
          <Button onClick={onCancel}>
          取消
        </Button>,
          <Button
          type="primary"
          loading={loading.gloabal}
          htmlType={'submit'}
          onClick={()=>{form.submit()}}
        >
          保存
        </Button>
        
        ]
      }
    >
      <Spin spinning={loading.global}>
        <Form
          initialValues={dataDrive}
          form={form}
          ref={formRef}
          onFinish={onFinish.bind(this)}
          onValuesChange={onValuesChange.bind(this)}
          key={dataDrive.id}
          onFinishFailed={({ values, errorFields, outOfDate }) => {
            console.log(
              'values, errorFields, outOfDate ',
              values,
              errorFields,
              outOfDate,
            );
          }}
        >
          <Row gutter={0}>
            <Col span={6}>
              <Form.Item
                label="方案"
                name="planName"
                rules={[
                  { required: true, message: '请填写方案名称' },
                  { max: 50, message: '最多输入50个字符' },
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  },
                ]}
              >
                <Input placeholder={'请填写方案名称'} style={{ width: 130 }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="目标应用"
                name="targetModelId"
                rules={[{ required: true, message: '请选择目标应用' }]}
              >
                <TreeSelect
                  showSearch
                  treeNodeFilterProp="title"
                  treeData={treeData}
                  disabled={infoKey == 3 || !sourceDisabled()}
                  onSelect={onSelectTree.bind(
                    this,
                    'targetDsDynamic',
                    'targetTableList',
                    'targetModelId',
                  )}
                  style={{ width: 150 }}
                  dropdownRender={(ReactNode, props) => {
                    return (
                      <div style={{ whiteSpace: 'nowrap' }}>{ReactNode}</div>
                    );
                  }}
                  virtual={false}
                />
              </Form.Item>
            </Col>
            <Col span={6} id={'area'}>
              <Form.Item
                label="来源应用"
                name="sourceModeId"
                rules={[{ required: true, message: '请选择来源应用' }]}
              >
                <TreeSelect
                  showSearch
                  treeNodeFilterProp="title"
                  treeData={treeData}
                  disabled={infoKey == 'LIST' || infoKey == 'UPDATE' || sourceDisabled()}
                  onSelect={onSelectTree.bind(
                    this,
                    'sourceDsDynamic',
                    'sourceTableList',
                    'sourceModeId',
                  )}
                  style={{ width: 150 }}
                  dropdownRender={(ReactNode, props) => {
                    return (
                      <div style={{ whiteSpace: 'nowrap' }}>{ReactNode}</div>
                    );
                  }}
                  virtual={false}
                />
              </Form.Item>
            </Col>
            {driveType == 'PUSH' ? (
              <Col span={6}>
                <Form.Item
                  label="拆分类型"
                  name="isSplit"
                  rules={[{ required: true, message: '请选择来源应用' }]}
                >
                  <Select placeholder={'请选择拆分类型'} style={{ width: 130 }}>
                    {dataDrive.getType == 3 ? (
                      <Select.Option value={0}>不拆分推送</Select.Option>
                    ) : (
                      <>
                        <Select.Option value={0}>不拆分推送</Select.Option>
                        <Select.Option value={1}>拆分推送</Select.Option>
                      </>
                    )}
                  </Select>
                </Form.Item>
              </Col>
            ) : (
              ''
            )}
          </Row>
          {driveType == 'PUSH' && dataDrive.isSplit == 1 ? (
            <Row gutter={0}>
              <Col span={3}>
                <Form.Item label="推送拆分设置" name=""></Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="拆分方式"
                  name={'splitType'}
                  rules={[{ required: true, message: '请选择拆分方式' }]}
                >
                  <Select style={{ width: 86 }}>
                    <Select.Option value={'AVG'}>数量均分</Select.Option>
                    <Select.Option value={'SPLIT'}>逗号分隔</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="来源表"
                  name="pushSourceTableCode"
                  rules={[{ required: true, message: '请选择来源表' }]}
                >
                  <Select
                    // showSearch
                    // optionFilterProp="children"
                    // filterOption={(input, option) =>
                    //   (option?.label ?? '').includes(input)
                    // }
                    onChange={onChangeTable.bind(
                      this,
                      'pushSourceTableCode',
                      'pushSourceTableColCode',
                      'pushSourceColList',
                      sourceTableList,
                    )}
                    style={{ width: 130 }}
                  >
                    {sourceTableList &&
                      sourceTableList.length != 0 &&
                      sourceTableList.map((item, index) => {
                        return (
                          <Select.Option
                            key={index}
                            value={item['formTableCode']}
                          >
                            {item['formTableName']}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="字段"
                  name={'pushSourceTableColCode'}
                  rules={[{ required: true, message: '请选择来源表字段' }]}
                >
                  <Select
                    style={{ width: 130 }}
                    onChange={onChangeCol.bind(
                      this,
                      'pushSourceTableColCode',
                      'pushSourceTableColName',
                    )}
                  >
                    {pushSourceColListD &&
                      pushSourceColListD.length != 0 &&
                      pushSourceColListD.map((item, index) => {
                        return (
                          <Select.Option
                            key={index}
                            value={item['formColumnCode']}
                          >
                            {item['formColumnName']}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="目标表"
                  name="pushTargetTableCode"
                  rules={[{ required: true, message: '请选择目标表' }]}
                >
                  <Select
                    onChange={onChangeTable.bind(
                      this,
                      'pushTargetTableCode',
                      'pushTargetTableColCode',
                      'pushTargetColList',
                      targetTableList,
                    )}
                    style={{ width: 130 }}
                  >
                    {targetTableList &&
                      targetTableList.length != 0 &&
                      targetTableList.map((item, index) => {
                        return (
                          <Select.Option
                            key={index}
                            value={item['formTableCode']}
                          >
                            {item['formTableName']}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="字段"
                  name={'pushTargetTableColCode'}
                  rules={[{ required: true, message: '请选择目标表字段' }]}
                >
                  <Select
                    style={{ width: 130 }}
                    onChange={onChangeCol.bind(
                      this,
                      'pushTargetTableColCode',
                      'pushTargetTableColName',
                    )}
                  >
                    {pushTargetColListD &&
                      pushTargetColListD.length != 0 &&
                      pushTargetColListD.map((item, index) => {
                        return (
                          <Select.Option
                            key={index}
                            value={item['formColumnCode']}
                          >
                            {item['formColumnName']}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          ) : (
            ''
          )}
          {driveType == 'PULL' ? (
            <Tabs
              type="card"
              onChange={onChangeTab.bind(this)}
              // style={{ height: 460 }}
            >
              <TabPane tab="拉取" key="PULL">
                <FieldSet
                  info="PULL"
                  form={form}
                  onValuesChange={onValuesChange}
                  infoKey={infoKey}
                  title={'拉取字段配置'}
                />
              </TabPane>
              <TabPane tab="列表" key="LIST">
                <ListDesign
                  containerId={`dataDriven_container`}
                  namespace={'dataDriven'}
                  stateInfo={dataDriven}
                  dataName={'dataDrive'}
                  tableColumnName={'tableColumnList'}
                />
              </TabPane>
              <TabPane tab="更新" key="UPDATE">
                <FieldSet
                  info="UPDATE"
                  form={form}
                  infoKey={infoKey}
                  title={
                    '"更新"方案的来源表为"拉取"方案的目标表； "更新"方案的目标表为"拉取"方案的来源表。'
                  }
                />
              </TabPane>
            </Tabs>
          ) : (
            <FieldSet
              info="PUSH"
              form={form}
              infoKey={infoKey}
              onValuesChange={onValuesChange}
              title={'推送字段配置'}
            />
          )}

          {/* <Row className={styles.bottom_btn}>
            <Button
              type="primary"
              loading={loading.gloabal}
              htmlType={'submit'}
            >
              保存
            </Button>
            <Button onClick={onCancel} style={{ marginLeft: 8 }}>
              取消
            </Button>
          </Row> */}
        </Form>
      </Spin>
    </GlobalModal>
  );
}

export default connect(({ dataDriven, loading }) => ({
  dataDriven,
  loading,
}))(addListMoudles);
