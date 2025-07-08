import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import {
  Input,
  Modal,
  Button,
  Tree,
  Select,
  Popover,
  Checkbox,
  message,
  Switch,
  Table,
  TreeSelect,
} from 'antd';
import styles from './index.less';
import { useDispatch } from 'umi';
import _ from 'lodash';
import { MenuOutlined } from '@ant-design/icons';
// import { arrayMoveImmutable } from 'array-move';
import arrayMove from 'array-move';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

const currentTypes = ['DATE', 'TIME', 'DICTCODE', 'INPUT', 'NUM', 'NUM_RANGE'];
const { TreeNode } = Tree;
const { TextArea } = Input;

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: 'grab',
      color: '#999',
    }}
  />
));

function SeniorSearch({ namespace, stateInfo, containerId, dataName }) {
  const {
    dictTreeData,
    fieldTreeHigh,
    listMoudleInfo,
    seniorSearchList,
    seniorCheckedKeys,
  } = stateInfo;
  const dispatch = useDispatch();
  const [firstList, setFirstList] = useState([]);
  console.log('seniorSearchList2', seniorSearchList);
  console.log('seniorSearchList', listMoudleInfo);

  // const [dataSource, setDataSource] = useState([]);
  const [options, setOptions] = useState([
    {
      label: '列表',
      value: 'list',
    }
  ]);

  useEffect(() => {
    if (seniorSearchList.length) {
      seniorSearchList.forEach(element => {
        element.context = element.context || ['list']
        element.defaultValue = element.defaultValue || ''
      });
      // setDataSource(seniorSearchList)
      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          seniorSearchList,
        },
      });
    }
    if (listMoudleInfo.modelType === "TREELIST") {
      setOptions([
        {
          label: '列表',
          value: 'list',
        },
        {
          label: '树',
          value: 'tree',
        }
      ])
    }
  }, []);

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 50,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: '字段名称',
      dataIndex: 'colName',
      className: 'drag-visible',
    },
    {
      title: '列表展示',
      dataIndex: 'showList',
      render: (text, obj, index) => <Switch
        size="small"
        checkedChildren="ON"
        unCheckedChildren="OFF"
        checked={text}
        onChange={onAllChange.bind(this, index, 'list')}
      />
    },
    {
      title: '作用域',
      dataIndex: 'context',
      render: (text, obj, index) => <Checkbox.Group options={options} value={text} onChange={onAllChange.bind(this, index, 'context')} />
    },
    {
      title: '检索类型',
      dataIndex: 'value',
      render: (text, obj, index) => <Select
        style={{ width: 100 }}
        defaultValue="INPUT"
        value={text}
        onChange={onAllChange.bind(this, index, 'colName')}
        disabled={
          obj.columnCode == 'BIZ_STATUS' ? true : false
        }
      >
        <Select.Option value="INPUT">输入框</Select.Option>
        <Select.Option value="TIME">时间选择</Select.Option>
        <Select.Option value="DATE">日期选择</Select.Option>
        <Select.Option value="DICTCODE">码表选择</Select.Option>
        <Select.Option value="NUM">数字检索</Select.Option>
        <Select.Option value="NUM_RANGE">数字泛微检索</Select.Option>
      </Select>
    },
    {
      title: '码表选择',
      dataIndex: 'dictTypeCode',
      render: (text, obj, index) => obj.value == 'DICTCODE' &&
        obj.columnCode !== 'BIZ_STATUS' ? (
        <TreeSelect
          showSearch
          treeNodeFilterProp="title"
          onChange={onAllChange.bind(
            this,
            index,
            'dictTypeCode',
          )}
          style={{
            width: 100,
          }}
          dropdownStyle={{
            maxHeight: 400,
            overflow: 'auto',
            minWidth: 300,
          }}
          defaultValue={text || ''}
          placeholder="请选择值域"
          dropdownMatchSelectWidth={false}
          placement="topLeft"
          // allowClear
          treeDefaultExpandAll
        >
          {listMoudleInfo.deployFormId ? (
            <TreeNode title="参照表单" key="1" value="" />
          ) : (
            ''
          )}
          {dictTreeData.length > 0
            ? renderTreeNodes(dictTreeData)
            : ''}
        </TreeSelect>
      ) : <>- -</>
    },
    {
      title: '接口设置',
      dataIndex: 'api',
      render: (text, obj, index) => obj.value == 'DICTCODE' &&
        obj.columnCode !== 'BIZ_STATUS' ? (
        <Popover
          content={
            <Input
              allowClear
              style={{ width: 600  }}
              placeholder="请输入接口地址"
              key={index}
              // value={text}
              defaultValue={text}
              onBlur={onInputBlur.bind(this)}
              onChange={onAllChange.bind(this, index, 'api')}
            ></Input>
          }
          title="码表数据权限接口"
          trigger="hover"
        >
          <Button>接口</Button>
        </Popover>
      ) : <>- -</>
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      render: (text, obj, index) => renderdefaultValue(text, obj, index)

    }
  ];
  const renderdefaultValue = (text, obj, index) => {
    switch (obj.value) {
      case 'INPUT':
        // value={text}  
        return <Input style={{ width: 100 }} defaultValue={text} onChange={onAllChange.bind(this, index, 'defaultValueInput')} onBlur={onInputBlur.bind(this)} maxLength={100} />
      case 'DATE':
        return <Select
          style={{ width: 100 }}
          defaultValue=""
          value={text}
          onChange={onAllChange.bind(this, index, 'defaultValue')}
        >
          <Select.Option value="">无</Select.Option>
          <Select.Option value="FIRST">当前时间</Select.Option>
        </Select>
      case 'TIME':
        return <Select
          style={{ width: 100 }}
          defaultValue=""
          value={text}
          onChange={onAllChange.bind(this, index, 'defaultValue')}
        >
          <Select.Option value="">无</Select.Option>
          {/* <Select.Option value="FIRST">当前时间</Select.Option> */}
        </Select>
      case 'DICTCODE':
        return <Select
          style={{ width: 100 }}
          defaultValue=""
          value={text}
          onChange={onAllChange.bind(this, index, 'defaultValue')}
        >
          <Select.Option value="">无</Select.Option>
          <Select.Option value="FIRST">首项</Select.Option>
        </Select>
      default:
        break;
    }
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(seniorSearchList), oldIndex, newIndex).filter(
        (el) => !!el,
      );
      console.log('Sorted items: ', newData);
      // setDataSource(newData);
      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          seniorSearchList: newData,
        },
      });
    }
  };

  const DraggableContainer = (props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = seniorSearchList.findIndex((x) => x.columnCode === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  useEffect(() => {
    setFirstList(_.cloneDeep(seniorSearchList));
  }, []);
  useEffect(() => {
    if (!dictTreeData.length) {
      dispatch({
        type: `${namespace}/getDictTypeTree`,
      });
    }
  }, []);

  function onCancel() {
    let checkedKeys =
      firstList &&
      firstList.map(item => {
        return item.columnCode;
      });
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        seniorModal: false,
        seniorSearchList: firstList,
        seniorCheckedKeys: checkedKeys,
        // seniorSearchList: stateInfo[dataName].seniorSearchInfo,
        // seniorCheckedKeys: checkedKeys,
      },
    });
  }
  function onSave() {
    let isFlag = true;
    let isConFlag = true;
    if (seniorSearchList.length > 12) {
      message.warning('最多只能勾选12项！');
      return;
    }
    if (seniorSearchList.length != 0) {
      for (let index = 0; index < seniorSearchList.length; index++) {
        const element = seniorSearchList[index];
        console.log(element);
        if (!element.value) {
          isFlag = false;
          break;
        }
        if (!element?.context?.length) {
          isConFlag = false
          break;
        }
      }
    }
    if (!isConFlag) {
      message.error('作用域必须勾选一项！');
      return
    }
    if (!isFlag) {
      message.error('请选择所选字段的查询组件');
      return
    }
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        seniorModal: false,
      },
    });
  }

  function onCheck(
    checkedKeys,
    { checked: bool, checkedNodes, node, event, halfCheckedKeys },
  ) {
    const beforeArr = seniorSearchList;
    const afterArr = checkedNodes;
    // if (checkedNodes.length > 12) {
    //   message.warning('最多只能勾选12项！');
    //   return;
    // }
    for (let i = 0; i < afterArr.length; i++) {
      for (let j = 0; j < seniorSearchList.length; j++) {
        if (afterArr[i].columnCode === beforeArr[j].columnCode) {
          afterArr[i].value = beforeArr[j].value;
          afterArr[i].showList = beforeArr[j].showList;
          afterArr[i].dictTypeCode = beforeArr[j].dictTypeCode;
          afterArr[i].context = beforeArr[j].context || ['list'];
          afterArr[i].defaultValue = beforeArr[j].defaultValue || '';
        }
      }
    }
    let list = afterArr.filter(item => {
      if (listMoudleInfo?.sourceType === 'API') {
        return stateInfo[dataName]['tableApiId'] != item.key;
      } else {
        return stateInfo[dataName]['tableId'] != item.key;
      }
    });
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (!element.showList) {
        list[index]['showList'] = false;
      }
      list[index].context = list[index].context || ['list'];
      list[index].defaultValue = list[index].defaultValue || '';

      if (!currentTypes.includes(element.value)) {
        if (currentTypes.includes(element.colType)) {
          list[index]['value'] = element.colType;
        } else {
          list[index]['value'] = 'INPUT';
        }
      }
      if (element.key === 'BIZ_STATUS') {
        list[index]['value'] = 'DICTCODE';
      }
    }
    // setDataSource(list)
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        seniorSearchList: list,
        seniorCheckedKeys: checkedKeys,
      },
    });
  }

  function onInputBlur() {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        seniorSearchList,
      },
    });
  }

  function onAllChange(index, type, value) {
    
    if (type === 'list') {
      seniorSearchList[index].showList = value;
    } else if (type === 'colName') {
      seniorSearchList[index].value = value;
      seniorSearchList[index].defaultValue = '';
    } else if (type === 'api') {
      seniorSearchList[index].api = value.target.value;
    } else if (type === 'context') {
      if (value.length === 0) {
        message.warning('作用域必须勾选一项！')
      } else {
        seniorSearchList[index].context = value;
      }
    } else if (type === 'defaultValue') {
      seniorSearchList[index].defaultValue = value;
    } else if (type === 'defaultValueInput' ) {
      seniorSearchList[index].defaultValue = value.target.value;
    } else if (type === 'dictTypeCode') {
      seniorSearchList[index].dictTypeCode = value;
    } else {

    }
    if (type === 'defaultValueInput' || type === 'api') {
      return
    }
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        seniorSearchList,
      },
    });
  }

  // TreeNode节点处理
  const renderTreeNodes = data =>
    data.map(item => {
      if (item.id) {
        const title = item.dictTypeName;
        if (item.children) {
          return (
            <TreeNode
              title={title}
              key={item.dictTypeCode}
              value={item.dictTypeCode}
            >
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={title}
            key={item.dictTypeCode}
            value={item.dictTypeCode}
          />
        );
      }
    });

  return (
    <Modal
      visible={true}
      footer={false}
      width={'95%'}
      title={'高级查询'}
      onCancel={onCancel}
      maskClosable={false}
      centered
      bodyStyle={{ height: 600, overflow: 'hidden' }}
      mask={false}
      getContainer={() => {
        return document.getElementById(containerId) || false;
      }}
    >
      <div className={styles.senior_container}>
        <div>
          <Tree
            checkedKeys={seniorCheckedKeys}
            className={styles.tree}
            checkable
            autoExpandParent={true}
            onCheck={onCheck}
            treeData={fieldTreeHigh}
            defaultExpandedKeys={fieldTreeHigh && [fieldTreeHigh[0].key]}
          />
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ color: 'red', marginLeft: 20 }}>
            注:高级查询字段后面开关打开代表列表展示，关闭列表不展示，打开列表展示。位置默认放在按钮前。以此排序
          </p>
          <Table
            pagination={false}
            dataSource={seniorSearchList}
            columns={columns}
            scroll={{
              y: 400,
            }}
            rowKey="columnCode"
            components={{
              body: {
                wrapper: DraggableContainer,
                row: DraggableBodyRow,
              },
            }}
          />
        </div>
      </div>

      <div className={styles.bt_group} style={{ margin: '10px auto 0' }}>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={onSave.bind(this)} style={{ marginLeft: 8 }}>
          保存
        </Button>
      </div>
    </Modal>
  );
}

export default SeniorSearch;
