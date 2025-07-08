import { Tooltip, Tag, Badge, Dropdown, Input } from 'antd';
import {
  QuestionCircleOutlined,
  AppstoreOutlined,
  AuditOutlined,
  CommentOutlined,
  MailOutlined,
  SearchOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { connect, SelectLang, useDispatch, useSelector, history } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import ChangeIden from './ChangeIden';
import IM from './IM';
import Menus from '../ShortcutModal';
import { UserSwitchOutlined } from '@ant-design/icons';
import { createSocket } from '../../util/websocket';
import notification from '../../../public/assets/notification.svg'
import common_app from '../../../public/assets/common_app.svg'
import console_switch from '../../../public/assets/console_switch.svg'
import todolist from '../../../public/assets/todolist.svg'
import search from '../../../public/assets/search.svg'
const ct = window.localStorage.getItem('clientType');
const rt = window.localStorage.getItem('refreshToken');
const personConfig = JSON.parse(window.localStorage.getItem('personConfig'));
const abilityCodes = JSON.parse(window.localStorage.getItem('abilityCodes'));
const id = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo')).id
  : '';
const desktopType = localStorage.getItem(`desktopType${id}`) || 0;

function GlobalHeaderRight({ onChangeLayout, onSetMixLayout }) {
  for (const key in abilityCodes) {
    if (Object.hasOwnProperty.call(abilityCodes, key)) {
      const element = abilityCodes[key];
    }
  }
  const dispatch = useDispatch();
  const { clientType, refreshToken, idenVisible, isShowIM, messageList } = useSelector(
    ({ user }) => ({ ...user }),
  );
  const { isRefreshWorkList,requestTime } = useSelector(
    ({ columnWorkList }) => ({ ...columnWorkList }),
  );
  const ctype = clientType ? clientType : ct;
  const [visible, setVisible] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const getWorkList=()=>{
    dispatch({
      type: 'columnWorkList/getTodoWork',
      payload: {
        workRuleId:'',
        start: 1,
        limit: 20,
      },
    });
  }
  const startInterval = () => {
    clearInterval(intervalId); // 清除之前的定时器
    const newIntervalId = setInterval(() => {
      getWorkList();
    }, requestTime); // 30分钟
    setIntervalId(newIntervalId);
  };
  useEffect(() => {
    createSocket(dispatch);
    getMessageList();
   const timerId = setInterval(() => {
      getWorkList();
    }, requestTime); // 30分钟
    setIntervalId(timerId)
    return ()=>{
      clearInterval(timerId)
    }
  }, []);
  // useEffect(() => {
  //   if(isRefreshWorkList){
  //     clearInterval(intervalId);
  //     getWorkList()
  //     startInterval();
  //     dispatch({
  //       type:'columnWorkList/updateStates',
  //       payload:{
  //         isRefreshWorkList:false,
  //       }
  //     })
  //   }
  // }, [isRefreshWorkList]);
  // useEffect(() => {
  //   return () => clearInterval(intervalId); // 在组件卸载时清除定时器
  // }, [intervalId]);
  
  const getMessageList = () => {
    dispatch({
      type: 'user/getMessageList',
      payload: {
        searchWord: '',
        category: '',
        start: 1,
        limit: 100,
      },
    });
  };
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };
  function switchPlatform() {
    dispatch({
      type: 'user/login',
      payload: {
        clientType: 'PC',
        fromState: 'FRONT',
        toState: 'PC',
        grantType: 'refresh_token',
        // refreshToken: refreshToken ? refreshToken : rt,
        refreshToken: localStorage.getItem('refreshToken'),
        identityId: localStorage.getItem('identityId')
          ? localStorage.getItem('identityId')
          : '',
      },
      isChangeIdentity: false
    });
  }
  const toFront = () => {
    if (desktopType == 1) {
      onSetMixLayout();
      setTimeout(() => {
        switchPlatform();
      }, 1000);
    } else {
      switchPlatform();
    }
  };
  const onChangeIden = () => {
    if (localStorage.getItem('leavePost')) {
      localStorage.removeItem('leavePost');
    }
    dispatch({
      type: 'user/getUserDentityList',
      payload: {},
    });
  };
  const onSearchInput = () => {
    setIsShowSearch(true);
  };
  const searchValue = async(value) => {
    // dispatch({
    //   type: 'allWork/updateStates',
    //   payload: {
    //     searchWord: value,
    //   },
    // });
    // dispatch({
    //   type: 'allWork/getAllWork',
    //   payload: {
    //     searchWord: value,
    //     start: 1,
    //     limit: 10,
    //     paramsJson: [],
    //     workRuleId: '',
    //   },
    //   callback: () => {
    //     setIsShowSearch(false);
    //   },
    // });
    await historyPush({pathname:'/allWork',query:{searchValue:value}});
    setIsShowSearch(false);
  };

  function onShowIMClick() {
    // historyPush({pathname:'/IM'});
    dispatch({
      type: 'user/updateStates',
      payload: {
        isShowIM: true,
      },
    });
    // dispatch({
    //   type: 'user/getSocketTest',
    //   payload: {
    //     userId: '1562366370493100033'
    //   }
    // });
  }

  return (
    <div className={styles.right} id='right_header'>
      {/* <SearchOutlined style={{ lineHeight: '63px', marginRight: 24 }} /> */}
      {
        window.location.href.includes('portal')?'':
        <>
          {JSON.parse(window.localStorage.getItem('abilityCodes')) && JSON.parse(window.localStorage.getItem('abilityCodes'))['SEARC'] == 1 && (
            <a
              title={isShowSearch ? '请输入标题/拟稿人/拟稿人部门' : '搜索'}
              onClick={onSearchInput}
            >
              {isShowSearch ? (
                <Input.Search
                  className={styles.searchInput}
                  onSearch={searchValue}
                  style={{ height: 32, width: 230, padding: 0, marginRight: 24 }}
                  placeholder="请输入标题/拟稿人/拟稿人部门"
                  enterButton={
                    <img
                      src={search}
                      style={{ marginRight: 8, marginTop: -3, marginLeft: 2 }}
                    />
                  }
                />
              ) : (
                <img
                  src={search}
                  style={{ marginRight: 24 }}
                />
              )}
            </a>
          )}
          {/* {abilityCodes && abilityCodes['YUBAB'] == 1 && <a href='#/business_application' title={'云吧'}><CommentOutlined style={{ lineHeight: '60px', marginRight: 24 }} /></a>}
          {abilityCodes && abilityCodes['YUOUB'] == 1 && <a href='#/business_application' title={'云邮'}><MailOutlined style={{ lineHeight: '60px', marginRight: 24 }} /></a>} */}
          {abilityCodes && abilityCodes['YUBAB'] == 1 &&  <a onClick={() =>onShowIMClick()} title={'即时通讯'}><CommentOutlined style={{ fontSize: '20px', margin: '22px 22px 0 0' }} /></a>}
          {JSON.parse(window.localStorage.getItem('abilityCodes')) && JSON.parse(window.localStorage.getItem('abilityCodes'))['AGNEW'] == 1 && (
            <a onClick={()=>{historyPush({pathname:'/waitMatter'})}} title={'待办事项'}>
              {' '}
              <span>
                {' '}
                <Badge
                  count={
                    localStorage.getItem('waitData') &&
                    localStorage.getItem('waitData') != 'undefined'
                      ? JSON.parse(localStorage.getItem('waitData'))
                      : []
                  }
                  offset={[-20, -3]}
                  size="small"
                >
                  <img
                    src={todolist}
                    style={{ marginRight: 24, width: 19 }}
                  />
                </Badge>
              </span>
            </a>
          )}
          {JSON.parse(window.localStorage.getItem('abilityCodes')) && JSON.parse(window.localStorage.getItem('abilityCodes'))['NOTIC'] == 1 && (
            <a onClick={()=>{historyPush({pathname:'/notificationList'})}} title={'通知公告'}>
              <img
                src={notification}
                style={{ marginRight: 24 }}
              />
            </a>
          )}
          {JSON.parse(window.localStorage.getItem('personConfig')) && JSON.parse(window.localStorage.getItem('personConfig')).PERSONENUM__COMMONAPP == 1 && (
            <Dropdown
              overlay={<Menus setVisible={setVisible} />}
              onVisibleChange={handleVisibleChange}
              visible={visible}
              className={styles.shortCut_icon}
            >
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
                title="快捷应用"
              >
                <img
                  src={common_app}
                  style={{ marginRight: 24, width: 16, height: 16, marginTop: -3 }}
                />
              </a>
            </Dropdown>
          )}
        </>
      }
      {window.localStorage.getItem('clientType') && window.localStorage.getItem('clientType').includes('PC') ? (
          <span
            className={`${styles.to_front} anticon`}
            onClick={toFront.bind(this)}
          >
            支撑平台
          </span>
        ) : (
          ''
        )}
      <span style={{ lineHeight: '60px' }} onClick={onChangeIden.bind(this)}>
        <img
          src={console_switch}
          style={{ marginRight: 24 ,cursor:'pointer'}}
        />
      </span>
      <span className={styles.longString}>|</span>
      <Avatar onChangeLayout={onChangeLayout} dispatch={dispatch} />
      {idenVisible && <ChangeIden />}
      {isShowIM && <IM />}
    </div>
  );
}

export default GlobalHeaderRight;
