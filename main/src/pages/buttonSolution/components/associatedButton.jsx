import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Input,
  Form,
  Select,
  Table,
  Button,
  message,
  InputNumber,
  Tree,
} from 'antd';
import _ from 'lodash';
import styles from '../index.less';
import { BUTTONCODES, OPERATIONTYPE } from '../../../service/constant';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import GlobalModal from '../../../componments/GlobalModal';
import ColumnDragTable from '../../../componments/columnDragTable';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import searchIcon from '../../../../public/assets/search_black.svg'
const { Option } = Select;
const { TreeNode } = Tree;
const SOURCE = {
  PREFABRICATE: '系统预制',
  CUSTOM: '业务按钮',
};

function addForm({
  dispatch,
  addObj,
  onCancel,
  buttonList,
  selectedRowKeys,
  preSelectedRowKeys,
  isShowDefault,
  newSelectButtonList,
  allButtonList,
  searchButtonValue,
  checkedButtonKeys,
}) {
  console.log('---=====');
  console.log('buttonList', buttonList);
  console.log('buttonList', allButtonList);
  const [form] = Form.useForm();
  const [selectButtonList, setSelectButtonList] = useState(newSelectButtonList);

  // const [preButtonList, setPreButtonList] = useState([]);

  // const [selectID, setSelectID] = useState(null);
  const [step, setStep] = useState(1);
  const [loading,setLoading]=useState(false)
  // const [checkedButtonKeys,setCheckedKeys]=useState([])
  useEffect(()=>{
    setSelectButtonList(newSelectButtonList)
  },[newSelectButtonList])
  // 快速排序
  const quickSort = arr => {
    if (arr.length < 2) {
      return arr;
    } else {
      const pivot = arr[0].sort;
      const pivotArr = [];
      const lowArr = [];
      const hightArr = [];

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].sort === pivot) {
          pivotArr.push(arr[i]);
        } else if (arr[i].sort > pivot) {
          hightArr.push(arr[i]);
        } else {
          lowArr.push(arr[i]);
        }
      }

      return quickSort(lowArr).concat(pivotArr, quickSort(hightArr));
    }
  };

  // 列表排序
  const onInputNumberChange = (val, rec, id) => {
    let newList = selectButtonList.reduce((pre, cur) => {
      if (cur.buttonId === rec.buttonId) {
        pre.push({
          ...rec,
          sort: val,
        });
      } else {
        pre.push(cur);
      }
      return pre;
    }, []);

    // let arr = quickSort(newList);
    // setSelectID(id);
    setSelectButtonList(newList);
  };
  //删除行按钮
  const deleteButtonItem = text => {
    const newKeys = checkedButtonKeys.filter(item => item !== text);
    const newList = selectButtonList.filter(item => item.buttonId !== text);
    dispatch({
      type: 'buttonSolution/updateStates',
      payload: {
        checkedButtonKeys: newKeys,
      },
    });
    setSelectButtonList(newList);
  };

  // useEffect(() => {
  //   if (selectID) {
  //     // document.getElementById(selectID).focus();
  //   }
  // });
  useEffect(() => {
    if (!searchButtonValue) {
      dispatch({
        type: 'buttonSolution/updateStates',
        payload: {
          checkedButtonKeys: preSelectedRowKeys,
        },
      });
      setSelectButtonList(newSelectButtonList);
    }
  }, [preSelectedRowKeys]);
  // useEffect(() => {
  //   if (buttonList.length > 0) {
  //     setPreButtonList(buttonList);
  //   }
  // }, [buttonList]);
  const listColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: ORDER_WIDTH,
      render: (text, obj, index) => <div>{index + 1}</div>,
    },
    {
      title: '按钮展示名称',
      dataIndex: 'buttonName',
      width: BASE_WIDTH,
      ellipsis:true
    },
    {
      title: '按钮描述',
      dataIndex: 'buttonDesc',
      width: BASE_WIDTH*1.5,
      ellipsis:true
    },
    // {
    //   title: '按钮编码',
    //   dataIndex: 'buttonCode',
    // },
    {
      title: '按钮来源',
      dataIndex: 'buttonSourceName',
      render: text => <span>{SOURCE[text]}</span>,
      width: 100,
    },
    {
      title: '按钮类型',
      dataIndex: 'buttonTypeName',
      width: 80,
      render: text => (
        <span>
          {text == 'FORM' ? '表单' : text == 'TABLE' ? '列表' : '页面'}
        </span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'buttonId',
      width: ORDER_WIDTH,
      render: text => (
        <a
          onClick={() => {
            deleteButtonItem(text);
          }}
        >
          删除
        </a>
      ),
    },
  ];
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: ORDER_WIDTH,
      render: (text, obj, index) => <div>{index + 1}</div>,
    },
    {
      title: '按钮展示名称',
      dataIndex: 'buttonName',
      width: BASE_WIDTH,
      ellipsis:true
    },
    {
      title: '按钮描述',
      dataIndex: 'buttonDesc',
      width: BASE_WIDTH,
      ellipsis:true
    },
    // {
    //   title: '绑定按钮',
    //   dataIndex: 'buttonCode',
    //   render: text => {
    //     if (text) {
    //       let buttonCode = BUTTONCODES.filter(info => info.key == text);
    //       if (buttonCode.length) {
    //         return buttonCode[0].name;
    //       } else {
    //         return '';
    //       }
    //     } else {
    //       return '';
    //     }
    //   },
    // },
    {
      title: '按钮来源',
      dataIndex: 'buttonSourceName',
      render: text => <span>{SOURCE[text]}</span>,
      width: BASE_WIDTH,
    },
    {
      title: '按钮动作类型',
      dataIndex: 'operationType',
      editable: true,
      width: BASE_WIDTH,
    },
    {
      title: '操作位置',
      dataIndex: 'showRow',
      editable: true,
      width: BASE_WIDTH,
    },
    {
      title: '展示方式',
      dataIndex: 'showType',
      editable: true,
      width: BASE_WIDTH,
    },
    {
      title: '组名',
      dataIndex: 'groupName',
      editable: true,
      width: BASE_WIDTH,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      editable: true,
       width: BASE_WIDTH,
    },
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editable: col.editable,
      }),
    };
  });
  //将组名置空
  const updateGrouNameFn = buttonId => {
    form.setFields([
      {
        name: `groupName_${buttonId}`,
        value: '',
        errors: '',
      },
    ]);
  };
  const EditableCell = ({
    editable,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode = <Input />;
    if (dataIndex == 'showType') {
      inputNode = (
        <Select onChange={() => updateGrouNameFn(record.buttonId)} style={{width:'120px'}}>
          <Option value={1}>平铺</Option>
          <Option value={2}>下拉</Option>
        </Select>
      );
    } else if (dataIndex == 'operationType') {
      inputNode = (
        <Select disabled={addObj.groupType == 'TABLE' ? true : false} style={{width:'120px'}}>
          {OPERATIONTYPE.map(item => {
            return <Option value={item.key}>{item.name}</Option>;
          })}
        </Select>
      );
    } else if (dataIndex === 'sort') {
      inputNode = (
        <InputNumber
          min={1}
          max={999999999}
          formatter={value => {
            const reg = /^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/;

            if (typeof value === 'string') {
              return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
            } else if (typeof value === 'number') {
              return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
            } else {
              return '';
            }
          }}
          id={`${dataIndex}-${record.buttonId}`}
          style={{ width: '120px' }}
          onChange={val => {
            let reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
            if (!reg.test(val)) {
              message.error('最大支持9位整数，6位小数');
              return;
            }
          }}
          onBlur={val => {
            // let nStrList = val.target.value?.toString().split('.');
            // let result = nStrList?.length > 1 ? nStrList[1].length : 0;
            // result <= 6
            //   ?
            onInputNumberChange(
              val.target.value,
              record,
              `${dataIndex}-${record.buttonId}`,
            );
            // : message.error('最大支持9位整数，6位小数');
          }}
        />
      );
    } else if (dataIndex === 'showRow') {
      inputNode = (
        <Select disabled={addObj.groupType == 'FORM' ? true : false} style={{width:'120px'}}>
          <Option value={0}>行展示</Option>
          <Option value={1}>列展示</Option>
          <Option value={2}>同时展示</Option>
        </Select>
      );
    }

    return (
      <td {...restProps}>
        {editable && dataIndex == 'groupName' ? (
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues[`showType_${record.buttonId}`] !==
              currentValues[`showType_${record.buttonId}`]
            }
          >
            {({ getFieldValue }) =>
              getFieldValue(`showType_${record.buttonId}`) === 2 ? (
                <Form.Item
                  name={`${dataIndex}_${record.buttonId}`}
                  style={{
                    margin: 0,
                  }}
                  className={styles.gorup_name}
                  initialValue={record[dataIndex]}
                  rules={[
                    {
                      required: true,
                      message: '请输入组名',
                    },
                    {
                      max: 10,
                      message: '长度最大为10',
                    },
                  ]}
                >
                  <Input style={{width:'120px'}}/>
                </Form.Item>
              ) : (
                <Form.Item
                  name={`${dataIndex}_${record.buttonId}`}
                  style={{
                    margin: 0,
                  }}
                  className={styles.gorup_name_disabled}
                  messageVariables={{ message: '' }}
                  initialValue={record[dataIndex]}
                >
                  <Input disabled style={{width:'120px'}}/>
                </Form.Item>
              )
            }
          </Form.Item>
        ) : editable ? (
          <Form.Item
            name={`${dataIndex}_${record.buttonId}`}
            style={{
              margin: 0,
            }}
            initialValue={
              dataIndex == 'operationType' && addObj.groupType == 'TABLE'
                ? 'VIEW'
                : dataIndex == 'showType'
                ? record[dataIndex] || 1
                : dataIndex == 'showRow' && !record[dataIndex]
                ? 0
                : record[dataIndex]
            }
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  // const rowSelection = {
  //   selectedRowKeys: selectedRowKeys,
  //   onSelect: (record, selected) => {
  //     let newSelectKeys = JSON.parse(JSON.stringify(preSelectedRowKeys));
  //     if (selected) {
  //       newSelectKeys.push(record.buttonId);
  //     } else {
  //       newSelectKeys = preSelectedRowKeys.filter(i => i != record.buttonId);
  //     }

  //     dispatch({
  //       type: 'buttonSolution/updateStates',
  //       payload: {
  //         preSelectedRowKeys: newSelectKeys,
  //       },
  //     });
  //   },
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     dispatch({
  //       type: 'buttonSolution/setSelectedRowKeys',
  //       payload: {
  //         selectedRowKeys,
  //       },
  //     });
  //   },
  // };
  const submitForm = async(values) => {
    if (loading) return; 
    setLoading(true); 
    let buttonJson = [];
    selectButtonList.forEach(item => {
      //查询values里面包含的值
      buttonJson.push({
        buttonId: item.buttonId,
        showType: values[`showType_${item.buttonId}`],
        groupName: values[`groupName_${item.buttonId}`],
        operationType: values[`operationType_${item.buttonId}`],
        sort: values[`sort_${item.buttonId}`],
        showRow: values[`showRow_${item.buttonId}`],
      });
    });
    await dispatch({
      type: 'buttonSolution/addButtonIds',
      payload: {
        buttonGroupId: addObj.groupId,
        buttonJson: JSON.stringify(buttonJson),
      },
      callback: () => {
        setLoading(false)
        onCancel();
      },
    });
  };
  //切换step
  const clickStep = step => {
    if (checkedButtonKeys.length) {
      if (step == 2) {
        // 计算位置
        const computSortVal = (sortVal, index) => {
          // const isSameRowKey =
          //   JSON.stringify(selectedRowKeys) ===
          //   JSON.stringify(preSelectedRowKeys);

          // if (isSameRowKey) {
          if (sortVal) {
            return sortVal;
          } else {
            return index + 1;
          }
        };
        //获取选中的按钮列表
        let selectButtonList = checkedButtonKeys.reduce((pre, cur, index) => {
          if (newSelectButtonList.length > 0) {
            for (let i = 0; i < allButtonList.length; i++) {
              for (let j = 0; j < newSelectButtonList.length; j++) {
                if (
                  allButtonList[i].buttonId === newSelectButtonList[j].buttonId
                ) {
                  allButtonList[i] = newSelectButtonList[j];
                  break;
                }
              }
            }
          }
          allButtonList.forEach(item => {
            if (cur === item.buttonId) {
              pre.push({
                ...item,
                operationType: item.operationType ? item.operationType : 'VIEW',
                sort: computSortVal(item.sort, index),
              });
              // 设置表单默认值

              form.setFields([
                {
                  name: `sort_${item.buttonId}`,
                  value: computSortVal(item.sort, index),
                  errors: '',
                },
              ]);
            }
          });
          return pre;
        }, []);
        setSelectButtonList(selectButtonList);
      } else {
        dispatch({
          type: 'buttonSolution/updateStates',
          payload: {
            buttonList: allButtonList,
          },
        });
      }
      setStep(step);
    } else {
      message.error('请选择按钮');
    }
  };
  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    if (searchButtonValue) {
      const index = checkedButtonKeys.findIndex(
        item => item == info.node.key,
      );
      if (index == -1 && info.checked) {
        checkedButtonKeys.push(info.node.key);
      } else {
        checkedButtonKeys.splice(index, 1);
      }
      dispatch({
        type: 'buttonSolution/updateStates',
        payload: {
          checkedButtonKeys: [...checkedButtonKeys],
        },
      });
      let selectButtonList = checkedButtonKeys.reduce((pre, cur, index) => {
        allButtonList.forEach(item => {
          if (cur === item.buttonId) {
            pre.push({ ...item });
          }
        });
        return pre;
      }, []);
      setSelectButtonList(selectButtonList);
    } else {
      let selectButtonList = checkedKeys.reduce((pre, cur, index) => {
        allButtonList.forEach(item => {
          if (cur === item.buttonId) {
            pre.push({ ...item });
          }
        });
        return pre;
      }, []);
      setSelectButtonList(selectButtonList);
      dispatch({
        type: 'buttonSolution/updateStates',
        payload: {
          checkedButtonKeys: checkedKeys,
        },
      });
    }
  };

  // TreeNode节点处理
  const renderTreeNodes = data =>
    data.map(item => {
      if(item.buttonDesc){
        return (
          <TreeNode
            key={item.key}
            title={`${item.title} (${item.buttonDesc})`}
            value={`${item.value}`}
          />
        );
      }
      return (
        <TreeNode
          key={item.key}
          title={`${item.title}`}
          value={`${item.value}`}
        />
      );
    });

  const leftRender = () => {
    return (
      <div className={styles.left_org_tree}>
        {/* <span className={styles.title}>
      按钮名称
    </span> */}
        <div className={styles.content}>
          <Input.Search
            className={styles.search}
            placeholder={'请输入按钮名称、描述'}
            allowClear
            onSearch={value => {
              onSearchTable(value);
            }}
            enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
          />
          {/* <ITree
        treeData={treeData}
        currentNode={currentNode}
        expandedKeys={expandedKeys}
        treeSearchWord={treeSearchWord}
        plst='请输入部门名称'
        getData={getData}
        nodeType='DEPT'
        moudleName={nameSpace}
        onEditTree={()=>{}}
      /> */}
          <div className={styles.leftTree_button}>
            <Tree
              // treeData={buttonList}
              onCheck={onCheck}
              checkable
              checkedKeys={checkedButtonKeys}
            >
              {renderTreeNodes(buttonList)}
            </Tree>
          </div>
        </div>
      </div>
    );
  };
  const onSearchTable = value => {
    console.log(value);
    dispatch({
      type: 'buttonSolution/updateStates',
      payload: {
        searchButtonValue: value,
      },
    });
    dispatch({
      type: 'buttonSolution/getButtons',
      payload: {
        searchValue: value,
        buttonTypeName: addObj.groupType.split('_')[0],
        buttonSourceName: 'CUSTOM',
      },
    });
  };
  console.log(selectButtonList, 'selectButtonList===');
  //重置到form到chu
  return (
    <GlobalModal
      visible={true}
      // width={'95%'}
      widthType={1}
      incomingWidth={1000}
      // incomingHeight={220}
      title="关联按钮"
      onCancel={onCancel}
      className={styles.add_form}
      mask={false}
      maskClosable={false}
      bodyStyle={{ padding: '0px 16px' }}
      // centered
      getContainer={() => {
        return document.getElementById('buttonSolution_container');
      }}
      containerId='buttonSolution_container'
      footer={
        step == 1
          ? [
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  clickStep(2);
                }}
              >
                下一步
              </Button>,
            ]
          : [
              <Button key="cancle" onClick={onCancel}>
                取消
              </Button>,
              <Button
                key="preStep"
                type="primary"
                onClick={() => {
                  clickStep(1);

                  // dispatch({
                  //   type: 'buttonSolution/updateStates',
                  //   payload: {
                  //     buttonList: preButtonList,
                  //     selectedRowKeys: preSelectedRowKeys,
                  //   },
                  // });
                  // setSelectID('');
                }}
              >
                上一步
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={() => {
                  form.submit();
                }}
                loading={loading}
              >
                保存
              </Button>,
            ]
      }
    >
      {/* {step == 1 ? (
        <>
          <Input.Search
            className={styles.search}
            placeholder={'请输入按钮名称、描述'}
            allowClear
            onSearch={value => {
              onSearchTable(value);
            }}
          />
          <Table
            scroll={{ y: 'calc(100vh - 450px)' }}
            bordered
            dataSource={buttonList}
            columns={listColumns}
            rowClassName="editable-row"
            pagination={false}
            rowKey="buttonId"
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
          />
        </>
      ) : (
        <Form form={form} component={false} onFinish={submitForm}>
          <Table
            components={
              isShowDefault
                ? {
                    body: {
                      cell: EditableCell,
                    },
                  }
                : {}
            }
            scroll={{ y: 'calc(100vh - 450px)' }}
            bordered
            dataSource={_.cloneDeep(selectButtonList)}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false}
            rowKey="buttonId"
          />
        </Form>
      )} */}
      <div className={styles.user_warp}>
        <span className={styles.split_line}></span>
        {step == 1 ? (
          <ReSizeLeftRight
            leftChildren={leftRender()}
            rightChildren={
              <div style={{height:'100%'}}>
                <ColumnDragTable
                  scroll={{ y: 'calc(100% - 41px)' }}
                  // bordered
                  dataSource={_.cloneDeep(selectButtonList)}
                  columns={listColumns}
                  rowClassName="editable-row"
                  pagination={false}
                  rowKey="buttonId"
                  style={{ paddingTop: '16px' }}
                  // rowSelection={{
                  //   type: 'checkbox',
                  //   ...rowSelection,
                  // }}
                />
              </div>
            }
          />
        ) : (
          <Form form={form} component={false} onFinish={submitForm}>
            <Table
              components={
                isShowDefault
                  ? {
                      body: {
                        cell: EditableCell,
                      },
                    }
                  : {}
              }
              scroll={{ y: 'calc(100% - 60px)' }}
              // bordered
              dataSource={_.cloneDeep(selectButtonList)}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={false}
              rowKey="buttonId"
              style={{ paddingTop: '16px' }}
            />
          </Form>
        )}
      </div>
    </GlobalModal>
  );
}

export default connect(({ buttonSolution, layoutG, loading }) => ({
  ...buttonSolution,
  ...layoutG,
  loading,
}))(addForm);
