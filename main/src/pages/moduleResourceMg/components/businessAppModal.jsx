import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { Button, Tree, Table, message } from 'antd'
import GlobalModal from '../../../componments/GlobalModal';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import { ORDER_WIDTH, BASE_WIDTH } from '../../../util/constant'
import IPagination from '../../../componments/public/iPagination'
import ColumnDragTable from '../../../componments/columnDragTable'
function BusinessAppModal({ moduleResourceMg, dispatch, selectModuleCallBack }) {
    const { bussTreeData, bussMenuList, bussReturnCount, bussCurrentPage, bussLimit, moduleRows } = moduleResourceMg
    const [registerId, setRegisterId] = useState('')
    const MENUTYPE = {
        'APP': "业务应用建模",
    }
    const ISDATARULETYPE = {
        '0': "否",
        '1': "是",
    }
    useEffect(() => {
        dispatch({
            type: 'moduleResourceMg/getRegister',
            payload: {
                searchWord: '',
                limit: 100,
                start: 1,
                registerFlag: 'PLATFORM_BUSS'
            },
        })
    }, [])
    const onBusinessCancel = () => {
        dispatch({
            type: 'moduleResourceMg/updateStates',
            payload: {
                isShowBusiness: false,
                bussMenuList: [],
                bussCurrentPage: 1,
                bussReturnCount: 0,
            }
        })
    }
    const getMenuList = (registerId, currentPage, limit) => {
        dispatch({
            type: 'moduleResourceMg/getBussMenuList',
            payload: {
                registerId,
                searchWord: '',
                start: currentPage,
                limit,
            }
        })
    }
    const selectSystem = (selectedKeys, info) => {
        console.log(selectedKeys, 'selectedKeys');
        if (selectedKeys.length) {
            getMenuList(selectedKeys, 1, 10)
            setRegisterId(selectedKeys)
        }

    }
    const changePage = (nextPage, size) => {
        dispatch({
            type: "openSystem/updateStates",
            payload: {
                limit: size
            }
        })
        getMenuList(registerId, nextPage, size)
    }
    const onOK = () => {
        if (moduleRows.length <= 0) {
            return message.error('请选择模块')
        } else {
            selectModuleCallBack(moduleRows)
            dispatch({
                type: 'moduleResourceMg/updateStates',
                payload: {
                    ctlgId: moduleRows[0].ctlgId
                }
            })
        }

        onBusinessCancel()
    }
    const tableProps = {
        scroll: { y: 'calc(100% - 100px)' },
        rowKey: 'id',
        columns: [
            {
                title: '序号',
                render: (text, record, index) => <span>{index + 1}</span>,
                width: ORDER_WIDTH
            },
            {
                title: '模块资源显示名称',
                dataIndex: 'menuName',
                width: BASE_WIDTH * 1.5,
            },
            {
                title: '能力名称',
                dataIndex: 'sourceName',
                width: BASE_WIDTH,
            },
            {
                title: '模块来源',
                dataIndex: 'menuSource',
                width: BASE_WIDTH,
                render: (text, record) => {
                    return <div>
                        <span>{MENUTYPE[text]}</span>
                    </div>
                }
            },
            {
                title: '模块链接',
                dataIndex: 'menuLink',
                width: BASE_WIDTH * 1.5,
            },
            {
                title: '启用',
                dataIndex: 'isEnable',
                width: ORDER_WIDTH,
                render: (text, record) => {
                    return <div>
                        <span>{text == '1' ? '是' : '否'}</span>
                    </div>
                }
            },
            {
                title: '数据授权',
                dataIndex: 'isDatarule',
                width: 80,
                render: (text, record) => {
                    return <div>
                        <span>{ISDATARULETYPE[text]}</span>
                    </div>
                }
            },
        ],
        dataSource: bussMenuList,
        pagination: false,
        rowSelection: {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys, selectedRows, 'selectedRowKeys, selectedRows');
                dispatch({
                    type: 'moduleResourceMg/updateStates',
                    payload: {
                        moduleRows: selectedRows
                    }
                })
            },
        }
    }
    return (
        <div>
            <GlobalModal
                visible={true}
                widthType={2}
                incomingWidth={850}
                title='选择模块'
                onCancel={onBusinessCancel}
                mask={false}
                centered
                bodyStyle={{ overflow: 'hidden', padding: '0' }}
                maskClosable={false}
                getContainer={() => {
                    return document.getElementById('moduleResourceMg_container') || false
                }}
                footer={[
                    <Button key="cancel" onClick={onBusinessCancel}>取消</Button>,
                    <Button type="primary" key="submit" onClick={onOK}>确定</Button>
                ]}
            >
                <ReSizeLeftRight
                    suffix='platformCodeRules'
                    vNum={190}
                    vLeftNumLimit={150}
                    height={"inherit"}
                    leftChildren={
                        <Tree
                            style={{ paddingTop: 8 }}
                            treeData={bussTreeData}
                            onSelect={selectSystem.bind(this)}
                            selectedKeys={registerId}
                        />
                    }
                    rightChildren={
                        <div style={{ paddingTop: 8, height: '100%' }}>
                            <ColumnDragTable  {...tableProps} />
                            <IPagination current={bussCurrentPage} total={bussReturnCount} onChange={changePage} pageSize={bussLimit} />
                        </div>
                    }
                />
            </GlobalModal>
        </div>
    )
}
export default connect((moduleResourceMg,) => (moduleResourceMg))(BusinessAppModal)
