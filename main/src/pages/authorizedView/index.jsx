import { connect } from 'dva';
import { Input,Button,message,Modal,Space,Menu, Dropdown,Table} from 'antd';
import styles from './index.less';
import { dataFormat } from '../../util/util.js';
import CTM from '../../componments/commonRegisterTree';
import { useState } from 'react';
import { history } from 'umi';
import {
  DownOutlined,
  FrownOutlined,
  SmileOutlined,
  MehOutlined,
  FrownFilled,
} from '@ant-design/icons';

function FormEngine ({dispatch,loading,addFormModal,addObj,searchObj,nodeObj,addModal,setModal,imageUrl,parentIds
}){
                    
  const pathname = '/authorizedView';
  const { key,title} = searchObj[pathname].currentNode       

                
  const tableProps = {
    rowKey: 'id',
    columns: [
      {
        title: '服务',
        dataIndex: 'sysMenuName'
      },
      {
        title: '能力组',
        dataIndex: 'menuName',
      },
      {
        title: '能力名称',
        dataIndex: 'menuSourceCode',
        render:(text,record) => {
          return <div>
            <span>{MENUTYPE[text]}</span>
        </div>
        }
      },
      {
        title: '能力编码',
        dataIndex: 'menuLink',
      },
      {
        title: '能力链接',
        dataIndex: 'createUserName',
      }
    ],
    dataSource: [],
    rowSelection:false,
    loading: loading.global,
    pagination:false
  }

  function getMenu(registerId,searchWord){
    // dispatch({
    //   type: 'authorizedView/getMenu',
    //   payload:{
    //     searchWord,
    //     registerId
    //   }
    // })
  }


 
  function onSearchTable(value){
    getMenu(key,value)  
    searchObj[pathname].searchWord = value
    dispatch({
      type: 'layoutG/updateStates',
      payload:{
        searchObj
      }
    })
  }
    return (
      <div style={{height:'100%',borderRadius:'4px'}}>

        <CTM 
            plst={'输入系统名称'}
            getData={(node)=>{
              searchObj[pathname].currentPage = 1
              dispatch({
                type: 'layoutG/updateStates',
                payload:{
                  searchObj
                }
              })
              getMenu(node.key,'')
            }}
          >
            <div className={styles.other}>
              <Input.Search
                className={styles.search}
                placeholder={'请输入模块名称'}
                allowClear
                onSearch={(value)=>{onSearchTable(value)}}
              />
                <Space>
                    <Button className={styles.fontSize7}>授权更新</Button>
                </Space>
            </div>
            <Table {...tableProps} key={loading}/>
        </CTM>

       
      
                       
      </div>
    )
  }
export default connect(({authorizedView,departmentTree,layoutG})=>({
  ...authorizedView,
  ...departmentTree,
  ...layoutG
}))(FormEngine);
