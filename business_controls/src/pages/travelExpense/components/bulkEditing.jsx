import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
function bulkEditing({ dispatch, travelExpense, getTravelExpenseList }) {
  const {
    isShowBatch,
    selectedCity,
    personList,
    date,
    selectedRowKeys,
    cityCode,
    detailData,
    gradeList,
    searchWord,
    currentPage,
    limit,
  } = travelExpense;
  console.log(gradeList, 'gradeList');
  const [personCode, setPersonCode] = useState('');
  const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
  const [form] = Form.useForm();
  console.log(form.getFieldValue(), 'form.getFieldValue()==');
  const { Option } = Select;
  console.log(detailData, 'detailData');
  useEffect(() => {
    dispatch({
      type: 'travelExpense/getGradeList',
    });
    personList.push({
      dictInfoCode: '',
      dictInfoName: '全部',
      id: new Date().getTime(),
    });
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      cityName: selectedRowKeys.length > 0 ? detailData.cityName : selectedCity,
      gradeName: selectedRowKeys.length > 0 ? detailData.gradeName : '',
      travelStandardFee:
        selectedRowKeys.length > 0 ? detailData.travelStandardFee : '',
      hotTimeChoice:
        selectedRowKeys.length > 0
          ? detailData.hotTimeChoice?.split(',')
          : detailData.hotTimeChoice,
      hotStandardFee:
        selectedRowKeys.length > 0 ? detailData.hotStandardFee : '',
      incidentalSubsidyFee:
        selectedRowKeys.length > 0 ? detailData.incidentalSubsidyFee : '',
      foodSubsidyFee:
        selectedRowKeys.length > 0 ? detailData.foodSubsidyFee : '',
      otherSubsidyFee:
        selectedRowKeys.length > 0 ? detailData.otherSubsidyFee : '',
    });
  }, [detailData]);
  const handelCanel = () => {
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        isShowBatch: false,
        detailData: {},
      },
    });
  };
  const changeName = (value, e) => {
    console.log(e, 'e==1');
    console.log(value, 'value==');
    setPersonCode(e.code);
  };
  const onFinish = (values) => {
    console.log(detailData);
    console.log(selectedRowKeys, '111==');
    if (selectedRowKeys.length > 0) {
      dispatch({
        type: 'travelExpense/updateTravelexpense',
        payload: {
          ...values,
          cityCode: cityCode,
          gradeCode: personCode ? personCode : detailData.gradeCode,
          travelId: detailData.travelId,
          hotTimeChoice: values.hotTimeChoice
            ? values.hotTimeChoice.join(',')
            : '',
          isConnect: 0,
        },
        callback: () => {
          getTravelExpenseList(cityCode, searchWord, currentPage, limit);
        },
      });
    } else {
      dispatch({
        type: 'travelExpense/updateTravelexpense',
        payload: {
          ...values,
          cityCode: cityCode,
          gradeCode: personCode,
          travelId: detailData.travelId,
          isConnect: 1,
          hotTimeChoice: values.hotTimeChoice
            ? values.hotTimeChoice.join(',')
            : '',
        },
        callback: () => {
          getTravelExpenseList(cityCode, searchWord, currentPage, limit);
        },
      });
    }
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        isShowBatch: false,
      },
    });
  };
  //设置比例校验规则
  const setMoneyRule = (_, value) => {
    const reg = /^\d{1,19}$|^\d{1,19}[.]\d{1,6}$/;
    if (!value) return Promise.resolve(); //输入才校验，不输入不校验
    if (!reg.test(value)) {
      return Promise.reject(new Error('金额格式错误'));
    } else {
      return Promise.resolve();
    }
  };
  return (
    <Modal
      title={
        selectedRowKeys.length > 0 ? '修改差旅费标准' : '批量修改差旅费标准'
      }
      width={600}
      visible={true}
      onCancel={handelCanel}
      maskClosable={false}
      mask={false}
      centered
      bodyStyle={{ height: '212px' }}
      getContainer={() => {
        return document.getElementById('travelExpense_container');
      }}
      footer={[
        <Button key="cancel" onClick={handelCanel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.submit();
          }}
        >
          保存
        </Button>,
      ]}
    >
      <Form
        {...layout}
        onFinish={onFinish}
        form={form}
        // initialValues={{
        //   cityName: selectedCity,
        //   gradeName: selectedRowKeys.length > 0 ? detailData.gradeName : '',
        //   travelStandardFee:
        //     selectedRowKeys.length > 0 ? detailData.travelStandardFee : '',
        //   hotTimeChoice:
        //     selectedRowKeys.length > 0 ? detailData.hotTimeChoice : '',
        //   hotStandardFee:
        //     selectedRowKeys.length > 0 ? detailData.hotStandardFee : '',
        //   incidentalSubsidyFee:
        //     selectedRowKeys.length > 0 ? detailData.incidentalSubsidyFee : '',
        //   foodSubsidyFee:
        //     selectedRowKeys.length > 0 ? detailData.foodSubsidyFee : '',
        //   otherSubsidyFee:
        //     selectedRowKeys.length > 0 ? detailData.otherSubsidyFee : '',
        // }}
      >
        <Row gutter={24}>
          <Col className="gutter-row" span={12}>
            <Form.Item label="所选城市" name="cityName" colon={false}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item
              colon={false}
              label="人员级别"
              name="gradeName"
              rules={[{ required: true, message: '请选择人员级别' }]}
            >
              <Select defaultValue={'请选择'} onChange={changeName}>
                {personList.map((item) => {
                  return (
                    <Option
                      key={item.id}
                      code={item.dictInfoCode}
                      value={item.dictInfoName}
                      // id={item.gradeId}
                      // postInfos={item.postInfos}
                    >
                      {item.dictInfoName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              colon={false}
              label="出差标准"
              name="travelStandardFee"
              rules={[
                { required: true, message: '' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const reg = /^\d{1,19}$|^\d{1,19}[.]\d{1,6}$/;
                    if (!value) {
                      return Promise.reject(new Error('请输入出差标准'));
                    } else if (!/\s*(\S+)\s*$/g.test(String(value))) {
                      return Promise.reject(new Error('请输入出差标准'));
                    } else if (!reg.test(value)) {
                      return Promise.reject(new Error('金额格式错误'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="旺季时间" name="hotTimeChoice" colon={false}>
              <Select
                optionLabelProp="label"
                mode="multiple"
                onChange={(value) => {
                  value.sort((a, b) => {
                    return a - b;
                  });
                }}
              >
                {date.map((item) => {
                  return (
                    <Option value={item.slice(0, item.length - 1)} label={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              colon={false}
              label="旺季标准"
              name="hotStandardFee"
              rules={[
                {
                  validator: setMoneyRule.bind(this),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              colon={false}
              label="公杂补助"
              name="incidentalSubsidyFee"
              rules={[
                {
                  validator: setMoneyRule.bind(this),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              colon={false}
              label="餐饮补助"
              name="foodSubsidyFee"
              rules={[
                {
                  validator: setMoneyRule.bind(this),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              colon={false}
              label="其他补助"
              name="otherSubsidyFee"
              rules={[
                {
                  validator: setMoneyRule.bind(this),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
export default connect(({ travelExpense }) => ({ travelExpense }))(bulkEditing);
