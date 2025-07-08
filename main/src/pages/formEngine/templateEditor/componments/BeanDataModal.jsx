import { connect } from 'dva';
import { useState, useEffect } from 'react';
import {
  Select,
  Modal,
  Input,
  Tabs,
  Table,
  Button,
  Form,
  Row,
  Col,
  Checkbox,
} from 'antd';
import {
  beanOptionsColumns,
  detailColumns,
  EditableRow,
  EditableCell,
  smallLayout,
  layout,
  longLayout,
  eventTableProps,
} from './modalConfig';
import pinyinUtil from '../../../../service/pinyinUtil';
import IPagination from '../../../../componments/public/iPagination';
import { getFromColumnsToMap } from './util';
import styles from './buttonList.less';

const TabPane = Tabs.TabPane;

function BeanDataModal({
  isBeanModalVisible,
  setIsBeanModalVisible,
  dispatch,
  templateEditor,
}) {
  const {
    start,
    limit,
    searchWord,
    evenList,
    currentPage,
    returnCount,
    selectEventKeys,
    eventObj,
    selectEventRows,
    eventParams,
    eventResults,
    tableList,
    deployFormId,
    eventId,
    selectedResRowKeys,
    selectedParamsRowKeys,
  } = templateEditor;

  // const { fromMap, fromList } = getFromColumnsToMap(tableList);

  let fields = [];

  const [form] = Form.useForm();

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const [activeKey, setActiveKey] = useState('detail');

  const [eventModalVis, setEventModalVis] = useState(false);

  // 添加的下标
  const [count, setCount] = useState(2);

  const [newEventParams, setNewEventParams] = useState([]);

  const [newEventResults, setNewEventResults] = useState([]);

  const handleCancel = () => {
    setIsBeanModalVisible(false);

    dispatch({
      type: 'templateEditor/updateStates',
      payload: {
        BeanModalVisible: false,
        selectEventKeys: '',
        selectEventRows: [],
      },
    });
  };

  const onTabChange = value => {
    setActiveKey(value);
  };

  // 添加
  const handleAdd = () => {
    const newData = {
      id: count,
      paramName: 'name',
      paramType: 'String',
      paramDesc: 'desc',
      valueBound: 'FROMFORM',
    };
    setNewEventParams([...newEventParams, newData]);
    // setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleResAdd = () => {
    const newData = {
      id: count,
      resultCode: 'code',
      resultDesc: 'des',
      resultType: 'String',
      resultControl: 'MONEY',
    };

    setNewEventResults([...newEventResults, newData]);
    // setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  // 编辑表格保存
  const handleSave = row => {
    const newData = newEventParams.reduce((pre, cur) => {
      if (cur.id === row.id) {
        pre.push(row);
      } else {
        pre.push(cur);
      }
      return pre;
    }, []);

    // const newData = [...newEventParams];
    // const index = newData.findIndex(item => row.key === item.key);
    // const item = newData[index];
    // newData.splice(index, 1, {
    //   ...item,
    //   ...row,
    // });

    setNewEventParams(newData);
  };

  //
  const handleDetailSave = row => {
    const newData = newEventResults.reduce((pre, cur) => {
      if (cur.id === row.id) {
        pre.push(row);
      } else {
        pre.push(cur);
      }
      return pre;
    }, []);

    // const newData = [...newEventResults];
    // const index = newData.findIndex(item => row.key === item.key);
    // const item = newData[index];
    // newData.splice(index, 1, {
    //   ...item,
    //   ...row,
    // });
    setNewEventResults(newData);
  };

  const transFormNameChange = e => {
    let name = `${pinyinUtil.getFirstLetter(e.target.value)}`;

    form.setFieldsValue({
      code: `ds_${name}`,
    });
  };

  const getEventList = (start, limit, searchWord) => {
    dispatch({
      type: 'templateEditor/getEventList',
      payload: {
        start,
        limit,
        searchWord,
      },
    });
  };

  const handleEventModalOk = () => {
    form.setFieldsValue({
      eventName: selectEventRows[0]?.eventName || '',
      eventMethod: selectEventRows[0]?.eventMethod || '',
    });

    dispatch({
      type: 'templateEditor/getEventDetail',
      payload: {
        eventId: selectEventKeys[0],
      },
    });

    if (selectEventRows.length === 0) {
      setNewEventParams([]);
      setNewEventResults([]);
    }

    setEventModalVis(false);
  };
  const handleEventModalCancel = () => {
    setEventModalVis(false);
  };

  const onFinish = value => {
    const newValue = {
      ...value,
      id: Object.keys(eventObj).length > 0 ? eventObj.id : '',
      isArray: value.isArray ? 1 : 0,
      templateId: deployFormId,
      eventId: selectEventRows[0]?.id || eventObj?.eventId || '',
      datasetParams: newEventParams,
      datasetResults: newEventResults,
    };
    // delete newValue.eventName;
    console.log('onFinish', newValue);
    dispatch({
      type: 'templateEditor/createDataset',
      payload: JSON.stringify(newValue),
    });

    setEventModalVis(false);

    dispatch({
      type: 'templateEditor/updateStates',
      payload: {
        BeanModalVisible: false,
      },
    });
  };

  const onValuesChange = (changedValues, allValues) => {
    // console.log('onValuesChange:', changedValues, allValues);
  };

  const handleCheckChange = e => {
    console.log('dddddddddddddddd', e.target.checked);
    form.setFieldsValue({
      isArray: e.target.checked ? 1 : 0,
    });
  };

  const onSelectChange = (text, record, index, selVal) => {
    const newParams = JSON.parse(JSON.stringify(newEventParams));
    newParams[index].valueBound = selVal;
    setNewEventParams(newParams);
    console.log('onSelectChange', text, record, index, selVal);
  };

  const onInputChange = (text, record, index, e) => {
    const newParams = JSON.parse(JSON.stringify(newEventParams));
    newParams[index].paramValue = e.target.value;
    setNewEventParams(newParams);
    console.log('onSelectChange', text, record, index, e.target.value);
  };

  const onSelectFormChange = (text, record, index, selVal) => {
    const newParams = JSON.parse(JSON.stringify(newEventParams));
    newParams[index].paramValue = selVal;
    setNewEventParams(newParams);
  };

  const onFormatSelectChange = (text, record, index, selVal) => {
    const newResults = JSON.parse(JSON.stringify(newEventResults));
    newResults[index].resultControl = selVal;
    setNewEventResults(newResults);
  };

  const onResultTypetChange = (text, record, index, selVal) => {
    const newResults = JSON.parse(JSON.stringify(newEventResults));
    newResults[index].resultType = selVal;
    setNewEventResults(newResults);
  };

  const onParamTypeChange = (text, record, index, selVal) => {
    const newParams = JSON.parse(JSON.stringify(newEventParams));
    newParams[index].paramType = selVal;
    setNewEventParams(newParams);
  };

  const handleResDelete = () => {
    const newData = newEventResults.reduce((pre, cur) => {
      if (
        selectedResRowKeys.length > 0 &&
        !selectedResRowKeys.includes(cur.id)
      ) {
        pre.push(cur);
      }
      return pre;
    }, []);

    setNewEventResults(newData);
  };

  const handleParamsDelete = () => {
    const newData = newEventParams.reduce((pre, cur) => {
      if (
        selectedParamsRowKeys.length > 0 &&
        !selectedParamsRowKeys.includes(cur.id)
      ) {
        pre.push(cur);
      }
      return pre;
    }, []);

    setNewEventParams(newData);
  };

  useEffect(() => {
    getEventList(start, limit, searchWord);
  }, []);

  useEffect(() => {
    if (eventParams.length > 0) {
      setNewEventParams(eventParams);
    }
  }, [eventParams]);

  useEffect(() => {
    if (eventResults.length > 0) {
      setNewEventResults(eventResults);
    }
  }, [eventResults]);

  useEffect(() => {
    if (Object.keys(eventObj).length > 0) {
      const { datasetParams, datasetResults } = eventObj;
      setNewEventParams(datasetParams);
      setNewEventResults(datasetResults);
    } else {
      setNewEventParams([]);
      setNewEventResults([]);
    }
  }, [eventObj]);

  return (
    <Modal
      title="JavaBean数据集"
      visible={isBeanModalVisible}
      onCancel={handleCancel}
      maskClosable={false}
      footer={false}
      width={900}
      style={{ padding: '10px' }}
    >
      <Form
        form={form}
        fields={fields}
        initialValues={
          Object.keys(eventObj).length > 0
            ? eventObj
            : { type: 'java-class', isArray: false }
        }
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Row gutter={0}>
          <Col span={6}>
            <Form.Item
              {...layout}
              label="名称"
              name="name"
              rules={[
                { required: true, message: '请输入名称' },
                { max: 20, message: '最多输入20个字符' },
              ]}
            >
              <Input onChange={e => transFormNameChange(e)} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              {...layout}
              label="编码"
              name="code"
              rules={[
                { required: true, message: '请输入编码' },
                { max: 20, message: '最多输入20个字符' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              {...layout}
              label="类型"
              name="type"
              rules={[{ required: true, message: '请输入类型' }]}
            >
              <Select
                disabled
                options={[
                  {
                    value: 'java-class',
                    label: 'java-class',
                  },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              {...smallLayout}
              label="集合"
              name="isArray"
              valuePropName="checked"
            >
              <Checkbox onChange={handleCheckChange} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={0}>
          <Col span={7}>
            <Form.Item {...longLayout} label="事件中心" name="eventName">
              <Input.TextArea
                onFocus={() => setEventModalVis(true)}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              {...longLayout}
              label="方法名"
              name="eventMethod"
              rules={[{ required: true, message: '请选择方法名' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {/* 选择事件弹框 */}
        {eventModalVis && (
          <Modal
            title="选择事件"
            visible={eventModalVis}
            onOk={handleEventModalOk}
            onCancel={handleEventModalCancel}
            width={700}
            style={{ padding: '10px' }}
          >
            <div>
              <Table
                {...eventTableProps({
                  dispatch,
                  evenList,
                  selectedRowKeys: selectEventKeys,
                  selectedRows: selectEventRows,
                })}
                style={{ height: 'calc(100vh - 400px)' }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '600px',
                  height: '52px',
                  bottom: '50px',
                  right: 0,
                }}
              >
                <IPagination
                  current={currentPage}
                  total={returnCount}
                  onChange={(page, size) => {
                    dispatch({
                      type: 'templateEditor/updateStates',
                      payload: {
                        start: page,
                        limit: size,
                      },
                    });
                    getEventList(page, size, searchWord);
                  }}
                  pageSize={limit}
                  isRefresh={true}
                  refreshDataFn={() => {
                    getEventList(page, size, searchWord);
                  }}
                />
              </div>
            </div>
          </Modal>
        )}

        <Tabs
          defaultActiveKey={'detail'}
          activeKey={activeKey}
          onChange={onTabChange}
        >
          <TabPane tab="字段明细" key="detail">
            <Button
              style={{ marginBottom: '20px' }}
              onClick={handleResAdd}
              disabled={selectEventKeys.length > 0}
            >
              新增
            </Button>
            <Button
              style={{ marginBottom: '20px', marginLeft: '20px' }}
              onClick={handleResDelete}
              disabled={selectEventKeys.length > 0}
            >
              删除
            </Button>
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              dataSource={newEventResults}
              bordered
              pagination={false}
              rowKey={'id'}
              columns={detailColumns({
                handleDetailSave,
                onFormatSelectChange,
                canEditor: !selectEventKeys.length > 0,
                onResultTypetChange,
              })}
              rowSelection={{
                onChange: (selectedRowKeys, selectedRows) => {
                  dispatch({
                    type: 'templateEditor/updateStates',
                    payload: {
                      selectedResRowKeys: selectedRowKeys,
                    },
                  });
                },
                type: 'checkbox',
              }}
              scroll={{ y: 'calc(100vh - 600px)' }}
            />
            ;
          </TabPane>
          <TabPane tab="参数信息" key="options">
            <Button
              style={{ marginBottom: '20px' }}
              onClick={handleAdd}
              disabled={selectEventKeys.length > 0}
            >
              新增
            </Button>

            <Button
              style={{ marginBottom: '20px', marginLeft: '20px' }}
              onClick={handleParamsDelete}
              disabled={selectEventKeys.length > 0}
            >
              删除
            </Button>

            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              pagination={false}
              dataSource={newEventParams}
              rowKey={'id'}
              rowSelection={{
                onChange: (selectedRowKeys, selectedRows) => {
                  dispatch({
                    type: 'templateEditor/updateStates',
                    payload: {
                      selectedParamsRowKeys: selectedRowKeys,
                    },
                  });
                },
                type: 'checkbox',
              }}
              columns={beanOptionsColumns({
                handleSave,
                tableList,
                onSelectChange,
                onInputChange,
                onSelectFormChange,
                canEditor: !selectEventKeys.length > 0,
                onParamTypeChange,
              })}
              scroll={{ y: 'calc(100vh - 600px)' }}
            />
          </TabPane>
        </Tabs>
        <Row style={{ width: '150px', margin: '0 auto' }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
            取消
          </Button>
        </Row>
      </Form>
    </Modal>
  );
}

export default connect(({ templateEditor }) => ({
  templateEditor,
}))(BeanDataModal);
