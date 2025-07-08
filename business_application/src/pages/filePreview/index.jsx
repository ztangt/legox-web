import jsPreviewDocx from "@js-preview/docx";
import '@js-preview/docx/lib/index.css';
import {useState,useEffect} from 'react';
import {history} from 'umi';
import {getOldUrlParameters} from '../../util/util';
import * as dd from 'dingtalk-jsapi';
function Index(){
  const query = getOldUrlParameters(window.location.href);
  console.log('query==',query);
  //有特殊字符的时候所有这个时候需要将名称转义
  useEffect(() => {
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.setTitle({
          title: query?.fileName,
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
            dd.biz.navigation.goBack({
              onSuccess : function(result) {
                  /*result结构
                  {}
                  */
              },
              onFail : function(err) {}
          })
          },
          onFail: function (err) { }
        });
      });
    }
  }, []);
  useEffect(()=>{
    if(query.src){
      console.log('query.src==',query.src);
      let srcArray = query.src.split('/');
      srcArray[srcArray.length-1] = encodeURIComponent(srcArray[srcArray.length-1]);
      let src = srcArray.join('/');
      console.log('src====',src);
      //初始化时指明要挂载的父元素Dom节点
      const myDocxPreviewer = jsPreviewDocx.init(document.getElementById('docx'));
      //传递要预览的文件地址即可
      myDocxPreviewer.preview(src).then(res=>{
          console.log('预览完成');
      }).catch(e=>{
          console.log('预览失败', e);
      })
    }
  },[])
  return (
    <div id="docx"></div>
  )
}
export default Index;