import { connect } from 'dva';
import { Modal, Input,Button,Checkbox,Space,Table} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import {PlusCircleOutlined,DeleteOutlined,FormOutlined,FileSearchOutlined,parentStrCtlgId } from '@ant-design/icons';




function addBusinessUseSort ({dispatch,onCancel,onPermissionSubmit,loading,businessDatas}){
    console.log('businessDatas',businessDatas)
    const tableProps = {
        //rowKey: 'ugId',
        columns: [
          {
            title: '分类名称',
            dataIndex: 'nodeName',
            ellipsis: true,
            width:'25%',
          },
          {
            title: '创建人',
            dataIndex: 'createUserName',
            width:'10%',
          },
          {
            title: '权限单位',
            dataIndex: 'orgNames',
            // ellipsis: true,
            width:'45%',
          },
          {
            title: '权限详情',
            width:'20%',
            dataIndex: 'operation',
            render: (text,record)=>{return <div>
                <Space>
                  <a style={{color:'#666'}}><PlusCircleOutlined /></a>
                  <a style={{color:'#666'}}><DeleteOutlined /></a>
                  <a style={{color:'#666'}}><FormOutlined /></a>
                  <a style={{color:'#666'}}><FileSearchOutlined /></a>
                </Space>
            </div>}
          },
        ],
        dataSource: businessDatas,
        pagination:false,
        rowSelection:{
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
          onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
          }
        },
        loading: loading.global,
    }
    return (
        <Modal
            visible={true}
            footer={false}
            width={900}
            title={'授权设置'}
            onCancel={onCancel}
            className={styles.add_form}
            mask={false}
            maskClosable={false}
            centered
            getContainer={() =>{
                return document.getElementById('dom_container')||false
            }}
        >
            <div style={{height: '460px',overflow: 'auto'}}>
                <Table {...tableProps}/>
            </div>
            <div style={{width:'150px',margin:'10px auto'}}>
                <Space>
                    <Button  type="primary" htmlType="submit" onClick={onPermissionSubmit}>
                        保存
                    </Button>
                    <Button onClick={onCancel}>
                        取消
                    </Button>
                </Space>
            </div>

    </Modal>
    )
}



export default (connect(({loading,businessUseSort})=>({
    loading,
    ...businessUseSort
  }))(addBusinessUseSort));
