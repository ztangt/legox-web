import React, { useState, useEffect } from 'react';
import { MicroAppWithMemoHistory } from 'umi';
import actions from "../../util/actions";

export default () => {

  useEffect(() => {
    // 注册⼀个观察者函数
    // ⼀旦修改actions的内容就会触发这个onGlobalStateChange监听函数
    actions.onGlobalStateChange((state, prevState) => {
      // state为变更后的状态，prevState为变更前的状态
      console.log('IM~~~主应⽤观察者，改变前的state为：', prevState)
      console.log('IM~~~主应⽤观察者，改变后的state为：', state)
    })
  }, [])
  
  return (
    <MicroAppWithMemoHistory name={'legox-impc'} url={'/'}/>
  );
};
