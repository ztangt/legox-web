import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Row, Col, Switch,Tabs, Input} from 'antd';
import GlobalModal from '../../../componments/GlobalModal';
import styles from '../index.less';

function mobile({
  dispatch,
  loading,
  onCancel,
  basesetObj,
  basesetId,
  partabilityList,
}) {
  
  const [form] = Form.useForm();
  const layout = { labelCol: { span: 16 }, wrapperCol: { span: 8 } };
  //新增页面点击保存触发 onFinish事件
  function onFinish(values) {
    console.log('values', values);
    let arr = [];
    partabilityList.forEach(function(item, i) {
      for (const key in values) {
        if (item.menuCode == key) {
          if (values['' + key]) {
            let policy = key + '_' + '1';
            arr.push(policy);
          } else {
            let policy = key + '_' + '0';
            arr.push(policy);
          }
        }
      }
    });
    arr = arr.join(',');
    console.log('arr', arr);
    dispatch({
      type: 'systemLayout/microBaseset',
      payload: {
        personJson: JSON.stringify({
          PERSONENUM__WORKCIRCLE: values.PERSONENUM__WORKCIRCLE ? 1 : 0,
          PERSONENUM__INTELLIREIMBUR: values.PERSONENUM__INTELLIREIMBUR ? 1 : 0,
          PERSONENUM__MESSAGEALERT: values.PERSONENUM__MESSAGEALERT ? 1 : 0,
        }),
        registerId: basesetId,
        isAbilityCodes: arr,
        copyRight: values?.copyRight
      },
      callback: function() {
        dispatch({
          type: 'systemLayout/updateStates',
          payload: {
            mobileModal: false,
          },
        });
      },
    });
  }

  function switchList(list) {
    let lists = [
      //固定来源
      { menuCode: 'PERSONENUM__WORKCIRCLE', menuName: '工作圈' },
      { menuCode: 'PERSONENUM__MESSAGEALERT', menuName: '消息提醒' },
      { menuCode: 'PERSONENUM__INTELLIREIMBUR', menuName: '智能报账' },
    ];
    lists = [...partabilityList, ...lists];
    let newArr = [];
    list.forEach(function(item, i) {
      lists.forEach(function(policy, j) {
        if (item.menuCode == policy.menuCode) {
          let obj = {
            menuCode: policy.menuCode,
            menuName: policy.menuName,
          };
          newArr.push(obj);
        }
      });
    });
    const listItems = newArr.map((item, i) => {
      return (
        <Col span={4} key={i}>
          <Form.Item
            label={item.menuName}
            {...layout}
            name={item.menuCode}
            valuePropName="checked"
            style={{ margin: '0' }}
          >
            <Switch />
          </Form.Item>
        </Col>
      );
    });
    return (
      <Row gutter={0} style={{ padding: '10px' }}>
        {listItems}
      </Row>
    );
  }

  return (
    <GlobalModal
      visible={true}
      widthType={3}
      title="基础配置显示页面"
      onCancel={onCancel}
      className={styles.add_form}
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById('systemLayout_container')||false;
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
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
      <div className={styles.mobileMain}>
        <Form
          form={form}
          //  fields={fields}
          initialValues={basesetObj}
          onFinish={onFinish}
          //  onValuesChange={this.onValuesChange.bind(this)}
        >
          <p className={styles.title}>我的</p>
          {switchList([
            { menuCode: 'CLOCK' },
            { menuCode: 'AGEND' },
            { menuCode: 'VIDIO' },
          ])}
          <p className={styles.title}>工作</p>
          {switchList([
            { menuCode: 'PERSONENUM__WORKCIRCLE' }, //固定
            { menuCode: 'YUOUM' },
            { menuCode: 'YUNPA' },
            { menuCode: 'YUNTU' },
            { menuCode: 'PERSONENUM__INTELLIREIMBUR' }, //固定
          ])}
          <p className={styles.title}>消息</p>
          {switchList([
            { menuCode: 'PERSONENUM__MESSAGEALERT' }, //固定
            { menuCode: 'YUBAM' },
          ])}
          <Tabs defaultActiveKey="COPYRIGHT">
            <Tabs.TabPane tab="版权配置" key="COPYRIGHT">
              <Form.Item
                  label="系统版权"
                  name='copyRight'
                  labelCol={{span:3}}
                  wrapperCol={{span:21}}
                >
                  <Input disabled={localStorage.getItem('isModifyCopyRight')==1?false:true}/>
                </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </div>
    </GlobalModal>
  );
}
export default connect(({ systemLayout, layoutG }) => ({
  ...systemLayout,
  layoutG,
}))(mobile);
