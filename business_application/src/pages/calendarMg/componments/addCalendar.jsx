import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Typography,
} from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import GlobalModal from '../../../componments/GlobalModal';
import {dataFormat} from '../../../util/util'
import styles from './calendarView.less';
const {confirm} = Modal
const { RangePicker } = DatePicker;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 19 },
};
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
import RelationUserInfo from './relationUserInfo';
function AddCalendar({
  dispatch,
  loading,
  changeCalendarInfo,
  currentDate,
  endingDate,
  currentView,
  relUser,
  relUserName,
  isShowRelationModal,
  needDelete,
}) {
  const [form] = Form.useForm();
  const curUserName = window.localStorage.getItem('userName');
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
  //处理时间问题
  var curCalendarInfo = {
    rangeTime:
      currentView == 'agenda'
        ? [moment(new Date()), moment(new Date())]
        : [moment(currentDate), moment(endingDate)],
  };
  if (changeCalendarInfo?.id) {
    curCalendarInfo = { ...changeCalendarInfo };
    curCalendarInfo.rangeTime = [
      moment(curCalendarInfo.startTime * 1000),
      moment(curCalendarInfo.endTime * 1000),
    ];
  }
  const handelCanel = () => {
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        isShowAddCalendar: false,
        changeCalendarInfo: {},
      },
    });
  };

  //提交
  const onFinish = (values) => {  
    if((values&&values.remindType != "SCHEDULE__NO")&&!values.remindTimeType){
      message.error('提醒方式非”无”时，提醒时间必填')
      return 
    }
    if(values&&values.scheduleContent&&values.scheduleContent.length>500){
      message.error('日程详情最多输入500字')
      return  false
    }
    const identityId =  JSON.parse(localStorage.getItem('changeIdentityId'))||userInfo.identityId
    values.startTime = parseInt(values.rangeTime[0].valueOf() / 1000);
    values.endTime = parseInt(values.rangeTime[1].valueOf() / 1000);
    values.createTime=parseInt(values.createTime.valueOf() / 1000);
    delete values.rangeTime
    // 新增时没有relUser,目前用的是当前登录人的身份id
    // console.log("values",values,"userInfo",userInfo,"relUser",relUser,"identityId",identityId) 
    if (curCalendarInfo?.id) {
      dispatch({
        type: 'calendarMg/changeSchedule',
        payload: {
          id: curCalendarInfo.id,
          ...values,
          relUser: values.relUser ? values.relUser : identityId,
        },
      });
    } else {
      dispatch({
        type: 'calendarMg/addSchedule',
        payload: {
          ...values,
          relUser: values.relUser ? values.relUser : identityId,
        },
      });
    }
  };
  //显示相关人设置
  const showRelationUserModal = () => {
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        isShowRelationModal: true,
        selectedDataIds: curCalendarInfo.id ? [curCalendarInfo.relUser] : [],
      },
    });
  };
  // 删除日历
  const deleteClick = ()=>{
    confirm({
      title: '确定删除吗？',
      getContainer:() => {
        return document.getElementById('calendarMgDiv')||false;
      },
      onOk() {
        dispatch({
          type: 'calendarMg/deleteSchedule',
          payload: {
            scheduleIds:curCalendarInfo.id
          },
          callback:()=>{
            dispatch({
              type: 'calendarMg/updateStates',
              payload:{
                isShowRelationModal: false,
              }
            })
          }
        });
      }
    })
  }

  return (
    <GlobalModal
      visible={true}
      title={curCalendarInfo.id ? '修改日程' : '新增日程'}
      onCancel={handelCanel}
      maskClosable={false}
      mask={false}
      widthType={2}
      incomingHeight={400}
      bodyStyle={{overflow:'hidden'}}
      // top={'4%'}
      className={curCalendarInfo.id?styles.addCalendar_modal:styles.calender_msg}
      getContainer={() => {
        return document.getElementById('calendarMgDiv')||false;
      }}
      footer={[
       <div key="footer">
           {/* <Button key="cancel" onClick={handelCanel}>
            取消
          </Button> */}
          {/* style={{background: 'transparent'}} */}
          {curCalendarInfo.id&&needDelete&&<Button  className={styles.delete} onClick={deleteClick}>删除</Button>}
          <Button
            key="submit"
            type="primary"
            className={styles.submit}
            // loading={loading.global}
            htmlType={'submit'}
            onClick={() => {
              form.submit();
            }}
          >
            保存
          </Button>
       </div>
      ]}
    >
      <Form
        colon={false}
        form={form}
        name="role"
        initialValues={{
          ...curCalendarInfo,
          relUser: curCalendarInfo.id ? curCalendarInfo.relUser : '', //默认人的时候传空
          createUser: curCalendarInfo.id?curCalendarInfo.createUserName:curUserName,
          createTime:curCalendarInfo.id?moment(dataFormat(curCalendarInfo.createTime),'YYYY-MM-DD'): moment(dataFormat(Date.now()/1000),'YYYY-MM-DD'),
          relUserName: curCalendarInfo.id
            ? curCalendarInfo.relUserName
            : curUserName, //默认人为当前用户
            remindType: curCalendarInfo.id? curCalendarInfo.remindType:'SCHEDULE__NO'
        }}
        onFinish={onFinish.bind(this)}
      >
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item
              {...layout}
              label="相关人id"
              name="relUser"
              style={{ display: 'none' }}
            >
              <Input
                onClick={() => {
                  showRelationUserModal;
                }}
              />
            </Form.Item>
            <Form.Item
              {...layout}
              label="相关人"
              name="relUserName"
              rules={[{ required: true, message: '请选择相关人' }]}
            >
              <Input
                onClick={() => {
                  showRelationUserModal();
                }}
                readOnly
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              {...layout}
              label="主题"
              name="scheduleTitle"
              rules={[
                { required: true, message: '请输入主题' },
                { max: 50, message: '最多输入50个字符' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item
              {...layout}
              label="地点"
              name="schedulePlace"
              rules={[{ max: 50, message: '最多输入50个字符' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              {...layout}
              label="重要性"
              name="importance"
              rules={[{ max: 50, message: '最多输入50个字符' }]}
            >
              <Select>
                {importanceOptions.map((item) => {
                  return (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              name="rangeTime"
              label="选择时间"
              rules={[
                {
                  type: 'array',
                  required: true,
                  message: '请输入时间',
                },
              ]}
            >
              <RangePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={0}>
          <Col span={12}>
            <Form.Item {...layout} label="提醒方式" name="remindType">
              <Select>
                {remindTypeOptions.map((item) => {
                  return (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item {...layout} label="提醒时间" name="remindTimeType">
              <Select>
                {remindTimeTypeOptions.map((item) => {
                  return (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item
              {...layout}
               name="createUser"
               label="创建人"
            >
              <Input disabled={true} style={{height:'32px',lineHeight:'32px'}}/>          
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
               {...layout}
               name="createTime"
               label="创建时间"
            >
              <DatePicker disabled={true}/>
              {/* <div style={{height:'32px',lineHeight:'32px'}}>{curCalendarInfo.id?dataFormat(curCalendarInfo.createTime):dataFormat(Date.now()/1000)}</div>               */}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              label="日程详情"
              name="scheduleContent"
            >
              <TextArea style={{ color: '#000',height: 175,resize: 'none' }}  />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {isShowRelationModal && <RelationUserInfo form={form} />}
    </GlobalModal>
  );
}
export default connect(({ calendarMg, loading, layoutG }) => {
  return { ...calendarMg, loading, layoutG };
})(AddCalendar);

const importanceOptions = [
  { name: '高', value: 'SCHEDULE__HIGH' },
  { name: '中', value: 'SCHEDULE__MIDDLE' },
  { name: '低', value: 'SCHEDULE__LOW' },
];
const remindTypeOptions = [
  { name: '无', value: 'SCHEDULE__NO' },
  { name: '系统消息', value: 'SCHEDULE__SYS' },
  { name: '短信', value: 'SCHEDULE__MSG' },
  { name: '即时通讯', value: 'SCHEDULE__IMSG' },
  { name: '邮件', value: 'SCHEDULE__EMAIL' },
  { name: '微信', value: 'SCHEDULE__WCHAT' },
];
const remindTimeTypeOptions = [
  { name: '提前30分钟', value: 'SCHEDULE__HALF__HOUR' },
  { name: '提前1小时', value: 'SCHEDULE__HOUR' },
  { name: '提前2小时', value: 'SCHEDULE__TWO__HOUR' },
];
