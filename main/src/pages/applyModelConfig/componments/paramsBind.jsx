// 事件处理器
import { connect } from 'dva';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Input, Space, Select } from 'antd';
import { BINDFIELD, FROMBPM } from '../../../service/constant'
import ScriptEditor from '../../../componments/public/scriptEditor'
import GlobalModal from '../../../componments/GlobalModal';
import Table from '../../../componments/columnDragTable';
import _ from "lodash";
const { Option, OptGroup } = Select;

function EventHandler({ query, dispatch, loading, applyModelConfig, eventIndex, eventId, parentState, setParentState }) {
    const { bizSolId } = query;
    const { procDefId, bizFromInfo, bizEventList, paramsData, bizSolInfo, isShowScript } = parentState;
    const [arrayList, setArray] = useState({ 'FROMFORM': [], 'FROMBPM': FROMBPM, 'FROMDATADRIVEN': [] });
    const formDeployId = bizFromInfo.formDeployId;
    const { fixedValue, fixedIndex } = applyModelConfig;
    const scriptRef = useRef();
    //初始
    useEffect(() => {

        dispatch({//获取表单字段
            type: "applyModelConfig/getFormTableColumns",
            payload: {
                deployFormId: formDeployId,
                type: 'YES'
            },
            callback: (data) => {
                setParentState({
                    fromCols: data
                })
                arrayList['FROMFORM'] = data
                setArray(arrayList);
            }
        })
        // dispatch({//获取数据驱动方案
        //     type:"applyModelConfig/getFormDataDrive",
        //     payload:{
        //         driveType: '',
        //         start: 1,
        //         ctlgId: bizSolId,
        //         limit: 1000,
        //         planName: '',
        //     },
        //     callback: (data)=>{
        //         arrayList['FROMDATADRIVEN'] = data
        //         setArray(arrayList);
        //     }
        // })

    }, []);

    function onCancel() {
        setParentState({
            paramsBind: false,
        })
        if (!paramsData) {
            bizEventList[eventIndex]['params'] = []
        } else {
            bizEventList[eventIndex]['params'] = paramsData
        }

    }

    function onSave() {//保存
        // let index = bizEventList.findIndex((item)=>{return item.eventId==eventId})
        for (let index = 0; index < paramsData && paramsData.length; index++) {
            paramsData[index]['paramId'] = paramsData[index].id ? paramsData[index].id : paramsData[index].paramId
        }
        bizEventList[eventIndex]['params'] = paramsData
        if (!paramsData) {
            bizEventList[eventIndex]['params'] = []
        }
        setParentState({
            bizEventList: bizEventList,
            paramsBind: false
        })

    }
    function onBlur(index, record) {
        paramsData[index].paramId = record.paramId ? record.paramId : record.id
        setParentState({
            paramsData
        })
    }
    function onChangeVal(index, record, value, option) {//值改变时
        paramsData[index]['defaultIdVal'] = record.boundField == 'FROMDATADRIVEN' ? JSON.stringify(value) : value
        if (record.boundField == 'FROMFORM') {//来自表单 取字段code
            let key = option.key
            paramsData[index]['defaultVal'] = key
            debugger
            // 字段类型 人员树 部门树 单位树 现在取  
        } else if (record.boundField == 'FROMFIXED') {//来自固定值 取原值
            paramsData[index]['defaultIdVal'] = value.target.value
            paramsData[index]['defaultVal'] = value.target.value
        } else if (record.boundField == 'FROMBPM') {//来自流程 直接取名称
            paramsData[index]['defaultVal'] = option.children
        } else {//其他直接取名称
            paramsData[index]['defaultVal'] = option.map((item) => { return item.children }).toString()
        }
        setParentState({
            paramsData
        })

    }

    function onChnageField(index, record, value) {//绑定方案修改
        if (value == 'FROMBPM') {
            paramsData[index].paramId = record.paramId ? record.paramId : record.id
        }
        paramsData[index]['boundField'] = value
        paramsData[index]['defaultVal'] = ''
        paramsData[index]['defaultIdVal'] = ''
        setParentState({
            paramsData
        })
    }
    function changeValue(index, text) {
        setParentState({
            isShowScript: true,
        })
        dispatch({
            type: "applyModelConfig/updateStatesGlobal",
            payload: {
                fixedIndex: index,
                fixedValue: text
            }
        })
    }
    function handelCancle() {
        setParentState({
            isShowScript: false
        })
    }
    function saveFixedValue() {
        let tmpFixedValue = scriptRef.current?.getValue();
        paramsData[fixedIndex]['defaultIdVal'] = tmpFixedValue
        paramsData[fixedIndex]['defaultVal'] = tmpFixedValue
        handelCancle()
    }
    const changeScriptContent = (value) => {
        console.log('e=--', value);
        dispatch({
            type: "applyModelConfig/updateStatesGlobal",
            payload: {
                fixedValue: value
            }
        })
    }
    const userTableProp = {
        rowKey: 'paramId',
        size: 'middle',
        scroll: { y: 400 },
        columns: [
            {
                title: '参数',
                dataIndex: 'paramName',
            },
            {
                title: '参数类型',
                dataIndex: 'paramType',
            },
            {
                title: '参数描述',
                dataIndex: 'paramDesc',
            },
            {
                title: '绑定字段方案',
                dataIndex: 'boundField',
                render: (text, record, index) => bizSolInfo.bpmFlag == false ? <Select
                    value={text}
                    onChange={onChnageField.bind(this, index, record)}
                    style={{ width: 100 }}
                >
                    {BINDFIELD.filter(item => item.key != 'FROMBPM').map((item, index) => <Select.Option
                        value={item.key}
                        key={index}
                    >
                        {item.name}
                    </Select.Option>)}
                </Select> : <Select
                    value={text}
                    onChange={onChnageField.bind(this, index, record)}
                    style={{ width: 100 }}
                >
                    {BINDFIELD.map((item, index) => <Select.Option
                        value={item.key}
                        key={index}
                    >
                        {item.name}
                    </Select.Option>)}
                </Select>
            },
            {
                title: '固定值',
                dataIndex: 'defaultVal',
                render: (text, record, index) => <div>
                    {

                        record.boundField == 'FROMFIXED' ?
                            <Input value={text} onBlur={onBlur.bind(this, index, record)} style={{ width: 100 }} onClick={changeValue.bind(this, index, text)} /> :
                            record.boundField == 'FROMBPM' ?
                                <Select style={{ width: 100 }} disabled></Select> :
                                <Select
                                    showSearch
                                    filterOption={(input, option) => {
                                        const item = option.props;
                                        const name = item.name || item.planName || item.formColumnName || item.children;
                                        return name && name.toString().toLowerCase().includes(input.toLowerCase());
                                    }}
                                    disabled={record.boundField == 'FROMBPM'}
                                    value={record.defaultIdVal ? (record.boundField == 'FROMDATADRIVEN' ? JSON.parse(record.defaultIdVal) : record.defaultIdVal) : []}
                                    onChange={onChangeVal.bind(this, index, record)}
                                    onBlur={onBlur.bind(this, index, record)}
                                    style={{ width: 150 }}
                                    mode={record.boundField == 'FROMDATADRIVEN' ? 'multiple' : ''}
                                >
                                    {
                                        record.boundField &&
                                        arrayList &&
                                        arrayList[record.boundField] &&
                                        arrayList[record.boundField].length != 0 &&
                                        arrayList[record.boundField].map((group, arrayIndex) => <OptGroup
                                            label={group.formTableName} key={group.formTableId}
                                        >
                                            {group.columnList.map((item, keyIndex) => (
                                                <Option
                                                    value={item.key || item.id || `${group.tableScope}*${group.formTableCode}*${item.formColumnCode}`}
                                                    key={`${item.formColumnCode}_${index}_${arrayIndex}_${keyIndex}`} //解决key不唯一导致的筛选问题，请规范写key
                                                    colType={item.colType}
                                                >
                                                    {item.name || item.planName || item.formColumnName}
                                                </Option>
                                            ))}
                                        </OptGroup>)
                                    }
                                </Select>


                    }

                </div>
            }

        ],
        dataSource: paramsData,
        pagination: false,
    }
    return (
        <>
            <GlobalModal
                visible={true}
                widthType={2}
                title='事件选择'
                bodyStyle={{ padding: '0px' }}
                onCancel={onCancel}
                mask={false}
                maskClosable={false}
                centered
                getContainer={() => {
                    return document.getElementById(`event_modal_${bizSolId}`) || false
                }}
                footer={[
                    <Button onClick={onCancel}>
                        取消
                    </Button>,
                    <Button loading={loading.global} type="primary" onClick={onSave}>
                        保存
                    </Button>
                ]}
            >
                <Table {...userTableProp} key={loading} scroll={{ y: 'calc(100% - 40px)' }} />
            </GlobalModal>
            {
                isShowScript && <GlobalModal
                    title="固定值"
                    visible={true}
                    onCancel={handelCancle.bind(this)}
                    widthType={2}
                    bodyStyle={{ padding: '0px' }}
                    centered
                    onOk={saveFixedValue}
                    maskClosable={false}
                    mask={false}
                    getContainer={() => {
                        return document.getElementById(`code_modal_${bizSolId}`) || false
                    }}
                >
                    <ScriptEditor
                        scriptValue={fixedValue}
                        ref={scriptRef}
                    />
                </GlobalModal>
            }
        </>

    )
}



export default (connect(({ applyModelConfig, layoutG, loading }) => ({
    applyModelConfig,
    ...layoutG,
    loading
}))(EventHandler));
