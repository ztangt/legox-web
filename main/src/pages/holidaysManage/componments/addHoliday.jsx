import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Row,
  Col,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { connect } from 'umi';
import { dataFormat } from '../../../util/util';
import GlobalModal from '../../../componments/GlobalModal';
import 'moment/locale/zh-cn';

const { RangePicker } = DatePicker;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const { TextArea } = Input;
const { Option } = Select;
function AddHoliday({ dispatch, loading, currentHoliday, currentYear }) {
  const [form] = Form.useForm();
  const [defalutYear, setDefalutYear] = useState(moment(currentYear));
  const [days, setDays] = useState(0);

  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: '请选择日期!',
      },
    ],
  };

  useEffect(() => {
    if (currentHoliday?.id) {
      setDays(
        dateDiffIncludeToday(
          dataFormat(currentHoliday.startDate),
          dataFormat(currentHoliday.endDate),
        ),
      );
    }
  }, []);
  //处理时间问题
  var currentHolidayInfo = {
    changeDate: [],
  };
  if (currentHoliday?.id) {
    currentHolidayInfo = { ...currentHoliday };
    currentHolidayInfo.year = moment(new Date(currentHolidayInfo.year));
    currentHolidayInfo.startDate = moment(currentHolidayInfo.startDate * 1000);
    currentHolidayInfo.endDate = moment(currentHolidayInfo.endDate * 1000);
    // currentHolidayInfo.holidayDate = moment(currentHolidayInfo.holidayDate * 1000);
    currentHolidayInfo.rangeDate = [
      currentHolidayInfo.startDate,
      currentHolidayInfo.endDate,
    ];
    var curChangeDate = [];

    currentHolidayInfo.changeDate.split(',').forEach(element => {
      if (element != '') curChangeDate.push(moment(element * 1000));
    });

    currentHolidayInfo.changeDate = curChangeDate;
  }
  const [changeDate, setChangeDate] = useState([
    ...currentHolidayInfo.changeDate,
  ]);

  // console.log('add', currentHoliday, currentHolidayInfo);

  const handelCanel = () => {
    dispatch({
      type: 'holidaysManage/updateStates',
      payload: {
        isShowAddHoliday: false,
        currentHoliday: {},
      },
    });
  };

  //提交
  const onFinish = values => {
    values.startDate = parseInt(values.rangeDate[0].valueOf() / 1000);
    values.endDate = parseInt(values.rangeDate[1].valueOf() / 1000);
    // values.holidayDate = parseInt(values.holidayDate.valueOf() / 1000);
    values.year = values.year.toDate();
    holidayTypeOptions.forEach(element => {
      if (element.dictInfoCode == values.holidayType) {
        values.holidayDesc = element.dictInfoName;
      }
    });
    var changeDate = [];
    values.changeDate.forEach(element => {
      changeDate.push(parseInt(element.valueOf() / 1000));
    });
    values.changeDate = changeDate.join(',');
    if (currentHolidayInfo?.id) {
      dispatch({
        type: 'holidaysManage/updateHoliday',
        payload: {
          id: currentHolidayInfo.id,
          ...values,
        },
      });
    } else {
      dispatch({
        type: 'holidaysManage/addHoliday',
        payload: {
          ...values,
        },
      });
    }
  };

  const changeChangeDate = (date, index) => {
    var changeList = [...changeDate];
    // console.log(changeList);
    var isRepeat = false;
    if (date) {
      changeList.forEach(element => {
        if (element.format('YYYYMMDD') == date.format('YYYYMMDD')) {
          isRepeat = true;
        }
      });
    }
    if (index == -1) {
      if (date) {
        if (!isRepeat) {
          changeList.push(date);
        }
      }
    } else {
      if (date && !isRepeat) {
        changeList[index] = date;
      } else {
        changeList.splice(index, 1);
      }
    }
    form.setFieldsValue({ changeDate: changeList });
    setChangeDate(changeList);
  };

  function disabledDate(currentDate) {
    return currentDate?.year() != defalutYear.year();
  }

  function onDateChange(v1, v2) {
    setDays(dateDiffIncludeToday(v2[0], v2[1]));
  }

  function dateDiffIncludeToday(startDateString, endDateString) {
    var separator = '-'; //日期分隔符
    var startDates = startDateString.split(separator);
    var endDates = endDateString.split(separator);
    var startDate = new Date(startDates[0], startDates[1] - 1, startDates[2]);
    var endDate = new Date(endDates[0], endDates[1] - 1, endDates[2]);
    return parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24) + 1; //把相差的毫秒数转换为天数
  }

  return (
    <GlobalModal
      visible={true}
      title={currentHoliday?.id ? '修改' : '新增'}
      onCancel={handelCanel}
      maskClosable={false}
      mask={false}
      widthType={1}
      incomingHeight={330}
      getContainer={() => {
        return document.getElementById('holidaysManageDiv') || false;
      }}
      footer={[
        <Button key="cancel" onClick={handelCanel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading.global}
          htmlType={'submit'}
          onClick={() => {
            form.submit();
          }}
        >
          保存
        </Button>,
      ]}
    >
      <Form
        colon={false}
        form={form}
        name="role"
        initialValues={currentHolidayInfo}
        onFinish={onFinish.bind(this)}
        // onValuesChange={onValuesChange}
      >
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item
              {...layout}
              label="年度"
              name="year"
              initialValue={moment(currentYear)}
              rules={[{ required: true, message: '请输入年度' }]}
            >
              <DatePicker
                picker="year"
                allowClear={false}
                onChange={(date, dateString) => {
                  setDefalutYear(moment(dateString));
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              {...layout}
              label="节假日"
              name="holidayType"
              rules={[{ required: true, message: '请选择节假日' }]}
            >
              <Select>
                {holidayTypeOptions.map(item => {
                  return (
                    <Option value={item.dictInfoCode} key={item.dictInfoCode}>
                      {item.dictInfoName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {/* <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              name="holidayDate"
              label="日期"
              {...config}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row> */}
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              name="rangeDate"
              label="假期时间"
              rules={[
                {
                  type: 'array',
                  required: true,
                  message: '请输入时间',
                },
              ]}
            >
              <RangePicker onChange={onDateChange.bind(this)} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              // name="holidayNums"
              label="天数"
            >
              <InputNumber disabled={true} defaultValue={0} value={days} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              label="调班日期"
              name="changeDate"
            >
              {changeDate.map((element, index) => {
                // console.log('changeDate', changeDate);
                return (
                  <DatePicker
                    key={index}
                    value={element}
                    disabledDate={disabledDate}
                    onChange={date => {
                      changeChangeDate(date, index);
                    }}
                  />
                );
              })}
              <DatePicker
                value={null}
                disabledDate={disabledDate}
                onChange={date => {
                  changeChangeDate(date, -1);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </GlobalModal>
  );
}

export default connect(({ holidaysManage, loading, layoutG }) => {
  return { ...holidaysManage, loading, layoutG };
})(AddHoliday);

const holidayTypeOptions = [
  {
    dictInfoCode: 'HOLIDAY__YD',
    dictInfoName: '元旦',
  },
  {
    dictInfoCode: 'HOLIDAY__CX',
    dictInfoName: '除夕',
  },
  {
    dictInfoCode: 'HOLIDAY__CJ',
    dictInfoName: '春节',
  },
  {
    dictInfoCode: 'HOLIDAY__QMJ',
    dictInfoName: '清明节',
  },
  {
    dictInfoCode: 'HOLIDAY__LDJ',
    dictInfoName: '劳动节',
  },
  {
    dictInfoCode: 'HOLIDAY__ DWJ',
    dictInfoName: '端午节',
  },
  {
    dictInfoCode: 'HOLIDAY__ZQJ',
    dictInfoName: '中秋节',
  },
  {
    dictInfoCode: 'HOLIDAY__GQJ',
    dictInfoName: '国庆节',
  },
];
