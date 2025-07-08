import { useState, useEffect } from 'react';
import { history } from 'umi'
import { connect } from 'dva';
import styles from './index.less';
import { parse } from 'query-string';
import { DownOutlined } from '@ant-design/icons';

function Index({ dispatch, user }) {
  const { teantList } = user;
  const [isFoucus,setIsFoucus] = useState(false)
  const [value,setValue] = useState('')
  const query = parse(history.location.search)

  useEffect(()=>{
    // if(window.location.pathname.split('/')[1]){
    //   dispatch({
    //     type: 'user/getMobileTentant',
    //     payload: {
    //       tenantMark: window.location.pathname.split('/')[1],
    //     },
    //     callback:(data)=>{
    //       data?.tenantId&&onSelect({id: data.tenantId,tenantMark: window.location.pathname.split('/')[1]})
    //     }
    //   });
    //   return 

    // }
    const { userAccount, registerCode,target, tenantId, tenantUrl} = query
    if(tenantId){
      onSelect({id: tenantId,tenantUrl})
      return
    }

    if(userAccount){
      dispatch({
        type: 'user/getTenants',//获取租户列表
        payload: {
          userAccount,
          registerCode
        },
        callback:(data)=>{
          console.log(data,'???接口地址')
          if(data.length==1){
            data[0]?.id&&onSelect(data[0])
          }
        }
      });
    }
  },[])

  function onSelect(item){
    setValue(item?.tenantName)
    const { userAccount, registerCode, target,clientKey,timestamp,cert,passToken, identityId} = query
    function ssoFunc(){
      if(userAccount){
        dispatch({//登录当前租户
          type: 'user/login',
          payload: {
            tenantId: item?.id,
            userAccount,
            grantType:'sso',
            clientType: 'FRONT',
            registerCode,
            clientKey,
            timestamp,
            cert,
            passToken,
            identityId: identityId?identityId:localStorage.getItem('identityId')
            ? localStorage.getItem('identityId')
            : '',
          },
          tenantMark: item?.tenantUrl,
          // target,
          // target:window.location.href.split('target=')?.[1]?.split('&')?.[0],
          target:window.location.href.split('target=')?.[1],
        });
      }
    }
    // if(
    //   localStorage.getItem('userToken')&&//存在token
    //   localStorage.getItem('refreshToken')&&//存在refreshToken
    //   item?.tenantUrl==localStorage.getItem('tenantMark')&&//所选的租户标识与已有的一致
    //   localStorage.getItem('identityId')&&
    //   localStorage.getItem('identityId')!='undefined'//存在identityId
    // ){
    //   dispatch({//刷新token
    //     type: 'user/login',
    //     payload: {
    //       clientType: 'PC',
    //       fromState: 'FRONT',
    //       toState: 'FRONT',
    //       grantType: 'refresh_token',
    //       refreshToken: localStorage.getItem('refreshToken'),
    //       identityId: localStorage.getItem('identityId')
    //         ? localStorage.getItem('identityId')
    //         : '',
    //     },
    //     tenantMark: item?.tenantUrl,
    //     // target,
    //     // target:window.location.href.split('target=')?.[1]?.split('&')?.[0],
    //     target:window.location.href.split('target=')?.[1],
    //     callback:()=>{ssoFunc()}
    //   });
    //   return
    // }
    ssoFunc()
  }
  function onFocus(){
    setIsFoucus(!isFoucus)
  }
  return (
    <div className={styles.box_container}>
       <div className={!isFoucus?styles.container:styles.container_shadow}>
        <div className={styles.select_container} >
            <div className={styles.select_value_container} onClick={onFocus.bind(this)}>
              {!value&&<span className={styles.select_value_plac}>请选择租户</span>}
              {value&&<span className={styles.select_value}>{value}</span>}
              <DownOutlined className={styles.icon_down}/>
            </div>
            {
              isFoucus&&<ul className={styles.select_list}>
                {teantList?.length==0&&<li className={styles.li_plac}>暂无租户</li>}
                {
                  teantList?.length!=0&&teantList?.map((item,index)=><li onClick={onSelect.bind(this,item)} key={index}>{item?.tenantName}</li>)
                }
              </ul>
            }
        </div>
      </div>
    </div>

  );
}
export default connect(({ user }) => {
  return { user };
})(Index);
