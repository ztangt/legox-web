/**
 * 关联用户的右侧部分
 */
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import { Button, Tag } from 'antd'
import { useState } from 'react'
import Table from '../columnDragTable'
import styles from './relevanceModal.less'
function RightSelectData({ idKey, nameKey, columns, closeTag, selectedDatas }) {
  const [selectListType, setSelectListType] = useState('list')
  console.log('selectedDatas=', selectedDatas)
  //右侧卡片的切换显示
  const changeListLayout = (type) => {
    setSelectListType(type)
  }
  return (
    <div className={styles.select_list}>
      <span className={styles.title}>已选择</span>
      <div className={styles.list}>
        <div className={styles.opration}>
          <BarsOutlined
            onClick={changeListLayout.bind(this, 'list')}
            style={
              selectListType == 'list'
                ? { color: 'var(--ant-primary-color)' }
                : {}
            }
          />
          <AppstoreOutlined
            onClick={changeListLayout.bind(this, 'card')}
            style={
              selectListType == 'card'
                ? { color: 'var(--ant-primary-color)' }
                : {}
            }
          />
          <Button onClick={closeTag.bind(this, '', '')}>清空</Button>
        </div>
        <div className={styles.content}>
          {selectListType == 'card' ? (
            <>
              {selectedDatas.map((item, index) => {
                return (
                  <Tag
                    closable
                    className={styles.tag_info}
                    key={index}
                    onClose={closeTag.bind(this, item[idKey], idKey)}
                  >
                    {item[nameKey]}
                  </Tag>
                )
              })}
            </>
          ) : (
            <Table
              dataSource={selectedDatas}
              columns={columns}
              pagination={false}
              rowKey={idKey}
              scroll={{ y: 'calc(100% - 40px)', x: 'max-content' }}
              taskType={'MONITOR'}
              expandable={{ showExpandColumn: false }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default RightSelectData
