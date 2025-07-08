import { message } from 'antd'
var windowWidth = window.outerWidth
var windowHeight = window.outerHeight
//模板页的初始坐标  X坐标值：length_x ;  Y坐标值：length_y。
var template_x = windowWidth - $(parent.parent.window).width()
var template_y = windowHeight - $(parent.parent.window).height()

//当前窗口的高度和宽度
var currWIndowWidth = 500
var currWindowHeight = 300

//签字区域初始化坐标   x坐标值，y坐标值
var signArea_x =
  template_x + ($(parent.parent.window).width() - currWIndowWidth) / 2
var signArea_y =
  template_y + ($(parent.parent.window).height() - currWindowHeight) / 2

//20211202--注意：汉王手写板的坐标值必须为整数。
signArea_x = signArea_x.toFixed(0)
signArea_y = signArea_y.toFixed(0)

export function initHWQLDevice(onOk) {
  // window.open("http://10.8.12.154:1111/hanvon/ApiDemo.html", "_blank", "width=800, height=600");
  $.ajax({
    type: 'get',
    url: 'http://127.0.0.1:29999/HWPenSign/HWInitialize',
    data: {
      // "nLogo": "ǩ��",
      // "nPenwidth": "3",
      // "nOrgX": "100",
      // "nOrgY": "200",
      // "width": "500",
      // "height": "300",
      // "nImageType": "3",
      // "nImageWidth": "500",
      // "nImageHeight": "300"
      nLogo: '签字', //不知道哪个能好使，先放6.9的配置试试吧，上面是demo文档的配置
      nPenwidth: '3',
      nOrgX: signArea_x,
      nOrgY: signArea_y,
      width: currWIndowWidth,
      height: currWindowHeight,
      nImageType: '3',
      nImageWidth: '500',
      nImageHeight: '300',
    },
    dataType: 'jsonp',
    success: function (data) {
      console.log(data)
      if (data.msgID == 0) {
        intval = setInterval(getSign(onOk), 1000)
      } else {
        message.error(data.message)
      }
    },
    error: function () {
      message.error(
        '未检测到汉王电子签名设备请更换USB孔接入或者重新拔插连接线 !'
      )
    },
  })
  // intval = setInterval(getCign, 1000);
}
export function getCign(){
  let cign = localStorage.getItem('cign');
  if(cign){
    alert(cign);
    clearInterval(intval);
  }
}
export function getSign(onOk) {
  
  $.ajax({
    type: 'get',
    url: 'http://127.0.0.1:29999/HWPenSign/HWGetSign',
    data: {},
    dataType: 'jsonp',
    success: function (data) {
      console.log(data)
      if (data.msgID == 0) {
        //确定
        onOk()
        clearInterval(intval)
        // document.getElementById("signimg").src = data.message;
      } else if (data.msgID == 2) {
        //取消
        clearHWQInk()
        clearInterval(intval)
        // alert(data.message);
      }
    },
    error: function () {
      message.error('sign error \n')
    },
  })
}

export function uninitHWQLDevice() {
  $.ajax({
    type: 'get',
    url: 'http://127.0.0.1:29999/HWPenSign/HWFinalize',
    dataType: 'jsonp',
    success: function (data) {
      if (data.msgID == 0) {
        clearInterval(intval)
      } else {
        message.error(data.message)
      }
    },
    error: function () {},
  })
}

export function clearHWQLInk() {
  $.ajax({
    type: 'get',
    url: 'http://127.0.0.1:29999/HWPenSign/HWClearPenSign',
    dataType: 'jsonp',
    success: function (data) {
      // alert(data.message);
    },
    error: function () {},
  })
}
