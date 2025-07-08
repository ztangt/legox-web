import { message } from 'antd'
var clickX = new Array()
var clickY = new Array()
var act = new Array()
var socket
var canvas //画布对象
var c
var host = 'ws://127.0.0.1:29999/' //socket 地址

// 初始化设备
export function initHWDevice(onOk) {
  canvas = document.getElementById('ppCanvas') //画布对象
  c = canvas.getContext('2d')
  socket = new WebSocket(host) //连接socket
  socket.onopen = function () {
    //socket连接时 清空canvas画面
    clearCanvas()
    socket.send('init')
  }
  //接收消息
  socket.onmessage = function (msg) {
    if (typeof msg.data == 'string') {
      var str = msg.data
      var obj = str && JSON.parse(str)
      if (obj.device == 0) {
        message.error(
          '未检测到汉王电子签名设备请更换USB孔接入或者重新拔插连接线 !'
        )
        return
      }
      if (obj.flag == 1) {
        //发送"init"  判断设备是否可用  可用  返回值:1   不可用  返回值:0
        openHWDevice() //初始化成功打开设备
      } else if (obj.flag == 2) {
        //开始签字过程，开始签字返回值:1     设备出错返回值:0   签字过程还没有结束返回值:3
      } else if (obj.flag == 3) {
        //获取坐标点  point_x x坐标   point_y y坐标   point_m 判断画线的坐标
        //point_m   0  笔画开始   1  画线过程    2  笔迹结束
        addClick(obj.point_x, obj.point_y, obj.point_m)
        draw()
      } else if (obj.flag == 4) {
        //获取笔迹的base64   发送 "getSign"
        document.getElementById('signimg').src = obj.device
        //alert(obj.device);
      } else if (obj.flag == 5) {
        //alert(obj.device);//点击确定按钮 or 发送了"closeSign"   返回值 1
        onOk()
      } else if (obj.flag == 6) {
        //alert(obj.device);  //点击重签按钮 or 发送了"clearSign"   返回值 1
        clearCanvas()
      }
    } else {
      message.error('非文本消息')
    }
  }
  socket.onclose = function (msg) {
    // message.error('socket已关闭!')
  }
}
//打开设备
export function openHWDevice() {
  /*
    参数说明
    signid:页面接收签字图片数据的img元素id名称
    corp：公司名称
    pen_w:笔迹粗细设置
    pic_w：签字窗口宽
    pic_h：签字窗口高
    imageType:生成签名图片类型
    message：拼接全部参数传给chrome插件，注：分为可传不带签字图片参数也可传带签字图片参数两种方式
  */
  var signid = 'signimg'
  var corp = 'hanwang technology'
  var pen_w = '1' //笔宽值自定义设置，取值范围：1-4，取值类型：整数
  /***********************/
  //OrgX:签名窗口弹出时显示在屏幕位置的X坐标值。
  //OrgY:签名窗口弹出时显示在屏幕位置的Y坐标值。
  //OrgX与OrgY不设置时，签名窗口弹出时，默认显示在屏幕正中间。
  /**********************/
  //var OrgX = "200";
  //var OrgY = "150";
  var pic_w = '1000'
  var pic_h = '600'
  var imageType = '2' //生成签名图片的类型 1->BMP(图片数据支持2MB以下), 2->JPG, 3->PNG, 4->GIF
  var signpic_w = '200' //返回签名图片宽
  var signpic_h = '100' //返回签名图片高
  var message =
    signid +
    ';' +
    corp +
    ';' +
    pen_w +
    ';' +
    pic_w +
    ';' +
    pic_h +
    ';' +
    imageType +
    ';' +
    signpic_w +
    ';' +
    signpic_h +
    ';' //最后一个分号后是base64签名数据，空代表第一次签。
  // clearCanvas();
  socket.send(message)
}
// 关闭设备
export function uninitHWDevice() {
  socket.send('closeSign')
  closeSocket()
}
//关闭socket连接
export function closeSocket() {
  socket.close()
  socket = null
}
//重置
export function clearHWInk() {
  clearCanvas() //清空画布和坐标信息
  socket.send('clearSign')
}
function clearCanvas() {
  //清空canvas画面
  c.fillStyle = '#FFF'
  c.fillRect(0, 0, 1000, 600)
  clickX.length = 0
  clickY.length = 0
  act.length = 0
}
/*
 *鼠标点记录
 * x  鼠标X 轴
 * y  鼠标Y 轴
 */
export function addClick(x, y, a) {
  //将数据点写入Array
  clickX.push(x)
  clickY.push(y)
  act.push(a)
}
/*
 *开始绘画
 */
export function draw() {
  console.log('c', c, clickX, act)

  //签字过程
  c.strokeStyle = '#000000' //设置填充路径的颜色
  //当两条线条交汇时，创建圆形边角：
  c.lineJoin = 'round'
  c.lineWidth = 5
  for (var i = 0, l = clickX.length; i < l; i++) {
    c.beginPath() //开始路径绘制
    if (act[i] == 1) {
      c.moveTo(clickX[i - 1], clickY[i - 1])
    } else if (act[i] == 0) {
      //console.log("000000 \n");
      c.moveTo(clickX[i] - 1, clickY[i] - 1) //新的点。为了不要和lineTo相等，所以减了一个像素。
    }
    c.lineTo(clickX[i], clickY[i])
    c.closePath() //结束路径绘制
    c.stroke() //对路径进行填充
  }
}
