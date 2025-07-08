import { Modal, Button, Table, Select, Input, message } from 'antd';
import styles from './titleModal.less';
import { useDispatch } from 'umi';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { FIXEDMUNE } from '../../service/constant';
const { Option } = Select;
const dataSource = [
  {
    key: '0',
    keyName: '树形标题',
  },
];
function TitleModal({
  onHanleInfo,
  namespace,
  stateInfo,
  containerId,
  dataName,
}) {
  const dispatch = useDispatch();
  const { treeCols, titleList, selectTitleIndex, listMoudleInfo } = stateInfo;
  useEffect(() => {
    localStorage.setItem(
      'titleList',
      JSON.stringify(stateInfo[dataName]['titleList']),
    );
  }, []);

  useEffect(() => {
    const titleList = stateInfo.listMoudleInfo.titleList || [];
    // 加一个唯一的属性作为上移下移等操作
    titleList.map((item, index) => {
      item.id = index;
    });
    stateInfo[dataName]['titleList'] = titleList;
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        ...stateInfo[dataName],
        selectTitleIndex: 0,
      },
    });
  }, []);

  const columns = [
    {
      title: '标题',
      dataIndex: 'keyName',
      key: 'keyName',
      width: 100,
    },
    {
      title: '数据',
      dataIndex: 'keyName',
      key: 'keyName',
      render: (text, row, index) => {
        return renderData();
      },
    },
    {
      title: '操作',
      dataIndex: 'keyName',
      key: 'keyName',
      width: 120,
      render: () => (
        <div className={styles.opration}>
          <p onClick={moveFn.bind(this, 'up')}>上移</p>
          <p onClick={moveFn.bind(this, 'down')}>下移</p>
          <p onClick={deleteFn.bind(this)}>删除</p>
          <p onClick={lookFn}>预览</p>
        </div>
      ),
    },
  ];
  //关闭
  const handelCancel = () => {
    if (localStorage.getItem('titleList') != 'undefined') {
      stateInfo[dataName]['titleList'] = JSON.parse(
        localStorage.getItem('titleList'),
      );
    }
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        configModal: false,
      },
    });
  };
  //预览
  const lookFn = () => {
    let info = '';
    listMoudleInfo.titleList.map(item => {
      switch (item.valueType) {
        case 'INPUT':
          info = info + item.value;
          break;
        case 'FIXED':
          let arrName = FIXEDMUNE.filter(fixItem => fixItem.key == item.value);
          if (arrName.length) {
            info = info + arrName[0].name;
          }
          break;
        case 'COLUMN':
          let arFromrName = treeCols.filter(
            formItem => formItem.colCode == item.value,
          );
          if (arFromrName.length) {
            info = info + arFromrName[0].colName;
          }
          break;
        default:
          break;
      }
    });
    message.info(info);
  };
  //上移下移
  const moveFn = type => {
    const titleList = listMoudleInfo.titleList;
    //得倒当前节点的index
    if (selectTitleIndex || selectTitleIndex == 0) {
      let currentIndex = _.findIndex(titleList, {
        id: selectTitleIndex,
      });
      if (type == 'up' && currentIndex != 0) {
        //上移
        let preOne = titleList[currentIndex - 1];
        let currentOne = titleList[currentIndex];
        titleList[currentIndex - 1] = currentOne;
        titleList[currentIndex] = preOne;
      } else if (type == 'down' && currentIndex != titleList.length - 1) {
        //下移
        let nextOne = titleList[currentIndex + 1];
        let currentOne = titleList[currentIndex];
        titleList[currentIndex + 1] = currentOne;
        titleList[currentIndex] = nextOne;
      }

      stateInfo[dataName]['titleList'] = titleList;
      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          ...stateInfo[dataName],
        },
      });
    }
  };
  //删除
  const deleteFn = () => {
    const titleList = listMoudleInfo.titleList;
    if (selectTitleIndex || selectTitleIndex == 0) {
      let currentIndex = _.findIndex(titleList, {
        id: selectTitleIndex,
      });
      //获取下下一个的id为选中状态，如果删除的是最后一个则上面的id为选中状态
      let newSelectId = 0;
      if (currentIndex < titleList.length - 1) {
        newSelectId = titleList[currentIndex + 1].id;
      } else if (currentIndex != 0) {
        newSelectId = titleList[currentIndex - 1].id;
      }
      titleList.splice(currentIndex, 1);
      stateInfo[dataName]['titleList'] = titleList;
      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          ...stateInfo[dataName],
          selectTitleIndex: newSelectId,
        },
      });
    }
  };
  const renderData = () => {
    return (
      <ul className={styles.data_list}>
        {listMoudleInfo.titleList &&
          listMoudleInfo.titleList.map((item, index) => {
            switch (item.valueType) {
              case 'INPUT':
                return (
                  <li
                    className={
                      selectTitleIndex == item.id ? styles.select_one : ''
                    }
                    onClick={selectIndexFn.bind(this, item.id)}
                    key={index}
                  >
                    <Input
                      value={item.value}
                      id={`list_${index}`}
                      style={{ width: '300px' }}
                      onChange={changeInput.bind(this, index)}
                      maxLength={50}
                    />
                  </li>
                );
              case 'FIXED':
                return (
                  <li
                    className={
                      selectTitleIndex == item.id ? styles.select_one : ''
                    }
                    onClick={selectIndexFn.bind(this, item.id)}
                    key={index}
                  >
                    <Select
                      value={item.value}
                      style={{ width: '300px' }}
                      onChange={changeSelect.bind(this, index)}
                    >
                      {FIXEDMUNE.map(item => {
                        return (
                          <Option value={item.key} key={item.key}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </li>
                );
              case 'COLUMN':
                return (
                  <li
                    className={
                      selectTitleIndex == item.id ? styles.select_one : ''
                    }
                    onClick={selectIndexFn.bind(this, item.id)}
                    key={index}
                  >
                    <Select
                      value={item.value}
                      style={{ width: '300px' }}
                      onChange={changeSelect.bind(this, index)}
                    >
                      {treeCols.map(item => {
                        return (
                          <Option value={item.colCode} key={item.colCode}>
                            {item.colName}
                          </Option>
                        );
                      })}
                    </Select>
                  </li>
                );
              default:
                break;
            }
          })}
      </ul>
    );
  };
  const selectIndexFn = id => {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        selectTitleIndex: id,
      },
    });
  };
  //更新input值
  const changeInput = (index, e) => {
    const titleList = listMoudleInfo.titleList;
    titleList[index].value = e.target.value;
    stateInfo[dataName]['titleList'] = titleList;

    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        ...stateInfo[dataName],
      },
    });
  };
  //更新fixed
  const changeSelect = (index, value) => {
    const titleList = listMoudleInfo.titleList;
    titleList[index].value = value;
    stateInfo[dataName]['titleList'] = titleList;
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        ...stateInfo[dataName],
      },
    });
  };
  const rowSelection = {
    selectedRowKeys: '0',
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };
  // 添加输入框
  const addRow = valueType => {
    const titleList = listMoudleInfo.titleList;
    let maxIdOne = _.orderBy(titleList, ['id'], ['desc'])[0];
    let addRow = {
      valueType: valueType,
      value: '',
      id: titleList.length ? maxIdOne.id + 1 : 0,
    };
    if (selectTitleIndex || selectTitleIndex == 0) {
      let currentIndex = _.findIndex(titleList, {
        id: selectTitleIndex,
      });
      titleList.splice(currentIndex + 1, 0, addRow);
    } else {
      titleList.splice(0, 0, addRow);
    }
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        selectTitleIndex: addRow.id,
      },
    });
    stateInfo[dataName]['titleList'] = titleList;
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        ...stateInfo[dataName],
      },
    });
  };
  //保存
  const saveTitle = () => {
    const titleList = listMoudleInfo.titleList;

    let newTitleList = [];
    titleList.map((item, index) => {
      if (item.value.length) {
        newTitleList.push(item);
      }
    });
    stateInfo[dataName]['titleJson'] = JSON.stringify(newTitleList);
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        ...stateInfo[dataName],
        configModal: false,
      },
    });
    let info = '';
    titleList.map(item => {
      switch (item.valueType) {
        case 'INPUT':
          info = info + item.value;
          break;
        case 'FIXED':
          let arrName = FIXEDMUNE.filter(fixItem => fixItem.key == item.value);
          if (arrName.length) {
            info = info + arrName[0].name;
          }
          break;
        case 'COLUMN':
          let arFromrName = treeCols.filter(
            formItem => formItem.colCode == item.value,
          );
          if (arFromrName.length) {
            info = info + arFromrName[0].colName;
          }
          break;
        default:
          break;
      }
    });
    onHanleInfo(info);
  };
  return (
    <Modal
      visible={true}
      title="业务字段信息绑定"
      width={600}
      maskClosable={false}
      mask={false}
      centered
      onCancel={handelCancel}
      bodyStyle={{height:'350px' }}
      getContainer={() => {
        return document.getElementById(containerId) || false;
      }}
      footer={[
        <Button key="cancel" onClick={handelCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={saveTitle}>
          保存
        </Button>,
      ]}
      className={styles.title_warp}
    >
      <div>
        <div className={styles.title}>
          <span onClick={addRow.bind(this, 'INPUT')}>添加输入框</span>
          {/* <span onClick={addRow.bind(this,'FIXED')}>添加固定码</span> */}
          <span onClick={addRow.bind(this, 'COLUMN')}>添加表字段</span>
        </div>
        <Table
          className={styles.table}
          dataSource={dataSource}
          columns={columns}
          showHeader={false}
          bordered={true}
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          scroll={{
            y: 300
          }}
          pagination={false}
        />
      </div>
    </Modal>
  );
}
export default TitleModal;
