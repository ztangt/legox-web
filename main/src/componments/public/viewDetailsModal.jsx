import React from 'react';
import { Modal, Button, Typography, Descriptions, Table } from 'antd';
import { dataFormat } from '../../util/util';
import GlobalModal from '../GlobalModal';
import styles from './viewDetailsModal.less'

const { Text } = Typography;
/**
 * 查看详情弹窗组件
 * title:弹窗标题
 * containerId:父组件id
 * show(details):展示方法，可以外部调用
 * details:详情内容{key:"",value:"",type:1} type 无:显示文本 1:布尔 2:时间 3:详情
 * 作者:唐宗强
 */
export default class SugarModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      title: props.title,
      containerId: props.containerId,
      details: [],
       columns : [
        {
            title: '参数名称',
            dataIndex: 'paramName',
        },
        {
            title: '参数类型',
            dataIndex: 'paramType',
        },
        {
            title: '参数描述',
            dataIndex: 'paramDesc',
        }]


    };
  }
  /**
   *
   * @param {展示详情} details {key:"",value:""}
   */
  show(details) {
    this.setState({
      isShow: true,
      details,
    });
  }
  /**
   * 取消展示
   */
  onCancel() {
    this.setState({
      isShow: false,
    });
  }

  itemRander(element, index) {
    var span = 1;
    var value =
      element.value == null || element.value == undefined ? '' : element.value;
    if (element.type == 1) {//布尔值
      value = value == 1 ? '是' : '否';
    } else if (element.type == 2) {//时间
      value = dataFormat(value, 'YYYY-MM-DD HH:mm:ss');
    } else if (element.type == 3) {//描述
      span = 2;
      var valueList = value.split('\n');
      return (
        <Descriptions.Item span={span} key={index} label={element.key}>
          <textarea
            rows={valueList.length}
            disabled
            value={value}
            style={{ width: '100%', minHeight:'50px'}}
          ></textarea>
        </Descriptions.Item>
      );
    }
    return (
      <Descriptions.Item span={span} key={index} label={element.key}>
        {value}
      </Descriptions.Item>
    );
  }

  render() {
    const { isShow, title, containerId, details } = this.state;
    return (
      <GlobalModal
        visible={isShow}
        title={title}
        onCancel={this.onCancel.bind(this)}
        maskClosable={false}
        mask={false}
        widthType={2}
        incomingHeight={435}
        bodyStyle={{padding:'16px'}}
        getContainer={() => {
          return document.getElementById(containerId)||false;
        }}
        className={styles.viewModal}
        footer={[
          // <Button  key="cancel" onClick={this.onCancel.bind(this)}>
          //   取消
          // </Button>,
        ]}
      >
        <Descriptions bordered column={2}>
          {details.map((element, index) => {
            return this.itemRander(element, index);
          })}
        </Descriptions>
       {this.props.data&&<Table columns={this.state.columns} dataSource={this.props.data} pagination={false}/>}
      </GlobalModal>
    );
  }
}
