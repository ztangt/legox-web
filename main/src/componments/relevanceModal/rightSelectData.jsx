/**
 * 关联用户的右侧部分
 */
import React, { useState,useEffect,useCallback } from 'react';
import { Tag, Button } from 'antd';
import styles from './relevanceModal.less';
import { BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import Table from '../columnDragTable';
import { history } from 'umi'
function RightUserAccredit({
  idKey,
  nameKey,
  columns,
  closeTag,
  selectedDatas,
}) {
  const [selectListType, setSelectListType] = useState('list');
  const pathname=history.location.pathname
  const moudleName=pathname.split('/')[2]
  const [visibleItems, setVisibleItems] = useState(50);
  console.log('selectedDatas=', selectedDatas);
  useEffect(()=>{
    const container = document.getElementById(`${moudleName}_rightContent`);
    // 当列表容器滚动到底部时加载更多数据
    const handleScroll = (e) => {
      const scrollTop=e.target.scrollTop
      const scrollHeight=e.target.scrollHeight
      if (Math.ceil(scrollTop + container.clientHeight)>= scrollHeight) {
        loadMore();
      }
      if(scrollTop == 0){
        setVisibleItems(50)
      }
    };
    container.addEventListener('scroll', handleScroll,true);
    return () => {
      container.removeEventListener('scroll', handleScroll,false);
    };
  },[])
  const loadMore=useCallback(()=>{
    setVisibleItems((prevVisibleItems)=>{
      return prevVisibleItems+50
    })
  },[])
  //右侧卡片的切换显示
  const changeListLayout = type => {
    setSelectListType(type);
  };
  return (
    <div className={styles.select_list}>
      <span className={styles.title}>已选择</span>
      <div className={styles.list}>
        <div className={styles.opration}>
          <BarsOutlined
            onClick={changeListLayout.bind(this, 'list')}
            style={selectListType == 'list' ? { color: 'var(--ant-primary-color)' } : {}}
          />
          <AppstoreOutlined
            onClick={changeListLayout.bind(this, 'card')}
            style={selectListType == 'card' ? { color: 'var(--ant-primary-color)' } : {}}
          />
          <Button onClick={closeTag.bind(this, 'clearAll', '')}>清空</Button>
        </div>
        <div className={styles.content} id={`${moudleName}_rightContent`}>
          {selectListType == 'card' ? (
            <>
              {selectedDatas.map((item, index) => {
                return (
                  <Tag
                    closable
                    className={styles.tag_info}
                    key={index}
                    onClose={closeTag.bind(
                      this,
                      item[idKey] ? item[idKey] : item.identityId,
                      idKey,
                    )}
                  >
                    {item[nameKey]}
                  </Tag>
                );
              })}
            </>
          ) : (
            <Table
              dataSource={selectedDatas.slice(0,visibleItems)}
              columns={columns}
              pagination={false}
              rowKey={idKey}
              scroll={{ y: 'calc(100% - 40px)' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default RightUserAccredit;
