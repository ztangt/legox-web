/**
 * @author zhangww
 * @description 新增页modal
 */
import { connect } from 'dva';
import _ from 'lodash';
import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Modal,
  Button,
  Popconfirm,
  Table,
  Typography,
} from 'antd';
import AddTextModal from '../addTextModal';


function Index({ dispatch, desktopLayout }) {
  const { 
    isUpdateTextModalVisible, 
    addTextData,
    isAddTextModalVisible,
   } = desktopLayout;

  function onHideModal() {
    dispatch({
      type: 'desktopLayout/updateStates',
      payload: {
        isUpdateTextModalVisible: false,
      },
    });
    window.location.reload();
  }

  const [form] = Form.useForm();
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState(addTextData);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = record => record.key === editingKey;
  const edit = record => {
    form.setFieldsValue({
      deskSectionName: '',
      deskSectionUrl: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const del = record => {
    dispatch({
      type: 'desktopLayout/delColumn',
      payload: {
        deskSectionIds: record.id,
      },
      callback: () => {
        dispatch({
          type: 'desktopLayout/getColumnList',
          payload: {
            start: 1,
            limit: 100,
          },
        });
        // const newData = [...data];
        // const index = newData.findIndex(item => record.id === item.key);
        // newData.splice(index, 1);
        // setData(newData);
      },
    });
  };
 
  const columns = [
    {
      title: '栏目名称',
      dataIndex: 'deskSectionName',
      width: '65%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <>
            <Typography.Link
              onClick={() => {
                setEditData(record)
                dispatch({
                  type: 'desktopLayout/updateStates',
                  payload: {
                    isAddTextModalVisible: true,
                  },
                });
              }}
              style={{ marginRight: 10 }}
            >
              编辑
            </Typography.Link>
            <Popconfirm
              title="确定删除?"
              onConfirm={() => del(record)}
              // onCancel={cancel}
              okText="确定"
              cancelText="取消"
            >
              <Typography.Link>删除</Typography.Link>
            </Popconfirm>
          </>
        )
      },
    },
  ];

  return (
    <Modal
      title="编辑文字栏目"
      open={true}
      onCancel={onHideModal}
      width={400}
      bodyStyle={{ height: '400px' }}
      mask={false}
      maskClosable={false}
      footer={[
        <Button key="back" onClick={onHideModal}>
          关闭
        </Button>,
      ]}
      getContainer={() => {
        return document.getElementById('desktop_wrapper') || false;
      }}
    >
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={addTextData.filter((r) => r.dr == 0)}
          columns={columns}
          scroll={{y: 294}}
          rowClassName="editable-row"
        />
      </Form>
      { isAddTextModalVisible && <AddTextModal editData={editData}/>}
    </Modal>
  );
}

export default connect(({ desktopLayout }) => ({
  desktopLayout,
}))(Index);
