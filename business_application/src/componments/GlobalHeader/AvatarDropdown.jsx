import { LogoutOutlined, TableOutlined, UserOutlined,ForkOutlined,InfoCircleOutlined, DesktopOutlined,FormOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin,Switch } from 'antd';
import React from 'react';
import { history, connect,useSelector } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import About from './About';
import Portal from './Portal';
import { v4 as uuidv4 } from 'uuid';
import ModifyPwd from '../modifyPwd';
import head_img from '../../../public/assets/user_header.jpg'
@connect(({user})=>({
  user,
}))
class AvatarDropdown extends React.Component {
  state = {
    visible: false,
    dropVisible: false,
    portalVisible: false,
    mVisible:false,
  }

  onMenuClick = (event) => {
    const { key } = event;
    if (key === 'logout') {
      const { dispatch } = this.props;
        dispatch({
          type: 'user/logout',
        });
      return;
    }
    if (key === 'about') {
      const { dispatch } = this.props;
        this.setState({visible: true});
      return;
    }
    if (key === 'portal') {
        this.setState({ portalVisible: true });
      return;
    }
    if (key === 'password') {
      this.setState({ mVisible: true });
    return;
    }
    if (key === 'personInfo') {
    
    if(window.location.href.includes('portal')&&history.location.pathname!='/business_application'){
      history.push({
      pathname: `/personInfo?sys=portal&portalTitle=个人信息`,
      })
    }else{
      historyPush({
        pathname: '/personInfo',
        query:{
          title:'个人信息',
        }
      })
    }
    
    return;
  }
  };

  handleVisibleChange(visible) {
    this.setState({ dropVisible: visible });
  }

  onChangeData = (checked,e) =>{
    const { dispatch } = this.props
    dispatch({
      type: 'user/mergeData',
      payload:{
        isMergeTodo: checked?1:0
      }
    })
    window.localStorage.setItem('isMergeTodo',checked?1:0)
  }

  onShowDesktop = () =>{
    const { dispatch } = this.props;
    if(window.location.href.includes('portal')&&history.location.pathname!='/business_application'){
      history.push({
        pathname: `/portalDesigner?sys=portal&portalTitle=桌面布局`,
      })
    }else{
      dispatch({
        type: 'desktopLayout/updateStates',
        payload: {
          refreshTag: uuidv4(),
        },
      });
      historyPush({
        pathname: '/desktopLayout',
        query: {
          title: '桌面布局'
        }
      });
      
    }
    // href='#/business_application/desktopLayout'
  }
  onLoginOut = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'user/logout',
    });
  }
  setMVisible=()=>{
    // this.setMVisible(val)
    this.setState({ mVisible: false });
  }

  render() {
    const { user, onChangeLayout } = this.props
    const { curUserInfo } = user
    const { visible, dropVisible, portalVisible,userName, userAccount } = this.state
    const personConfig = JSON.parse(window.localStorage.getItem("personConfig"));
    const id = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).id : '';
    const desktopType = localStorage.getItem(`desktopType${id}`) || 0;
    const tableConfig = JSON.parse(localStorage.getItem('tableConfig'));

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="personInfo">
          <a>
          <UserOutlined />
          个人信息
          </a>
        </Menu.Item>
        {
            (desktopType == 0 && tableConfig && tableConfig.TABLE_PERSON.substr(0, 1)) || (!tableConfig && desktopType == 0) ?
            <Menu.Item key="desktopLayout">
              <a onClick={this.onShowDesktop}>
              <DesktopOutlined />
              桌面布局
              </a>
            </Menu.Item>
            : null
        }
        {
          window.location.href.includes('portal')?'':
          <>
          {
            (tableConfig && (tableConfig.TABLE_PERSON.substr(0, 1) || tableConfig.TABLE_FAST.substr(0, 1) || tableConfig.TABLE_MIX.substr(0, 1)  || tableConfig?.TABLE_CUSTOM?.substr(0, 1)))  || !tableConfig ?
            <Menu.Item key="portal">
              <a>
              <TableOutlined />
              主题门户
              </a>
            </Menu.Item>
            : null
          }
          <Menu.Item key="merge" onChange={this.onChangeData}>
            <a>
            <ForkOutlined />
            待办数据合并
            </a>
            <Switch style={{marginLeft:'5px'}} size={'small'} onChange={this.onChangeData} checked={window.localStorage.getItem('isMergeTodo')==1}/>
          </Menu.Item>
        </>
        }

        {personConfig&&personConfig.PERSONENUM__ABOUTUS==1&&<Menu.Item key="about">
          <a>
          <InfoCircleOutlined />
          关于我们
          </a>
        </Menu.Item>}
        <Menu.Item key="password">
          <FormOutlined />
          修改密码
        </Menu.Item>
        {/* <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item> */}
      </Menu>
    );
    const menuHeaderLogout = (
      <Menu className={styles.menu}  onClick={this.onLoginOut}>
        <Menu.Item>
          退出登录
        </Menu.Item>
      </Menu>
    );
    const imgUrl = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).picturePath;
    const returnPostName = () =>{
      if(window.location.href.includes('portal')){
        if(curUserInfo?.postName&&
          curUserInfo?.postName!=null&&
          curUserInfo?.postName!='null'){
          return `(${curUserInfo?.postName})`
        }
        var userInfo = window.localStorage.getItem("userInfo")
        if(userInfo&&
           JSON.parse(userInfo).postName&&
           JSON.parse(userInfo).postName!=null&&
           JSON.parse(userInfo).postName!='null'){
          return `(${JSON.parse(userInfo).postName})`
        }
      }
      
    }

    const returnUserName = () =>{
      if(curUserInfo?.userName&&
        curUserInfo?.userName!=null&&
        curUserInfo?.userName!='null'){
        return curUserInfo?.userName
      }
      var userName = window.localStorage.getItem("userName")
      if(userName&&
        userName&&
        userName!=null&&
        userName!='null'){
        return userName
      }
      var userAccount = window.localStorage.getItem("userAccount")
      if(userAccount&&
        userAccount&&
        userAccount!=null&&
        userAccount!='null'){
        return userAccount
      }
    }

    return (
      <>
      <div id="dropDown">
        <HeaderDropdown
            overlay={menuHeaderDropdown}
            visible={dropVisible}
            onVisibleChange={this.handleVisibleChange.bind(this)}
            getPopupContainer={()=>document.getElementById('right_header')}
          >
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={imgUrl || head_img} alt="avatar" />
              <span className={`${styles.name} anticon`}>
                {returnUserName()}
                {returnPostName()}
              </span>
            </span>
          </HeaderDropdown>
          {visible&&<About desktopType={desktopType} onCancel={()=>{this.setState({visible: false})}} onOK={()=>{this.setState({visible: false})}}/>}
          {portalVisible&&<Portal desktopType={desktopType} onChangeLayout={onChangeLayout} onCancel={()=>{this.setState({portalVisible: false});this.setState({dropVisible: false});}}/>}
      </div>
        {/* <HeaderDropdown overlay={menuHeaderLogout}> */}
          <div onClick={this.onLoginOut} style={{cursor:'pointer',height: '100%'}}>
            <LogoutOutlined style={{lineHeight:'62px',marginLeft: '24px'}}/>
          </div>
        {/* </HeaderDropdown> */}
        <ModifyPwd mVisible={this.state.mVisible} type="drop" closable={true} setMVisible={this.setMVisible} />
      </>
    );
  }
}

export default AvatarDropdown;
