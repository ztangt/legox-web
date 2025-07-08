import FormShow from '../../../componments/formPreview/index';
import {connect,history,useModel} from 'umi';
import { useEffect, useState, useMemo } from 'react';
import * as dd from 'dingtalk-jsapi';
import { Spin } from 'antd'
import './index.less'
import { parse } from 'query-string';
import {
  FloatingBubble
} from 'antd-mobile/es';
function Index({loading}){
  useEffect(() => {
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.setTitle({
          title: '单据详情',
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
          onSuccess: (result) => {
            dd.biz.navigation.goBack({
              onSuccess: function (result) {
                /*result结构
                {}
                */
              },
              onFail: function (err) { }
            })
            //如果control为true，则onSuccess将在发生按钮点击事件被回调
          },
          onFail: function (err) { }
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
    window.webUni && window.webUni.postMessage({data: {title: parse(history.location.search)?.title}});

  }, []);
  function onBack(){
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.goBack({
          onSuccess: function (result) {
            /*result结构
            {}
            */
          },
          onFail: function (err) { }
        })
      });
    }else{
      window.history.back();
    }
  }
  function onDetail(url){
    history.push(url)
  }
  const query = parse(history.location.search);
  const formShowRender = useMemo(()=>{
    return <FormShow location={{query,pathname:"/formShow",search:history.location.search}} isUpdataAuth={true} onDetail={(url)=>{onDetail(url)}}/>
  },[])
    return(
    <div id="mobile_container">
     {<FloatingBubble
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
      {/* <Spin spinning={loading.global}> */}
          {formShowRender}
      {/* </Spin> */}
    </div>
    )

}
export default connect(
  ({ loading }) => {
    return {loading};
  },
)(Index);
