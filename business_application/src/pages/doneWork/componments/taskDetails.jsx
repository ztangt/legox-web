import React, { memo,useState,useCallback,useEffect } from 'react'
import { connect } from 'dva'
import { Modal, Button, message } from 'antd'
import { dataFormat } from '../../../util/util';
import { TASKSTATUS, BIZSTATUS, TODOBIZSTATUS } from '../../../service/constant.js';
import Table from '../../../componments/columnDragTable/index'

function TaskDetails({ dispatch, parentState,setParentState }) {
    const { selectedRowKeys, tableData,rowId,headerParams } = parentState
    const [height, setHeight] = useState(
      document.getElementById('modal_biz_sol_DONE').offsetHeight * 0.8 - 87
    )
    const onResize = useCallback(() => {
      setHeight(
        Number(
          document.getElementById('modal_biz_sol_DONE').offsetHeight * 0.8 - 87
        )
      )
    }, [])

    useEffect(() => {
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('resize', onResize)
      }
    }, [])
    const handleCancel = () => {
      setParentState({
        isShowDetail: false,
        selectedRowKeys:[],
        isConfirm:false
      })
    }
    const handleOk = () => {
        if(selectedRowKeys.length>0){
            const newList=[]
            selectedRowKeys.forEach((item,index)=>{
                newList.push(item.split('_')[1])
            })
            const newArr=Array.from(new Set(newList))//作为键值
            //勾选的数据
            const targetList=[]
            tableData.forEach(item=>{
                selectedRowKeys.forEach(val=>{
                    if(item.key==val){
                        targetList.push(item)
                    }
                })
            })
            //bizTaskId相同分为一组
            const list2=[]
            for(var i in targetList){
                const list3=[]
                for(var j in targetList){
                    if(targetList[i].bizTaskId==targetList[j].bizTaskId&&targetList[j].count!=1){
                        targetList[j].count=1
                        list3.push(targetList[j])
                    }
                }
                if(list3.length>0){
                    list2.push(list3)
                }
            }
            const obj={}
            newArr.forEach((item,index)=>{
                list2.forEach((val,ind)=>{
                    val.forEach((v,i)=>{
                        if(item==v.bizTaskId){
                            obj[item]=val.map(item=>item.id)
                        }
                    })
                })
            })
            dispatch({
                type:'doneWork/recoverTask',
                payload:{
                    bizInfoId:rowId,
                    recoverTask:JSON.stringify(obj)
                },
                headerParams:headerParams,
                callback:()=>{
                    setParentState({
                        isShowDetail: false,
                        selectedRowKeys:[],
                        isConfirm:false
                      })
                }
                // setState:setParentState,
                // state:parentState
            })

        }else{
            message.error('请选择要撤回的任务！')
        }
    }
    const getTotal = (list, key) => {
        let number = 0;
        let lastMenber = 0;
        list?.map((item, index) => {
            if (index !== 0 && index !== list.length - 1) {
                if (item[key] != list[index - 1][key]) {
                    if (number === 0) {
                        //total表示该数据占几行
                        list[0].total = index;
                        lastMenber = index;
                    } else {
                        list[lastMenber].total = index - lastMenber;
                        lastMenber = index;
                    }
                    number += 1;
                } else {
                    item.total = 0;
                }
            } else if (index === list.length - 1) {
                if (item[key] != list[index - 1][key]) {
                    list[lastMenber].total = list.length - 1 - lastMenber;
                    item.total = 1;
                    lastMenber = 0;
                    number += 1;
                } else {
                    list[lastMenber].total = list.length - lastMenber;
                    lastMenber = 0;
                }
            }
            //number表示序号
            item.number = number;
        });
        return list;
    };
    const tableProps = {
        rowKey: 'key',
        columns: [
            // {
            //     title: '序号',
            //     dataIndex: 'index',
            //     render: (text, record, index) => {
            //         return {
            //             children: index+1,
            //             props: {},
            //         };
            //     }
            // },
            {
                title: '环节名称',
                dataIndex: 'stepName',
                render: (text, record, index) => {
                    // return {
                    //     children: text,
                    //     props: {rowSpan:record.span},
                    // };
                    const obj = {
                        children: text,
                        props: {},
                    };
                    if (record.colSpan) {
                        obj.props.rowSpan = record.colSpan
                    } else {
                        obj.props.rowSpan = 0
                    }
                    return obj;
                }
            },
            {
                title: '当前环节名称',
                dataIndex: 'actName',
                render: text => <div>{text}</div>
            },
            {
                title: '办理环节',
                dataIndex: 'suserName',
                render: (text, record) => <div>{text}{'-->'}{record.ruserName}({record.makeAction=="CIRCULATE"?'传阅':record.makeAction=="SEND"?'送交':record.makeAction=='RETURN'?'转办':''})</div>
            },
            {
                title: '送达时间',
                dataIndex: 'startTime',
                render: text => <div>{dataFormat(text, 'YYYY-MM-DD HH:mm:ss')}</div>
            },
            {
                title: '办理状态',
                dataIndex: 'taskStatus',
                render: text => <div>{TODOBIZSTATUS[text]}</div>
            },
        ],
        dataSource: tableData,
        pagination: false,
        // dataSource: flowTasksLength > 1 ? getTotal(tableData, 'type') : tableData,
        rowSelection: {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys, 'selectedRowKeys');
                console.log(selectedRows, 'selectedRows');
                setParentState({
                  selectedRowKeys
                })
            },
        },
    }
    return (
        <div>
            <Modal
                width={'95%'}
                title={'撤回任务详情'}
                visible={true}
                onOk={handleOk}
                onCancel={handleCancel}
                mask={false}
                getContainer={() => {
                    return document.getElementById('modal_biz_sol_DONE')
                }}
                bodyStyle={{padding:'0px'}}
            >
                <Table {...tableProps} bordered />
            </Modal>
        </div>
    )
}
export default connect(({ doneWork }) => ({ doneWork }))(TaskDetails)

