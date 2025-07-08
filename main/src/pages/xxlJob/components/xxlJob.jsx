import React,{useEffect,useState,useCallback,Fragment} from 'react'
import {connect} from 'dva'
import {Table, Button, Input, message, Modal, Form, DatePicker, Select, Row, Col, Space} from 'antd'
import IPagination from '../../../componments/public/iPagination'
import styles from '../index.less'
import AddJob from "./addJob";
import _ from "lodash";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import GlobalModal from '../../../componments/GlobalModal';

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 16,
  },
};
function XxlJob({dispatch,xxlJob}) {
  const {list, start, length, jobGroup, triggerStatus, jobDesc, executorHandler, author, selectedRowKeys, isShowAddModal, isShowJobModal, triggerJobId} = xxlJob
  const [height, setHeight] = useState(document.documentElement.clientHeight - 305)
  const [isShowHighSearch, setIsShowHighSearch] = useState(false);//是否显示高级搜索
  const { TextArea } = Input
  const onResize = useCallback(() => {
    setHeight(document.documentElement.clientHeight - 305)
  }, [])
  const [form] = Form.useForm();
  const [paramForm] = Form.useForm();
  const [jobGroupList, setJobGroupList] = useState([]);
  const [defaultJobGroupId, setDefaultJobGroupId] = useState(0);

  // 首次加载执行
  useEffect(() => {
    getJobGroup();
    getXxlJobList(0, 1000, defaultJobGroupId, "-1");
    form.setFieldValue("jobGroup", defaultJobGroupId );
  }, [defaultJobGroupId])

  const getJobGroup=()=>{
    dispatch({
      type:'xxlJob/getjobGroup',
      callback: (data) => {
        setJobGroupList(data);
        if(data && data.length > 0){
          setDefaultJobGroupId(data[0].id);
          console.log("id是");
          console.log(defaultJobGroupId);
        }
      }
    })
  }

  const getXxlJobList=(start,limit,jobGroup,triggerStatus)=>{
    dispatch({
      type:'xxlJob/getXxlJobList',
      payload:{
        start:start,
        length:limit,
        jobGroup:jobGroup,
        triggerStatus:triggerStatus,
      }
    })
  }

  const tableProps = {
    rowKey: 'id',
    columns: [
      {
        title: '序号',
        dataIndex: 'number',
        render: (text) => <a>{text}</a>,
      },
      {
        title: '任务ID',
        dataIndex: 'id',
      },
      {
        title: '任务描述',
        dataIndex: 'jobDesc'
      },
      {
        title: '调度类型',
        dataIndex: 'scheduleType',
        render:(value,row,index)=>{
          return row.scheduleType+"："+row.scheduleConf;
        }
      },
      {
        title: '运行模式',
        dataIndex: 'glueType'
      },
      {
        title: '负责人',
        dataIndex: 'author',
      },
      {
        title: '状态',
        dataIndex: 'triggerStatus',
        render:text=>{return text == '0'?'停止':text == '1'?'启动':'全部'}
      },
      {
        title: '操作',
        render: (text, record) => (
          <Space wrap>
            <a onClick={jobTrigger.bind(this, text, record)}>执行一次</a>
            {record.triggerStatus === 0 &&
              <a onClick={jobStart.bind(this, text, record)}>启动</a>
            }
            {record.triggerStatus === 1 &&
              <a onClick={jobStop.bind(this, text, record)}>停止</a>
            }
            <a onClick={handleMenuClick.bind(this, text, record)}>删除</a>
          </Space>
        ),
      },
    ],
    dataSource: list.map((item,index)=>{
      item.number=index+1
      return item
    }),//列表数据
    pagination: false,//分页
    rowSelection: {//多选
      selectedRowKeys:selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type:'xxlJob/updateStates',
          payload:{
            selectedRowKeys,
          }
        })
      }
    }
  }

  // 删除任务
  const handleMenuClick = (e, text, record) => {
    Modal.confirm({
      title: '确定删除?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        console.log(text.id);
        await dispatch({
          type: 'xxlJob/removeJobInfo',
          payload: {
            id: text.id,
          },
        });
        message.success('删除成功！');
        getXxlJobList(0, 1000, defaultJobGroupId, "-1")
      },
    });
  }
  // 启动任务
  const jobStart = (e, text, record) => {
    Modal.confirm({
      title: '确定启动?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        console.log(text.id);
        await dispatch({
          type: 'xxlJob/startJob',
          payload: {
            id: text.id,
          },
        });
        message.success('启动成功！');
        getXxlJobList(0, 1000, defaultJobGroupId, "-1")
      },
    });
  }
  // 停止任务
  const jobStop = (e, text, record) => {
    Modal.confirm({
      title: '确定停止?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        console.log(text.id);
        await dispatch({
          type: 'xxlJob/stopJob',
          payload: {
            id: text.id,
          },
        });
        message.success('停止成功！');
        getXxlJobList(0, 1000, defaultJobGroupId, "-1")
      },
    });
  }
  // 执行一次弹框
  const jobTrigger = (e, text, record) => {
    dispatch({
      type: 'xxlJob/updateStates',
      payload: {
        isShowAddModal: false,
        isShowJobModal: true,
        triggerJobId: text.id,
      }
    })
  }
  // 点击搜索栏搜索
  const onFinishSearch = (values) => {
    console.log('开始生成雪花id');
    for(let i=0;i<500;i++){
      console.log(SNOWFLAKE());
    }

    console.log('values=', values);
    console.log(defaultJobGroupId);
    if(values.jobGroup==null){
      message.warning('请选择执行器！');
      return;
    }
    if(values.triggerStatus==null){
      message.warning('请选择状态！');
      return;
    }
    dispatch({
      type:'xxlJob/getXxlJobList',
      payload:{
        start:0,
        length:1000,
        jobGroup:values.jobGroup,
        triggerStatus:values.triggerStatus,
        jobDesc:values.jobDesc,
        executorHandler:values.jobHandler,
        author:values.author,
      }
    })
  }

  // 新增任务
  const addJob = () => {
    dispatch({
      type: 'xxlJob/updateStates',
      payload: {
        isShowAddModal: true,
        jobGroup: form.getFieldValue("jobGroup"),
        jobGroupList: jobGroupList,
        defaultJobGroupId: defaultJobGroupId
      }
    })
  }

  // 执行一次弹框按钮中点击取消触发
  const handleCancel = () => {
    dispatch({
      type: 'xxlJob/updateStates',
      payload: {
        isShowAddModal: false,
        isShowJobModal: false,
      }
    })
  }
  // 任务执行一次的弹框点击保存触发
  const handleOk = () => {
    let paramFormValue = paramForm.getFieldsValue(true);
    dispatch({
      type: 'xxlJob/triggerJob',
      payload: {
        id: triggerJobId,
        executorParam: paramFormValue.executorParam,
        addressList: paramFormValue.addressList,
      },
      callback: () => {
        dispatch({
          type: 'xxlJob/updateStates',
          payload: {
            isShowAddModal: false,
            isShowJobModal: false,
          }
        })
        message.success('执行一次成功！');
        getXxlJobList(0, 1000, defaultJobGroupId, "-1")
      }
    })
  }

  // 函数总的返回
  return (
    <div className={styles.warp} id="contractLedger_head">
      <div className={styles.searchWarp}>
        <div>
          <Form
            colon={false}
            form={form}
            name="basic"
            onFinish={onFinishSearch}
            style={{ width: '100%' }}
            className={styles.advSearch}
            initialValues={{triggerStatus: '-1'}}
              >
            <Row gutter={25}>
              <Col span={4}>
                <Form.Item label="执行器" name="jobGroup">
                  <Select placeholder="请选择执行器" allowClear>
                    {jobGroupList &&
                      jobGroupList.length !== 0 &&
                      jobGroupList.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.id}>
                            {item.title}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="状态" name="triggerStatus">
                  <Select placeholder="请选择状态" allowClear defaultValue={'-1'}>
                    <Option value={"-1"}>全部</Option>
                    <Option value={"0"}>停止</Option>
                    <Option value={"1"}>启动</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="任务描述" name="jobDesc">
                <Input
                  placeholder="请输入任务描述"
                  size="small"
                />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="jobHandler" name="jobHandler">
                <Input
                  placeholder="请输入jobHandler"
                  size="small"
                />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="负责人" name="author">
                <Input
                  placeholder="请输入负责人"
                  size="small"
                />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item {...tailLayout}>
                  <Button htmlType="submit">查询</Button>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button onClick={addJob}>新增</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div className={styles.table}>
        <Table {...tableProps} scroll={{ y: 'calc(100vh - 270px) '}} />
      </div>
      {isShowAddModal &&
        <AddJob />}
      {isShowJobModal &&
        <GlobalModal
          title="执行一次"
          visible={true}
          widthType={1}
          incomingWidth={500}
          incomingHeight={200}
          onCancel={handleCancel}
          maskClosable={false}
          mask={false}
          okType={'submit'}
          centered
          getContainer={() => {
            return document.getElementById('contractLedger_head')||false
          }}
          footer={[
            <Button key="cancel"  onClick={handleCancel}>取消</Button>,
            <Button key="submit" onClick={handleOk}>保存</Button>
          ]}
        >
        <Form form={paramForm}>
          <Row gutter={0}>
            <Col span={24}>
              <Form.Item label="任务参数" name="executorParam">
                <TextArea
                  placeholder="任务参数"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col span={24}>
              <Form.Item label="机器地址" name="addressList">
                <TextArea
                  placeholder="请输入本次执行的机器地址，为空则从执行器获取"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        </GlobalModal>
      }
    </div>
  );
}

export default connect(({xxlJob, layoutG})=>({xxlJob, layoutG}))(XxlJob)
