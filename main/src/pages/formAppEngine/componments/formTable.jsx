import { connect } from 'dva';
import { Modal, Table, Space,Switch} from 'antd';
import _ from "lodash";
import { history } from 'umi';
import { useEffect} from 'react'
import { dataFormat } from '../../../util/util';
import IPagination from '../../../componments/public/iPagination';
import ColumnDragTable from '../../../componments/columnDragTable'
import './formEngine.less'
function  FormTable({dispatch,loading,formEngine,deployFormId,ftLimit}) {

  useEffect(()=>{
    getTableList(1,10)
  },[])
  function getTableList(start,size){
    dispatch({
      type: 'formAppEngine/getFormTableList',
      payload: {
        deployFormId,
        start,
        limit: size,
      }
    })
  }

  function onCancel(){
    dispatch({
      type: 'formAppEngine/updateStates',
      payload: {
        ftVisible: false
      }
    })
  }

        const {  ftReturnCount, formTableList, ftCurrentPage} = formEngine
        const tableProps = {
            rowKey: 'deployFormId',
            loading: loading.global,
            columns: [
              {
                title: '序号',
                dataIndex: 'key',
                render: (text,record,index)=>index+1,
                width: '60px',
                fixed: 'left',
              },
              {
                title: '数据源名称',
                dataIndex: 'tableName',
                render: (text,record)=>`业务${record.isSubform==0?'主表':'子表'}-${text}`
              },
              {
                title: '编码',
                dataIndex: 'tableCode',
              },
              {
                title: '创建人',
                dataIndex: 'createUserName',
              },
              {
                title: '创建时间',
                dataIndex: 'createTime',
                render: (text,record)=>dataFormat(text,'YYYY-MM-DD'),
                width: '120px',
              },

            ],
            dataSource: formTableList,
            pagination: false,
            scroll: formTableList.length ? { y: `calc(100% - 52px)` } : {},

        }
        const pageProps = {
          total: ftReturnCount,
          pageSize: ftLimit,
          current: ftCurrentPage,
          onChange: (page,size)=>{
            dispatch({
              type: 'formAppEngine/updateStates',
              payload: {
                ftCurrentPage: page,
                ftLimit: size,
              },
            });
            getTableList(page,size)
          },
          isRefresh: true,
          refreshDataFn: ()=>{
            getTableList(ftCurrentPage,ftLimit)
          },
          style:{
            position: 'unset'
          }
        }
        return (
            <Modal
                visible={true}
                footer={false}
                width={800}
                title={'数据源关联情况'}
                onCancel={onCancel}
                maskClosable={false}
                mask={false}
                centered
                getContainer={() =>{
                  return document.getElementById(`${history.location.pathname.split("/")[1]}_container`)||false
                }}
                className='modal_table'
            >
                <ColumnDragTable {...tableProps} />
                <IPagination {...pageProps}/>
            </Modal>
        )
    }





export default (connect(({loading,formAppEngine})=>({
    formAppEngine,
    loading
  }))(FormTable));
