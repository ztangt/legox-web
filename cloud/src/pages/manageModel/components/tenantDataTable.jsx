import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { Table, Select, Popover } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import AddTableSource from './addTableSource';
import styles from '../index.less'
function TenantDataTable({ dispatch, manageModel }) {
    const { tenantDetailList, selectedRows } = manageModel
    const [isShowSource, setIsShowSource] = useState(false)
    const [sourceItem, setSourceItem] = useState({})
    const [currentIndex, setCurrentIndex] = useState(null)
    useEffect(() => {
        // dispatch({
        //     type: 'manageModel/getSolmodelTableData',
        //     payload: {
        //         filePath: selectedRows[0].filePath
        //     }
        // })
        // const res = tenantDetailList.map((item) => ({ tenantId: item.id, dsDynamic: item.dsDynamic }))
        // dispatch({
        //     type: 'manageModel/getTenantDatasource',
        //     payload: {
        //         tenantJson: JSON.stringify(res)
        //     }
        // })
    }, [])
    const tableProps = {
        scroll:{x:1300},
        pagination: false
    }
    const selectTableSource = (record, index, value, option) => {
        dispatch({
            type: 'manageModel/validatorDatasource',
            payload: {
                sourceTableCode: record.tableCode,
                mergeTableId: option.value,
                filePath: selectedRows[0].filePath
            },
            callback: (data) => {
                const updatedData = tenantDetailList.map(item => {
                    if (item.id === option.tenantId) {
                        const updatedChildren = item.children.map((child, ind) => {
                            if (index === ind) {
                                return { ...child, tableFlag: data.flag, infos: data.flag == 'N' ? data.infos : null,tableSourceId:option.key,tableCode_detail:option.tableCode,tableName_detail:option.tableName };
                            }
                            return child;
                        });
                        const differentItems = item.newtableDatasource.filter(item1 => !updatedChildren.some(item2 => item2.tableSourceId=== item1.id));
                        return { ...item, children: updatedChildren,tableDatasource:[...differentItems] };
                    }
                    return item;
                });
                dispatch({
                    type: 'manageModel/updateStates',
                    payload: {
                        tenantDetailList: [...updatedData],
                    }
                })
            }
        })
    }
    const addTableSource = (item,index) => {
        setIsShowSource(true)
        setSourceItem(item)
        setCurrentIndex(index)
    }
    const onCancel = () => {
        setIsShowSource(false)
    }

    //展开收起
    const packUp = (id, identification) => {
        tenantDetailList.forEach(item => {
            if (item.id == id) {
                item.isExpand = identification
            }
        })
        dispatch({
            type: 'manageModel/updateStates',
            payload: {
                tenantDetailList,
            }
        })
    }
    const popoverContent = (record) => (
        record.infos?.map(item => {
            return <p>{item}</p>
        })
    )
    return (
        <div>
            {tenantDetailList && tenantDetailList.map((item) => {
                return <div>
                    <p  style={{ cursor: 'pointer' }}>{item.tenantName} ({item.dsName})  <span onClick={packUp.bind(this, item.id, 1)} className={item.isExpand==0?styles.expand_color:''} disabled={item.isExpand==1}>展开</span> | <span disabled={item.isExpand==1} className={item.isExpand==1?styles.expand_color:''} onClick={packUp.bind(this, item.id, 0)}>收起</span></p>
                    {item.children && item.children.length && item.isExpand == 1 && <Table
                        columns={[
                            {
                                title: '序号',
                                render: (text, record, index) => <span>{index + 1}</span>,
                                width:60
                            },
                            {
                                title: '应用数据表名称',
                                dataIndex: 'tableName',
                                ellipsis:true
                            },
                            {
                                title: '应用数据表编码',
                                dataIndex: 'tableCode'
                            },
                            {
                                title: '下发数据表情况',
                                dataIndex: 'tableName_detail',
                                width:220,
                                render: (text, record, index) => <div style={{display:'inline-block'}}><Select showSearch style={{ width: 160 }} value={text?text:''} onChange={selectTableSource.bind(this, record, index)}
                                filterOption={(input, option) =>
                                    (option?.tableName ?? '').toLowerCase().includes(input.toLowerCase())
                                  }
                                >
                                    {
                                        item.tableDatasource?.map((val => {
                                            return <Option value={val.id} key={val.id} tenantId={val.tenantId} tableCode={val.tableCode} tableName={val.tableName}>{val.tableName}</Option>
                                        }))
                                    }
                                </Select><span style={{ marginLeft: '8px', cursor: 'pointer' }} onClick={() => { addTableSource(item,index) }}><PlusOutlined /></span></div>
                            },
                            {
                                title: '已存在表字段差异情况',
                                dataIndex: 'tableFlag',
                                render: (text, record) => <span className={text && text == 'Y' ? styles.sucess : styles.lose}>
                                    {text == 'Y' ? '通过' :
                                        <Popover
                                            placement="right" content={popoverContent.bind(this, record)} >
                                            {text == 'N' ? '有差异' : ''}
                                        </Popover>
                                    }


                                </span>
                            }
                        ]}
                        {...tableProps} dataSource={item.children} />}
                </div>
            })}
            {isShowSource && <AddTableSource onCancel={onCancel} sourceItem={sourceItem} selectTableSource={selectTableSource} currentIndex={currentIndex}/>}
        </div>
    )
}
export default connect(({ manageModel }) => ({ manageModel }))(TenantDataTable)
