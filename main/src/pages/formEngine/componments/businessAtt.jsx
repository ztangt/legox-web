import { connect } from 'dva';
import { Modal, Table, Space,Switch} from 'antd';
import _ from "lodash";
import { history } from 'umi';
import { useEffect} from 'react'
import { dataFormat } from '../../../util/util';
import ColumnDragTable from '../../../componments/columnDragTable'
function  FormTable({dispatch,loading,formEngine,deployFormId}) {

  useEffect(()=>{
    getBussinessFormList()
  },[])
  function getBussinessFormList(){
    dispatch({
      type: 'formEngine/getBussinessFormList',
      payload: {
        deployFormId,
      }
    })
  }

  function onCancel(){
    dispatch({
      type: 'formEngine/updateStates',
      payload: {
        fbVisible: false
      }
    })
  }

        const {  businessFormList} = formEngine
        const tableProps = {
            rowKey: 'deployFormId',
            loading: loading.effects['formEngine/getBussinessFormList'],
            columns: [
              {
                title: '序号',
                dataIndex: 'key',
                render: (text,record,index)=>index+1
              },
              {
                title: '业务应用类别',
                dataIndex: 'ctlgName',
              },
              {
                title: '业务应用名称	',
                dataIndex: 'bizSolName',
              },
              {
                title: '是否有流程	',
                dataIndex: 'bpmFlag',
                render: (text,record)=>text?'是':'否'

              },
              {
                title: '创建时间',
                dataIndex: 'createTime',
                render: (text,record)=>dataFormat(text,'YYYY-MM-DD')
              },

            ],
            dataSource: businessFormList,
            pagination: false,
            scroll: businessFormList&&businessFormList?.length ? { y: `calc(100% - 52px)` } : {},
            }
        return (
            <Modal
                visible={true}
                footer={false}
                width={800}
                title={'业务应用关联情况'}
                onCancel={onCancel}
                maskClosable={false}
                mask={false}
                getContainer={() =>{
                  return document.getElementById(`${history.location.pathname.split("/")[2]}_container`)||false
              }}
              className='modal_table'
            >
                <ColumnDragTable {...tableProps} />

            </Modal>
        )
    }





export default (connect(({loading,formEngine})=>({
    formEngine,
    loading
  }))(FormTable));
