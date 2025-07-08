/*
 * @Author: gaohy gaohy@suirui.com
 * @Date: 2022-04-28 17:41:06
 * @LastEditors: gaohy gaohy@suirui.com
 * @LastEditTime: 2022-06-22 17:28:47
 * @FilePath: \WPX\business_application\src\componments\relevanceModal\rightSelectData.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 关联用户的右侧部分
 */
import React, { useState } from 'react';
import { Tag } from 'antd';
import Table from '../columnDragTable/index';
import styles from './relevanceModal.less';
import { BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import {Button} from '@/componments/TLAntd';
function RightUserAccredit({
  idKey,
  nameKey,
  columns,
  closeTag,
  selectedDatas,
  isShowTitle,
}) {
  const [selectListType, setSelectListType] = useState('list');
  console.log('columns===', columns);
  //右侧卡片的切换显示
  const changeListLayout = (type) => {
    setSelectListType(type);
  };
  return (
    <div className={styles.select_list}>
      {isShowTitle && <span className={styles.title}>已选择</span>}
      <div
        className={styles.list}
        style={isShowTitle ? { height: 'calc(100% - 31px)' } : {}}
      >
        <div className={styles.opration}>
          <BarsOutlined
            onClick={changeListLayout.bind(this, 'list')}
            style={selectListType == 'list' ? { color: 'var(--ant-primary-color)' } : {}}
          />
          <AppstoreOutlined
            onClick={changeListLayout.bind(this, 'card')}
            style={selectListType == 'card' ? { color: 'var(--ant-primary-color)' } : {}}
          />
          <Button style={{width:48}} onClick={closeTag.bind(this, '', '')}>清空</Button>
        </div>
        <div className={styles.content}>
          <div
            style={
              selectListType == 'list'
                ? { display: 'none' }
                : { display: 'block' }
            }
            className={styles.card}
          >
            {(selectedDatas || []).map((item, index) => {
              return (
                <Tag
                  closable
                  className={styles.tag_info}
                  key={index}
                  onClose={closeTag.bind(this, item[idKey], idKey)}
                >
                  {item[nameKey]}
                </Tag>
              );
            })}
          </div>
          <Table
            dataSource={selectedDatas}
            columns={columns}
            pagination={false}
            rowKey={idKey}
            style={
              selectListType == 'card'
                ? { display: 'none' }
                : { display: 'block' }
            }
            scroll={{ y: 'calc(100% - 41px)', x: 'max-content' }}
          />
        </div>
      </div>
    </div>
  );
}
RightUserAccredit.defaultProps = {
  isShowTitle: true,
};
export default RightUserAccredit;
