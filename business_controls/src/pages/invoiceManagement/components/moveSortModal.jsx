import { Button, Modal, Tree, message } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
function moveSortModal({
  dispatch,
  invoiceManagement,
  chooseLabel,
  getInvoiceList,
  setChooseLabel,
  containerId,
}) {
  const { transferId, sortId, moveTree } = invoiceManagement;
  const [expandedKeys, setExpandedKeys] = useState(['pjfl']);
  useEffect(() => {
    getMoveTree(0);
  }, []);
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
  const getMoveTree = (classifyId) => {
    dispatch({
      type: 'invoiceManagement/getInvoiceTree',
      payload: {
        classifyName: '',
        classifyId: classifyId,
      },
      callback: (data) => {
        data.data.jsonResult.forEach((item) => {
          item.key = item.classifyId;
          item.title = item.classifyName;
          if (item.isHaveChild == '1') {
            item.children = [{ key: '-1' }];
          }
        });
        dispatch({
          type: 'invoiceManagement/updateStates',
          payload: {
            moveTree: [...loopTree(moveTree, classifyId, data.data.jsonResult)],
          },
        });
      },
    });
  };
  const handelCanel = () => {
    dispatch({
      type: 'invoiceManagement/updateStates',
      payload: {
        isShowMove: false,
      },
    });
  };
  //保存
  const saveSort = () => {
    if (transferId[0] == 'pjfl') {
      message.error('不能移到该分类下');
    } else {
      dispatch({
        type: 'invoiceManagement/moveInvoice',
        payload: {
          invoiceIds: chooseLabel.join(','),
          classifyId: transferId[0],
        },
        callback: () => {
          getInvoiceList(sortId, '', 1, 100);
          window.location.href.includes('/budgetPage') && setChooseLabel([]);
        },
      });
      dispatch({
        type: 'invoiceManagement/updateStates',
        payload: {
          isShowMove: false,
          transferId: '',
        },
      });
    }
  };
  const filterKeys = (children, keys) => {
    //过滤子集的expandkey
    children?.forEach((item) => {
      keys = keys.filter((k) => {
        return k != item.classifyId;
      });
      if (item?.children?.length > 0) {
        keys = filterKeys(item?.children, keys);
      }
    });
    return keys;
  };
  //展开节点
  const onExpand = (expandedKeys, { expanded, node }) => {
    if (expanded && node.isHaveChild == 1) {
      getMoveTree(node.key);
    }
    if (!expanded) {
      expandedKeys = filterKeys(node?.children, expandedKeys);
    }
    setExpandedKeys(expandedKeys);
  };
  const onSelect = (selectedKeys, info, e) => {
    dispatch({
      type: 'invoiceManagement/updateStates',
      payload: {
        transferId: [info.node.key],
      },
    });
  };
  return (
    <Modal
      title={'移动分类'}
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
      onCancel={handelCanel}
      footer={[
        <Button key="cancel" onClick={handelCanel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            saveSort();
          }}
        >
          保存
        </Button>,
      ]}
    >
      <Tree
        showLine={false}
        showIcon={false}
        treeData={[...moveTree]}
        onSelect={onSelect}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        selectedKeys={transferId}
        autoExpandParent={true}
      ></Tree>
    </Modal>
  );
}
export default connect(({ invoiceManagement }) => ({ invoiceManagement }))(
  moveSortModal,
);
