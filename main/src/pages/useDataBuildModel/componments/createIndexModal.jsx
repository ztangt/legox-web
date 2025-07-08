import { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import { Button, message, Modal, Table, Space, Input, Divider, Form, Typography, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import styles from './createIndexModal.less';
import AddIndexModal from './addIndexModal'
import GlobalModal from '../../../componments/GlobalModal';
const { Option } = Select;
function CreateIndexModal({ dispatch, useDataBuildModel, layoutG, dsDynamic, tableId, tableCode, }) {
    const {
        pathname,
        getIndexTable,
        datasourceTable,
    } = useDataBuildModel

    const originData = [];
    for (let i = 0; i < getIndexTable.length; i++) {
        originData.push({
            key: getIndexTable[i]['id'] ? getIndexTable[i]['id'] : new Date().getTime(),
            indexesName: getIndexTable[i] && getIndexTable[i]['indexesName'],
            indexesFields: getIndexTable[i] && getIndexTable[i]['indexesFields'].split(','),
            isNewData: false,
        });
    }

    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [addedItemName, setAddedItemName] = useState('');
    const [editingKey, setEditingKey] = useState('');
    const [fieldOption, setFieldOption] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const isEditing = (record) => {
        return record.key === editingKey
    };


    let tempDataSrcTable = [];
    useEffect(() => {
        datasourceTable.forEach((item, ind) => {
            tempDataSrcTable.push(item.colCode);
        })
        setFieldOption(tempDataSrcTable);
    }, [datasourceTable])

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        const inputNode = inputType === 'input' ? <Input style={{ width: '210px' }} /> :
            <Select
                mode="tags"
                style={{ width: '400px' }}
                onChange={selectChangeFn}
                tokenSeparators={[',']}
                // dropdownRender={menu => (
                //     <div>
                //         {menu}
                //         <Divider style={{ margin: '4px 0' }} />
                //         <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                //             <Input style={{ flex: 'auto' }} value={addedItemName} onChange={onNameChange} />
                //             <a
                //                 style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                //                 onClick={addItem}
                //             >
                //                 <PlusOutlined />
                //             </a>
                //         </div>
                //     </div>
                // )}
            >
                {fieldOption.map(item => (
                    <Option key={item}>{item}</Option>
                ))}
            </Select>;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `请输入${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const columns = [
        {
            title: '名称',
            dataIndex: 'indexesName',
            align: 'center',
            editable: true,
        },
        {
            title: '字段',
            dataIndex: 'indexesFields',
            align: 'center',
            editable: true,
        },
        {
            title: '操作',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            onClick={() => { saveIndexFn(record) }}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            保存
                        </a>
                        <a
                            onClick={() => { editCancel(record) }}
                            // style={{
                            //     marginRight: 8,
                            // }}
                        >
                            取消
                        </a>
                    </span>
                ) : (
                    <>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => { modifyIndexFn(record) }}>
                            修改
                        </Typography.Link>
                        <Typography.Link style={{ marginLeft: '10px' }} disabled={editingKey !== ''} onClick={() => { deleteIndexFn(record) }}>
                            删除
                        </Typography.Link>
                    </>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => {
                return {
                    record,
                    inputType: col.dataIndex === 'indexesName' ? 'input' : 'select',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                }
            },
        };
    });

    const addItem = () => {
        if (addedItemName != '') {
            setFieldOption([...fieldOption, addedItemName])
        }
    };

    const onNameChange = (ev) => {
        setAddedItemName(ev.target.value)
    }

    // 字段选择
    const selectChangeFn = (value) => {

    }
    // 行取消编辑
    const editCancel = (record) => {
        // 删除空项
        const newData = [...data];
        setData(newData.filter(item => { return !item.isNewData }))
        setEditingKey('');

    };

    // 修改索引
    const modifyIndexFn = (record) => {
        form.setFieldsValue({
            indexesName: '',
            indexesFields: '',
            ...record,
        });
        setEditingKey(record.key);
    }
    // 删除索引
    const deleteIndexFn = (record) => {
        dispatch({
            type: 'useDataBuildModel/delDatasourceIndexes',
            payload: {
                // id: selectedRowKeys.join(','),
                id: record.key,
            },
            callback: () => {
                dispatch({
                    type: 'useDataBuildModel/getDatasourceIndexes',
                    payload: {
                        tableId,
                    },
                })
            }
        })
    }
    // 保存索引
    const saveIndexFn = async (record) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => record.key === item[record.key]);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }

            // 删除空项
            setData(newData.filter(item => { return !item.isNewData }))

            if (record.isNewData) {
                // 创建索引
                dispatch({
                    type: 'useDataBuildModel/addDatasourceIndexes',
                    payload: {
                        indexesName: row.indexesName,
                        indexesFields: row.indexesFields.join(','),
                        dsDynamic,
                        tableId,
                        tableCode,
                    },
                    callback: () => {
                        dispatch({
                            type: 'useDataBuildModel/getDatasourceIndexes',
                            payload: {
                                tableId,
                            },
                        })
                    }
                })
            } else {
                // 修改索引
                dispatch({
                    type: 'useDataBuildModel/updateDatasourceIndexes',
                    payload: {
                        indexesId: record.key,
                        indexesName: row.indexesName,
                        indexesFields: row.indexesFields.join(','),
                        dsDynamic,
                        tableId,
                        tableCode,
                    },
                    callback: () => {
                        dispatch({
                            type: 'useDataBuildModel/getDatasourceIndexes',
                            payload: {
                                tableId,
                            },
                        })
                    }
                })
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }

    // 增加索引
    const addIndexFn = () => {
        const newData = {
            key: new Date().getTime(),
            indexesName: '',
            indexesFields: '',
            isNewData: true,
        };
        setEditingKey(newData.key);
        setData([...data, newData]);
    }
    // 批量删除
    const delAllIndexFn = () => {
        dispatch({
            type: 'useDataBuildModel/delDatasourceIndexes',
            payload: {
                id: selectedRowKeys.join(','),
            },
            callback: () => {
                dispatch({
                    type: 'useDataBuildModel/getDatasourceIndexes',
                    payload: {
                        tableId,
                    },
                })
            }
        })
    }
    // Modal关闭
    const onCancel = () => {
        dispatch({
            type: 'useDataBuildModel/updateStates',
            payload: {
                isShowCreateIndexModal: false,
            }
        })
    }

    return (
        <GlobalModal
            visible={true}
            footer={null}
            // width={'95%'}
            widthType={1}
            incomingWidth={900}
            incomingHeight={500}
            title={'创建索引'}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            centered
            bodyStyle={{padding:'10px'}}
            getContainer={() =>{
                return document.getElementById('useDataBuildModel_container')||false
            }}
        >
            <Space>
                <div style={{marginBottom:'8px'}}>
                    <Button type='primary' onClick={addIndexFn}>增加索引</Button>
                    <Button type='primary' onClick={delAllIndexFn} style={{ marginLeft: '10px' }}>删除</Button>
                </div>
            </Space>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    rowKey='key'
                    size='small'
                    pagination={false}
                    rowSelection={{
                        type: 'selectionType',
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys);
                        },
                    }}
                />
            </Form>
        </GlobalModal>
    )

}
export default connect(({ useDataBuildModel, layoutG }) => ({
    useDataBuildModel,
    layoutG,
}))(CreateIndexModal);
