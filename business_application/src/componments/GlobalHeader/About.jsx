import { connect } from 'dva';
import React, { useState } from 'react';
import { Input, Modal, Table } from 'antd';
import styles from './index.less';
import GlobalModal from '../../componments/GlobalModal';
import qr_code from '../../../public/assets/qr_code.jpg'
import {Button} from '@/componments/TLAntd';
function Index({ dispatch, onCancel,onOK,desktopType }) {
 
  return (
    <GlobalModal
      visible={true}
      widthType={1}
      modalType={desktopType==1?"fast":"layout"}
      title={'关于我们'}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById('dom_container') || false;
      }}
      footer={[
        <Button onClick={onCancel}>取消</Button>, <Button onClick={onOK}>确定</Button>,
      ]}
    >
      <div className={styles.about}>
        <h1>业务应用平台</h1>
        <ul>
          <li>
            <b>版本号:</b>
            <span>7.0.1</span>
          </li>
          <li>
            <b>版本ID:</b>
            <span>正式版</span>
          </li>
          <li>
            <b>有效期:</b>
            <span>永久</span>
          </li>
          <li>
            <b>联系我们:</b>
            <span>邮箱 itonglian@suirui.com 固话 010-68499240</span>
          </li>
        </ul>
        <div className={styles.attention}>
          <img src={qr_code} />
          关注我们
        </div>
      </div>
    </GlobalModal>
  );
}
export default Index;
