import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Form, Button, Input, Select, Col, Row, Divider} from 'antd';
import { connect } from 'umi';
import GlobalModal from '../../../componments/GlobalModal';
function addJob({dispatch,xxlJob}){
  const {
    start,
    length,
    jobGroup,
    triggerStatus,
    jobDesc,
    executorHandler,
    author,
    jobGroupList,
    defaultJobGroupId
  } = xxlJob;
  const [basicForm] = Form.useForm();
  const { TextArea } = Input
  useEffect(() => {
    basicForm.setFieldValue("jobGroup", defaultJobGroupId );
  }, [1])
  const [scheduleType, setScheduleType] = useState('CRON');

  const handleCancel = () => {
    dispatch({
      type: 'xxlJob/updateStates',
      payload: {
        isShowAddModal: false,
      }
    })
  }

  const handleOk = () => {
    let formValue = basicForm.getFieldsValue(true);

    formValue['alarmEmail']='';
    formValue['glueRemark']='GLUE代码初始化';
    formValue['glueSource']='';
    let cronVal = basicForm.getFieldValue("schedule_conf_CRON");
    if(cronVal && cronVal != null){
      formValue['cronGen_display']=cronVal;
      formValue['scheduleConf']=cronVal;
      formValue['schedule_conf_FIX_RATE']='';
      formValue['schedule_conf_FIX_DELAY']='';
    }
    let rateVal = basicForm.getFieldValue("schedule_conf_FIX_RATE");
    if(rateVal && rateVal != null){
      formValue['scheduleConf']='';
      formValue['cronGen_display']='';
      formValue['schedule_conf_CRON']='';
      formValue['schedule_conf_FIX_DELAY']='';
    }
    let delayVal = basicForm.getFieldValue("scheduleType");
    if(delayVal === 'NONE'){
      formValue['scheduleConf']='';
      formValue['cronGen_display']='';
      formValue['schedule_conf_CRON']='';
      formValue['schedule_conf_FIX_RATE']='';
      formValue['schedule_conf_FIX_DELAY']='';
    }
    console.log(formValue);
    dispatch({
      type: 'xxlJob/addJobInfo',
      payload: {
        ...formValue
      }
    });
    dispatch({
      type: 'xxlJob/getXxlJobList',
      payload: {
        start: start,
        length: length,
        jobGroup: jobGroup,
        triggerStatus: triggerStatus,
        jobDesc: jobDesc,
        executorHandler: executorHandler,
        author: author,
      }
    })
  }

  const onChange = (value) => {
    console.log(value);
    setScheduleType(value);
  }

  return (
    <GlobalModal
      title="添加任务"
      visible={true}
      widthType={1}
      incomingWidth={1000}
      incomingHeight={553}
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
      <Form form={basicForm} initialValues={{ scheduleType: 'CRON', glueType: 'BEAN', executorRouteStrategy: 'FIRST', misfireStrategy: 'DO_NOTHING', executorBlockStrategy: 'SERIAL_EXECUTION', executorTimeout: '0', executorFailRetryCount: '0' }}>
        <Divider orientation={"left"}>基础配置</Divider>
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item label="执行器" name="jobGroup" rules={[
              {
                required: true,
              },
            ]}>
              <Select placeholder="请选择执行器" allowClear>
                {/*<Option value={"4"}>ic执行器</Option>
                <Option value={"1"}>示例执行器</Option>*/}
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
              <Col span={12}>
            <Form.Item label="任务描述" name="jobDesc" rules={[
              {
                required: true,
              },
            ]}>
              <Input
                placeholder="请输入任务描述"
                size="small"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item label="负责人" name="author" rules={[
              {
                required: true,
              },
            ]}>
              <Input
                placeholder="请输入负责人"
                size="small"
              />
            </Form.Item>
          </Col>
            <Col span={12}>
              <Form.Item label="调度类型" name="scheduleType" rules={[
                {
                  required: true,
                },
              ]}>
                <Select placeholder="请选择状态" allowClear defaultValue={"CRON"} onChange={onChange} >
                  <Option value={"NONE"}>无</Option>
                  <Option value={"CRON"}>CRON</Option>
                  <Option value={"FIX_RATE"}>固定速度</Option>
                </Select>
              </Form.Item>
            </Col>
        </Row>
        <Divider orientation={"left"}>调度任务配置</Divider>
        <Row gutter={0}>
          {scheduleType == 'CRON' && (
            <Col span={12}>
              <Form.Item label="Cron" name="schedule_conf_CRON" rules={[
                {
                  required: true,
                },
              ]}>
                <Input
                  placeholder="请输入定时任务执行时间的表达式"
                  size="small"
                />
              </Form.Item>
            </Col>
          )}
          {scheduleType == 'FIX_RATE' && (
            <Col span={12}>
              <Form.Item label="固定速度" name="schedule_conf_FIX_RATE" rules={[
                {
                  required: true,
                },
              ]}>
                <Input
                  placeholder="请输入(Second)"
                  size="small"
                />
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item label="运行模式" name="glueType" rules={[
              {
                required: true,
              },
            ]}>
              <Select placeholder="请选择运行模式" allowClear defaultValue={"BEAN"}>
                <Option value={"BEAN"}>BEAN</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="JobHandler" name="executorHandler" rules={[
          {
            required: true,
          },
        ]}>
          <Input
            placeholder="JobHandler"
            size="small"
          />
        </Form.Item>
        <Form.Item label="任务参数" name="executorParam">
          <TextArea
            placeholder="任务参数"
            size="small"
          />
        </Form.Item>
        <Divider orientation={"left"}>高级配置</Divider>
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item label="子任务ID" name="childJobId">
              <Input
                placeholder="请输入子任务的任务ID,如存在多个则逗号分隔"
                size="small"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="路由策略" name="executorRouteStrategy">
              <Select placeholder="请选择路由策略" allowClear defaultValue={"FIRST"}>
                <option value="FIRST">第一个</option>
                <option value="LAST">最后一个</option>
                <option value="ROUND">轮询</option>
                <option value="RANDOM">随机</option>
                <option value="CONSISTENT_HASH">一致性HASH</option>
                <option value="LEAST_FREQUENTLY_USED">最不经常使用</option>
                <option value="LEAST_RECENTLY_USED">最近最久未使用</option>
                <option value="FAILOVER">故障转移</option>
                <option value="BUSYOVER">忙碌转移</option>
                <option value="SHARDING_BROADCAST">分片广播</option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item label="调度过期策略" name="misfireStrategy">
              <Select placeholder="调度过期策略" allowClear defaultValue={"DO_NOTHING"}>
                <option value="DO_NOTHING" selected="">忽略</option>
                <option value="FIRE_ONCE_NOW">立即执行一次</option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="阻塞处理策略" name="executorBlockStrategy">
              <Select placeholder="阻塞处理策略" allowClear defaultValue={"SERIAL_EXECUTION"}>
                <option value="SERIAL_EXECUTION">单机串行</option>
                <option value="DISCARD_LATER">丢弃后续调度</option>
                <option value="COVER_EARLY">覆盖之前调度</option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col span={12}>
            <Form.Item label="任务超时时间" name="executorTimeout">
              <Input
                placeholder="任务超时时间，单位秒，大于零时生效"
                size="small"
                defaultValue={"0"}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="失败重试次数" name="executorFailRetryCount">
              <Input
                placeholder="失败重试次数，大于零时生效"
                size="small"
                defaultValue={"0"}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </GlobalModal>
  )
}
export default connect(({xxlJob})=>({xxlJob}))(addJob)
