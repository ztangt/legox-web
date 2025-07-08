import React, { useEffect, useState } from 'react';
import styles from './index.less';
import _ from 'lodash';
import { message } from 'antd';
import { history, useSelector } from 'umi';
import icon1 from '../../public/assets/backgroundImage/userInfoManagementIcon.svg'
import icon2 from '../../public/assets/backgroundImage/workflowEngineIcon.svg'
import icon3 from '../../public/assets/backgroundImage/unitRoleIcon.svg'
import icon4 from '../../public/assets/backgroundImage/formEngineIcon.svg'
import icon5 from '../../public/assets/backgroundImage/applyModelIcon.svg'
import icon6 from '../../public/assets/backgroundImage/onlineUserMonitoringIcon.svg'
import background_image1 from '../../public/assets/backgroundImage/userInfoManagementBg.svg'
import background_image2 from '../../public/assets/backgroundImage/workflowEngineBg.svg'
import background_image3 from '../../public/assets/backgroundImage/unitRoleBg.svg'
import background_image4 from '../../public/assets/backgroundImage/formEngineBg.svg'
import background_image5 from '../../public/assets/backgroundImage/applyModelBg.svg'
import background_image6 from '../../public/assets/backgroundImage/onlineUserMonitoringBg.svg'
import {fetchAsync} from '../util/globalFn';
const appList = {
  main1: [
    {
      title: '用户管理',
      iconUrl: icon1,
      pathname: '/userInfoManagement',
      backgroundUrl: background_image1,
    },
    {
      title: '流程设计器',
      iconUrl: icon2,
      pathname: '/workflowEngine',
      backgroundUrl: background_image2,
    },
  ],
  main2: [
    {
      title: '功能角色授权',
      iconUrl: icon3,
      pathname: '/unitRole',
      backgroundUrl: background_image3,
    },
  ],
  main3: [
    {
      title: '表单设计器',
      iconUrl: icon4,
      backgroundUrl: background_image4,
      pathname: '/formEngine',
      child: [
        {
          title: '业务应用建模',
          iconUrl: icon5,
          pathname: '/applyModel',
          backgroundUrl: background_image5,
        },
        {
          title: '在线用户监控',
          iconUrl: icon6,
          backgroundUrl: background_image6,
        },
      ],
    },
  ],
};

function renderList() {
  const { meunList } = useSelector(({ user }) => ({ ...user }));

  useEffect(() => {
    console.log('123321');
  }, []);
  // 得到呈现的屏幕宽高比
  const { width, height } = { width: 1200, height: 900 };
  const screenScale = () => {
    let ww = window.innerWidth / width;
    let wh = window.innerHeight / height;
    return ww < wh ? ww : wh;
  };
  const getScale = screenScale();
  const [scale, setScale] = useState(getScale);
  const setScreenScale = _.debounce(() => {
    setScale(screenScale());
  }, 100);

  useEffect(() => {
    window.addEventListener('resize', setScreenScale);
    return () => {
      window.removeEventListener('resize', setScreenScale);
    };
  }, []);

  let arrNew = []
  const loopMenuTree=(meunList)=>{
    for (let i=0;i<meunList.length;i++) {
      if(meunList[i].hasOwnProperty("children")){
        loopMenuTree(meunList[i].children)
      }
      arrNew.push(child(meunList[i]))
    }
  return arrNew;
  }

  function child(arr){
    arr.children = []
    return arr;
}
  const goToPath = (pathname) => {
    const newData=JSON.parse(JSON.stringify(meunList))
    const newList=loopMenuTree(newData)
    if (_.find(newList, { path: pathname })) {
      //先加在url中，后期在布局分支逻辑应该会变
      let menuObj = GETMENUOBJ();
      let menuInfo = menuObj?menuObj[pathname]:{};
      let menuId = menuInfo&&Object.keys(menuInfo).length?menuInfo['id']:'';
      //通过menuId获取maxDataruleCode
      fetchAsync(`sys/datarule/identity?menuId=${menuId}`,{method:'GET'}).then((data)=>{
        if(data.data.code==200){
          let tmpMaxDataruleCode = data.data.data.maxDataruleCode;
          historyPush({
            pathname,
            query:{
              menuId: menuId,
              maxDataruleCode:tmpMaxDataruleCode
            }
          });
        }else{
          message.error(data.data.msg);
        }
      })
    } else {
      message.error('当前功能未授权！');
    }
  };
  return (
    <div className={styles.home_container}>
      <div
        className={styles.container}
        style={{
          transform: `scale(${scale}) translate(-50%, -50%)`,
          WebkitTransform: `scale(${scale}) translate(-50%, -50%)`,
          width,
          // height
        }}
      >
        <div className={styles.main1}>
          {appList.main1.map((item, index) => {
            return (
              <p
                key={item + index}
                onClick={() => {
                  goToPath(item.pathname);
                }}
                style={{ backgroundImage: `url(${item.backgroundUrl})` }}
              >
                <img src={item.iconUrl}></img>
                <span>{item.title}</span>
              </p>
            );
          })}
        </div>
        <div
          className={styles.main2}
          onClick={() => {
            goToPath(appList.main2[0].pathname);
          }}
          style={{ backgroundImage: `url(${appList.main2[0].backgroundUrl})` }}
        >
          <img src={appList.main2[0].iconUrl}></img>
          <span>{appList.main2[0].title}</span>
        </div>
        <div className={styles.main3}>
          <div
            onClick={() => {
              goToPath(appList.main3[0].pathname);
            }}
            style={{ backgroundImage: `url(${appList.main3[0].backgroundUrl})` }}
          >
            <img src={appList.main3[0].iconUrl}></img>
            <span>{appList.main3[0].title}</span>
          </div>
          <div>
            {appList.main3[0].child.map((item, index) => {
              return (
                <p
                  key={item + index}
                  onClick={() => {
                    goToPath(item.pathname);
                  }}
                  style={{ backgroundImage: `url(${item.backgroundUrl})` }}
                >
                  <img src={item.iconUrl}></img>
                  <span>{item.title}</span>
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default renderList;
