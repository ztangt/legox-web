import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
function addModal({ dispatch, travelExpense }) {
  const {
    date,
    selectedCity,
    personList,
    detailData,
    cityCode,
    gradeList,
    searchWord,
    limit,
    currentPage,
  } = travelExpense;
  const [personCode, setPersonCode] = useState('');
  // const [personId, setPersonId] = useState('');
  const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
  const [form] = Form.useForm();
  const { Option } = Select;
  useEffect(() => {
    dispatch({
      type: 'travelExpense/getGradeList',
    });
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      cityName: detailData.cityName ? detailData.cityName : selectedCity,
      gradeName: detailData.gradeName,
      travelStandardFee: detailData.travelStandardFee,
      hotTimeChoice: detailData.hotTimeChoice
        ? detailData.hotTimeChoice?.split(',')
        : undefined,
      hotStandardFee: detailData.hotStandardFee,
      incidentalSubsidyFee: detailData.incidentalSubsidyFee,
      foodSubsidyFee: detailData.foodSubsidyFee,
      otherSubsidyFee: detailData.otherSubsidyFee,
    });
  }, [detailData]);
  //获取差旅费列表
  const getTravelExpenseList = (cityCode, searchWord, start, limit) => {
    dispatch({
      type: 'travelExpense/getTravelExpenseList',
      payload: {
        cityCode,
        searchWord,
        start,
        limit,
      },
    });
  };
  const handelCanel = () => {
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        isShowAddModal: false,
        detailData: {},
      },
    });
  };
  const onFinish = (values) => {
    console.log(values, 'values');
    if (detailData.travelId) {
      dispatch({
        type: 'travelExpense/updateTravelexpense',
        payload: {
          ...values,
          cityCode: cityCode,
          gradeCode: personCode ? personCode : detailData.gradeCode,
          travelId: detailData.travelId,
          // gradeId: personId ? personId : detailData.personId,
          isConnect: 0,
          hotTimeChoice: values.hotTimeChoice
            ? values.hotTimeChoice.join(',')
            : '',
        },
        callback: () => {
          getTravelExpenseList(cityCode, searchWord, currentPage, limit);
        },
      });
    } else {
      dispatch({
        type: 'travelExpense/addTravelexpense',
        payload: {
          ...values,
          cityCode: cityCode,
          gradeCode: personCode,
          // gradeId: personId ? personId : detailData.personId,
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
        isShowAddModal: false,
        detailData: {},
      },
    });
  };
  const changeName = (value, e) => {
    console.log(e);
    setPersonCode(e.code);
    // const postInfos = JSON.parse(e.postInfos);
    // const idArr = [];
    // postInfos.forEach((item) => {
    //   idArr.push(item.gradeId);
    // });
    // setPersonId(idArr.join(','));
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
      title={detailData.travelId ? '修改差旅费标准' : '添加差旅费标准'}
      visible={true}
      width={600}
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
        //   gradeName: detailData ? detailData.gradeName : '',
        //   travelStandardFee: detailData ? detailData.travelStandardFee : '',
        //   hotTimeChoice: detailData ? detailData.hotTimeChoice : null,
        //   hotStandardFee: detailData ? detailData.hotStandardFee : '',
        //   incidentalSubsidyFee: detailData
        //     ? detailData.incidentalSubsidyFee
        //     : '',
        //   foodSubsidyFee: detailData ? detailData.foodSubsidyFee : '',
        //   otherSubsidyFee: detailData ? detailData.otherSubsidyFee : '',
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
export default connect(({ travelExpense }) => ({ travelExpense }))(addModal);
