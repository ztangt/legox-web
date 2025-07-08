import {
  LogoutOutlined,
  UserOutlined,
  FormOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import ModifyPwd from '../modifyPwd';
import styles from './index.less';
class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;
    const { dispatch } = this.props;

    if (key === 'modify') {
      const { dispatch } = this.props;
      dispatch({
        type: 'user/updateStates',
        payload: {
          modalVisible: true,
        },
      });
      return;
    }
  };
  onLoginOut = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/logout',
    });
  };
  // onShowDesktop = () =>{
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'desktopLayout/updateStates',
  //     payload: {
  //       showDesktopTab: true
  //     }
  //   })
  //   historyPush('/desktopLayout');
  // }

  render() {
    const { identitys, modalVisible } = this.props.user;
    // console.log('modalVisible',modalVisible);
    const head_img = require('../../../public/assets/user_header.jpg');
    const menuHeaderDropdown = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={this.onMenuClick}
        triggerSubMenuAction={'click'}
      >
        {/* <Menu.Item key="desktopLayout">
          <a onClick={this.onShowDesktop}>
          <DesktopOutlined />
          桌面布局
          </a>
        </Menu.Item>  */}
        <Menu.Item key="modify">
          <FormOutlined />
          修改密码
        </Menu.Item>
      </Menu>
    );
    const menuHeaderLogout = (
      <Menu className={styles.menu} onClick={this.onLoginOut}>
        <Menu.Item>退出登录</Menu.Item>
      </Menu>
    );
    return (
      <>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar
              size="small"
              className={styles.avatar}
              src={head_img}
              alt="avatar"
            />
            <span className={`${styles.name} anticon`}>
              {window.localStorage.getItem('userName')
                ? window.localStorage.getItem('userName')
                : window.localStorage.getItem('userAccount')}
            </span>
            <ModifyPwd closable={true} />
          </span>
        </HeaderDropdown>
        {/* <HeaderDropdown overlay={menuHeaderLogout}> */}
          <div onClick={this.onLoginOut} style={{ cursor: 'pointer' }}>
            <LogoutOutlined />
          </div>
        {/* </HeaderDropdown> */}
      </>
    );
  }
}

export default connect(({ user }) => {
  return { user };
})(AvatarDropdown);
