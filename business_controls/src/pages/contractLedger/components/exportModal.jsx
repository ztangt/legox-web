import { Button, DatePicker, Form, Input, Modal, Select, message } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import { useModel } from 'umi';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

function exportModal({
  dispatch,
  bizSolId,
  usedYear,
  fileType,
  selectedRowKeys,
  exportVisible,
  setExportVisible,
}) {
  const [form] = Form.useForm();
  let timeStamp = Date.parse(new Date());
  const { openNewPage } = useModel('@@qiankunStateFromMaster');

  const [initialValues, setInitialValues] = useState({
    fileName: `合同台账${timeStamp}`,
    exportFileType: '1',
    exportDataType: '1',
  });

  const [dates, setDates] = useState(null);
  const [value, setValue] = useState(null);

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 365;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 365;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  function generateColJson() {
    const colJson = {
      CONTRACT_NUMBER: '合同编号',
      CONTRACT_NAME: '合同名称',
      PARTY_A: '甲方',
      PARTY_B: '乙方',
      REGISTER_DEPT_NAME_: '申请部门',
      REGISTER_IDENTITY_NAME_: '申请人',
      CONTRACT_SIGN_DATE: '合同签订日期',
      CONTRACT_TYPE_TLDT_: '合同类型',
      PURCHASE_METHOD_TLDT_: '采购方式',
      TOTAL_MONEY: '合同金额',
      BALANCE_MONEY: '合同剩余金额',
      ALREADY_MONEY: '执行金额',
      PAY_PLAN: '执行比例',
      CONTRACT_STATE_TLDT_: '合同状态',
      CHECK_TIME: '验收日期',
    };
    return JSON.stringify(colJson);
  }

  function onCancel() {
    setExportVisible(false);
  }

  const onFinish = (values) => {
    const {
      fileName,
      exportFileType,
      exportDataType,
      startAndEndTime,
    } = values;
    const rangePicker = values['startAndEndTime'];
    const pickerValue = {
      ...values,
      startAndEndTime: rangePicker
        ? [
            rangePicker[0].format('YYYY-MM-DD'),
            rangePicker[1].format('YYYY-MM-DD'),
          ]
        : [],
    };
    console.log('selectedRowKeysselectedRowKeys:', selectedRowKeys);
    if (selectedRowKeys.length === 0 && exportDataType == 2) {
      message.warning('请至少选中一条数据');
      return;
    }
    const startString =
      exportDataType == 2
        ? ''
        : pickerValue.startAndEndTime[0].replace(/-/g, '/');
    const endString =
      exportDataType == 2
        ? ''
        : pickerValue.startAndEndTime[1].replace(/-/g, '/');
    const timeStart =
      exportDataType == 2 ? '' : new Date(startString).getTime() / 1000;
    const timeEnd =
      exportDataType == 2
        ? ''
        : new Date(endString).getTime() / 1000 + 86400 - 1;
    // message.warning('功能暂未开放...');
    // return;
    dispatch({
      type: 'contractLedger/exportFile',
      payload: {
        fileName,
        exportFileType,
        exportDataType,
        startTime: timeStart || '',
        endTime: timeEnd || '',
        bizSolId,
        primaryKeyIds: selectedRowKeys.toString(),
        colJson: generateColJson(),
        searchWord: '',
        fileType,
        usedYear,
        serviceName: 'IC',
        logicCode: 'HT100001',
      },
      callback: () => {
        setExportVisible(false);
        openNewPage();
      },
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (changedValues, allValues) => {
    console.log('onValuesChange:', changedValues, allValues);
    setInitialValues(allValues);
  };
  const onDateChange = (val, dataStr) => {
    setValue(val);
  };

  return (
    <Modal
      title={'导出'}
      visible={exportVisible}
      width={550}
      bodyStyle={{ height: '300px' }}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById('contractLedger');
      }}
      footer={null}
    >
      <Form
        initialValues={initialValues}
        form={form}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <FormItem
          label="文件名"
          name="fileName"
          rules={[
            {
              required: true,
              message: '请输入文件名!',
            },
          ]}
        >
          <Input />
        </FormItem>

        <FormItem
          label="文件类型"
          name="exportFileType"
          rules={[
            {
              required: true,
              message: '请选择文件类型!',
            },
          ]}
        >
          <Select>
            <Select.Option value="1">excel</Select.Option>
          </Select>
        </FormItem>

        <FormItem
          label="导出数据"
          name="exportDataType"
          rules={[
            {
              required: true,
              message: '请选择要导出的数据!',
            },
          ]}
        >
          <Select>
            <Select.Option value="1">列表全部记录</Select.Option>
            <Select.Option value="2">列表选中记录</Select.Option>
          </Select>
        </FormItem>

        {initialValues.exportDataType === '1' && (
          <FormItem
            label="起止时间"
            name="startAndEndTime"
            rules={[
              {
                required: true,
                message: '请输入起止时间!',
              },
            ]}
          >
            <RangePicker
              // picker="month"
              style={{ width: '100%' }}
              value={dates || value}
              format={'YYYY-MM-DD'}
              disabledDate={disabledDate}
              onCalendarChange={(val) => setDates(val)}
              onChange={onDateChange}
              onOpenChange={onOpenChange}
            />
          </FormItem>
        )}

        <FormItem
          wrapperCol={{
            offset: 10,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            导出
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
}

export default connect(({ contractLedger }) => ({
  contractLedger,
}))(exportModal);
