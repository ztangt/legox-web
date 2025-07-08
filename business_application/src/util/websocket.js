import SockJS from 'sockjs-client';
var dispatch;
let socket = '';

let tmpWsUrl = 'ws://10.10.8.154:8088/socket/ws';
let tmpSockUrl = 'http://10.10.8.154:8088/socket-sock/sock';
const wsUrl = window.localStorage.getItem('wsUrl') || tmpWsUrl;
const sockUrl = window.localStorage.getItem('sockUrl') || tmpSockUrl;
const identityId = window.localStorage.getItem('identityId');

let reconnectCount = 0;
let lockReconnect = false;
const MAX_RECONNECT_COUNT = 3;
const RECONNECT_TIME = 3000;

const getMessageList = () => {
  dispatch({
    type: 'user/getMessageList',
    payload: {
      searchWord: '',
      category: '',
      start: 1,
      limit: 10,
    },
  });
};

function sessionId() {
  return identityId;
}
// 创建链接
export function createSocket(v) {
  dispatch = v;
  let query = '';
  query = `?sessionId=${identityId}`;
  // 浏览器支持WebSocket
  if (typeof WebSocket == 'function') {
    socket = new WebSocket(wsUrl + query);
  } else {
    // 不支持WebSocket  用SockJS
    socket = new SockJS(sockUrl, '', sessionId());
  }
  socket.onopen = onopenWs;
  socket.onmessage = onmessageWs;
  socket.onerror = onerrorWs;
  socket.onclose = oncloseWs;
}

// 打开链接
export function onopenWs() {
  console.log('WS-打开链接');
  reconnectCount = 0;
  heart.reset().start();
}

// 失败重连
export function reconnect() {
  if (lockReconnect) return;
  lockReconnect = true;
  if (reconnectCount < MAX_RECONNECT_COUNT) {
    reconnectCount++;
    setTimeout(() => {
      lockReconnect = false;
      createSocket();
      console.log('WS-正在重新连接');
    }, RECONNECT_TIME);
    return;
  }
  console.log('WS-超过重新连接次数，放弃重新连接');
}

// 连接失败
export function onerrorWs() {
  reconnect();
}

// 接收数据
export function onmessageWs(e) {
  const messages = JSON.parse(e.data);
  console.log('WS-接收数据',messages);
  // msgCategory消息分类:MATTER事项;DAILY日常;IM即时;SYS系统;OTHER其他
  const msgCategoryArr = ['MATTER', 'DAILY', 'IM', 'SYS', 'OTHER'];
  if (msgCategoryArr.includes(messages.msgCategory)) {
    getMessageList();
  }
  // TODO
  heart.reset().start();
}

// 发送数据
export function sendWsMessage(data) {
  socket.send(data);
  // console.log('sendWsMessage:',data);
}

// 断开连接
export function oncloseWs(val) {
  if (val.wasClean || val === 1) {
    // 如果参数是1那么就是手动断开连接 不需要重新连接
    socket.close();
    console.log('WS-连接已断开', val.wasClean, val);
    clearTimeout(heart.timeoutObj);
  } else {
    // 参数不是1就是自动端开了连接 需要重新连接
    reconnect();
  }
}

// 心跳机制
const heart = {
  timeOut: 50000, // 心跳间隔50s
  timeoutObj: null,
  servertimeoutObj: null,
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function () {
    this.timeoutObj = setTimeout(() => {
      // TODO
      const pingData = { type: 'CONNECT', messageType: 'CONNECT' };
      // 发送消息，服务端返回信息，即表示连接良好，可以在socket的onmessage事件重置心跳机制函数
      sendWsMessage(JSON.stringify(pingData));
      // 定义一个延时器等待服务器响应，若超时，则关闭连接，重新请求server建立socket连接
      this.serverTimeoutObj = setTimeout(() => {
        socket.close();
        console.log('WS-断开了');
      }, this.timeOut);
    }, this.timeOut);
  },
};
