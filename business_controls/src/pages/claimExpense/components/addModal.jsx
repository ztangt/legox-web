import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Select, Input, Row, Col } from 'antd';
import GlobalModal from '../../../components/GlobalModal';

function addModal({ dispatch, claimExpense, getPreexpenseList }) {
  const { Option } = Select;
  const [form] = Form.useForm();
  const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
  const {
    processList,
    detailData,
    typeList,
    searchWord,
    currentPage,
    limit,
  } = claimExpense;
  const [bizSolId, setBizSolId] = useState('');
  const [overstepTypeCode, setOverstepTypeCode] = useState('');
  const overType = form.getFieldsValue().overstepTypeName;
  console.log(detailData, 'detailData');
  useEffect(() => {
    dispatch({
      type: 'claimExpense/getBasicdataFlagList',
      payload: {
        bpmFlag: '1',
        baiscDataFlag: '',
      },
    });
  }, []);
  const handelCanel = () => {
    dispatch({
      type: 'claimExpense/updateStates',
      payload: {
        isShowAddModal: false,
        detailData: {},
      },
    });
  };
  const onFinish = (values) => {
    if (detailData.preExpenseId) {
      dispatch({
        type: 'claimExpense/updatePreexpense',
        payload: {
          overstepTypeName: values.overstepTypeName,
          overstepFee: values.overstepFee,
          overstepRatio: values.overstepRatio,
          preExpenseId: detailData.preExpenseId,
          overstepTypeCode: overstepTypeCode
            ? overstepTypeCode
            : detailData.overstepTypeCode,
        },
        callback: () => {
          getPreexpenseList(searchWord, currentPage, limit);
        },
      });
    } else {
      dispatch({
        type: 'claimExpense/addPreexpense',
        payload: {
          ...values,
          bizSolId: bizSolId,
          overstepTypeCode: overstepTypeCode,
        },
        callback: () => {
          getPreexpenseList(searchWord, currentPage, limit);
        },
      });
    }

    handelCanel();
  };
  const onChange = (val, e) => {
    console.log(e);
    setBizSolId(e.key);
  };
  const changeType = (val, e) => {
    console.log(val, 'val');
    console.log(e, 'e====');
    setOverstepTypeCode(e.code);
    if (val == '超出金额') {
      form.setFields([
        {
          name: 'overstepRatio',
          value: '',
          errors: null,
        },
      ]);
    } else {
      form.setFields([
        {
          name: 'overstepFee',
          value: '',
          errors: null,
        },
      ]);
    }
  };
  //设置比例校验规则
  const setMoneyRule = (_, value) => {
    const reg = /^\d{1,19}$|^\d{1,19}[.]\d{1,6}$/;
    if (!reg.test(value)) {
      return Promise.reject(new Error('金额格式错误'));
    } else {
      return Promise.resolve();
    }
  };
  const setRatioRule = (_, value) => {
    // const reg = /^\+?(\d*\.\d{2})$/
    const reg = /^\d+$|^\d+[.]\d{1,2}$/;
    if (!reg.test(value)) {
      return Promise.reject(new Error('仅支持小数点后两位小数'));
    } else {
      return Promise.resolve();
    }
  };
  console.log(form.getFieldsValue().overstepTypeName);
  return (
    <GlobalModal
      title={detailData.preExpenseId ? '修改超事前报销' : '新增超事前报销'}
      visible={true}
      mask={false}
      maskClosable={false}
      centered
      // width={400}
      widthType={4}
      onCancel={handelCanel}
      getContainer={() => {
        return document.getElementById('claimExpense_id');
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
        form={form}
        onFinish={onFinish}
        initialValues={{
          bizSolName: detailData ? detailData.bizSolName : '',
          overstepTypeName: detailData ? detailData.overstepTypeName : '',
          overstepRatio: detailData ? detailData.overstepRatio : '',
          overstepFee: detailData ? detailData.overstepFee : '',
        }}
      >
        <Form.Item
          label="业务应用"
          name="bizSolName"
          rules={[{ required: true, message: '请选择业务应用' }]}
        >
          <Select
            style={{ width: 200 }}
            onChange={onChange}
            disabled={detailData.preExpenseId ? true : false}
          >
            {processList?.map((item, index) => {
              return (
                <Option key={item.bizSolId} value={item.bizSolName}>
                  {item.bizSolName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="超出类型"
          name="overstepTypeName"
          rules={[{ required: true, message: '请选择超出类型' }]}
        >
          <Select
            defaultValue={'请选择'}
            onChange={changeType}
            style={{ width: 200 }}
          >
            {typeList.map((item) => {
              return (
                <Option
                  key={item.id}
                  code={item.dictTypeInfoCode}
                  value={item.dictInfoName}
                >
                  {item.dictInfoName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="超出金额"
          name="overstepFee"
          rules={[
            overType == '超出金额'
              ? {
                  validator: setMoneyRule.bind(this),
                }
              : {},
          ]}
        >
          <Input
            style={{ width: 200 }}
            disabled={overType == '超出比例' ? true : false}
          />
        </Form.Item>
        <Row gutter={0}>
          <Col span={20}>
            <Form.Item
              label="超出比例"
              name="overstepRatio"
              labelCol={6}
              wrapperCol={18}
              rules={[
                overType == '超出比例'
                  ? { validator: setRatioRule.bind(this) }
                  : {},
              ]}
            >
              <Input
                style={{ width: 200 }}
                disabled={overType == '超出金额' ? true : false}
              />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item>
              <span>%</span>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </GlobalModal>
  );
}
export default connect(({ claimExpense }) => ({ claimExpense }))(addModal);
