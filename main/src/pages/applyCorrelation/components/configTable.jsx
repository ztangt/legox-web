import React, { useState ,useEffect} from 'react'
import { connect } from 'dva'
import { Table, Form, Input, Col, Row, Select, message,TreeSelect } from 'antd'
function configTable({ dispatch, applyCorrelation, onAddGroup, onDeleteGroup }) {
    const { Option } = Select

    const { relationList, tableData, groupNum, totalData, mainName, mainList, relationName,configData ,relationData,attributeData,labelData,detailConfigList,copyRelationList,mainAndSub,relationArray,relationLogicList} = applyCorrelation
    console.log(groupNum, 'groupNum==');
    console.log(totalData, 'totalData==');
    const getmainField = (type,record,name) => {
        // if(!record.mainRelationTable&&name=='mainRelationField'){
        //     return  message.error('请先选择主关联表名')
        //  }
        if(record.bizSolId &&type=='relation'&&record.mainRelationTable){
            getRelationName(record)
            const newArr=record.mainRelationTable.split(',')
            dispatch({
                type: 'applyCorrelation/getApplyFieldsList',
                payload: {
                    tableCode: newArr.length>1?newArr[0]:record.mainRelationTable, 
                }
            })
        }
        else{
           const tableCode=type == 'main' ? mainName.MAIN : relationName.MAIN
           if(tableCode){
               dispatch({
                    type: 'applyCorrelation/getApplyFieldsList',
                    payload: {
                        tableCode: tableCode,
                    }
                })
           }
            
        }
    }
    const getRelationName=(record)=>{
        if(record.relationBizSolId){
            getRelationList('relation',record.relationBizSolId,record)
        }
    }
    function onDeleteLine(key, conditionNum, groupName, isRowCol) {
        let array = JSON.parse(JSON.stringify(totalData))
        if(array.length==1&&array[0].tableData[0].conditionNum==1){
            return message.error('该项不可删除！')
        }
        //删除当前行
        array.forEach((item, index) => {
            item.tableData.forEach((val, ind) => {
                if (val.key == key) {
                    item.tableData.splice(ind, 1)
                }
            })
        })
        if (conditionNum - 1 !== 0) {//非当前组的最后一行，更改当前删除组的conditionNum
            array.forEach((item, index) => {
                item.tableData.forEach((val, ind) => {
                    if (val.groupName == groupName) {
                        val.conditionNum = conditionNum - 1
                    }
                })
            })
        } else {
            array.forEach((item, index) => {
                if (item.tableData.length == 0) {
                    array.splice(index, 1)
                }
            })
            dispatch({
                type: 'applyCorrelation/updateStates',
                payload: {
                    groupNum: groupNum - 1,
                }
            })
        }
        console.log(array, 'totalData==000');

        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                totalData: array,
            }
        })

    }
    const updateTableData = (key, name, values) => {
        console.log(key, name, values, '111===');
        totalData.forEach((item, index) => {
            item.tableData.forEach((val, ind) => {
                // val.relationBizSolId=item.relationBizSolId
                // val.relationBizSolName=item.relationBizSolName
                val.bizSolId=configData.bizSolId
                val.bizSolName=configData.bizSolName
                val.logicName=configData.logicName
                val.logicCode=configData.logicCode

                // if(name=='mainBizTable'){
                //     const res=relationList.filter((val)=>val.bizSolId!==item.relationBizSolId)
                //         console.log(res,'res==');
                //         dispatch({
                //             type: 'applyCorrelation/updateStates',
                //             payload: {
                //                 relationList: res,
                //             }
                //         })
                // }
                if(name=='mainBizTable'){
                   const res=mainAndSub.filter(item=>item.value==values[0])       
                   val.bizTableScope=res[0]&&res[0].code
                }
                if(name=='mainRelationTable'){
                    const res=relationArray.filter(item=>item.value==values[0])
                    val.relationTableScope=res[0]&&res[0].code
                }
                if (val.key == key && (name == 'incidenceRelation' || name == 'bizAttribute'|| name == 'bizInject')) {
                    val[name] = values
                }else if(val.key == key){
                    val[name] = values.join(',')
                }
            })
        })
        console.log(totalData, 'val==');
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                totalData: totalData
            }
        })
    }
    //业务注入
    const changeValue = (record, e) => {
        let value = e.target.value
        updateTableData(record.key, 'bizInject', value)

    }
    //截取数据
    const captureData = (str) => {
        let index = str.lastIndexOf('\_')
        console.log(index, 'index==');
        return Number(str.substring(index + 1))
    }
    function filterArr(arr1, arr2) {
        return arr1.filter(v => arr2.every(val => val.relationBizSolId !== v.bizSolId))
    }
    const tableProps = {
        scroll: { x: 'auto', y: 'auto' },
        key: totalData,
        rowKey: 'key',
        bordered: true,
        columns: [
            {
                title: '主应用表名',
                dataIndex: 'mainBizTable',
                fixed: 'left',
                render: (text, record, index) => {
                    const obj = {
                        children: 
                        <Select
                        defaultValue={text?text:undefined} 
                        onFocus={getmainField.bind(this, 'main')}
                        onChange={updateTableData.bind(this, record.key, 'mainBizTable')}
                        mode="tags"
                        style={{
                          width: '200px',
                        }}
                        options={mainAndSub}
                        maxTagCount={1}
                      />,
                        props: {},
                    }
                    return obj;
                }
            },
            {
                title: '主应用字段',
                dataIndex: 'mainBizField',
                width:200,
                render: (text, record, index) => {
                    const obj = {
                        children: 
                        // <Select style={{ width: 200 }} value={text} onSelect={updateTableData.bind(this, record.key, 'mainBizField')} onFocus={getmainField.bind(this, 'main')}>
                        //     {
                        //         mainList.map((item, index) => {
                        //             return <Option value={item.tableColumn} key={index}>{item.tableColumn}</Option>
                        //         })
                        //     }

                        // </Select>,
                        <Select
                        defaultValue={text?text:undefined} 
                        onChange={updateTableData.bind(this, record.key, 'mainBizField')} 
                        onFocus={getmainField.bind(this, 'main')}
                        mode="tags"
                        style={{
                          width: '200px',
                        }}
                        options={configData.bizSolId?mainList:[]}
                      />,
                        props: {},
                    }
                    return obj;
                }
            },
            {
                title: '主关联表名',
                dataIndex: 'mainRelationTable',
                render: (text, record, index) => {
                    // const options = [];
                    //     for (let i = 0; i < relationName?.MAIN?.split(',').length; i++) {
                    //         const item=relationName?.MAIN?.split(',')[i]
                    //     options.push({
                    //         value:item,
                    //         label:item,
                    //         code:'MAIN'
                    //     });
                    //     }
                    //     for (let i = 0; i < relationName?.SUB?.split(',').length; i++) {
                    //         const val=relationName?.SUB?.split(',')[i]
                    //         if(val){
                    //             options.push({
                    //             value:val,
                    //             label:val,
                    //             code:'SUB'
                    //          });
                    //         }
                            
                    //         }
                    const obj = {
                        children: 
                        <Select
                        defaultValue={text ? text : undefined} 
                        onChange={updateTableData.bind(this, record.key, 'mainRelationTable')}
                        onFocus={()=>{getmainField('relation',record)}}
                        onClick={()=>{getRelationName(record)}}
                        mode="tags"
                        style={{
                          width: '200px',
                        }}
                        options={relationArray}
                      />,
                        props: {},
                    }
                    return obj;
                }
            },
            {
                title: '主关联字段',
                dataIndex: 'mainRelationField',
                width:200,
                render: (text, record, index) => {
                    const obj = {
                        children: 
                        // <Select style={{ width: 200 }} mode="multiple"
                        //     defaultValue={text ? text.split(',') : undefined} onChange={updateTableData.bind(this, record.key, 'mainRelationField')}
                        //     onFocus={()=>{getmainField( 'relation',record)}}>
                        //     {
                        //         mainList.map((item, index) => {
                        //             return <Option value={item.tableColumn} key={index}>{item.tableColumn}</Option>
                        //         })
                        //     }

                        // </Select>,
                        <Select
                        defaultValue={text ? text.split(',') : undefined} 
                        onChange={updateTableData.bind(this, record.key, 'mainRelationField')}
                        onFocus={()=>{getmainField( 'relation',record,'mainRelationField')}}
                        mode="tags"
                        style={{
                          width: '200px',
                        }}
                        options={mainList}
                      />,
                        props: {},
                    }
                    return obj;
                }
            },
            {
                title: '关联关系',
                dataIndex: 'incidenceRelation',
                render: (text, record, index) => {
                    const obj = {
                        children: <Select style={{ width: 100 }}  defaultValue={text} onChange={updateTableData.bind(this, record.key, 'incidenceRelation')}>
                            {
                                relationData.map((item, index) => {
                                    return <Option value={Number(item.dictInfoCode)} key={index}>{item.dictInfoName}</Option>
                                })
                            }
                        </Select>,
                        props: {},
                    }
                    return obj;
                }
            },
            {
                title: '属性',
                dataIndex: 'bizAttribute',
                render: (text, record, index) => {
                    const obj = {
                        children: <Select style={{ width: 100 }}  defaultValue={text} onChange={updateTableData.bind(this, record.key, 'bizAttribute')}>

                            {
                                attributeData.map((item, index) => {
                                    return <Option value={Number(item.dictInfoCode)} key={index}>{item.dictInfoName}</Option>
                                })
                            }
                        </Select>,
                        props: {},
                    }
                    return obj;
                }

            },
            {
                title: '业务注入',
                dataIndex: 'bizInject',
                render: (text, record) => <Input.TextArea style={{ width: 100 }} autoSize defaultValue={text && text} onChange={changeValue.bind(this, record)} />
            },
            {
                title: '业务标签',
                dataIndex: 'bizLabel',
                render: (text, record, index) => {
                    const obj = {
                        children: 
                        // <Select style={{ width: 100 }}  mode='multiple' defaultValue={text ? text.split(',') : undefined} onChange={updateTableData.bind(this, record.key, 'bizLabel')}>
                        //     {
                        //         labelData.map((item, index) => {
                        //             return <Option value={item.dictInfoCode} key={index}>{item.dictInfoName}</Option>
                        //         })
                        //     }
                        // </Select>,
                        <TreeSelect
                        showSearch
                        style={{
                          width: '200px',
                        }}
                        defaultValue={text ? text.split(',') : undefined}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: 'auto',
                        }}
                        allowClear
                        multiple
                        // treeDefaultExpandAll
                        onChange={updateTableData.bind(this, record.key, 'bizLabel')}
                        treeData={labelData}
                      />,
                        props: {},
                    }
                    return obj;
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right',
                render: (value, row, index) => {
                    const obj = {
                        children: <div style={{ width: 42 }}>
                            <a onClick={onAddGroup.bind(this, row.groupName, row.groupName, row.conditionNum + 1, index + 1, false)}>增加行</a><br />
                            <a onClick={onDeleteLine.bind(this, row.key, row.conditionNum, row.groupName, row.isRowCol)}>删除行</a>
                        </div>,
                        props: {},
                    };
                    return obj;


                }
            },

        ],
        // dataSource: tableData,
        pagination: false,
        rowSelection: {
            columnWidth: 90,
            renderCell: (value, row, index, originNode) => {

                const obj = {
                    children: <div>
                        {originNode}
                        <a onClick={onAddGroup.bind(this, Number(totalData[(totalData.length - 1)].tableData[0].groupName) + 1, groupNum + 1, 1, totalData.length, true)}>增加组</a><br />
                        <a onClick={onDeleteGroup.bind(this, row.groupName)} style={{ display: 'block', width: 80, height: 30, textAlign: 'center' }}>删除组</a>
                    </div>,
                    props: {},
                };
                if (row.isRowCol) {
                    obj.props.rowSpan = row.conditionNum;
                } else {
                    obj.props.rowSpan = 0;
                }

                if (row.groupCondition) {
                    obj.props.colSpan = 0
                }
                return obj;
            },


        },
    }
    const getRelationList = (type, id,options) => {
        console.log(options,'optionslk');
        dispatch({
            type: 'applyCorrelation/getFormMenu',
            payload: {
                bizSolId: options.relationBizSolId,
                type
            }
        })
    }
    var random = function () { // 生成10-12位不等的字符串
        return Math.random().toString(36).slice(2); // 截取小数点后的字符串
    }
    const updateApplyRelation = (name, code) => {
        console.log(code,'id==');
        const res = relationLogicList.filter(item => item.logicCode == code)
        console.log(res,'reslkj');
        totalData.forEach((item, index) => {
            item.tableData.forEach((val, ind) => {
                if (val.groupName == name) {
                    item.relationBizSolId = res[0]?.bizSolId
                    item.relationBizSolName = res[0]?.bizSolName 
                    item.relationLogicCode=res[0]?.logicCode
                    item.relationLogicName=res[0]?.logicName
                    
                    val.relationBizSolId = res[0]?.bizSolId
                    val.relationBizSolName = res[0]?.bizSolName 
                    val.relationLogicCode=res[0]?.logicCode
                    val.relationLogicName=res[0]?.logicName
                    // item.tableData= [
                    //   {  key:random(),
                    //     groupName:val.groupName,
                    //     mainBizTable: '',
                    //     mainBizField: '',
                    //     bizTableScope:'',
                    //     mainRelationTable: '',
                    //     mainRelationField: '',
                    //     relationTableScope:'',
                    //     incidenceRelation: '',
                    //     bizAttribute: '',
                    //     bizInject: '',
                    //     bizLabel: '',
                    //     conditionNum: 1,
                    //     isRowCol: true,

                    // }
                    // ]
                }
            })
        })
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                totalData,
            }
        })
    }
    return (
        <div>
            {totalData.map((item, index) => {
                return <>
                    <Form initialValues={{ relationLogicName: item.relationLogicName }}>
                        <Row>
                            <Col span={7}>
                                <Form.Item label='关联应用' name='relationBizSolName'>
                                    <Select defaultValue={item.relationLogicName} onChange={getRelationList.bind(this, 'relation')} onSelect={updateApplyRelation.bind(this, item.tableData[0].groupName)} key={index} >
                                        {
                                            relationLogicList&&relationLogicList.map((item, index) => {
                                                return <Option value={item.logicCode} key={item.logicCode} relationBizSolId={item.bizSolId}><span>{item.logicName}</span></Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                    <Table {...tableProps} dataSource={item.tableData} style={{ marginBottom: 10 }} />
                </>
            })}

        </div>

    )
}
export default connect(({ applyCorrelation }) => ({ applyCorrelation }))(configTable)
