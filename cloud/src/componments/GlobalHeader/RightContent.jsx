import { Tooltip, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { connect, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight = (props) => {
  let className = styles.right;
  return (
    <div className={className}>
      <Avatar />
    </div>
  );
};

export default GlobalHeaderRight;
