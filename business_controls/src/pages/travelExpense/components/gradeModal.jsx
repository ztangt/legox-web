import { Button, Input, Modal, Select, Table, message } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import RelevanceModal from '../../../components/relevanceModal/relevanceModal';
import { BASE_WIDTH, ORDER_WIDTH } from '../../../util/constant';
import styles from './gradeModal.less';
function gradeModal({ dispatch, travelExpense }) {
  const { confirm } = Modal;
  const {
    gradeList,
    gradeRowKeys,
    selectedDatas,
    personList,
    gradeTableData,
    isModalVisibles,
    grade_selectedRowKeys,
    selectedDataIds,
  } = travelExpense;
  const [selectedRows, setSelectedRows] = useState([]);
  const { Option } = Select;
  const gradeKey = JSON.parse(window.localStorage.getItem('gradeKey'));
  useEffect(() => {
    gradeList.forEach((item) => {
      if (item.postInfos) {
        item.postJsons = getPostName(JSON.parse(item.postInfos));
        item.postJson = JSON.parse(item.postInfos);
      }
      if (item.postJson) {
        item.postJsons = getPostName(item.postJson);
      }
    });
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        gradeList,
      },
    });
  }, [gradeList]);
  useEffect(() => {
    if (gradeKey?.key && selectedDatas.length > 0) {
      selectedDatas.forEach((item, index) => {
        (item['postName'] = item.nodeName), (item['postId'] = item.nodeId);
      });
      gradeList.forEach((item, index) => {
        if (item.key == gradeKey.key) {
          item.postJson = selectedDatas;
          item.postJsons = getPostName(selectedDatas);
        }
      });
    }
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        gradeList,
      },
    });
  }, [selectedDatas]);

  const rowSelection = {
    selectedRowKeys: grade_selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys, 'selectedRowKeys');
      setSelectedRows(selectedRows);
      dispatch({
        type: 'travelExpense/updateStates',
        payload: {
          grade_selectedRowKeys: selectedRowKeys,
        },
      });
    },
  };
  const getPostName = (selectedDatas) => {
    let name = '';
    let Flag = false;
    if (selectedDatas.length > 0) {
      //选择数据
      selectedDatas?.forEach((item, index) => {
        if ((index = 0)) {
          if (item.deptName) {
            name = item.deptName + '-' + item.postName;
          } else {
            name = item.postName;
          }
        } else {
          Flag = true;
          if (item.deptName) {
            name += item.deptName + '-' + item.postName + ',';
          } else {
            name += item.postName + ',';
          }
        }
      });
    }
    if (Flag) {
      var reg = /,$/gi;
      name = name.replace(reg, '');
    }
    return name;
  };
  useEffect(() => {
    getGradeList();
  }, []);
  const getGradeList = () => {
    dispatch({
      type: 'travelExpense/getGradeList',
    });
  };
  const handelCanel = () => {
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        isShowGrade: false,
      },
    });
  };
  const addGrade = () => {
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        isShowGrade: false,
      },
    });
    dispatch({
      type: 'travelExpense/addTravelexpenseGrade',
      payload: {
        gradeJson: JSON.stringify(gradeList),
      },
    });
  };
  const updateTableData = (key, name, value) => {
    if (name == 'gradeName') {
      const res = personList.filter((item) => item.dictInfoName == value);
      gradeList.forEach((item, index) => {
        if (item.key == key) {
          item.gradeCode = res[0].dictInfoCode;
          item.gradeName = res[0].dictInfoName;
        }
      });
    }
    if (name == 'postJsons') {
      window.localStorage.setItem('gradeKey', JSON.stringify({ key, name }));
      const newArr = [];
      gradeList.forEach((item, index) => {
        if (item.key == key) {
          item.postJson.forEach((val, ind) => {
            newArr.push(val.postId);
          });
        }
      });
      dispatch({
        type: 'travelExpense/updateStates',
        payload: {
          isModalVisibles: true,
          selectedDataIds: newArr,
        },
      });
    }
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        gradeList,
      },
    });
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'number',
      render: (text, obj, index) => <div>{index + 1}</div>,
      width: ORDER_WIDTH,
    },
    {
      title: '人员级别',
      dataIndex: 'gradeName',
      width: 200,
      render: (text, record, index) => (
        <Select
          defaultValue={text}
          onSelect={updateTableData.bind(this, record.key, 'gradeName')}
          style={{ width: 200, marginRight: 16 }}
        >
          {personList?.map((item) => {
            return (
              <Option
                key={item.id}
                code={item.dictInfoCode}
                value={item.dictInfoName}
              >
                {item.dictInfoName}
              </Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '岗位',
      dataIndex: 'postJsons',
      width: BASE_WIDTH * 2.5,
      render: (text, record, index) => (
        <Input
          style={{ width: 200 }}
          value={text}
          onClick={updateTableData.bind(this, record.key, 'postJsons')}
        />
      ),
    },
  ];
  const addRow = () => {
    const count =
      gradeList.length != 0
        ? Number(gradeList[gradeList.length - 1].key) + 1
        : gradeList.length + 1;
    const newData = {
      key: count,
      gradeName: '',
      gradeCode: '',
      postJsons: '',
      postJson: [],
    };
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        gradeList: [...gradeList, newData],
      },
    });
  };
  const deleteGrade = (selectedRows) => {
    console.log(selectedRows, 'selectedRows');
    const idArr = [];
    selectedRows.forEach((item, index) => {
      if (item.postInfos) {
        const postInfos = JSON.parse(item.postInfos);
        postInfos.forEach((item) => {
          idArr.push(item.gradeId);
        });
      }
    });
    if (selectedRows.length > 0 && idArr.length > 0) {
      confirm({
        content: '确认要删除吗？',
        mask: false,
        getContainer: () => {
          return document.getElementById('travelExpense_container');
        },
        onOk: () => {
          dispatch({
            type: 'travelExpense/deleteTravelexpenseGrade',
            payload: {
              gradeIds: idArr.join(','),
            },
          });
        },
      });
    } else if (selectedRows.length <= 0) {
      message.warning('请选择一条数据');
    }
    gradeList.forEach((item, index) => {
      selectedRows.forEach((val, ind) => {
        if (item.key == val.key) {
          gradeList.splice(index, 1);
        }
      });
    });
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        gradeList,
        grade_selectedRowKeys: '',
      },
    });
  };
  const handleOks = () => {
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        isModalVisibles: false,
        selectedDataIds: [],
      },
    });
  };
  const handleCancels = () => {
    dispatch({
      type: 'travelExpense/updateStates',
      payload: {
        isModalVisibles: false,
        selectedDataIds: [],
      },
    });
  };
  return (
    <>
      <Modal
        title="级别维护"
        visible={true}
        onCancel={handelCanel}
        maskClosable={false}
        mask={false}
        centered
        width={600}
        bodyStyle={{ height: 400 }}
        getContainer={() => {
          return document.getElementById('travelExpense_container');
        }}
        onOk={addGrade}
        className={styles.gradeModal}
      >
        <div className={styles.operationButton}>
          <Button
            onClick={() => {
              addRow();
            }}
          >
            新增
          </Button>
          <Button
            onClick={() => {
              deleteGrade(selectedRows);
            }}
          >
            删除
          </Button>
        </div>
        <Table
          rowKey={'key'}
          columns={columns}
          dataSource={[...gradeList]}
          pagination={false}
          rowSelection={rowSelection}
        />
      </Modal>
      {isModalVisibles && (
        <Modal
          title="关联用户"
          visible={true}
          onOk={handleOks}
          onCancel={handleCancels}
          width={800}
          maskClosable={false}
          bodyStyle={{ height: 'calc(100vh - 300px)', overflow: 'visible' }}
          forceRender
          mask={false}
          getContainer={() => {
            return document.getElementById('travelExpense_container');
          }}
        >
          <RelevanceModal
            nameSpace="travelExpense"
            spaceInfo={travelExpense}
            orgUserType="POST"
            selectButtonType="checkBox"
            treeType={'DEPT'}
            type={'INCLUDESUB'}
            nodeIds={''}
          />
        </Modal>
      )}
    </>
  );
}
export default connect(({ travelExpense }) => ({ travelExpense }))(gradeModal);
