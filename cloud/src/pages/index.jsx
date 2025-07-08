import React, { useEffect, useState } from 'react';
import styles from './index.less';
import _ from 'lodash';
import { history } from 'umi';
import tenement_img from '../../public/assets/tenement.svg'
import organization_img from '../../public/assets/organization.svg'
import user_img from '../../public/assets/user.svg'
const appList = [
  { 
    title: '租户管理', 
    iconUrl: tenement_img,
    pathname: '/tenement' 
  },
  { 
    title: '组织中心', 
    iconUrl: organization_img,
    pathname: '/organization' 
  },
  { 
    title: '用户中心', 
    iconUrl: user_img,
    pathname: '/userMg' 
  },
]
function RenderIndex() {
  // 得到呈现的屏幕宽高比
  const { width, height } = { width: 1600, height: 900 };
  const screenScale = () => {
      let ww = window.innerWidth / width;
      let wh = window.innerHeight / height;
      return ww < wh ? ww : wh;
  }
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

  const goToPath = (pathname) => {
      if (pathname) {
          history.push(pathname);
      }
  }
  return (
        <div className={styles.container}
            style={{
                transform: `scale(${scale}) translate(-50%, -50%)`,
                WebkitTransform: `scale(${scale}) translate(-50%, -50%)`,
                width,
                // height
            }}
        >
            <ul className={styles.content}>
                {
                    appList.map((item, index) => {
                        return <li key={item + index} onClick={() => { goToPath(item.pathname) }}>
                            <img src={item.iconUrl}></img>
                            <span>
                                {item.title}
                            </span>
                        </li>
                    })
                }
            </ul>
        </div>
  )
}
export default RenderIndex;
