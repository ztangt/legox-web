/**
 * @author zhangww
 * @description 栏目-个人信息
 */

import React from 'react';
import styles from './index.less';
import head_img from '../../../../../public/assets/user_header.jpg'
import head_info from '../../../../../public/assets/user_header.jpg'
function Index() {
  const backgroundImage = {
    backgroundImage: `url(${head_info})`,
  };
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return (
    <div className={styles.user_title}>
      <p>{userInfo.userName}，欢迎登录本系统</p>
      <div className={styles.user_info}>
          <img src={userInfo.pictureUrl ? userInfo.pictureUrl : head_img}/>
          <ul>
            <li>账号：{userInfo.userAccount}</li>
            <li>部门：{userInfo.deptName}</li>
            <li>岗位：{userInfo.postName}</li>
          </ul>
      </div>
    </div>
  );
}

export default Index;