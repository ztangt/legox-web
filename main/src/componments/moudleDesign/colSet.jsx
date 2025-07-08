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
  Radio,
  InputNumber,
} from 'antd';
import styles from './index.less';
import { useDispatch } from 'umi';
import AddButtonModal from './addButtonModal';

const { TreeNode } = Tree;

const xwyShuoDe = ['DICTCODE', 'MONEY', 'DATE'];

function listSet({ stateInfo, namespace, dataName, tableColumnName }) {
  const {
    selectedIndex,
    formKey,
    allFieldList,
    buttonList,
    dictTreeData,
    listMoudleInfo,
    isShowButtonModal,
  } = stateInfo;

  const publicProps = {
    stateInfo,
    namespace,
    dataName,
    tableColumnName,
    dispatch: useDispatch(),
  };

  const [showStyle, setShowStyle] = useState(stateInfo[dataName].showStyle);
  const layouts = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const obj =
    stateInfo[dataName] &&
    stateInfo[dataName][tableColumnName] &&
    stateInfo[dataName][tableColumnName].length != 0 &&
    selectedIndex != -1
      ? stateInfo[dataName][tableColumnName][selectedIndex]
      : {};
  useEffect(() => {
    if (selectedIndex != -1 && stateInfo[dataName][tableColumnName]) {
      if (stateInfo[dataName][tableColumnName][selectedIndex] && !showStyle) {
        setShowStyle(
          stateInfo[dataName][tableColumnName][selectedIndex].showStyle,
        );
      }
      if (!_.isEmpty(obj)) {
        obj['sortFlag'] =
          obj.sortFlag == null ? true : obj.sortFlag == 1 ? true : false;
        obj['sumFlag'] = obj.sumFlag && obj.sumFlag == 1 ? true : false;
        obj['fixedFlag'] = obj.fixedFlag && obj.fixedFlag == 1 ? true : false;
        if (namespace == 'dataDriven' && obj.alignStyle) {
          obj.colAlignStyle = obj.alignStyle;
        }
        if (!obj.colAlignStyle) {
          obj.colAlignStyle = 'LEFT';
        }
        if (!obj.showStyle) {
          if (
            listMoudleInfo?.deployFormId != '0' &&
            namespace != 'dataDriven'
          ) {
            for (let i = 0; i < allFieldList.length; i++) {
              const element = allFieldList[i];
              if (obj.key === element.key) {
                if (xwyShuoDe.includes(element.colType)) {
                  switch (element.colType) {
                    case 'DATE':
                      obj.showStyle = 'DATE';
                      obj.showStyleInfo = 'YYYY-MM-DD';
                      setShowStyle('DATE');
                      break;
                    case 'MONEY':
                      obj.showStyle = 'MONEY';
                      obj.showStyleInfo = 'SECOND';
                      setShowStyle('MONEY');
                      break;
                    case 'DICTCODE':
                      obj.showStyle = 'DICTCODE';
                      setShowStyle('DICTCODE');
                      obj['showStyleInfo'] = '';
                      break;
                    default:
                      break;
                  }
                } else {
                  obj.showStyle = 'NONE';
                  obj.showStyleInfo = '';
                  setShowStyle('NONE');
                }
              }
            }
          } else {
            obj.showStyle = 'NONE';
            obj.showStyleInfo = '';
            setShowStyle('NONE');
          }
        } else {
          setShowStyle(obj.showStyle);
        }
        if (!obj.widthP) {
          obj.widthP = '%';
        }
        // if (obj.showStyle === 'DICTCODE') {
        //   if (listMoudleInfo.deployFormId) {
        //     obj['showStyleInfo'] = '参照表单'
        //   } else {
        //     obj['showStyleInfo'] = ''
        //     debugger
        //   }
        // }
      }
    }
    form.setFieldsValue(obj);
  }, [_.cloneDeep(obj)]);

  useEffect(() => {
    if (obj?.buttonId) {
      dispatch({
        type: `${namespace}/getFuncLibById`,
        payload: {
          funcLibId: obj.buttonId,
        },
        callback: handleName => {
          if (handleName) {
            form.setFieldsValue({ handleName });
          } else {
            dispatch({
              type: `${namespace}/getBtnDetailById`,
              payload: {
                buttonId: obj.buttonId,
              },
              callback: handleName => {
                form.setFieldsValue({ handleName });
              },
            });
          }
        },
      });
    } else {
      form.setFieldsValue({ handleName: '' });
    }
  }, [obj?.buttonId]);

  // useEffect(() => {
  //   if (!listMoudleInfo.deployFormId) {
  //   debugger

  //     if (showStyle == 'DICTCODE') {
  //   debugger

  //       form.setFieldsValue({ showStyleInfo: '' });
  //     }
  //   }

  // }, [listMoudleInfo.deployFormId]);

  // useEffect(() => {
  //   if (namespace !== 'dataDriven' && !dictTreeData.length) {
  //     dispatch({
  //       type: `${namespace}/getDictTypeTree`,
  //     });
  //   }
  // }, []);

  function onValuesChange(changedValues, allValues) {
    if (allValues['widthN'] && allValues['widthP']) {
      allValues['width'] = `${allValues['widthN']},${allValues['widthP']}`;
    }
    if (!allValues['widthN']) {
      allValues['width'] = '';
    }
    if (allValues.colAlignStyle) {
      allValues['alignStyle'] = allValues.colAlignStyle;
    }
    if (changedValues['showStyle'] == 'DATE') {
      allValues['showStyleInfo'] = 'YYYY-MM-DD';
      form.setFieldsValue({ showStyleInfo: 'YYYY-MM-DD' });
    }
    if (changedValues['showStyle'] == 'MONEY') {
      allValues['showStyleInfo'] = 'SECOND';
      form.setFieldsValue({ showStyleInfo: 'SECOND' });
    }

    if (changedValues['showStyle'] == 'DICTCODE') {
      // if (listMoudleInfo.deployFormId) {
      //   allValues['showStyleInfo'] = '参照表单';
      //   form.setFieldsValue({ showStyleInfo: '参照表单' });
      // } else {
      allValues['showStyleInfo'] = '';
      form.setFieldsValue({ showStyleInfo: '' });
      // debugger
      // }
    }

    stateInfo[dataName][tableColumnName][selectedIndex] = {
      ...stateInfo[dataName][tableColumnName][selectedIndex],
      ...allValues,
    };
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: stateInfo[dataName],
        formKey: formKey + 1,
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

  function onChange(value) {
    setShowStyle(value);
    if (value == 'MONEY') {
      form.setFieldsValue({ showStyleInfo: 'SECOND' });
    } else if (value == 'DATE') {
      form.setFieldsValue({ showStyleInfo: 'YYYY-MM-DD' });
    }
    // else if (value == 'DICTCODE') {
    //   if (listMoudleInfo.deployFormId) {
    //     form.setFieldsValue({ showStyleInfo: '参照表单' });
    //     // debugger
    //   } else {
    //     form.setFieldsValue({ showStyleInfo: '' });
    //     // debugger
    //   }
    // }
    else {
      form.setFieldsValue({ showStyleInfo: '' });
    }
  }

  const renderCode = () => {
    return <TreeNode title="参照表单" key="1" value="" />;
  };

  function handleClear(e) {
    if (!e.target.value) {
      form.setFieldsValue({ [`handleName`]: '' });
      stateInfo[dataName][tableColumnName][selectedIndex]['buttonId'] = null;
      stateInfo[dataName][tableColumnName][selectedIndex]['minioUrl'] = null;
      stateInfo[dataName][tableColumnName][selectedIndex]['handleName'] = '';
      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          [dataName]: stateInfo[dataName],
        },
      });
    }
  }

  return (
    <Form
      // requiredMark={false}
      onValuesChange={onValuesChange.bind(this)}
      key={selectedIndex}
      form={form}
    >
      <Form.Item label="字段名称" name="fieldName" className={styles.form}>
        <Input style={{ width: 163 }} disabled />
      </Form.Item>
      <Form.Item
        label="列表名称"
        name="columnName"
        className={styles.form}
        rules={[
          { required: true, message: '请填写列表名称' },
          { max: 30, message: '最多输入30个字符' },
          { whitespace: true, message: '请填写列表名称' },
        ]}
      >
        <Input style={{ width: 163 }} />
      </Form.Item>
      <Form.Item label="格式方式" name="showStyle" className={styles.form}>
        <Select
          style={{ width: 163 }}
          placeholder="请选择常规查询项"
          onChange={onChange.bind(this)}
        >
          <Select.Option value="NONE">无</Select.Option>
          <Select.Option value="MONEY">金额格式化</Select.Option>
          <Select.Option value="DATE">日期格式化</Select.Option>
          <Select.Option value="DICTCODE">码表格式化</Select.Option>
          <Select.Option value="PERCENT">百分比格式化</Select.Option>
        </Select>
      </Form.Item>
      {/* !listMoudleInfo.deployFormId && */}
      {showStyle == 'DICTCODE' && namespace !== 'dataDriven' && (
        <Form.Item
          label="码表值域"
          name="showStyleInfo"
          className={styles.form}
        >
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
            {listMoudleInfo.deployFormId ? (
              <TreeNode title="参照表单" key="1" value="" />
            ) : (
              ''
            )}
            {dictTreeData.length > 0 ? renderTreeNodes(dictTreeData) : ''}
          </TreeSelect>
        </Form.Item>
      )}
      {showStyle == 'MONEY' && (
        <Form.Item
          label="格式标准"
          name="showStyleInfo"
          className={styles.form}
        >
          <Select style={{ width: 163 }} placeholder="请选择格式标准">
            <Select.Option value="SECOND">两位小数</Select.Option>
            <Select.Option value="THUS_SEC">千分位两位小数</Select.Option>
            <Select.Option value="FOURTH">四位小数</Select.Option>
            <Select.Option value="THUS_FOU">千分位四位小数</Select.Option>
            <Select.Option value="SIXTH">六位小数</Select.Option>
            <Select.Option value="THUS_SIX">千分位六位小数</Select.Option>
          </Select>
        </Form.Item>
      )}
      {showStyle == 'DATE' && (
        <Form.Item
          label="格式标准"
          name="showStyleInfo"
          className={styles.form}
        >
          <Select style={{ width: 163 }} placeholder="请选择格式标准">
            <Select.Option value="YYYY">YYYY</Select.Option>
            <Select.Option value="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            <Select.Option value="YYYY-MM">YYYY-MM</Select.Option>
            <Select.Option value="YYYY-MM-DD HH:mm:ss">
              YYYY-MM-DD HH:mm:ss
            </Select.Option>
            <Select.Option value="MM-DD">MM-DD</Select.Option>
            <Select.Option value="MM">MM</Select.Option>
          </Select>
        </Form.Item>
      )}
      <Form.Item
        label="结果合计"
        name="sumFlag"
        className={styles.form}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item label="对齐方式" name="colAlignStyle" className={styles.form}>
        <Radio.Group>
          <Radio value={'LEFT'}>左</Radio>
          <Radio value={'MIDDLE'}>中</Radio>
          <Radio value={'RIGHT'}>右</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="&nbsp;&nbsp;&nbsp;&nbsp;固定列"
        name="fixedFlag"
        className={styles.form}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label="点击排序"
        name="sortFlag"
        valuePropName="checked"
        className={styles.form}
      >
        <Switch />
      </Form.Item>
      <Row>
        <Col>
          <Form.Item
            label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;列宽"
            name="widthN"
          >
            <InputNumber style={{ width: 120 }} min={0} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="" name="widthP">
            <Select>
              <Select.Option value="px">px</Select.Option>
              <Select.Option value="%">%</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="函数引用" name="handleName" className={styles.form}>
        <Input
          style={{ width: 163 }}
          allowClear
          onChange={handleClear}
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
                    isShowButtonModal: true,
                  },
                });
              },
            });
          }}
        />
      </Form.Item>
      {isShowButtonModal && (
        <AddButtonModal form={form} {...publicProps}></AddButtonModal>
      )}
    </Form>
  );
}
export default listSet;
