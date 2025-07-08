import { Radio } from 'antd';
import { parse } from 'query-string';
import { useEffect, useState } from 'react';
import { history, useDispatch } from 'umi';
import styles from './index.less';

export default function Index({setState}) {
  const dispatch = useDispatch();
  const query = parse(history.location.search);
  const [currentSys, setCurrentSys] = useState(query.registerCode);
  const [registerList, setRegisterList] = useState([]);
  
  useEffect(() => {
    dispatch({
      type: 'user/getRegister',
      payload: {
        // start: 1,
        // limit: 100,
        // registerFlag: 'PLATFORM_BUSS',
      },
      callback: (data) => {
        setRegisterList(data.data.registers);
        if(query.registerCode){
          if(query.registerCode!=localStorage.getItem('registerCode')){
            onSysChnage(data.data.registers,{target:{value: query.registerCode}})
          }
          return
        }
        setCurrentSys(data.data.registers?.[0]?.registerCode);
      },
    });
  }, [query.registerCode]);
  function onSysChnage(registerList,e) {
    var register = _.find(registerList, { registerCode: e.target.value });
    if (register && register?.registerScope == 'IN') {
      dispatch({
        type: 'user/login',
        payload: {
          clientType: 'PC',
          fromState: 'PORTAL',
          toState: 'FRONT',
          grantType: 'refresh_token',
          refreshToken: window.localStorage.getItem('refreshToken'),
          registerCode: e.target.value,
          identityId: localStorage.getItem('identityId')
            ? localStorage.getItem('identityId')
            : '',
        },
        isChangeIdentity: true,
        targetUrl: `#/business_application?sys=${query.sys}&portalTitle=${query.portalTitle}&registerCode=${e.target.value}`,
        callback: (data) => {
          setCurrentSys(e.target.value);
          localStorage.setItem('registerCode',e.target.value)
          localStorage.setItem('registerId',register.id)
          localStorage.setItem('menuType','ALL')
          dispatch({//改变当前切换系统id，防止不调用菜单接口
            type: 'user/updateStates',
            payload: {
              registerId: register?.id,
            },
          })
        },
        dispatch,
        registerId: register?.id,
      });
    } else {
      //TODO registerScope: OTHERS  其他系统逻辑
      setCurrentSys(e.target.value);
    }
  }

  return (
    <div className={styles.header_container}>
      <b
        className={styles.index_name}
        onClick={() => {
          dispatch({
            type: 'user/login',
            payload: {
              clientType: 'PC',
              fromState: 'FRONT',
              toState: 'PORTAL',
              grantType: 'refresh_token',
              refreshToken: window.localStorage.getItem('refreshToken'),
              identityId: localStorage.getItem('identityId')
                ? localStorage.getItem('identityId')
                : '',
            },
            isChangeIdentity: true,
            targetUrl: `#/business_application/portal`,
            dispatch,
            isNotRefresh: true,
            callback: (data) => {
              setState({
                tabMenus: [{
                  key:'/',
                  title: '个人桌面',
                  href: '/'
                }],
                tabActivityKey: '/'
               })
              history.push('/portal');
            },
          });
        }}
      >
        首页
      </b>
      <i>{'>'}</i>
      <a className={styles.breade_name}>{query.portalTitle}</a>
      {history.location.pathname == '/business_application' && (
        <>
          <Radio.Group
            value={currentSys}
            buttonStyle="solid"
            onChange={onSysChnage.bind(this,registerList)}
          >
            {registerList?.map((item,index) => {
              var className = currentSys==registerList[index+1]?.registerCode?"checked-before":''
              return (
                <Radio.Button value={item.registerCode} key={item.registerCode} className={className}>
                  {item.registerName}
                </Radio.Button>
              );
            })}

          </Radio.Group>
          {/* <b
            className={styles.sys_btn}
            onClick={() => {
              window.open(`#/`, '_blank');
            }}
          >
            跳转至系统内部
          </b> */}
        </>
      )}
    </div>
  );
}
