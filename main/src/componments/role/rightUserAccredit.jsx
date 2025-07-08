/**
 * 关联用户的右侧部分
 */
import React,{useState} from 'react';
import {Tag,Button,Table} from 'antd';
import styles from './userAccredit.less';
import { BarsOutlined,AppstoreOutlined} from '@ant-design/icons';
function RightUserAccredit({idKey,nameKey,columns,closeTag,selectedUsers}){
  const [selectListType,setSelectListType] = useState('list')
  console.log('selectedUsers=',selectedUsers);
  //右侧卡片的切换显示
  const changeListLayout=(type)=>{
    setSelectListType(type)
  }
  return (
    <div className={styles.select_list}>
      <span className={styles.title}>已选择</span>
      <div className={styles.list}>
        <div className={styles.opration}>
          <BarsOutlined
            onClick={changeListLayout.bind(this,'list')}
            style={selectListType=='list'?{'color':'#03A4FF'}:{}}
          />
          <AppstoreOutlined
            onClick={changeListLayout.bind(this,'card')}
            style={selectListType=='card'?{'color':'#03A4FF'}:{}}
          />
          <Button onClick={closeTag.bind(this,'')}>清空</Button>
        </div>
        <div className={styles.content}>
          {selectListType=='card'?
            <>
              {selectedUsers.map((item,index)=>{
                return (
                  <Tag closable className={styles.tag_info} key={index} onClose={closeTag.bind(this,item[idKey])}>{item[nameKey]}</Tag>
                )
              })}
            </>:
            <Table dataSource={selectedUsers} columns={columns} pagination={false} rowKey={idKey}/>
          }
        </div>
      </div>
    </div>
  )
}
export default RightUserAccredit;
