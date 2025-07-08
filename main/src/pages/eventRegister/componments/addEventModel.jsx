import { useEffect, useState } from 'react';
import styles from './addEventModel.less';
import { connect } from 'dva';
import { Modal, Form, Input, Row, Col, Select, Button, message } from 'antd';
import EditTable from './editTable';
import GlobalModal from '../../../componments/GlobalModal';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
function EventRegister({
  dispatch,
  eventRegister,
  layoutG,
  eventAddOrModify,
  record,
}) {
  const {
    tableData,
    tableSelectData,
    editingKey,
    dataDriver,
    returnCount,
    currentPage,
  } = eventRegister;

  const [eventForm] = Form.useForm();

  useEffect(() => {
    if (eventAddOrModify == 'modifyEvent') {
      //修改
      eventForm.setFieldsValue({
        eventName: record.eventName,
        eventMethod: record.eventMethod,
        remark: record.remark,
        dataDriver: record.dataDriverId || '',
      });

      dispatch({
        type: 'eventRegister/getEventRegisterParams',
        payload: {
          eventId: record.id,
        },
      });
    } else {
      //新增
      dispatch({
        type: 'eventRegister/updateStates',
        payload: {
          tableData: [],
          editingKey: '',
        },
      });
    }
  }, []);

  const selectModelFn = () => {};

  //取消
  const onCancel = () => {
    dispatch({
      type: 'eventRegister/updateStates',
      payload: {
        isShowAddModal: false,
      },
    });
  };

  //保存
  const handleOk = value => {
    console.log(value);
    for (let key in value) {
      if (
        typeof value[key] == 'string' &&
        (key == 'eventName' || key == 'eventMethod')
      ) {
        value[key] = value[key].trim();
      }
    }
    if (editingKey == '') {
      if (eventAddOrModify == 'addEvent') {
        dispatch({
          type: 'eventRegister/addEventRegister',
          payload: {
            eventName: value.eventName,
            eventMethod: value.eventMethod,
            dataDriverId: value.dataDriver ? value.dataDriver : '',
            remark: value.remark,
            params: tableData ? JSON.stringify(tableData) : '',
          },
          callback: () => {
            dispatch({
              type: 'eventRegister/getEventTableData',
              payload: {
                start: currentPage,
                limit: 10,
                searchWord: '',
              },
            });
            dispatch({
              type: 'eventRegister/updateStates',
              payload: {
                isShowAddModal: false,
              },
            });
          },
        });
      } else {
        dispatch({
          type: 'eventRegister/updataEventRegister',
          payload: {
            eventId: record.id,
            eventName: value.eventName,
            eventMethod: value.eventMethod,
            dataDriverId: value.dataDriver ? value.dataDriver : '',
            remark: value.remark,
            params: tableData ? JSON.stringify(tableData) : '',
          },
          callback: () => {
            dispatch({
              type: 'eventRegister/getEventTableData',
              payload: {
                start: currentPage,
                limit: 10,
                searchWord: '',
              },
            });
            dispatch({
              type: 'eventRegister/updateStates',
              payload: {
                isShowAddModal: false,
              },
            });
          },
        });
      }
    } 
    else {
      message.warning('有未保存的数据，请先保存');
    }
  };

  //取消
  const handleCancel = () => {
    dispatch({
      type: 'eventRegister/updateStates',
      payload: {
        isShowAddModal: false,
      },
    });
  };

  //初始化参数
  const onDefaultParam = () => {
    dispatch({
      type: 'eventRegister/updateStates',
      payload: {
        tableData: [
          {
            key: 0,
            paramName: 'bizInfoId',
            paramType: 'String',
            paramDesc: '业务信息id',
          },
          {
            key: 1,
            paramName: 'bizSolId',
            paramType: 'String',
            paramDesc: '业务方案id',
          },
          {
            key: 2,
            paramName: 'formDeployId',
            paramType: 'String',
            paramDesc: '发布表单id',
          },
          {
            key: 3,
            paramName: 'jsonStr',
            paramType: 'String',
            paramDesc: '额外参数，json格式字符串',
          },
        ],
        editingKey: '',
      },
    });
  };

  //添加一行
  const handleAdd = () => {
    const count =
      tableData.length != 0
        ? tableData[tableData.length - 1].key + 1
        : tableData.length + 1;
    const newData = {
      key: count,
      paramName: '',
      paramType: '',
      paramDesc: '',
    };
    dispatch({
      type: 'eventRegister/updateStates',
      payload: {
        tableData: [...tableData, newData],
      },
    });
    
  };

  //删除表格数据
  const handleDelete = () => {
    if(tableSelectData.length==0){
      message.error('请先勾选一条')
    }
    let tempArr = [];
    tableSelectData.forEach((selItem, selInd) => {
      tempArr.push(selItem.paramName);
    });
    let newData = tableData.filter(item => {
      return !tempArr.includes(item.paramName);
    });
    dispatch({
      type: 'eventRegister/updateStates',
      payload: {
        tableData: newData,
        tableSelectId: [],
        tableSelectData: [],
        editingKey: '',
      },
    });
  };

  return (
    <GlobalModal
      title={eventAddOrModify == 'addEvent' ? '新增事件' : '修改事件'}
      visible={true}
      onOk={handleOk}
      widthType={2}
      onCancel={handleCancel}
      footer={false}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById('eventRegister_container')||false;
      }}
    >
      <Form form={eventForm} onFinish={handleOk}>
        <Row>
          <Col span={24}>
            <Form.Item
              {...layout}
              label="事件名称"
              name="eventName"
              rules={[
                { required: true, message: '请输入事件名称' },
                { max: 50, message: '最多输入50个字符' },
                { whitespace: true, message: '请输入事件名称!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {/* 0831 测试用 200长度 */}
            <Form.Item
              {...layout}
              label="方法名称"
              name="eventMethod"
              rules={[
                { required: true, message: '请输入方法名称' },
                { max: 200, message: '最多输入200个字符' },
                { whitespace: true, message: '请输入方法名称!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {/**

                <Row>
                    <Col span={24}>
                        <Form.Item
                        {...layout}
                            label="数据驱动推送"
                            name="dataDriver"
                        >
                            <Select
                                style={{ width: '100%' }}
                                onSelect={selectModelFn}
                            >
                                {dataDriver.map(item => <Option value={item.id}>{item.planName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>*/}
        <Row>
          <Col span={24}>
            <Form.Item
              {...layout}
              label="备注"
              name="remark"
              rules={[{ max: 200, message: '最多输入200个字符' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{marginBottom: 8}}>
          <Col span={16}>
            <Button onClick={onDefaultParam}>初始化参数</Button>
            <Button style={{ marginLeft: 8 }} onClick={handleAdd}>
              添加
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleDelete}>
              删除
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <EditTable />
          </Col>
        </Row>
        <Row align={'center'} style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            取消
          </Button>
        </Row>
      </Form>
    </GlobalModal>
  );
}
export default connect(({ eventRegister, layoutG }) => ({
  eventRegister,
  layoutG,
}))(EventRegister);
