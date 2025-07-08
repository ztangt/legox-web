import { connect } from 'dva';
// import { history } from 'umi';
import { useState, useEffect } from 'react';
import { Modal, Button, Tree } from 'antd';
import useFinishTurnList from './useFinishTurnList';
import { flatMap } from 'lodash';

function Index({
  dispatch,
  bizSolId,
  listId,
  finishModalVisible,
  setFinishModalVisible,
  setParentState,
  stateObj
}) {
  const formModelingName = `formModeling${bizSolId}${listId}`

  const { year, finishTreeList, cutomHeaders } = stateObj;

  const { treeList, treeMap, getParentId } = useFinishTurnList({
    finishTreeList,
  });

  const [checkedKeys, setCheckedKeys] = useState([]);

  const fetchTreeList = () => {
    dispatch({
      type: 'dynamicPage/getbaseDataTree',
      payload: {
        usedYear: year,
        bizSolId: bizSolId,
        parentCode: '',
        start: 1,
        limit: 10000,
        searchWord: '',
      },
      callback: (finishTreeList)=>{
        setParentState({
          finishTreeList
        })
      }
    });
  };

  const onCancel = () => {
    setFinishModalVisible(false);
  };

  const onSelect = (selectedKeys, info) => {
    // const selectItem = finishTreeList.filter((item) => {
    //   return item.id === selectedKeys[0];
    // });
    // if (selectItem.length > 0 && selectItem[0].isParent === '1') {
    //   dispatch({
    //     type: 'dynamicPage/getbaseDataTree',
    //     payload: {
    //       usedYear: year,
    //       bizSolId: bizSolId,
    //       parentCode: selectItem[0].OBJ_CODE,
    //       start: 1,
    //       limit: 10000,
    //       searchWord: '',
    //     },
    //     callback: (list) => {
    //       let treeListChild = tranformTreeList(list);
    //       const newList = treeList.map((item) => {
    //         if (item.key === selectedKeys[0]) {
    //           item.children = treeListChild;
    //         }
    //         return item;
    //       });
    //       setTreeList(newList);
    //     },
    //   });
    // }
  };

  const onCheck = (checkedKeys, info) => {
    if (info.node.key === '1') {
      return setCheckedKeys(info.checked ? [...Object.keys(treeMap), '1'] : []);
    }
    return setCheckedKeys(checkedKeys);
  };

  const onOk = () => {
    const withParentId = getParentId(checkedKeys);
    const newIds = [...new Set(withParentId)].filter((i) => i != 1);

    Modal.confirm({
      title: '提示',
      content: '是否继续结转? (将覆盖原有数据)',
      okText: '确定',
      cancelText: '取消',
      mask: false,
      getContainer: () => {
        return document.getElementById(formModelingName) || false;
      },
      onOk: () => {
        dispatch({
          type: 'dynamicPage/projectFinishTurn',
          payload: {
            usedYear: year,
            bizSolId: bizSolId,
            cutomHeaders,
            ids: newIds.length > 0 ? newIds : null,
          },
          callback: () => {
            setCheckedKeys([]);
            fetchTreeList();
          },
        });
      },
    });
  };

  useEffect(() => {
    fetchTreeList();
  }, []);

  return (
    <Modal
      title={'结转'}
      visible={finishModalVisible}
      width={550}
      bodyStyle={{ height: '300px' }}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById(formModelingName) || false;
      }}
      footer={[
        <Button onClick={onCancel}>取消</Button>,
        <Button onClick={onOk}>确定</Button>,
      ]}
    >
      <Tree
        checkable
        defaultExpandAll
        defaultExpandParent
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={treeList}
      />
    </Modal>
  );
}

export default Index
