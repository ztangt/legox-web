import { Modal, Button, Select, Input, message, Table } from 'antd';
import styles from './modalTitle.less';
import { connect, history } from 'umi';
import { FIXEDMUNE } from '../../../service/constant';
import GlobalModal from '../../../componments/GlobalModal';
const { Option } = Select;
const dataSource = [
  {
    key: '0',
    keyName: '标题',
  },
];
function ModalTitle({ query, dispatch, applyModelConfig, loading, parentState, setParentState }) {
  const bizSolId = query.bizSolId;
  const {
    fromCols,
    titleList,
    selectTitleIndex,
    bizFromInfo,
    procDefId,
  } = parentState;
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
    setParentState({
      isShowTitleModal: false,
    })
  };
  //预览
  const lookFn = () => {
    let info = '';
    titleList.map(item => {
      switch (item.valueType) {
        case 'INPUT':
          info = info + '[' + item.value + ']';
          break;
        case 'FIXED':
          let arrName = FIXEDMUNE.filter(fixItem => fixItem.key == item.value);
          console.log('arrName=', arrName);
          if (arrName.length) {
            info = info + '[' + arrName[0].name + ']';
          }
          break;
        case 'COLUMN':
          let arFromrName = fromCols.filter(
            formItem => formItem.formColumnCode == item.value,
          );
          if (arFromrName.length) {
            info = info + '[' + arFromrName[0].formColumnName + ']';
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
    //得倒当前节点的index
    if (selectTitleIndex || selectTitleIndex == 0) {
      let currentIndex = _.findIndex(titleList, { id: selectTitleIndex });
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
      setParentState({
        titleList: titleList,
      })
    }
  };
  //删除
  const deleteFn = () => {
    if (selectTitleIndex || selectTitleIndex == 0) {
      let currentIndex = _.findIndex(titleList, { id: selectTitleIndex });
      //获取下下一个的id为选中状态，如果删除的是最后一个则上面的id为选中状态
      let newSelectId = 0;
      if (currentIndex < titleList.length - 1) {
        newSelectId = titleList[currentIndex + 1].id;
      } else if (currentIndex != 0) {
        newSelectId = titleList[currentIndex - 1].id;
      }
      titleList.splice(currentIndex, 1);
      setParentState({
        titleList: titleList,
        selectTitleIndex: newSelectId,
      })
    }
  };
  const renderData = () => {
    return (
      <ul className={styles.data_list}>
        {titleList.map((item, index) => {
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
                   showSearch
                    filterOption={(input, option) => {
                      const item = option.props;
                      const name = item.name || item.children;
                      return name && name.toString().toLowerCase().includes(input.toLowerCase());
                    }}
                    value={item.value}
                    style={{ width: '300px' }}
                    onChange={changeSelect.bind(this, index)}
                  >
                    {FIXEDMUNE.map(item => {
                      return (
                        <Option value={item.key} key={`${index}_${item.key}`}>
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
                    showSearch
                    filterOption={(input, option) => {
                      const item = option.props;
                      const name = item.formColumnName || item.children;
                      return name && name.toString().toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    {fromCols.map(item => {
                      return (
                        <Option
                          value={item.formColumnCode}
                          key={`${index}_${item.formColumnId}`}
                        >
                          {item.formColumnName}
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
    setParentState({
      selectTitleIndex: id,
    })
  };
  //更新input值
  const changeInput = (index, e) => {
    titleList[index].value = e.target.value;
    setParentState({
      titleList: titleList,
    })
  };
  //更新fixed
  const changeSelect = (index, value) => {
    titleList[index].value = value;
    setParentState({
      titleList: titleList,
    })
  };
  const rowSelection = {
    selectedRowKeys: '0',
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
  };
  // 添加输入框
  const addRow = valueType => {
    let maxIdOne = _.orderBy(titleList, ['id'], ['desc'])[0];
    let addRow = {
      valueType: valueType,
      value: '',
      id: titleList.length ? maxIdOne.id + 1 : 0,
    };
    if (selectTitleIndex || selectTitleIndex == 0) {
      let currentIndex = _.findIndex(titleList, { id: selectTitleIndex });
      titleList.splice(currentIndex + 1, 0, addRow);
    } else {
      titleList.splice(0, 0, addRow);
    }
    setParentState({
      selectTitleIndex: addRow.id,
      titleList,
    })
  };
  //保存
  const saveTitle = () => {
    let newTitleList = [];
    titleList.map((item, index) => {
      if (item.value.length) {
        newTitleList.push(item);
      }
    });
    dispatch({
      type: 'applyModelConfig/saveTitle',
      payload: {
        bizSolId,
        procDefId,
        formDeployId: bizFromInfo.formDeployId,
        title: JSON.stringify(newTitleList),
      },
      extraParams: {
        setState: setParentState,
        state: parentState
      }
    });
  };
  return (
    <GlobalModal
      visible={true}
      title="标题"
      widthType={1}
      maskClosable={false}
      mask={false}
      centered
      onCancel={handelCancel}
      getContainer={() => {
        return document.getElementById(`form_modal_${bizSolId}`) || false;
      }}
      footer={[
        <Button key="cancel" onClick={handelCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={saveTitle}
          loading={loading.global}
        >
          保存
        </Button>,
      ]}
      className={styles.title_warp}
    >
      <div className={styles.title}>
        <span onClick={addRow.bind(this, 'INPUT')}>添加输入框</span>
        <span onClick={addRow.bind(this, 'FIXED')}>添加固定码</span>
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
        scroll={{ y: '100%' }}
        pagination={false}
      />
    </GlobalModal>
  );
}
export default connect(({ loading, applyModelConfig }) => {
  return { loading, applyModelConfig };
})(ModalTitle);
