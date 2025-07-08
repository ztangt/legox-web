import { Button, Form, Input, Modal, TreeSelect } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
function addInvoiceModal({
  dispatch,
  invoiceManagement,
  getInvoiceTreeFn,
  setExpandedKeys,
  containerId,
}) {
  const {
    isShow,
    type,
    parentId,
    compareData,
    detailData,
    treeData,
    parentName,
    selectData,
    detailInvoice,
    searchTree,
  } = invoiceManagement;
  const [form] = Form.useForm();
  const [selectId, setSelectId] = useState(parentId);
  useEffect(() => {
    if (detailInvoice.id) {
      setSelectId(detailInvoice.parentId);
    }
  }, []);
  const handelCanel = () => {
    dispatch({
      type: 'invoiceManagement/updateStates',
      payload: {
        isShow: false,
        detailData: {},
        detailInvoice: {},
        parentName: {},
      },
    });
  };
  const onFinish = (values) => {
    if (detailData.classifyId) {
      dispatch({
        type: 'invoiceManagement/updateInvoiceTree',
        payload: {
          classifyName: values.classifyName,
          classifyId: detailData.classifyId,
          parentId: selectId,
        },
        callback: () => {
          if (searchTree) {
            getInvoiceTreeFn(searchTree, 0);
          } else {
            selectId == 0
              ? getInvoiceTreeFn('', 0)
              : getInvoiceTreeFn('', parentId, true);
          }
        },
      });
    } else {
      dispatch({
        type: 'invoiceManagement/addInvoiceTree',
        payload: {
          classifyName: values.classifyName,
          parentId: selectId,
        },
        callback: () => {
          getInvoiceTreeFn('', parentId, true);
        },
      });
    }
    if (parentId == '0') {
      setExpandedKeys(['pjfl']);
    }
    handelCanel();
  };
  //格式话节点数据
  const ctlgTreeFn = (tree) => {
    tree.map((item) => {
      item.value = item.classifyId;
      item.title = item.classifyName;
      if (item.children) {
        ctlgTreeFn(item.children);
      }
    });
    return tree;
  };
  const loopTree = (data, id, newData) => {
    data.forEach((item) => {
      if (item.classifyId == id) {
        item.children = newData;
      } else {
        if (item.children) {
          loopTree(item.children, id, newData);
        }
      }
    });
    return data;
  };
  const onTreeExpand = (expandedKeys) => {
    dispatch({
      type: 'invoiceManagement/getInvoiceTree',
      payload: {
        classifyName: '',
        classifyId: expandedKeys[expandedKeys.length - 1],
      },
      callback: (data) => {
        data.data.jsonResult.forEach((item) => {
          if (item.isHaveChild == '1') {
            item.children = [{ key: '-1' }];
          }
        });
        if (detailInvoice.classifyId) {
          data.data.jsonResult = data.data.jsonResult.filter(
            (item) => item.classifyId !== detailInvoice.classifyId,
          );
        }
        selectData.forEach((item) => {
          if (item.classifyId == expandedKeys[expandedKeys.length - 1]) {
            item.children = data.data.jsonResult;
          }
        });
        dispatch({
          type: 'invoiceManagement/updateStates',
          payload: {
            selectData: [
              ...loopTree(
                selectData,
                expandedKeys[expandedKeys.length - 1],
                data.data.jsonResult,
              ),
            ],
          },
        });
      },
    });
  };
  const onSelect = (value, node, extra) => {
    setSelectId(value);
  };
  return (
    <Modal
      title={detailData.classifyId ? '修改分类' : '新增分类'}
      visible={true}
      getContainer={() => {
        return document.getElementById(
          containerId || 'invoiceManagement_container',
        );
      }}
      mask={false}
      maskClosable={false}
      centered
      width={400}
      bodyStyle={{ height: 'auto' }}
      onCancel={handelCanel}
      footer={[
        <Button key="cancel" onClick={handelCanel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.submit();
          }}
        >
          保存
        </Button>,
      ]}
    >
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          parentId: detailData.classifyId
            ? detailInvoice.parentId == '0'
              ? '票据分类'
              : detailInvoice.parentClassifyName
            : parentName,
          classifyName: detailData && detailData.classifyName,
        }}
      >
        <Form.Item
          label="上级分类"
          name="parentId"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={ctlgTreeFn(
              detailInvoice.id
                ? selectData.filter(
                    (item) => item.classifyId !== detailInvoice.classifyId,
                  )
                : selectData,
            )}
            placeholder="请选择分类"
            onTreeExpand={onTreeExpand}
            onSelect={onSelect}
          />
        </Form.Item>
        <Form.Item
          label="分类名称"
          name="classifyName"
          rules={[
            { required: true, message: '请输入分类名称' },
            { max: 50, message: '最多输入50字符' },
            {
              pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
              message: '请输入数字、字母、汉字',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default connect(({ invoiceManagement }) => ({ invoiceManagement }))(
  addInvoiceModal,
);
