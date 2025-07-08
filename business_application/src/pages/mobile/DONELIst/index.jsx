import { useEffect, useState, useMemo } from 'react';
import { history, MicroAppWithMemoHistory, connect } from 'umi';
import { useSetState } from 'ahooks';
import * as dd from 'dingtalk-jsapi';
import WorkList from '../../../componments/workList';
export default function IndexPage({ location }) {
  useEffect(() => {
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.setTitle({
          title: '已办事项',
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
          },
          onFail : function(err) {}
         });
      });
    }
  }, []);
  return <WorkList type={'DONE'} limit={6} />;
}
