import React, {useEffect} from 'react';
import {connect} from 'dva';
import * as dd from 'dingtalk-jsapi';
import {Modal} from "antd";
import axios from 'axios';
import { env } from '../../../../project_config/env'
import { useSearchParams } from 'react-router-dom';

function Index({dispatch, user}) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Modal.success({
    //   title:'进去页面了'
    // })
    //将url参数转换成对象,带给小笋干的接口
    let paramData={}
    searchParams.forEach((value, key) => {
      paramData[key]=value
    });
    // Modal.success({
    //   title:'参数',
    //   content:JSON.stringify(paramData)
    // })
    // Modal.success({
    //   title:'路由',
    //   content:window.location.href
    // })


    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.runtime.permission.requestAuthCode({
          corpId: 'ding900920c64da3177335c2f4657eb6378f',
          // 第三方企业应用可以在微应用的首页URL中使用$CORPID$做为参数占位符，钉钉容器会将$CORPID$替换为当前访问用户的企业corpId。例如：https://www.dingtalk.com?corpId=$CORPID$。
          onSuccess: function (result) {
            // Modal.success({
            //   title:'钉钉认证成功'
            // })
            // Modal.success({
            //   title:`接口：${env}/cma-app/dinging/toMobileDingHome`
            // })
            let authCode = result.code //免登录授权码

            let postData = {
              t:Date.parse(new Date()) / 1000,
              authCode:authCode,
              port: '10086',//小笋干让改的
              registerCode: '1002',
              ...paramData
            }
            // Modal.success({
            //   title:'传给后端',
            //   content:JSON.stringify(postData)
            // })

            console.log(postData,'-->这是接口参数')
            axios({
              method: 'get',
              url:  `${env}/cma-app/dinging/toMobileDingHome`,
              params: postData,
            }).then(res=>{
              if(res.data.code==200){
                window.location.href = res.data.data
              }else {
                Modal.error({
                  title: res.data.msg||'请求错误',
                })
              }
            })
          },
          onFail: function (err) {
            Modal.info({
              title: 'authCode获取失败',
              content: JSON.stringify(err),
            })
          }
        })
      });
    }else {
      Modal.error({
        title:'钉钉环境错误'
      })
    }
  }, [])
  return (
    <div/>
  );
}

export default connect(({user}) => {
  return {user};
})(Index);
