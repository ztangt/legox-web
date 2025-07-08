// socket功能 废弃
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export function connectionSocket() {
  let socket = new SockJS('http://'+config.webSocketUrl+'/bullet');//连接SockJS的endpoint名称为"bullet"
  console.log('socket连接地址：'+'http://'+config.webSocketUrl+'/bullet');
  // 获取STOMP子协议的客户端对象
  let stompClient = Stomp.over(socket);
  // 定义客户端的认证信息,按需求配置
  let headers = {
    Authorization: ''
  };

  // 拦截输出的一大堆垃圾信息
  stompClient.debug = function (str) {
  };
  // 向服务器发起websocket连接
  stompClient.connect(headers,() => {
    stompClient.subscribe('/user/'+store.getters.userRegionCode+'/xx', (response) => { // 订阅服务端提供的某个topic
      if (response.body) {
        const repObj = JSON.parse(response.body);
         if (repObj.data.webSocketType == 'a') { 
          if (repObj.status == 200) {
            //TODO
          }
        }
        else if (repObj.data.webSocketType == 'b') { 
          if (repObj.status == 200) {
            //TODO
          }
        }
      }
    });
  }, (err) => {
    // 连接发生错误时的处理函数
    console.log('失败')
  });
}