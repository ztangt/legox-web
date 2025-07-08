import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {Modal, Button, Form, Row, Col, Input, Switch, Select, Table, TreeSelect, message} from 'antd';
import styles from "@/pages/applyCorrelation/components/configModal.less";
import GlobalModal from '../../../componments/GlobalModal';
import {toValue} from "@re-editor/core/lib/scripts/utils/utils";


function Index({ isEdit, dispatch, normAux}) {
  const {editRowData, allTableData, dictData, initData, colData, lastKey, modelTitle} = normAux;
  const [form] = Form.useForm();
  const [highlightedRows, setHighlightedRows] = useState(new Set());
  const [selectedName, setSelectedName] = useState(""); // 用于记录选中的 name 值

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (isEdit) {
      // 更新表单字段
      form.setFieldsValue({ relationTableCode: editRowData?.tableCode });
      setSelectedName(editRowData?.tableName); // 保持选中字段同步
      // 更新 initData
      dispatch({
        type: 'normAux/updateStates',
        payload: {
          initData: editRowData?.rows || [],
        },
      });
    }
  }, [isEdit, editRowData]);

  const handleCancel = () => {
    form.resetFields();
    dispatch({
      type: 'normAux/updateStates',
      payload: {
        isShowAddModal: false,
        isEditModal: false,
        editRowData: null,
        initData: [{
          key: 1,
          columnCode: "",
          auxCode: "",
        }],
      }
    })
  }

  const onSave = async () => {
    // 从表单中获取当前选择的关联表
    const tableCode = form.getFieldValue("relationTableCode");
    const tableName = selectedName; // 注意：这里不直接用 setSelectedName

    if (!tableCode) {
      message.error('请先选择关联表');
      return;
    }

    // 获取表中的数据源
    if (!initData || initData.length === 0) {
      message.warning('表格中没有数据，请添加行后再保存');
      return;
    }

    // 校验数据是否完整
    const hasEmptyFields = initData.some(row => !row.columnCode || !row.auxCode);
    if (hasEmptyFields) {
      message.error('表格中存在未完成的配置，请填写完整再保存');
      return;
    }
    const formattedData = initData.map((row) => {
      // 查找字段列名称
      const columnName =
        colData.find((item) => item.colCode === row.columnCode)?.colName || "";

      // 查找辅助核算项名称
      const auxName =
        dictData.find((item) => item.dictInfoCode === row.auxCode)
          ?.dictInfoName || "";

      // 按照后端实体组合数据
      return {
        businessTableCode: tableCode,
        businessTableName: tableName,
        businessColCode: row.columnCode,
        businessColName: columnName,
        auxLableCode: row.auxCode,
        auxLableName: auxName,
      };
    });

    // 转为字符串形式 (后端接收为字符串 JSON 格式)
    const payloadString = JSON.stringify(formattedData);
    debugger;
    try {
      await dispatch({
        type: 'normAux/saveNormAux',
        payload: {
          normAuxStr: payloadString,
          tableCode: tableCode,
        },
      });

      // 提示成功
      message.success('数据保存成功');

      // 关闭弹窗
      handleCancel();

      dispatch({
        type: 'normAux/getNormAuxList',
        payload: {
          start: 1, // 从第一页开始加载
          limit: 10, // 每页条数
          searchWord: '', // 搜索关键字
        },
      });
    } catch (error) {
      console.error(error);
      message.error('数据保存失败，请检查后重试');
    }
  };

  const handleSearch = (type, searchText) => {
    if (!searchText) return; // 忽略空输入

    const lowerSearchText = searchText.toLowerCase();

    const data = type === "columnCode" ? colData : dictData; // 获取对应的数据源
    const exists = data.some(
      (item) =>
        item.colCode?.toLowerCase().includes(lowerSearchText) ||
        item.colName?.toLowerCase().includes(lowerSearchText) ||
        item.auxCode?.toLowerCase().includes(lowerSearchText) ||
        item.auxName?.toLowerCase().includes(lowerSearchText)
    );

    if (exists) return; // 已存在的选项，不需要新增

    // 动态创建新选项
    const newItem = type === "columnCode"
      ? { colCode: searchText, colName: "自定义字段" }
      : { dictInfoCode: searchText, dictInfoName: "自定义辅助项" };

    // 更新状态
    dispatch({
      type: "normAux/updateStates",
      payload: type === "columnCode" ? { colData: [...colData, newItem] } : { dictData: [...dictData, newItem] },
    });
  };

  const getNormAuxTableColumn = () => {
    let tableCode = form.getFieldValue("relationTableCode");
    console.log("tableCode");
    console.log(tableCode);
    if(!tableCode){
      message.error('请先选择关联表')
      return;
    }
      dispatch({
        type: 'normAux/getNormAuxTableColumn',
        payload: {
          tableCode: tableCode,
        }
      })
  }

  const tableProps = {
    scroll: { x: 'max-content', y: 300 },
    // key: totalData,
    rowKey: 'key',
    bordered: true,
    columns: [
      {
        title: '字段名',
        dataIndex: 'columnCode',
        fixed: 'left',
        render: (text, record) => (
          <Select
            showSearch
            placeholder="请输入或下拉选择字段"
            defaultValue={record.columnCode || undefined}
            onFocus={getNormAuxTableColumn}
            style={{ width: 300 }}
            onSearch={(searchText) => handleSearch('columnCode', searchText)}
            onChange={(value) => handleFieldChange(value, 'columnCode', record.key)}
            filterOption={(input, option) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 // 自定义匹配规则
            }
          >
            {colData.map((item, index) => (
              <Option value={item.colCode} key={index}>
                {item.colCode + (item.colName ? "（" + item.colName + "）" : "")}
              </Option>
            ))}
          </Select>
        )
      },
      {
        title: '辅助核算项',
        dataIndex: 'auxCode',
        width:200,
        render: (text, record, index) => (
          <Select
            showSearch
            placeholder="请输入或下拉选择字段"
            onSearch={(searchText) => handleSearch('auxCode', searchText)} // 输入时触发
            style={{ width: 300 }}
            defaultValue={text?text:undefined}
            onChange={(value) => handleFieldChange(value, 'auxCode', record.key)}
            filterOption={(input, option) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 // 自定义匹配规则
            }
          >
            {dictData.map((item, index) => (
              <Option value={item.dictInfoCode} key={index}>
                {item.dictInfoCode + (item.dictInfoName ? "（" + item.dictInfoName + "）" : "")}
              </Option>
            ))}
          </Select>
        )
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        render: (_, row) => (
          <div style={{ width: 42 }}>
            <a onClick={() => onAddGroup()}>增加行</a><br />
            <a onClick={() => onDeleteGroup(row.key)} style={{ color: 'red' }}>删除行</a>
          </div>
        ),
      },
    ],
    dataSource: isEdit ? tableData : initData,
    pagination: false,
  }

  function handleFieldChange(value, fieldType, rowKey) {
    debugger;
    // 检查是否已存在相同的字段名或辅助核算项
    const isDuplicate = initData.some(item => item.key !== rowKey && item[fieldType] === value);
    if (isDuplicate) {
      message.warning(`该${fieldType === 'columnCode' ? '字段名' : '辅助核算项'}已被设置。`);
      setHighlightedRows(prev => new Set(prev).add(rowKey)); // 添加到高亮行
      setTimeout(() => {
        setHighlightedRows(prev => {
          const newSet = new Set(prev);
          newSet.delete(rowKey); // 移除高亮
          return newSet;
        });
      }, 1000); // 1秒后移除高亮
    } else {
      // 更新行数据
      const newData = initData.map(item => {
        if (item.key === rowKey) {
          return { ...item, [fieldType]: value };
        }
        return item;
      });
      dispatch({
        type: 'normAux/updateStates',
        payload: {
          initData: newData,
        },
      });
    }
  }

  function onAddGroup(){
    const newKey = lastKey + 1;
    const newRow = {
      key: newKey,
      columnCode: "",
      auxCode: "",
    };
    // 使用 dispatch 更新状态
    dispatch({
      type: 'normAux/updateStates',
      payload: {
        initData: [...initData, newRow], // 创建新的数组，添加新行
        lastKey: newKey,
      },
    });
  }

  function onDeleteGroup(key) {
    // 过滤掉要删除的行
    const newData = initData.filter(item => item.key !== key);

    // 使用 dispatch 更新状态
    dispatch({
      type: 'normAux/updateStates',
      payload: {
        initData: newData, // 更新为新的数据源
        lastKey: newData.length > 0 ? newData[newData.length - 1]?.key : 0,
      },
    });
  }

  const selectToValue = (value, option) => {
    console.log("选择了关联表");
    console.log(option["data-name"]);
    console.log(option["value"]);
    setSelectedName(option["data-name"]);
  }

  return (
    <div>

      <GlobalModal
        title={modelTitle}
        widthType={1}
        incomingWidth={1000}
        incomingHeight={450}
        visible={true}
        onCancel={handleCancel}
        mask={false}
        maskClosable={false}
        bodyStyle={{ minHeight: '200px', maxHeight: '70vh', overflow: 'hidden' }}
        className={styles.config_modal}
        getContainer={() => {
          return false
        }}
        footer={[
          <Button key="cancel"  onClick={handleCancel}>取消</Button>,
          <Button key="submit" onClick={onSave}>保存</Button>
        ]}
      >
        <Form form={form} style={{ marginBottom: 0, paddingBottom: 0 }}>
          <Row gutter={0}>
            <Col span={24}>
                <Form.Item label='关联表' name='relationTableCode'>
                  <Select onChange={selectToValue} showSearch>
                    {allTableData && allTableData.map((item) => (
                      <Option value={item.code} key={item.code} data-name={item.name}>
                        <span>{item.code+"（"+item.name+"）"}</span>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table {...tableProps} dataSource={initData}  style={{ marginBottom: 0, paddingBottom: 0 }}/>
      </GlobalModal>
    </div>
  );
}
export default connect(({ normAux }) => ({ normAux }))(Index);
