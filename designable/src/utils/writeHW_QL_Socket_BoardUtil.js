import { message } from 'antd'
var sign = {
  isConnectWS: false,
  // 主通道，用于开始签名、结束签名等
  websocket: null,
  wsUrl: 'ws://127.0.0.1:29999/',
  //获取操作系统类型
  getOSParams: {
    HWPenSign: 'HWGetOS',
  },
  //获取手写设备的连接状态
  deviceStatusParams: {
    HWPenSign: 'HWGetDeviceStatus',
  },
  // 打开设备,开始签名
  startSignParams: {
    HWPenSign: 'HWInitialize',
    key: '73D4CB5D89F333E96F7AB5E7720336B6',
    nOrgX: 300,
    nOrgY: 300,
    nWidth: 500,
    nHeight: 300,
    nImageWidth: -1,
    nImageHeight: -1,
    nFingerCap: 0,
    nConfirmTimeout: 20,
  },
  //关闭设备,签名结束
  endSignParams: {
    HWPenSign: 'HWFinalize',
  },
  connectCallback: null, //链接回调
  getOSCallback: null, //获取操作系统类型
  getDeviceStatusCallback: null, //获取设备状态
  startSignCallback: null, //打开设备回调
  endSignCallback: null,
  signConfirmCallback: null, //确认签字，关闭设备
  reSetSignParam: function () {
    sign.startSignParams.nOrgX = -1
    sign.startSignParams.nOrgY = -1
    sign.startSignParams.nWidth = 500
    sign.startSignParams.nHeight = 300
    sign.startSignParams.nImageWidth = -1
    sign.startSignParams.nImageHeight = -1
    sign.startSignParams.nConfirmTimeout = 30
    sign.startSignParams.nFingerCap = 0
  },
  logMessage: function (message) {
    if (typeof window.onHandleMessage !== 'undefined')
      window.onHandleMessage(message)
    else console.log(message)
  },
  // 连接websocket
  connectWebSocket: function (callback) {
    sign.connectCallback = callback
    if ('WebSocket' in window) {
      sign.websocket = new WebSocket(sign.wsUrl)
    } else if ('MozWebSocket' in window) {
      sign.websocket = new MozWebSocket(sign.wsUrl)
    } else {
      message.error('浏览器不支持WebSocket')
      // window.alert("浏览器不支持WebSocket");
      return
    }

    sign.websocket.binaryType = 'arraybuffer'
    sign.websocket.onopen = function () {
      console.log('链接签名服务成功，URL: ', sign.wsUrl)
      if (sign.websocket.readyState == 1) {
        sign.connectCallback(true)
      }
    }
    sign.websocket.onmessage = function (evt) {
      sign.wsMessage(evt)
    }
    sign.websocket.onclose = function (evt) {
      if (sign.websocket.readyState == 3) {
        console.log('链接关闭', evt)
        sign.connectCallback(false)
      }
    }
    sign.websocket.onerror = function (evt) {
      if (sign.websocket.readyState == 3) {
        console.log('链接报错', evt)
        sign.connectCallback(false)
      }
    }
  },
  // 向socket通道发送信息
  sendMsg: function (param) {
    console.log('发送信息', param)
    if (sign.websocket && param) {
      sign.websocket.send(JSON.stringify(param))
    }
  },
  // websocket通道返回的信息
  wsMessage: function (res) {
    console.log('server response:', res)
    var res = JSON.parse(res.data)
    var cmd = res.HWPenSign
    switch (cmd) {
      case 'HWGetOS':
        sign.getOSCallback(res)
        break
      case 'HWGetDeviceStatus':
        sign.getDeviceStatusCallback(res)
        break
      case 'HWInitialize':
        sign.startSignCallback(res)
        break
      case 'HWGetSign':
        if (sign.signConfirmCallback != null) sign.signConfirmCallback(res)
        break
      case 'HWFinalize':
        sign.endSignCallback(res)
        break
    }
  },
  // 断开检测服务器连接
  disconnectWebSocket: function () {
    if (sign.websocket) {
      if (sign.websocket.readyState == 1) sign.websocket.close()
      sign.websocket = null
      return true
    } else return false
  },
  // 服务连接出错
  onSocketError: function (evt) {
    sign.logMessage('连接检测服务有问题...')
  },
  //获取操作系统类型
  getOS: function (callback) {
    sign.getOSCallback = callback
    sign.sendMsg(sign.getOSParams)
  },
  // 获取设备状态
  getDeviceStatus: function (callback) {
    sign.getDeviceStatusCallback = callback
    sign.sendMsg(sign.deviceStatusParams)
  },
  // 打开设备
  startSign: function (
    callback,
    orgX,
    orgY,
    width,
    height,
    imgwidth,
    imgheight,
    fgrCap,
    timeout
  ) {
    sign.reSetSignParam()
    sign.startSignCallback = callback
    if (orgX > 0) sign.startSignParams.nOrgX = orgX
    if (orgY > 0) sign.startSignParams.nOrgY = orgY
    if (width > 0) sign.startSignParams.nWidth = width
    if (height > 0) sign.startSignParams.nHeight = height
    if (imgwidth > 0) sign.startSignParams.nImageWidth = imgwidth
    if (imgheight > 0) sign.startSignParams.nImageHeight = imgheight
    if (timeout > 0) sign.startSignParams.nConfirmTimeout = timeout
    // if (fgrCap >= 0) sign.startSignParams.nFingerCap = fgrCap
    sign.startSignParams.nFingerCap = 0 //宋康让改的
    sign.sendMsg(sign.startSignParams)
  },
  // 确认签名
  getSign: function (callback) {
    sign.signConfirmCallback = callback
  },
  endSign: function (callback) {
    sign.endSignCallback = callback
    sign.sendMsg(sign.endSignParams)
  },
}
var aspectRatio
var wndWidth = 600,
  wndHeight = 400,
  imgWidth = 250,
  imgHeight = 150
var isDeviceExist = false
var fingerCap = 1 //采集指纹模式，此参数只适用ESP370D, 其它型号不响应
export function onLoad(onOk) {
  sign.connectWebSocket(function (res) {
    if (res == true) {
      checkdevice(onOk)
      imgWidth = document.getElementById('signimg').clientWidth
      imgHeight = document.getElementById('signimg').clientHeight
    } else {
      message.error(
        '未检测到汉王电子签名设备请更换USB孔接入或者重新拔插连接线 !'
      )
    }
    // if(res == true){
    //     document.getElementById("checkdevice").removeAttribute("disabled");
    //     document.getElementById("checkos").removeAttribute("disabled");
    // }
    // else{
    //     document.getElementById("checkos").setAttribute("disabled",true);
    //     document.getElementById("checkdevice").setAttribute("disabled",true);
    //     document.getElementById("startsign").setAttribute("disabled",true);
    // }
  })
}
export function onUnload() {
  sign.disconnectWebSocket()
}

export function checkMode() {
  var len = document?.getElementsByName('finger')?.length
  for (var i = 0; i < len; i++) {
    if (document.getElementsByName('finger')[i].checked) {
      fingerCap = parseInt(document.getElementsByName('finger')[i].value)
      break
    }
  }
}
export function checkos() {
  sign.getOS(function (res) {
    if (res.msgID != 0) message.error('getOS error: ' + res.message)
    // alert("getOS error: " +res.message);
    else message.error(res.message)
    // alert(res.message);
  })
}
export function checkdevice(onOk) {
  sign.getDeviceStatus(function (res) {
    if (res.msgID != 0) message.error('getDeviceStatus error: ' + res.message)
    // alert("getDeviceStatus error: " +res.message);
    else {
      isDeviceExist = true
      var ratio = res.aspectRatio //获取签字板屏幕宽高比
      console.log('aspectRatio:' + ratio)
      var resStrs = ratio.split(':')
      aspectRatio = (resStrs[0] / resStrs[1]).toFixed(4)
      //设置程序签字窗口宽高，与签字板宽高比保持一致，防止笔迹失真
      var ratio = (wndWidth / wndHeight).toFixed(4)
      if (ratio > aspectRatio) wndWidth = Math.round(wndHeight * aspectRatio)
      else wndHeight = Math.round(wndWidth / aspectRatio)
      // document.getElementById("startsign").removeAttribute("disabled");
      startsign(onOk)
    }
  })
}
export function startsign(onOk) {
  checkMode()
  if (document?.getElementById('signimg')?.src)
    document.getElementById('signimg').src = ''
  if (isDeviceExist == false) checkdevice()
  else
    sign.startSign(
      function (res) {
        if (res.msgID == 0) {
          // document.getElementById("endsign").removeAttribute("disabled");
          getsign(onOk)
        } else message.error('startSign error: ' + res.message)
        // alert("startSign error: " +res.message);
      },
      400,
      350,
      wndWidth,
      wndHeight,
      imgWidth,
      imgHeight,
      fingerCap,
      30
    )
}
export function getsign(onOk) {
  sign.getSign(function (res) {
    if (res.msgID == 0) {
      document.getElementById('signimg').src = res.message
      onOk(res.message)
    } else message.error('getSign error: ' + res.message)
    // alert("getSign error: " +res.message);
  })
}

export function endsign() {
  sign.endSign(function (res) {
    if (res.msgID != 0) message.error('endSign error: ' + res.message)
    // alert("endSign error: " +res.message);
  })
}
