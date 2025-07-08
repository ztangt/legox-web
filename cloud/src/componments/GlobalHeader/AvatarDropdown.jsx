import { LogoutOutlined, FormOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import ModifyPwd from './modifyPwd';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  state={
    isShowUpdatePwdModal:false
  }
  onMenuClick = (event) => {
    const { key } = event;
    if (key === 'updatePwd') {
      this.setState({isShowUpdatePwdModal:true})
      return;
    }
  };
  onLoginOut=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'user/logout',
    });
  }
  render() {
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="updatePwd">
          <FormOutlined />
          修改密码
        </Menu.Item>
      </Menu>
    );
    const menuHeaderLogout = (
      <Menu className={styles.menu}  onClick={this.onLoginOut}>
        <Menu.Item>
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar size="small" className={styles.avatar} src={require('../../../public/assets/user_header.jpg')} alt="avatar" icon={<UserOutlined />}/>
            <span className={`${styles.name} anticon`}>{window.localStorage.getItem('userAccount_cloud')}</span>
          </span>
        </HeaderDropdown>
        <HeaderDropdown overlay={menuHeaderLogout}>
          <div onClick={this.onLoginOut} style={{cursor:'pointer'}}>
            <LogoutOutlined />
          </div>
        </HeaderDropdown>
        {this.state.isShowUpdatePwdModal&&<ModifyPwd onCancle={()=>{this.setState({isShowUpdatePwdModal:false})}}/>}
      </>
    );
  }
}

export default connect(({user})=>{return {user}})(AvatarDropdown);
