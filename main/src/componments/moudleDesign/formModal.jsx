import { Table, Button, Modal, message } from 'antd';
import { connect } from 'umi';
import { dataFormat } from '../../util/util';
import { useState, useEffect } from 'react';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
    render: (text, obj, index) => <span>{index + 1}</span>,
  },
  {
    title: '表单名称',
    dataIndex: 'bizFormName',
    key: 'bizFormName',
    width: 200,
    render: text => (
      <div className="col_ellipsis" title={text}>
        {text}
      </div>
    ),
  },
  {
    title: '表单编码',
    dataIndex: 'bizFormCode',
    key: 'bizFormCode',
    // width:'150px',
  },
  {
    title: '版本号',
    dataIndex: 'formVersion',
    key: 'formVersion',
    // width:'80px'，
  },
  {
    title: '分类名称',
    dataIndex: 'ctlgName',
    key: 'ctlgName',
    // width:'150px',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    // width:'150px',
    render: text => <div>{dataFormat(text, 'YYYY-MM-DD')}</div>,
  },
];
function FromModal({
  form,
  deployFormName,
  formlistModels,
  stateInfo,
  namespace,
  dataName,
  tableColumnName,
  dispatch,
}) {
  const [selectFormId, setSelectFormId] = useState(
    stateInfo[dataName]?.deployFormId,
  );
  const [selectFormName, setSelectFormName] = useState(
    deployFormName,
  );

  const handelCancle = () => {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        isShowModal: false,
      },
    });
  };
  //表单
  const rowSelectionForm = {
    selectedRowKeys: [selectFormId],
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectFormId(selectedRowKeys.toString());
      setSelectFormName(selectedRows[0].bizFormName);
    },
  };

  //保存
  const saveList = () => {
    form.setFieldsValue({ [`deployFormId`]: selectFormId });
    form.setFieldsValue({ [`deployFormName`]: selectFormName });
    stateInfo[dataName]['deployFormId'] = selectFormId;
    // stateInfo[dataName]['deployFormName'] = selectFormName;
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: stateInfo[dataName],
        isShowModal: false,
      },
    });
  };
  return (
    <Modal
      visible={true}
      title="表单选择"
      onCancel={handelCancle}
      width={800}
      centered
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById('lr_container');
      }}
      footer={[
        <Button key="cancel" onClick={handelCancle}>
          取消
        </Button>,
        <Button type="primary" key="submit" onClick={saveList}>
          确定
        </Button>,
      ]}
      bodyStyle={{
        padding: '0px',
        height: 'calc(100vh - 260px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Table
        dataSource={formlistModels}
        columns={columns}
        rowKey={'deployId'}
        scroll={{ y: 'calc(100% - 88px)' }}
        pagination={false}
        onRow={(record) => {
          return {
            onClick: (event) => {
              if (record.deployId == selectFormId) {
                setSelectFormId('')
                setSelectFormName('')
              } else {
                setSelectFormId(record.deployId);
                setSelectFormName(record.bizFormName);
              }
            },
          };
        }}
        rowSelection={{
          type: 'radio',
          ...rowSelectionForm,
        }}
      />
    </Modal>
  );
}
export default FromModal;
