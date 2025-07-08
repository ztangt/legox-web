import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import { useModel } from 'umi';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

function exportModal({
  dispatch,
  bizSolId,
  usedYear,
  columns,
  fileType,
  selectedRowKeys,
  setExportVisible,
}) {
  const [form] = Form.useForm();
  let timeStamp = Date.parse(new Date());
  const { openNewPage } = useModel('@@qiankunStateFromMaster');

  const [initialValues, setInitialValues] = useState({
    fileName: `预算指标库列表${timeStamp}`,
    exportFileType: '1',
    exportDataType: '1',
  });

  const [excelVal, setExcelVal] = useState('1');
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
      NORM_CODE: '指标编码',
      BUDGET_ORG_NAME_: '预算单位',
      PROJECT_NAME: '项目',
      ECONOMIC_SUBJECT_NAME: '经济科目',
      CR_BUDGET: '管控总额度',
      FREEZE_BUDGET: '冻结金额',
      EXECUTE_BUDGET: '执行金额',
      ACTUAL_BUDGET: '指标余额',
      AVL_BUDGET: '指标可用额度',
      WAY_FREEZE_BUDGET: '在途冻结',
      WAY_EXEC_BUDGET: '在途执行',
      MANAGE_DEPT_NAME_: '管理部门',
      CR_BUDGET_TYPE_TLDT_: '控制方式',
      NORM_STATE_TLDT_: '指标状态',
      IS_ENABLE_TLDT_: '是否启用',
    };
    return JSON.stringify(colJson);
  }

  function onCancel() {
    setExportVisible(false);
  }
  function exportData() {}
  function selectModelFn(value) {
    setExcelVal(value);
  }
  const onFinish = (values) => {
    const {
      fileName,
      exportFileType,
      exportDataType,
      startAndEndTime,
    } = values;
    if (selectedRowKeys.length === 0 && exportDataType == 2) {
      message.warning('请至少选中一条数据');
      return;
    }
    // message.warning('功能暂未开放...');
    // return;
    dispatch({
      type: 'budgetTarget/exportFile',
      payload: {
        fileName,
        exportFileType,
        exportDataType,
        // startTime: parseInt(startAndEndTime?.[0]['_d'].getTime() / 1000),
        // endTime: parseInt(startAndEndTime?.[1]['_d'].getTime() / 1000),
        startTime:
          parseInt(startAndEndTime?.[0]['_d'].setHours(0, 0, 0, 0) / 1000) ||
          '',
        endTime:
          parseInt(
            startAndEndTime?.[1]['_d'].setHours(23, 59, 59, 999) / 1000,
          ) || '',
        bizSolId,
        primaryKeyIds: selectedRowKeys.toString(),
        colJson: generateColJson(),
        searchWord: '',
        fileType,
        usedYear,
        serviceName: 'IC',
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

  return (
    <Modal
      title={'导出'}
      visible={true}
      width={550}
      bodyStyle={{ height: '300px' }}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById('budgetTarget_id');
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
              value={dates || value}
              disabledDate={disabledDate}
              onCalendarChange={(val) => setDates(val)}
              onChange={(val) => setValue(val)}
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

export default connect(({ budgetTarget }) => ({
  budgetTarget,
}))(exportModal);
