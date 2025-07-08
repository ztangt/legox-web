import { useEffect, useState, useMemo } from 'react';
import { history, MicroAppWithMemoHistory, connect } from 'umi';
import { useSetState } from 'ahooks';
import * as dd from 'dingtalk-jsapi';
import styles from './index.less'
import {
  FloatingBubble
} from 'antd-mobile/es';
function IndexPage({ dispatch, changeIdentity }) {
  const {identitys,identityId} = changeIdentity
  useEffect(() => {
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.setTitle({
          title: '身份切换',
          onSuccess: function (res) {
            // 调用成功时回调
            console.log(res);
          },
          onFail: function (err) {
            // 调用失败时回调
            console.log(err);
          },
        });
        dd.biz.navigation.setLeft({
          control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
          text: '',//控制显示文本，空字符串表示显示默认文本
          onSuccess : (result)=> {

            history.push({
              pathname: `/mobile`,
            });
              //如果control为true，则onSuccess将在发生按钮点击事件被回调
          },
          onFail : function(err) {}
        });
        dd.biz.navigation.setRight({
          show: false,//控制按钮显示， true 显示， false 隐藏， 默认true
          control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
          text: '取消',//控制显示文本，空字符串表示显示默认文本
          onSuccess : function(result) {
            history.push({
              pathname: `/mobile`,
            });
          },
          onFail : function(err) {}
         });
      });
    }
  }, []);
  useEffect(()=>{
    dispatch({
      type: 'changeIdentity/getUserDentityList',
      payload:{}
    })
  },[])
  function onBack(){
    history.push({
      pathname: `/mobile`,
    });
  }
  function onChange(identityId){
    localStorage.setItem('identityId', identityId);
    // dispatch({
    //   type: 'changeIdentity/updateStates',
    //   payload:{
    //     identityId: identityId,
    //   }
    // })
    dispatch({
      type: 'user/login',
      payload: {
        clientType: 'PC',
        fromState: 'FRONT',
        toState: 'FRONT',
        grantType: 'refresh_token',
        refreshToken: window.localStorage.getItem('refreshToken'),
        identityId: identityId,
      },
      callback:()=>{
        // dispatch({
        //   type: 'changeIdentity/getUserDentityList',
        //   payload:{}
        // })
        history.push({
          pathname: `/mobile`,
        });
      },
      isChangeIdentityMobile: true,
      // isChangeIdentity: true,
    });
  }
  function renderStu(item){
    if (item.isLeavePost == 1) {
      return (
        <div className={styles.post_stu} >
          <a style={{background: '#999A99'}}>离</a>
        </div>
      );
    } else {
      if (item.isMainPost == 1) {
        return (
          <div  className={styles.post_stu}>
            <a style={{background: '#EA9743'}}>主</a>
          </div>
        );
      } else if (item.isMainPost == 0) {
        return (
          <div className={styles.post_stu}>
            <a style={{background: '#11B27B'}}>兼</a>
          </div>
        );
      }
    }
  }
  return <div className={styles.container}>
          {dd.env.platform !== 'notInDingTalk'&&<FloatingBubble
            magnetic='x'
            style={{
              '--background':'var(--ant-primary-color)',
              '--border-radius': '3.57rem 0 0 3.57rem',
              '--size': '2.79rem',
              '--initial-position-right': '0rem',
              '--initial-position-top': '0rem',
              '--height-size': '1.75rem',
            }}
            onClick={onBack}
          >
            返回
          </FloatingBubble>}
          {
            identitys?.map((item,key)=><div className={styles.user_item} key={item.identityId} onClick={onChange.bind(this,item.identityId)}>
              {renderStu(item)}
              <p>
                <span className={styles.user_item_info}>单位:<b>{item.orgName}</b></span><br/>
                <span className={styles.user_item_info}>部门:<b>{item.deptName}</b></span><br/>
                <span className={styles.user_item_info}>岗位:<b>{item.postName}</b></span><br/>
                </p>
              {item.isCurrentIdentity==1&&<h1 className={styles.user_item_stu}>当前使用</h1>}
            </div>)
          }
      
    </div>
}
export default connect(({ changeIdentity, loading }) => {
  return { changeIdentity, loading };
})(IndexPage);
