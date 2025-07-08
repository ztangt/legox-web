import { connect } from 'dva';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import GlobalModal from '../GlobalModal';
import styles from './index.less';
import {Button} from '@/componments/TLAntd';

function Index({ dispatch, user, onCancel, onChangeLayout,desktopType }) {
  const { portalArr } = user;  
  const tableConfig = JSON.parse(localStorage.getItem('tableConfig'));
  const id = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')).id
    : '';

  const [currentPath, setCurrentPath] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setPortalArr();
  }, []);

  function setPortalArr() {
    const tmp = [
      {
        name: '个人桌面',
        src: 'geren',
        path: '/',
        active: false,
        show: tableConfig && tableConfig.TABLE_PERSON.substr(0, 1),
      },
      {
        name: '快捷桌面',
        src: 'kj',
        path: '/fastDesktop',
        active: false,
        show: tableConfig && tableConfig.TABLE_FAST.substr(0, 1),
      },
      {
        name: '融合桌面',
        src: 'rh',
        path: '/fusionDesktop',
        active: false,
        show: tableConfig && tableConfig.TABLE_MIX.substr(0, 1),
      },
      {
        name: '自定义桌面',
        src: 'geren',
        path: '/customPage',
        active: false,
        show: tableConfig && tableConfig?.TABLE_CUSTOM?.substr(0, 1),
      },
    ];
    const index = localStorage.getItem(`desktopType${id}`) || 0;

    tmp[index].active = true;

    dispatch({
      type: 'user/updateStates',
      payload: {
        portalArr: tmp,
      },
    });
  }

  function setActive(i) {
    setCurrentIndex(i);
    const tmp = portalArr;
    tmp.forEach((element, index) => {
      if (index === i) {
        element.active = true;
        setCurrentPath(element.path);
      } else {
        element.active = false;
      }
    });
    dispatch({
      type: 'user/updateStates',
      payload: {
        portalArr: tmp,
      },
    });
  }
const baseLocal = (desktopType)=>{
  const local = localStorage.getItem('skinPeeler_business')
        ? JSON.parse(localStorage.getItem('skinPeeler_business'))
        : {
            fixSiderbar: true,
            fixedHeader: true,
            navTheme: 'light',
            primaryColor: '#1890ff',
            layout: 'mix',
            contentWidth: 'Fluid',
            splitMenus: false,
            menuHeaderRender: undefined,
            menu: {
              locale: true,
            },
            headerHeight: 48,
            title: '',
          }
          if(desktopType == 1){
            local.layout  = 'top'
          }
          if(desktopType == 0 || desktopType == 2){
            local.layout = 'mix'
          }
          
        localStorage.setItem('skinPeeler_business',JSON.stringify(local))
}
// 切换的时候设置默认导航类型
  function switchover() {
    const desktopType = currentIndex;
    if (desktopType == 1) {
      baseLocal(desktopType)
      let url = window.location.href;
      if (url.indexOf('layout=mix')) {
        location.href = url.replace('layout=mix', 'layout=top');
      }
    }
    if (desktopType == 0 || desktopType == 2) {
      baseLocal(desktopType)
      let url = window.location.href;
      if (url.indexOf('layout=top')) {
        location.href = url.replace('layout=top', 'layout=mix');
      }
    }

    if (currentIndex == 3 && currentPath) {
      historyPush({
        pathname: currentPath,
      });
      onCancel();
      return
    }
    dispatch({
      type: 'user/updateStates',
      payload: {
        desktopTypeByModel: currentIndex,
      },
    });
    localStorage.setItem(`desktopType${id}`, currentIndex);
    if (currentPath) {
      historyPush({
        pathname: currentPath,
      });
      UPDATETABS({
        tabMenus: [
          {
            key: currentPath,
            title: portalArr[currentIndex].name,
            href: currentPath,
          },
        ],
      });
      
      onChangeLayout(currentIndex);
      onCancel();
      // } else {
      //   historyPush(currentPath);
      // }
      // 切换主题需重新刷新产品已定
      window.location.reload();
    } else {
      onCancel();
    }
  }
  return (
    <GlobalModal
      visible={true}
      footer={[
        <div style={{ textAlign: 'center' }}>
          <Button onClick={switchover}>切换</Button>
        </div>,
      ]}
      widthType={6}
      modalType={desktopType==1?"fast":"layout"}
      title={'主题门户'}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      getContainer={() => {
        return document.getElementById('dom_container') || false;
      }}
    >
      <div className={styles.portal}>
        <ul>
          {portalArr.map((item, index) => {
            return item.show == 1 ? (
              <li key={index} onClick={() => setActive(index)}>
                <img
                  src={
                    item.active
                      ? require(`./images/${item.src}_sel.png`)
                      : require(`./images/${item.src}.png`)
                  }
                ></img>
                <p>{item.name}</p>
              </li>
            ) : null;
          })}
        </ul>
      </div>
    </GlobalModal>
  );
}
export default connect(({ user }) => ({
  user,
}))(Index);
