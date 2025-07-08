import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import {Table, Button, Space, message, Checkbox, Popconfirm} from 'antd'
import FM from './formModal'
import LM from './listModal'


function ControlList({ dispatch, controlList}) {
  const {formModalVisible, formInitial, checkedControls, controlTable} = controlList;

  let checkedControlsGet = [...checkedControls];
  // console.log("get all checked is ", checkedControlsGet);
  let dataGet = [...controlTable];

  useEffect(() => {
    dispatch({
      type: 'controlList/getControlList',
    });
  }, []);

  const editNow = (controlId) => {
    let index = dataGet.findIndex((item) => (item.controlId === controlId));
    // console.log("data is", dataGet[index]);
    let datanow = dataGet[index];
    dispatch({
      type: 'controlList/updateStates',
      payload:{
        formModalVisible: true,
        formInitial: {controlName: datanow.controlName, controlCode: datanow.controlCode, controlType: datanow.controlType },
        changeIndex: index,
        formType: 1,
      }
    });

  };

  const addNew = () => {
    dispatch({
      type: 'controlList/updateStates',
      payload:{
        formModalVisible: true,
        formInitial: {controlName: '', controlCode: '', controlType: 'BasicControl' },
        formType: 0,
      }
    });

  };

  const deleteNow = (controlId) => {
    dispatch({
      type: 'controlList/deleteControl',
      payload: {
        controlId: controlId,
      },
    });

  };

  const designNow = (controlId) => {
    dispatch({
      type: 'controlList/getComponentsList',
      payload: {

      }
    });
    dispatch({
      type: 'controlList/getComponentsById',
      payload: {
        controlId: controlId,
      }
    });

    dispatch({
      type: 'controlList/updateStates',
      payload:{
        listModalVisible: true,
        listIdNow: controlId,
      }
    });


  };

  const typeToShow = (value) => {
    switch (value) {
      case "BasicControl":
        return "基本控件";
      case "LayoutControl":
        return "页面布局";
      case "OrganicControl":
        return "组织机构控件";
      case "OptionControl":
        return "意见控件";
      default:
        return "基本控件";
    }

  };


  const tableProps = {
    columns : [
      {
        title: '控件名称',
        dataIndex: 'controlName',
      },
      {
        title: '控件编码',
        dataIndex: 'controlCode',
      },
      {
        title: '控件类型',
        dataIndex: 'controlType',
        render: (record) => (<div>{typeToShow(record)}</div>),
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => (
          <Space size="middle">
            <Button onClick={editNow.bind(this, record.controlId)}>修改</Button>
            <Popconfirm
            title="确定删除当前项吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={deleteNow.bind(this, record.controlId)}
            >
              <Button>删除</Button>
            </Popconfirm>

            <Button onClick={designNow.bind(this, record.controlId)}>设计</Button>
          </Space>
        ),

      }
    ],
    dataSource: dataGet,
  };

  const selectNow = (record, selected) => {
    if(selected) {
      dispatch({
        type: 'controlList/updateStates',
        payload:{
          checkedControls: [...checkedControlsGet, record.controlId],
        }
      });

    } else {
      let id = record.controlId;
      dispatch({
        type: 'controlList/updateStates',
        payload:{
          checkedControls: checkedControlsGet.filter(item => item !== id),
        }
      });

    }
  };


  const selectAll = (e) => {
    let selected = e.target.checked;
    // console.log("all or none", selected);
    let allIds = dataGet.map(item => item.controlId);
    if(selected) {
      dispatch({
        type: 'controlList/updateStates',
        payload:{
          checkedControls: [...allIds],
        }
      });

    } else {
      dispatch({
        type: 'controlList/updateStates',
        payload:{
          checkedControls: [],
        }
      });

    }
  };

  const deleteChecked = () => {
    if(checkedControlsGet.length === 0) {
      message.error('选择项为空!');
    } else {
      dispatch({
        type: 'controlList/updateStates',
        payload: {
          checkedControls: [],
        }
      });
      dispatch({
        type: 'controlList/deleteControls',
        payload: {
          controlIds: checkedControlsGet,
        }
      });

    }



  };




  return (
    <div>
      <Button type="primary" onClick={() => addNew()}>添加新控件</Button>
      {
        <FM />
      }
      {
        <LM />
      }
      <Table {...tableProps}
        rowKey={record => record.controlId}
        // pagination={{pageSize: 2}}
        // pagination={false}
        // scroll={{ y: 800 }}
        rowSelection={{
          type: 'checkbox',
          columnWidth: '60px',
          onSelect:(record, selected) => selectNow(record, selected),
          hideSelectAll: true,
          columnTitle: (<Checkbox
            indeterminate={checkedControlsGet.length > 0 && checkedControlsGet.length < dataGet.length}
            checked={checkedControlsGet.length}
            onChange={selectAll}></Checkbox>),
          selectedRowKeys:checkedControlsGet,

        }}/>

      <Popconfirm
      title="确定删除选中项吗？"
      okText="确定"
      cancelText="取消"
      onConfirm={() => deleteChecked()}
      >
        <Button type="primary">删除选中</Button>
      </Popconfirm>
    </div>
  );


}

export default connect(({controlList}) => ({controlList})) (ControlList);




