import { message } from 'antd'
import $ from 'jquery'
// API Url
var apiUrl = 'http://localhost:8089/PPSignSDK/'

// initialize device web api
var initUrl = apiUrl + 'InitialDevice?id=2&width=580&height=380'
var initL500Url = apiUrl + 'InitialDevice?id=5&width=580&height=380'
var initLC700Url = apiUrl + 'InitialDevice?id=3&width=580&height=380'
var penwidthUrl = apiUrl + 'SetPenWidth?Width='

// uninitialize device web api
var uninitUrl = apiUrl + 'UninitialDevice?id=2'
var uninitL500Url = apiUrl + 'UninitialDevice?id=5'
var uninitLC700Url = apiUrl + 'UninitialDevice?id=3'

// get ink web api
var getInkUrl = apiUrl + 'GetInks'
// clear ink api
var clrInkUrl = apiUrl + 'Clear'
// GetDeviceConfirmOrCancelKeyStatus
var confirmStatusUrl = apiUrl + 'GetDeviceConfirmOrCancelKeyStatus'
// get save drawing api
var savedrawUrl = apiUrl + 'SaveDrawingImage?'
var canvas
var context
var isPolling = false
var LastSignatureBase64Data
var isL500Connected = false
var isLC700Connected = false
//初始化设备
export function initMTDevice(onOk) {
  canvas = document.getElementById('ppCanvas')
  if (canvas.getContext) {
    context = canvas.getContext('2d')
  }
  $.ajax({
    url: initUrl,
    type: 'GET',
    cache: false,
  })
    .done(function (response) {
      if (response === true) {
        isPolling = true
        pwChange()
        getInk()
        getStatus(onOk)

        $('.init').removeAttr('disabled')
        $('#initBtn').attr('disabled', 'disabled')
      } else {
        initL500Device(onOk)
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      //        alert('Connection fail(' + jqXHR.status + ')!');
      message.error(
        '未检测到[蒙恬电子签名板驱动程序],请开启修复工具,进行修复 !'
      )
    })
}

export function initL500Device(onOk) {
  $.ajax({
    url: initL500Url,
    type: 'GET',
    cache: false,
  })
    .done(function (response) {
      if (response === true) {
        isPolling = true
        isL500Connected = true
        pwChange()
        getInk()
        getStatus(onOk)
        $('.init').removeAttr('disabled')
        $('#initBtn').attr('disabled', 'disabled')
      } else {
        initLC700Device(onOk)
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      //        alert('Connection fail(' + jqXHR.status + ')!');
      message.error(
        '未检测到[蒙恬电子签名板驱动程序],请开启修复工具,进行修复 !'
      )
    })
}

export function initLC700Device(onOk) {
  debugger
  $.ajax({
    url: initLC700Url,
    type: 'GET',
    cache: false,
  })
    .done(function (response) {
      if (response === true) {
        isPolling = true
        isLC700Connected = true
        pwChange()
        getInk()
        getStatus(onOK)

        $('.init').removeAttr('disabled')
        $('#initBtn').attr('disabled', 'disabled')
      } else {
        message.error(
          '未检测到蒙恬电子签名设备请更换USB孔接入或者重新拔插连接线 !'
        )
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      //        alert('Connection fail(' + jqXHR.status + ')!');
      message.error(
        '未检测到[蒙恬电子签名板驱动程序],请开启修复工具,进行修复 !'
      )
    })
}

// 关闭设备
export function uninitMTDevice() {
  isPolling = false
  var uninitMTDeviceUrl = uninitUrl

  if (isL500Connected === true) {
    uninitMTDeviceUrl = uninitL500Url
  } else if (isLC700Connected === true) {
    uninitMTDeviceUrl = uninitLC700Url
  }

  $.ajax({
    url: uninitMTDeviceUrl,
    type: 'GET',
    cache: false,
  }).done(function (response) {
    if (response === true) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      $('.init').attr('disabled', 'disabled')
      $('#initBtn').removeAttr('disabled')
    }
  })

  isL500Connected = false
  isLC700Connected = false
}
function getStatus(onOk) {
  // 用polling的方式向self-host發送request取得簽名板按鈕status
  ;(function poll() {
    var timeId = setTimeout(function () {
      clearTimeout(timeId)

      // 取得狀態
      if (isPolling) {
        $.ajax({
          url: confirmStatusUrl,
          type: 'GET',
          cache: false,
        })
          .done(function (result) {
            if (result == '1') {
              //确定
              onOk()
              context.clearRect(0, 0, canvas.width, canvas.height)
              // saveDrawing()
            } else if (result == '0') {
              //取消
              clearMTInk()
            }
          })
          .fail(function () {
            console.log('Fail to get confirmed status!')
          })
          .always(function () {
            if (isPolling) {
              poll()
            } else {
            }
          })
      }
    }, 500)
  })()
}

export function getInk() {
  // 用polling的方式向self-host發送request取得簽名板畫面(base64格式)
  ;(function poll() {
    var timeId = setTimeout(function () {
      clearTimeout(timeId)

      if (isPolling) {
        $.ajax({
          url: getInkUrl,
          type: 'GET',
          cache: false,
        })
          .done(function (data) {
            var dataInfos = JSON.parse(data)

            dataInfos.forEach(function (value) {
              if (value.EventType === 0) {
                drawImage(value.Image)
                LastSignatureBase64Data = value.Image
              }
            })
          })
          .always(function () {
            if (isPolling) {
              poll()
            } else {
            }
          })
      }
    }, 50)
  })()
}

export function drawImage(base64) {
  var dataUrl = 'data:image/png;base64,'
  dataUrl = dataUrl + base64
  // 在image中載入圖檔，再畫到canvas呈現
  var img = new Image()
  img.src = dataUrl
  img.addEventListener(
    'load',
    function () {
      context.drawImage(this, 0, 0, canvas.width, canvas.height)
    },
    false
  )
}
export function pwChange() {
  debugger
  // send penwidthUrl + pwVal to set pen width...
  $.ajax({
    url: penwidthUrl + 1,
    type: 'GET',
    cache: false,
  })
}
//重置签名
export function clearMTInk() {
  $.ajax({
    url: clrInkUrl,
    type: 'GET',
    cache: false,
    success: function success() {
      context.clearRect(0, 0, canvas.width, canvas.height)
    },
  })
}
