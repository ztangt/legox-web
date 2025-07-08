import styles from './index.less';
import IconFont from '../../Icon_manage';
import { connect, history } from 'umi';
import { useEffect, useState, useMemo } from 'react';
import * as dd from 'dingtalk-jsapi';
import { Badge } from 'antd'
import qiehuan_img from '../../../public/assets/qiehuan.png'
import {
  FloatingBubble
} from 'antd-mobile/es';
function Index({mobile, dispatch}) {
  useEffect(() => {
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.setTitle({
          title: '工作台',
          // onSuccess: function (res) {
          //   // 调用成功时回调
          //   console.log(res);
          // },
          // onFail: function (err) {
          //   // 调用失败时回调
          //   console.log(err);
          // },
        });
        dd.biz.navigation.setLeft({
          control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
          text: '',//控制显示文本，空字符串表示显示默认文本
          onSuccess: (result) => {
            dd.closePage({
              success: () => {},
              fail: () => {},
              complete: () => {},
            });
          },
          onFail: function (err) { }
        });
        // dd.biz.navigation.setMenu({
        //   items : [
        //       {
        //           "id":"1",//字符串
        //           "iconId":"group",//字符串，图标命名
        //           "text":"切换身份",
        //           "url": qiehuan_img,
        //       }
        //   ],
        //   onSuccess: function(data) {
        //     history.push({
        //       pathname: `/mobile/changeIdentity`,
        //     });
        //   },
        //   onFail: function(err) {
        //   }
        // });
      });
    }
  }, []);
  function onBack(){
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.close({
          success: () => {},
          fail: () => {},
          complete: () => {},
        });
      });
    }
  }
  useEffect(()=>{
    dispatch({
      type: 'mobile/getTodoWork',
      payload: {
        start: 1,
        limit: 10
      }
    })
  },[])
  function onChoiceUser(){
    history.push({
      pathname: `/mobile/changeIdentity`,
    });
  }
  const list = [
    { icon: 'icon-waitMatter', name: '待办事项', type: 'TODO' },
    { icon: 'icon-sendWork', name: '已发事项', type: 'SEND' },
    { icon: 'icon-doneWork', name: '已办事项', type: 'DONE' },
    // { icon: 'icon-doneWork', name: '传阅事项', type: 'CIRCULATE' },
    // { icon: 'icon-doneWork', name: '跟踪事项', type: 'TRACK' },
    // { icon: 'icon-doneWork', name: '委托事项', type: 'TRUST' },
    // { icon: 'icon-doneWork', name: '受委托事项', type: 'BE_TRUST' },
    // { icon: 'icon-doneWork', name: '所有事项', type: 'ALL' },
  ];
  return (
    <div className={styles.container}>
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
      <div className={styles.list}>
        <h1 className={styles.title}>工作事项 <img src={qiehuan_img} className={styles.bt_choice} onClick={onChoiceUser.bind(this)}/></h1>
        {list?.map((item, index) => {
          return (
            <div
              className={styles.list_item}
              key={index}
              onClick={() => {
                history.push({
                  pathname: `/mobile/${item.type}List`,
                });
              }}
            >
              <IconFont type={item.icon} className={styles.left_icon} />
              {item.name}
              {item.type=='TODO'&&<Badge count={mobile?.todoReturnCount}><a className={styles.list_item_count}></a></Badge>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default connect(({ mobile }) => {
  return { mobile };
})(Index);