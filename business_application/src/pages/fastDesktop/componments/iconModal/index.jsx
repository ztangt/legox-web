/**
 * @author zhangww
 * @description 选择图标modal
 */
import { connect } from 'dva';
import styles from '../fastDesktop.less';
import iconData from '../../../../../public/icon_manage/iconfont.json';
import IconFont from '../../../../Icon_manage';
import _ from "lodash";
import { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';

function Index({ dispatch, fastDesktop }) {

const { isIconModalVisible } = fastDesktop;

function onHideModal() {
  dispatch({
    type: 'fastDesktop/updateStates',
    payload:{
      isIconModalVisible: false
    }
  })
}

function onIconClick(val) {
  console.log(val);
  dispatch({
    type: 'fastDesktop/updateStates',
    payload:{
      pageIcon: val,
      isIconModalVisible: false,
    }
  })
}

  return (
  <Modal 
    width={'80%'}
    title="选择图标" 
    visible={isIconModalVisible} 
    footer={[
      <Button key="back" onClick={onHideModal}>
        关闭
      </Button>
    ]}
    mask={false}
    getContainer={() =>{
      return document.getElementById('fastDesktop_id');
    }}
  >
    <ul className={styles.flex_wrap}>
      {iconData.glyphs.map((item, index)=> {
        return (
          <li key={index} onClick={()=>onIconClick(item.font_class)}>
            <IconFont type={`icon-${item.font_class}`}/>
            <p>{item.font_class}</p>
          </li>
        )
      })}
    </ul>
  </Modal>
  );
}

export default connect(({
  fastDesktop,
}) => ({
  fastDesktop,
}))(Index);