import React,{ useContext, useRef, useState, useEffect } from 'react';
import { Select, Modal, Input, Table, Tabs, Button, Form } from 'antd';
import { dataFormat } from '../../../../util/util';

export const smallLayout = { labelCol: { span: 6 }, wrapperCol: { span: 10 } };

export const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

export const longLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  render,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

// 字段明细列数据(API)
const defaultDetailColumns = ({
  handleDetailSave,
  onFormatSelectChange,
  canEditor,
  onResultTypetChange,
}) => {
  return [
    {
      title: '字段编码',
      dataIndex: 'resultCode',
      key: 'resultCode',
      editable: canEditor,
    },
    {
      title: '字段名称',
      dataIndex: 'resultDesc',
      key: 'resultDesc',
      editable: canEditor,
    },
    {
      title: '字段类型',
      dataIndex: 'resultType',
      key: 'resultType',
      render: (text, record, index) => (
        <Select
          style={{ width: '150px' }}
          value={text || 'String'}
          onChange={val => onResultTypetChange(text, record, index, val)}
          options={[
            {
              value: 'String',
              label: '字符串',
            },
            {
              value: 'Integer',
              label: '整型',
            },
            {
              value: 'Long',
              label: '长整型',
            },
            {
              value: 'BigDecimal',
              label: '金额型',
            },
          ]}
        />
      ),
    },
    {
      title: '控件类型',
      dataIndex: 'resultControl',
      key: 'resultControl',
      render: (text, record, index) => (
        <Select
          style={{ width: '150px' }}
          value={text || 'MONEY'}
          onChange={val => onFormatSelectChange(text, record, index, val)}
          options={[
            {
              value: 'MONEY',
              label: '金额',
            },
            {
              value: 'DATE',
              label: '日期',
            },
            {
              value: 'TEXT',
              label: '文本',
            },
          ]}
        />
      ),
    },
  ];
};

// 字段明细列(API)
export const detailColumns = ({
  handleDetailSave,
  onFormatSelectChange,
  canEditor,
  onResultTypetChange,
}) => {
  return defaultDetailColumns({
    handleDetailSave,
    onFormatSelectChange,
    canEditor,
    onResultTypetChange,
  }).map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleDetailSave,
      }),
    };
  });
};

// 参数信息列数据(API)
const defaultOptionsColumns = ({ dataSource, handleDelete }) => {
  return [
    {
      title: '序号',
      dataIndex: 'key',
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      title: '参数名称',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '参数类型',
      dataIndex: 'age',
      editable: true,
    },
    {
      title: '参数描述',
      dataIndex: 'dec',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 120,
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Button onClick={() => handleDelete(record.key)}>删除</Button>
        ) : null,
    },
  ];
};

// 参数信息列(API)
export const optionsColumns = ({ dataSource, handleDelete, handleSave }) => {
  return defaultOptionsColumns({ dataSource, handleDelete }).map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
};

// 参数信息列（bean）
export const beanOptionsColumns = ({
  handleSave,
  tableList,
  onSelectChange,
  onInputChange,
  onSelectFormChange,
  canEditor,
  onParamTypeChange,
}) => {
  return [
    {
      title: '序号',
      dataIndex: 'key',
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      title: '参数名称',
      dataIndex: 'paramName',
      editable: canEditor,
    },
    {
      title: '参数类型',
      dataIndex: 'paramType',
      // editable: canEditor,
      width: 120,
      render: (text, record, index) => (
        <Select
          style={{ width: '110px' }}
          value={text || 'String'}
          onChange={val => onParamTypeChange(text, record, index, val)}
          options={[
            {
              value: 'String',
              label: '字符串',
            },
            {
              value: 'Integer',
              label: '整型',
            },
            {
              value: 'Long',
              label: '长整型',
            },
            {
              value: 'BigDecimal',
              label: '金额型',
            },
          ]}
        />
      ),
    },
    {
      title: '参数描述',
      dataIndex: 'paramDesc',
      editable: canEditor,
    },
    {
      title: '绑定信息',
      dataIndex: 'valueBound',
      width: 120,
      render: (text, record, index) => (
        <Select
          style={{ width: '110px' }}
          value={text || 'FROMFORM'}
          onChange={val => onSelectChange(text, record, index, val)}
          options={[
            {
              value: 'FROMFORM',
              label: '来自表单',
            },
            {
              value: 'FROMFIXED',
              label: '固定值',
            },
            // {
            //   value: 'SYSTEM',
            //   label: '系统预置',
            // },
          ]}
        />
      ),
    },
    {
      title: '信息详情',
      dataIndex: 'paramValue',
      width: 120,
      render: (text, record, index) => {
        if (record.valueBound === 'FROMFORM') {
          const options = tableList.reduce((pre, cur) => {
            if (cur.tableScope === 'MAIN') {
              if (cur.columnList.length > 0) {
                cur.columnList.forEach(item => {
                  pre.push({
                    value: `${cur.formTableCode}*${item.formColumnCode}`,
                    label: item.formColumnName,
                  });
                });
              }
            }

            return pre;
          }, []);

          return (
            <Select
              style={{ width: '110px' }}
              value={text || ''}
              options={options}
              onChange={val => onSelectFormChange(text, record, index, val)}
            />
          );
        }
        if (record.valueBound === 'FROMFIXED') {
          return (
            <Input
              value={text || ''}
              onChange={e => onInputChange(text, record, index, e)}
            />
          );
        }
        // if (record.valueBound === 'SYSTEM') {
        //   return <></>;
        // }
        return null;
      },
    },
  ].map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        render: col.render,
        handleSave,
      }),
    };
  });
};

// 事件列表
export const eventTableProps = ({
  dispatch,
  evenList,
  selectedRowKeys,
  selectedRows,
}) => {
  return {
    rowKey: 'id',
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        width: 80,
        render: (text, obj, index) => <span>{index + 1}</span>,
      },
      {
        title: '事件名称',
        dataIndex: 'eventName',
      },
      {
        title: '事件方法',
        dataIndex: 'eventMethod',
      },
    ],
    dataSource: evenList,
    scroll: { y: 'calc(100vh - 480px)' },
    pagination: false,
    rowSelection: {
      selectedRowKeys,
      selectedRows,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'templateEditor/updateStates',
          payload: {
            selectEventKeys: selectedRowKeys,
            selectEventRows: selectedRows,
          },
        });
      },
      type: 'checkbox',
    },
  };
};
