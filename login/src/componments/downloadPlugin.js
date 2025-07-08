import { Modal, Table, Input, Button, Select, Row, Col, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'dva';
import { env } from '../../../project_config/env';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

function downloadPlugin({ dispatch, loading, user }) {
  const { tenantId } = user;
  const [pluginList, setPluginList] = useState([]);
  const [plugTypeList, setPlugTypeList] = useState([]);
  //插件TableProps
  const tableProps = {
    rowKey: 'plugTypeId',
    columns: [
      {
        title: '',
        dataIndex: 'typeName',
        align: 'left'
      },
    ],
    expandable: { expandedRowRender, onExpand },
    dataSource: plugTypeList,
    pagination: false,
  };

  function onExpand(expanded, record) {
    if (expanded) {
      var curIndex = -1;
      plugTypeList.forEach((element, index) => {
        if (element.plugTypeId == record.plugTypeId) {
          curIndex = index;
        }
      });
      if (curIndex != -1) {
        getPluginList(record.plugTypeId, curIndex);
      }
    }
  }

  function expandedRowRender(record, index) {
    const subTableProps = {
      rowKey: 'plugId',
      columns: [
        {
          title: '插件名称',
          dataIndex: 'plugName',
          align: 'left',
        },

        {
          title: '格式',
          dataIndex: 'plugFormat',
          align: 'left',
        },

        {
          title: '操作',
          align: 'left',
          render: (text, record) => {
            return (
              <>
                <a
                  style={{ marginLeft: '5px' }}
                  // href={`${env}/public/fileStorage/downFile?fileStorageId=${record.fileStorageId}`}
                  onClick={() => onDownloadClick(record.fileStorageId)}
                >
                  下载
                </a>
              </>
            );
          },
        },
      ],
      dataSource: pluginList[index],
      pagination: false,
    };

    return <Table {...subTableProps}></Table>;
  }

  //关闭
  const onClose = (values) => {
    dispatch({
      type: 'user/updateStates',
      payload: {
        isShowDownloadPlugin: false,
      },
    });
  };

  //初始
  useEffect(() => {
    getPlugType();
  }, []);

  //换页
  function changePage(start, limit) {
    getPluginList(start, limit);
  }

  function getPlugType() {
    dispatch({
      type: 'user/getPlugType',
      payload: {},
      callback: (data) => {
        setPlugTypeList(data.list);
        var plugList = [];
        data.forEach((element) => {
          plugList.push([]);
        });
        setPluginList(plugList);
      },
    });
  }

  //获取插件
  function getPluginList(plugTypeId, index) {
    dispatch({
      type: 'user/getPlugList',
      payload: {
        plugTypeId,
        start: 0,
        limit: 1000,
        tenantId,
      },
      callback: (data) => {
        var list = [...pluginList];
        list[index] = data.list;
        setPluginList(list);
      },
    });
  }

  function onDownloadClick(fileStorageId) {
    dispatch({
      type: 'user/downloadFile',
      payload: {
        fileStorageId,
      },
    });
  }

  return (
    <Modal
      visible={true}
      title="插件信息"
      onCancel={onClose}
      maskClosable={false}
      mask={false}
      width={800}
      bodyStyle={{height:280,padding: 16}}
      getContainer={() => {
        return document.getElementById('login');
      }}
      footer={[
        <Button
          key="submit"
          type="primary"
          htmlType={'submit'}
          onClick={onClose}
        >
          关闭
        </Button>,
      ]}
    >
      <Table {...tableProps} scroll={{ y: '240px' }}></Table>
    </Modal>
  );
}
export default connect(({ user }) => {
  return { user };
})(downloadPlugin);
