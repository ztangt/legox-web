import { connect } from 'dva';
import React, { useState,useRef,useEffect } from 'react';
import {Button,message,Spin} from 'antd';
import styles from './selectBizsol.less';
import { history } from 'umi';
import ITree from '../../../componments/public/iTree';
import IPagination from '../../../componments/public/iPagination';
import {dataFormat} from '../../../util/util';
import GlobalModal from '../../../componments/GlobalModal';
import Table from '../../../componments/columnDragTable';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
function addForm ({dispatch,loading,addObj,onBizsolCancel,ctlgTree,limit,start,businessList,returnCount,currentPage,selectBusiness,selectBusinessRows,selectBizsolCallBack,moudleCurrentPage,ctlgId}){
    const [selectCtlgId, setSelectCtlgId] = useState([]);
    const [selectedRow,setSelectedRows] = useState([])
useEffect(()=>{
  if(addObj.id){
      dispatch({
          type: 'moduleResourceMg/updateStates',
          payload: {
            selectBusiness: [addObj.sourceId],
            ctlgId:addObj.ctlgId
          }
      })
      getBusinessList(addObj.ctlgId,'',start,limit)
  }else if(ctlgId){
    getBusinessList(ctlgId,'',start,limit)
  }

},[])
    useEffect(() => {
      setSelectedRows(selectBusinessRows)
    }, [ctlgId]);
    function selectCtlgFn(key,e){
        // setSelectCtlgId(key)
        dispatch({
          type:'moduleResourceMg/updateStates',
          payload:{
            ctlgId: key[0]
          }
      })
        getBusinessList(key[0],'',start,limit)
    }
    function getBusinessList(ctlgId,searchWord,start,limit){
        dispatch({
            type:'moduleResourceMg/getBusinessList',
            payload:{
              ctlgId,
              searchWord,
              start,
              limit
            }
        })
    }
    const tableProps = {
        rowKey: 'bizSolId',
        size:'small',
        scroll: { y: `calc(100% - 40px)` },
        columns: [
            {
              title:'序号',
              render:(text,record,index)=><span>{index+1}</span>,
              width:60
            },
            {
              title: '名称',
              dataIndex: 'bizSolName',
              key: 'bizSolName',
            },
            {
              title: '标识',
              dataIndex: 'bizSolCode',
              key: 'bizSolCode',
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
              key: 'createTime',
              render:(text)=><div>{dataFormat(text,'YYYY-MM-DD')}</div>
            }
          ],
        dataSource: businessList,
        pagination:false,
        rowSelection: {
          type:'radio',
          selectedRowKeys: selectBusiness,
          onChange: (selectedRowKeys, selectedRows) => {
            console.log('selectedRowKeys',selectedRowKeys);
            dispatch({
              type: 'moduleResourceMg/updateStates',
              payload: {
                selectBusiness: selectedRowKeys,
                selectBusinessRows: selectedRows,
              }
            })
            setSelectedRows(selectedRows)
            // selectBizsolCallBack(selectedRows)
          },
        },
    }
    const clickRow=(record)=>{
      return {
        onClick:()=>{
          dispatch({
            type: 'moduleResourceMg/updateStates',
            payload: {
              selectBusiness: [record.bizSolId],
              selectBusinessRows: [record],
            }
          })
          setSelectedRows([record])
        }
      }
    }
    function onConfirm(){
      if(!selectBusiness){
        message.error('请选择应用模型')
        return
      }
      if(selectedRow==0){
        const newData=[{
          bizSolId:addObj.bizSolId,
          bizSolName:addObj.menuName
        }]
        selectBizsolCallBack(newData)
      }else{
        selectBizsolCallBack(selectedRow)
      }

      dispatch({
        type: 'moduleResourceMg/updateStates',
        payload:{
          selectBizsolModal:false

        }
      })
    }
    const changePage = (page, size) => {
      dispatch({
        type: 'moduleResourceMg/updateStates',
        payload:{
          moudleCurrentPage: page,
          limit: size
        }
      })
      getBusinessList(ctlgId,'',page,size)
  }

        return (
          <GlobalModal
            visible={true}
            widthType={2}
            incomingWidth={850}
            title='选择应用模型'
            onCancel={onBizsolCancel}
            className={styles.select_biz_sol}
            mask={false}
            centered
            bodyStyle={{overflow: 'hidden',padding:'0'}}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('moduleResourceMg_container')||false
            }}
            footer={[
                <Button key="cancel" onClick={onBizsolCancel}>取消</Button>,
                <Button type="primary" key="submit" onClick={onConfirm}>确定</Button>
            ]}
          >
            <ReSizeLeftRight
              paddingNum={0}
              height={"inherit"}
              vRigthNumLimit={560}
              suffix={"moduleResourceMg_select_bizSol"}
              leftChildren={
                <>
                <p className={styles.left_title}>业务应用类别</p>
                <ITree
                  treeData={ctlgTree}
                  onSelect={selectCtlgFn}
                  selectedKeys={ctlgId}
                  isSearch={false}
                  defaultExpandAll={true}
                  style={{height:'calc(100% - 33px)',paddingBottom:"8px"}}
                />
                </>
              }
              rightChildren={
                <>
                  <p className={styles.right_title}>应用模型</p>
                    <div style={{height:'calc(100% - 85px)'}}>
                      <Table {...tableProps} key={loading.global} onRow={clickRow}/>
                    </div>
                    <IPagination
                      current={Number(moudleCurrentPage)}
                      pageSize={limit}
                      onChange={changePage.bind(this)}
                      total={Number(returnCount)}
                      style={{height:'52px'}}
                    />
                </>
              }
            />
          </GlobalModal>
        )

  }



export default (connect(({moduleResourceMg,layoutG,loading})=>({
    ...moduleResourceMg,
    ...layoutG,
    loading
  }))(addForm));
