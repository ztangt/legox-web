import jsPreviewExcel from "@js-preview/excel";
import '@js-preview/excel/lib/index.css';
import {useState,useEffect} from 'react';
import {history} from 'umi';
import { parse } from 'query-string';
import * as dd from 'dingtalk-jsapi';
function Index(){
  const query = parse(history.location.search);
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
    //初始化时指明要挂载的父元素Dom节点
    const myDocxPreviewer = jsPreviewExcel.init(document.getElementById('excel'));
    //传递要预览的文件地址即可
    myDocxPreviewer.preview(query.src).then(res=>{
        console.log('预览完成');
    }).catch(e=>{
        console.log('预览失败', e);
    })
  },[])
  return (
    <div id="excel"></div>
  )
}
export default Index;