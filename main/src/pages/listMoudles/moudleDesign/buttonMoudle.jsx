import { connect } from 'dva';
import React, { useState } from 'react';
import { Input,Modal,Table,Button} from 'antd';
import styles from './index.less'
import {useLocation,history} from 'umi'
import { parse } from 'query-string';
function buttonMoudle({dispatch,onSearch,buttonGroups,buttonGroupId,buttonGroupName,listMoudleInfo}){
  const location  = useLocation();
  const query = parse(history.location.search);
  const namespace = `moudleDesign_${query.moudleId}`;

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
                listMoudleInfo: {
                    ...listMoudleInfo,
                    buttonGroupId: buttonGroupId,
                    buttonGroupName: buttonGroupName
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
    return(
        <Modal
            visible={true}
            footer={false}
            width={'95%'}
            title={'选择按钮模板'}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() =>{
              return document.getElementById(`moudleDesign_container_${query.moudleId}`)||false
            }}
        >
            <Input.Search
                className={styles.search}
                placeholder={'请输入搜索词'}
                allowClear
                onSearch={onSearch}
            />
            <Table {...tableProps}/>
            <div className={styles.bt_group}  >
                <Button  type="primary" onClick={onSave.bind(this)}>
                    保存
                </Button>
                <Button onClick={onCancel} style={{marginLeft: 8}}>
                    取消
                </Button>
            </div>
        </Modal>
    )
}
// export default connect(({moudleDesign})=>({
//     ...moudleDesign
// }))(buttonMoudle);
export default connect((state)=>({
        ...state[`moudleDesign_${query.moudleId}`],

}))(buttonMoudle);
