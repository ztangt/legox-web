import React, { useState, useMemo, useEffect } from 'react';
import { connect } from 'umi';
import { Table, Modal, Button } from 'antd';
import { dataFormat } from '../../util/util.js'
import IPagination from '../../componments/public/iPagination'
import {BASE_WIDTH,ORDER_WIDTH} from '../../util/constant'

function RuleListModal({ dispatch, role, layoutG, loading, getDataRule, dataRuleCode,pathname,container }) {

    const { searchObj } = role;
    const { isShowRuleModal, dataRuleSource,checkDataRuleInfo,definedReturnCount,definedCurrentpage,limit } = searchObj[pathname];
    const [selectedDataRule, setSelectedDataRule] = useState({});
    console.log('dataRuleCode=',dataRuleCode);
    console.log('dataRuleSource=',dataRuleSource);
    const tableProps = {
        rowKey: 'dataRuleCode',
        columns: [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width:ORDER_WIDTH,
                render: (text, record, index) => <div>{ index + 1}</div>
            },
            {
                title: '数据规则名称',
                dataIndex: 'dataRuleName',
                width:BASE_WIDTH,
                sorter: (a, b) => a.dataRuleName.length - b.dataRuleName.length,
            },
            {
                title: '数据规则简称',
                dataIndex: 'dataRuleShort',
                width:BASE_WIDTH,
                sorter: (a, b) => a.dataRuleShort.length - b.dataRuleShort.length,
            },
            {
                title: '数据规则编码',
                dataIndex: 'dataRuleCode',
                width:BASE_WIDTH,
                sorter: (a, b) => Number(a.dataRuleCode) - Number(b.dataRuleCode),
            },
            {
                title: '数据规则类型',
                width:BASE_WIDTH,
                dataIndex: 'dataRuleType',
                render:(text)=>{
                    return text=='PUBLIC'?<span>公共规则</span>:<span>模块资源规则</span>
                }
            },
            {
                title: '数据规则描述',
                dataIndex: 'dataRuleDesc',
                width:BASE_WIDTH,
            },
            {
                title: '创建日期',
                width:BASE_WIDTH,
                dataIndex: 'createTime',
                render: text => { return dataFormat(text, 'YYYY-MM-DD') }
            }
        ],
        dataSource: dataRuleSource,
        pagination: false,
        loading: loading.global,
        rowSelection: {
            type: 'radio',
            defaultSelectedRowKeys:Object.keys(checkDataRuleInfo).length?[checkDataRuleInfo.dataRuleCode]:[],
            onSelect: (info) => {
              setSelectedDataRule(info)
            },
        },
    }

    const cancelHandle = () => {
        dispatch({
            type: 'role/updateStates',
            payload: {
                isShowRuleModal: false
            }
        })
    }
    const okHandle = () => {
        dispatch({
            type: 'role/updateStates',
            payload: {
                isShowRuleModal: false
            }
        })
        if(selectedDataRule.dataRuleName){
            dispatch({
                type: 'role/updateStates',
                payload: {
                    isRule: false
                }
            })
        }
        getDataRule(selectedDataRule)
    }
     //分页
     const changePage=(nextPage,size)=>{
        dispatch({
            type: 'role/updateStates',
            payload: {
                limit: size
            }
        })
        dispatch({
            type: 'role/getDataRules',
            payload: {
                start: nextPage,
                limit: size
            }
        })
      }

    return (
        <Modal
            width={'95%'}
            visible={isShowRuleModal}
            title={"自定义规则"}
            maskClosable={false}
            mask={false}
            onCancel={cancelHandle}
            centered
            bodyStyle={{paddingBottom:0,height:'calc(100vh - 284px)'}}
            getContainer={() =>{
                return document.getElementById(container?container:`${pathname.split("/")[1]}_container`)||false
            }}
            footer={[
                <Button key="cancel" onClick={cancelHandle}>
                    取消
              </Button>,
                <Button key="save" type="primary" onClick={okHandle}>
                    确定
                </Button>,
            ]}
        >
            <div style={{position:'relative',height:'100%'}}>
                <div style={{height:'90%'}}>
                <Table {...tableProps} scroll={{y:'calc(100% - 55px)'}} />
                </div>
                <IPagination
                  total={definedReturnCount}
                  current={definedCurrentpage}
                  pageSize={limit}
                  onChange={changePage.bind(this)}
                  style={{height:'10%'}}
                />
            </div>
        </Modal>
    )
}

export default connect(({ role, loading, layoutG }) => ({
    role,
    loading,
    layoutG
}))(RuleListModal);
