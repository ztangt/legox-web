import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Input,
  Select,
  Checkbox,
  Table,
  message,
  Tabs,
} from 'antd';
import styles from '../index.less';
import GlobalModal from '../../../componments/GlobalModal';
const TabPane = Tabs.TabPane;
function AddInterface({ dispatch, interfaceManagement }) {
  const { paramsData, selectedRowKeys, paramsDataOther, selectedRowKeysOther, detailData } = interfaceManagement;
  console.log(detailData, 'detailData');
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState('detail');
  const layouts = { labelCol: { span: 12 }, wrapperCol: { span: 10 } };
  const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
  useEffect(() => {
    form.setFieldsValue({
      code: detailData && detailData.code,
      name: detailData && detailData.name,
      isArray: detailData && detailData.isArray == 1 ? true : false,
      apiUrl: detailData && detailData.apiUrl,
    });
  }, [detailData]);
  const onCancel = () => {
    dispatch({
      type: 'interfaceManagement/updateStates',
      payload: {
        isShowAddInterface: false,
        paramsData: [],
        paramsDataOther: [],
        detailData: {},
      },
    });
  };
  const onValuesChange = () => {};
  const onFinish = values => {
    values.apiMethod = values.apiMethod ? values.apiMethod : 'GET';
    values.isArray = values.isArray ? 1 : 0;
    values.type = 2;
    if (detailData.id) {
      values.id = detailData.id;
    }
    const newObj = {
      ...values,
      apiResultList: paramsData || [],
      apiParamList: paramsDataOther || [],
    };
    dispatch({
      type: 'interfaceManagement/addApiManage',
      payload: JSON.stringify(newObj),
      callback: () => {
        onCancel();
      },
    });
  };
  const changeValue = value => {
    switch (value) {
      case 'GET':
        form.setFieldsValue({
          apiMethod: 'GET',
        });
        return;
    }
  };
  const changeParamsValue = (name, key, value) => {
    if (activeKey === 'detail') {
      paramsData.forEach(item => {
        if (item.key == key && name == 'colType') {
          item['colType'] = value;
        } else if (item.key == key && name == 'colCode') {
          item['colCode'] = value.target.value;
        } else if (item.key == key && name == 'colName') {
          item['colName'] = value.target.value;
        }
      });
      dispatch({
        type: 'interfaceManagement/updateStates',
        payload: {
          paramsData: [...paramsData],
        },
      });
    } else {
      paramsDataOther.forEach(item => {
        if (item.key == key && name == 'paramName') {
          item['paramName'] = value.target.value;
        } else if (item.key == key && name == 'paramCode') {
          item['paramCode'] = value.target.value;
        } else if (item.key == key && name == 'paramType') {
          item['paramType'] = value;
        } else if (item.key == key && name == 'defaultVal') {
          item['defaultVal'] = value.target.value;
        }
      });
      dispatch({
        type: 'interfaceManagement/updateStates',
        payload: {
          paramsDataOther: [...paramsDataOther],
        },
      });
    }
  };
  const tableProps = {
    columns: activeKey === 'detail' ? [
      {
        title: '序号',
        width: 60,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '返回值code',
        dataIndex: 'colCode',
        render: (text, record) => (
          <Input
            value={text}
            style={{ width: 200 }}
            onChange={changeParamsValue.bind(this, 'colCode', record.key)}
          />
        ),
      },
      {
        title: '返回值name',
        dataIndex: 'colName',
        render: (text, record) => (
          <Input
            value={text}
            style={{ width: 200 }}
            onChange={changeParamsValue.bind(this, 'colName', record.key)}
          />
        ),
      },
      {
        title: '返回值类型',
        dataIndex: 'colType',
        render: (text, record) => (
          <Select
            value={text}
            style={{ width: 200 }}
            onChange={changeParamsValue.bind(this, 'colType', record.key)}
            options={[
              {
                value: 'String',
                label: '字符串',
              },
              {
                value: 'bigint',
                label: '时间',
              },
              {
                value: 'BigDecimal',
                label: '金额',
              },
              {
                value: 'DICTCODE',
                label: '码表',
              },
              {
                value: 'Long',
                label: '数字',
              },
            ]}
          />
        ),
      },
    ] 
    : 
    [
      {
        title: '序号',
        width: 60,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '参数code',
        dataIndex: 'paramCode',
        render: (text, record) => (
          <Input
            value={text}
            style={{ width: 150 }}
            onChange={changeParamsValue.bind(this, 'paramCode', record.key)}
          />
        ),
      },
      {
        title: '参数name',
        dataIndex: 'paramName',
        render: (text, record) => (
          <Input
            value={text}
            style={{ width: 150 }}
            onChange={changeParamsValue.bind(this, 'paramName', record.key)}
          />
        ),
      },
      {
        title: '参数类型',
        dataIndex: 'paramType',
        render: (text, record) => (
          <Select
            value={text}
            style={{ width: 150 }}
            onChange={changeParamsValue.bind(this, 'paramType', record.key)}
            options={[
              {
                value: 'String',
                label: '字符串',
              }
            ]}
          />
        ),
      },
      {
        title: '参数默认值',
        dataIndex: 'defaultVal',
        render: (text, record) => (
          <Input
            value={text}
            style={{ width: 150 }}
            onChange={changeParamsValue.bind(this, 'defaultVal', record.key)}
          />
        ),
      },
    ],
    pagination:false,
    dataSource: activeKey === 'detail' ? paramsData : paramsDataOther,
    rowSelection: {
      selectedRowKeys: activeKey === 'detail' ? selectedRowKeys : selectedRowKeysOther,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, 'selectedRowKeys');
        if (activeKey === 'detail') {
          dispatch({
            type: 'interfaceManagement/updateStates',
            payload: {
              selectedRowKeys,
            },
          });
        } else {
          dispatch({
            type: 'interfaceManagement/updateStates',
            payload: {
              selectedRowKeysOther: selectedRowKeys,
            },
          });
        }
        
      },
    },
  };
  const addParams = () => {
    const key =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);

    if (activeKey === 'detail') { 
      paramsData.push({
        key: key,
        colCode: '',
        colName: '',
        colType: '',
      });
      dispatch({
        type: 'interfaceManagement/updateStates',
        payload: {
          paramsData: [...paramsData],
        },
      });
    } else {
      paramsDataOther.push({
        key: key,
        paramName: '',
        paramCode: '',
        paramType: '',
        defaultVal: '',
      });
      dispatch({
        type: 'interfaceManagement/updateStates',
        payload: {
          paramsDataOther: [...paramsDataOther],
        },
      });
    }
    
    
  };
  //删除
  const deleteParams = keys => {
    if (keys.length > 0) {
      if (activeKey === 'detail') {
        const newData = paramsData.filter(item => !keys.includes(item.key));
        dispatch({
          type: 'interfaceManagement/updateStates',
          payload: {
            paramsData: [...newData],
          },
        });
      } else {
        const newData = paramsDataOther.filter(item => !keys.includes(item.key));
        dispatch({
          type: 'interfaceManagement/updateStates',
          payload: {
            paramsDataOther: [...newData],
          },
        });
      }
    } else {
      message.error('请选择一条数据');
    }
  };

  const onTabChange = value => {
    setActiveKey(value);
  };

  return (
    <div>
      <GlobalModal
        open={true}
        title="接口设计"
        widthType={1}
        incomingWidth={800}
        incomingHeight={400}
        onCancel={onCancel}
        className={styles.design_content}
        getContainer={() => {
          return (
            document.getElementById('interfaceManagement_container') || false
          );
        }}
        mask={false}
        maskClosable={false}
        centered
        footer={[
          <Button onClick={onCancel}>取消</Button>,
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              form.submit();
            }}
          >
            保存
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          // initialValues={{
          //     code:detailData&&detailData.code,
          //     name:detailData&&detailData.name,
          //     isArray:detailData&&detailData.isArray==1?true:false,
          //     apiUrl:detailData&&detailData.apiUrl
          // }}
        >
          <Row gutter={0}>
            <Col span={6}>
              <Form.Item
                {...layout}
                label="编码"
                name="code"
                colon={false}
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
                label="名称"
                name="name"
                colon={false}
                rules={[
                  { required: true, message: '请输入名称' },
                  { max: 20, message: '最多输入20个字符' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                {...layouts}
                label="是否集合"
                name="isArray"
                colon={false}
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            {/* <Col span={4}>
                            <Form.Item
                                {...layouts}
                                label="是否分页"
                                name="isArray"
                                colon={false}
                                valuePropName="checked"
                            >
                                <Checkbox />
                            </Form.Item>
                        </Col> */}
            <Col span={6}>
              <Form.Item
                {...layouts}
                label="请求方式"
                name="apiMethod"
                colon={false}
                onChange={changeValue}
              >
                <Select style={{ width: '70px' }} defaultValue={'GET'}>
                  <Option value="GET">GET</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
                label="Api地址"
                name="apiUrl"
                colon={false}
                rules={[{ required: true, message: '请输入接口地址' }]}
              >
                <Input placeholder="请输入接口地址" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={styles.content}>
        <p>{'您可以写访问路径：'}</p>
        <p>{'平台内api: /form/getList'}</p>
        <p>{'平台外api:http://baidu.com?wd=fdsaf'}</p>
    </div>
        <p className={styles.button}>
          <Button
            onClick={() => {
              addParams();
            }}
          >
            新增
          </Button>
          <Button
            onClick={() => {
              deleteParams(activeKey === 'detail' ? selectedRowKeys : selectedRowKeysOther);
            }}
          >
            删除
          </Button>
        </p>

        
        <Tabs
          defaultActiveKey={'detail'}
          activeKey={activeKey}
          onChange={onTabChange}
        >
          <TabPane tab="返回值" key="detail">
            <div style={{height:'100%'}}>
              <Table
                {...tableProps}
                scroll={paramsData?.length > 0 ? { y: 'calc(100vh - 490px)' } : {}}
              />
            </div>
          
          </TabPane>
          <TabPane tab="参数信息" key="options">
            <Table
              {...tableProps}
              scroll={paramsDataOther?.length > 0 ? { y: 'calc(100vh - 490px)' } : {}}
            />
          </TabPane>
        </Tabs>
      </GlobalModal>
    </div>
  );
}
export default connect(({ interfaceManagement }) => ({ interfaceManagement }))(
  AddInterface,
);
