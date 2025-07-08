import React, { useState } from 'react';
import { Input,Modal,Table,Button} from 'antd';
import styles from './index.less'
import IPagination from "../../componments/public/iPagination";
import {useDispatch} from 'umi'

function buttonMoudle({onSearch,namespace,stateInfo,containerId,dataName}){
  const { buttonGroups,buttonGroupId,buttonGroupName,listMoudleInfo,currentPage,returnCount } = stateInfo
  const dispatch = useDispatch();
  const [val, setVal] = useState('');
  function onCancel(){
      dispatch({
          type: `${namespace}/updateStates`,
          payload: {
              buttonModal: false
          }
      })
  }
  function onSave() {
      dispatch({
        type: `${namespace}/getButtonIds`,
        payload:{
          buttonGroupId:buttonGroupId,
        }
      })
      dispatch({
          type: `${namespace}/updateStates`,
          payload: {
              [dataName]: {
                  ...stateInfo[dataName],
                  buttonGroupId: buttonGroupId,
                  buttonGroupName: buttonGroupName || listMoudleInfo?.buttonGroupName
              },
              buttonModal: false
          }
      })
  }
  const tableProps = {
      rowKey: 'groupId',
      columns: [
        {
          title: '按钮方案名称',
          dataIndex: 'groupName',
          render: text=><div className={styles.text} title={text}>{text}</div>
        },
        {
          title: '方案编码',
          dataIndex: 'groupCode',
          render: text=><div className={styles.text} title={text}>{text}</div>
        },
        {
          title: '方案描述',
          dataIndex: 'groupDesc',
          render: text=><div className={styles.text} title={text}>{text}</div>
        },
      ],
      dataSource: buttonGroups,
      pagination: false,
      // pagination: {
      //   total: returnCount,
      //   showTotal: (total)=>{return `共 ${total} 条` },
      //   pageSize: 5,
      //   current: currentPage,
      //   onChange: (page,size)=>{
      //     dispatch({
      //       type: `${namespace}/updateStates`,
      //       payload: {
      //         currentPage: page
      //       }
      //     })
      //     dispatch({
      //       type: `${namespace}/getButtonGroups`,
      //       payload: {
      //         searchValue: val,
      //         start: page,
      //         limit: 5,
      //         groupType: 'TABLE',
      //       }
      //     })
      //   }
      // },
      rowSelection: {
        type: 'radio',
        selectedRowKeys: [buttonGroupId],
        onChange: (selectedRowKeys, selectedRows) => {
          dispatch({
            type: `${namespace}/updateStates`,
            payload: {
              buttonGroupId: selectedRowKeys.toString(),
              buttonGroupName: selectedRows[0].groupName,
            }
          })
        },
      },
  }
  function changePage(page, size) {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        currentPage: page
      }
    })
    dispatch({
      type: `${namespace}/getButtonGroups`,
      payload: {
        searchValue: val,
        start: page,
        limit: 5,
        groupType: 'TABLE',
      }
    })
  }
  function handlechange(e) {
    setVal(e.target.value)
  }
  return(
      <Modal
          visible={true}
          width={800}
          title={'选择按钮模板'}
          onCancel={onCancel}
          maskClosable={false}
          mask={false}
          centered
          bodyStyle={{height:'420px',padding:'0px'}}
          getContainer={() =>{
            return document.getElementById(containerId)||false
          }}
          footer={[
            <Button type="primary" onClick={onCancel}>取消</Button>,
            <Button onClick={onSave.bind(this)}>保存</Button>,
            ]}
      >
          <Input.Search
              className={styles.search}
              placeholder={'请输入搜索词'}
              allowClear
              onSearch={onSearch}
              onChange={handlechange.bind(this)}
          />
          <div>
            <Table {...tableProps}/>
            <IPagination
              current={currentPage}
              total={returnCount}
              showSizeChanger={false}
              showQuickJumper={false}
              bottom={50}
              pageSize={5}
              onChange={changePage}
              />
          </div>
      </Modal>
  )
}

export default buttonMoudle
