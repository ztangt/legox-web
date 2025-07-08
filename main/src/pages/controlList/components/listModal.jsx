import { connect } from 'dva';
import React, { useState } from 'react';
import {Table, Modal, Row, Col,Checkbox, Input, Button, Space} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { arrayMove } from 'react-sortable-hoc';
// import styles from '../index.less';

function ListModal({dispatch, controlList}) {
  const {listModalVisible, listModalTable, listModalChecked, finalChecked} = controlList;
  const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
  const cl = [
    {
      title: '组件名称',
      dataIndex: 'componentName',
    },
    {
      title: '组件编码',
      dataIndex: 'componentCode',
    },
    {
      title: '组件类型',
      dataIndex: 'componentType',
    },
    {
      title: '组件描述',
      dataIndex: 'componentDesc',
      textWrap: 'word-break',
    },
  ];
  let list = [...cl];
  list.splice(2,1);
  const clDrag = [{
    title: '排序',
    dataIndex: 'sort',
    render: () => <DragHandle />,
    width: '60px',
  }, ...list];


  let dataGet = [...listModalTable];
  let dataCheckedGet = [...listModalChecked];


  const SortableItem = sortableElement(props => <tr {...props} />);
  const SortableContainer = sortableContainer(props => <tbody {...props} />);

  const onSortEnd = ({oldIndex, newIndex}) => {
    // console.log('gere  old and new is ', oldIndex, newIndex);
    if(oldIndex !== newIndex) {
      let newList = [...dataCheckedGet];
      newList = arrayMove(newList, oldIndex, newIndex);
      dispatch({
        type: 'controlList/updateStates',
        payload:{
          listModalChecked: [...newList],
        }
      });
    }

  };



  const DraggableContainer = props => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataCheckedGet.findIndex(item => item.componentId === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  const onFinish = () => {
    // console.log("final result is ", dataCheckedGet);
    dispatch({
      type: 'controlList/updateStates',
      payload:{
        listModalVisible: false,
        // finalChecked: [...dataCheckedGet],
        // listModalChecked: [...dataCheckedGet],
      }
    });
    let allCheckedIds = dataCheckedGet.map(item => item.componentId);
    dispatch({
      type: 'controlList/updateComponentsById',
      payload: {
                controlRefJson: allCheckedIds.toString(),

        // controlRefJson: JSON.stringify(allCheckedIds),
        // controlRefJson: allCheckedIds,
      }

    })

  };

  const onReset = () => {
    dispatch({
      type: 'controlList/updateStates',
      payload:{
        listModalVisible: false,
        listModalChecked: [...finalChecked],
      }
    });
  };

  const selectNow = (record, selected) => {
    // console.log("selected now is ", record, selected);
    if(selected) {
      dispatch({
        type: 'controlList/updateStates',
        payload:{
          listModalChecked: [...dataCheckedGet, record],
        }
      });
    } else {
      let componentId = record.componentId;
      dispatch({
        type: 'controlList/updateStates',
        payload:{
          listModalChecked: dataCheckedGet.filter(item => item.componentId !== componentId),
        }
      });

    }
  };

  const selectAll = (e) => {
    let selected = e.target.checked;
    if(selected) {
      dispatch({
        type: 'controlList/updateStates',
        payload:{
          listModalChecked: [...dataGet],
        }
      });
    } else {
      dispatch({
        type: 'controlList/updateStates',
        payload:{
          listModalChecked: [],
        }
      });
    }
  };

  const defaultCheckedKeys = [...finalChecked].map(item => item.componentId);
  // console.log(defaultCheckedKeys);


  return (
    listModalVisible && <Modal visible={listModalVisible} width="80%" centered  okText="保存" onOk={onFinish}  onCancel={onReset}>
      <Row>
        <Col span={12}>
        <Table
          columns={cl}
          dataSource={dataGet}
          pagination={{pageSize: 8}}
          scroll={{ y: 400 }}
          rowKey={record => record.componentId}
          rowSelection={{
            type: 'checkbox',
            columnWidth: '60px',
            onSelect:(record, selected) => selectNow(record, selected),
            // onSelectAll: (selected) => selectAll(selected),
            // defaultSelectedRowKeys: defaultCheckedKeys,
            hideSelectAll: true,
            columnTitle: (<Checkbox
              indeterminate={dataCheckedGet.length > 0 && dataCheckedGet.length < dataGet.length}
              checked={dataCheckedGet.length}
              onChange={selectAll}></Checkbox>),
            selectedRowKeys:dataCheckedGet.map(item => item.componentId),
          }}/>
        </Col>
        <Col span={11} offset={1}>
        <Table
          pagination={false}
          scroll={{ y: 400 }}
          columns={clDrag}
          dataSource={dataCheckedGet}
          rowKey={record => record.componentId}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
          />
        </Col>
      </Row>

    </Modal>
  );

}

export default connect(({controlList}) => ({controlList})) (ListModal);

