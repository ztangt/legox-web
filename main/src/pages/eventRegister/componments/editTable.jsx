import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Space, Select, message } from 'antd';
import ColumnDragTable from '../../../componments/columnDragTable';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styles from './editTable.less'
function EditTable({ dispatch, eventRegister, layoutG }) {

    const {
        tableData,
        editingKey,
        tableSelectId
    } = eventRegister
    const [rowRecord,setRowRecord] = useState('')
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
        const inputNode = title === '参数类型' ? <Select
            style={{ width: '100px' }}
            defaultValue={"String"}
            allowClear={false}
            onBlur={()=>save(rowRecord.key)}
        >
            <Option value="String">String</Option>
            {/* <Option value="Integer">Integer</Option>
            <Option value="Long">Long</Option>
            <Option value="Double">Double</Option> */}
        </Select> : <Input onBlur={()=>save(rowRecord.key)}/>;
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
                                message: `输入${title}`,
                            },
                            { 
                                whitespace: true, 
                                message: `输入${title}`,
                            }
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

    const [form] = Form.useForm();
    const [data, setData] = useState(tableData);
    
    const isEditing = (record) => record.key === editingKey;
    console.log('tableData',tableData);
    useEffect(() => {
        setData(tableData)
    }, [tableData])

    const edit = (record) => {
        form.setFieldsValue({
            paramName: '',
            paramType: '',
            paramDesc: '',
            ...record,
        });
        dispatch({
            type: 'eventRegister/updateStates',
            payload: {
                editingKey: record.key,
            }
        })
    };
    // 排序操作up
    const sortUpAction = (index)=>{
        const index_= index-1
        const nowData = data[index]
        data.splice(index, 1);
        data.splice(index_,0, nowData);
        setData([...data])
        dispatch({
            type: 'eventRegister/updateStates',
            payload: {
                tableData: data
            }
        })
    }
    // down
    const sortDownAction = (index)=>{
        const index_=index+1
        const nowData = data[index]
        data.splice(index, 1);
        data.splice(index_,0, nowData);
        setData([...data])
        dispatch({
            type: 'eventRegister/updateStates',
            payload: {
                tableData: data
            }
        })
    }

    const cancel = () => {
        dispatch({
            type: 'eventRegister/updateStates',
            payload: {
                editingKey: '',
            }
        })
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            if (vaildTableData(row.paramName,key)) {
                message.error('参数名称不能重复')
                return;
            }
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
            } else {
                newData.push(row);
                setData(newData);
            }
            dispatch({
                type: 'eventRegister/updateStates',
                payload: {
                    tableData: newData,
                    editingKey: '',
                }
            })

        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    //验证添加的数据
    const vaildTableData = (paramName,key) => {
        const index = tableData.findIndex(item=>item.key==key)
        const tables = JSON.parse(JSON.stringify(tableData))
        tables.splice(index,1) // 剩余操作行数据
        const itemTable = tables.filter(item=>item.paramName == paramName)
        if(itemTable.length>0){
            return true
        }
        return false
    }
    const validatorSortList = (index)=>{
        if(index==0){
            return <ArrowDownOutlined style={{color:'var(--ant-primary-color)'}} onClick={()=>sortDownAction(index)}/>
        }else if(index == data.length-1){
            return <ArrowUpOutlined style={{color:'var(--ant-primary-color)'}} onClick={()=>sortUpAction(index)}/>
        }else{
            return (
                <><ArrowDownOutlined style={{color:'var(--ant-primary-color)'}} onClick={()=>sortDownAction(index)}/><ArrowUpOutlined style={{color:'var(--ant-primary-color)'}} onClick={()=>sortUpAction(index)}/></>
            )
        }
    }   
    // 点击
    const clickRecord = (record)=>{
        const editable = isEditing(record);
        setRowRecord(record)
        if(!editable){
            if(editingKey){
                return 
            }
            edit(record)
        }
    }

    const columns = [
        {
            title: '参数名称',
            dataIndex: 'paramName',
            render: (text,record) => <a className={styles.text} onClick={()=>clickRecord(record)} title={text}>{text}</a>,
            editable: true,
        },
        {
            title: '参数类型',
            dataIndex: 'paramType',
            render: (text,record) => <a className={styles.text} onClick={()=>clickRecord(record)} title={text}>{text}</a>,
            editable: true,
        },
        {
            title: '参数描述',
            dataIndex: 'paramDesc',
            render: (text,record) => <a className={styles.text} onClick={()=>clickRecord(record)} title={text}>{text}</a>,
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record,index) => {
                const editable = isEditing(record);
                return editable ? (
                        <Space style={{ width: '120px' }} className={styles.actions}>
                            {/* <a
                                href="javascript:;"
                                onClick={() => save(record.key)}
                            >
                                保存
                            </a>
    
                            <a onClick={()=>cancel()}>取消</a> */}
                            {(validatorSortList(index))}
                        </Space>
                    ) : (
                        <Space style={{ width: '80px' }} className={styles.actions}>
                            {/* <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                编辑   
                            </Typography.Link> */}
                            {(validatorSortList(index))}
                        </Space>
                    ) 
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <div className={styles.form_edit}>
            <Form form={form} component={false}>
                <ColumnDragTable
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    onRow={record => {
                        return {
                            onClick:event=>{
                                if(record.key&&(record.paramName==''||record.paramType==''||record.paramDesc=='')){
                                    const editable = isEditing(record);
                                    setRowRecord(record)
                                    if(!editable){
                                        if(editingKey){
                                            return 
                                        }
                                        edit(record)
                                    }
                                }
                            }
                        }
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={false}
                    taskType = 'MONITOR'
                    rowSelection={{
                        selectedRowKeys: tableSelectId,
                        onChange: (selectedRowKeys, selectedRows) => {
                            dispatch({
                                type: 'eventRegister/updateStates',
                                payload: {
                                    tableSelectData: selectedRows,
                                    tableSelectId: selectedRowKeys
                                }
                            })
                        },
                    }}
                />
            </Form>
        </div>
    );

}
export default connect(({ eventRegister, layoutG }) => ({
    eventRegister,
    layoutG,
}))(EditTable);

