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
  InputNumber,
  Modal,
  Button,
  Popconfirm,
  Table,
  Typography,
} from 'antd';

const defaultHeight = 400;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          // rules={[
          //   {
          //     required: true,
          //     message: `请输入${title}!`,
          //   },
          //   {
          //     pattern: /^[^\s]*$/,
          //     message: '禁止输入空格',
          //   },
          //   title === '栏目名称' ? 
          //   { max: 20, message: '最多输入20个字符' } : {  },
          // ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function Index({ dispatch, desktopLayout }) {
  const { isUpdateModalVisible, addData } = desktopLayout;

  function onHideModal() {
    dispatch({
      type: 'desktopLayout/updateStates',
      payload: {
        isUpdateModalVisible: false,
      },
    });
    window.location.reload();
  }

  const [form] = Form.useForm();
  const [data, setData] = useState(addData);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = record => record.key === editingKey;
  const edit = record => {
    form.setFieldsValue({
      deskSectionName: '',
      deskSectionUrl: '',
      ...record,
      deskSectionHigh: record.deskSectionHigh || defaultHeight,
    });
    console.log(record);
    setEditingKey(record.key);
  };
  const del = record => {
    dispatch({
      type: 'desktopLayout/delColumn',
      payload: {
        deskSectionIds: record.id,
      },
      callback: () => {
        const newData = [...data];
        const index = newData.findIndex(item => record.id === item.id);
        newData.splice(index, 1);
        setData(newData);
      },
    });
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async id => {
    try {
      const row = await form.validateFields();
      dispatch({
        type: 'desktopLayout/updateColumn',
        payload: {
          id,
          deskSectionName: row.deskSectionName,
          deskSectionUrl: row.deskSectionUrl,
          deskSectionHigh: row.deskSectionHigh,
        },
        callback: () => {
          const newData = [...data];
          const index = newData.findIndex(item => id === item.id);
          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...row,
            });
            setData(newData);
            setEditingKey('');
          } else {
            newData.push(row);
            setData(newData);
            setEditingKey('');
          }
        },
      });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const columns = [
    {
      title: '栏目名称',
      dataIndex: 'deskSectionName',
      width: '25%',
      editable: true,
    },
    // {
    //   title: '栏目高度',
    //   dataIndex: 'deskSectionHigh',
    //   width: '15%',
    //   editable: true,
    //   render: (_, record) => {
    //     return <span>{record?.deskSectionHigh || defaultHeight}</span>
    //   }
    // },
    {
      title: '栏目链接',
      dataIndex: 'deskSectionUrl',
      width: '60%',
      editable: true,
      ellipsis: true,
      render: (_, record) => {
        return <span title={record.deskSectionUrl}>{record.deskSectionUrl}</span>
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </Typography.Link>
            <Popconfirm title="确定取消?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
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
        );
      },
    },
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'deskSectionHigh' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Modal
      title="编辑栏目"
      open={true}
      onCancel={onHideModal}
      width={800}
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
      <p style={{color:'red'}}>链接格式为: 微服务全名/路由地址 例: cmaxxx/pageName</p>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data.filter((r) => r.dr == 0)}
          columns={mergedColumns}
          rowClassName="editable-row"
          scroll={{y: 280}}
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </Modal>
  );
}

export default connect(({ desktopLayout }) => ({
  desktopLayout,
}))(Index);
